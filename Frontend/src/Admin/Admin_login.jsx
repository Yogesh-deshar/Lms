import React from "react";
import "./Admin.css";
import { useNavigate } from "react-router-dom";

function Admin_login() {
  document.title = "Admin Login";
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

      const response = await fetch("/api/User/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const responseText = await response.text();
      let data;

      if (responseText) {
        try {
          data = JSON.parse(responseText);
          console.log("Parsed response data:", data);

          if (response.ok) {
            // Check if user is admin
            if (data.user && data.user.isAdmin) {
              // Store the token
              if (data.token) {
                localStorage.setItem("token", data.token);
              }

              // Store user info
              const userInfo = {
                ...data.user,
                isAuthenticated: true,
                isAdmin: true,
                loginTime: new Date().toISOString(),
              };
              localStorage.setItem("user", JSON.stringify(userInfo));

              // Navigate to admin dashboard
              navigate("/admin/dashboard");
            } else {
              const messageel = document.querySelector(".message");
              messageel.innerHTML =
                "Access denied. Only administrators can access this page.";
            }
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
      <div className="Admin_body">
        <div className="Admin_login_contain">
          <div className="container">
            <h2>Admin Login</h2>
            <form onSubmit={loginhandle}>
              <label htmlFor="Email">Email</label>
              <input
                type="text"
                name="Email"
                id="Email"
                placeholder="Please enter your Email"
                required
              />
              <label htmlFor="Password">Password</label>
              <input
                type="password"
                name="Password"
                id="Password"
                placeholder="Please enter your Password"
                required
              />
              <button type="submit">Login</button>
              <div
                className="message"
                style={{ color: "red", marginTop: "10px" }}
              ></div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin_login;
