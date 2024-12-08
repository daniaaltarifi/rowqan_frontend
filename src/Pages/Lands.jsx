import "../Css/lands.css";
import SecondLands from "./SecondLands";
import land from "../assets/land.jpg";
import wide from "../assets/wide.png";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../App";
function Lands() {
  const lang = location.pathname.split("/")[1] || "en";
  const [landsData, setlandsData] = useState([]);

  const getlandsData = useCallback(async () => {
    try {
      const landRes = await axios.get(
        `${API_URL}/categorieslands/getAllcategoryLand/${lang}`
      );

      setlandsData(landRes.data.categoryLands);
    } catch (error) {
      console.error("Error fetching best rated services:", error);
    }
  }, [lang]);

  useEffect(() => {
    getlandsData();
  }, [lang]);

  return (
    <>
      <div className="container_big_img">
        <img src={land} alt="chalet" className="chalet_big_img" />
        <div className="centered_big_img_chalets">
          <h1>Discover a place youll love to live</h1>
          <h6 className="mt-4">
            Pellentesque egestas elementum egestas faucibus sem. Velit nunc
            egestas ut morbi. Leo diam diam
          </h6>
          <button className="lands_btn">View Properties</button>
        </div>
      </div>
      <Container className="margin_section">
        <h3 className="mb-5">
          <b> {lang === "ar" ? "جميع الفئات" : "ALL CATEGORIES "}</b>
        </h3>
        <Row>
          {landsData.map((land) => (
            <>
              <Col xl={4} md={6} sm={12} key={land.id}>
                <Link
                  to={`/${lang}/landdetails/${land.id}`}
                  style={{ textDecoration: "none" }}
                >
                  <Card className="cont_card_lands">
                    <Card.Img
                      variant="top"
                      src={`https://res.cloudinary.com/durjqlivi/${land.image}`}                      height={"200px"}
                      className="object-fit-cover"
                    />
                    <Card.Body className="d-flex justify-content-evenly">
                      <div>
                        <Card.Text>
                          <b>{land.title}</b>
                        </Card.Text>
                        <Card.Text className="">{land.location} </Card.Text>
                      </div>
                      <Card.Text className="text_card_det">
                        {land.price}
                      </Card.Text>
                    </Card.Body>
                          <Card.Body className="d-flex justify-content-between flex-wrap">
                    {land.PropertiesLands &&
                      land.PropertiesLands.map((prop) => (
                            <span key={prop.id}>
                              <img
                                src={`https://res.cloudinary.com/durjqlivi/${prop.image}`}
                                alt="wide"
                                height={"35px"}
                                width={"35px"}
                                className="rounded-circle"
                              />
                              {prop.property}
                            </span>
                      ))}
                          </Card.Body>
                  </Card>
                </Link>
              </Col>
            </>
          ))}
        </Row>
      </Container>
      <Container className="margin_section ">
        <Row className="text-center margin_section ">
          <h2 className="mb-5">Why You Should Work With Us</h2>
          <Col xl={4} md={6} sm={12} className="d-flex justify-content-center">
            <div className="d-flex">
              <div>
                <img
                  src={wide}
                  alt="wide range"
                  height={"50px"}
                  width={"50px"}
                />
                <h5 className="py-3">Wide Range of Properties</h5>
                <h6 className="why_work_text">
                  We offer expert legal help for all related property items in
                  Dubai.
                </h6>
              </div>
            </div>
          </Col>
          <Col xl={4} md={6} sm={12} className="d-flex justify-content-center">
            <div className="d-flex">
              <div>
                <img
                  src={wide}
                  alt="wide range"
                  height={"50px"}
                  width={"50px"}
                />
                <h5 className="py-3">Wide Range of Properties</h5>
                <h6 className="why_work_text">
                  We offer expert legal help for all related property items in
                  Dubai.
                </h6>
              </div>
            </div>
          </Col>
          <Col xl={4} md={6} sm={12} className="d-flex justify-content-center">
            <div className="d-flex">
              <div>
                <img
                  src={wide}
                  alt="wide range"
                  height={"50px"}
                  width={"50px"}
                />
                <h5 className="py-3">Wide Range of Properties</h5>
                <h6 className="why_work_text">
                  We offer expert legal help for all related property items in
                  Dubai.
                </h6>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
      <SecondLands />
    </>
  );
}

export default Lands;
