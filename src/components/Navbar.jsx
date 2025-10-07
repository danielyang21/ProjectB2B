import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import SubmitCompanyModal from './SubmitCompanyModal';

function Navbar() {
  const { darkMode, toggleDarkMode } = useTheme();
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold text-slate-900 dark:text-white hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
              ServiceHub
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-6">
            <Link
              to="/browse"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-blue-600 dark:hover:text-brand-blue-400 transition-colors"
            >
              Browse
            </Link>
            <Link
              to="/quiz"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-blue-600 dark:hover:text-brand-blue-400 transition-colors"
            >
              Find Match
            </Link>
            <Link
              to="/matches"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-blue-600 dark:hover:text-brand-blue-400 transition-colors"
            >
              My Matches
            </Link>
            <Link
              to="/admin"
              className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-brand-blue-600 dark:hover:text-brand-blue-400 transition-colors"
            >
              Admin
            </Link>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 text-slate-600 dark:text-slate-300 hover:text-brand-blue-600 dark:hover:text-brand-blue-400 transition-all duration-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
              aria-label="Toggle dark mode"
            >
              {darkMode ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>

            <button
              onClick={() => setIsSubmitModalOpen(true)}
              className="px-5 py-2 text-sm font-medium text-white bg-brand-blue-600 dark:bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 dark:hover:bg-brand-blue-700 transition-all duration-200"
            >
              Submit Company
            </button>
          </div>
        </div>
      </div>

      {/* Submit Company Modal */}
      <SubmitCompanyModal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
      />
    </nav>
  );
}

export default Navbar;
