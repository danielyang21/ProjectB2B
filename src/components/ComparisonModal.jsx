import { useState, useEffect } from 'react';
import { getMatchLevel } from '../utils/aiMatcher';
import { useMatch } from '../context/MatchContext';

function ComparisonModal({ companies, onClose }) {
  const { userPreferences } = useMatch();
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingAI, setLoadingAI] = useState(true);

  useEffect(() => {
    // Fetch AI comparison insights
    const fetchAIInsights = async () => {
      try {
        setLoadingAI(true);
        const response = await fetch('http://localhost:5000/api/ai/compare', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            companies,
            userPreferences
          })
        });

        const result = await response.json();
        if (result.success) {
          setAiInsights(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch AI insights:', error);
        setAiInsights({
          summary: "Unable to generate AI analysis. Showing manual comparison.",
          recommendations: [],
          winner: null
        });
      } finally {
        setLoadingAI(false);
      }
    };

    if (companies && companies.length > 0) {
      fetchAIInsights();
    }
  }, [companies, userPreferences]);

  if (!companies || companies.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-slate-500 bg-opacity-75 dark:bg-slate-900 dark:bg-opacity-80"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-6xl my-8 overflow-hidden text-left align-middle transition-all transform bg-white dark:bg-slate-800 shadow-2xl rounded-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              AI-Powered Comparison
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* AI Insights Section */}
          <div className="px-6 py-6 bg-gradient-to-br from-brand-blue-50 to-purple-50 dark:from-slate-900 dark:to-brand-blue-900/20 border-b border-slate-200 dark:border-slate-700">
            {loadingAI ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue-600 mr-3"></div>
                <p className="text-slate-600 dark:text-slate-300">AI is analyzing companies...</p>
              </div>
            ) : aiInsights ? (
              <div className="space-y-4">
                {/* AI Badge */}
                <div className="flex items-center gap-2 mb-2">
                  <div className="px-3 py-1 bg-gradient-to-r from-brand-blue-600 to-purple-600 rounded-full">
                    <span className="text-xs font-bold text-white">✨ AI ANALYSIS</span>
                  </div>
                </div>

                {/* Executive Summary */}
                <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Executive Summary
                  </h3>
                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                    {aiInsights.summary}
                  </p>
                </div>

                {/* Winner Recommendation */}
                {aiInsights.winner && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-200 dark:border-green-800 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-bold text-green-900 dark:text-green-300 mb-1">
                          🏆 AI Recommended: {aiInsights.winner.companyName}
                        </h3>
                        <p className="text-sm text-green-800 dark:text-green-400">
                          {aiInsights.winner.reason}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Individual Recommendations */}
                {aiInsights.recommendations && aiInsights.recommendations.length > 0 && (
                  <div className="bg-white dark:bg-slate-800 rounded-lg p-4 shadow-sm">
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      Detailed Analysis
                    </h3>
                    <div className="space-y-3">
                      {aiInsights.recommendations.map((rec, idx) => (
                        <div key={idx} className="pb-3 border-b border-slate-100 dark:border-slate-700 last:border-0 last:pb-0">
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                            {rec.companyName}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                            {rec.recommendation}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-slate-500 dark:text-slate-400">
                Unable to load AI insights
              </div>
            )}
          </div>

          {/* Comparison Grid */}
          <div className="overflow-x-auto">
            <div className="inline-flex min-w-full">
              {/* Row Labels Column */}
              <div className="flex-shrink-0 w-48 bg-slate-50 dark:bg-slate-900">
                <div className="h-24 flex items-center justify-center border-b border-slate-200 dark:border-slate-700 px-4">
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">Attribute</span>
                </div>

                {[
                  'Match Score',
                  'Company Name',
                  'Rating',
                  'Location',
                  'Company Size',
                  'Industry',
                  'Services',
                  'Verified',
                  'Website',
                  'Founded',
                  'Employees'
                ].map((label) => (
                  <div
                    key={label}
                    className="h-20 flex items-center px-4 border-b border-slate-200 dark:border-slate-700"
                  >
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Company Columns */}
              {companies.map((company, idx) => {
                const matchLevel = getMatchLevel(company.matchScore || 0);

                return (
                  <div
                    key={company.id}
                    className={`flex-shrink-0 w-80 ${idx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50 dark:bg-slate-900/50'}`}
                  >
                    {/* Company Header */}
                    <div className="h-24 flex flex-col items-center justify-center p-4 border-b border-slate-200 dark:border-slate-700">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white text-center mb-2">
                        {company.companyName}
                      </h3>
                      {company.verified && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
                          ✓ Verified
                        </span>
                      )}
                    </div>

                    {/* Match Score */}
                    <div className="h-20 flex items-center justify-center px-4 border-b border-slate-200 dark:border-slate-700">
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-bold ${matchLevel.bgColor} ${matchLevel.textColor} border ${matchLevel.borderColor}`}>
                        <span className="mr-1">{matchLevel.emoji}</span>
                        <span>{company.matchScore}%</span>
                      </div>
                    </div>

                    {/* Company Name */}
                    <div className="h-20 flex items-center justify-center px-4 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-sm text-center text-slate-900 dark:text-white font-medium">
                        {company.companyName}
                      </span>
                    </div>

                    {/* Rating */}
                    <div className="h-20 flex items-center justify-center px-4 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-1">
                        <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {company.rating}/5.0
                        </span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="h-20 flex items-center justify-center px-4 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-sm text-center text-slate-700 dark:text-slate-300">
                        {company.location}
                      </span>
                    </div>

                    {/* Company Size */}
                    <div className="h-20 flex items-center justify-center px-4 border-b border-slate-200 dark:border-slate-700">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        {company.companySize}
                      </span>
                    </div>

                    {/* Industry */}
                    <div className="h-20 flex items-center justify-center px-4 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-sm text-center text-slate-700 dark:text-slate-300">
                        {company.industry}
                      </span>
                    </div>

                    {/* Services */}
                    <div className="h-20 flex items-center justify-center px-4 border-b border-slate-200 dark:border-slate-700">
                      <div className="flex flex-wrap gap-1 justify-center">
                        {company.services?.slice(0, 2).map((service, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand-blue-50 dark:bg-brand-blue-900/30 text-brand-blue-700 dark:text-brand-blue-300 border border-brand-blue-200 dark:border-brand-blue-700"
                          >
                            {service}
                          </span>
                        ))}
                        {company.services?.length > 2 && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            +{company.services.length - 2}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Verified */}
                    <div className="h-20 flex items-center justify-center px-4 border-b border-slate-200 dark:border-slate-700">
                      {company.verified ? (
                        <span className="text-green-600 dark:text-green-400 font-semibold">✓ Yes</span>
                      ) : (
                        <span className="text-slate-400">No</span>
                      )}
                    </div>

                    {/* Website */}
                    <div className="h-20 flex items-center justify-center px-4 border-b border-slate-200 dark:border-slate-700">
                      {company.website ? (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-brand-blue-600 dark:text-brand-blue-400 hover:underline"
                        >
                          Visit Site
                        </a>
                      ) : (
                        <span className="text-sm text-slate-400">N/A</span>
                      )}
                    </div>

                    {/* Founded */}
                    <div className="h-20 flex items-center justify-center px-4 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {company.founded || 'N/A'}
                      </span>
                    </div>

                    {/* Employees */}
                    <div className="h-20 flex items-center justify-center px-4 border-b border-slate-200 dark:border-slate-700">
                      <span className="text-sm text-slate-700 dark:text-slate-300">
                        {company.employees || 'N/A'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ComparisonModal;
