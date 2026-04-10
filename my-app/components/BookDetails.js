import { useState, useEffect } from "react";
import { Card, Button, Badge, Row, Col } from "react-bootstrap";
import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";
import { addToFavourites, removeFromFavourites } from "@/lib/userData";

export default function BookDetails({ book }) {
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);

  // Default changed to false (not derived inline as in A2)
  const [showAdded, setShowAdded] = useState(false);

  // objectID = the work key passed via props (strip "/works/" prefix)
  const objectID = book?.key?.replace("/works/", "");

  // useEffect keeps showAdded in sync with the favouritesList atom
  useEffect(() => {
    setShowAdded(favouritesList?.includes(objectID));
  }, [favouritesList, objectID]);

  // favouritesClicked is async per spec
  async function favouritesClicked() {
    if (showAdded) {
      // Already favourited - remove using workId from props
      setFavouritesList(await removeFromFavourites(objectID));
    } else {
      // Not yet favourited - add using workId from props
      setFavouritesList(await addToFavourites(objectID));
    }
  }

  if (!book) return null;

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <Row>
          {book.covers?.[0] && (
            <Col xs="auto" className="mb-3">
              <img
                src={`https://covers.openlibrary.org/b/id/${book.covers[0]}-M.jpg`}
                alt={book.title}
                style={{ width: 120, borderRadius: 4 }}
              />
            </Col>
          )}
          <Col>
            <Card.Title as="h3">{book.title}</Card.Title>
            {book.subjects?.length > 0 && (
              <div className="mb-3">
                {book.subjects.slice(0, 5).map((s, i) => (
                  <Badge bg="secondary" className="me-1" key={i}>{s}</Badge>
                ))}
              </div>
            )}
            {book.description && (
              <Card.Text>
                {typeof book.description === "string"
                  ? book.description
                  : book.description?.value}
              </Card.Text>
            )}
            <Button
              variant={showAdded ? "outline-danger" : "outline-primary"}
              onClick={favouritesClicked}
            >
              {showAdded ? "- favourite" : "+ favourite"}
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
