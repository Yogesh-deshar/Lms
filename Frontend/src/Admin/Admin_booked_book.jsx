import React, { useState, useEffect } from "react";
import Admin_sidebar from "./Admin_sidebar";
import Admin_header from "./Admin_header";
import "./Admin.css";
import axios from "axios";

function Admin_booked_book() {
  const [formData, setFormData] = useState({
    BookedBy: "",
    Class: "",
    BookName: "",
    BookedDate: "",
    ReturnDate: "",
  });

  useEffect(() => {
    // Set initial dates when component mounts
    const today = new Date();
    const returnDate = new Date();
    returnDate.setDate(today.getDate() + 14);

    // Format dates as "YYYY-MM-DDTHH:mm:ss"
    const formatDate = (date) => {
      return date.toISOString().split(".")[0];
    };

    setFormData((prev) => ({
      ...prev,
      BookedDate: formatDate(today),
      ReturnDate: formatDate(returnDate),
    }));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Format dates before sending
      const today = new Date();
      const returnDate = new Date();
      returnDate.setDate(today.getDate() + 14);

      const formatDate = (date) => {
        return date.toISOString().split(".")[0];
      };

      const dataToSend = {
        ...formData,
        BookedDate: formatDate(today),
        ReturnDate: formatDate(returnDate),
      };

      console.log("Sending data:", dataToSend);

      const response = await axios.post("/api/Offlinebookings", dataToSend, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 201) {
        alert("Book successfully booked!");
        // Reset form
        setFormData({
          BookedBy: "",
          Class: "",
          BookName: "",
          BookedDate: formatDate(new Date()),
          ReturnDate: formatDate(
            new Date(new Date().setDate(new Date().getDate() + 14))
          ),
        });
      }
    } catch (error) {
      console.error("Error booking book:", error);
      alert(
        error.response?.data?.message ||
          "Failed to book the book. Please try again."
      );
    }
  };

  console.log(formData);
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
              <form onSubmit={handleSubmit}>
                <label htmlFor="name">Name of the person</label>
                <input
                  type="text"
                  placeholder="Enter the name of the person"
                  name="BookedBy"
                  id="name"
                  value={formData.BookedBy}
                  onChange={handleInputChange}
                  required
                />
                <label htmlFor="class">Class</label>
                <select
                  name="Class"
                  id="class"
                  value={formData.Class}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">****Select a Class****</option>
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
                <label htmlFor="book">Name of the book</label>
                <select
                  name="BookName"
                  id="book"
                  value={formData.BookName}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">****Select a Book****</option>
                  <option value="English">English</option>
                  <option value="Science">Science</option>
                  <option value="Nepali">Nepali</option>
                  <option value="Math">Math</option>
                  <option value="G.K">G.K</option>
                  <option value="Grammer">Grammer</option>
                </select>
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Admin_booked_book;
