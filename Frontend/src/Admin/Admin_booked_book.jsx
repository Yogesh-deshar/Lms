import React from "react";
import Admin_sidebar from "./Admin_sidebar";
import Admin_header from "./Admin_header";
import "./Admin.css";
function Admin_booked_book() {
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
            <div className="booked_book_contain">
              <form action method="post">
                <label htmlFor>Name of the person</label>
                <input
                  type="text"
                  placeholder="Enter the name of the person"
                  name
                  id
                />
                <label htmlFor>Class</label>
                <select name id>
                  <option value>****Select a Class****</option>
                  <option value="Class 1">Class 1</option>
                  <option value="Class 2">Class 2</option>
                  <option value="Class 3">Class 3</option>
                  <option value="Class 4">Class 4</option>
                  <option value="Class 5">Class 5</option>
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                  <option value="Sementer 1">Sementer 1</option>
                  <option value="Sementer 2">Sementer 2</option>
                  <option value="Sementer 3">Sementer 3</option>
                  <option value="Sementer 4">Sementer 4</option>
                  <option value="Sementer 5">Sementer 5</option>
                  <option value="Sementer 6">Sementer 6</option>
                  <option value="Sementer 7">Sementer 7</option>
                  <option value="Sementer 8">Sementer 8</option>
                </select>
                <label htmlFor>Name of the book</label>
                <select name id>
                  <option value>****Select a Book****</option>
                  <option value>English</option>
                  <option value>Science</option>
                  <option value>Nepali</option>
                  <option value>Math</option>
                  <option value>G.K</option>
                  <option value>Grammer</option>
                </select>
                <button>Submit</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Admin_booked_book;
