'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';

type Stray = {
  vaccinations: any;
  id: string;
  name: string;
  breed: string;
  gender: string;
  age: string;
  status: string;
  location: string;
  bio?: string;
};

export default function EditStrayForm({ stray }: { stray: Stray }) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [formData, setFormData] = useState({
    name: stray.name || '',
    breed: stray.breed || '',
    gender: stray.gender || '',
    age: stray.age || '',
    status: stray.status || 'Available',
    location: stray.location || '',
    bio: stray.bio || '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('strays')
        .update({
          name: formData.name,
          breed: formData.breed,
          gender: formData.gender,
          age: formData.age,
          status: formData.status,
          location: formData.location,
          bio: formData.bio.trim() || null, // Save empty bio as null
        })
        .eq('id', stray.id);

      if (error) throw error;

      setMessage({ text: 'Stray updated successfully!', type: 'success' });
    } catch (err: any) {
      console.error('Update error:', err);
      setMessage({ text: err.message || 'Failed to update stray.', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-200">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Responsive grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Breed */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Breed</label>
            <input
              type="text"
              name="breed"
              value={formData.breed}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
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
              value={formData.age}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition bg-white"
            >
              <option value="Available">Available</option>
              <option value="Under Care">Under Care</option>
              <option value="Adopted">Adopted</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />
          </div>
        </div>

        {/* Bio - Full width */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Bio (Description)</label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={5}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition resize-y"
            placeholder="Describe the stray's personality, history, needs, etc..."
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
            defaultValue={stray?.vaccinations ? JSON.stringify(stray.vaccinations, null, 2) : '[]'}
            placeholder='Example:\n[\n  {"name": "Rabies", "date": "2025-03-15", "status": "Completed"},\n  {"name": "Distemper", "date": "2025-01-10", "status": "Completed"}\n]'
            className="w-full px-4 py-3 border border-gray-300 rounded-md font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-y bg-gray-50"
          />
          <p className="mt-2 text-xs text-gray-500">
            Edit the existing array or leave as [] if none.
          </p>
        </div>

        {/* Message */}
        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.type === 'success' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {message.text}
          </p>
        )}

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed ${
              loading ? 'cursor-wait' : ''
            }`}
          >
            {loading ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}