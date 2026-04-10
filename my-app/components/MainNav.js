import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";
import { readToken, removeToken } from "@/lib/authenticate";

export default function MainNav() {
  const router = useRouter();

  // Read token only on client to avoid hydration mismatch
  const [token, setToken] = useState(null);

  useEffect(() => {
    setToken(readToken());
  }, [router.asPath]);

  // logout: remove token then redirect to /login
  function logout() {
    removeToken();
    setToken(null);
    router.push("/login");
  }

  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} href="/">
          WEB422 &ndash; Books App
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">

          {/* Left nav - always visible. Favourites link moved to dropdown below */}
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/" active={router.pathname === "/"}>
              Home
            </Nav.Link>
            <Nav.Link as={Link} href="/about" active={router.pathname === "/about"}>
              About
            </Nav.Link>
          </Nav>

          {/* Shown ONLY when token exists (user logged in) */}
          {token && (
            <Nav>
              {/* title set to token.userName per spec */}
              <NavDropdown title={token.userName} id="user-nav-dropdown" align="end">
                {/* Favourites moved here as NavDropdown.Item */}
                <NavDropdown.Item as={Link} href="/favourites">
                  Favourites
                </NavDropdown.Item>
                <NavDropdown.Divider />
                {/* Logout invokes logout() */}
                <NavDropdown.Item onClick={logout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          )}

          {/* Shown ONLY when there is NO token (user not logged in) */}
          {!token && (
            <Nav>
              <Nav.Link as={Link} href="/register">
                Register
              </Nav.Link>
            </Nav>
          )}

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
