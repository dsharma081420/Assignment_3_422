/*********************************************************************************
 * WEB422 – Assignment 3
 *
 * I declare that this assignment is my own work in accordance with Seneca's
 * Academic Integrity Policy:
 *
 * https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *
 * Name: Dhruv Sharma Student ID: ______________ Date: 2026-04-10
 *
 * Vercel App (Deployed) Link: _____________________________________________________
 *
 ********************************************************************************/

import { useState } from "react";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import BookDetails from "@/components/BookDetails";

export default function Home() {
  const [query, setQuery] = useState("");
  const [searchField, setSearchField] = useState("title");
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [searched, setSearched] = useState(false);

  async function handleSearch(e) {
    e.preventDefault();
    if (!query.trim()) return;
    const url = `https://openlibrary.org/search.json?${searchField}=${encodeURIComponent(query)}&limit=12`;
    const res = await fetch(url);
    const data = await res.json();
    setBooks(data.docs || []);
    setSelectedBook(null);
    setSearched(true);
  }

  async function handleBookClick(workKey) {
    const key = workKey.replace("/works/", "");
    const res = await fetch(`https://openlibrary.org/works/${key}.json`);
    const data = await res.json();
    setSelectedBook(data);
  }

  return (
    <Container className="mt-4">
      <h1 className="mb-4">Book Search</h1>

      <Form onSubmit={handleSearch} className="mb-4">
        <Row className="g-2 align-items-end">
          <Col xs={12} md={6}>
            <Form.Control
              type="text"
              placeholder="Enter search term..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Col>
          <Col xs={12} md={3}>
            <Form.Select value={searchField} onChange={(e) => setSearchField(e.target.value)}>
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="subject">Subject</option>
            </Form.Select>
          </Col>
          <Col xs="auto">
            <Button type="submit" variant="primary">Search</Button>
          </Col>
        </Row>
      </Form>

      {selectedBook && (
        <div className="mb-4">
          <BookDetails book={selectedBook} />
        </div>
      )}

      {searched && books.length === 0 && (
        <p className="text-muted">No results found.</p>
      )}

      <Row xs={1} md={2} lg={3} className="g-3">
        {books.map((book) => (
          <Col key={book.key}>
            <Card
              className="h-100 shadow-sm"
              style={{ cursor: "pointer" }}
              onClick={() => handleBookClick(book.key)}
            >
              <Card.Body>
                <Card.Title className="fs-6">{book.title}</Card.Title>
                {book.author_name && (
                  <Card.Text className="text-muted small">
                    {book.author_name.slice(0, 2).join(", ")}
                  </Card.Text>
                )}
                {book.first_publish_year && (
                  <Card.Text className="small">First published: {book.first_publish_year}</Card.Text>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}
