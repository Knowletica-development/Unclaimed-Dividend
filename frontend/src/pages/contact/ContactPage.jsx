import React, { useState } from "react";

export default function ContactPage() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });

  console.log(formState)

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Transmission Data Securely Logged:", formState);
    alert("Data Node Received. Our team will initiate contact within 24 hours.");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans selection:bg-indigo-500 selection:text-white pb-16">
      
      {/* 🌟 SECTION 1: THE CONNECT MATRIX */}
      <section className="max-w-6xl mx-auto pt-24 pb-12 px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: QUICK INFRASTRUCTURE HOTLINES (40% Width) */}
          <div className="lg:col-span-5 flex flex-col justify-between h-full">
            <div>
              <span className="text-[10px] uppercase tracking-widest font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md border border-indigo-100">
                Contact Desk
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mt-4 leading-tight">
                Let's Sync Your <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-emerald-600">Asset Queries</span>
              </h1>
              <p className="mt-4 text-xs text-slate-400 font-medium leading-relaxed max-w-sm">
                Have questions regarding unclaimed dividend nodes, API integration latency, or geospatial data accuracy? Drop our infrastructure desk a line.
              </p>
            </div>

            {/* COMMUNICATIONS GRID ITEMS */}
            <div className="mt-10 space-y-6">
              {[
                { title: "Institutional Support", value: "ops@unclaimedwealth.in", label: "Response latency < 4 hours" },
                { title: "Operations HQ", value: "Gurugram, Haryana, India", label: "Cyber City Tech Zone" },
                { title: "Operational Hours", value: "09:00 - 18:00 IST", label: "Monday through Friday" }
              ].map((item, idx) => (
                <div key={idx} className="group flex flex-col border-l-2 border-slate-200 hover:border-indigo-500 pl-4 transition-all duration-300">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    {item.title}
                  </span>
                  <span className="text-sm font-bold text-slate-800 mt-1 group-hover:text-indigo-600 transition-colors">
                    {item.value}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium mt-0.5">
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: THE INQUIRY ENGINE FORM (60% Width) */}
          <div className="lg:col-span-7 bg-white p-6 md:p-8 rounded-2xl border border-slate-200/60 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.05)]">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                    placeholder="e.g. Rishabh Sharma"
                  />
                </div>
                
                <div className="flex flex-col">
                  <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Corporate Email</label>
                  <input 
                    type="email" 
                    required
                    value={formState.email}
                    onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Message Payload</label>
                <textarea 
                  rows="4"
                  required
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all shadow-inner resize-none"
                  placeholder="Describe your tracking constraints or ledger matching request..."
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all duration-300 transform active:scale-[0.98] shadow-sm shadow-slate-900/10 hover:shadow-indigo-500/20"
              >
                Transmit Message Securely
              </button>

            </form>
          </div>

        </div>
      </section>

      {/* 🌟 SECTION 2: HQ LOCATION NODE */}
      <section className="max-w-6xl mx-auto px-6 py-8 relative">
        <div className="w-full h-64 bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden relative shadow-inner flex items-center justify-center">
          
          {/* Static Map Background Simulation (Perfect clean design framework grid) */}
          <div className="absolute inset-0 opacity-30 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:3rem_3rem]" />
          
          <div className="relative text-center z-10 p-4">
            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-600 animate-bounce mb-3">
              📍
            </span>
            <p className="text-xs font-bold text-slate-800">Geospatial Operations Hub Active</p>
            <p className="text-[10px] text-slate-400 mt-0.5">DLF Cyber City, Phase 3, Gurugram, HR</p>
          </div>

          {/* Floating Glass Overlay Card */}
          <div className="absolute bottom-4 right-4 bg-white/80 backdrop-blur-md border border-slate-200/60 p-3 rounded-xl max-w-xs hidden sm:block shadow-sm">
            <p className="text-[10px] font-bold text-slate-800">On-Site Infrastructure Audits</p>
            <p className="text-[9px] text-slate-400 mt-0.5 font-medium leading-relaxed">
              Institutional security verifications require pre-scheduled appointments via the corporate routing desk.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}