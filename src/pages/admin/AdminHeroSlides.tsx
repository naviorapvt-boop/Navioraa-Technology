import React, { useState, useEffect } from 'react';
import { getHeroSlides, saveHeroSlide, deleteHeroSlide } from '../../lib/data-service';
import { HeroSlide } from '../../lib/types';

export const AdminHeroSlides: React.FC = () => {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<Partial<HeroSlide> | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const loadSlides = async () => {
    try {
      const data = await getHeroSlides(false);
      setSlides(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSlides();
  }, []);

  const handleOpenNew = () => {
    setIsNew(true);
    setEditingSlide({
      title: 'Learn Industry-Ready Skills. Build Your Future.',
      subtitle: 'Discover practical IT training and turn your ideas into real-world technology projects.',
      ctaText: 'Explore Courses',
      ctaLink: '#courses-catalog',
      secondaryCtaText: 'Start Enquiry',
      secondaryCtaLink: '#enquiry-form',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuByluUiQUyemMe5OdVxt8WQXfkbbyJLvEC2NjWEG10aqNLhU3BQ9duZeEPv-XYkLp9MjjNjQ3pEvIQ0vFPAUdDeQMTcQwkjoSQqqXEJyV3jbz4I9OnhHGnqcv8FUnqPNdwIICRCOTkWNrluaed_CndAHKMHGc4spEghJmuJsZ5onj-tSMNZHK1YW9gqs0dgMEvehUD8C7QAwZyrtxbZvgL3MLpF7f8FlpN1hGEu2x6TScIG67ha03IhNQ',
      badgeText: 'Learn. Build. Create. Grow.',
      displayOrder: slides.length + 1,
      published: true,
    });
  };

  const handleOpenEdit = (slide: HeroSlide) => {
    setIsNew(false);
    setEditingSlide({ ...slide });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSlide || !editingSlide.title) {
      alert('Slide title is required.');
      return;
    }

    setSaving(true);
    try {
      await saveHeroSlide(editingSlide);
      setEditingSlide(null);
      await loadSlides();
    } catch (err) {
      alert('Save error: ' + (err instanceof Error ? err.message : String(err)));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this carousel slide?')) return;
    try {
      await deleteHeroSlide(id);
      await loadSlides();
    } catch (err) {
      alert('Delete error: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  const handleTogglePublish = async (slide: HeroSlide) => {
    try {
      await saveHeroSlide({ ...slide, published: !slide.published });
      await loadSlides();
    } catch (err) {
      alert('Update error: ' + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading font-extrabold text-2xl text-on-surface">
            Hero Carousel & Homepage Banners
          </h1>
          <p className="text-xs text-on-surface-variant mt-1">
            Manage public website hero carousel headlines, descriptions, CTAs, background images, and sequence order.
          </p>
        </div>

        <button
          onClick={handleOpenNew}
          className="h-10 px-5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-xs transition-all"
        >
          <span className="material-symbols-outlined text-[18px]">add_photo_alternate</span>
          <span>Add Hero Slide</span>
        </button>
      </div>

      {/* Slides List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {slides.map((slide, idx) => (
          <div
            key={slide.id || idx}
            className="bg-white rounded-3xl border border-border-subtle shadow-2xs overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className="relative h-40 w-full bg-slate-900 overflow-hidden">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-white bg-black/60 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                    Slide #{slide.displayOrder}
                  </span>
                  <button
                    onClick={() => handleTogglePublish(slide)}
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                      slide.published ? 'bg-emerald-500 text-white' : 'bg-slate-400 text-white'
                    }`}
                  >
                    {slide.published ? 'Active' : 'Disabled'}
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-secondary">
                  {slide.badgeText || 'Badge'}
                </span>
                <h3 className="font-heading font-bold text-base text-on-surface leading-snug">
                  {slide.title}
                </h3>
                <p className="text-xs text-on-surface-variant line-clamp-2 leading-relaxed">
                  {slide.subtitle}
                </p>

                <div className="pt-2 flex flex-wrap gap-2 text-[11px] font-semibold text-text-muted">
                  <span className="bg-surface-subtle px-2 py-0.5 rounded border border-border-subtle">
                    CTA: {slide.ctaText} → {slide.ctaLink}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-border-subtle bg-surface-subtle flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">Order: {slide.displayOrder}</span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenEdit(slide)}
                  className="w-8 h-8 rounded-lg hover:bg-slate-200 text-primary flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[18px]">edit</span>
                </button>
                <button
                  onClick={() => handleDelete(slide.id)}
                  className="w-8 h-8 rounded-lg hover:bg-red-50 text-red-600 flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-[18px]">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Editor Modal */}
      {editingSlide && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-border-subtle shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h2 className="font-heading font-extrabold text-lg text-on-surface">
                {isNew ? 'Create Hero Slide' : 'Edit Hero Slide'}
              </h2>
              <button
                onClick={() => setEditingSlide(null)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-on-surface mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  value={editingSlide.title || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, title: e.target.value })}
                  className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface"
                />
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Subtitle / Paragraph Description</label>
                <textarea
                  rows={3}
                  value={editingSlide.subtitle || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, subtitle: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-border-medium text-xs text-on-surface resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface mb-1">Primary CTA Label</label>
                  <input
                    type="text"
                    value={editingSlide.ctaText || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, ctaText: e.target.value })}
                    placeholder="Explore Courses"
                    className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface"
                  />
                </div>
                <div>
                  <label className="block font-bold text-on-surface mb-1">Primary CTA Destination</label>
                  <input
                    type="text"
                    value={editingSlide.ctaLink || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, ctaLink: e.target.value })}
                    placeholder="#courses-catalog"
                    className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface mb-1">Secondary CTA Label</label>
                  <input
                    type="text"
                    value={editingSlide.secondaryCtaText || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, secondaryCtaText: e.target.value })}
                    placeholder="Start Enquiry"
                    className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface"
                  />
                </div>
                <div>
                  <label className="block font-bold text-on-surface mb-1">Secondary CTA Destination</label>
                  <input
                    type="text"
                    value={editingSlide.secondaryCtaLink || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, secondaryCtaLink: e.target.value })}
                    placeholder="#enquiry-form"
                    className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-on-surface mb-1">Slide Image URL</label>
                <input
                  type="url"
                  value={editingSlide.image || ''}
                  onChange={(e) => setEditingSlide({ ...editingSlide, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-on-surface mb-1">Eyebrow Badge</label>
                  <input
                    type="text"
                    value={editingSlide.badgeText || ''}
                    onChange={(e) => setEditingSlide({ ...editingSlide, badgeText: e.target.value })}
                    placeholder="Learn. Build. Create. Grow."
                    className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface"
                  />
                </div>
                <div>
                  <label className="block font-bold text-on-surface mb-1">Display Sequence Order</label>
                  <input
                    type="number"
                    min={1}
                    value={editingSlide.displayOrder || 1}
                    onChange={(e) => setEditingSlide({ ...editingSlide, displayOrder: parseInt(e.target.value) || 1 })}
                    className="w-full h-10 px-3 rounded-xl border border-border-medium text-xs text-on-surface text-center font-bold"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-border-subtle">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-on-surface">
                  <input
                    type="checkbox"
                    checked={editingSlide.published ?? true}
                    onChange={(e) => setEditingSlide({ ...editingSlide, published: e.target.checked })}
                    className="w-4 h-4 text-primary rounded"
                  />
                  <span>Active & Published on Live Homepage</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingSlide(null)}
                    className="h-10 px-4 rounded-xl border border-border-medium font-semibold hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="h-10 px-5 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold uppercase tracking-wider shadow-xs"
                  >
                    {saving ? 'Saving...' : 'Save Slide'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
