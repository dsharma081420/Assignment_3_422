import { useAtom } from "jotai";
import { favouritesAtom } from "@/store";
import { removeFromFavourites } from "@/lib/userData";
import { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Button, Spinner } from "react-bootstrap";

export default function Favourites() {
  const [favouritesList, setFavouritesList] = useAtom(favouritesAtom);
  const [workDetails, setWorkDetails] = useState({});
  const [loading, setLoading] = useState({});

  const ids = useMemo(() => favouritesList ?? [], [favouritesList]);

  useEffect(() => {
    let cancelled = false;

    async function loadMissing() {
      if (!favouritesList) return;
      const missing = ids.filter((id) => !workDetails[id] && !loading[id]);
      if (missing.length === 0) return;

      setLoading((prev) => {
        const next = { ...prev };
        for (const id of missing) next[id] = true;
        return next;
      });

      await Promise.all(
        missing.map(async (id) => {
          try {
            const res = await fetch(`https://openlibrary.org/works/${id}.json`);
            if (!res.ok) throw new Error("Failed");
            const data = await res.json();
            if (cancelled) return;
            setWorkDetails((prev) => ({ ...prev, [id]: data }));
          } catch {
            if (cancelled) return;
            setWorkDetails((prev) => ({ ...prev, [id]: { title: id } }));
          } finally {
            if (cancelled) return;
            setLoading((prev) => ({ ...prev, [id]: false }));
          }
        })
      );
    }

    loadMissing();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ids]);

  async function handleRemove(id) {
    setFavouritesList(await removeFromFavourites(id));
  }

  // Guard added per Step 4 spec - prevents "Nothing Here" flash before atom loads
  if (!favouritesList) return null;

  return (
    <Container className="mt-4">
      <h1 className="mb-4">My Favourites</h1>
      {ids.length === 0 ? (
        <p className="text-muted">Nothing Here. Try adding some books!</p>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-3">
          {ids.map((id) => (
            <Col key={id}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column justify-content-between">
                  <div>
                    <Card.Title className="fs-6 mb-1">
                      {workDetails[id]?.title ?? id}
                    </Card.Title>
                    <Card.Text className="text-muted small mb-3">
                      <a href={`https://openlibrary.org/works/${id}`} target="_blank" rel="noreferrer">
                        {id}
                      </a>
                    </Card.Text>
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="align-self-start"
                    onClick={() => handleRemove(id)}
                  >
                    {loading[id] ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Removing...
                      </>
                    ) : (
                      <>&minus; Remove</>
                    )}
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
}
