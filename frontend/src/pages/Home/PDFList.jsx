import React from "react";
import { FileText, ExternalLink, Download } from "lucide-react";

const PDFList = () => {
  const pdfs = [
    {
      title: "Apollo Hospitals",
      url: "https://res.cloudinary.com/dcll0n88n/image/upload/v1779883757/Apollo_Hospitals_htihzn.pdf",
    },
    {
      title: "Bombay Bhurma Trading 2021",
      url: "https://res.cloudinary.com/dcll0n88n/image/upload/v1779883931/Bombay_Bhurma_Trading_Corporation_2021_eh26az.pdf",
    },
    {
      title: "Bosh Ltd. 2015-2016",
      url: "https://res.cloudinary.com/dcll0n88n/image/upload/v1779883955/Bosh_Ltd._2015-2016_uwisf1.pdf",
    },
    {
      title: "Container Corp of India",
      url: "https://res.cloudinary.com/dcll0n88n/image/upload/v1779883979/Container_Corporation_of_India_no94ew.pdf",
    },
    {
      title: "Dr. Reddy 2014-2015",
      url: "https://res.cloudinary.com/dcll0n88n/image/upload/v1779884004/Dr._Reddy_2014-2015_y7amz6.pdf",
    },
    {
      title: "Good Year 2013-2014",
      url: "https://res.cloudinary.com/dcll0n88n/image/upload/v1779884056/Good_Year_2013-2014_cwdw3r.pdf",
    },
    {
      title: "HDFC Unclaimed Div 2013",
      url: "https://res.cloudinary.com/dcll0n88n/image/upload/v1779884076/HDFC_BANK_Unclaimed_Divinded_for_2013_hw4qes.pdf",
    },
    {
      title: "Heritage Foods",
      url: "https://res.cloudinary.com/dcll0n88n/image/upload/v1779884099/Heritage_foods_zwanrb.pdf",
    },
    {
      title: "Ingersol Rand 2010",
      url: "https://res.cloudinary.com/dcll0n88n/image/upload/v1779884224/Ingersol_Rand_2010_m4isac.pdf",
    },
    {
      title: "Siemens Ltd.",
      url: "https://res.cloudinary.com/dcll0n88n/image/upload/v1779884273/Siemens_Ltd._cbkve4.pdf",
    },
    {
      title: "Sun Pharma",
      url: "https://res.cloudinary.com/dcll0n88n/image/upload/v1779884273/sunpharma_edhjrt.pdf",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-8 text-white">
      <h1 className="text-3xl font-bold mb-8 text-center text-blue-400">
        Company Reports Archive
      </h1>
      <div className="max-w-4xl mx-auto grid gap-4">
        {pdfs.map((pdf, index) => (
          <div
            key={index}
            className="group flex items-center justify-between p-4 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all border border-slate-600 hover:border-blue-500"
          >
            <div className="flex items-center gap-4">
              <FileText className="text-blue-400 w-6 h-6" />
              <span className="font-medium text-lg">{pdf.title}</span>
            </div>
            <a
              href={pdf.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              View PDF <ExternalLink size={16} />
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PDFList;
