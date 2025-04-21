import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../App.css";
function UserProfile() {
  return (
    <>
      <Header />
      <section>
        <div className="container">
          <div className="profile_info">
            <img
              src="https://media.istockphoto.com/id/1300845620/vector/user-icon-flat-isolated-on-white-background-user-symbol-vector-illustration.jpg?s=612x612&w=0&k=20&c=yBeyba0hUkh14_jgv1OKqIH0CCSWU_4ckRkAoy2p73o="
              alt
            />
            <h2>Your Information</h2>
            <div className=" info">Full Name : </div>
            <div className="info">Phone Number :</div>
            <div className="info">Address :</div>
            <div className="info">Email :</div>
            <div className="button">
              <div className="btn bg-warning">Booked Book</div>
              <div className="btn bg-success">Update Profile</div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default UserProfile;
