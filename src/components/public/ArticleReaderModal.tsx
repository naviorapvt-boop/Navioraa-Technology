import React from 'react';
import { BlogPost } from '../../lib/types';

interface ArticleReaderModalProps {
  post: BlogPost | null;
  onClose: () => void;
  onEnquire: (topicTitle: string) => void;
}

export const ArticleReaderModal: React.FC<ArticleReaderModalProps> = ({ post, onClose, onEnquire }) => {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!post) return null;

  // Render markdown-like sections cleanly
  const renderFormattedContent = (content: string) => {
    const lines = content.split('\n');
    return lines.map((line, index) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('### ')) {
        return (
          <h4 key={index} className="font-heading font-bold text-base sm:text-lg text-on-surface mt-5 mb-2 text-[#0052FF]">
            {trimmed.replace('### ', '')}
          </h4>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h3 key={index} className="font-heading font-extrabold text-lg sm:text-xl text-on-surface mt-6 mb-2 pb-1 border-b border-border-subtle">
            {trimmed.replace('## ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('# ')) {
        return (
          <h2 key={index} className="font-heading font-extrabold text-xl sm:text-2xl text-on-surface mt-6 mb-3">
            {trimmed.replace('# ', '')}
          </h2>
        );
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={index} className="text-xs sm:text-sm text-on-surface-variant list-disc ml-5 my-1 leading-relaxed">
            {trimmed.substring(2)}
          </li>
        );
      }
      if (trimmed.startsWith('```') || trimmed.endsWith('```')) {
        return null;
      }
      if (trimmed.length === 0) {
        return <div key={index} className="h-2" />;
      }
      return (
        <p key={index} className="text-xs sm:text-sm text-on-surface-variant leading-relaxed my-2">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden shadow-2xl flex flex-col border border-border-subtle relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="relative bg-slate-900 text-white">
          <div className="h-44 sm:h-56 w-full relative overflow-hidden">
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-full object-cover opacity-40"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&auto=format&fit=crop&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors z-10"
            aria-label="Close article"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#00D2FF] bg-[#00D2FF]/20 px-2.5 py-0.5 rounded-full">
                Technical Knowledge
              </span>
              {post.tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] font-semibold text-slate-300 bg-white/10 px-2 py-0.5 rounded-md"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="font-heading font-extrabold text-lg sm:text-2xl text-white leading-snug">
              {post.title}
            </h1>

            <div className="flex items-center gap-4 text-[11px] text-slate-300 mt-2">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#00D2FF]">schedule</span>
                <span>5 Min Read</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-[#00D2FF]">menu_book</span>
                <span>Editorial Curriculum Series</span>
              </span>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-4 bg-white">
          <div className="p-4 rounded-2xl bg-[#0052FF]/5 border border-[#0052FF]/15 text-xs text-slate-700 leading-relaxed italic">
            "{post.excerpt}"
          </div>

          <div className="prose prose-sm max-w-none text-on-surface">
            {renderFormattedContent(post.content)}
          </div>

          {/* Key Takeaways Box */}
          <div className="mt-8 p-5 rounded-2xl bg-surface-subtle border border-border-subtle space-y-2">
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-primary flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-secondary">lightbulb</span>
              <span>Key Technical Takeaway</span>
            </h4>
            <p className="text-xs text-on-surface-variant leading-relaxed">
              Every concept discussed in this technical article is practiced directly in NAVIORAA lab sessions with live mentorship, peer pull requests, and automated test suites.
            </p>
          </div>
        </div>

        {/* Modal Footer - Requirement 4 & 9: mobile-flexible layout with concise keyword labels */}
        <div className="p-3.5 sm:p-4 border-t border-border-subtle bg-surface-subtle flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="text-[11px] text-text-muted hidden sm:block">
            <span>Curriculum Knowledge · NAVIORAA IT Training Labs</span>
          </div>
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={onClose}
              className="h-10 px-4 rounded-xl border border-border-medium text-xs font-semibold hover:bg-slate-100 transition-colors flex items-center justify-center text-slate-700"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                onClose();
                onEnquire(`Mentorship: ${post.title}`);
              }}
              className="h-10 px-4 rounded-xl bg-gradient-to-r from-[#0052FF] via-[#0066FF] to-[#00A3FF] hover:from-[#0047E0] hover:to-[#008FE6] text-white text-xs font-bold flex items-center justify-center gap-1 shadow-sm active:scale-95 transition-all"
            >
              <span>Enquire Mentorship</span>
              <span className="material-symbols-outlined text-[15px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
