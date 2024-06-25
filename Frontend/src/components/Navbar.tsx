import React, { useState, useEffect } from 'react';
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { MdHome } from "react-icons/md";
import logo from '../assets/logoVeahavtem.png';


export function Navbar() {
  const [userId, setUserId] = useState<string | null>(localStorage.getItem("userID"));

  useEffect(() => {
    const checkUserStatus = () => {
      const currentUserId = localStorage.getItem("userID");
      console.log("Current userID:", currentUserId);
      setUserId(currentUserId);
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
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userID");
    setUserId(null);
  }

  return (
    <BootstrapNavbar 
    
      style={{
        backgroundColor: "#9B4C1F", 
        marginTop: "60px",
        marginBottom: "-15px",
      }}
      dir="rtl"
    >
      <Container fluid className="justify-content-end">
      <img src={logo} alt="Logo" className="logo" style={{direction:"rtl"}} />
        <Nav>
          {userId ? (
            <>
              <Nav.Link as={Link} to="/profile" style={{color: "white"}}>
                פרופיל
              </Nav.Link>
              <Nav.Link as={Link} to="/uploadproduct" style={{color: "white"}}>
                תרמו כאן
              </Nav.Link>
              <Nav.Link as={Link} to="/about" style={{color: "white"}}>
                על העמותה
              </Nav.Link>
              <Nav.Link as={Link} to="/mainPage" onClick={handleLogout} style={{color: "white"}}>
                התנתק
              </Nav.Link>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="signup" style={{color: "white"}}>
                הירשם
              </Nav.Link>
              <Nav.Link as={Link} to="login" style={{color: "white"}}>
                התחבר
              </Nav.Link>
              <Nav.Link as={Link} to="/uploadproduct" style={{color: "white"}}>
                תרמו כאן
              </Nav.Link>
              <Nav.Link as={Link} to="about" style={{color: "white"}}>
                על העמותה
              </Nav.Link>
            </>
          )}
        </Nav>
        <BootstrapNavbar.Brand className="ms-auto"> 
          <Link style={{color: "white"}} to='/mainPage'>
            <MdHome size={"1.7em"} />
          </Link>
        </BootstrapNavbar.Brand>
      </Container>
    </BootstrapNavbar>
  );
}