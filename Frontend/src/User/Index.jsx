import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../App.css";
import { Navigate } from "react-router-dom";


function Index() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const userinfo = localStorage.getItem("user");
    if (!userinfo) {
      setError("No user information found");
      return;
    }

    fetch("api/Backend/home/" + userinfo, {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        setUser(data.user);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setError(error.message);
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <Header />

      <section>
        <div className="set">
          <div className="container">
            <h2 className="title">Junior High/Middle School</h2>
            <div className="School_Contain">
              <div>
                <h2>Class 1</h2>
                <i className="fa-solid fa-arrow-right" />
              </div>
              <div>
                <h2>Class 2</h2>
                <i className="fa-solid fa-arrow-right" />
              </div>
              <div>
                <h2>Class 3</h2>
                <i className="fa-solid fa-arrow-right" />
              </div>
              <div>
                <h2>Class 4</h2>
                <i className="fa-solid fa-arrow-right" />
              </div>
              <div>
                <h2>Class 5</h2>
                <i className="fa-solid fa-arrow-right" />
              </div>
              <div>
                <h2>Class 6</h2>
                <i className="fa-solid fa-arrow-right" />
              </div>
              <div>
                <h2>Class 7</h2>
                <i className="fa-solid fa-arrow-right" />
              </div>
              <div>
                <h2>Class 8</h2>
                <i className="fa-solid fa-arrow-right" />
              </div>
            </div>
          </div>
          <div className="container">
            <h2 className="title"> High School</h2>
            <div className="School_Contain">
              <div>
                <h2>Class 9</h2>
                <i className="fa-solid fa-arrow-right" />
              </div>
              <div>
                <h2>Class 10</h2>
                <i className="fa-solid fa-arrow-right" />
              </div>
              <div>
                <h2>Class 11</h2>
                <i className="fa-solid fa-arrow-right" />
              </div>
              <div>
                <h2>Class 12</h2>
                <i className="fa-solid fa-arrow-right" />
              </div>
            </div>
          </div>
          <div className="container">
            <h2 className="title">Bachelor</h2>
            <div className="School_Contain">
              <div>
                <h2>Semester 1</h2>
                <i className="fa-solid fa-arrow-right" />
              </div>
              <div>
                <h2>Semester 2</h2>
                <i className="fa-solid fa-arrow-right" />
              </div>
              <div>
                <h2>Semester 3</h2>
                <i className="fa-solid fa-arrow-right" />
              </div>
              <div>
                <h2>Semester 4</h2>
                <i className="fa-solid fa-arrow-right" />
              </div>
              <div>
                <h2>Semester 5</h2>
                <i className="fa-solid fa-arrow-right" />
              </div>
              <div>
                <h2>Semester 6</h2>
                <i className="fa-solid fa-arrow-right" />
              </div>
              <div>
                <h2>Semester 7</h2>
                <i className="fa-solid fa-arrow-right" />
              </div>
              <div>
                <h2>Semester 8</h2>
                <i className="fa-solid fa-arrow-right" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Index;
