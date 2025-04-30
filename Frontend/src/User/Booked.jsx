import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import "../App.css";

const Booked = () => {
  const [bookedItems, setBookedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBooked();
  }, []);

  const fetchBooked = async () => {
    try {
      // Get current user's ID from localStorage
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData.id) {
        setError("User not logged in");
        setLoading(false);
        return;
      }

      console.log("Fetching booked items for user:", userData.id);
      const response = await axios.get("/api/Bookeds", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("All booked items response:", response.data);

      // Filter items for current user
      const userBookedItems = response.data.filter(
        (item) => item.User_id === userData.id
      );
      console.log("Filtered booked items for user:", userBookedItems);

      // Fetch book details for each booked item
      const itemsWithBooks = await Promise.all(
        userBookedItems.map(async (item) => {
          try {
            const bookResponse = await axios.get(`/api/Books/${item.Book_Id}`, {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            });
            return {
              ...item,
              Book: bookResponse.data,
            };
          } catch (error) {
            console.error(`Error fetching book ${item.Book_Id}:`, error);
            return item;
          }
        })
      );

      setBookedItems(itemsWithBooks);
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

  // if (loading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error}</div>;
  // if (bookedItems.length === 0) return <div>No books currently booked</div>;

  return (
    <>
      <Header />

      <section>
        <div className="container">
          <h2>My Booked Books</h2>
          <div className="books">
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            {bookedItems.length === 0 && <div>No books currently booked</div>}
            {bookedItems.map((bookedItem) => (
              <div className="bookitems" key={bookedItem.Id}>
                <div className="book-card">
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
      <Footer />
    </>
  );
};

export default Booked;
