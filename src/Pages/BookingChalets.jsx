import { Row, Container, Col } from "react-bootstrap";
import BreadCrumbs from "../Component/BreadCrumbs";
import Carousel from "react-bootstrap/Carousel";
// import PropTypes from "prop-types";
import check from "../assets/check.png";
import whats from "../assets/whats.png";
import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../App.jsx";
import ChatNowHeader from "../Component/ChatNowHeader.jsx";
import BestRated from "../Component/BestRated.jsx";
import { useUser } from "../Component/UserContext";

function BookingChalets() {
  const location = useLocation();
  const { id } = useParams();
  const { userId } = useUser();

  const lang = location.pathname.split("/")[1] || "en";
  const chaletsImages = location.state?.chaletsImages || [];
  const price = location.state?.price || null;
  const detailsChalets = location.state?.detailsChalets || [];
  const properitesChalets = location.state?.properitesChalets || [];
  const [contact, setContact] = useState([]);
  // const rating = 5;

  // const colors = {
  //   orange: "#F2C265",
  //   grey: "#a9a9a9",
  // };

  // // Star icon SVG component
  // const StarIcon = ({ filled }) => (
  //   <svg
  //     xmlns="http://www.w3.org/2000/svg"
  //     viewBox="0 0 24 24"
  //     width="24"
  //     height="24"
  //   >
  //     <path
  //       d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
  //       fill={filled ? colors.orange : colors.grey} // Use colors.orange for filled and colors.grey for empty
  //     />
  //   </svg>
  // );
  // // Prop types validation for StarIcon
  // StarIcon.propTypes = {
  //   filled: PropTypes.bool.isRequired, // Validate that 'filled' is a required boolean
  // };

  const getContact = useCallback(async () => {
    try {
      const contactRes = await axios.get(
        `${API_URL}/Contacts/getAllContacts/${lang}`
      );

      setContact(contactRes.data);
    } catch (error) {
      console.error("Error fetching best rated services:", error);
    }
  }, [lang]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getContact();
  }, [lang]);
  const isImage = (fileName) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName); // Checks if the file is an image
  };

  const isVideo = (fileName) => {
    return /\.(mp4|mov|avi|mkv)$/i.test(fileName); // Checks if the file is a video
  };

  return (
    <div>
      <ChatNowHeader
        properitesChalets={properitesChalets}
        chalet_id={id}
        price={price}
      />

      <Container>
        <Carousel fade>
          {chaletsImages.map((image, index) => (
            <Carousel.Item key={index}>
              {isImage(image) ? (
                <img
                  alt="image"
                  className="slider_img rounded"
                  src={`${image}`}
                />
              ) : isVideo(image) ? (
                <video
                  controls
                  autoPlay
                  width="100%"
                  height="550px"
                  src={`${image}`}
                  type="video/mp4"
                ></video>
              ) : null}
              <div className="top_left custom-breadcrumbs">
                <BreadCrumbs page_to="/ Booking Chalet" />
              </div>
            </Carousel.Item>
          ))}
        </Carousel>

        <Row>
          <Col xl={8} md={12} sm={12}>
            <div className="box_overview_chalets mt-4">
              <h5> {lang === "ar" ? "الملخص " : "Overview"} </h5>
              <div className="d-flex flex-wrap justify-content-evenly">
                {properitesChalets.map((prop) => (
                  <div className="d-flex " key={prop.id}>
                    <img
                      src={`https://res.cloudinary.com/dqimsdiht/${prop.image}`}
                      className="rounded-circle mx-2"
                      height={"25px"}
                      width={"25px"}
                      alt="properites"
                    />{" "}
                    {prop.title}
                  </div>
                ))}
              </div>
              <h5 className="mt-3">
                {" "}
                {lang === "ar" ? "الوصف " : "Description"}{" "}
              </h5>
              {detailsChalets.map((details) => (
                <div className="d-flex mt-3" key={details.id}>
                  <img
                    src={check}
                    height={"25px"}
                    width={"25px"}
                    alt="people"
                  />
                  {details.Detail_Type}
                </div>
              ))}
              <div className=" mt-5 ">
                <h4>
                  {" "}
                  {lang === "ar" ? "السعر" : "Price :"}
                  {price} JD
                </h4>
              </div>
            </div>
          </Col>
          <Col xl={4} md={12} sm={12}>
            <div className="box_overview_chalets text-center my-4">
              <img src={whats} alt="whats" height={"100px"} width={"100px"} />
              <h6 className="my-3">
                {" "}
                {lang === "ar"
                  ? "يسعدنا التواصل معك "
                  : "We are pleased to contact you"}{" "}
              </h6>
              {contact.map((contactus) => (
                <Link
                  to={`${contactus.action}`}
                  target="blank"
                  key={contactus.id}
                >
                  <button className="booknow_button_events w-100 mb-3">
                    <b>{contactus.title}</b>{" "}
                  </button>
                </Link>
              ))}
              <Link to={userId ? `/${lang}/chatbot/${id}` : `/${lang}/login`}>
                <button className="booknow_button_events w-100 mb-3">
                  <b> {lang === "ar" ? "دردش الأن" : "Chat Now"}</b>{" "}
                </button>
              </Link>
            </div>
          </Col>
        </Row>
        <Row>
          <Col xl={8} md={12} sm={12}>
            <Link
              to={`/${lang}/reservechalet/${id}`}
              state={{ price: price}}
            >
              <button className="booknow_button_events w-100 my-5">
                {lang === "ar" ? "احجز الشاليه " : " Reserve Now"}{" "}
              </button>
            </Link>
          </Col>{" "}
        </Row>
        <h4 style={{ color: "#152C5B", marginTop: "10vh" }}>
          {lang === "ar" ? "خيارات مفضلة " : " Treasure to Choose"}{" "}
        </h4>
      </Container>
      <BestRated />
    </div>
  );
}

export default BookingChalets;
