import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const OTP_LENGTH = 6;

const Verification = () => {
  const navigate = useNavigate();
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const inputRefs = useRef([]);

  // ✅ allow alphanumeric + auto focus
  const handleChange = (value, index) => {
    if (!/^[a-zA-Z0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.toUpperCase(); // normalize
    setOtp(newOtp);
    setError("");

    if (value && index < OTP_LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // ✅ backspace = previous focus
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  // ✅ paste full alphanumeric OTP
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\s+/g, "")
      .slice(0, OTP_LENGTH);

    if (!/^[a-zA-Z0-9]+$/.test(pastedData)) return;

    const newOtp = pastedData.toUpperCase().split("");
    setOtp(newOtp);

    newOtp.forEach((char, i) => {
      if (inputRefs.current[i]) {
        inputRefs.current[i].value = char;
      }
    });

    inputRefs.current[newOtp.length - 1]?.focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ✅ correct validation
    if (otp.some((char) => char === "")) {
      return setError("Please enter complete activation code");
    }

    const activation_code = otp.join("");

    try {
      setLoading(true);
      const { data } = await axiosInstance.post("/user/activate-user", {
        activation_code,
      });

      if (data.success) {
        setSuccess(data.message);
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
      <div className="bg-gray-800 w-full max-w-md rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-white text-center mb-2">
          Verify Your Email
        </h2>
        <p className="text-gray-400 text-center mb-6">
          Enter the 6-character activation code
        </p>

        <form onSubmit={handleSubmit}>
          <div
            className="flex justify-between gap-2 mb-6"
            onPaste={handlePaste}
          >
            {otp.map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-14 text-center text-xl font-bold uppercase
                rounded-lg bg-gray-700 text-white border border-gray-600
                focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ))}
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center mb-3">{error}</p>
          )}
          {success && (
            <p className="text-green-500 text-sm text-center mb-3">{success}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700
            text-white font-semibold py-3 rounded-lg transition disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verification;
