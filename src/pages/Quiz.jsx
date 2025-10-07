import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatch } from '../context/MatchContext';

function Quiz() {
  const navigate = useNavigate();
  const { setUserPreferences, setMatchedCompanies } = useMatch();
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [error, setError] = useState('');

  // Quiz state
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    serviceType: '',
    budget: '',
    companySize: '',
    priority: '',
    industry: ''
  });

  const questions = [
    {
      id: 'serviceType',
      question: "What type of service are you looking for?",
      options: [
        { value: 'communications', label: '📞 Communications & UCaaS' },
        { value: 'marketing', label: '📱 Marketing & Growth' },
        { value: 'it-consulting', label: '💻 IT Consulting' },
        { value: 'hr', label: '👥 HR & Talent' },
        { value: 'finance', label: '💰 Finance & Accounting' },
        { value: 'other', label: '🔍 Other' }
      ]
    },
    {
      id: 'companySize',
      question: "What's your company size?",
      options: [
        { value: 'Small', label: '1-50 employees' },
        { value: 'Medium', label: '51-500 employees' },
        { value: 'Large', label: '500+ employees' }
      ]
    },
    {
      id: 'budget',
      question: "What's your budget range?",
      options: [
        { value: 'low', label: '💵 Under $1k/month' },
        { value: 'medium', label: '💰 $1k-$10k/month' },
        { value: 'high', label: '💎 $10k+/month' },
        { value: 'flexible', label: '🤷 Flexible' }
      ]
    },
    {
      id: 'priority',
      question: "What matters most to you?",
      options: [
        { value: 'price', label: '💵 Best Price' },
        { value: 'features', label: '⚡ Most Features' },
        { value: 'support', label: '🛟 Customer Support' },
        { value: 'reputation', label: '⭐ Reputation & Reviews' }
      ]
    }
  ];

  const examplePrompts = [
    "I need a cybersecurity company with HIPAA compliance and penetration testing services",
    "Looking for a marketing agency specializing in B2B SaaS with proven results",
    "Need cloud infrastructure provider with 24/7 support and competitive pricing",
    "Seeking HR software for a 200-person company with payroll and benefits management"
  ];

  const handlePromptSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/api/ai/match-companies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: prompt.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to get matches');
      }

      // Save the matched companies and user prompt
      setUserPreferences({ prompt: prompt.trim(), type: 'ai-prompt' });
      setMatchedCompanies(data.matches || []);

      // Navigate to swipe page
      navigate('/swipe');
    } catch (err) {
      console.error('Error getting matches:', err);
      setError(err.message || 'Failed to get company matches. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuizAnswer = (value) => {
    const newAnswers = { ...answers, [questions[currentStep].id]: value };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Quiz complete, save preferences and navigate to swipe
      setUserPreferences({ ...newAnswers, type: 'quiz' });
      navigate('/swipe');
    }
  };

  const handleBackQuiz = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      setShowQuiz(false);
    }
  };

  if (showQuiz) {
    const currentQuestion = questions[currentStep];
    const progress = ((currentStep + 1) / questions.length) * 100;

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors pt-20">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                Question {currentStep + 1} of {questions.length}
              </span>
              <span className="text-sm font-medium text-brand-blue-600 dark:text-brand-blue-400">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
              <div
                className="bg-brand-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 mb-6">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
              {currentQuestion.question}
            </h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleQuizAnswer(option.value)}
                  className="w-full p-4 text-left rounded-xl border-2 border-slate-200 dark:border-slate-700 hover:border-brand-blue-500 dark:hover:border-brand-blue-500 hover:bg-brand-blue-50 dark:hover:bg-brand-blue-900/20 transition-all duration-200 group"
                >
                  <span className="text-lg font-medium text-slate-900 dark:text-white group-hover:text-brand-blue-600 dark:group-hover:text-brand-blue-400">
                    {option.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handleBackQuiz}
              className="px-6 py-3 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              ← Back
            </button>

            <button
              onClick={() => navigate('/')}
              className="px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              Skip Quiz →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-colors pt-20 flex items-center justify-center">
      <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Find Your Perfect Match
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Describe what you're looking for, and we'll find the best B2B services for you
          </p>
        </div>

        {/* Main Prompt Area */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <form onSubmit={handlePromptSubmit} className="p-8">
            {/* Textarea */}
            <div className="relative">
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your business needs... (e.g., I need a cloud infrastructure provider with 24/7 support, competitive pricing, and experience with fintech companies)"
                rows={6}
                className="w-full px-6 py-4 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-blue-500 focus:border-transparent resize-none text-lg"
                disabled={isLoading}
              />

              {/* Character count */}
              <div className="absolute bottom-3 right-3 text-xs text-slate-400 dark:text-slate-500">
                {prompt.length} characters
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className="mt-6 w-full px-8 py-4 text-lg font-semibold text-white bg-brand-blue-600 rounded-xl hover:bg-brand-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Finding your matches...
                </>
              ) : (
                <>
                  Find Matches
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative px-8 py-4">
            <div className="absolute inset-0 flex items-center px-8">
              <div className="w-full border-t border-slate-200 dark:border-slate-700"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-4 text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800">
                or
              </span>
            </div>
          </div>

          {/* Alternative Option */}
          <div className="px-8 pb-8">
            <button
              onClick={() => setShowQuiz(true)}
              className="w-full px-6 py-3 text-brand-blue-600 dark:text-brand-blue-400 bg-brand-blue-50 dark:bg-brand-blue-900/20 border-2 border-brand-blue-200 dark:border-brand-blue-800 rounded-xl hover:bg-brand-blue-100 dark:hover:bg-brand-blue-900/30 transition-all duration-200 font-medium"
            >
              Take a short quiz instead
            </button>
          </div>
        </div>

        {/* Example Prompts */}
        <div className="mt-8">
          <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-3 text-center">
            Need inspiration? Try one of these:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {examplePrompts.map((example, idx) => (
              <button
                key={idx}
                onClick={() => setPrompt(example)}
                className="p-4 text-left text-sm text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:border-brand-blue-300 dark:hover:border-brand-blue-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Quiz;
