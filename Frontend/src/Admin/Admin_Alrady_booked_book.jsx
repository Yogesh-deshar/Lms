import React, { useState, useEffect } from "react";
import Admin_sidebar from "./Admin_sidebar";
import Admin_header from "./Admin_header";
import "./Admin.css";
import axios from "axios";

function Admin_Alrady_booked_book() {
  const [bookedItems, setBookedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState("Booked_date");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    fetchBooked();
  }, []);

  // Insertion Sort implementation
  const insertionSort = (arr, field, direction) => {
    const sortedArr = [...arr];
    for (let i = 1; i < sortedArr.length; i++) {
      const current = sortedArr[i];
      let j = i - 1;

      while (
        j >= 0 &&
        (direction === "asc"
          ? sortedArr[j][field] > current[field]
          : sortedArr[j][field] < current[field])
      ) {
        sortedArr[j + 1] = sortedArr[j];
        j--;
      }
      sortedArr[j + 1] = current;
    }
    return sortedArr;
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

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
              console.log("Available properties:", Object.keys(item));
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

  const sortedItems = insertionSort(bookedItems, sortField, sortDirection);

  return (
    <>
      <Admin_header />
      <section className="admin_contains">
        <div className="side_bar">
          <Admin_sidebar />
        </div>
        <div className="Right_contains">
          <h2> admin Booked Books</h2>
          <div className="table-responsive">
            {loading && <div>Loading...</div>}
            {error && <div>Error: {error}</div>}
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  <th>Book Image</th>
                  <th onClick={() => handleSort("Book.BookName")}>
                    Title{" "}
                    {sortField === "Book.BookName" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => handleSort("Book.Author")}>
                    Author{" "}
                    {sortField === "Book.Author" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => handleSort("User.Name")}>
                    Booked By{" "}
                    {sortField === "User.Name" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => handleSort("User.Email")}>
                    Email{" "}
                    {sortField === "User.Email" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => handleSort("Booked_date")}>
                    Booked Date{" "}
                    {sortField === "Booked_date" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th onClick={() => handleSort("Return_date")}>
                    Return Date{" "}
                    {sortField === "Return_date" &&
                      (sortDirection === "asc" ? "↑" : "↓")}
                  </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {sortedItems.map((bookedItem) => (
                  <tr key={bookedItem.Id}>
                    <td>
                      <img
                        src={
                          bookedItem.Book?.Image
                            ? `/api/Books/images/${bookedItem.Book.Image}`
                            : "/default-book-image.jpg"
                        }
                        alt={bookedItem.Book?.BookName || "Book"}
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
                    <td>{bookedItem.Book?.BookName || "N/A"}</td>
                    <td>{bookedItem.Book?.Author || "N/A"}</td>
                    <td>{bookedItem.User.Name}</td>
                    <td>{bookedItem.User.Email}</td>
                    <td>
                      {new Date(bookedItem.Booked_date).toLocaleDateString()}
                    </td>
                    <td>
                      {new Date(bookedItem.Return_date).toLocaleDateString()}
                    </td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleReturn(bookedItem.Id)}
                      >
                        Return Book
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

export default Admin_Alrady_booked_book;
