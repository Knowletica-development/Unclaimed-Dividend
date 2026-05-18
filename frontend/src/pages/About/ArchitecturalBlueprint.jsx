import React from "react";

const ArchitecturalBlueprint = () => {
  const pipelineSteps = [
    {
      stepNum: "01",
      phase: "Ingestion Phase",
      title: "Automated Shard Aggregation",
      desc: "Our background cron-nodes query national data repositories, IEPF filings, and corporate registries to continuously ingest raw, unstructured fractional dividend asset logs into an immutable data lake.",
      techStack: "Data Scrapers • Data Lake • Shard Clusters",
      matrixCode: "RAW_DATA_HEX_7F02"
    },
    {
      stepNum: "02",
      phase: "Processing Phase",
      title: "Geospatial Vector Math Mapping",
      desc: "Raw demographic strings and corrupted pincode fields are run through our custom deterministic algorithm. It calculates spatial offsets, runs geometric corrections, and converts text into absolute latitude and longitude coordinates.",
      techStack: "Pincode Routing Math • GIS Encoding • Latitude Offsets",
      matrixCode: "LAT_LNG_OFFSET_CALC"
    },
    {
      stepNum: "03",
      phase: "Delivery Phase",
      title: "High-Fidelity Heatmap Execution",
      desc: "The processed geographic clusters are streamed directly into your dashboard viewport via React Leaflet layers. The front-end renders responsive markers, deep hot-spots, and instant popup disclosures with zero network latency.",
      techStack: "OpenStreetMap API • Spatial Clusters • Leaflet Viewport",
      matrixCode: "MAP_CONTAINER_RENDER"
    }
  ];

  return (
    <section className="relative w-full max-w-5xl mx-auto px-6 py-16 mb-20 overflow-hidden">
      
      {/* 🎯 HEADER SECTION */}
      <div className="w-full mb-16 text-left md:text-center">
        <span className="text-[10px] uppercase tracking-widest font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-md border border-indigo-100">
          The Architecture
        </span>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-4">
          Engineered Data Processing Pipeline
        </h2>
        <p className="text-xs text-slate-400 font-semibold mt-1">
          How raw registry records translate into high-fidelity map nodes
        </p>
      </div>

      {/* 🧬 PIPELINE TIMELINE CONTAINER */}
      <div className="relative flex flex-col gap-12 md:gap-8 z-10">
        
        {/* 🛠️ MIDDLE VERTICAL CONNECTIVITY LINE (Hidden on Mobile, Perfect on Desktop) */}
        <div className="absolute left-[39px] md:left-1/2 top-4 bottom-4 w-[2px] bg-gradient-to-b from-indigo-500 via-emerald-500 to-slate-200 -translate-x-1/2 hidden md:block opacity-40" />

        {pipelineSteps.map((step, idx) => {
          const isEven = idx % 2 === 0;
          return (
            <div 
              key={idx} 
              className={`flex flex-col md:flex-row w-full items-center justify-between group relative ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              
              {/* 📦 LEFT/RIGHT CONTENT BOX */}
              <div className="w-full md:w-[44%] bg-white border border-slate-200/70 p-6 rounded-2xl shadow-[0_2px_6px_rgba(0,0,0,0.02)] group-hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] group-hover:border-indigo-500/20 transition-all duration-300 transform group-hover:-translate-y-1 z-20">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest">
                    {step.phase}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-slate-300 group-hover:text-slate-400 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 transition-colors">
                    {step.matrixCode}
                  </span>
                </div>
                
                <h3 className="text-base font-bold text-slate-800 tracking-tight group-hover:text-slate-900 transition-colors">
                  {step.title}
                </h3>
                
                <p className="text-xs text-slate-500 font-medium mt-3 leading-relaxed">
                  {step.desc}
                </p>

                {/* Tech Badges Row */}
                <div className="mt-4 pt-3 border-t border-slate-50 flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-slate-400">
                  <span className="text-indigo-500/80">Engine:</span> {step.techStack}
                </div>
              </div>

              {/* 🎯 CENTRAL BADGE POINTER */}
              <div className="absolute left-[20px] md:left-1/2 top-6 md:top-1/2 w-10 h-10 rounded-xl bg-slate-900 border-4 border-white text-white flex items-center justify-center font-black text-xs shadow-md transform -translate-x-1/2 -translate-y-1/2 z-30 group-hover:bg-indigo-600 group-hover:scale-110 transition-all duration-300 select-none">
                {step.stepNum}
              </div>

              {/* 💨 EMPTY BALANCING BOX FOR SYMMETRY ON DESKTOP */}
              <div className="hidden md:block w-[44%]" />

            </div>
          );
        })}
      </div>

      {/* 🏁 FINAL ARCHITECTURE FOOTER OVERLAY */}
      <div className="w-full mt-20 text-center relative z-10">
        <div className="inline-block bg-slate-50 border border-slate-200/80 px-4 py-2 rounded-xl text-[11px] font-bold text-slate-500 shadow-sm backdrop-blur-sm select-none">
          ⚡ Pipeline Latency Status: <span className="text-emerald-600 font-extrabold">~42ms (Optimal)</span>
        </div>
      </div>

    </section>
  );
};

export default ArchitecturalBlueprint;