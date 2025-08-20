import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import Header from "./Header";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function Search() {
  const query = useQuery();
  const searchTerm = query.get("q") || "";
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Placeholder booking handler

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

  useEffect(() => {
    setLoading(true);
    setError(null);
    let url = "";
    if (searchTerm) {
      url = `/api/Books/search?query=${encodeURIComponent(searchTerm)}`;
    } else {
      url = "/api/Books";
    }
    axios
      .get(url)
      .then((res) => {
        setBooks(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch search results.");
        setLoading(false);
      });
  }, [searchTerm]);

  return (
    <>
      <Header />
      <div className="container mt-4">
        <h2>Search Results for "{searchTerm}"</h2>
        {loading && <div>Loading...</div>}
        {error && <div style={{ color: "red" }}>{error}</div>}
        {!loading && !error && books.length === 0 && <div>No books found.</div>}
        {!loading && !error && books.length > 0 && (
          <table className="table table-bordered table-striped mt-3">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Author</th>
                <th>Class</th>
                <th>Quantity</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.Id}>
                  <td>
                    <img
                      src={
                        book.Image
                          ? `/api/Books/images/${book.Image}`
                          : "/default-book-image.jpg"
                      }
                      alt={book.BookName}
                      style={{
                        width: "50px",
                        height: "70px",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        e.target.src = "/default-book-image.jpg";
                      }}
                    />
                  </td>
                  <td>{book.BookName}</td>
                  <td>{book.Author}</td>
                  <td>{book.Class || "N/A"}</td>
                  <td>{book.Quantity}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleBooking(book.Id)}
                      disabled={!book.Quantity}
                    >
                      {book.Quantity ? "Book this book" : "Out of Stock"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Search;
