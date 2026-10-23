'use client'
import { useCallback, useEffect, useState } from 'react'
import { PROJECTS, type ProjectData } from '@/app/data/projects'
import { supabase } from '@/lib/supabase'
import { type ProjectRow, rowToProject } from '@/lib/projects'

const query = () => supabase.from('projects').select('*').order('sort_order', { ascending: true })

/**
 * Projets vus depuis l'admin.
 * `saved` = false tant que la table est vide : on affiche alors les six projets par défaut,
 * qui seront recopiés en base à la première modification.
 */
export function useAdminProjects() {
  const [projects, setProjects] = useState<ProjectData[] | null>(null)
  const [saved, setSaved] = useState(false)

  const apply = useCallback(({ data, error }: { data: unknown[] | null; error: unknown }) => {
    const rows = (data ?? []) as ProjectRow[]
    const empty = Boolean(error) || rows.length === 0
    setProjects(empty ? PROJECTS : rows.map(rowToProject))
    setSaved(!empty)
  }, [])

  useEffect(() => {
    query().then(apply)
  }, [apply])

  const reload = useCallback(async () => {
    apply(await query())
  }, [apply])

  return { projects, saved, reload }
}
