import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Form, Button, Card, Alert, Container, Row, Col } from "react-bootstrap";

// registerUser replaces authenticateUser per spec
import { registerUser } from "@/lib/authenticate";

// Removed: getFavourites, useAtom, favouritesAtom imports per spec

// Component renamed to Register per spec
export default function Register() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState(""); // Added with default "" per spec
  const [warning, setWarning] = useState("");

  // Removed: useAtom() calls per spec
  // Removed: updateAtom() function per spec

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await registerUser(user, password, password2); // passes password2 per spec
      // Removed: await updateAtom() per spec
      router.push("/login"); // redirect to /login per spec
    } catch (err) {
      setWarning(err.message);
    }
  }

  return (
    <Container>
      <Row className="justify-content-md-center mt-5">
        <Col md={6} lg={5}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              {/* Header changed to registration text per spec */}
              <h2 className="text-center mb-1">Register</h2>
              <p className="text-center text-muted mb-4">Register for an account:</p>

              {warning && (
                <Alert variant="danger" onClose={() => setWarning("")} dismissible>
                  {warning}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="registerUser">
                  <Form.Label>Username:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Choose a username"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="registerPassword">
                  <Form.Label>Password:</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Choose a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                {/* Added Form.Group for password2 per spec */}
                <Form.Group className="mb-4" controlId="registerPassword2">
                  <Form.Label>Confirm Password:</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Confirm your password"
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  {/* Button text changed to Register per spec */}
                  <Button variant="success" type="submit">Register</Button>
                </div>
              </Form>

              <hr />
              <p className="text-center mb-0 small">
                Already have an account?&nbsp;
                <Link href="/login">Login here</Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
