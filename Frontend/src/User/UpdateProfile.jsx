import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../App.css";
function UpdateProfile() {
  return (
    <>
      <Header />

      <section>
        <div className="container">
          <div className="update">
            <h2>Edit your Profile</h2>
            <form action>
              <label htmlFor="image">Enter your image</label>
              <input type="file" name="image" id />
              <label htmlFor>Full Name</label>
              <input
                type="text"
                name="first_name"
                id="first_name"
                required
                placeholder="Enter your Full name"
              />
              <label htmlFor>Phone Number</label>
              <input type="text" name="last_name" id="last_name"  placeholder="Enter your Number" />
              <label htmlFor>Address</label>
              <input type="text" name="address" id="address" required placeholder="Enter your Address" />
              <label htmlFor>Email</label>
              <input type="email" name="email" id="email" required  placeholder="Enter your Email"/>
              <button type="submit">Update</button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default UpdateProfile;
