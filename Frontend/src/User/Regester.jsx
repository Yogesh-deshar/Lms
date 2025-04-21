import React from "react";
import "../App.css";
function Regester() {
  async function regesterhandler(e) {
    e.preventDefault();
    const form_ = e.target;

    // Get the submit button that triggered the form submission
    const submitter = document.querySelector("button.login");

    const formdata = new FormData(form_, submitter),
      dataToSend = {};
    for (const [key, value] of formdata) {
      dataToSend[key] = value;
    }

    // Create the user object that matches the backend User model
    const userData = {
      userName: dataToSend.Email, // Using email as username
      email: dataToSend.Email,
      name: dataToSend.Name,
      PasswordHash: dataToSend.PasswordHash, // This will be hashed by the backend
      PhoneNumber: dataToSend.Number,
      Address: dataToSend.Address,
    };

    try {
      console.log("Sending registration request with data:", userData);

      // Use the API endpoint with the proxy
      const respond = await fetch("/api/User/register", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(userData),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      console.log("Registration response status:", respond.status);

      // Check if the response is ok before trying to parse JSON
      if (respond.ok) {
        // Try to parse the JSON response
        try {
          const data = await respond.json();
          console.log("Registration successful:", data);
          window.location.href = "/login";
        } catch (jsonError) {
          console.error("Error parsing JSON:", jsonError);
          // If we can't parse JSON but the response was ok, still redirect
          window.location.href = "/login";
        }
      } else {
        // Handle non-OK responses
        let errorMessage = "Registration failed. Please try again.";

        try {
          const errorText = await respond.text();
          console.error("Registration error response:", errorText);

          try {
            // Try to parse as JSON if possible
            const errorData = JSON.parse(errorText);
            if (errorData.message) {
              errorMessage = errorData.message;
            }
          } catch (parseError) {
            // If not JSON, use the text directly
            errorMessage =
              errorText || `Error: ${respond.status} ${respond.statusText}`;
          }
        } catch (textError) {
          console.error("Error getting error response text:", textError);
          errorMessage = `Error: ${respond.status} ${respond.statusText}`;
        }

        const messageel = document.querySelector(".message");
        messageel.innerHTML = errorMessage;
      }
    } catch (fetchError) {
      console.error("Fetch error:", fetchError);
      const messageel = document.querySelector(".message");
      messageel.innerHTML =
        "Network error. Please check your connection and try again.";
    }
  }

  return (
    <>
      <div className="body">
        <div className="container">
          <div className="Regester">
            <div className="Regester_item">
              <h2>Regester</h2>
              <form onSubmit={regesterhandler}>
                <label htmlFor>Name</label>
                <input
                  type="text"
                  name="Name"
                  id="name"
                  placeholder="Enter your Name"
                  required
                />
                <label htmlFor>Phone Number</label>
                <input
                  type="text"
                  name="Number"
                  id="number"
                  placeholder="Enter your Phone Number"
                  required
                />
                <label htmlFor>Address</label>
                <input
                  type="text"
                  name="Address"
                  id="address"
                  placeholder="Enter your Address"
                  required
                />
                <label htmlFor>Email</label>
                <input
                  type="email"
                  name="Email"
                  id="email"
                  placeholder="Enter your Email"
                  required
                />
                <label htmlFor>Password</label>
                <input
                  type="password"
                  name="PasswordHash"
                  id="password"
                  placeholder="Enter your Password"
                  required
                />
                <button type="submit" className="login">
                  Regester
                </button>
                <div className="message"></div>
              </form>
            </div>
            <div className="side">
              <h2>Regester your Account </h2>
              <p>in Lms</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Regester;
