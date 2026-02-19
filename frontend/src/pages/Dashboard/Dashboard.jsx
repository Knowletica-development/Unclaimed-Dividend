import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const Dashboard = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [viewClaim, setViewClaim] = useState(null);

  const [form, setForm] = useState({
    folioOrDpId: "",
    panNumber: "",
    aadharNumber: "",
    fullName: "",
    address: "",
    companyName: "",
    CIN: "",
    dividendYear: "",
    amount: "",
    bankIFSC: "",
    idProof: null,
    shareCertificate: null,
    cancelCheque: null,
    indemnityBond: null,
  });

  const fetchMyClaims = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/unclaimedDividend/my-claim");
      setClaims(res?.data?.data ?? []);
    } catch (err) {
      const message = err?.response?.data?.message;
      console.error(message);
      setClaims([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyClaims();
  }, []);

  const handleView = (claim) => {
    setViewClaim(claim);
  };

  // Handler to close modal
  const handleCloseModal = () => {
    setViewClaim(null);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setForm({ ...form, [name]: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const fd = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value) fd.append(key, value);
    });

    try {
      setLoading(true);

      const { data } = editingId
        ? await axiosInstance.put(
            `/unclaimedDividend/update/${editingId}`,
            fd,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
        : await axiosInstance.post("/unclaimedDividend/create", fd, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

      if (data.success) {
        setSuccessMessage(data?.message || "Claim processed successfully");

        setForm({
          folioOrDpId: "",
          panNumber: "",
          aadharNumber: "",
          fullName: "",
          address: "",
          companyName: "",
          CIN: "",
          dividendYear: "",
          amount: "",
          bankIFSC: "",
          idProof: null,
          shareCertificate: null,
          cancelCheque: null,
          indemnityBond: null,
        });

        setEditingId(null);
        fetchMyClaims();
      }
    } catch (err) {
      setErrorMessage(
        err?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (claim) => {
    setEditingId(claim?._id);
    setForm((prev) => ({
      ...prev,
      folioOrDpId: claim?.folioOrDpId ?? "",
      panNumber: claim?.panNumber ?? "",
      aadharNumber: claim?.aadharNumber ?? "",
      fullName: claim?.fullName ?? "",
      address: claim?.address ?? "",
      companyName: claim?.companyName ?? "",
      CIN: claim?.CIN ?? "",
      dividendYear: claim?.dividendYear ?? "",
      amount: claim?.amount ?? "",
      bankIFSC: claim?.bankIFSC ?? "",
      idProofUrl:
        claim?.documents?.find((d) => d.type === "ID Proof")?.fileUrl ?? "",
      shareCertificateUrl:
        claim?.documents?.find((d) => d.type === "Share Certificate")
          ?.fileUrl ?? "",
      cancelChequeUrl:
        claim?.documents?.find((d) => d.type === "Cancelled Cheque")?.fileUrl ??
        "",
      indemnityBondUrl:
        claim?.documents?.find((d) => d.type === "Indemnity Bond")?.fileUrl ??
        "",
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-600 mb-6 text-center">
        Unclaimed Dividend Dashboard
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-xl border border-gray-100 
             p-8 mb-12 max-w-7xl mx-auto"
      >
        <h2 className="text-2xl font-semibold text-gray-800 mb-8">
          {editingId
            ? "Update Unclaimed Dividend Claim"
            : "Create Unclaimed Dividend Claim"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { name: "folioOrDpId", label: "Folio No / DP ID" },
            { name: "panNumber", label: "PAN Number" },
            { name: "aadharNumber", label: "Aadhar Number" },
            { name: "fullName", label: "Full Name" },
            { name: "companyName", label: "Company Name" },
            { name: "CIN", label: "CIN" },
            { name: "dividendYear", label: "Dividend Year" },
            { name: "amount", label: "Dividend Amount (₹)" },
            { name: "bankIFSC", label: "Bank IFSC Code" },
          ].map(({ name, label }) => (
            <div key={name} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-600">
                {label}
              </label>
              <input
                name={name}
                value={form[name]}
                onChange={handleChange}
                className="rounded-lg border border-gray-300 px-4 py-2.5
                     focus:outline-none focus:ring-2 focus:ring-green-500
                     focus:border-transparent transition"
              />
            </div>
          ))}

          <div className="md:col-span-2 flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-600">Address</label>
            <textarea
              name="address"
              value={form.address}
              onChange={handleChange}
              rows={3}
              className="rounded-lg border border-gray-300 px-4 py-3
                   focus:outline-none focus:ring-2 focus:ring-green-500
                   focus:border-transparent transition resize-none"
            />
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">
            Upload Documents
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { name: "idProof", label: "ID Proof" },
              { name: "shareCertificate", label: "Share Certificate" },
              { name: "cancelCheque", label: "Cancelled Cheque" },
              { name: "indemnityBond", label: "Indemnity Bond" },
            ].map(({ name, label }) => (
              <div
                key={name}
                className="border border-dashed border-gray-300 rounded-xl p-4 hover:border-green-500 transition"
              >
                <label className="block text-sm font-medium text-gray-600 mb-2">
                  {label}
                </label>

                {/* Show existing file link if editing */}
                {editingId && form[name + "Url"] && (
                  <p className="text-sm text-gray-700 mb-1">
                    Existing:{" "}
                    <a
                      href={form[name + "Url"]}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline"
                    >
                      View
                    </a>
                  </p>
                )}

                <input
                  type="file"
                  name={name}
                  onChange={handleChange}
                  className="text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-lg file:border-0
          file:bg-green-500 file:text-white
          hover:file:bg-green-600 cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="bg-green-500 hover:bg-green-600
                 text-white font-medium
                 px-8 py-3 rounded-xl
                 shadow-md hover:shadow-lg
                 transition disabled:opacity-60"
          >
            {loading
              ? "Processing..."
              : editingId
              ? "Update Claim"
              : "Submit Claim"}
          </button>
          {(successMessage || errorMessage) && (
            <div className="mt-6">
              {successMessage && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-green-700 text-sm">
                  {successMessage} !!
                </div>
              )}

              {errorMessage && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
                  {errorMessage} !!
                </div>
              )}
            </div>
          )}
        </div>
      </form>

      <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-6">
        <h2 className="text-2xl font-semibold mb-6">My Claims</h2>

        {loading && <p>Loading...</p>}

        {!claims?.length && !loading && (
          <p className="text-gray-500">No claims submitted yet.</p>
        )}

        <div className="space-y-4">
          {claims?.map((claim) => (
            <div
              key={claim?._id}
              className="bg-white rounded-xl p-4 flex justify-between items-center flex-wrap md:flex-nowrap"
            >
              <div className="flex flex-col md:flex-row md:space-x-6 space-y-1 md:space-y-0 w-full md:w-auto">
                <p className="font-semibold">{claim?.companyName}</p>
                <p className="text-sm text-gray-500">
                  {claim?.dividendYear} • ₹{claim?.amount} • Status:{" "}
                  {claim?.status}
                </p>
              </div>

              <div className="flex space-x-2 mt-2 md:mt-0">
                <button
                  onClick={() => handleView(claim)}
                  className="bg-green-500 cursor-pointer hover:bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  View
                </button>
                <button
                  onClick={() => handleEdit(claim)}
                  className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ===== Modal ===== */}
        {viewClaim && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-8 relative overflow-y-auto max-h-[90vh]">
              {/* Close Button */}
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 font-bold text-xl"
              >
                ✖
              </button>

              {/* Modal Header */}
              <h3 className="text-2xl font-bold mb-6 border-b pb-3">
                Claim Details
              </h3>

              {/* Modal Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p>
                  <strong>Folio / DP ID:</strong> {viewClaim?.folioOrDpId}
                </p>
                <p>
                  <strong>PAN:</strong> {viewClaim?.panNumber}
                </p>
                <p>
                  <strong>Aadhar:</strong> {viewClaim?.aadharNumber}
                </p>
                <p>
                  <strong>Full Name:</strong> {viewClaim?.fullName}
                </p>
                <p>
                  <strong>Company:</strong> {viewClaim?.companyName}
                </p>
                <p>
                  <strong>CIN:</strong> {viewClaim?.CIN}
                </p>
                <p>
                  <strong>Dividend Year:</strong> {viewClaim?.dividendYear}
                </p>
                <p>
                  <strong>Amount:</strong> ₹{viewClaim?.amount}
                </p>
                <p>
                  <strong>Bank IFSC:</strong> {viewClaim?.bankIFSC}
                </p>
                <p className="md:col-span-2">
                  <strong>Address:</strong> {viewClaim?.address}
                </p>
              </div>

              {/* Documents */}
              <div className="mt-6">
                <strong>Documents:</strong>
                <ul className="list-disc list-inside space-y-1 mt-2">
                  {viewClaim?.documents?.map((doc, idx) => (
                    <li key={idx}>
                      <a
                        href={doc?.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 font-medium hover:underline"
                      >
                        {doc?.type}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
