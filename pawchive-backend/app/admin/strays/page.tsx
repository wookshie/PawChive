import { createServerClient } from '@/lib/supabase';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import DeleteButton from '@/components/deleteButton';

export const dynamic = 'force-dynamic';

export default async function StraysAdminPage() {
  const supabase = await createServerClient();

  // Optional: uncomment when login is ready
  // const { data: { session } } = await supabase.auth.getSession();
  // if (!session) {
  //   redirect('/login');
  // }

  // Fetch all strays
  const { data: strays, error } = await supabase
    .from('strays')
    .select('id, name, breed, gender, status, location, age')
    .order('created_at', { ascending: false });

  if (error) {
    return <div className="p-8 text-red-600">Error loading strays: {error.message}</div>;
  }

  if (!strays?.length) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Strays Found Yet</h2>
        <p className="text-gray-600 mb-6">Start by adding your first campus stray!</p>
        <Link
          href="/admin/strays/new"
          className="inline-block px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition shadow-md"
        >
          + Add Your First Stray
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">Admin: All Strays</h1>
        <div className="space-x-4">
          <Link
            href="/admin/strays/new"
            className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition shadow-md"
          >
            + Add New Stray
          </Link>
          {/* <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Refresh List
          </button> */}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Breed</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {strays.map((stray) => (
              <tr key={stray.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{stray.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{stray.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stray.breed}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stray.gender}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      stray.status === 'Available' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {stray.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stray.location}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{stray.age}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-4">
                    {/* Edit Link */}
                    <Link
                      href={`/admin/strays/edit/${stray.id}`}
                      className="text-indigo-600 hover:text-indigo-900 font-medium"
                    >
                      Edit
                    </Link>

                    {/* Delete Button */}
                    <DeleteButton
                      id={stray.id}
                      name={stray.name}
                      action={deleteStrayAction}
                    />
                    {/* <form action={deleteStrayAction}>
                      <input type="hidden" name="id" value={stray.id} />
                      <button
                        type="submit"
                        className="text-red-600 hover:text-red-900 font-medium"
                        onClick={(e) => {
                          if (!confirm(`Are you sure you want to delete ${stray.name}? This action cannot be undone.`)) {
                            e.preventDefault();
                          }
                        }}
                      >
                        Delete
                      </button>
                    </form> */}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Server Action for Delete
export async function deleteStrayAction(formData: FormData) {
  'use server';

  const supabase = await createServerClient();
  const id = formData.get('id') as string;

  const { error } = await supabase.from('strays').delete().eq('id', id);

  if (error) {
    throw new Error(error.message);
  }

  // Revalidate the list page to reflect deletion
  revalidatePath('/admin/strays');

  // Redirect back to list
  // redirect('/admin/strays');
}