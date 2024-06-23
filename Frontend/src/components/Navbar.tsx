import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import BootstrapNavbar from "react-bootstrap/Navbar";
import { Link } from "react-router-dom";
import { User } from "../services/types";
import { MdHome } from "react-icons/md";

export function Navbar({
  user,
  setUser,
}: {
  user: User;
  setUser: (user: User | null) => void;
  googleSignIn: boolean;
}) {
  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  }

  const token = localStorage.getItem("accessToken");
      
  return (
    <BootstrapNavbar 
      style={{
        backgroundColor: "#9B4C1F", 
        marginTop: "60px",
        marginBottom: "-15px",
      }}
      dir="rtl" // Add this attribute for RTL
    >
      <Container fluid className="justify-content-end"> {/* Change this */}
        <Nav>
          {user || token ? (
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