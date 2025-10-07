import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Simple password check
    if (password === 'admin123') {
      // Store simple auth flag
      localStorage.setItem('adminAuth', 'true');
      navigate('/admin');
    } else {
      setError('Invalid password');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4 pt-20">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue-100 dark:bg-brand-blue-900 rounded-full mb-4">
              <svg className="w-8 h-8 text-brand-blue-600 dark:text-brand-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
              Admin Login
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Enter admin password to continue
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
                placeholder="Enter admin password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-6 py-3 text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Footer Note */}
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              For admin access only. Unauthorized access is prohibited.
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <button
            onClick={() => navigate('/')}
            className="text-sm text-slate-600 dark:text-slate-400 hover:text-brand-blue-600 dark:hover:text-brand-blue-400 transition-colors"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
