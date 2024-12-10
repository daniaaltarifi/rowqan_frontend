import { Container, Card, Row, Col } from "react-bootstrap";
import "../Css/chalets.css";
import { Link } from "react-router-dom";
import TopPicks from "../Component/TopPicks";
import { useCallback, useEffect, useState } from "react";
import { API_URL } from "../App";
import axios from "axios";

function Chalets() {
  const lang = location.pathname.split("/")[1] || "en";
  const [sliderRes, setSliderRes] = useState([]);
  const [chaletsData, setChaletsData] = useState([]);
  const [statusChalets, setStatusChalets] = useState([]);
  const [statusId, setStatusId] = useState(null);
  const fetchData = useCallback(async () => {
    try {
      const [sliderRes, statueRes, chaletRes] = await Promise.all([
        axios.get(`${API_URL}/heroChalets/getAllHeroChalets/${lang}`),
        axios.get(`${API_URL}/status/getallstatuses/${lang}`),
        statusId
          ? axios.get(
              `${API_URL}/chalets/getallchaletsbystatus/${statusId}/${lang}`
            )
          : axios.get(`${API_URL}/chalets/getchalets/${lang}`),
      ]);
      setSliderRes(sliderRes.data.chaletsHeroes);
      setStatusChalets(statueRes.data.statuses);
      setChaletsData(chaletRes.data.chalets);
    } catch (error) {
      console.error("Error fetching best rated services:", error);
    }
  }, [lang, statusId]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [lang, statusId]);

  return (
    <>
      {sliderRes.map((slider) => (
        <div className="container_big_img" key={slider.id}>
          <img
            src={`https://res.cloudinary.com/durjqlivi/${slider.image}`}
            loading="lazy"
            alt="chalet"
            className="chalet_big_img"
          />
          <div className="centered_big_img_chalets">
            <h1>{slider.category}</h1>
            {statusChalets.map((statuses) => (
              <button
                key={statuses.id}
                className="chalets_btn"
                onClick={() => setStatusId(statuses.id)}
              >
                {statuses.status}
              </button>
            ))}
          </div>
        </div>
      ))}
      <Container className="margin_section">
        <Row>
          {chaletsData.map((chal) => (
            <>
              <Col xl={4} md={6} sm={12} key={chal.id}>
                <Link
                  to={`/${lang}/basicdetailschalet/${chal.id}`}
                  state={{ price: chal.reserve_price }}
                  style={{ textDecoration: "none" }}
                >
                  <Card className="cont_card_chalets">
                    <Card.Img
                      variant="top"
                      src={`https://res.cloudinary.com/durjqlivi/${chal.image}`}
                      height={"200px"}
                      className="object-fit-cover"
                    />
                    <Card.Body>
                      <Card.Title className="title_chalets">
                        {chal.title}
                      </Card.Title>
                    </Card.Body>
                    <Card.Body className="d-flex justify-content-evenly">
                      <div>
                        <Card.Text className="text_card_det">
                          {chal.reserve_price} JD
                        </Card.Text>
                        <Card.Text className="">{chal.Status.status}</Card.Text>
                      </div>
                      <button className="booknow_button_events">
                        View More
                      </button>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            </>
          ))}
        </Row>

        <h4 style={{ color: "#152C5B", marginTop: "10vh" }}>
          Treasure to Choose
        </h4>
      </Container>
      <TopPicks />
    </>
  );
}

export default Chalets;
