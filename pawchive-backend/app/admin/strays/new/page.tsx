import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase';
import Link from 'next/link';

export default async function NewStrayPage() {
  const supabase = await createServerClient();

  // Optional: Uncomment when login is ready
  // const { data: { session } } = await supabase.auth.getSession();
  // if (!session) {
  //   redirect('/login');
  // }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <div className="mb-4">
        <Link
          href="/admin/strays"
          className="text-blue-600 hover:text-blue-800 underline"
        >
          ← Back to Strays List
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-8">Add New Stray Pet</h1>

      {/* Error Display (will be shown if action fails) */}
      <div id="error-message" className="hidden mb-4 p-4 bg-red-100 text-red-700 rounded"></div>

      <form action={createStrayAction} className="space-y-6 bg-white p-8 rounded-lg shadow">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            name="name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Breed */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
          <input
            type="text"
            name="breed"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            name="gender"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select...</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age (e.g. ~2 years)</label>
          <input
            type="text"
            name="age"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (e.g. 15 kg)</label>
          <input
            type="text"
            name="weight"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            defaultValue="Available"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Available">Available</option>
            <option value="Under Care">Under Care</option>
            <option value="Adopted">Adopted</option>
          </select>
        </div>

        {/* Rescue Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rescue Date</label>
          <input
            type="date"
            name="rescue_date"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio (Description)</label>
          <textarea
            name="bio"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Submit */}
        <div className="pt-6">
          <button
            type="submit"
            className="w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add New Stray
          </button>
        </div>
      </form>
    </div>
  );
}

// Server Action - handles form submit on server
async function createStrayAction(formData: FormData) {
  'use server';

  try {
    const supabase = await createServerClient();

    const name = formData.get('name') as string;
    const breed = formData.get('breed') as string;
    const gender = formData.get('gender') as string;
    const age = formData.get('age') as string;
    const weight = formData.get('weight') as string;
    const location = formData.get('location') as string;
    const status = formData.get('status') as string;
    const rescue_date = formData.get('rescue_date') as string;
    const image = formData.get('image') as File;
    const bio = formData.get('bio') as string;

    console.log('Starting stray creation for:', name);

    let imageUrl = '';

    // Upload image if provided and valid
    if (image && image.size > 0 && image.type.startsWith('image/')) {
      const fileName = `${Date.now()}-${image.name}`;
      const { error: uploadError } = await supabase.storage
        .from('stray-photos')
        .upload(fileName, image);

      if (uploadError) {
        console.error('Image upload error:', uploadError);
        throw new Error(`Image upload failed: ${uploadError.message}`);
      }

      const { data: urlData } = supabase.storage.from('stray-photos').getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
      console.log('Image uploaded:', imageUrl);
    }

    // Prepare insert data
    const insertData = {
      name,
      breed: breed || null,
      gender: gender || null,
      age: age || null,
      weight: weight || null,
      location: location || null,
      status: status || 'Available',
      rescue_date: rescue_date ? new Date(rescue_date).toISOString() : null,
      image_url: imageUrl || null,
      bio: bio || null,
    };

    console.log('Inserting data:', insertData);

    // Insert to database
    const { error } = await supabase.from('strays').insert(insertData);

    if (error) {
      console.error('Insert error:', error);
      throw new Error(`Database insert failed: ${error.message}`);
    }

    console.log('Stray created successfully'); // Debug log

    // Force Next.js to re-fetch the list page data on next load
    revalidatePath('/admin/strays');

    // Redirect back to list
    redirect('/admin/strays');
  } catch (error) {
    console.error('Server action error:', error);
    // In a real app, you could return an error response or use a library like 'next-safe-action' for better error handling
    // For now, re-throw to let Next.js handle it (it might show a generic error)
    throw error;
  }
}