import React from "react";

const HeroMission = () => {
  return (
    <section className="relative w-full max-w-6xl mx-auto pt-28 pb-20 px-6 text-center overflow-hidden">
      
      {/* 🌌 PREMIUM BACKGROUND MESH GLOW OVERLAYS */}
      {/* Left Top Indigo Glow */}
      <div className="absolute top-[-10%] left-[15%] w-80 h-80 bg-indigo-200/30 rounded-full blur-[100px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '6s' }} />
      {/* Right Bottom Emerald Glow */}
      <div className="absolute bottom-[5%] right-[15%] w-80 h-80 bg-emerald-200/20 rounded-full blur-[100px] pointer-events-none z-0 animate-pulse" style={{ animationDuration: '8s' }} />

      {/* 💎 MAIN CONTENT WRAPPER */}
      <div className="relative z-10 flex flex-col items-center">
        
        {/* 🏷️ BADGE WITH SMOOTH HOVER EFFECT */}
        <div className="inline-flex items-center gap-2 bg-slate-900/[0.04] border border-slate-950/[0.06] hover:bg-slate-900/[0.06] hover:border-slate-950/[0.1] px-3.5 py-1.5 rounded-full transition-all duration-300 cursor-pointer group shadow-sm backdrop-blur-sm">
          <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full group-hover:scale-125 transition-transform duration-300"></span>
          <span className="text-[11px] uppercase tracking-widest font-extrabold text-slate-600 group-hover:text-slate-800 transition-colors">
            Our Core Mission
          </span>
        </div>

        {/* 👑 HEADLINE WITH DEEP GRADIENT & CRISP TYPOGRAPHY */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight mt-8 max-w-4xl mx-auto leading-[1.12] select-none">
          Bridging the Gap Between{" "}
          <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-600">
            Unclaimed Wealth
          </span>{" "}
          and Rightful Owners.
        </h1>

        {/* 📄 LEAD PARAGRAPH WITH PROFESSIONAL WEIGHT */}
        <p className="mt-8 text-base md:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium">
          Millions of dividend distributions and corporate fractional assets remain locked in legacy financial systems. 
          We engineer advanced geospatial routing algorithms to index, track, and visualize fragmented capital nodes 
          across India in real-time.
        </p>

        {/* 🖱️ MINIMAL ACTION/SCROLL INDICATOR TO MAINTAIN ENGAGEMENT */}
        <div className="mt-12 flex items-center gap-3">
          <div className="h-[1px] w-8 bg-slate-200"></div>
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Data Architecture Blueprint Below
          </span>
          <div className="h-[1px] w-8 bg-slate-200"></div>
        </div>

      </div>

      {/* 📉 BOTTOM DIVIDER LINE FOR SEAMLESS SECTION BLENDING */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-slate-200 to-transparent"></div>
    </section>
  );
};

export default HeroMission;