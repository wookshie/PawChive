import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col">
      {/* Header / Hero Section */}
      <header className="w-full py-6 px-8 bg-white/80 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">🐾</span>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PawChive
            </h1>
          </div>
          <p className="text-gray-600 hidden md:block">Campus Stray Pet Management</p>
        </div>
      </header>

      {/* Main Content - Centered Hero */}
      <main className="flex-1 flex items-center justify-center px-6">
        <div className="max-w-4xl w-full text-center space-y-10">
          {/* Title & Tagline */}
          <div className="space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-800 tracking-tight">
            Welcome to PawChive Admin
          </h2>

            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto">
              Manage, track, and care for campus strays with love and efficiency.
            </p>
          </div>

          {/* Quick Access Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {/* Strays Management Card */}
            <Link href="/admin/strays" className="group">
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className="text-5xl mb-4">🐶</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Strays Panel</h3>
                <p className="text-gray-600">
                  Add, edit, delete, and monitor all campus strays in one place.
                </p>
              </div>
            </Link>

            {/* Future Feature Cards (placeholders) */}
            <div className="bg-white/60 rounded-2xl p-8 shadow-lg border border-gray-100 opacity-70 cursor-not-allowed">
              <div className="text-5xl mb-4">❤️</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Adoptions</h3>
              <p className="text-gray-600">Manage adoption requests (coming soon)</p>
            </div>

            <div className="bg-white/60 rounded-2xl p-8 shadow-lg border border-gray-100 opacity-70 cursor-not-allowed">
              <div className="text-5xl mb-4">💰</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Sponsorships</h3>
              <p className="text-gray-600">Track sponsorships (coming soon)</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="mt-12">
            <Link
              href="/admin/strays"
              className="inline-block px-10 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xl font-semibold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Enter Strays Admin Panel →
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm border-t border-gray-200 bg-white/80 backdrop-blur-md">
        <p>© {new Date().getFullYear()} PawChive • Made with ❤️ for campus strays</p>
      </footer>
    </div>
  );
}
