import { Row, Container, Col } from "react-bootstrap";
import BreadCrumbs from "../Component/BreadCrumbs";
import chal from "../assets/chal.png";
import Carousel from "react-bootstrap/Carousel";
import PropTypes from "prop-types";
import { FaRegBuilding } from "react-icons/fa";
import { TbMeterSquare } from "react-icons/tb";
import { CiLocationOn } from "react-icons/ci";
import check from "../assets/check.png";
import whats from "../assets/whats.png";
import TopPicks from "../Component/TopPicks";
import SelectTime from "../Component/SelectTime.jsx";
import { useState } from "react";
function BookingChalets() {
  const rating = 5;

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
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  return (
    <div>
      {/* <BreadCrumbs page_to={"Booking Chalet"}/>  */}
      <Container>
        <Carousel fade>
          <Carousel.Item>
            <img src={chal} alt="slider" className="slider_img rounded" />
            <div className="top_left custom-breadcrumbs">
              <BreadCrumbs page_to="/ Booking Chalet" />
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <img src={chal} alt="slider" className="slider_img" />
            <div className="top_left custom-breadcrumbs">
              <BreadCrumbs page_to="/ Booking Chalet" />
            </div>
          </Carousel.Item>
          <Carousel.Item>
            <img src={chal} alt="slider" className="slider_img" />
            <div className="top_left custom-breadcrumbs">
              <BreadCrumbs page_to="/ Booking Chalet" />
            </div>
          </Carousel.Item>
        </Carousel>
        <Row>
          <Col xl={6} md={12} sm={12}>
            <button className="booknow_button_events w-100 mt-5">
              Chalets and farms / distinctive chalets
            </button>
          </Col>{" "}
          <Col xl={6} md={12} sm={12}>
            <div className="d-flex justify-content-center mt-5">
              <h4>100 JOD </h4>
              <del style={{ color: "#bcbcbc" }} className="mx-2">
                150.00
              </del>
            </div>
            <div className="cont_rating">
              {[...Array(5)].map((_, index) => (
                <span
                  key={index}
                  style={{ display: "inline-block", marginRight: "5px" }}
                >
                  <StarIcon filled={rating > index} />
                </span>
              ))}
            </div>
          </Col>
        </Row>
        <Row>
          <Col xl={8} md={12} sm={12}>
            <div className="box_overview_chalets">
              <h5>Overview</h5>
              <div className="d-flex flex-wrap justify-content-evenly">
                <div className="d-flex ">
                  <FaRegBuilding className="mx-2" /> Flat
                </div>
                <div className="d-flex">
                  224m2 <TbMeterSquare className="mx-2" />
                </div>
                <div className="d-flex">
                  <CiLocationOn className="mx-2" /> Amman,Jordan{" "}
                </div>
              </div>
              <h5 className="mt-3">Description</h5>
              <h6 className="mt-3">Al Ghazal Farm and Chalet</h6>
              <div className="d-flex mt-3">
                <img src={check} height={"25px"} width={"25px"} alt="people" />
                outdoor bathroom
              </div>
              <div>
                <img src={check} height={"25px"} width={"25px"} alt="people" />
                outdoor bathroom
              </div>
            </div>
          </Col>
          <Col xl={4} md={12} sm={12}>
            <SelectTime isOpen={isOpen} toggleDropdown={toggleDropdown} />
            <div className="box_overview_chalets text-center">
              <img src={whats} alt="whats" height={"100px"} width={"100px"} />
              <h6 className="my-3">We are pleased to contact you </h6>
              <button className="booknow_button_events w-100 mb-3">
                <b>Contact us</b>{" "}
              </button>
              <button className="booknow_button_events w-100 mb-3">
                <b>WhatsApp</b>{" "}
              </button>
              <button className="booknow_button_events w-100 mb-3">
                <b>Email </b>{" "}
              </button>
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

export default BookingChalets;
