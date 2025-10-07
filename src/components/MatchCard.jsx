import { getMatchLevel } from '../utils/aiMatcher';

function MatchCard({ service, onClick }) {
  const matchLevel = getMatchLevel(service.matchScore || 0);

  return (
    <div
      className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1 hover:border-brand-blue-300 dark:hover:border-brand-blue-500 transition-all duration-300 cursor-pointer group relative"
      onClick={onClick}
    >
      {/* Match Score Badge - Top Right Corner */}
      <div className="absolute -top-3 -right-3 z-10">
        <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${matchLevel.bgColor} ${matchLevel.textColor} border-2 ${matchLevel.borderColor}`}>
          <span className="mr-1">{matchLevel.emoji}</span>
          <span>{service.matchScore}%</span>
        </div>
      </div>

      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2 group-hover:text-brand-blue-600 dark:group-hover:text-brand-blue-400 transition-colors duration-200">
            {service.companyName}
          </h3>
          <div className="flex flex-wrap gap-1">
            {service.services?.slice(0, 2).map((svc, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-brand-blue-50 dark:bg-brand-blue-900/30 text-brand-blue-700 dark:text-brand-blue-300 border border-brand-blue-200 dark:border-brand-blue-700"
              >
                {svc}
              </span>
            ))}
            {service.services?.length > 2 && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-slate-600">
                +{service.services.length - 2} more
              </span>
            )}
          </div>
        </div>
        {service.verified && (
          <div className="flex items-center gap-1 bg-green-50 dark:bg-green-900/30 px-2 py-1 rounded-full border border-green-200 dark:border-green-800 ml-2">
            <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-xs font-medium text-green-700 dark:text-green-400">Verified</span>
          </div>
        )}
      </div>

      <p className="text-sm text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
        {service.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
          {service.industry}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
          {service.companySize}
        </span>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm text-slate-500 dark:text-slate-400">{service.location}</span>
        </div>

        <div className="flex items-center gap-1">
          <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{service.rating}</span>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        {service.website ? (
          <a
            href={service.website}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 px-4 py-2 text-sm font-medium text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 transition-all duration-200 hover:shadow-lg text-center"
          >
            View Website
          </a>
        ) : (
          <button
            disabled
            className="flex-1 px-4 py-2 text-sm font-medium text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed text-center"
          >
            No Website
          </button>
        )}
        {service.quoteUrl && (
          <a
            href={service.quoteUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex-1 px-4 py-2 text-sm font-medium text-brand-blue-600 dark:text-brand-blue-400 bg-brand-blue-50 dark:bg-brand-blue-900/30 border border-brand-blue-200 dark:border-brand-blue-700 rounded-lg hover:bg-brand-blue-100 dark:hover:bg-brand-blue-900/50 transition-all duration-200 hover:shadow-lg text-center"
          >
            Request Quote
          </a>
        )}
      </div>
    </div>
  );
}

export default MatchCard;
