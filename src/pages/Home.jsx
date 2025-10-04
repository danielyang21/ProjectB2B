import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50">
      {/* Hero Section */}
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl sm:text-7xl font-semibold text-slate-900 mb-6 leading-tight">
            Find Your Perfect Business Service
          </h2>
          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto">
            ServiceHub is your trusted directory for discovering verified B2B service providers. Search, compare, and connect with industry experts.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link
              to="/browse"
              className="px-8 py-4 text-base font-medium text-white bg-brand-blue-600 rounded-xl hover:bg-brand-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Browse Services
            </Link>
            <button className="px-8 py-4 text-base font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all duration-200 shadow-lg hover:shadow-xl">
              List Your Service
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
