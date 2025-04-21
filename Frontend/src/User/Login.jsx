import React from "react";
import "../App.css";
function Login() {
  document.title = "Login";

  async function loginhandle(e) {
    e.preventDefault();
    const form_ = e.target;

    // Get the submit button that triggered the form submission
    const submitter = e.submitter || document.querySelector("button.login");

    const formdata = new FormData(form_, submitter);
    const dataToSend = {};
    for (const [key, value] of formdata) {
      dataToSend[key] = value;
    }

    if (dataToSend.Remember === "on") {
      dataToSend.Remember = true;
    }

    try {
      // Create the login data object that matches the backend Login model
      const loginData = {
        UserName: dataToSend.Email.toLowerCase(), // Try lowercase email first
        Password: dataToSend.Password,
        Rember: dataToSend.Remember || false,
      };

      console.log("Login attempt details:", {
        username: loginData.UserName,
        passwordLength: loginData.Password?.length,
        remember: loginData.Rember,
      });

      // First try with lowercase email
      let respond = await fetch("/api/User/login", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(loginData),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      // If first attempt fails, try with original case
      if (!respond.ok) {
        loginData.UserName = dataToSend.Email; // Try original case
        console.log("Retrying with original case:", loginData.UserName);

        respond = await fetch("/api/User/login", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify(loginData),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
      }

      console.log("Login response status:", respond.status);

      // First check if the response is ok
      if (!respond.ok) {
        const errorText = await respond.text();
        console.error(
          "Login failed with status:",
          respond.status,
          "Response:",
          errorText
        );
        if (respond.status === 401) {
          throw new Error(
            "Invalid username or password. Please check your credentials and try again."
          );
        }
        throw new Error(
          `Login failed: ${respond.status} ${respond.statusText}`
        );
      }

      // Try to get the response text first
      const responseText = await respond.text();
      console.log("Login response text:", responseText);

      // Only try to parse as JSON if we have content
      let data;
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (e) {
          console.error("Failed to parse JSON response:", responseText);
          throw new Error("Invalid JSON response from server");
        }
      }

      if (respond.ok) {
        localStorage.setItem("user", dataToSend.Email);
        window.location.href = "/";
      } else {
        const messageel = document.querySelector(".message");
        if (data?.message) {
          messageel.innerHTML = data.message;
        } else {
          messageel.innerHTML = "Login failed. Please try again.";
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      const messageel = document.querySelector(".message");
      messageel.innerHTML = `Error: ${error.message}. Please try again later.`;
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
                  {/* <div className="remember-me">
                    <input type="checkbox" name="Remember" id="remember" />
                    <label htmlFor="remember">Remember me</label>
                  </div> */}
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
