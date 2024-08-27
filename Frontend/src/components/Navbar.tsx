import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import dataService from '../services/data-service';
import logoutServiece from '../services/logout-serviece';
import './Navbar.css';
import { User } from '../services/types';
import logo from '../assets/logoWithoutBackground.png';
import facebookLogo from '../assets/facebookLogo.png';
import instagramLogo from '../assets/instagramLogo.png';

interface NavbarProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  googleSignIn: boolean;
}

export function Navbar({ setUser }: NavbarProps) {
  const [userId, setUserId] = useState(localStorage.getItem("userID"));
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [isAdmin, setIsAdmin] = useState(false);
  const [expanded, setExpanded] = useState(false); // State to control menu collapse

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (userId) {
        try {
          const { data } = await dataService.getUser(userId).req;
          setIsAdmin(data.isAdmin);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    checkAdminStatus();

    const handleAuthChange = () => {
      setUserId(localStorage.getItem("userID"));
      setToken(localStorage.getItem("accessToken"));
      checkAdminStatus();
    };

    window.addEventListener("storage", handleAuthChange);
    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleAuthChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, [userId]);

  function handleLogout() {
    logoutServiece.postLogout();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userID");
    setUserId(null);
    setToken(null);
    setIsAdmin(false);
    setUser(null);
    window.dispatchEvent(new Event('authChange'));
  }

  const isLoggedIn = userId && token;

  const handleToggle = () => setExpanded(!expanded); // Toggle the expanded state

  const handleClose = () => setExpanded(false); // Close the menu when a link is clicked

  return (
    <BootstrapNavbar
      style={{
        fontFamily: "Rubik, sans-serif",
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
      expanded={expanded} // Set the expanded state
    >
      <Container fluid>
        <BootstrapNavbar.Toggle
          aria-controls="basic-navbar-nav"
          onClick={handleToggle} // Toggle the menu on click
        />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <div className="social-media">
              <a href="https://www.facebook.com/veahavtembeyahad/" target="_blank" rel="noopener noreferrer">
                <img src={facebookLogo} alt="Facebook" />
              </a>
              <a href="https://www.instagram.com/veahavtem_beyahad/" target="_blank" rel="noopener noreferrer">
                <img src={instagramLogo} alt="Instagram" />
              </a>
            </div>
            {isLoggedIn ? (
              <div className='navLink'>
                <Nav.Link as={Link} to="/mainPage" onClick={() => { handleLogout(); handleClose(); }}>התנתק</Nav.Link>
                {isAdmin && <Nav.Link as={Link} to="/adminDashboard" onClick={handleClose}>ניהול</Nav.Link>}
                <Nav.Link as={Link} to="/uploadproduct" onClick={handleClose}>תרמו כאן</Nav.Link>
                <Nav.Link as={Link} to="/about" onClick={handleClose}>על העמותה</Nav.Link>
                <Nav.Link as={Link} to="/profile" onClick={handleClose}>החשבון שלי</Nav.Link>
              </div>
            ) : (
              <div className='navLink'>
                <Nav.Link as={Link} to="/uploadProduct" onClick={handleClose}>שלום אורח</Nav.Link>
                <span style={{ margin: "0 -15px" }}>|</span>
                <Nav.Link as={Link} to="/login" onClick={handleClose}>התחבר</Nav.Link>
                <Nav.Link as={Link} to="/registration" onClick={handleClose}>הירשם</Nav.Link>
              </div>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
        <BootstrapNavbar.Brand as={Link} to="/mainPage" className="ms-auto">
          <img src={logo} alt="Logo" className="logo-image" />
        </BootstrapNavbar.Brand>
      </Container>
    </BootstrapNavbar>
  );
}
