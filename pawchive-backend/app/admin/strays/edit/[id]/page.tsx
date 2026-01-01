// app/admin/strays/edit/[id]/page.tsx
import { createServerClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';

export default async function EditStrayPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createServerClient();

  console.log('Fetching stray with ID:', params.id); // Debug: log the ID

  const { data: stray, error } = await supabase
    .from('strays')
    .select('*')
    .eq('id', params.id)
    .single();

  if (error) {
    console.error('Supabase fetch error:', error);
    notFound();
  }

  if (!stray) {
    console.log('No stray found for ID:', params.id);
    notFound();
  }

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Stray: {stray.name}</h1>

      {/* Debug output - remove later */}
      <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
        {JSON.stringify(stray, null, 2)}
      </pre>

      {/* Form will go here later */}
      <p className="mt-6 text-green-600">Stray loaded successfully! Ready for edit form.</p>
    </div>
  );
}