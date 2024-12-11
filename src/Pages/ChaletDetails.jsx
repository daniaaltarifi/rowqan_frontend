import { Container, Row, Col } from "react-bootstrap";
import { useState, useRef, useCallback, useEffect } from "react";
import arrow from "../assets/arrow.png";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../App";
function ChaletsDetails() {
  const location = useLocation();
  const { id } = useParams();
  const lang = location.pathname.split("/")[1] || "en";
  const price = location.state?.price || null;
  const [largeImage, setLargeImage] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const smallImagesContainerRef = useRef(null); // Ref for small images container

  const [chaletsImages, setChaletsImages] = useState([]);
  const [detailsChalets, setDetailsChalets] = useState([]);
  const [briefChalets, setBriefChalets] = useState([]);
  const [properitesChalets, setProperiteChalets] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const [imgchaletRes, detailsChalets, briefRes, properitesRes] =
        await Promise.all([
          axios.get(`${API_URL}/chaletsimages/chaletgetChaletImage/${id}`),
          axios.get(
            `${API_URL}/chaletsdetails/getChaletDetailsByChaletId/${id}/${lang}`
          ),
          axios.get(
            `${API_URL}/BreifDetailsChalets/getBreifsByChaletId/${id}/${lang}`
          ),
          axios.get(`${API_URL}/propschalets/getAllPropsChalet/${lang}`),
        ]);
      setChaletsImages(imgchaletRes.data.images);
      setDetailsChalets(detailsChalets.data.chaletDetails);
      setLargeImage(imgchaletRes.data.images[0]);
      setActiveImage(imgchaletRes.data[0]);
      setBriefChalets(briefRes.data.breifDetails);
      setProperiteChalets(properitesRes.data.data);
    } catch (error) {
      console.error("Error fetching best rated services:", error);
    }
  }, [lang]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [lang]);
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
        behavior: "smooth", // Smooth scroll
      });
    }
  };

  const handleImageClick = (image) => {
    setLargeImage(image);
    setActiveImage(image);
  };

  return (
    <div>
      <Container className="mt-5">
        <h1>Details for this chalets</h1>
        <Row>
          <Col sm={12} md={12} lg={6} className=" image-grid">
            {/* Big Image */}
            <div className="mb-3">
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
                  {chaletsImages.map((image, index) => (
                    <Col
                      xs={3}
                      sm={3}
                      md={3}
                      lg={3}
                      key={index}
                      className="d-flex justify-content-center"
                    >
                      <img
                        src={`https://res.cloudinary.com/durjqlivi/${image}`}
                        className={`img-fluid small-image ${
                          activeImage ===
                          `https://res.cloudinary.com/durjqlivi/${image}`
                            ? "active"
                            : ""
                        }`}
                        alt={`Small Product ${index + 1}`}
                        onClick={() => handleImageClick(image)}
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
          <Col sm={12} md={12} lg={6}>
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
        <Row>
          <Col
            sm={12}
            md={6}
            lg={6}
            className="d-flex justify-content-around mt-5"
          >
            {properitesChalets.map((prop) => (
              <div className="d-flex" key={prop.id}>
                <img
                  src={`https://res.cloudinary.com/durjqlivi/${prop.image}`}
                  className="rounded-circle mx-2"
                  height={"25px"}
                  width={"25px"}
                  alt="properites"
                />{" "}
                {prop.title}
              </div>
            ))}
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6} lg={6} className="mt-5">
            <div className="box_price">
              <h4
                style={{ color: "#152C5B", fontWeight: "600" }}
                className="px-3"
              >
                Price:
              </h4>
              <h5>{price}</h5>
            </div>
            {detailsChalets.map((details) => (
              <>
                <h6>{details.Detail_Type}</h6>
              </>
            ))}
            <Link
              to={`/${lang}/bookingchalet/${id}`}
              state={{
                chaletsImages,
                price,
                detailsChalets,
                properitesChalets,
              }}
            >
              <button className="booknow_button_events mt-4">
                Reserve Now
              </button>
            </Link>
          </Col>
          <Col sm={12} md={6} lg={6} className="cont_Brief_characteristics">
            <div className="box_Brief_characteristics">
              <ul>
                <h5 style={{ fontWeight: "bold" }}>Brief characteristics</h5>
                {briefChalets.map((brief) => (
                  <li key={brief.id}>
                    <b>{brief.type}:</b>
                    {brief.value}
                  </li>
                ))}
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ChaletsDetails;
