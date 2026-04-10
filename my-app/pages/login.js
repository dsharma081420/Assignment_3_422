import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Form, Button, Card, Alert, Container, Row, Col } from "react-bootstrap";
import { authenticateUser } from "@/lib/authenticate";
import { getFavourites } from "@/lib/userData";
import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [warning, setWarning] = useState("");

  const [, setFavouritesList] = useAtom(favouritesAtom);

  async function updateAtom() {
    setFavouritesList(await getFavourites());
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await authenticateUser(user, password);
      await updateAtom();
      router.push("/");
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
              <h2 className="text-center mb-1">Login</h2>
              <p className="text-center text-muted mb-4">Sign in to your account:</p>

              {warning && (
                <Alert variant="danger" onClose={() => setWarning("")} dismissible>
                  {warning}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="loginUser">
                  <Form.Label>Username:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter username"
                    value={user}
                    onChange={(e) => setUser(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="loginPassword">
                  <Form.Label>Password:</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <div className="d-grid">
                  <Button variant="primary" type="submit">Login</Button>
                </div>
              </Form>

              <hr />
              <p className="text-center mb-0 small">
                Don&apos;t have an account?&nbsp;
                <Link href="/register">Register here</Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
