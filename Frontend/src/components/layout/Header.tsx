import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MenuIcon, XIcon, UserIcon, LogOutIcon } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate("/");
    setIsMenuOpen(false);
  };
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              MedReminder
            </Link>
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="hover:text-blue-200 transition-colors">
              Home
            </Link>
            <Link to="/about" className="hover:text-blue-200 transition-colors">
              About
            </Link>
            <Link
              to="/contact"
              className="hover:text-blue-200 transition-colors"
            >
              Contact
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to={
                    user?.role === "patient"
                      ? "/patient-dashboard"
                      : "/caregiver-dashboard"
                  }
                  className="hover:text-blue-200 transition-colors"
                >
                  Dashboard
                </Link>
                <div className="flex items-center">
                  <span className="mr-2">{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded-md transition-colors"
                  >
                    <LogOutIcon size={16} className="mr-1" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded-md transition-colors"
              >
                <UserIcon size={16} className="mr-1" /> Login
              </Link>
            )}
          </nav>
          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="p-1">
              {isMenuOpen ? <XIcon size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-3 pb-2 space-y-3">
            <Link
              to="/"
              className="block hover:bg-blue-700 px-2 py-1 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/about"
              className="block hover:bg-blue-700 px-2 py-1 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link
              to="/contact"
              className="block hover:bg-blue-700 px-2 py-1 rounded"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            {isAuthenticated ? (
              <>
                <Link
                  to={
                    user?.role === "patient"
                      ? "/patient-dashboard"
                      : "/caregiver-dashboard"
                  }
                  className="block hover:bg-blue-700 px-2 py-1 rounded"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <div className="flex items-center justify-between px-2 py-1">
                  <span>{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded-md"
                  >
                    <LogOutIcon size={16} className="mr-1" /> Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/login"
                className="flex items-center bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded-md w-fit"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserIcon size={16} className="mr-1" /> Login
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};
export default Header;
