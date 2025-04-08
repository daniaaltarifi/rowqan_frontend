import { Row, Container, Col } from "react-bootstrap";
import BreadCrumbs from "../Component/BreadCrumbs";
import Carousel from "react-bootstrap/Carousel";
import PropTypes from "prop-types";
import whats from "../assets/whats.png";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../App.jsx";
import ChatNowHeader from "../Component/ChatNowHeader.jsx";
// import BestRated from "../Component/BestRated.jsx";
import { useUser } from "../Component/UserContext";
import SocialMediaButtons from "../Component/SocialMediaButtons.jsx";
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import '../Css/BookingChalets.css'


function BookingChalets() {
  const location = useLocation();
  const { id } = useParams();
  const { userId } = useUser();

  const lang = location.pathname.split("/")[1] || "en";
  const chaletsImages = location.state?.chaletsImages || [];
  const price = localStorage.getItem("price") || 0;
  const dataChalets = location.state?.dataChalets || [];
  const [contact, setContact] = useState([]);
  const rating = dataChalets.Rating;

  const colors = {
    orange: "#F2C265",
    grey: "#a9a9a9",
  };

 
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

 
  const getCarouselHeight = () => {
    if (windowWidth < 576) return '300px';
    if (windowWidth < 992) return '400px';
    return '550px';
  };

  
  const StarIcon = ({ filled }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        fill={filled ? colors.orange : colors.grey}
      />
    </svg>
  );

  StarIcon.propTypes = {
    filled: PropTypes.bool.isRequired, 
  };

  const getContact = useCallback(async () => {
    try {
      const contactRes = await axios.get(
        `${API_URL}/Contacts/getAllContacts?lang=${lang}`
      );

      setContact(contactRes.data);
    } catch (error) {
      console.error("Error fetching best rated services:", error);
    }
  }, [lang]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getContact();
  }, [lang, getContact]);
  
  const isImage = (fileName) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
  };

  const isVideo = (fileName) => {
    return /\.(mp4|mov|avi|mkv)$/i.test(fileName); 
  };
  
  const descriptionList = dataChalets.description?.split("\n") || [];

  return (
    <div>
      <SocialMediaButtons />
      <ChatNowHeader dataChalets={dataChalets} chalet_id={id} price={price} />

      <Container fluid className="chalet-container py-4">
        <Container>
         
          <div className="carousel-container mb-4 shadow-lg rounded overflow-hidden">
            <Carousel fade indicators={true} interval={3000} className="chalet-carousel">
              {chaletsImages.map((image, index) => (
                <Carousel.Item key={index}>
                  {isImage(image) ? (
                    <div className="carousel-image-container" style={{ height: getCarouselHeight() }}>
                      <img
                        alt="chalet view"
                        className="carousel-image"
                        src={`${image}`}
                      />
                    </div>
                  ) : isVideo(image) ? (
                    <div className="carousel-video-container" style={{ height: getCarouselHeight() }}>
                      <video
                        controls
                        className="carousel-video"
                        src={`${image}`}
                        type="video/mp4"
                      ></video>
                    </div>
                  ) : null}
                  <div className="breadcrumb-overlay">
                    <BreadCrumbs page_to="/ Booking Chalet" />
                  </div>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>

          <Row className="gx-4 gy-4">
            <Col lg={8} md={12}>
              <div className="chalet-overview p-4 rounded shadow-sm bg-white h-100">
                
                <div className="overview-section mb-4">
                  <h4 className="section-title position-relative">
                    {lang === "ar" ? "الملخص" : "Overview"}
                  </h4>
                  <div className="additional-features p-3 mt-3 rounded">
                    <Row className="g-3">
                      {dataChalets.Additional_features && dataChalets.Additional_features.split(',').map((feature, idx) => (
                        <Col xs={6} md={4} key={idx}>
                          <div className="feature-item text-center p-2 rounded">
                            <span>{feature.trim()}</span>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                </div>

                
                <div className="description-section mb-4">
                  <h4 className="section-title position-relative">
                    {lang === "ar" ? "الوصف" : "Description"}
                  </h4>
                  <div className="description-content p-3 mt-3">
                    {descriptionList.map((item, index) => (
                      <p key={index} className="mb-3">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>

                
                <div className="rating-section d-flex align-items-center mb-4">
                  <div className="rating-stars me-3">
                    {[...Array(5)].map((_, index) => (
                      <span
                        key={index}
                        className="star-icon"
                      >
                        {rating > index && rating < index + 1 ? 
                          <FaStarHalfAlt className="text-warning" /> : 
                          rating > index ? 
                          <FaStar className="text-warning" /> : 
                          <FaStar className="text-secondary opacity-50" />
                        }
                      </span>
                    ))}
                  </div>
                  <div className="rating-value">
                    <span className="fs-5 fw-bold">{rating}</span>
                    <span className="text-muted ms-1">/ 5</span>
                  </div>
                </div>

                
                <div className="price-section mb-4">
                  <div className="price-tag p-3 rounded text-center">
                    <h3 className="mb-0">
                      <span className="price-label">{lang === "ar" ? "السعر:" : "Price:"}</span>
                      <span className="price-value">{price}</span>
                      <span className="currency">JD</span>
                    </h3>
                  </div>
                </div>

               
                <div className="booking-section">
                  <Link to={`/${lang}/reservechalet/${id}`} className="text-decoration-none w-100">
                    <button className="reserve-button w-100 py-3">
                      <span className="fs-5 fw-bold">
                        {lang === "ar" ? "احجز الشاليه الآن" : "Reserve Now"}
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            </Col>

            
            <Col lg={4} md={12}>
              <div className="contact-box p-4 rounded shadow-sm bg-white text-center h-100">
                <div className="contact-icon mb-3">
                  <img src={whats} alt="whatsapp" className="contact-image" />
                </div>
                <h5 className="contact-title mb-4">
                  {lang === "ar" ? "يسعدنا التواصل معك" : "We are pleased to contact you"}
                </h5>
                <div className="contact-buttons">
                  {contact.map((contactus) => (
                    <Link
                      to={`${contactus.action}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      key={contactus.id}
                      className="text-decoration-none w-100 d-block mb-3"
                    >
                      <button className="contact-button w-100 py-2">
                        <span className="fw-bold">{contactus.title}</span>
                      </button>
                    </Link>
                  ))}
                  <Link 
                    to={userId ? `/${lang}/chatbot/${id}` : `/${lang}/login`}
                    className="text-decoration-none w-100 d-block mb-3"
                  >
                    <button className="chat-button w-100 py-2">
                      <span className="fw-bold">
                        {lang === "ar" ? "دردش الآن" : "Chat Now"}
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>

    </div>
  );
}

export default BookingChalets;