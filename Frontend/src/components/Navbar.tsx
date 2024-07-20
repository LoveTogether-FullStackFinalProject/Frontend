import React, { useState, useEffect } from 'react';
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { MdHome } from "react-icons/md";
import logo from '../assets/logoVeahavtem.png';
import dataService, { CanceledError } from '../services/data-service';
import logoutServiece from '../services/logout-serviece';
import './Navbar.css';

export function Navbar() {
  const [userId, setUserId] = useState<string | null>(localStorage.getItem("userID"));
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkUserStatus = async () => {
      const currentUserId = localStorage.getItem("userID");
      console.log("Current userID:", currentUserId);
      setUserId(currentUserId);

      if (currentUserId) {
        try {
          const { req, abort } = dataService.getUser(currentUserId);
          const userResponse = await req;
          setIsAdmin(userResponse.data.isAdmin);
          abort();
        } catch (err) {
          if (err instanceof CanceledError) return;
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    };

    checkUserStatus();
    window.addEventListener('storage', checkUserStatus);
    window.addEventListener('localStorageChanged', checkUserStatus);

    return () => {
      window.removeEventListener('storage', checkUserStatus);
      window.removeEventListener('localStorageChanged', checkUserStatus);
    };
  }, []);

  function handleLogout() {
    logoutServiece.postLogout();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userID");
    setUserId(null);
    setIsAdmin(false);
  }

  return (
    <BootstrapNavbar 
      style={{
        backgroundColor: "#F9DA78",
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
        <div className="navbar-container">
          <BootstrapNavbar.Brand>
            <img src={logo} alt="Logo" className="logo" />
          </BootstrapNavbar.Brand>
          <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" />
          <BootstrapNavbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              {userId ? (
                <div className='navLink'>
                  <Nav.Link as={Link} to="/mainPage" onClick={handleLogout}>התנתק</Nav.Link>
                  {isAdmin ? (
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
              )}
              <Link to='/mainPage' className="nav-link home-icon">
                <MdHome size={"2em"} style={{color:"black"}} />
              </Link>
            </Nav>
          </BootstrapNavbar.Collapse>
        </div>
      </Container>
    </BootstrapNavbar>
  );
}
