import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../App.css";
import { Navigate } from "react-router-dom";

function Index() {
  document.title = "Welcome";
  const [userInfo, setUserInfo] = useState({});

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        // Use the email from the user data
        fetch(`/api/User/home/${userData.email}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
          })
          .then((data) => {
            console.log("Received user info:", data);
            if (data.userInfo) {
              setUserInfo(data.userInfo);
            } else {
              // If no userInfo in response, use the data from localStorage
              setUserInfo(userData);
            }
          })
          .catch((error) => {
            console.log("Error home page: ", error);
            // If API call fails, use the data from localStorage
            setUserInfo(userData);
          });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);


  function logout(){
    
  }

  // if (!user) {
  //   return <div>Loading...</div>;
  // }

  return (
    <>
      <Header />
      <h2>Welcome, {userInfo?.name || userInfo?.userName || "User"}</h2>
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
