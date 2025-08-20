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
import Admin_updatebooks from "./Admin/Admin_updatebooks";
import Regester from "./User/Regester";
import Admin_booked_book from "./Admin/Admin_booked_book";
import Search from "./User/Search";
import "./App.css";
// Create a context for authentication
export const AuthContext = React.createContext();

// Protected Route component for regular users
function ProtectedRoute({ children }) {
  const user = localStorage.getItem("user");
  console.log("ProtectedRoute - Current user state:", user);

  if (!user) {
    console.log("No user found in localStorage, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  try {
    const userData = JSON.parse(user);
    if (!userData.isAuthenticated) {
      console.log("User is not authenticated, redirecting to login");
      return <Navigate to="/login" replace />;
    }
    return children;
  } catch (error) {
    console.error("Error parsing user data:", error);
    localStorage.removeItem("user");
    return <Navigate to="/login" replace />;
  }
}

// Protected Route component for admin users
function ProtectedAdminRoute({ children }) {
  const user = localStorage.getItem("user");
  console.log("ProtectedAdminRoute - Current user state:", user);

  if (!user) {
    console.log("No user found in localStorage, redirecting to admin login");
    return <Navigate to="/admin" replace />;
  }

  try {
    const userData = JSON.parse(user);
    if (!userData.isAuthenticated || !userData.isAdmin) {
      console.log(
        "User is not authenticated as admin, redirecting to admin login"
      );
      return <Navigate to="/admin" replace />;
    }
    return children;
  } catch (error) {
    console.error("Error parsing user data:", error);
    localStorage.removeItem("user");
    return <Navigate to="/admin" replace />;
  }
}

function App() {
  const isLogged = localStorage.getItem("user");
  const logout = async () => {
    const response = await fetch("/api/securewebsite/logout", {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.removeItem("user");
      alert(data.message);
      document.location = "/login";
    } else {
      console.log("could not logout: ", response);
    }
  };
  return (
    <Router>
      <Routes>
        {/* User Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route
          path="/booked"
          element={
            <ProtectedRoute>
              <Booked />
            </ProtectedRoute>
          }
        />
        <Route
          path="/class"
          element={
            <ProtectedRoute>
              <Class />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-profile"
          element={
            <ProtectedRoute>
              <UpdateProfile />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/regester" element={<Regester />} />
        <Route path="/search" element={<Search />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<Admin_login />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <Admin_index />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/booked-books"
          element={
            <ProtectedAdminRoute>
              <Admin_Alrady_booked_book />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/add-book"
          element={
            <ProtectedAdminRoute>
              <Admin_add_book />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/manage-books"
          element={
            <ProtectedAdminRoute>
              <Admin_manage_book />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/update-books"
          element={
            <ProtectedAdminRoute>
              <Admin_updatebooks />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/admin-booked-books"
          element={
            <ProtectedAdminRoute>
              <Admin_booked_book />
            </ProtectedAdminRoute>
          }
        />

        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
