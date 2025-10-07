import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors">
      {/* Hero Section */}
      <main className="pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl sm:text-7xl font-semibold text-slate-900 dark:text-white mb-6 leading-tight">
            Find Your Perfect Business Service
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-10 max-w-2xl mx-auto">
            Swipe through verified B2B service providers tailored to your needs. Match with companies that fit your budget, size, and priorities.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Link
              to="/quiz"
              className="px-8 py-4 text-base font-medium text-white bg-brand-blue-600 rounded-xl hover:bg-brand-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Find Your Match
            </Link>
            <Link
              to="/browse"
              className="px-8 py-4 text-base font-medium text-slate-900 dark:text-white bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Browse All Services
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
