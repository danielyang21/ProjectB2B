import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMatch } from '../context/MatchContext';

function Quiz() {
  const navigate = useNavigate();
  const { setUserPreferences } = useMatch();
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

  const currentQuestion = questions[currentStep];

  const handleAnswer = (value) => {
    const newAnswers = { ...answers, [currentQuestion.id]: value };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Quiz complete, save preferences and navigate to swipe
      setUserPreferences(newAnswers);
      navigate('/swipe');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

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
                onClick={() => handleAnswer(option.value)}
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
          {currentStep > 0 ? (
            <button
              onClick={handleBack}
              className="px-6 py-3 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

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

export default Quiz;
