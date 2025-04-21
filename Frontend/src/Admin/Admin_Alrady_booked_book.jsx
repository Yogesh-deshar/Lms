import React from "react";
import Admin_sidebar from "./Admin_sidebar";
import Admin_header from "./Admin_header";
import "./Admin.css";
function Admin_Alrady_booked_book() {
  return (
    <>
      <Admin_header />
      <section className="admin_contains">
        <div className="side_bar">
          <Admin_sidebar />
        </div>
        <div className="Right_contains">
          <h2>Booked book</h2>
          <div className="right_contains_items">
            <div className="Already_booked_book_contain">
              <img src="./Images/Essential-Books.jpg" alt />
              <p>Name : </p>
              <p>Class : </p>
              <p>Booked by :</p>
            </div>
            <div className="Already_booked_book_contain">
              <img src="./Images/Essential-Books.jpg" alt />
              <p>Name : </p>
              <p>Class : </p>
              <p>Booked by :</p>
            </div>
            <div className="Already_booked_book_contain">
              <img src="./Images/Essential-Books.jpg" alt />
              <p>Name : </p>
              <p>Class : </p>
              <p>Booked by :</p>
            </div>
            <div className="Already_booked_book_contain">
              <img src="./Images/Essential-Books.jpg" alt />
              <p>Name : </p>
              <p>Class : </p>
              <p>Booked by :</p>
            </div>
            <div className="Already_booked_book_contain">
              <img src="./Images/Essential-Books.jpg" alt />
              <p>Name : </p>
              <p>Class : </p>
              <p>Booked by :</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Admin_Alrady_booked_book;
