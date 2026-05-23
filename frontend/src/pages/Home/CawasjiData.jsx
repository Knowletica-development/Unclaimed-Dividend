import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";

const formatFullName = (item) => {
  const first = item["Investor First Name"] || "";
  const middle = item["Investor Middle Name"] || "";
  const last = item["Investor Last Name"] || "";
  return (
    `${first} ${middle} ${last}`.replace(/\s+/g, " ").trim() ||
    "Unknown Investor"
  );
};

const formatFatherName = (item) => {
  const first = item["Father/Husband First Name"] || "";
  const middle = item["Father/Husband Middle Name"] || "";
  const last = item["Father/Husband Last Name"] || "";
  const full = `${first} ${middle} ${last}`.replace(/\s+/g, " ").trim();
  return full === "NA" || !full ? "" : full;
};

const CawasjiData = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [pincodeFilter, setPincodeFilter] = useState("");

  const [analytics, setAnalytics] = useState({
    totalSharesTracked: 0,
    totalUniqueCompanies: 0,
    withAadharCount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/user/cawasji-details", {
          params: {
            page: page,
            limit: 10,
            search: search || companyFilter || pincodeFilter || "",
          },
        });

        if (response.data && response.data.success) {
          const fetchedData = response.data.data;
          setRecords(fetchedData);
          setTotalRecords(response.data.meta.totalRecords);
          setTotalPages(response.data.meta.totalPages);

          const shares = fetchedData.reduce(
            (acc, curr) => acc + (Number(curr["Shares transferred"]) || 0),
            0,
          );
          const uniqueCos = new Set(
            fetchedData.map((curr) => curr["Unit"]).filter(Boolean),
          ).size;
          const validAadhar = fetchedData.filter(
            (curr) => curr["Aadhar Number"] && curr["Aadhar Number"] !== "0",
          ).length;

          setAnalytics({
            totalSharesTracked: shares,
            totalUniqueCompanies: uniqueCos,
            withAadharCount: validAadhar,
          });
        }
      } catch (error) {
        console.error("Error loading Cawasji financial assets:", error);
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [page, search, companyFilter, pincodeFilter]);
  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 font-sans">
      {/* 🌟 HERO BANNER HEADER SECTION */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-800 to-slate-900 text-white py-12 px-6 md:px-16 text-center shadow-md">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-3">
          Investor Wealth Recovery Portal
        </h1>
        <p className="text-blue-100 max-w-2xl mx-auto text-sm md:text-base font-light">
          Track unclaimed dividends, calculate potential asset returns, and map
          financial recovery data seamlessly.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {/* 📊 FEATURE 1: LIVE ANALYTICS METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between transition hover:shadow-md">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Shares Tracked
              </span>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                {analytics.totalSharesTracked.toLocaleString("en-IN")}
              </h3>
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-fit mt-3">
              Live Verified Recovery Units
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between transition hover:shadow-md">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Active Corporate Units
              </span>
              <h3 className="text-2xl font-black text-indigo-600 mt-1">
                {analytics.totalUniqueCompanies}
              </h3>
            </div>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md w-fit mt-3">
              Distinct Establishments
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between transition hover:shadow-md">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Ledger Ledger Entries
              </span>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                {totalRecords}
              </h3>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md w-fit mt-3">
              Across Current Criteria
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between transition hover:shadow-md">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Identified Profiles
              </span>
              <h3 className="text-xl font-bold text-slate-800 mt-1 flex items-baseline gap-1">
                <span className="text-emerald-600">
                  {analytics.withAadharCount}
                </span>
                <span className="text-slate-300 text-sm">/</span>
                <span className="text-slate-500 text-sm">{records.length}</span>
              </h3>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md w-fit mt-3">
              KYC/Identity Tracked
            </span>
          </div>
        </div>

        {/* 🔍 FEATURE 2: ADVANCED OMNI-FILTER BAR */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Investor First/Last Name
              </label>
              <input
                type="text"
                placeholder="Search investor name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-sm text-slate-700 transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Corporate Entity / Unit
              </label>
              <input
                type="text"
                placeholder="Filter by company (e.g. Tata)..."
                value={companyFilter}
                onChange={(e) => {
                  setCompanyFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-sm text-slate-700 transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Postal Pincode
              </label>
              <input
                type="text"
                placeholder="Enter Pin Code..."
                value={pincodeFilter}
                onChange={(e) => {
                  setPincodeFilter(e.target.value);
                  setPage(1);
                }}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-sm text-slate-700 transition"
              />
            </div>
          </div>
        </div>

        {/* ⏳ LOADING STATE INDICATOR */}
        {loading && (
          <div className="flex items-center justify-center gap-2 text-slate-500 my-12">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">
              Reindexing live financial dataset...
            </span>
          </div>
        )}

        {/* 📋 ASSET CARDS CONTENT GRID AREA */}
        {!loading && records.length === 0 ? (
          <div className="text-center bg-white border border-dashed rounded-2xl p-12 text-slate-400 font-medium">
            No dynamic investor records found matching the current criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 mt-4">
            {!loading &&
              records.map((item, idx) => {
                const investorName = formatFullName(item);
                const fatherName = formatFatherName(item);

                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md"
                  >
                    {/* Left Column: Profile Particulars */}
                    <div className="space-y-1.5 max-w-xl w-full">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                          {investorName}
                        </h2>
                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                          IEPF Unclaimed
                        </span>
                      </div>

                      {fatherName && (
                        <p className="text-xs text-slate-400 font-medium">
                          S/O or W/O:{" "}
                          <span className="text-slate-600">{fatherName}</span>
                        </p>
                      )}

                      <p className="text-sm text-slate-600 font-medium">
                        Corporate Unit:{" "}
                        <span className="text-blue-600 font-semibold">
                          {item["Unit"] || "N/A"}
                        </span>
                      </p>

                      <p className="text-xs text-slate-400 line-clamp-1">
                        📍 {item["Address"]}{" "}
                        {item["Pin Code"] ? `- ${item["Pin Code"]}` : ""}
                      </p>

                      <div className="pt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-500">
                        <div>
                          <span className="font-semibold text-slate-400">
                            Folio:
                          </span>{" "}
                          {item["Folio Number"]}
                        </div>
                        <div>
                          <span className="font-semibold text-slate-400">
                            Account Ref:
                          </span>{" "}
                          {item["DP Id-Client Id-Account Number"] || "N/A"}
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Dynamic Asset Calculations */}
                    <div className="grid grid-cols-2 md:flex items-center gap-4 md:gap-8 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                      <div className="text-left md:text-right">
                        <p className="text-xs font-semibold text-slate-400 uppercase">
                          Shares Volume
                        </p>
                        <p className="text-base font-black text-slate-800">
                          {(
                            Number(item["Shares transferred"]) || 0
                          ).toLocaleString("en-IN")}
                        </p>
                      </div>

                      <div className="text-left md:text-right">
                        <p className="text-xs font-semibold text-slate-400 uppercase">
                          Country / State
                        </p>
                        <p className="text-sm font-bold text-slate-700 truncate max-w-[120px]">
                          {item["State"] || "India"}
                        </p>
                      </div>

                      <div className="text-left md:text-right">
                        <p className="text-xs font-semibold text-slate-400 uppercase">
                          Joint Holder
                        </p>
                        <p className="text-sm font-bold text-slate-600">
                          {item["Joint Holder Name"] || "No"}
                        </p>
                      </div>

                      <div className="text-left md:text-right">
                        <p className="text-xs font-semibold text-slate-400 uppercase">
                          Target Status
                        </p>
                        <p className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded w-fit md:ml-auto">
                          Tracked 📈
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}

        {/* 📑 PAGINATION NAVIGATION CONTROLS */}
        {!loading && records.length > 0 && (
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-200">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl shadow-sm transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            <span className="text-xs font-bold text-slate-500">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-xl shadow-sm transition hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CawasjiData;
