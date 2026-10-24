import React from 'react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-primary-light/50 via-white to-surface px-4 py-16 border-b border-border-subtle text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-primary bg-primary-light px-3.5 py-1 rounded-full">
            About NAVIORAA
          </span>
          <h1 className="font-heading font-extrabold text-3xl sm:text-4xl text-on-surface mt-3">
            Pioneering Practical IT Pedagogy & Technology Engineering
          </h1>
          <p className="text-sm sm:text-base text-on-surface-variant mt-3 leading-relaxed">
            Navioraa was founded on a simple truth: technology is mastered by writing real code and building real systems, not through passive academic lectures.
          </p>
        </div>
      </section>

      {/* Mission, Vision & Values */}
      <section className="px-4 py-16 bg-white border-b border-border-subtle">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-surface-subtle border border-border-subtle">
            <span className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center mb-4 shadow-xs">
              <span className="material-symbols-outlined text-[24px]">flag</span>
            </span>
            <h3 className="font-heading font-bold text-lg text-on-surface mb-2">Our Mission</h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              To equip aspiring developers and ambitious engineers with production-grade skills, verified GitHub portfolios, and the practical confidence required to excel in modern tech teams.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-surface-subtle border border-border-subtle">
            <span className="w-12 h-12 rounded-2xl bg-secondary text-white flex items-center justify-center mb-4 shadow-xs">
              <span className="material-symbols-outlined text-[24px]">visibility</span>
            </span>
            <h3 className="font-heading font-bold text-lg text-on-surface mb-2">Our Vision</h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              To establish a benchmark technical institute and enterprise incubator that seamlessly bridges collegiate learning with scalable commercial software engineering.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-surface-subtle border border-border-subtle">
            <span className="w-12 h-12 rounded-2xl bg-accent-blue text-white flex items-center justify-center mb-4 shadow-xs">
              <span className="material-symbols-outlined text-[24px]">verified</span>
            </span>
            <h3 className="font-heading font-bold text-lg text-on-surface mb-2">Our Core Values</h3>
            <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
              Code-first pedagogy, architectural honesty, continuous 1:1 mentor accessibility, and uncompromising dedication to real student proof of work.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="px-4 py-16 bg-surface-subtle border-b border-border-subtle">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary bg-secondary-soft px-3.5 py-1 rounded-full">
            Pedagogical Constitution
          </span>
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-on-surface">
            How We Teach Software Engineering
          </h2>
          <div className="text-left bg-white rounded-3xl p-6 sm:p-8 border border-border-subtle shadow-xs space-y-4 text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            <p>
              At Navioraa, every learner begins their day in the terminal and code editor. Rather than following canned copy-paste scripts, students participate in real engineering sprints where they face compiler errors, architect database relations, and debug network latency.
            </p>
            <p>
              Our curriculum is actively curated by practicing technology leads who deploy enterprise applications daily. This ensures that every tool, library, and pattern taught—from Docker containerization to PostgreSQL schema optimization—reflects current industry benchmarks.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 py-16 bg-white text-center">
        <div className="max-w-2xl mx-auto space-y-5">
          <h2 className="font-heading font-extrabold text-2xl sm:text-3xl text-on-surface">
            Ready to Build Your Engineering Career?
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant leading-relaxed">
            Explore our curriculum tracks or talk to an academic mentor today to map out your technical trajectory.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/courses"
              onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
              className="h-10 px-5 rounded-full bg-primary hover:bg-primary-dark text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all"
            >
              <span>Browse All Programs</span>
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
            <Link
              to="/contact"
              onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}
              className="h-10 px-5 rounded-full bg-surface-subtle hover:bg-primary-light text-primary border border-primary/25 text-xs font-bold flex items-center gap-2 transition-all"
            >
              <span>Contact Admissions</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
