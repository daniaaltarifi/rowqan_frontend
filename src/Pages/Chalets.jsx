import { Container, Card, Row, Col } from "react-bootstrap";
import chal from "../assets/chal.png";
import chalet from "../assets/chalet.jpeg";
import top3 from "../assets/top3.jpg";
import top4 from "../assets/top4.jpg";
import "../Css/chalets.css";
import { Link } from "react-router-dom";
import TopPicks from "../Component/TopPicks";

function Chalets() {
  const lang = location.pathname.split("/")[1] || "en";

  const chaletsData = [
    {
      title: "Large 4-room apartment with a beautiful terrace",
      price: "320000 JD",
      location: "Jordan - Jarash",
      image: chalet,
    },
    {
      title: "Large 4-room apartment with a beautiful terrace",
      price: "320000 JD",
      location: "Jordan - Jarash",
      image: top3,
    },
    {
      title: "Large 4-room apartment with a beautiful terrace",
      price: "320000 JD",
      location: "Jordan - Jarash",
      image: top4,
    },
    {
      title: "Large 4-room apartment with a beautiful terrace",
      price: "320000 JD",
      location: "Jordan - Jarash",
      image: chalet,
    },
    {
      title: "Large 4-room apartment with a beautiful terrace",
      price: "320000 JD",
      location: "Jordan - Jarash",
      image: chalet,
    },
    {
      title: "Large 4-room apartment with a beautiful terrace",
      price: "320000 JD",
      location: "Jordan - Jarash",
      image: top3,
    },
  ];
  return (
    <>
      <div className="container_big_img">
        <img src={chal} alt="chalet" className="chalet_big_img" />
        <div className="centered_big_img_chalets">
          <h1>Chalets Details</h1>
          <button className="chalets_btn">Chalets For Rent</button>
          <button className="chalets_btn">Chalets For Sale</button>
        </div>
      </div>
      <Container className="margin_section">
        <Row>
          {chaletsData.map((chal,index) => (
            <>
              <Col xl={4} md={6} sm={12} key={index}>
            <Link to={`/${lang}/basicdetailschalet/${"1"}`} style={{textDecoration:"none"}}>
                <Card className="cont_card_chalets">
                  <Card.Img
                    variant="top"
                    src={chal.image}
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
                        {chal.price}
                      </Card.Text>
                      <Card.Text className="">{chal.location} </Card.Text>
                    </div>
                    <Link to={`/${lang}/basicdetailschalet/${"1"}`}>
                    <button className="booknow_button_events">
                        View More
                      </button>
                    </Link>
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
