import React, { useState } from "react";
import Admin_sidebar from "./Admin_sidebar";
import Admin_header from "./Admin_header";
import "./Admin.css";
import axios from "axios";

const intilafield_value = {
  bookID: 0,
  book_Name: "",
  class: "",
  author: "",
  description: "",
  quantity: "",
  Image: "",
  ImageSrc: null,
  ImageFile: null,
};
function Admin_add_book() {
  const [data, setData] = useState(intilafield_value);
  const [error, setError] = useState();

  const handleInputchange = (e) => {
    const { name, value } = e.target;

    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const showprev = (e) => {
    if (e.target.files && e.target.files[0]) {
      let ImageFile = e.target.files[0];

      const reader = new FileReader();
      reader.onload = (x) => {
        setData({
          ...data,
          ImageFile,
          ImageSrc: x.target.result,
        });
      };
      reader.readAsDataURL(ImageFile);
    }
  };

  const validdata = () => {
    let temp = {};
    temp.book_Name = data.book_Name == "" ? false : true;
    temp.author = data.author == "" ? false : true;
    temp.class = data.class == "" ? false : true;
    temp.description = data.description == "" ? false : true;
    temp.quantity = data.quantity == "" ? false : true;
    setError(temp);
    return Object.values(temp).every((x) => x == true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validdata()) {
      const formData = new FormData();
      formData.append("bookName", data.book_Name);
      formData.append("author", data.author);
      formData.append("class", data.class);
      formData.append("description", data.description);
      formData.append("quantity", data.quantity);
      formData.append("imageSrc", data.ImageSrc || "");

      if (data.ImageFile) {
        formData.append("imageFile", data.ImageFile);
      }

      console.log("Sending form data:");
      for (let pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      add(formData);
    }
  };

  const add = (formData) => {
    axios
      .post("https://localhost:7178/api/Books", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        console.log("Book added successfully", res);
        setData(intilafield_value);
        alert("Book added successfully!");
      })
      .catch((error) => {
        console.error(
          "Error adding book:",
          error.response?.data || error.message
        );
        console.error("Full error response:", error.response);
        if (error.response?.data?.errors) {
          console.error("Validation errors:", error.response.data.errors);
        }
        alert(
          error.response?.data?.message ||
            "Failed to add book. Please try again."
        );
      });
  };

  return (
    <>
      <Admin_header />
      <section className="admin_contains">
        <div className="side_bar">
          <Admin_sidebar />
        </div>
        <div className="Right_contains">
          <h2>Manage book</h2>
          <div className="right_contains_items">
            <div className="Add_book">
              <form action="" method="post" onSubmit={handleSubmit}>
                <img src={data.ImageSrc} />

                <label htmlFor="book_Name">Book Name</label>

                <input
                  required
                  type="text"
                  name="book_Name"
                  onChange={handleInputchange}
                  value={data.book_Name}
                />

                <label htmlFor="class">Class</label>

                <select
                  name="class"
                  value={data.class}
                  onChange={handleInputchange}
                  required
                >
                  <option value>****Select a Class****</option>
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

                <label htmlFor="image">Image of book</label>

                <input type="file" name="image" onChange={showprev} />

                <label htmlFor>Author</label>
                <input
                  required
                  type="text"
                  name="author"
                  value={data.author}
                  onChange={handleInputchange}
                />
                <label htmlFor="quantity">Quantity</label>

                <input
                  required
                  type="number"
                  name="quantity"
                  value={data.quantity}
                  onChange={handleInputchange}
                />

                <label htmlFor="descripton">Description</label>

                <input
                  required
                  type="text"
                  name="description"
                  value={data.description}
                  onChange={handleInputchange}
                />

                <button>Add Book</button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Admin_add_book;
