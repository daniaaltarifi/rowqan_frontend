import { Container, Row, Col } from "react-bootstrap";
import { useState, useRef, useEffect, useCallback } from "react";
import arrow from "../assets/arrow.png";
import { Link, useLocation, useParams } from "react-router-dom";
import { API_URL } from "../App";
import axios from "axios";

function LandsDetails() {
  const location = useLocation();
  const { id } = useParams();
  const lang = location.pathname.split("/")[1] || "en";
  const [landDetails, setlandDetails] = useState([]);
  const [propertyland, setpropertyland] = useState([]);

  const [largeImage, setLargeImage] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const smallImagesContainerRef = useRef(null);

  const getLandDetails = useCallback(async () => {
    try {
      const [imageRes, propertyRes] = await Promise.all([
        axios.get(`${API_URL}/imageslands/getImagesByCategoryId/${id}`),
        axios.get(
          `${API_URL}/propertyLands/getAllPropertyLandsByLandId/${id}/${lang}`
        ),
      ]);
      console.log("Land details imageResponse", propertyRes.data);
      setlandDetails(imageRes.data);
      setLargeImage(imageRes.data[0]?.image);
      setActiveImage(imageRes.data[0]?.image);

      setpropertyland(propertyRes.data);
    } catch (error) {
      console.error("Error fetching land details:", error);
    }
  }, [id, lang]);

  useEffect(() => {
    getLandDetails();
  }, [getLandDetails]);

  // Scroll to the next/prev set of small images
  const handleNextImages = () => {
    if (smallImagesContainerRef.current) {
      smallImagesContainerRef.current.scrollBy({
        left: 200, // Scroll right by 200px
        behavior: "smooth",
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

  // Handle click on a small image to update the large image
  const handleImageClick = (image) => {
    setLargeImage(image);
    setActiveImage(image);
  };

  // If no land details, render a loading message or an error
  if (!landDetails.length) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <Container className="mt-5">
        <h1> {lang==='ar'?"تفاصيل عن هذه الأرض":"Details for this land  "}
        </h1>
        <Row>
          {/* Big Image */}
          <Col sm={12} md={12} lg={6} className="image-grid">
            <div className="mb-3">
              <img
                src={`https://res.cloudinary.com/durjqlivi/${largeImage}`}
                alt="Large Image"
                height={"350px"}
                width={"100%"}
                style={{ objectFit: "cover" }}
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
                  {landDetails.map((land, index) => (
                    <Col
                      xs={3}
                      sm={3}
                      md={3}
                      lg={3}
                      key={index}
                      className="d-flex justify-content-center"
                    >
                      <img
                        src={`https://res.cloudinary.com/durjqlivi/${land.image}`}
                        className={`img-fluid small-image ${
                          activeImage ===
                          `https://res.cloudinary.com/durjqlivi/${land.image}`
                            ? "active"
                            : ""
                        }`}
                        alt={`Small Image ${index + 1}`}
                        onClick={() => handleImageClick(land.image)} // Click on small image to update large image
                        loading="lazy"
                        style={{ cursor: "pointer", objectFit: "cover" }}
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
          <Col sm={12} md={12} lg={6}>
            <div className="chatbot_events">
              <h5 className="chat_title"> {lang==='ar'?"دردش الآن":"Chat Now"}
              </h5>

              <div>
                <h6>{lang==='ar'?"رسالتك":"Your Message"}</h6>
                <div className="d-flex justify-content-center align-items-center">
                  <input
                    type="text"
                    className="input_chatbot"
                    placeholder={lang==='ar'?"رسالتك":"Your Message"}
                  />
                  <img src={arrow} height={"40px"} width={"50px"} alt="arrow" />
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col sm={12} md={6} lg={6} className="cont_Brief_characteristics ">
            <div className="box_Brief_characteristics_lands">
              <ul>
                <h5 style={{ fontWeight: "bold" }}>{lang==='ar'?"الخصائص":"Brief characteristics"}</h5>
                {propertyland.map((prop) => (
                  <>
                    <li key={prop.id}>{prop.property}</li>
                  </>
                ))}
              </ul>
            </div>
          </Col>
          <Link to={`/${lang}/bookingland/${id}`}>
            <button className="booknow_button_events mt-5">{lang==='ar'?"احجز الان":"Reserve Now"}</button>
          </Link>
        </Row>
      </Container>
    </div>
  );
}

export default LandsDetails;
