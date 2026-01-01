// app/admin/strays/edit/[id]/page.tsx
import { createServerClient } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import EditStrayForm from '@/components/editStrayForm';

export default async function EditStrayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createServerClient();

  console.log('Fetching stray with ID:', id);

  const { data: stray, error } = await supabase
    .from('strays')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Supabase fetch error:', error);
    notFound();
  }

  if (!stray) {
    console.log('No stray found for ID:', id);
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto p-8">
      {/* Back button */}
      <div className="mb-8">
        <Link
          href="/admin/strays"
          className="inline-flex items-center px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition shadow-sm border border-gray-300"
        >
          ← Back to All Strays
        </Link>
      </div>

      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900">Edit Stray: {stray.name}</h1>
        <p className="mt-2 text-gray-600">
          Update the details below and save changes.
        </p>
      </div>

      {/* Edit Form */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
        <EditStrayForm stray={stray} />
      </div>

      {/* Optional debug (remove in production) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-8">
          <details className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <summary className="font-medium cursor-pointer">Debug: Raw Stray Data</summary>
            <pre className="mt-4 overflow-auto text-sm bg-white p-4 rounded border border-gray-200">
              {JSON.stringify(stray, null, 2)}
            </pre>
          </details>
        </div>
      )}
    </div>
  );
}