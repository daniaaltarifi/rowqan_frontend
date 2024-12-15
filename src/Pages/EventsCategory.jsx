import { Col, Container, Row, Card } from "react-bootstrap";
import wedding from "../assets/wedding.jpg";
import PropTypes from "prop-types";
import { Link, useParams } from "react-router-dom";
import people from "../assets/people.jpg";
import dollar from "../assets/dollar.png";
import rating from "../assets/rating.png";
import loca from "../assets/loca.png";
import chat from "../assets/chat.png";
import cashback from "../assets/cashback.jpg";
import { useLocation } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../App";
function EventsCategory() {
    const location=useLocation();
    const {id}=useParams()
  const lang = location.pathname.split("/")[1] || "en";
  const [eventsAvailable, setEventsAvailable] = useState([]);

  const colors = {
    orange: "#F2C265",
    grey: "#a9a9a9",
  };

  // Star icon SVG component
  const StarIcon = ({ filled }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        fill={filled ? colors.orange : colors.grey} // Use colors.orange for filled and colors.grey for empty
      />
    </svg>
  );
  // Prop types validation for StarIcon
  StarIcon.propTypes = {
    filled: PropTypes.bool.isRequired, // Validate that 'filled' is a required boolean
  };
  const fetchData = useCallback(async()=>{
try {
  const res=await axios.get(`${API_URL}/availablevents/subevent/${id}/${lang}`)
  setEventsAvailable(res.data)
} catch (error) {
  console.log("Error fetching data",error)
}
  },[lang,id])
  useEffect(()=>{
    window.scrollTo(0,0);
fetchData()
  },[lang,id])
  return (
    <div>
      <img src={wedding} alt="wedding" className="catg_events" />
      <Container className="margin_section">
        <Row>
          {eventsAvailable.map((event)=>(
            <>
          <Col xl={6} md={6} sm={12} key={event.id}>
            <Card className="cont_card_chalets">
              <Card.Img
                variant="top"
                src={`https://res.cloudinary.com/durjqlivi/${event.image}`}
                height={"250px"}
                className="object-fit-cover"
              />
              <Card.Body>
                <Card.Title className="title_chalets">
{event.title}                </Card.Title>
              </Card.Body>
              <Card.Body className="d-flex justify-content-between flex-wrap ">
                <Card.Text className="text_card_det mb-5">
                  <img
                    src={people}
                    height={"40px"}
                    width={"50px"}
                    alt="people"
                  />
                  Accommodates up to {event.no_people} people
                </Card.Text>
                <Card.Text className="text_card_det">
                  <img
                    src={dollar}
                    height={"40px"}
                    width={"50px"}
                    alt="dollar"
                  />{" "}
                  {event.price} JD
                </Card.Text>
                <Card.Text className="text_card_det">
                  <div className="cont_rating">
                  <img
                    src={rating}
                    height={"40px"}
                    width={"50px"}
                    alt="rating"
                  />
                  
                    {[...Array(5)].map((_, index) => (
                      <span
                        key={index}
                        style={{ display: "inline-block", marginRight: "5px" }}
                      >
                        <StarIcon filled={event.rating > index} />
                      </span>
                    ))}
                  </div>
                </Card.Text>
                <Card.Text className="text_card_det">
                  <img
                    src={loca}
                    height={"40px"}
                    width={"50px"}
                    alt="dollar"
                  />{" "}
                 {event.location}
                </Card.Text>
              </Card.Body>
              <Card.Body className="d-flex justify-content-between flex-wrap">
                <Card.Text className="text_card_det">
                  <img
                    src={cashback}
                    height={"40px"}
                    width={"50px"}
                    alt="dollar"
                  />{" "}
                  10% Cashback{" "}
                </Card.Text>
              </Card.Body>
              <Card.Body className="d-flex justify-content-center ">
              <Link to={`/${lang}/eventdetails/${"1"}`}>
              <button className="booknow_button_events">Book Now</button>
                </Link>
                <Link style={{textDecoration:"none",color:"#000"}}>
                  <h6>
                    <img
                      src={chat}
                      height={"40px"}
                      width={"40px"}
                      alt="dollar"
                    />
                    Chat Now
                  </h6>
                </Link>
              </Card.Body>
            </Card>
          </Col>
            </>
          ))}
   
        </Row>
      </Container>
    </div>
  );
}

export default EventsCategory;
