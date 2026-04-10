import { Container } from "react-bootstrap";

export default function About() {
  return (
    <Container className="mt-4">
      <h1>About</h1>
      <p className="lead">
        This Books App was built for WEB422 Assignment 3 at Seneca Polytechnic.
      </p>
      <p>
        It uses the Open Library API to search for books. Registered users can
        save their favourite titles, which are persisted in MongoDB and stay
        accessible across sessions and devices.
      </p>
    </Container>
  );
}
