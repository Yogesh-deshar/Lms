import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import "../App.css";

function Class() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleBooking = async (bookId) => {
    try {
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem("user"));
      console.log("User data:", userData);

      if (!userData || !userData.id) {
        throw new Error("User not logged in - No user data found");
      }

      // Calculate return date (14 days from now)
      const bookedDate = new Date();
      const returnDate = new Date();
      returnDate.setDate(returnDate.getDate() + 14);

      const bookedData = {
        Book_Id: bookId,
        User_id: userData.id, // Changed from User_Id to User_id
        Booked_date: bookedDate.toISOString(), // Changed from BookingDate to Booked_date
        Return_date: returnDate.toISOString(), // Added Return_date
      };

      console.log("Sending booking data:", bookedData);

      const response = await axios.post("/api/Bookeds", bookedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        alert("Book successfully booked!");
        // Refresh the books list to update quantities
        fetchBooks();
      }
    } catch (error) {
      console.error("Booking error:", error);
      if (error.response?.data === "Book is not available.") {
        alert("Sorry, this book is not available for booking.");
      } else if (error.message.includes("User not logged in")) {
        alert("Please log in to book a book.");
      } else {
        alert(
          error.response?.data?.message ||
            "Error booking the book. Please try again."
        );
      }
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      console.log("Fetching books...");
      const response = await axios.get("/api/Books", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("Books response:", response.data);

      const booksWithIds = response.data.map((book, index) => ({
        ...book,
        id: book.Id || `book-${index}`,
        imageSrc: book.ImageSrc
          ? book.ImageSrc.replace("https://localhost:5173", "")
          : "default-book-image.jpg",
        bookName: book.BookName || "Unknown Book",
        author: book.Author || "Unknown Author",
        class: book.Class || "N/A",
        quantity: book.Quantity || 0,
      }));

      console.log("Processed books:", booksWithIds);
      setBooks(booksWithIds);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      }
      setError("Failed to fetch books. Please try again later.");
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (books.length === 0) return <div>No books available</div>;

  return (
    <>
      <Header />
      <section>
        <div className="container">
          <div className="books">
            {books.map((book) => (
              <div className="bookitems" key={book.id}>
                <div className="book-card">
                  <img
                    src={book.imageSrc}
                    alt={book.bookName}
                    onError={(e) => {
                      e.target.src = "default-book-image.jpg";
                    }}
                  />
                  <p>Title: {book.bookName}</p>
                  <p>Author: {book.author}</p>
                  <p>Class: {book.class}</p>
                  <p>Quantity remaining: {book.quantity}</p>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleBooking(book.id)}
                    disabled={book.quantity <= 0}
                  >
                    {book.quantity <= 0 ? "Out of Stock" : "Book this book"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Class;
