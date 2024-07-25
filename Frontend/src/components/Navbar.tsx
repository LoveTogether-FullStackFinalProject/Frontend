import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { MdHome } from "react-icons/md";
import './Navbar.css';
import { userID } from './Registration';

export function Navbar() {
  const [userId, setUserId] = useState(localStorage.getItem("userID"));
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const location = useLocation(); // Hook to get the current location

  useEffect(() => {
    const handleAuthChange = () => {
      setUserId(localStorage.getItem("userID"));
      setToken(localStorage.getItem("accessToken"));
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("authChange", handleAuthChange); // Listen for custom authChange event

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userID");
    setUserId(null);
    setToken(null);
    window.dispatchEvent(new Event('authChange')); // Dispatch custom event on logout
  }

  function isAdmin() {
    return userID ? true : false;
  }

  return (
    <BootstrapNavbar 
      style={{
        backgroundColor: 'white',
        boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        width: "100%",
        zIndex: 1000,
        minHeight: "80px",
        padding: "0",
      }}
      expand="md"
    >
      <Container fluid>
        
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {location.pathname === '/mainPage' && !token && !userID ? (
              <div className='navLinkMainpage'>
                 <BootstrapNavbar.Brand as={Link} to="/mainPage">
                </BootstrapNavbar.Brand>    
                <Nav.Link as={Link} to="/registration">הירשם</Nav.Link>
                <Nav.Link as={Link} to="/login">התחבר</Nav.Link>
              </div>
            ) : (
              (userId || token) ? (
                <div className='navLink'>
                  <Link to='/mainPage' className="nav-link home-icon">
                    <MdHome size={"2em"} style={{color:"black"}} />
                  </Link>
                  <Nav.Link as={Link} to="/mainPage" onClick={handleLogout}>התנתק</Nav.Link>
                  {isAdmin() ? (
                    <Nav.Link as={Link} to="/adminDashboard">ניהול</Nav.Link>
                  ) : (
                    <Nav.Link as={Link} to="/profile">פרופיל</Nav.Link>
                  )}
                  <Nav.Link as={Link} to="/uploadproduct">תרמו כאן</Nav.Link>
                  <Nav.Link as={Link} to="/about">על העמותה</Nav.Link>
                </div>
              ) : (
                <div className='navLink'>
                  <Nav.Link as={Link} to="/registration">הירשם</Nav.Link>
                  <Nav.Link as={Link} to="/login">התחבר</Nav.Link>
                  <Nav.Link as={Link} to="/uploadproduct">תרמו כאן</Nav.Link>
                  <Nav.Link as={Link} to="/about">על העמותה</Nav.Link>
                </div>
              )
            )}
             <BootstrapNavbar.Brand as={Link} to="/mainPage">
             <img src="src/assets/logoWithoutBackground.png" alt="Logo" className="logo-image" />
             </BootstrapNavbar.Brand>
         
            
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}
