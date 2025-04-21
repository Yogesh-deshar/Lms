import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import "../App.css";

function About() {
  return (
    <>
      <Header />

      <section>
        <div className="container">
          <div className="about_us_contain">
            <div className="image">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ-Pi0bXIRucI13-ztv8uCtojtg6522jyU9eg&s"
                alt
              />
            </div>
            <div className="contain">
              <h2>About Us</h2>
              Lorem ipsum dolor sit amet consectetur adipisicing elit.
              Aspernatur reprehenderit animi sapiente dignissimos nobis incidunt
              soluta consectetur accusamus alias vitae tempora officiis
              doloremque cumque, ipsa ut dolorum eveniet voluptatem perferendis?
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default About;
