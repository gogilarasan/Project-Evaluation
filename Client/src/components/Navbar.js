import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Navbar.css';
import { Button } from './Button';


function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);
  const location = useLocation();
  const handleClick = () => setClick(!click);
  const closeMobileMenu = () => setClick(false);
  const images = [
    {
      src: "/images/Images/logo-image.png", 
      alt: "Logo",
    },
  ];

  const showButton = () => {
    if (window.innerWidth <= 960) {
      setButton(false);
    } else {
      setButton(true);
    }
  };

  useEffect(() => {
    showButton();
  }, []);

  window.addEventListener('resize', showButton);

  const includedPaths = [
    '/',
    '/aboutus',
    '/login',
    '/signup',
  ];
  const shouldIncludeNavbar = includedPaths.some((path) => location.pathname === path);

  if (!shouldIncludeNavbar) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          {images.map((image, index) => (
            <img
              key={index}
              src={image.src}
              alt={image.alt}
              className="logo-image"
            />
          ))}
        </Link>
        <div className="menu-icon" onClick={handleClick}>
          <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
        </div>
        <ul className={click ? 'nav-menu active' : 'nav-menu'}>
          <li className="nav-item">
            <Link to="/" className="nav-links" onClick={closeMobileMenu}>
              HOME
            </Link>
          </li>
          <li className="nav-item">
            <Link to="/aboutus" className="nav-links" onClick={closeMobileMenu}>
              ABOUT
            </Link>
          </li>
        </ul>
        {button && (
          <div className="button-container">
            <Button type="login" buttonStyle="btn--outline">
              LOGIN
            </Button>
            <Button type="signup" buttonStyle="btn--outline">
              SIGN UP
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
