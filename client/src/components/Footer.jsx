import React from "react";
import Logo from "../img/logo.png";
import "../style/footer.css"

const Footer = ()=>{
    return (
        <footer>
          <img src={Logo} alt="Logo" />
          <span>
            Simple Blog
          </span>   
        </footer>
    );
}

export default Footer