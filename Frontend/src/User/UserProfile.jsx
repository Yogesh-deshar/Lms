import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../App.css";
import { useNavigate } from "react-router-dom";

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        if (user.isAuthenticated) {
          setUserData(user);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Error parsing user data:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <section>
        <div className="container">
          <div className="profile_info">
            <img
              src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
              alt="Profile"
            />
            <h2>Your Information</h2>
            <div className="info">
              Full Name: {userData.name || "Not provided"}
            </div>
            <div className="info">
              Phone Number: {userData.phoneNumber || "Not provided"}
            </div>
            <div className="info">
              Address: {userData.address || "Not provided"}
            </div>
            <div className="info">
              Email: {userData.email || "Not provided"}
            </div>
            <div className="button">
              <div
                className="btn bg-warning"
                onClick={() => navigate("/booked")}
              >
                Booked Book
              </div>
              <div
                className="btn bg-success"
                onClick={() => navigate("/update-profile")}
              >
                Update Profile
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default UserProfile;
