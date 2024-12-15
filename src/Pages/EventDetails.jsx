import { Container, Row, Col } from "react-bootstrap";
import { useState, useRef, useCallback, useEffect } from "react";
import arrow from "../assets/arrow.png";
import loca from "../assets/loca.png";
import people from "../assets/people.jpg";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../App";

function EventDetails() {
  const location = useLocation();
  const { id } = useParams();
  const lang = location.pathname.split("/")[1] || "en";
  const [largeImage, setLargeImage] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [imagesEvents, setImagesEvents] = useState([]);
  const smallImagesContainerRef = useRef(null);
  const [eventDetails, setEventDetails] = useState([]);
  const [plansEvent, setPlansEvent] = useState([]);
  const handleNextImages = () => {
    if (smallImagesContainerRef.current) {
      smallImagesContainerRef.current.scrollBy({
        left: 200, // Scroll right by 200px
        behavior: "smooth", // Smooth scroll
      });
    }
  };

  const handlePrevImages = () => {
    if (smallImagesContainerRef.current) {
      smallImagesContainerRef.current.scrollBy({
        left: -200, // Scroll left by 200px
        behavior: "smooth",
      });
    }
  };

  const fetchData = useCallback(
    async () => {
      try {
        const [eventRes, imageRes, plansRes] = await Promise.all([
          axios.get(
            `${API_URL}/availablevents/getavilablevntsbyid/${id}/${lang}`
          ),
          axios.get(`${API_URL}/availableimages/getavailableimage/${id}`),
          axios.get(`${API_URL}/plans/plans/event/${id}/${lang}`),
        ]);
        setEventDetails(eventRes.data);
        setImagesEvents(imageRes.data.images);
        setLargeImage(imageRes.data.images[0]?.image);
        setActiveImage(imageRes.data[0]?.image);
        setPlansEvent(plansRes.data.plans);
      } catch (error) {
        console.log("Error fetching data", error);
      }
    },
    [lang],
    id
  );
  useEffect(() => {
    fetchData();
  }, [lang, id]);
  const handleImageClick = (image) => {
    setLargeImage(image);
    setActiveImage(image);
  };

  // If no land details, render a loading message or an error
  if (!eventDetails.length) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Container>
        <h1>Details for this event</h1>
        <Row>
          <Col sm={12} md={12} lg={7} className=" image-grid">
            {/* Big Image */}
            <div className="big-image mb-3">
              <img
                src={`https://res.cloudinary.com/durjqlivi/${largeImage}`}
                alt="image"
                height={"350px"}
                width={"100%"}
              />
            </div>
            {/* Small Images with Arrows */}
            <Row className="d-flex justify-content-center position-relative">
              {/* Left Arrow Column */}
              <Col
                xs={1}
                sm={1}
                md={1}
                lg={1}
                xl={1}
                className="d-flex justify-content-center align-items-center"
              >
                <button className="arrow arrow-left" onClick={handlePrevImages}>
                  &#8249; {/* Left Arrow */}
                </button>
              </Col>
              {/* Small Images Column */}
              <Col
                xs={10}
                sm={10}
                md={10}
                lg={10}
                xl={10}
                className="d-flex justify-content-center"
              >
                <div
                  className="small-images-container"
                  ref={smallImagesContainerRef}
                >
                  {imagesEvents.map((images, index) => (
                    <Col
                      xs={3}
                      sm={3}
                      md={3}
                      lg={3}
                      key={index}
                      className="d-flex justify-content-center"
                    >
                      <img
                        src={`https://res.cloudinary.com/durjqlivi/${images.image}`}
                        className={`img-fluid small-image ${
                          activeImage ===
                          `https://res.cloudinary.com/durjqlivi/${images.image}`
                            ? "active"
                            : ""
                        }`}
                        alt={`Small Product ${index + 1}`}
                        onClick={() => handleImageClick(images.image)}
                        loading="lazy"
                      />
                    </Col>
                  ))}
                </div>
              </Col>
              {/* Right Arrow Column */}
              <Col
                xs={1}
                sm={1}
                md={1}
                lg={1}
                xl={1}
                className="d-flex justify-content-center align-items-center"
              >
                <button
                  className="arrow arrow-right"
                  onClick={handleNextImages}
                >
                  &#8250; {/* Right Arrow */}
                </button>
              </Col>
            </Row>
          </Col>
          <Col sm={12} md={12} lg={5}>
            <div className="chatbot_events">
              <h5 className="chat_title">Chat Now </h5>

              <div>
                <h6>Your Message</h6>
                <div className="d-flex justify-content-center align-items-center">
                  <input
                    type="text"
                    className="input_chatbot"
                    placeholder="Your Message"
                  />
                  <img src={arrow} height={"40px"} width={"50px"} alt="arrow" />
                </div>
              </div>
            </div>
          </Col>
        </Row>
        {eventDetails.map((details) => (
          <>
            <Row>
              <Col
                sm={12}
                md={6}
                lg={6}
                className="d-flex justify-content-between mt-5"
              >
                <div className="d-flex">
                  <img src={loca} height={"40px"} width={"50px"} alt="people" />
                  {details.location}
                </div>
                <div className="d-flex">
                  {" "}
                  <img
                    src={people}
                    height={"40px"}
                    width={"50px"}
                    alt="people"
                  />
                  Accommodates up to {details.no_people} people
                </div>
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={6} lg={6} className="mt-5">
                <h2>Description</h2>
                <h6>{details.description}</h6>
              </Col>
            </Row>
          </>
        ))}

          {plansEvent.map((plans) => (
            <>
        <Row>
              <Col sm={12} md={6} lg={6} className="mt-5">
                <h3>{plans.plane_type}:</h3>
                <ul>
                  <li>{plans.description_plan}</li>
                </ul>
              </Col>
        </Row>
            </>
          ))}
          <Link to={`/${lang}/reserveevent/${id}`}>
            <button className="booknow_button_events">Reserve Now</button>
          </Link>
      </Container>
    </div>
  );
}

export default EventDetails;
