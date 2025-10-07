import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatch } from '../context/MatchContext';
import ServiceCard from '../components/ServiceCard';
import CompanyDetailModal from '../components/CompanyDetailModal';

function Matches() {
  const navigate = useNavigate();
  const { matches, resetMatches } = useMatch();
  const [selectedCompany, setSelectedCompany] = useState(null);

  const handleReset = () => {
    if (window.confirm('This will clear all your matches and let you start over. Continue?')) {
      resetMatches();
      navigate('/quiz');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Your Matches
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Companies you've liked and want to explore further
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8">
          <button
            onClick={() => navigate('/swipe')}
            className="px-6 py-3 text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 font-medium transition-colors"
          >
            Continue Swiping
          </button>
          <button
            onClick={handleReset}
            className="px-6 py-3 text-slate-700 dark:text-slate-300 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 font-medium transition-colors"
          >
            Start Over
          </button>
        </div>

        {/* Matches Grid */}
        {matches.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💔</div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              No matches yet
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-8">
              Start swiping to find companies that match your needs
            </p>
            <button
              onClick={() => navigate('/swipe')}
              className="px-8 py-3 bg-brand-blue-600 text-white rounded-xl hover:bg-brand-blue-700 transition-colors font-medium"
            >
              Start Swiping
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-slate-600 dark:text-slate-400">
                {matches.length} {matches.length === 1 ? 'match' : 'matches'} found
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matches.map((company) => (
                <ServiceCard
                  key={company.id}
                  service={company}
                  onClick={() => setSelectedCompany(company)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Company Detail Modal */}
      {selectedCompany && (
        <CompanyDetailModal
          company={selectedCompany}
          onClose={() => setSelectedCompany(null)}
        />
      )}
    </div>
  );
}

export default Matches;
