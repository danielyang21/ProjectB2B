import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-semibold text-slate-900 hover:text-slate-700 transition-colors">
              ServiceHub
            </Link>
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/browse"
              className="text-sm font-medium text-slate-600 hover:text-brand-blue-600 transition-colors"
            >
              Browse
            </Link>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-brand-blue-600 transition-colors">
              How it Works
            </a>
            <a href="#" className="text-sm font-medium text-slate-600 hover:text-brand-blue-600 transition-colors">
              Pricing
            </a>
            <Link
              to="/admin"
              className="text-sm font-medium text-slate-600 hover:text-brand-blue-600 transition-colors"
            >
              Admin
            </Link>
            <button className="px-5 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-all duration-200">
              Get Started for Free
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
