import React, { useState, useEffect } from "react";
import Admin_sidebar from "./Admin_sidebar";
import Admin_header from "./Admin_header";
import "./Admin.css";
import axios from "axios";

function Admin_Alrady_booked_book() {
  const [bookedItems, setBookedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooked();
  }, []);

  const fetchBooked = async () => {
    try {
      console.log("Fetching booked items...");
      const response = await axios.get("/api/Bookeds", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log(
        "Raw booked items response:",
        JSON.stringify(response.data, null, 2)
      );

      // Fetch book details for each booked item
      const itemsWithDetails = await Promise.all(
        response.data.map(async (item) => {
          try {
            console.log(
              "Processing booked item:",
              JSON.stringify(item, null, 2)
            );

            const bookResponse = await axios.get(`/api/Books/${item.Book_Id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });

            // Get user data from the included User object in the booked item
            let userData = { Name: "Unknown User", Email: "Not available" };
            if (item.User) {
              console.log(
                "Found user data in booked item:",
                JSON.stringify(item.User, null, 2)
              );
              userData = {
                Name: item.User.Name || item.User.UserName || "Unknown User",
                Email: item.User.Email || "Not available",
              };
            } else {
              console.log("No user data found in booked item");
            }

            console.log(
              "Processed user data:",
              JSON.stringify(userData, null, 2)
            );

            const processedItem = {
              ...item,
              Book: bookResponse.data,
              User: userData,
            };

            console.log(
              "Final processed item:",
              JSON.stringify(processedItem, null, 2)
            );
            return processedItem;
          } catch (error) {
            console.error(
              `Error fetching details for booking ${item.Id}:`,
              error
            );
            return {
              ...item,
              Book: null,
              User: { Name: "Unknown User", Email: "Not available" },
            };
          }
        })
      );

      console.log(
        "Final items with details:",
        JSON.stringify(itemsWithDetails, null, 2)
      );
      setBookedItems(itemsWithDetails);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching booked items:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      setError("Failed to fetch booked items. Please try again later.");
      setLoading(false);
    }
  };

  const handleReturn = async (id) => {
    try {
      await axios.delete(`/api/Bookeds/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Refresh the list after returning
      fetchBooked();
    } catch (error) {
      console.error("Error returning book:", error);
      alert("Failed to return the book. Please try again.");
    }
  };

  return (
    <>
      <Admin_header />
      <section className="admin_contains">
        <div className="side_bar">
          <Admin_sidebar />
        </div>
        <div className="Right_contains">
          <h2>Booked Books</h2>
          <div className="right_contains_items">
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            {bookedItems.map((bookedItem) => (
              <div className="bookitems" key={bookedItem.Id}>
                <div className="Already_booked_book_contain">
                  {bookedItem.Book ? (
                    <>
                      <img
                        src={
                          bookedItem.Book.Image
                            ? `/api/Books/images/${bookedItem.Book.Image}`
                            : "/default-book-image.jpg"
                        }
                        alt={bookedItem.Book.BookName}
                        onError={(e) => {
                          e.target.src = "/default-book-image.jpg";
                        }}
                      />
                      <p>Title: {bookedItem.Book.BookName}</p>
                      <p>Author: {bookedItem.Book.Author}</p>
                      <p>Booked by: {bookedItem.User.Name}</p>
                      <p>Email: {bookedItem.User.Email}</p>
                      <p>
                        Booked Date:{" "}
                        {new Date(bookedItem.Booked_date).toLocaleDateString()}
                      </p>
                      <p>
                        Return Date:{" "}
                        {new Date(bookedItem.Return_date).toLocaleDateString()}
                      </p>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleReturn(bookedItem.Id)}
                      >
                        Return Book
                      </button>
                    </>
                  ) : (
                    <div>
                      <p>Book details not available</p>
                      <p>Book ID: {bookedItem.Book_Id}</p>
                      <p>Booked by: {bookedItem.User.Name}</p>
                      <p>Email: {bookedItem.User.Email}</p>
                      <p>
                        Booked Date:{" "}
                        {new Date(bookedItem.Booked_date).toLocaleDateString()}
                      </p>
                      <p>
                        Return Date:{" "}
                        {new Date(bookedItem.Return_date).toLocaleDateString()}
                      </p>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleReturn(bookedItem.Id)}
                      >
                        Return Book
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Admin_Alrady_booked_book;
