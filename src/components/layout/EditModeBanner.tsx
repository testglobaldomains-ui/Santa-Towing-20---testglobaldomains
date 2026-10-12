import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Edit3, ArrowLeft, X, Sparkles, Check } from 'lucide-react';

export default function EditModeBanner() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const isEditMode = searchParams.get('edit') === 'true';

  if (!isEditMode) return null;

  const handleExit = () => {
    searchParams.delete('edit');
    setSearchParams(searchParams);
  };

  const handleBackToAdmin = () => {
    navigate('/admin');
  };

  return (
    <div
      role="banner"
      className="sticky top-0 z-50 bg-[#015557] text-white px-4 py-2.5 shadow-md flex items-center justify-between gap-4 border-b border-teal-800"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-6 h-6 rounded bg-white/20 flex items-center justify-center shrink-0">
          <Edit3 className="w-3.5 h-3.5 text-white" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs sm:text-sm font-bold tracking-tight">
            Live Site Edit Mode Active
          </span>
          <span className="hidden sm:inline-block text-[11px] text-teal-100 bg-white/10 px-2 py-0.5 rounded">
            Click content on page to edit or return to admin console
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={handleBackToAdmin}
          className="min-h-[36px] px-3 py-1.5 bg-white text-[#015557] hover:bg-teal-50 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Admin Console</span>
        </button>

        <button
          type="button"
          onClick={handleExit}
          title="Exit Edit Mode"
          aria-label="Exit Edit Mode"
          className="min-h-[36px] min-w-[36px] p-1.5 text-teal-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
