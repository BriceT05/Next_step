import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  const token = request.cookies.get('admin_auth')?.value
  if (!token || token !== process.env.ADMIN_TOKEN) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const folder = (formData.get('folder') as string) || 'misc'

  if (!file) return NextResponse.json({ error: 'Aucun fichier' }, { status: 400 })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  )

  const ext = file.name.split('.').pop()
  const fileName = `${folder}/${Date.now()}.${ext}`

  const { error } = await supabase.storage
    .from('nextstep-media')
    .upload(fileName, file, { contentType: file.type })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const { data: { publicUrl } } = supabase.storage.from('nextstep-media').getPublicUrl(fileName)
  return NextResponse.json({ url: publicUrl })
}
