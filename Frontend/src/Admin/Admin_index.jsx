import React, { useState, useEffect } from "react";
import "./Admin.css";
import Admin_header from "./Admin_header";
import Admin_sidebar from "./Admin_sidebar";
import { useNavigate } from "react-router-dom";

function Admin_index() {
  const [partners, setPartners] = useState([]);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user info from localStorage
    const userInfo = localStorage.getItem("user");
    if (!userInfo) {
      setError("No user information found");
      navigate("/admin");
      return;
    }

    try {
      const userData = JSON.parse(userInfo);
      if (!userData.isAuthenticated || !userData.isAdmin) {
        setError("Access denied. Admin privileges required.");
        navigate("/admin");
        return;
      }
      setUser(userData);

      // Fetch admin data
      fetch("/api/User/admin", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error("Network response was not ok");
          }
          return res.json();
        })
        .then((data) => {
          setPartners(data.trustedPartners);
        })
        .catch((error) => {
          console.error("Error fetching admin data:", error);
          setError(error.message);
        });
    } catch (error) {
      console.error("Error parsing user data:", error);
      setError("Error processing user information");
      navigate("/admin");
    }
  }, [navigate]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {partners ? (
        <div>
          <Admin_header />
          <section className="admin_contains">
            <div className="side_bar">
              <Admin_sidebar />
            </div>
            <div className="Right_contains">
              <h2>Dashbord</h2>
              <div className="right_contains_items">
                <div className="right_contains_item">
                  <i className="fa-solid fa-book" />
                  <span>0</span>
                  <p>total no of Book</p>
                </div>
                <div className="right_contains_item">
                  <i className="fa-solid fa-users" />
                  <span>0</span>
                  <p>total number of users</p>
                </div>
                <div className="right_contains_item">
                  <i className="fa-solid fa-book" />
                  <span>0</span>
                  <p>booked book</p>
                </div>
                <div className="right_contains_item">fsf</div>
                <div className="right_contains_item">sfsf</div>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <div>Error</div>
      )}
    </>
  );
}

export default Admin_index;
