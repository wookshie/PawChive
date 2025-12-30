export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-5xl font-bold text-gray-800 mb-4">PawChive Admin Backend</h1>
      <p className="text-xl text-gray-600 mb-8">
        Manage stray pets, adoptions, and sponsorships
      </p>
      <a
        href="/admin/strays"
        className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
      >
        Go to Strays Admin Panel
      </a>
    </div>
  );
}