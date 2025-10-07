import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useServices } from '../context/ServicesContext';
import { useMatch } from '../context/MatchContext';
import SwipeCard from '../components/SwipeCard';
import { calculateMatchScore, sortByMatchScore } from '../utils/aiMatcher';

function Swipe() {
  const navigate = useNavigate();
  const { services, loading } = useServices();
  const { userPreferences, matchedCompanies, swipedCompanies, addMatch, addPass } = useMatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [buttonSwipeTrigger, setButtonSwipeTrigger] = useState(null);
  const previousSwipedCount = useRef(0);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // If no preferences, redirect to quiz
    if (!userPreferences) {
      navigate('/quiz');
      return;
    }

    let filtered = [];

    // If AI-matched companies exist (from prompt), use those
    if (matchedCompanies && matchedCompanies.length > 0) {
      filtered = matchedCompanies
        .filter(company => {
          // Exclude already swiped companies
          if (swipedCompanies.liked.includes(company.id || company._id) ||
              swipedCompanies.passed.includes(company.id || company._id)) {
            return false;
          }
          return true;
        })
        .map(company => ({
          ...company,
          id: company.id || company._id,
          matchScore: company.matchPercentage || 0
        }));
    } else {
      // Fallback to quiz-based filtering (original logic)
      filtered = services.filter(service => {
        // Exclude already swiped companies
        if (swipedCompanies.liked.includes(service.id) ||
            swipedCompanies.passed.includes(service.id)) {
          return false;
        }

        // Filter by service type if specified
        if (userPreferences.serviceType && userPreferences.serviceType !== 'other') {
          const serviceTypeMap = {
            'communications': ['UCaaS', 'VoIP', 'Communications', 'Phone Systems'],
            'marketing': ['Marketing', 'Growth', 'CRM', 'Analytics'],
            'it-consulting': ['IT', 'Consulting', 'Technology', 'Software Development'],
            'hr': ['HR', 'Recruiting', 'Talent', 'Payroll'],
            'finance': ['Finance', 'Accounting', 'Payments', 'Invoicing']
          };

          const keywords = serviceTypeMap[userPreferences.serviceType] || [];
          const hasMatchingService = service.services?.some(svc =>
            keywords.some(keyword => svc.toLowerCase().includes(keyword.toLowerCase()))
          ) || keywords.some(keyword =>
            service.industry?.toLowerCase().includes(keyword.toLowerCase())
          );

          if (!hasMatchingService) return false;
        }

        // Filter by company size
        if (userPreferences.companySize) {
          if (service.companySize !== userPreferences.companySize) {
            return false;
          }
        }

        return true;
      });

      // Calculate match scores for quiz-based results
      filtered = filtered.map(company => ({
        ...company,
        matchScore: calculateMatchScore(userPreferences, company)
      }));

      // Sort by match score (highest first)
      filtered = sortByMatchScore(filtered);
    }

    const totalSwiped = swipedCompanies.liked.length + swipedCompanies.passed.length;
    const justSwiped = totalSwiped > previousSwipedCount.current;

    setFilteredCompanies(filtered);

    // Always keep currentIndex at 0 since we filter out swiped cards
    setCurrentIndex(0);

    // Only auto-navigate if we just swiped and we've already initialized
    if (hasInitialized.current && justSwiped && filtered.length === 0) {
      navigate('/matches');
    }

    // Mark as initialized after first render
    if (!hasInitialized.current && (services.length > 0 || matchedCompanies.length > 0)) {
      hasInitialized.current = true;
    }

    previousSwipedCount.current = totalSwiped;
  }, [services, userPreferences, matchedCompanies, swipedCompanies, navigate]);

  const handleSwipe = (direction) => {
    const currentCompany = filteredCompanies[currentIndex];

    if (direction === 'right') {
      addMatch(currentCompany);
    } else {
      addPass(currentCompany.id);
    }
  };

  const handleButtonSwipe = (direction) => {
    setButtonSwipeTrigger(direction);
    // Reset trigger after a short delay
    setTimeout(() => {
      setButtonSwipeTrigger(null);
    }, 350);
  };

  if (!userPreferences) {
    return null;
  }

  // Show loading state while services are being fetched
  if (loading && matchedCompanies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors pt-20">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Loading companies...</p>
        </div>
      </div>
    );
  }

  if (filteredCompanies.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors pt-20">
        <div className="max-w-2xl mx-auto px-4 py-20 text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
            No More Companies
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 mb-8">
            You've seen all available companies matching your preferences.
          </p>
          <button
            onClick={() => navigate('/matches')}
            className="px-8 py-3 bg-brand-blue-600 text-white rounded-xl hover:bg-brand-blue-700 transition-colors font-medium"
          >
            View Your Matches
          </button>
        </div>
      </div>
    );
  }

  const cardsToShow = filteredCompanies.slice(currentIndex, currentIndex + 3);
  const remaining = filteredCompanies.length - currentIndex;
  const isAIMatched = matchedCompanies && matchedCompanies.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Find Your Perfect Match
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            {remaining} {remaining === 1 ? 'company' : 'companies'} remaining
          </p>

          {/* Show user's prompt if AI-matched */}
          {isAIMatched && userPreferences.prompt && (
            <div className="mt-4 max-w-2xl mx-auto">
              <div className="bg-brand-blue-50 dark:bg-brand-blue-900/20 border border-brand-blue-200 dark:border-brand-blue-800 rounded-lg p-4">
                <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                  <span className="font-semibold">Your search:</span> "{userPreferences.prompt}"
                </p>
                <button
                  onClick={() => navigate('/quiz')}
                  className="text-sm text-brand-blue-600 dark:text-brand-blue-400 hover:text-brand-blue-700 dark:hover:text-brand-blue-300 font-medium"
                >
                  Edit search →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Card Stack */}
        <div className="relative w-full max-w-2xl mx-auto" style={{ height: '600px' }}>
          {cardsToShow.map((company, idx) => {
            const isTop = idx === 0;
            const scale = 1 - (idx * 0.05);
            const yOffset = idx * 10;

            return (
              <SwipeCard
                key={company.id}
                company={company}
                onSwipe={isTop ? handleSwipe : () => {}}
                triggerSwipe={isTop ? buttonSwipeTrigger : null}
                zIndex={cardsToShow.length - idx}
                showMatchPercentage={isAIMatched}
                style={{
                  transform: `scale(${scale}) translateY(${yOffset}px)`,
                  pointerEvents: isTop ? 'auto' : 'none'
                }}
              />
            );
          })}
        </div>

        {/* Action Buttons - Glassmorphism Style */}
        <div className="flex justify-center gap-8 mt-8">
          <button
            onClick={() => handleButtonSwipe('left')}
            className="group w-20 h-20 rounded-full backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-2 border-red-500/40 dark:border-red-400/40 shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-red-500/80 dark:hover:border-red-400/80"
            aria-label="Pass"
          >
            <svg className="w-8 h-8 text-red-500 dark:text-red-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          <button
            onClick={() => navigate('/matches')}
            className="group w-20 h-20 rounded-full backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-2 border-brand-blue-500/40 dark:border-brand-blue-400/40 shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-brand-blue-500/80 dark:hover:border-brand-blue-400/80"
            aria-label="View Matches"
          >
            <svg className="w-8 h-8 text-brand-blue-500 dark:text-brand-blue-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
          <button
            onClick={() => handleButtonSwipe('right')}
            className="group w-20 h-20 rounded-full backdrop-blur-xl bg-white/60 dark:bg-slate-800/60 border-2 border-green-500/40 dark:border-green-400/40 shadow-xl hover:shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:border-green-500/80 dark:hover:border-green-400/80"
            aria-label="Like"
          >
            <svg className="w-8 h-8 text-green-500 dark:text-green-400 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Instructions */}
        <div className="text-center mt-8">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Swipe right or click ♥ to match • Swipe left or click ✕ to pass
          </p>
        </div>
      </div>
    </div>
  );
}

export default Swipe;
