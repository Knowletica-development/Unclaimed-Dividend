import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Signup from "./pages/Auth/Signup";
import Verification from "./pages/Auth/Verification";
import Login from "./pages/Auth/Login";
import Home from "./pages/Home/Home";
import ProfilePage from "./pages/profile/ProfilePage";
import Dashboard from "./pages/Dashboard/Dashboard";
import About from "./pages/About/About";
import ContactPage from "./pages/contact/ContactPage";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/verification" element={<Verification />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
