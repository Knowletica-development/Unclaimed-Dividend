import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import { logout } from "../redux/userSlice";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const userState = useSelector((state) => state?.user);
  const user = userState?.user;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const handleLogout = async () => {
    try {
      const { data } = await axiosInstance.post("/user/logout");
      if (data?.success) {
        dispatch(logout());

        navigate("/login");
      }
    } catch (err) {
      console.error(
        "Logout failed:",
        err?.response?.data?.message || err.message
      );
      alert("Logout failed. Try again.");
    }
  };
  return (
    <nav className="w-full bg-gray-900 text-white shadow-md">
      <div className="max-w-8xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-green-400">
          Dividend Portal
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:text-green-400 transition">
            Home
          </Link>
          <Link to="/about" className="hover:text-green-400 transition">
            About
          </Link>
          <Link to="/contact" className="hover:text-green-400 transition">
            Contact
          </Link>

          <div ref={dropdownRef} className="relative">
            {user ? (
              <>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 bg-gray-800 px-3 py-2 rounded-full hover:bg-gray-700 transition"
                >
                  <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center font-bold text-black">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="font-medium">{user.name}</span>
                  <ChevronDown size={18} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-3 w-48 bg-gray-800 rounded-lg shadow-lg overflow-hidden z-50">
                    <Link
                      to="/profile"
                      className="block px-4 py-3 hover:bg-gray-700 transition"
                    >
                      My Profile
                    </Link>
                    <Link
                      to="/dashboard"
                      className="block px-4 py-3 hover:bg-gray-700 transition"
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-400 hover:bg-gray-700 transition"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              // Agar logged out ho to Login / Register show karo
              <div className="flex gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-800 px-6 py-4 space-y-4">
          <Link to="/" className="block hover:text-green-400">
            Home
          </Link>
          <Link to="/about" className="block hover:text-green-400">
            About
          </Link>
          <Link to="/contact" className="block hover:text-green-400">
            Contact
          </Link>

          <div className="border-t border-gray-700 pt-4">
            {user ? (
              <>
                {/* User logged in */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center font-bold text-black">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="font-medium">{user.name}</span>
                </div>

                <Link
                  to="/profile"
                  className="block px-2 py-2 rounded hover:bg-gray-700"
                >
                  My Profile
                </Link>
                <Link
                  to="/dashboard"
                  className="block px-2 py-2 rounded hover:bg-gray-700"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block cursor-pointer w-full text-left px-2 py-2 text-red-400 hover:bg-gray-700 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {/* User not logged in */}
                <Link
                  to="/login"
                  className="block px-2 py-2 rounded bg-green-500 text-white text-center mb-2 hover:bg-green-600"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-2 py-2 rounded bg-blue-500 text-white text-center hover:bg-blue-600"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
