import { Container, Row, Col } from "react-bootstrap";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../App";

function SecondLands() {
  const lang = location.pathname.split("/")[1] || "en";
  const [landsimage, setlandsimage] = useState([]);

  const getlandsimage = useCallback(async () => {
    try {
      const landRes = await axios.get(
        `${API_URL}/categorieslands/getAllcategoryLand/${lang}`
      );
      setlandsimage(landRes.data.categoryLands);
      console.log(landRes.data);
    } catch (error) {
      console.error("Error fetching category lands:", error);
    }
  }, [lang]);

  useEffect(() => {
    getlandsimage();
  }, [lang]);

  return (
    <div className="cont_exclusive_lands margin_section">
      <h4 className="title_exclusive_lands">Exclusive Properties</h4>
      <Container>
        <Row>
          {/* First Column */}
          {landsimage.length > 0 && landsimage[0]?.image ? (
            <Col xl={6} md={6} sm={12} className="d-flex align-items-stretch">
              <img
                src={`https://res.cloudinary.com/durjqlivi/${landsimage[0].image}`}
                alt="lands img"
                className="rounded img-fluid"
                loading="lazy"
              />
            </Col>
          ) : null}

          {/* Second Column */}
          {landsimage.length > 1 && landsimage[1]?.image ? (
            <Col xl={6} md={6} sm={12} className="d-flex flex-column">
              <img
                src={`https://res.cloudinary.com/durjqlivi/${landsimage[1].image}`}
                alt="lands img"
                className="rounded img-fluid"
                style={{ height: "65%" }}
                loading="lazy"
              />
              <div className="d-flex flex-wrap">
                {landsimage[2]?.image && (
                  <Col xl={6} md={6} sm={12} className="d-flex align-items-stretch">
                    <img
                      src={`https://res.cloudinary.com/durjqlivi/${landsimage[2].image}`}
                      alt="lands img"
                      className="rounded img-fluid"
                      loading="lazy"
                    />
                  </Col>
                )}
                {landsimage[3]?.image && (
                  <Col xl={6} md={6} sm={12} className="d-flex align-items-stretch">
                    <img
                      src={`https://res.cloudinary.com/durjqlivi/${landsimage[3].image}`}
                      alt="lands img"
                      className="rounded img-fluid"
                      loading="lazy"
                    />
                  </Col>
                )}
              </div>
            </Col>
          ) : null}
        </Row>
      </Container>
    </div>
  );
}

export default SecondLands;
