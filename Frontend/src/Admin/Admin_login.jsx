import React from "react";
import "./Admin.css";
function Admin_login() {
  return (
    <>
      <div className="Admin_body">
        <div className="Admin_login_contain">
          <div className="container">
            <h2>Admin Login</h2>
            <form action method="post">
              <label htmlFor>Email</label>
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
              <button>Login</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Admin_login;
