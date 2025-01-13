import { Container, Row, Col, Button } from "react-bootstrap";
import { useState, useRef, useCallback, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../App";
import ChatNowHeader from "../Component/ChatNowHeader";
import BestRated from "../Component/BestRated";
import { useUser } from "../Component/UserContext";

function ChaletsDetails() {
  const location = useLocation();
  const { id } = useParams();
  const {userId}=useUser()
  const lang = location.pathname.split("/")[1] || "en";
  const price = location.state?.price || null;
  const [largeImage, setLargeImage] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const smallImagesContainerRef = useRef(null); // Ref for small images container
  const [chaletsImages, setChaletsImages] = useState([]);
  const [detailsChalets, setDetailsChalets] = useState([]);
  const [briefChalets, setBriefChalets] = useState([]);
  const [properitesChalets, setProperiteChalets] = useState([]);
  const isImage = (fileName) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName); // Checks if the file is an image
  };
  
  const isVideo = (fileName) => {
    return /\.(mp4|mov|avi|mkv)$/i.test(fileName); // Checks if the file is a video
  };
  
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
          axios.get(
            `${API_URL}/propschalets/getAllChaletPropsByChaletId/${id}/${lang}`
          ),
        ]);
      if (imgchaletRes.data !== chaletsImages) {
        setChaletsImages(imgchaletRes.data);
        setLargeImage(imgchaletRes.data[0]);
        setActiveImage(imgchaletRes.data[0]);
      }

      if (detailsChalets.data !== detailsChalets) {
        setDetailsChalets(detailsChalets.data);
      }

      if (briefRes.data !== briefChalets) {
        setBriefChalets(briefRes.data);
      }

      if (properitesRes.data !== properitesChalets) {
        setProperiteChalets(properitesRes.data);
      }
    } catch (error) {
      console.error("Error fetching chalet data:", error);
    }
  }, [
    lang,
    id,
    chaletsImages,
    detailsChalets,
    briefChalets,
    properitesChalets,
  ]); // Include state as dependencies to avoid redundant requests

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll only when necessary
    fetchData();
  }, [lang, id]); // This will run when `lang` or `id` changes

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
      <ChatNowHeader properitesChalets={properitesChalets} chalet_id={id} price={price} />
      <Container className="mt-5">
        <h1>
          {" "}
          {lang === "ar" ? "تفاصيل هذا الشاليه" : "Details for this chalets"}
        </h1>
        <Row>
        <Col sm={12} md={12} lg={7} className="image-grid">
  {/* Big Image or Video */}
  <div className="mb-3">
    {isImage(largeImage) ? (
      <img
        alt="image"
        height={"350px"}
        width={"100%"}
        src={`${largeImage}`}
        decoding="async"
        loading="eager"
      />
    ) : isVideo(largeImage) ? (
      <video
        controls
        autoPlay
        width="100%"
        height="350px"
        src={`${largeImage}`}
        type="video/mp4"
      >
      </video>
    ) : null}
  </div>

  {/* Small Images and Videos with Arrows */}
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

    {/* Small Media Column */}
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
        {chaletsImages.map((media, index) => (
          <Col
            xs={3}
            sm={3}
            md={3}
            lg={3}
            key={index}
            className="d-flex justify-content-center"
          >
            {isImage(media) ? (
              <img
                src={`${media}`}
                alt={`Small Media ${index + 1}`}
                className={`img-fluid small-image ${
                  activeImage ===
                  `${media}`
                    ? "active"
                    : ""
                }`}
                onClick={() => handleImageClick(media)}
                loading="lazy"
              />
            ) : isVideo(media) ? (
              <video
                className="video_chalets"
                onClick={() => handleImageClick(media)}
              >
                <source
                  src={`${media}`}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            ) : null}
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
      <button className="arrow arrow-right" onClick={handleNextImages}>
        &#8250; {/* Right Arrow */}
      </button>
    </Col>
  </Row>
</Col>

          <Col sm={12} md={12} lg={5}>
            <div className="box_Brief_characteristics">
              <ul>
                <h5 style={{ fontWeight: "bold" }}>
                  {" "}
                  {lang === "ar" ? "الخصائص" : "Brief characteristics"}
                </h5>
                {briefChalets.length > 0 ? (
                  briefChalets.map((brief) => (
                    <li key={brief.id}>
                      <b>{brief.type}:</b>
                      {brief.value}
                    </li>
                  ))
                ) : (
                  <li>No Brief characteristics</li>
                )}
              </ul>
              <Link to={userId ? (`/${lang}/chatbot/${id}`) : (`/${lang}/login`)}
 >
                <Button variant="outline-warning ">
                  {lang === "ar" ? "دردش الأن" : "Chat Now"}
                </Button>
              </Link>
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
  {/* For large screens (desktop and above) */}
  <div className="d-flex flex-wrap d-none d-md-flex">
  {properitesChalets.map((prop) => (
              <div className="d-flex flex-wrap mt-2" key={prop.id}>
                <img
                  srcSet={`
                 https://res.cloudinary.com/dqimsdiht/${prop.image}?w=400&f_auto&q_auto:eco 400w,
                `}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  decoding="async"
                  loading="lazy"
                  className="rounded-circle mx-2"
                  height={"25px"}
                  width={"25px"}
                  alt="properites"
                />{" "}
                {prop.title}
              </div>
            ))}
  </div>

  {/* For small screens (mobile and tablet) */}
  <div className="row d-md-none">
    {properitesChalets.map((prop) => (
      <div className="col-6 mb-3" key={prop.id}>
        <div className="d-flex flex-column align-items-center">
          <img
            srcSet={`https://res.cloudinary.com/dqimsdiht/${prop.image}?w=400&f_auto&q_auto:eco 400w`}
            sizes="(max-width: 768px) 100vw, 50vw"
            decoding="async"
            loading="lazy"
            className="rounded-circle mb-2"
            height="25px"
            width="25px"
            alt="properties"
          />
          <span>{prop.title}</span>
        </div>
      </div>
    ))}
  </div>

          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6} lg={6} className="mt-5">
            <div className="box_price">
              <h4
                style={{ color: "#152C5B", fontWeight: "600" }}
                className="px-3"
              >
                {lang === "ar" ? "السعر " : "Price :"}{" "}
              </h4>
              <h5>{price} JD</h5>
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
                {lang === "ar" ? "احجز الان " : "Reserve Now "}{" "}
              </button>
            </Link>
          </Col>
        </Row>
        <h4 style={{ color: "#152C5B", marginTop: "10vh" }}>
          {lang === "ar" ? "خيارات مفضلة " : " Treasure to Choose"}{" "}
        </h4>
        <BestRated />
      </Container>
    </div>
  );
}

export default ChaletsDetails;
