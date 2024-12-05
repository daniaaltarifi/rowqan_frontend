import { Container, Row, Col } from "react-bootstrap";
import chalet from "../assets/chalet.jpeg";
import top3 from "../assets/top3.jpg";
import top4 from "../assets/top4.jpg";
import { Link } from "react-router-dom";
import TopPicks from "../Component/TopPicks";
function BasicDetailsChalets() {
  const lang = location.pathname.split("/")[1] || "en";

  return (
    <div>
      <Container className="mt-5">
        <Row>
          <Col sm={12} md={12} lg={6}>
            <img
              src={chalet}
              alt="chalets"
              height={"100%"}
              width={"100%"}
              className="img_chalets_basic_details"
            />
          </Col>
          <Col sm={12} md={12} lg={6} className="d-flex flex-column gap-2">
            <img
              src={top3}
              alt="chalets"
              height={"250px"}
              width={"100%"}
              className="img_chalets_basic_details"
            />
            <img
              src={top4}
              alt="chalets"
              height={"250px"}
              width={"100%"}
              className="img_chalets_basic_details"
            />
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={12} lg={6} className="mt-5">
            <h4 style={{ color: "#152C5B", fontWeight: "600" }}>
              About the place
            </h4>
            <h6>
              Minimal techno is a minimalist subgenre of techno music. It is
              characterized by a stripped-down aesthetic that exploits the use
              of repetition and understated development. Minimal techno is
              thought to have been originally developed in the early 1990s by
              Detroit-based producers Robert Hood and Daniel Bell.
            </h6>
          </Col>
          <Col sm={12} md={12} lg={6} className="mt-5 d-flex justify-content-center">
            <div className="box_start_booking">
              <h6 style={{ color: "#152C5B", fontWeight: "600" }}>Start Booking</h6>
              <h6 className="price_chalets">$200 per Day</h6>
              <Link to={`/${lang}/chaletdetails/${"1"}`}>
                <button className="booknow_button_events">Book Now </button>
              </Link>
            </div>
          </Col>
        </Row>
        <h4 style={{ color: "#152C5B", marginTop: "10vh" }}>
          Treasure to Choose
        </h4>
      </Container>
      <TopPicks/>
    </div>
  );
}

export default BasicDetailsChalets;
