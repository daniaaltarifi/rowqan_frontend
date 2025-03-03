import { Container, Card, Row, Col } from "react-bootstrap";
import "../Css/chalets.css";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { API_URL } from "../App";
import axios from "axios";
import chalets from "../assets/outdoor-swimming-pool.jpeg";
import chat from "../assets/chat.png";
import { useUser } from "../Component/UserContext";
import Form from "react-bootstrap/Form";
// import BestRated from "../Component/BestRated";
import '../Css/Events.css'
function Offers() {
  const { userId } = useUser();
  const lang = location.pathname.split("/")[1] || "en";
  const [chaletOffersData, setChaletOffersData] = useState([]);
  const [type_of_time, setType_of_time] = useState("Evening");
  const [message, setMessage] = useState("");


const fetchData = useCallback(async () => {
  try {
    const response = await axios.get(
      `${API_URL}/chalets/getChaletsByTypeOfTimeAndOffer/${type_of_time}/${lang}`
    );

    if (response.data.success === true) {
      setChaletOffersData(response.data.data);
      setMessage(""); 
    } 
    else{
      setMessage(response.data.message);
    }
  } catch (error) {
    console.error("Error fetching chalets:", error);
    setMessage(error.response?.data?.message || "Failed to fetch data.");
  }
}, [type_of_time, lang]);


  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <>
      <div className="container_big_img">
        <img
          src={chalets}
          loading="lazy"
          alt="chalet"
          className="chalet_big_img"
        />
        <div className="centered_big_img_chalets">
          <h1> {lang === "ar" ? "عروض الشاليهات " : "Offers Of Chalets"}</h1>
        </div>
      </div>
      <Container className="margin_section cont_chalets_home mt-4">
        <Row className="mb-4 ">
          <Form.Select
            aria-label="Default select example"
            value={type_of_time ?? ""}
            onChange={(e) => setType_of_time(e.target.value)}
          >
            <option value="">Select type of time</option>
            <option value="Morning">Morning</option>
            <option value="Evening">Evening</option>
            <option value="FullDay">Full Day</option>
          </Form.Select>
        </Row>
        <Row>
  {message ? (
    <div className="text-center">
      <h6 >{message}</h6>
    </div>
  ) : chaletOffersData.length > 0 ? (
    chaletOffersData.map((chal) => {
      const typeChalets = JSON.parse(
        chal.type.replace(/\\/g, "").replace(/^"|"$/g, "")
      );

      return (
        <Col xl={4} md={6} sm={12} key={chal.id}>
          <Link
            to={`/${lang}/chaletdetails/${chal.id}`}
            onClick={() => {
              localStorage.setItem("intial_Amount", chal.intial_Amount);
              localStorage.setItem("price", chal.after_offer);
            }}
            style={{ textDecoration: "none" }}
          >
            <Card className="cont_card_chalets">
              <Card.Img
                variant="top"
                height={"200px"}
                className="object-fit-cover"
                srcSet={chal.image}
                sizes="(max-width: 768px) 100vw, 50vw"
                alt="chal img"
                decoding="async"
                loading="lazy"
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title className="title_chalets">{chal.title}</Card.Title>

                <Row className="mt-5 ">
                  <div className="d-flex justify-content-evenly flex-wrap">
                    {Object.entries(typeChalets)
                      .slice(0, 4)
                      .map(([key, value], index) => (
                        <Card.Text key={index} className="type_chalets">
                          {key.replace(/_/g, " ")}: {value},
                        </Card.Text>
                      ))}
                  </div>
                  <div className="d-flex justify-content-evenly mt-5">
                    <Card.Text className="text_card_det">
                      {lang === "ar"
                        ? "يبدأ السعر من "
                        : "Starting Price :"}{" "}
                      {chal.after_offer} JD
                    </Card.Text>
                  </div>
                </Row>

                <div className="d-flex justify-content-evenly mt-3 mt-auto">
                  <button className="booknow_button_events">
                    {lang === "ar" ? "شاهد المزيد" : "View More"}
                  </button>

                  <Link
                    to={userId ? `/${lang}/chatbot` : `/${lang}/login`}
                    className="chat_now_link"
                  >
                    <h6>
                      <img
                        src={chat}
                        height={"40px"}
                        width={"40px"}
                        alt="chat"
                      />
                      {lang === "ar" ? "دردش الأن" : "Chat Now"}
                    </h6>
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      );
    })
  ) : (
    <h6 className="text-center">No offers available</h6>
  )}
</Row>

{/* 
        <h4 style={{ color: "#152C5B", marginTop: "10vh" }}>
          Treasure to Choose
        </h4> */}
      </Container>
      {/* <BestRated /> */}
    </>
  );
}

export default Offers;
