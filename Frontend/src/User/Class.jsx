import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import axios from "axios";
import "../App.css";

function Class() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("title"); // Add sorting state
  const [sortOrder, setSortOrder] = useState("asc"); // Add sort order state
  const [userBookings, setUserBookings] = useState([]); // Track user's current bookings

  // Bubble Sort implementation
  const bubbleSort = (arr, key, order = "asc") => {
    const n = arr.length;
    const sortedArr = [...arr]; // Create a copy to avoid mutating original array

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        let shouldSwap = false;

        // Compare based on the key
        if (key === "title") {
          shouldSwap =
            order === "asc"
              ? sortedArr[j].bookName > sortedArr[j + 1].bookName
              : sortedArr[j].bookName < sortedArr[j + 1].bookName;
        } else if (key === "author") {
          shouldSwap =
            order === "asc"
              ? sortedArr[j].author > sortedArr[j + 1].author
              : sortedArr[j].author < sortedArr[j + 1].author;
        } else if (key === "class") {
          shouldSwap =
            order === "asc"
              ? sortedArr[j].class > sortedArr[j + 1].class
              : sortedArr[j].class < sortedArr[j + 1].class;
        } else if (key === "quantity") {
          shouldSwap =
            order === "asc"
              ? sortedArr[j].quantity > sortedArr[j + 1].quantity
              : sortedArr[j].quantity < sortedArr[j + 1].quantity;
        }

        // Swap elements if needed
        if (shouldSwap) {
          const temp = sortedArr[j];
          sortedArr[j] = sortedArr[j + 1];
          sortedArr[j + 1] = temp;
        }
      }
    }

    return sortedArr;
  };

  // Handle sorting
  const handleSort = () => {
    const sortedBooks = bubbleSort(books, sortBy, sortOrder);
    setBooks(sortedBooks);
  };

  // Handle sort criteria change
  const handleSortByChange = (e) => {
    setSortBy(e.target.value);
  };

  // Handle sort order change
  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleBooking = async (bookId) => {
    try {
      // Get user data from localStorage
      const userData = JSON.parse(localStorage.getItem("user"));
      console.log("User data:", userData);

      if (!userData || !userData.id) {
        throw new Error("User not logged in - No user data found");
      }

      // Check if user has already booked this book
      const alreadyBooked = userBookings.find(
        (booking) => booking.Book_Id === bookId
      );
      if (alreadyBooked) {
        alert(
          "You have already booked this book. You can only book each book once."
        );
        return;
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
        // Refresh the books list to update quantities but preserve original order
        fetchBooks(false);
        // Refresh user bookings to include the new booking
        fetchUserBookings();
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
    fetchBooks(false);
    fetchUserBookings();
  }, []);

  // Apply sorting when books or sort criteria change
  useEffect(() => {
    if (books.length > 0) {
      handleSort();
    }
  }, [sortBy, sortOrder]);

  const fetchBooks = async (preserveSort = false) => {
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

      if (preserveSort) {
        // If preserving sort, apply the current sorting
        const sortedBooks = bubbleSort(booksWithIds, sortBy, sortOrder);
        setBooks(sortedBooks);
      } else {
        // If not preserving sort, set books in original order
        setBooks(booksWithIds);
      }

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

  const fetchUserBookings = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData.id) {
        return;
      }

      const response = await axios.get("/api/Bookeds", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      // Filter bookings for current user
      const userBookings = response.data.filter(
        (booking) => booking.User_id === userData.id
      );
      setUserBookings(userBookings);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
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
          {/* Sorting Controls */}
          <div
            className="sorting-controls"
            style={{
              marginBottom: "20px",
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <label htmlFor="sortBy">Sort by:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={handleSortByChange}
              style={{ padding: "5px", borderRadius: "4px" }}
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="class">Class</option>
              <option value="quantity">Quantity</option>
            </select>

            <label htmlFor="sortOrder">Order:</label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={handleSortOrderChange}
              style={{ padding: "5px", borderRadius: "4px" }}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

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
                    className={`btn ${
                      book.quantity <= 0
                        ? "btn-danger"
                        : userBookings.some(
                            (booking) => booking.Book_Id === book.id
                          )
                        ? "btn-secondary"
                        : "btn-primary"
                    }`}
                    onClick={() => handleBooking(book.id)}
                    disabled={
                      book.quantity <= 0 ||
                      userBookings.some(
                        (booking) => booking.Book_Id === book.id
                      )
                    }
                  >
                    {book.quantity <= 0
                      ? "Out of Stock"
                      : userBookings.some(
                          (booking) => booking.Book_Id === book.id
                        )
                      ? "Already Booked"
                      : "Book this book"}
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
