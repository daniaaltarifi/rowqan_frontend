import { Container, Row, Col, Button } from "react-bootstrap";
import { useState, useCallback, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../App";
import ChatNowHeader from "../Component/ChatNowHeader";
import BestRated from "../Component/BestRated";
import { useUser } from "../Component/UserContext";
import Carousel from "react-bootstrap/Carousel";

function ChaletsDetails() {
  const location = useLocation();
  const { id } = useParams();
  const { userId } = useUser();
  const lang = location.pathname.split("/")[1] || "en";
  const price = localStorage.getItem('price') || 0;
  const [chaletsImages, setChaletsImages] = useState([]);
  const [dataChalets, setdataChalets] = useState([]);
  const isImage = (fileName) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName); // Checks if the file is an image
  };

  const isVideo = (fileName) => {
    return /\.(mp4|mov|avi|mkv)$/i.test(fileName); // Checks if the file is a video
  };

  const fetchData = useCallback(async () => {
    try {
      const [imgchaletRes, chaletsRes] = await Promise.all([
        axios.get(`${API_URL}/chaletsimages/chaletgetChaletImage/${id}`),
        axios.get(`${API_URL}/chalets/getchaletbyid/${id}`),
      ]);

      // Update images if different
      if (imgchaletRes.data !== chaletsImages) {
        setChaletsImages(imgchaletRes.data);
      }

      // Update chalet data if different
      if (chaletsRes.data !== dataChalets) {
        setdataChalets(chaletsRes.data);
      }
    } catch (error) {
      console.error("Error fetching chalet data:", error);
    }
  }, [id, lang, chaletsImages, dataChalets]);
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll only when necessary
    fetchData();
  }, [lang, id]); // This will run when `lang` or `id` changes

  return (
    <div>
      <ChatNowHeader
        dataChalets={dataChalets}
        chalet_id={id}
        price={price}
      />
      <Container className="mt-5">
        <h1>
          {" "}
          {lang === "ar" ? "تفاصيل هذا الشاليه" : "Details for this chalets"}
        </h1>
        <Row>
          <Col sm={12} md={12} lg={7}>
            <Carousel>
              {chaletsImages.map((image, index) => (
                <Carousel.Item key={index}>
                  {isImage(image) ? (
                    <img
                      alt="image"
                      className="slider_img rounded"
                      style={{ height: "65vh" }}
                      src={image}
                    />
                  ) : isVideo(image) ? (
                    <video
                      controls
                      width="100%"
                      height="455px"
                      src={image}
                      type="video/mp4"
                    ></video>
                  ) : null}
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>

          <Col sm={12} md={12} lg={5}>
            {dataChalets && (
              <div className="box_Brief_characteristics">
                <div>
                  <div className=" mt-3">
                    <ul>
                      {dataChalets.type &&
                        Object.entries(JSON.parse(dataChalets.type)).map(
                          ([key, value], index) => (
                            <li key={index} className="py-2">
                              <b>{key.replace(/_/g, " ")}:</b> {value}
                            </li>
                          )
                        )}
                    </ul>
                  </div>
                </div>
                <Link to={userId ? `/${lang}/chatbot/${id}` : `/${lang}/login`}>
                  <Button variant="outline-warning " className="mt-3">
                    {lang === "ar" ? "دردش الأن" : "Chat Now"}
                  </Button>
                </Link>
              </div>
            )}
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
            <>
              <h4>Features:</h4>
              <h6>
                <ul>
                  {dataChalets.features
                    ? dataChalets.features
                        .replace(/"/g, "") // Remove quotes around features
                        .split(",") // Split the string by commas
                        .map((feature, index) => (
                          <li key={index} style={{ fontSize: "18px" }}className="py-1">
                            {feature.trim()}
                          </li> // Trim spaces and display as list
                        ))
                    : null}
                </ul>
              </h6>
            </>
            <Link
              to={`/${lang}/bookingchalet/${id}`}
              state={{
                chaletsImages,
                dataChalets,
                 // properitesChalets,
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
