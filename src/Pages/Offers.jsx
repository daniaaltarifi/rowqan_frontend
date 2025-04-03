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
import "../Css/Events.css";
import { motion } from "framer-motion";
import { Globe2 } from "lucide-react";  
import { useNavigate, useLocation } from "react-router-dom";

function Offers() {
  const navigate = useNavigate();
  const location = useLocation();

  const { userId } = useUser();
  const lang = location.pathname.split("/")[1] || "en";
  const [chaletOffersData, setChaletOffersData] = useState([]);
  const [type_of_time, setType_of_time] = useState("Evening");
  const [message, setMessage] = useState("");

  const toggleLanguage = () => {
    const newLang = lang === "ar" ? "en" : "ar";
    const currentPath = location.pathname.split("/").slice(2).join("/");
    navigate(`/${newLang}${currentPath ? "/" + currentPath : "/offers"}`);
  };

  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${API_URL}/chalets/getChaletsByTypeOfTimeAndOffer/${type_of_time}?lang=${lang}`
      );

      if (response.data.success === true) {
        setChaletOffersData(response.data.data);
        setMessage("");
      } else {
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

  
  const fixArabicJSON = (jsonString) => {
    if (!jsonString) return "{}";
    
    
    let fixed = jsonString.replace(/،/g, ',');
     
    return fixed;
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-end mb-4"
      >
        <button
          onClick={toggleLanguage}
          className="btn btn-outline-secondary rounded-circle p-2"
          style={{
            border: "1px solid #ddd",
            background: "white",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}
        >
          <Globe2 className="w-6 h-6" />
          <span className="ms-2 visually-hidden">
            {lang === "ar" ? "English" : "العربية"}
          </span>
        </button>
      </motion.div>
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
            <option value="">
              {lang === "ar" ? "اختر وقت الحجز" : "Select type of time"}
            </option>
            <option value="Morning">{lang === "ar" ? "صباحاً" : "Morning"}</option>
            <option value="Evening">{lang === "ar" ? "مساءً" : "Evening"}</option>
            <option value="FullDay">{lang === "ar" ? "يوم كامل" : "Full Day"}</option>
          </Form.Select>
        </Row>
        <Row>
          {message ? (
            <div className="text-center">
              <h6>{message}</h6>
            </div>
          ) : chaletOffersData.length > 0 ? (
            chaletOffersData.map((chal) => {
              let typeChalets = {};
              try {
                
                const fixedJSON = fixArabicJSON(
                  chal.type.replace(/\\/g, "").replace(/^"|"$/g, "")
                );
                typeChalets = JSON.parse(fixedJSON);
              } catch (error) {
                console.error("Error parsing JSON:", error);
                console.log("Original string:", chal.type);
               
              }

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
                        <Card.Title className="title_chalets">
                          {chal.title}
                        </Card.Title>

                        <Row className="mt-5 ">
                          <div className="d-flex justify-content-evenly flex-wrap">
                            {Object.entries(typeChalets)
                              .slice(0, 4)
                              .map(([key, value], index) => (
                                <Card.Text key={index} className="type_chalets">
                                  {key.replace(/_/g, " ")}: {value}
                                  {index < Math.min(Object.keys(typeChalets).length, 4) - 1 ? "," : ""}
                                </Card.Text>
                              ))}
                              
                           
                            {Object.keys(typeChalets).length === 0 && (
                              <Card.Text className="type_chalets">
                                {lang === "ar" ? "تفاصيل الشاليه غير متوفرة" : "Chalet details not available"}
                              </Card.Text>
                            )}
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
                            to={userId ? `/${lang}/chatbot/${chal.id}` : `/${lang}/login`}
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
            <h6 className="text-center">
              {lang === "ar" ? "لا يوجد عروض متاحة" : "No offers available"}
            </h6>
          )}
        </Row>
      </Container>
    </>
  );
}

export default Offers;