import React from "react";

const MetricsGrid = () => {
  // Static Premium Content Array
  const metricsData = [
    {
      metric: "₹1,46,000+ Cr",
      label: "Total Inactive Capital",
      desc: "Estimated volume of unclaimed dividends, shares, and matured insurance pools across Indian regulatory bodies.",
      badge: "National Pool",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200/60"
    },
    {
      metric: "99.4% Match",
      label: "Algorithmic Accuracy",
      desc: "Our deterministic pincode-routing mathematics ensures exact coordinate mapping with zero data distortion.",
      badge: "Precision",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200/60"
    },
    {
      metric: "24/7 Scanning",
      label: "Live Vector Feed",
      desc: "Continuous automated data parsing across corporate registries to keep asset logs refreshed in real-time.",
      badge: "Live Status",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200/60",
      hasPulse: true
    },
    {
      metric: "Bank-Grade",
      label: "Enterprise Security",
      desc: "Built on absolute encryption standards to safeguard sensitive investor demographics and corporate records.",
      badge: "Security",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200/60"
    }
  ];

  return (
    <section className="relative w-full max-w-6xl mx-auto px-6 py-16 overflow-hidden">
      
      {/* 🎯 HEADER LABEL FOR CONTEXT */}
      <div className="w-full mb-10 text-left md:text-center">
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          System Metrics & Validation Layers
        </h2>
        <p className="text-xs text-slate-400 font-semibold mt-1 uppercase tracking-wider">
          The Trust Factor — Engineered Data Integrity
        </p>
      </div>

      {/* 🎴 METRICS CARD MATRIX GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {metricsData.map((item, idx) => (
          <div
            key={idx}
            className="group relative bg-white/70 backdrop-blur-md p-6 rounded-2xl border border-slate-200/60 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_24px_-8px_rgba(99,102,241,0.12)] hover:border-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1.5 flex flex-col justify-between"
          >
            {/* Top Row: Mini Badge & Live Indicator */}
            <div className="flex justify-between items-center w-full mb-6">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${item.badgeColor}`}>
                {item.badge}
              </span>
              
              {/* If card has live pulse effect */}
              {item.hasPulse && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
                </span>
              )}
            </div>

            {/* Core Stats Representation */}
            <div>
              <div className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors duration-200 select-none">
                {item.metric}
              </div>
              <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-widest mt-1.5">
                {item.label}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-4 leading-relaxed border-t border-slate-50 pt-3 group-hover:text-slate-600 transition-colors">
                {item.desc}
              </p>
            </div>

            {/* Subtle card accent bar (Invisible default, colored on hover) */}
            <div className="absolute bottom-0 left-6 right-6 h-[2px] bg-indigo-500 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-full" />
          </div>
        ))}
      </div>

      {/* Decorative clean line integration */}
      <div className="w-full mt-16 border-b border-slate-200/50" />
    </section>
  );
};

export default MetricsGrid;