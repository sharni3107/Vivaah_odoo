import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';

export default function EnquiryPage() {
  const { createEnquiry } = useData();
  const [searchParams] = useSearchParams();
  const packageParam = searchParams.get('package') || 'Full-Service Wedding Planning';
  const destinationParam = searchParams.get('destination') || 'Jaipur';

  const [formData, setFormData] = useState({
    client_names: '',
    email: '',
    phone: '',
    wedding_date: '2026-12-18',
    destination: destinationParam,
    expected_guests: 350,
    package_type: packageParam,
    estimated_budget: 15000000,
    preferred_theme: '',
    additional_requirements: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.client_names.trim() || !formData.email.trim() || !formData.phone.trim()) {
      alert('Please fill out all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await createEnquiry(formData);
      setSubmittedData(res);
      setIsSubmitted(true);
    } catch (err) {
      console.error('Enquiry submission error:', err);
      alert('There was an issue submitting your enquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-surface text-on-surface flex flex-col font-sans">
      {/* Top Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-md border-b border-secondary/20 h-16 flex items-center justify-between px-6 lg:px-12">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-primary-container text-secondary flex items-center justify-center border border-secondary/30">
            <span className="material-symbols-outlined text-[17px]">diamond</span>
          </div>
          <div className="flex flex-col text-left">
            <span className="font-serif text-[18px] tracking-[0.16em] uppercase text-primary font-medium leading-none">
              VIVAAH
            </span>
            <span className="font-sans text-[8.5px] uppercase tracking-[0.25em] text-secondary mt-0.5 font-semibold">
              Luxury Weddings
            </span>
          </div>
        </Link>

        <Link
          to="/"
          className="text-on-surface-variant font-sans text-xs uppercase tracking-wider hover:text-primary transition-colors flex items-center gap-1 font-medium"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          <span>Back to Home</span>
        </Link>
      </nav>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-6 lg:px-12 max-w-4xl mx-auto w-full flex-1">
        {/* Header Intro */}
        <div className="text-center space-y-2 mb-10">
          <span className="font-sans text-xs uppercase tracking-widest text-secondary font-semibold">
            Plan Your Wedding
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-primary font-normal">
            Start Your Wedding Journey
          </h1>
          <p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            Please share your wedding preferences with us. Our wedding planning team will review your enquiry and get back to you within 24 hours.
          </p>
        </div>

        {/* Confirmation Screen */}
        {isSubmitted ? (
          <div className="bg-surface-container-lowest p-8 sm:p-12 rounded-lg border border-secondary/30 shadow-md text-center space-y-5 animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-secondary-container/40 text-secondary mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px]">check_circle</span>
            </div>

            <div className="space-y-1.5">
              <h2 className="font-serif text-2xl sm:text-3xl text-primary">
                Thank You, {formData.client_names}
              </h2>
              <p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-md mx-auto leading-relaxed">
                Your wedding enquiry has been successfully received and assigned to our team. We look forward to connecting with you.
              </p>
            </div>

            <div className="max-w-md mx-auto p-4 bg-surface-container-low rounded border border-secondary/20 text-left font-sans text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Enquiry Reference:</span>
                <span className="font-semibold text-primary">{submittedData?.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Destination:</span>
                <span className="font-semibold text-primary">{formData.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Tentative Date:</span>
                <span className="font-semibold text-primary">{formData.wedding_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-on-surface-variant">Package:</span>
                <span className="font-semibold text-primary">{formData.package_type}</span>
              </div>
            </div>

            <div className="pt-2 flex justify-center gap-4">
              <Link
                to="/"
                className="bg-primary text-on-primary px-6 py-2.5 rounded font-sans text-xs uppercase tracking-wider font-semibold hover:bg-secondary-dark transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          /* Enquiry Form */
          <form onSubmit={handleSubmit} className="bg-surface-container-lowest p-8 sm:p-10 rounded-lg border border-secondary/25 shadow-sm space-y-8">
            {/* Section 1: Contact Details */}
            <div className="space-y-4">
              <h2 className="font-serif text-xl text-primary border-b border-secondary/15 pb-2 font-medium">
                1. Your Contact Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-semibold text-on-surface block">
                    Full Legal Name(s) *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Aarav Singhania & Meera Kapoor"
                    value={formData.client_names}
                    onChange={(e) => setFormData({ ...formData, client_names: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-secondary/25 rounded text-xs focus:outline-none focus:border-primary text-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-on-surface block">
                    Email Address *
                  </label>
                  <input
                    required
                    type="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-secondary/25 rounded text-xs focus:outline-none focus:border-primary text-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-on-surface block">
                    Phone / WhatsApp Number *
                  </label>
                  <input
                    required
                    type="tel"
                    placeholder="+91 98200 00000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-secondary/25 rounded text-xs focus:outline-none focus:border-primary text-primary"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Wedding Details */}
            <div className="space-y-4">
              <h2 className="font-serif text-xl text-primary border-b border-secondary/15 pb-2 font-medium">
                2. Wedding Details &amp; Requirements
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
                <div className="space-y-1.5">
                  <label className="font-semibold text-on-surface block">
                    Tentative Wedding Date *
                  </label>
                  <input
                    required
                    type="date"
                    value={formData.wedding_date}
                    onChange={(e) => setFormData({ ...formData, wedding_date: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-secondary/25 rounded text-xs focus:outline-none focus:border-primary text-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-on-surface block">
                    Wedding Destination *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Jaipur, Udaipur, Hyderabad, Kerala"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-secondary/25 rounded text-xs focus:outline-none focus:border-primary text-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-on-surface block">
                    Expected Guest Count *
                  </label>
                  <input
                    required
                    type="number"
                    min="10"
                    max="2500"
                    value={formData.expected_guests}
                    onChange={(e) => setFormData({ ...formData, expected_guests: parseInt(e.target.value, 10) || 0 })}
                    className="w-full p-2.5 bg-surface-container-low border border-secondary/25 rounded text-xs focus:outline-none focus:border-primary text-primary font-tabular-nums"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-on-surface block">
                    Preferred Package *
                  </label>
                  <select
                    value={formData.package_type}
                    onChange={(e) => setFormData({ ...formData, package_type: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-secondary/25 rounded text-xs focus:outline-none focus:border-primary text-primary"
                  >
                    <option value="Full-Service Wedding Planning">Full-Service Wedding Planning</option>
                    <option value="Partial / Day-of Coordination">Partial / Day-of Coordination</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-semibold text-on-surface block">
                    Estimated Budget (INR) *
                  </label>
                  <input
                    required
                    type="number"
                    step="500000"
                    value={formData.estimated_budget}
                    onChange={(e) => setFormData({ ...formData, estimated_budget: parseFloat(e.target.value) || 0 })}
                    className="w-full p-2.5 bg-surface-container-low border border-secondary/25 rounded text-xs focus:outline-none focus:border-primary text-primary font-tabular-nums"
                  />
                  <p className="text-[11px] text-on-surface-variant font-tabular-nums">
                    Approx: ₹{(formData.estimated_budget / 10000000).toFixed(2)} Crore (₹{Number(formData.estimated_budget).toLocaleString('en-IN')})
                  </p>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-semibold text-on-surface block">
                    Preferred Theme or Style
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Heritage, Elegant Candlelight, Minimalist Floral"
                    value={formData.preferred_theme}
                    onChange={(e) => setFormData({ ...formData, preferred_theme: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-secondary/25 rounded text-xs focus:outline-none focus:border-primary text-primary"
                  />
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-semibold text-on-surface block">
                    Additional Requirements or Specific Requests
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Tell us about multi-day events, catering preferences, special requests..."
                    value={formData.additional_requirements}
                    onChange={(e) => setFormData({ ...formData, additional_requirements: e.target.value })}
                    className="w-full p-2.5 bg-surface-container-low border border-secondary/25 rounded text-xs focus:outline-none focus:border-primary text-primary"
                  />
                </div>
              </div>
            </div>

            {/* Submission Button */}
            <div className="pt-4 border-t border-secondary/15 flex items-center justify-between">
              <span className="text-[11px] text-on-surface-variant">
                * All information is kept completely private.
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-on-primary px-7 py-3 rounded font-sans text-xs uppercase tracking-wider font-semibold hover:bg-secondary-dark transition-colors shadow-sm disabled:opacity-50"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Wedding Enquiry'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}
