import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../App.css";
function Contact() {
  return (
    <>
      <Header />
      <section>
        <div className="container">
          <div className="contains">
            <div className="product">
              <div className="cont">
                <h2>
                  <i
                    className="fa-regular fa-address-book"
                    style={{ gap: 5 }}
                  />
                  Contact Us
                </h2>
                <div className="info">
                  <div className="info_contain">
                    <h2>
                      <i className="fa-regular fa-envelope" />
                      Our Email
                    </h2>
                    <p>Eg@gmail.com</p>
                  </div>
                  <div className="info_contain">
                    <h2>
                      <i className="fa-sharp fa-solid fa-phone" />
                      Number
                    </h2>
                    <p>1234567890</p>
                  </div>
                  <div className="info_contain">
                    <h2>
                      <i className="fa-solid fa-location-dot" />
                      Address
                    </h2>
                    <p>Chapagaun</p>
                  </div>
                  <div className="info_contain">
                    <h2>
                      <i className="fa-solid fa-location-dot" />
                      Time
                    </h2>
                    <p>10:00 - 11:00</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default Contact;
