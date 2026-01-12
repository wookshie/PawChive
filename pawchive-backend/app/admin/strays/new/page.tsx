import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createServerClient } from '@/lib/supabase';
import Link from 'next/link';

export default async function NewStrayPage() {
  const supabase = await createServerClient();

  return (
    <div className="container mx-auto p-8 max-w-2xl">
      {/* Back button */}
      <div className="mb-8">
        <Link
          href="/admin/strays"
          className="inline-flex items-center px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition shadow-sm border border-gray-300"
        >
          ← Back to All Strays
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-8">Add New Stray Pet</h1>

      <form action={createStrayAction} className="space-y-6 bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            name="name"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Breed */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
          <input
            type="text"
            name="breed"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            name="gender"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Weight */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Weight (e.g. 15 kg)</label>
          <input
            type="text"
            name="weight"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            name="location"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            name="status"
            defaultValue="Available"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
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
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        {/* Photo Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Photo</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition"
          />
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio (Description)</label>
          <textarea
            name="bio"
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y"
          />
        </div>

        {/* Vaccinations - JSON input */}
        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vaccinations (JSON array - optional)
          </label>
          <textarea
            name="vaccinations"
            rows={6}
            defaultValue="[]"
            placeholder='Example (copy-paste exactly):\n[\n  {"name": "Rabies", "date": "2025-03-15", "status": "Completed"},\n  {"name": "Distemper", "date": "2025-01-10", "status": "Completed"}\n]'
            className="w-full px-4 py-3 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y bg-gray-50"
          />
          <p className="mt-2 text-xs text-gray-500">
            Enter a valid JSON array of objects. Leave as [] if none. Must be proper JSON!
          </p>
        </div>

        {/* Submit */}
        <div className="pt-6">
          <button
            type="submit"
            className="w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition"
          >
            Add New Stray
          </button>
        </div>
      </form>
    </div>
  );
}

// Server Action
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

    const vaccinationsRaw = formData.get('vaccinations') as string;
    let vaccinations = [];
    if (vaccinationsRaw && vaccinationsRaw.trim() !== '[]') {
      try {
        vaccinations = JSON.parse(vaccinationsRaw);
        if (!Array.isArray(vaccinations)) {
          throw new Error('Vaccinations must be a JSON array');
        }
      } catch (parseError) {
        throw new Error('Invalid vaccinations JSON format: ' + (parseError instanceof Error ? parseError.message : String(parseError)));
      }
    }

    let imageUrl = '';

    if (image && image.size > 0 && image.type.startsWith('image/')) {
      const fileName = `${Date.now()}-${image.name}`;
      const { error: uploadError } = await supabase.storage
        .from('stray-photos')
        .upload(fileName, image);

      if (uploadError) throw new Error(`Image upload failed: ${uploadError.message}`);

      const { data: urlData } = supabase.storage.from('stray-photos').getPublicUrl(fileName);
      imageUrl = urlData.publicUrl;
    }

    const insertData = {
      name: name || null,
      breed: breed || null,
      gender: gender || null,
      age: age || null,
      weight: weight || null,
      location: location || null,
      status: status || 'Available',
      rescue_date: rescue_date ? new Date(rescue_date).toISOString() : null,
      image_url: imageUrl || null,
      bio: bio || null,
      vaccinations,
    };

    const { error } = await supabase.from('strays').insert(insertData);

    if (error) throw new Error(`Database insert failed: ${error.message}`);

    revalidatePath('/admin/strays');
    redirect('/admin/strays');
  } catch (error) {
    console.error('Create stray error:', error);
    throw error;
  }
}