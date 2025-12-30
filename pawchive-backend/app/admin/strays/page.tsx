import { createClient } from '@/lib/supabase';

export default async function StraysAdminPage() {
  const supabase = await createClient();

  const { data: strays, error } = await supabase
    .from('strays')
    .select('id, name, breed, status, location')
    .order('created_at', { ascending: false });

  if (error) {
    return <div>Error loading strays: {error.message}</div>;
  }

  if (!strays?.length) {
    return <div>No strays found in database yet.</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Admin: All Strays</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Breed</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-700">Location</th>
            </tr>
          </thead>
          <tbody>
            {strays.map((stray) => (
              <tr key={stray.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4 text-sm text-gray-900">{stray.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{stray.name}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{stray.breed}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      stray.status === 'Available'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {stray.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{stray.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}