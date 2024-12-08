import { Container, Row, Col } from "react-bootstrap";
import { Link, useLocation, useParams } from "react-router-dom";
import TopPicks from "../Component/TopPicks";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../App";
function BasicDetailsChalets() {
  const { id } = useParams();
  const location = useLocation(); // To access passed state
  const lang = location.pathname.split("/")[1] || "en";

  const [chaletsImages, setChaletsImages] = useState([]);
  const [detailsChalets, setDetailsChalets] = useState([]);
  const price = location.state?.price; // Retrieve price from the state passed

  const fetchData = useCallback(async () => {
    try {
      const [chaletRes, detailsChalets] = await Promise.all([
        axios.get(`${API_URL}/chaletsimages/chaletgetChaletImage/${id}`),
        axios.get(
          `${API_URL}/chaletsdetails/getChaletDetailsByChaletId/${id}/${lang}`
        ),
      ]);
      setChaletsImages(chaletRes.data.images);
      setDetailsChalets(detailsChalets.data.chaletDetails);

      console.log("first iteration", detailsChalets.data.chaletDetails);
    } catch (error) {
      console.error("Error fetching best rated services:", error);
    }
  }, [lang]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [lang]);
  return (
    <div>
      <Container className="mt-5">
        <Row>
          <Col sm={12} md={12} lg={6}>
            <img
              src={`https://res.cloudinary.com/durjqlivi/${chaletsImages[0]}`}
              alt="chalets"
              height={"100%"}
              width={"100%"}
              className="img_chalets_basic_details"
            />
          </Col>
          <Col sm={12} md={12} lg={6} className="d-flex flex-column gap-2">
            {chaletsImages.slice(1).map((image, index) => (
              <img
                key={index}
                src={`https://res.cloudinary.com/durjqlivi/${image}`}
                alt={`chalets-${index}`}
                height="250px"
                width="100%"
                className="img_chalets_basic_details"
              />
            ))}
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={12} lg={6} className="mt-5">
            <h4 style={{ color: "#152C5B", fontWeight: "600" }}>
              About the place
            </h4>
            {detailsChalets.map((details) => (
              <h6 key={details.id}>{details.Detail_Type}</h6>
            ))}
          </Col>
          <Col
            sm={12}
            md={12}
            lg={6}
            className="mt-5 d-flex justify-content-center"
          >
            <div className="box_start_booking">
              <h6 style={{ color: "#152C5B", fontWeight: "600" }}>
                Start Booking
              </h6>
              {price ? (
                <h6 className="price_chalets">{price} per Day</h6>
              ) : (
                <h6>Price not available</h6>
              )}{" "}
              <Link to={`/${lang}/chaletdetails/${id}`}
              state={{price:price}}>
                <button className="booknow_button_events">Book Now </button>
              </Link>
            </div>
          </Col>
        </Row>
        <h4 style={{ color: "#152C5B", marginTop: "10vh" }}>
          Treasure to Choose
        </h4>
      </Container>
      <TopPicks />
    </div>
  );
}

export default BasicDetailsChalets;
