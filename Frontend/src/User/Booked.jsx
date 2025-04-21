import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../App.css";
function Booked() {
  return (
    <>
      <Header />
      <section>
        <div className="container">
          <div className="books_booked">
            <div className="bookitems">
              <form action method="post">
                <img src="./Images/book2.jpg" alt />
                <p>Title:</p>
                <p>Auther:</p>
                <button>Remove</button>
              </form>
            </div>
            <div className="bookitems">
              <form action method="post">
                <img src="./Images/book2.jpg" alt />
                <p>Title:</p>
                <p>Auther:</p>
                <button>Remove</button>
              </form>
            </div>
            <div className="bookitems">
              <form action method="post">
                <img src="./Images/book2.jpg" alt />
                <p>Title:</p>
                <p>Auther:</p>
                <button>Remove</button>
              </form>
            </div>
            <div className="bookitems">
              <form action method="post">
                <img src="./Images/book2.jpg" alt />
                <p>Title:</p>
                <p>Auther:</p>
                <p>Quantity remaining:</p>
                <button>Booked book</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Booked;
