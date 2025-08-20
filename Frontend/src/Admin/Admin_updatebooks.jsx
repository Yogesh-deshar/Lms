import React, { useState, useEffect } from "react";
import Admin_sidebar from "./Admin_sidebar";
import Admin_header from "./Admin_header";
import "./Admin.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

const initialFieldValue = {
  id: "",
  bookName: "",
  class: "",
  author: "",
  description: "",
  quantity: "",
  image: "",
  imageSrc: null,
  imageFile: null,
};

function Admin_updatebooks() {
  const [data, setData] = useState(initialFieldValue);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [originalImageSrc, setOriginalImageSrc] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Get book data from location state
    if (location.state && location.state.book) {
      const book = location.state.book;
      setData({
        id: book.Id,
        bookName: book.BookName || "",
        class: book.Class || "",
        author: book.Author || "",
        description: book.Description || "",
        quantity: book.Quantity || "",
        image: book.Image || "",
        imageSrc: book.ImageSrc || "",
        imageFile: null,
      });
      setOriginalImageSrc(book.ImageSrc || "");
    } else {
      // If no book data, redirect back to manage books
      alert("No book data provided for editing");
      navigate("/admin/manage-books");
    }
  }, [location.state, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const showPreview = (e) => {
    if (e.target.files && e.target.files[0]) {
      let imageFile = e.target.files[0];

      const reader = new FileReader();
      reader.onload = (x) => {
        setData({
          ...data,
          imageFile,
          imageSrc: x.target.result,
        });
      };
      reader.readAsDataURL(imageFile);
    }
  };

  const validateData = () => {
    let temp = {};
    temp.bookName = data.bookName === "" ? false : true;
    temp.author = data.author === "" ? false : true;
    temp.class = data.class === "" ? false : true;
    temp.description = data.description === "" ? false : true;
    temp.quantity = data.quantity === "" ? false : true;
    setError(temp);
    return Object.values(temp).every((x) => x === true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateData()) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("Id", data.id); // Add the book ID
        formData.append("BookName", data.bookName); // Changed to match backend model
        formData.append("Author", data.author); // Changed to match backend model
        formData.append("Class", data.class); // Changed to match backend model
        formData.append("Description", data.description); // Changed to match backend model
        formData.append("Quantity", data.quantity); // Changed to match backend model
        formData.append("ImageSrc", data.imageSrc || originalImageSrc || ""); // Add ImageSrc field

        if (data.imageFile) {
          formData.append("ImageFile", data.imageFile); // Changed to match backend model
        }

        console.log("Sending update form data:");
        for (let pair of formData.entries()) {
          console.log(pair[0] + ": " + pair[1]);
        }
        console.log("Book ID being sent:", data.id);
        console.log(
          "URL being called:",
          `https://localhost:7178/api/Books/${data.id}`
        );

        await updateBook(formData);
      } catch (error) {
        console.error("Error updating book:", error);
        alert("Failed to update book. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const updateBook = async (formData) => {
    try {
      const response = await axios.put(
        `https://localhost:7178/api/Books/${data.id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Book updated successfully", response);
      alert("Book updated successfully!");
      navigate("/admin/manage-books");
    } catch (error) {
      console.error(
        "Error updating book:",
        error.response?.data || error.message
      );
      console.error("Full error response:", error.response);
      if (error.response?.data?.errors) {
        console.error("Validation errors:", error.response.data.errors);
        // Show validation errors to user
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join("\n");
        alert(`Validation errors:\n${errorMessages}`);
        // Log detailed error information
        console.log(
          "Detailed validation errors:",
          JSON.stringify(error.response.data.errors, null, 2)
        );
      } else if (error.response?.data?.title) {
        console.error("Error title:", error.response.data.title);
        alert(`Error: ${error.response.data.title}`);
      } else {
        alert(
          error.response?.data?.message ||
            "Failed to update book. Please try again."
        );
      }
    }
  };

  const handleCancel = () => {
    navigate("/admin/manage-books");
  };

  return (
    <>
      <Admin_header />
      <section className="admin_contains">
        <div className="side_bar">
          <Admin_sidebar />
        </div>
        <div className="Right_contains">
          <h2>Update Book</h2>
          <div className="right_contains_items">
            <div className="Add_book">
              <form action="" method="post" onSubmit={handleSubmit}>
                <div className="image-preview">
                  <img
                    src={
                      data.imageSrc ||
                      originalImageSrc ||
                      "/default-book-image.svg"
                    }
                    alt="Book cover"
                    style={{
                      width: "200px",
                      height: "200px",
                      objectFit: "cover",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                    }}
                    onError={(e) => {
                      e.target.src = "/default-book-image.svg";
                    }}
                  />
                </div>

                <label htmlFor="bookName">Book Name</label>
                <input
                  required
                  type="text"
                  name="bookName"
                  onChange={handleInputChange}
                  value={data.bookName}
                  className={error.bookName === false ? "error" : ""}
                />
                {error.bookName === false && (
                  <span className="error-message">Book name is required</span>
                )}

                <label htmlFor="class">Class</label>
                <select
                  name="class"
                  value={data.class}
                  onChange={handleInputChange}
                  required
                  className={error.class === false ? "error" : ""}
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
                {error.class === false && (
                  <span className="error-message">Class is required</span>
                )}

                <label htmlFor="image">
                  Image of book (optional - leave empty to keep current image)
                </label>
                <input
                  type="file"
                  name="image"
                  onChange={showPreview}
                  accept="image/*"
                />

                <label htmlFor="author">Author</label>
                <input
                  required
                  type="text"
                  name="author"
                  value={data.author}
                  onChange={handleInputChange}
                  className={error.author === false ? "error" : ""}
                />
                {error.author === false && (
                  <span className="error-message">Author is required</span>
                )}

                <label htmlFor="quantity">Quantity</label>
                <input
                  required
                  type="number"
                  name="quantity"
                  value={data.quantity}
                  onChange={handleInputChange}
                  min="0"
                  className={error.quantity === false ? "error" : ""}
                />
                {error.quantity === false && (
                  <span className="error-message">Quantity is required</span>
                )}

                <label htmlFor="description">Description</label>
                <textarea
                  required
                  name="description"
                  value={data.description}
                  onChange={handleInputChange}
                  rows="4"
                  className={error.description === false ? "error" : ""}
                />
                {error.description === false && (
                  <span className="error-message">Description is required</span>
                )}

                <div className="button-group">
                  <button type="submit" disabled={loading}>
                    {loading ? "Updating..." : "Update Book"}
                  </button>
                  <button type="button" onClick={handleCancel}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Admin_updatebooks;
