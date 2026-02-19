import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "../../redux/userSlice";

const Home = () => {
  const [dividends, setDividends] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  const dispatch = useDispatch();
  //   const { user, } = useSelector((state) => state.user);

  const groupDividendsByInvestor = (data) => {
    const grouped = {};

    data.forEach((item) => {
      const key = `${item["Investor Name"]}-${item["Company Name"]}`;

      if (!grouped[key]) {
        grouped[key] = {
          ...item,
        };
      } else {
        grouped[key]["Amount"] += item["Amount"];
        grouped[key]["No. Of Shares"] += item["No. Of Shares"];
        grouped[key]["Value"] += item["Value"];
      }
    });

    return Object.values(grouped);
  };

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
  }, [debouncedSearch, companyFilter]);

  const fetchDividends = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append("page", page);
      params.append("limit", limit);

      if (debouncedSearch) params.append("search", debouncedSearch);
      if (companyFilter) params.append("company", companyFilter);

      const { data } = await axiosInstance.get(
        `/user/dividend-data?${params.toString()}`
      );

      const processedData = debouncedSearch
        ? groupDividendsByInvestor(data.data)
        : data.data;

      setDividends(processedData);
      setTotalPages(data.totalPages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDividends();
  }, [page, debouncedSearch, companyFilter]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-6 md:px-16 lg:px-24">
      {/* Header */}
      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-center mb-8">
        Dividend Portal
      </h1>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
        <input
          type="text"
          placeholder="Search by Investor Name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm w-full md:w-1/2 transition"
        />
        <input
          type="text"
          placeholder="Filter by Company Name..."
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          className="px-5 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none shadow-sm w-full md:w-1/2 transition"
        />
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center text-gray-500 mb-6 text-lg">
          Loading data, please wait...
        </div>
      )}
      {/* Father/Husband Name */}
      {/* Dividend List */}
      <div className="flex flex-col gap-6">
        {dividends.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 md:p-8 transition transform hover:-translate-y-1 hover:shadow-2xl"
          >
            <div className="flex flex-col md:flex-row md:justify-between gap-4 md:gap-12">
              {/* Left Section */}
              <div className="flex flex-col gap-2 md:w-1/2">
                <p className="text-lg font-semibold text-gray-700">
                  Investor:{" "}
                  <span className="text-gray-900">{item["Investor Name"]}</span>
                </p>
                <p className="text-lg font-semibold text-gray-700">
                  Father/Husband Name:{" "}
                  <span className="text-gray-900">
                    {item["Father/Husband Name"]}
                  </span>
                </p>
                <p className="text-md text-gray-600">
                  Company:{" "}
                  <span className="text-gray-800">{item["Company Name"]}</span>
                </p>
                <p className="text-md text-gray-600">
                  Address:{" "}
                  <span className="text-gray-800">{item["Address"]}</span>
                </p>
              </div>

              {/* Right Section */}
              <div className="flex flex-col gap-2 md:w-1/2">
                <p className="text-lg text-blue-600 font-bold">
                  Amount: ₹{item["Amount"]}
                </p>
                <p className="text-md text-green-600 font-semibold">
                  Dividend: ₹{item["Dividend Declared"]}
                </p>
                <p className="text-md text-gray-700">
                  Shares: {item["No. Of Shares"].toFixed(2)}
                </p>
                <p className="text-md text-gray-700">
                  Share Price: ₹{item["Current Share Price"]}
                </p>
                <p className="text-md text-gray-700 font-semibold">
                  Value: ₹{Number(item["Value"]).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-4 mt-10 flex-wrap">
        <button
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
          className="px-6 cursor-pointer py-3 bg-blue-600 text-white rounded-xl disabled:bg-gray-300 transition hover:bg-blue-700"
        >
          Previous
        </button>
        <span className="px-6 py-3 rounded-xl bg-gray-200 text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
          className="px-6 cursor-pointer py-3 bg-blue-600 text-white rounded-xl disabled:bg-gray-300 transition hover:bg-blue-700"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Home;
