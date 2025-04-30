import React from "react";
import "./Admin.css";
import { Navigate } from "react-router-dom";

function Admin_header() {
  const handleLogout = () => {
    // Clear all authentication data
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    // Redirect to login page
    Navigate("/admin");
  };
  return (
    <>
      <header className="Admin_Header">
        <nav>
          <h2>Admin Pannel</h2>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </nav>
      </header>
    </>
  );
}

export default Admin_header;
