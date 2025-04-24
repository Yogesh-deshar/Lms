import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";

import axios from "axios";
import "../App.css";

function Class() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

      // Add a unique ID if not present and fix image URLs
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
                <form>
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
                  <button>Booked book</button>
                </form>
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
