import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, User, LayoutDashboard, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../utils/axiosInstance";
import { logout } from "../redux/userSlice";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  
  const userState = useSelector((state) => state?.user);
  const user = userState?.user;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Close dropdown on outside click matrix
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
  const timer = setTimeout(() => {
    setMobileOpen(false);
  }, 0);

  return () => clearTimeout(timer); 
}, [location]);

  const handleLogout = async () => {
    try {
      const { data } = await axiosInstance.post("/user/logout");
      if (data?.success) {
        dispatch(logout());
        navigate("/login");
      }
    } catch (err) {
      console.error("Logout extraction failed:", err?.response?.data?.message || err.message);
      alert("Session termination failed. Try again.");
    }
  };

  // Helper component for uniform link rendering logic
 

  return (
    <nav className="sticky top-0 w-full bg-slate-900/90 backdrop-blur-md text-slate-100 border-b border-slate-800/80 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* 🏢 BRAND LOGO */}
        <Link to="/" className="flex items-center gap-2 group select-none">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center font-black text-xs text-white shadow-sm shadow-indigo-500/20">
            D
          </div>
          <span className="text-sm font-black tracking-tight text-white group-hover:text-slate-200 transition-colors">
            Dividend<span className="text-indigo-400 font-medium">Portal</span>
          </span>
        </Link>

        {/* 💻 DESKTOP DYNAMIC NAVIGATION PANEL */}
        <div className="hidden md:flex items-center gap-8">
          <div className="flex items-center gap-6">
            <NavLink to="/">Home</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
          </div>

          {/* INTERNAL ROUTING SHUNT (AUTHENTICATED VS GUEST) */}
          <div className="h-4 w-[1px] bg-slate-800" />

          <div ref={dropdownRef} className="relative">
            {user ? (
              <>
                {/* USER CONTROL CONSOLE KNOB */}
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2.5 bg-slate-950/40 border border-slate-800 hover:border-slate-700/80 pl-2 pr-3 py-1 rounded-full transition-all duration-200"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center font-bold text-xs text-white shadow-inner">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-xs font-bold text-slate-300 max-w-[100px] truncate">{user.name}</span>
                  <ChevronDown size={14} className={`text-slate-500 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {/* THE PREMIUM DROPDOWN SHIELD */}
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden p-1.5 animate-in fade-in slide-in-from-top-1 duration-150 z-50">
                    <div className="px-3 py-2 border-b border-slate-900 mb-1">
                      <p className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Signed in as</p>
                      <p className="text-xs font-semibold text-slate-300 truncate mt-0.5">{user.email || "User Node"}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-all"
                    >
                      <LayoutDashboard size={14} /> Dashboard
                    </Link>
                    
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-900 rounded-lg transition-all"
                    >
                      <User size={14} /> Profile Settings
                    </Link>

                    <div className="h-[1px] bg-slate-900 my-1" />
                    
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 rounded-lg transition-all text-left cursor-pointer"
                    >
                      <LogOut size={14} /> Terminate Session
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* GUEST ROUTE ACTIONS BUTTONSET */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl transition shadow-sm shadow-indigo-600/10"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 📱 MOBILE NAVIGATION HAMBURGER */}
        <button
          className="md:hidden text-slate-400 hover:text-white transition p-1"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* 📱 MOBILE SIDE DRAWER LAYOUT */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/98 px-6 py-4 space-y-4 animate-in fade-in duration-200">
          <div className="space-y-3 flex flex-col">
            <Link to="/" className="text-xs font-bold uppercase tracking-wider text-slate-400">Home</Link>
            <Link to="/about" className="text-xs font-bold uppercase tracking-wider text-slate-400">About</Link>
            <Link to="/contact" className="text-xs font-bold uppercase tracking-wider text-slate-400">Contact</Link>
          </div>

          <div className="border-t border-slate-900 pt-4">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 px-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </div>
                  <span className="text-xs font-bold text-slate-300">{user.name}</span>
                </div>
                
                <Link to="/dashboard" className="block text-xs font-semibold text-slate-400 px-2 py-1.5 rounded hover:bg-slate-900">Dashboard</Link>
                <Link to="/profile" className="block text-xs font-semibold text-slate-400 px-2 py-1.5 rounded hover:bg-slate-900">My Profile</Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-xs font-bold text-rose-400 px-2 py-1.5 rounded hover:bg-rose-950/20 cursor-pointer"
                >
                  Terminate Session
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link to="/login" className="text-xs font-bold text-center text-slate-300 border border-slate-800 py-2.5 rounded-xl">Sign In</Link>
                <Link to="/register" className="text-xs font-bold text-center bg-indigo-600 text-white py-2.5 rounded-xl">Get Started</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

const NavLink = ({ to, children, currentPath }) => {
  const isActive = currentPath === to;
  return (
    <Link
      to={to}
      className={`text-xs font-bold uppercase tracking-wider transition-all duration-200 hover:text-white ${
        isActive ? "text-indigo-400" : "text-slate-400"
      }`}
    >
      {children}
    </Link>
  );
};