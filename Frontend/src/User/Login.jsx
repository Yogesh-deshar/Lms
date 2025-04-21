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
      const respond = await fetch("api/Backend/login", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(dataToSend),
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const data = await respond.json();

      if (respond.ok) {
        localStorage.setItem("user", dataToSend.Email);
        window.location.href = "/";
      } else {
        const messageel = document.querySelector(".message");
        if (data.message) {
          messageel.innerHTML = data.message;
        } else {
          messageel.innerHTML = "Login failed. Please try again.";
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      const messageel = document.querySelector(".message");
      messageel.innerHTML = "An error occurred. Please try again later.";
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
                  <p>Email</p>
                  <input
                    type="text"
                    placeholder="Enter your Email"
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
                    Doesn't have an Account? <a href="/register">Register</a>
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
