'use client';

export default function LegendPanel() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <div
          className="w-3 h-3 rounded-full bg-teal-500"
          style={{ boxShadow: '0 0 8px rgba(20, 184, 166, 0.6)' }}
        />
        <span className="text-xs text-neutral-400">ভোটার ঘনত্ব</span>
      </div>
      <p className="text-[11px] text-neutral-600 leading-relaxed">
        প্রতিটি বিন্দু প্রায় 5,000 নিবন্ধিত ভোটার প্রতিনিধিত্ব করে
      </p>
    </div>
  );
}
