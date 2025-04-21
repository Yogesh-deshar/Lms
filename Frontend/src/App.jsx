import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Login from "./User/Login";
import Header from "./User/Header";
import React from "react";
import Button from "react-bootstrap/Button";

import Index from "./User/Index";
import About from "./User/About";
import Contact from "./User/Contact";
import Booked from "./User/Booked";
import Class from "./User/Class";
import UserProfile from "./User/UserProfile";
import UpdateProfile from "./User/UpdateProfile";
import Admin_login from "./Admin/Admin_login";
import Admin_sidebar from "./Admin/Admin_sidebar";
import Admin_index from "./Admin/Admin_index";
import Admin_Alrady_booked_book from "./Admin/Admin_Alrady_booked_book";
import Admin_add_book from "./Admin/Admin_add_book";
import Admin_manage_book from "./Admin/Admin_manage_book";
import Regester from "./User/Regester";

// Create a context for authentication
export const AuthContext = React.createContext();

function App() {
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem("user"));

  const logout = async () => {
    try {
      const response = await fetch("/api/User/logout", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.removeItem("user");
        setIsLogged(false);
        alert(data.message || "Logged out successfully");
        window.location.href = "/login";
      } else {
        console.error("Logout failed:", response.status, response.statusText);
        alert("Failed to logout. Please try again.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("An error occurred during logout. Please try again.");
    }
  };

  return (
    <AuthContext.Provider value={{ isLogged, setIsLogged, logout }}>
      <Router>
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/booked" element={<Booked />} />
          <Route path="/class" element={<Class />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/login" element={<Login />} />
          <Route path="/regester" element={<Regester />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<Admin_login />} />
          <Route path="/admin/dashboard" element={<Admin_index />} />
          <Route
            path="/admin/booked-books"
            element={<Admin_Alrady_booked_book />}
          />
          <Route path="/admin/add-book" element={<Admin_add_book />} />
          <Route path="/admin/manage-books" element={<Admin_manage_book />} />

          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
