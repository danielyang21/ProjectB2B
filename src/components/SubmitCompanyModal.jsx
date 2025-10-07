import { useState } from 'react';
import CompanyForm from './CompanyForm';

function SubmitCompanyModal({ isOpen, onClose }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('http://localhost:5000/api/services/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit company');
      }

      setSubmitSuccess(true);
      setTimeout(() => {
        onClose();
        setSubmitSuccess(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting company:', error);
      alert(error.message || 'Failed to submit company. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-2xl font-bold text-slate-900">Submit a Company</h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {submitSuccess ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">
                Company Submitted Successfully!
              </h3>
              <p className="text-slate-600">
                Your submission is pending admin approval and will appear on the site once reviewed.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>Note:</strong> All company submissions will be reviewed by our admin team before appearing on the site.
                  Please provide accurate and complete information.
                </p>
              </div>

              <CompanyForm
                onSubmit={handleSubmit}
                onCancel={onClose}
                isSubmitting={isSubmitting}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default SubmitCompanyModal;
