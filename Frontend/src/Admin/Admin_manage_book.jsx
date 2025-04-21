import React, { useState, useEffect } from "react";
import Admin_sidebar from "./Admin_sidebar";
import Admin_header from "./Admin_header";
import "./Admin.css";
import axios from "axios";

function Admin_manage_book() {
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
      console.log("API Response:", response.data);
      // Log each book's image details
      response.data.forEach((book) => {
        console.log(`Book: ${book.bookName}`);
        console.log(`Image property: ${book.imageSrc}`);
        console.log(`Full image URL: ${book.imageSrc}`);
      });
      setBooks(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error.response || error);
      setError("Failed to fetch books. Please try again later.");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      try {
        console.log("Deleting book with ID:", id); // Debug log
        const response = await axios.delete(
          `https://localhost:7178/api/Books/${id}`,
          {
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Delete response:", response); // Debug log
        await fetchBooks(); // Refresh the list after successful deletion
        alert("Book deleted successfully!");
      } catch (error) {
        console.error("Detailed delete error:", {
          message: error.message,
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
        });
        alert(
          `Failed to delete book: ${error.response?.data || error.message}`
        );
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Admin_header />
      <section className="admin_contains">
        <div className="side_bar">
          <Admin_sidebar />
        </div>
        <div className="Right_contains">
          <h2>Manage Books</h2>
          <div className="right_contains_items">
            <div className="books_table">
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Book Name</th>
                    <th>Author</th>
                    <th>Class</th>
                    <th>Quantity</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.id}>
                      <td>
                        <img
                          src={book.imageSrc || "default-book-image.jpg"}
                          alt={book.bookName || "Book cover"}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                          }}
                          onError={(e) => {
                            console.error(
                              `Failed to load image for book ${
                                book.bookName || "Unknown"
                              }:`,
                              e
                            );
                            e.target.src = "default-book-image.jpg";
                          }}
                        />
                      </td>
                      <td>{book.bookName}</td>
                      <td>{book.author}</td>
                      <td>{book.class}</td>
                      <td>{book.quantity}</td>
                      <td>{book.description}</td>
                      <td>
                        <button
                          className="edit-btn"
                          onClick={() => {
                            // Add edit functionality
                            alert("Edit functionality coming soon!");
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-btn"
                          onClick={() => handleDelete(book.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Admin_manage_book;
