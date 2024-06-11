import React from "react";
import { Link } from "react-router-dom";
import Logo from "../img/logo.png";
import "../style/navbar.css";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {
  const { user, logout } = useAuth0();

  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img src={Logo} alt="Logo" />
          </Link>
        </div>
        <div className="links">
          <div className="dropdown">
            <button className="dropbtn">Categories</button>
            <div className="dropdown-content">
              <Link className="link" to="/?cat=art">
                ART
              </Link>
              <Link className="link" to="/?cat=science">
                SCIENCE
              </Link>
              <Link className="link" to="/?cat=technology">
                TECHNOLOGY
              </Link>
              <Link className="link" to="/?cat=cinema">
                CINEMA
              </Link>
              <Link className="link" to="/?cat=design">
                DESIGN
              </Link>
              <Link className="link" to="/?cat=food">
                FOOD
              </Link>
            </div>
          </div>
          <Link className="profile" to="/app">PROFILE</Link>
          <Link className="write" to="/app/posts">WRITE</Link>
          <button
            className="exit-button"
            onClick={() => logout({ returnTo: window.location.origin })}
          >
            LogOut
          </button>
          {user && <div className="welcome">Welcome 👋 {user.name}</div>}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
