function CompanyDetailModal({ company, onClose }) {
  if (!company) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="p-8 border-b border-slate-200">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-slate-900 mb-2">{company.companyName}</h2>
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-lg font-semibold text-slate-900">{company.rating}</span>
                  </div>
                  {company.verified && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm font-medium">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Services Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {company.services?.map((service, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-brand-blue-100 text-brand-blue-800 border border-brand-blue-200"
                >
                  {service}
                </span>
              ))}
            </div>

            {/* Meta Info */}
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>{company.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span>{company.industry}</span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <span>{company.companySize} Company</span>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">About</h3>
              <p className="text-slate-700 leading-relaxed">{company.description}</p>
            </div>

            {/* Company Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {company.founded && (
                <div>
                  <div className="text-sm font-medium text-slate-500 mb-1">Founded</div>
                  <div className="text-slate-900">{company.founded}</div>
                </div>
              )}
              {company.employees && (
                <div>
                  <div className="text-sm font-medium text-slate-500 mb-1">Employees</div>
                  <div className="text-slate-900">{company.employees}</div>
                </div>
              )}
            </div>

            {/* Certifications */}
            {company.certifications && company.certifications.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-slate-900 mb-3">Certifications</h3>
                <div className="flex flex-wrap gap-2">
                  {company.certifications.map((cert, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center px-3 py-1 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Information */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-slate-900 mb-3">Contact Information</h3>
              <div className="space-y-2">
                {company.email && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <a href={`mailto:${company.email}`} className="hover:text-brand-blue-600">
                      {company.email}
                    </a>
                  </div>
                )}
                {company.phone && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <a href={`tel:${company.phone}`} className="hover:text-brand-blue-600">
                      {company.phone}
                    </a>
                  </div>
                )}
                {company.linkedin && (
                  <div className="flex items-center gap-2 text-slate-700">
                    <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                    <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-brand-blue-600">
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {company.quoteUrl ? (
                <a
                  href={company.quoteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-3 text-center text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 font-medium transition-colors"
                >
                  Request Quote
                </a>
              ) : company.website ? (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-3 text-center text-white bg-brand-blue-600 rounded-lg hover:bg-brand-blue-700 font-medium transition-colors"
                >
                  Contact Company
                </a>
              ) : null}
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-6 py-3 text-center text-brand-blue-600 bg-brand-blue-50 border border-brand-blue-200 rounded-lg hover:bg-brand-blue-100 font-medium transition-colors"
                >
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CompanyDetailModal;
