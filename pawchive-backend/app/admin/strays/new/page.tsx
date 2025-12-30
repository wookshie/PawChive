import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase'; // ← Make sure this matches your export in lib/supabase.ts

export default async function NewStrayPage() {
  const supabase = createServerClient();

  // Optional:
  // const { data: { session } } = await supabase.auth.getSession();
  // if (!session) {
  //   redirect('/login');
  // }

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">Add New Stray Pet</h1>

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

  let imageUrl = '';

  // Upload image if provided
  if (image && image.size > 0) {
    const fileName = `${Date.now()}-${image.name}`;
    const { error: uploadError } = await supabase.storage
      .from('stray-photos')
      .upload(fileName, image);

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data: urlData } = supabase.storage.from('stray-photos').getPublicUrl(fileName);
    imageUrl = urlData.publicUrl;
  }

  // Insert to database
  const { error } = await supabase.from('strays').insert({
    name,
    breed,
    gender,
    age,
    weight,
    location,
    status,
    rescue_date: rescue_date || null,
    image_url: imageUrl || null,
    bio,
  });

  if (error) {
    throw new Error(error.message);
  }

  // Force Next.js to re-fetch the list page data on next load
  revalidatePath('/admin/strays', 'page');

  // Redirect back to list
  redirect('/admin/strays');
}