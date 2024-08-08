import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import dataService from '../services/data-service';
import logoutServiece from '../services/logout-serviece';
import './Navbar.css';

export function Navbar() {
  const [userId, setUserId] = useState(localStorage.getItem("userID"));
  const [token, setToken] = useState(localStorage.getItem("accessToken"));
  const [isAdmin, setIsAdmin] = useState(false);
  const location = useLocation();

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
    window.dispatchEvent(new Event('authChange'));
  }

  const isLoggedIn = userId && token;

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
    >
      <Container fluid>
        <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BootstrapNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <BootstrapNavbar.Brand as={Link} to="/mainPage">
              <img src="src/assets/logoWithoutBackground.png" alt="Logo" className="logo-image" />
            </BootstrapNavbar.Brand>
            {isLoggedIn ? (
              <div className='navLink'>
                <Nav.Link as={Link} to="/profile">פרופיל</Nav.Link>
                <Nav.Link as={Link} to="/mainPage" onClick={handleLogout}>התנתק</Nav.Link>
                <Nav.Link as={Link} to="/uploadproduct">תרמו כאן</Nav.Link>
                <Nav.Link as={Link} to="/about">על העמותה</Nav.Link>
                {isAdmin && <Nav.Link as={Link} to="/adminDashboard">ניהול</Nav.Link>}
              </div>
            ) : (
              <div className='navLink'>
                <Nav.Link as={Link} to="/login">התחבר</Nav.Link>
                <Nav.Link as={Link} to="/registration">הירשם</Nav.Link>
              </div>
            )}
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
}
