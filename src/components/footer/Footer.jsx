import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";
import logo2 from "../../assets/logo2.png"
import FacebookRoundedIcon from "@mui/icons-material/FacebookRounded";

import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <img src={logo2} alt="Evangadi Logo" />
          </div>
          <div className="footer-social">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-facebook"> </i>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-instagram"></i>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fab fa-youtube"></i>
            </a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Useful Links</h3>
          <ul>
            <li>
              <Link to="/how-it-works">How it works</Link>
            </li>
            <li>
              <a href="#">Terms of Service</a>
            </li>
            <li>
              <a href="#">Privacy Policy</a>
            </li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Contact Info</h3>
          <ul>
            <li>Evangadi Networks</li>
            <li>support@evangadi.com</li>
            <li>+1-202-386-2702</li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
