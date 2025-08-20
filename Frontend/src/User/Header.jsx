import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";

function Header() {
  const navigate = useNavigate();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);
  const [searchInput, setSearchInput] = useState("");

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    // Close profile dropdown when opening search
    if (!isSearchOpen) {
      setIsProfileOpen(false);
    }
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
    // Close search dropdown when opening profile
    if (!isProfileOpen) {
      setIsSearchOpen(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close search dropdown if clicking outside
      if (
        isSearchOpen &&
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setIsSearchOpen(false);
      }

      // Close profile dropdown if clicking outside
      if (
        isProfileOpen &&
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen, isProfileOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
      setIsSearchOpen(false);
      setSearchInput("");
    }
  };

  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Redirect to login page
    navigate("/login");
  };

  return (
    <header>
      <nav>
        <div className="container">
          <div className="logo">
            <Link to="/">Library Management</Link>
          </div>
          <div className="nav_items">
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/class">Classes</Link>
              </li>
              <li>
                <Link to="/booked">Booked Books</Link>
              </li>
            </ul>
          </div>
          <div className="prof">
            <div className="search" ref={searchRef}>
              <i
                className="fa-solid fa-magnifying-glass"
                onClick={toggleSearch}
              />
              <div className={`dropcontain ${isSearchOpen ? "show" : ""}`}>
                <form onSubmit={handleSearchSubmit}>
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                  <button type="submit">Search</button>
                </form>
              </div>
            </div>
            <div className="profile" ref={profileRef}>
              <i className="fa-solid fa-user" onClick={toggleProfile} />
              <div className={`profile_drop ${isProfileOpen ? "show" : ""}`}>
                <button onClick={() => navigate("/profile")}>Profile</button>
                <button onClick={() => navigate("/update-profile")}>
                  Update Profile
                </button>
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
