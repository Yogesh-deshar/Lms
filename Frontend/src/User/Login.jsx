import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";

function Login() {
  document.title = "Login";
  const navigate = useNavigate();

  // Check if user is already logged in
  // useEffect(() => {
  //   const user = localStorage.getItem("user");
  //   if (user) {
  //     try {
  //       const userData = JSON.parse(user);
  //       if (userData.isAuthenticated) {
  //         console.log("User already logged in, redirecting to home");
  //         navigate("/", { replace: true });
  //       }
  //     } catch (error) {
  //       console.error("Error parsing stored user data:", error);
  //       localStorage.removeItem("user");
  //     }
  //   }
  // }, [navigate]);

  async function loginhandle(e) {
    e.preventDefault();
    const form_ = e.target;
    const submitter = e.submitter || document.querySelector("button.login");
    const formdata = new FormData(form_, submitter);
    const dataToSend = {};
    for (const [key, value] of formdata) {
      dataToSend[key] = value;
    }

    try {
      const loginData = {
        Email: dataToSend.Email,
        Password: dataToSend.Password,
        Remember: true,
      };

      console.log("Starting login attempt with data:", loginData);

      const response = await fetch("/api/User/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(loginData),
      });

      console.log("Login response received:", {
        status: response.status,
        ok: response.ok,
        statusText: response.statusText,
      });

      const responseText = await response.text();
      console.log("Raw response text:", responseText);

      let data;
      if (responseText) {
        try {
          data = JSON.parse(responseText);
          console.log("Parsed response data:", data);

          if (response.ok) {
            // Store the token
            if (data.token) {
              localStorage.setItem("token", data.token);
            }

            // Store user info
            const userInfo = {
              ...data.user,
              isAuthenticated: true,
              loginTime: new Date().toISOString(),
            };
            localStorage.setItem("user", JSON.stringify(userInfo));

            // Navigate to home page
            navigate("/");
          } else {
            const messageel = document.querySelector(".message");
            messageel.innerHTML =
              data.message || "Login failed. Please try again.";
          }
        } catch (e) {
          console.error("Failed to parse JSON response:", responseText);
          const messageel = document.querySelector(".message");
          messageel.innerHTML = "Server error. Please try again later.";
        }
      } else {
        console.error("Empty response from server");
        const messageel = document.querySelector(".message");
        messageel.innerHTML = "Server error. Please try again later.";
      }
    } catch (error) {
      console.error("Login error:", error);
      const messageel = document.querySelector(".message");
      messageel.innerHTML = "An error occurred during login. Please try again.";
    }
  }
  return (
    <>
      <div className="body">
        <div className="container">
          <div className="login">
            <div className="login_items">
              <form onSubmit={loginhandle}>
                <h2>Login</h2>
                <div className="logincont">
                  <p>Email or Username</p>
                  <input
                    type="text"
                    placeholder="Enter your Email or Username"
                    name="Email"
                    id="email"
                    required
                  />
                  <p>Password</p>
                  <input
                    type="password"
                    name="Password"
                    id="password"
                    placeholder="Enter your Password"
                    required
                  />

                  <button type="submit" className="login">
                    Login
                  </button>
                  <div className="message"></div>
                  <p>
                    Doesn't have an Account? <a href="/regester">Register</a>
                  </p>
                </div>
              </form>
            </div>
            <div className="Image">
              <div className="imgcontain">
                <h2>Welcome</h2>
                <p>To our Website</p>
              </div>
              <img src="Images/book3.png" alt="Welcome" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
