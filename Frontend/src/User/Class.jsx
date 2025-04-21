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
      const response = await axios.get("https://localhost:7178/api/Books", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      // console.log("API Response:", response.data);
      // // Log each book's image details
      // response.data.forEach((book) => {
      //   console.log(`Book: ${book.bookName}`);
      //   console.log(`Image property: ${book.imageSrc}`);
      //   console.log(`Full image URL: ${book.imageSrc}`);
      // });
      setBooks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error.response || error);
      setError("Failed to fetch books. Please try again later.");
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <>
      <Header />
      <section>
        <div className="container">
          <div className="books">
            {books.map((book) => (
              <div className="bookitems">
                <form action method="post" key={books.id}>
                  <img
                    src={book.imageSrc || "default-book-image.jpg"}
                    alt={book.bookName || "Book cover"}
                  />
                  <p>Title: {book.bookName}</p>
                  <p>Author: {book.author}</p>
                  <p>Class : {book.class}</p>
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
