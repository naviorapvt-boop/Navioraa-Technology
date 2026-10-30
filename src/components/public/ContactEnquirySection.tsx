import React, { useState, useEffect } from 'react';
import { createEnquiry } from '../../lib/data-service';

interface ContactEnquirySectionProps {
  initialCourse?: string;
  whatsappNumber?: string;
}

export const ContactEnquirySection: React.FC<ContactEnquirySectionProps> = ({
  initialCourse,
  whatsappNumber = '+919890187383',
}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [programOrService, setProgramOrService] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState(''); // Anti-spam trap

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [emailStatusNote, setEmailStatusNote] = useState<string | null>(null);

  useEffect(() => {
    if (initialCourse) {
      setProgramOrService(initialCourse);
    }
  }, [initialCourse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Spam check
    if (honeypot) {
      console.warn('Bot submission blocked.');
      return;
    }

    // Client-side validations
    if (!fullName.trim() || fullName.length > 120) {
      setErrorMsg('Please enter a valid full name (1-120 characters).');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email) || email.length > 150) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    if (!phone.trim() || phone.length < 7 || phone.length > 40) {
      setErrorMsg('Please enter a valid phone / WhatsApp contact number.');
      return;
    }

    if (!programOrService) {
      setErrorMsg('Please select a program or service of interest.');
      return;
    }

    if (!message.trim() || message.length > 2000) {
      setErrorMsg('Please enter your query or background (up to 2000 characters).');
      return;
    }

    setLoading(true);

    try {
      const res = await createEnquiry({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        programOrService,
        subject: `Enquiry: ${programOrService}`,
        message: message.trim(),
      });

      setSubmitted(true);
      setEmailStatusNote(res.message);

      // Reset form fields
      setFullName('');
      setEmail('');
      setPhone('');
      setProgramOrService('');
      setMessage('');
    } catch (err) {
      console.error('Enquiry submission error:', err);
      let message = 'Failed to submit enquiry. Please try again.';
      if (err instanceof Error) {
        try {
          const parsed = JSON.parse(err.message);
          message = parsed.error || err.message;
        } catch {
          message = err.message;
        }
      }
      setErrorMsg(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="px-4 py-12 bg-surface-subtle scroll-mt-20" id="enquiry-form">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary-soft px-3.5 py-1 rounded-full">
            Direct Academic Consultation
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-on-surface mt-2.5">
            Start Your Practical Learning Journey
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant mt-2 max-w-md mx-auto leading-relaxed">
            Connect with our faculty counselors to explore curriculum tracks, project syllabi, and cohort schedules.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-border-subtle shadow-md">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
                <span className="material-symbols-outlined text-[32px]">check_circle</span>
              </div>
              <h3 className="font-heading font-extrabold text-xl text-on-surface">
                Enquiry Successfully Received!
              </h3>
              <p className="text-xs sm:text-sm text-on-surface-variant max-w-sm mx-auto leading-relaxed">
                Thank you for reaching out to NAVIORAA. Our admissions mentor will contact you within 2 working hours.
              </p>
              {emailStatusNote && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-medium">
                  {emailStatusNote}
                </div>
              )}
              <button
                onClick={() => setSubmitted(false)}
                className="mt-3 px-6 py-2.5 rounded-full bg-primary text-white text-xs font-semibold hover:bg-primary-dark transition-all"
              >
                Submit Another Enquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Spam Honeypot (hidden from human users) */}
              <input
                type="text"
                name="website_hp"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: 'none' }}
                tabIndex={-1}
                autoComplete="off"
              />

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">error</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1.5" htmlFor="fullName">
                  Full Name <span className="text-secondary">*</span>
                </label>
                <input
                  id="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-border-medium bg-white text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1.5" htmlFor="email">
                    Email Address <span className="text-secondary">*</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-border-medium bg-white text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-on-surface mb-1.5" htmlFor="phone">
                    Phone / WhatsApp <span className="text-secondary">*</span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-11 px-3.5 rounded-xl border border-border-medium bg-white text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1.5" htmlFor="program">
                  Program or Service of Interest <span className="text-secondary">*</span>
                </label>
                <select
                  id="program"
                  required
                  value={programOrService}
                  onChange={(e) => setProgramOrService(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-border-medium bg-white text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs"
                >
                  <option value="" disabled>Select program or service</option>
                  {programOrService && ![
                    "Python Full Stack Development",
                    "Python Programming Essentials",
                    "Web Development (MERN Stack Engineering)",
                    "Artificial Intelligence & Machine Learning",
                    "Data Analytics & Visualization",
                    "Java Cloud Architecture & Spring Boot",
                    "Enterprise Web & Cloud Development Services",
                    "Custom Enterprise Software Development",
                    "IT & Business Project Development",
                    "General Academic & Career Consultation"
                  ].includes(programOrService) && (
                    <option value={programOrService}>{programOrService}</option>
                  )}
                  <option value="Python Full Stack Development">Python Full Stack Development</option>
                  <option value="Python Programming">Python Programming Essentials</option>
                  <option value="Web Development (MERN Stack Engineering)">Web Development (MERN Stack)</option>
                  <option value="AI and Machine Learning">Artificial Intelligence & Machine Learning</option>
                  <option value="Data Analytics & Visualization">Data Analytics & Visualization (Power BI / SQL)</option>
                  <option value="Java Cloud Architecture & Spring Boot">Java Cloud Architecture & Spring Boot</option>
                  <option value="Enterprise Web & Cloud Development Services">Enterprise Web & Cloud Development Services</option>
                  <option value="Custom Enterprise Software Development">Custom Enterprise Software Development</option>
                  <option value="IT & Business Project Development">IT & Business-Oriented Project Delivery</option>
                  <option value="General Academic & Career Consultation">General Academic & Career Consultation</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1.5" htmlFor="message">
                  Your Background or Target Career Role <span className="text-secondary">*</span>
                </label>
                <textarea
                  id="message"
                  required
                  rows={3}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-border-medium bg-white text-xs text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-2xs resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-2 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm active:scale-98 transition-all disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                    <span>Submitting Enquiry...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Enquiry</span>
                    <span className="material-symbols-outlined text-[18px]">send</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* WhatsApp Direct Option */}
          <div className="relative flex items-center justify-center my-4">
            <div className="w-full h-px bg-border-subtle" />
            <span className="absolute px-3 bg-white text-[11px] font-bold text-text-muted uppercase">
              Or Instant Connect
            </span>
          </div>

          <a
            href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full h-11 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs active:scale-98 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">chat</span>
            <span>Chat Directly on WhatsApp</span>
          </a>

          {/* Privacy Note */}
          <p className="text-[11px] text-text-muted text-center mt-4 flex items-center justify-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-emerald-600">verified_user</span>
            <span>Zero spam · Direct counselor response · Confidential</span>
          </p>
        </div>
      </div>
    </section>
  );
};
