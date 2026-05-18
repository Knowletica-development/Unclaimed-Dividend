import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "../../redux/userSlice";
import DividendMap from "./DividendMap";

const STATE_TO_PREFIX_MAP = {
  DELHI: "11",
  HARYANA: "12",
  PUNJAB: "14",
  CHANDIGARH: "16",
  "HIMACHAL PRADESH": "17",
  "JAMMU AND KASHMIR": "18",
  "UTTAR PRADESH": "20",
  UTTARAKHAND: "28",
  RAJASTHAN: "30",
  GUJARAT: "36",
  "DADRA AND NAGAR HAVELI AND DAMAN AND DIU": "39",
  MAHARASHTRA: "40",
  GOA: "45",
  "MADHYA PRADESH": "46",
  CHHATTISGARH: "49",
  TELANGANA: "50",
  "ANDHRA PRADESH": "51",
  KARNATAKA: "56",
  "TAMIL NADU": "60",
  PUDUCHERRY: "605",
  KERALA: "67",
  LAKSHADWEEP: "682",
  "WEST BENGAL": "70",
  "ANDAMAN AND NICOBAR ISLANDS": "744",
  ODISHA: "75",
  ASSAM: "78",
  MEGHALAYA: "793",
  MANIPUR: "795",
  MIZORAM: "796",
  NAGALAND: "797",
  TRIPURA: "799",
  "ARUNACHAL PRADESH": "791",
  BIHAR: "80",
  JHARKHAND: "83",
  LADAKH: "194",
  SIKKIM: "88",
};

const Home = () => {
  const [dividends, setDividends] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const [selectedState, setSelectedState] = useState(null);

  const [analytics, setAnalytics] = useState({
    totalUnclaimedAmount: 0,
    totalSharesTracked: 0,
    totalEstimatedValue: 0,
    totalUniqueCompanies: 0,
    globalClaimedRecords: 0,
    globalUnclaimedRecords: 0,
  });

  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [pincodeFilter, setPincodeFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    setPage(1);
  }, [
    debouncedSearch,
    companyFilter,
    statusFilter,
    pincodeFilter,
    selectedState,
  ]);

  const fetchDividends = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);

      if (debouncedSearch) params.append("search", debouncedSearch);
      if (companyFilter) params.append("company", companyFilter);
      if (statusFilter) params.append("status", statusFilter);

      if (pincodeFilter) {
        params.append("pincode", pincodeFilter);
      } else if (selectedState) {
        const cleanStateName = String(selectedState).toUpperCase().trim();
        const prefix = STATE_TO_PREFIX_MAP[cleanStateName];
        if (prefix) {
          params.append("pincode", prefix);
        }
      }

      const { data } = await axiosInstance.get(
        `/user/dividend-data?${params.toString()}`,
      );

      setDividends(data.data || []);
      setTotalPages(data.meta?.totalPages || 1);
      setTotalRecords(data.meta?.totalRecords || 0);
      if (data.meta?.analyticsSummary) {
        setAnalytics(data.meta.analyticsSummary);
      }
    } catch (err) {
      console.error("Error loading frontend cards:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDividends();
  }, [
    page,
    debouncedSearch,
    companyFilter,
    statusFilter,
    pincodeFilter,
    selectedState,
  ]);

  const cleanName = (name) => {
    if (!name) return "N/A";
    return name.replace(/^0M\s*|^\s*0/, "");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
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
                Unclaimed Capital
              </span>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                ₹{analytics.totalUnclaimedAmount.toLocaleString("en-IN")}
              </h3>
            </div>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md w-fit mt-3">
              Live Verified Assets
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between transition hover:shadow-md">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Estimated Market Value
              </span>
              <h3 className="text-2xl font-black text-indigo-600 mt-1">
                ₹{analytics.totalEstimatedValue.toLocaleString("en-IN")}
              </h3>
            </div>
            <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md w-fit mt-3">
              Compounded Worth
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between transition hover:shadow-md">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Total Shares Tracked
              </span>
              <h3 className="text-2xl font-black text-slate-800 mt-1">
                {Math.round(analytics.totalSharesTracked).toLocaleString(
                  "en-IN",
                )}
              </h3>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md w-fit mt-3">
              Across {analytics.totalUniqueCompanies} Companies
            </span>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between transition hover:shadow-md">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Unclaimed vs Settled
              </span>
              <h3 className="text-xl font-bold text-slate-800 mt-1 flex items-baseline gap-1">
                <span className="text-rose-600">
                  {analytics.globalUnclaimedRecords}
                </span>
                <span className="text-slate-300 text-sm">/</span>
                <span className="text-emerald-600 text-sm">
                  {analytics.globalClaimedRecords}
                </span>
              </h3>
            </div>
            <span className="text-xs font-medium text-slate-500 bg-slate-50 px-2 py-1 rounded-md w-fit mt-3">
              Total Matches: {totalRecords}
            </span>
          </div>
        </div>

        {/* 🔍 FEATURE 2: ADVANCED OMNI-FILTER BAR */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Investor Name
              </label>
              <input
                type="text"
                placeholder="Search name (e.g. Parvati)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-sm text-slate-700 transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Corporate Entity
              </label>
              <input
                type="text"
                placeholder="Filter company (e.g. Siemens)..."
                value={companyFilter}
                onChange={(e) => setCompanyFilter(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-sm text-slate-700 transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Postal Pincode
              </label>
              <input
                type="number"
                placeholder="Enter 6-digit Pincode..."
                value={pincodeFilter}
                onChange={(e) => setPincodeFilter(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-sm text-slate-700 transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase">
                Claim Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none text-sm text-slate-700 bg-white transition"
              >
                <option value="">All Asset States</option>
                <option value="unclaimed">🔴 Unclaimed Ledger</option>
                <option value="claimed">🟢 Claimed / Settled</option>
              </select>
            </div>
          </div>
        </div>

        {/* ⏳ LOADING STATE */}
        {loading && (
          <div className="flex items-center justify-center gap-2 text-slate-500 my-12">
            <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm font-medium">
              Reindexing live financial data...
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start mt-4">
          <div className="lg:col-span-1 lg:sticky lg:top-6">
            <DividendMap
              rawDividendsData={dividends}
              selectedState={selectedState}
              currentPincodeInput={pincodeFilter}
              onStateSelect={(state) => {
                setSelectedState(state);
                if (state) {
                  setPincodeFilter("");
                }
              }}
            />
          </div>

          <div className="lg:col-span-2 space-y-4">
            {!loading && dividends.length === 0 ? (
              <div className="text-center bg-white border border-dashed rounded-2xl p-12 text-slate-400 font-medium">
                No investor records found matching the current criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {dividends.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:shadow-md"
                  >
                    {/* Left Side: Investor Profile */}
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">
                          {cleanName(item["Investor Name"])}
                        </h2>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                            item["Claim Status"] === "Unclaimed"
                              ? "bg-rose-50 text-rose-600 border border-rose-100"
                              : "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          }`}
                        >
                          {item["Claim Status"]}
                        </span>
                      </div>

                      {item["Father/Husband Name"] && (
                        <p className="text-xs text-slate-400 font-medium">
                          S/O or W/O:{" "}
                          <span className="text-slate-600">
                            {item["Father/Husband Name"]}
                          </span>
                        </p>
                      )}

                      <p className="text-sm text-slate-600 font-medium">
                        Corporate:{" "}
                        <span className="text-blue-600 font-semibold">
                          {item["Company Name"]}
                        </span>
                      </p>

                      <p className="text-xs text-slate-400 line-clamp-1">
                        📍 {item["Address"]}{" "}
                        {item["Pincode"] ? `- ${item["Pincode"]}` : ""}
                      </p>
                    </div>

                    {/* Right Side: Financial Breakdown */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:flex items-center gap-4 md:gap-8 w-full md:w-auto border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                      <div className="text-left md:text-right">
                        <p className="text-xs font-semibold text-slate-400 uppercase">
                          Capital
                        </p>
                        <p className="text-base font-black text-slate-800">
                          ₹{item["Amount"]}
                        </p>
                      </div>

                      <div className="text-left md:text-right">
                        <p className="text-xs font-semibold text-slate-400 uppercase">
                          Shares
                        </p>
                        <p className="text-sm font-bold text-slate-700">
                          {Math.round(item["No. Of Shares"])}
                        </p>
                      </div>

                      <div className="text-left md:text-right">
                        <p className="text-xs font-semibold text-slate-400 uppercase">
                          Est. Value
                        </p>
                        <p className="text-base font-black text-indigo-600">
                          ₹
                          {Number(item["Value"]).toLocaleString("en-IN", {
                            maximumFractionDigits: 0,
                          })}
                        </p>
                      </div>

                      <div className="text-left md:text-right col-span-2 sm:col-span-1">
                        <p className="text-xs font-semibold text-slate-400 uppercase">
                          Yield
                        </p>
                        <p className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded w-fit md:ml-auto">
                          {item["Dividend Yield %"]}% 📈
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        {!loading && dividends.length > 0 && (
          <div className="flex justify-between items-center mt-8 pt-4 border-t border-slate-200">
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              className="px-4 py-2 text-sm font-semibold text-slate-600 bg-white border border-slate-200 rounded-xl shadow-sm transition hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            <span className="text-xs font-bold text-slate-500">
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((prev) => prev + 1)}
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

export default Home;
