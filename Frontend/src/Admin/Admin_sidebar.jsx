import React from "react";
import { Link } from "react-router-dom";

function Admin_sidebar() {
  return (
    <div className="side_cont">
      <nav>
        <ul>
          <li>
            <Link to="/admin/dashboard">Dashboard</Link>
          </li>
          <li>
            <Link to="/admin/booked-books">Booked Books</Link>
          </li>
          <li>
            <Link to="/admin/manage-books">Manage Books</Link>
          </li>
          <li>
            <Link to="/admin/add-book">Add Book</Link>
          </li>
          <li>
            <Link to="/admin/admin-booked-books">Booked Books</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Admin_sidebar;
