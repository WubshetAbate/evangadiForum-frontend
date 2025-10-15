import React from "react";
import { Link } from "react-router-dom";
import "./About.css";

const About = () => {
  return (
    <div className="about-page">
      <div className="about-container">
        <div className="about-content">
          <span className="about-label">About</span>
          <h1 className="about-title">Evangadi Networks</h1>

          <div className="about-text">
            <p>
              No matter what stage of life you are in, whether you're just
              starting elementary school or being promoted to CEO of a Fortune
              500 company, you have much to offer to those who are trying to
              follow in your footsteps.
            </p>

            <p>
              Whether you are willing to share your knowledge or you are just
              looking to meet mentors of your own, please start by joining the
              network here.
            </p>
          </div>

          <Link to="/" className="how-it-works-btn">
            HOW IT WORKS
          </Link>
        </div>

        <div className="about-decoration">
          <div className="decoration-shape"></div>
        </div>
      </div>
    </div>
  );
};

export default About;
