// app/admin/strays/delete/route.ts
import { createServerClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const id = formData.get('id') as string;

  const supabase = await createServerClient();

  const { error } = await supabase.from('strays').delete().eq('id', id);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  revalidatePath('/admin/strays');

  redirect('/admin/strays');
}