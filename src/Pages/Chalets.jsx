import { Container, Card, Row, Col } from "react-bootstrap";
import "../Css/chalets.css";
import { Link } from "react-router-dom";
import TopPicks from "../Component/TopPicks";
import { useCallback, useEffect, useState } from "react";
import { API_URL } from "../App";
import axios from "axios";
import chalets from "../assets/chale.jpg";
import chat from "../assets/chat.png";
import { useUser } from "../Component/UserContext";
import Form from "react-bootstrap/Form";

function Chalets() {
  const { userId } = useUser();
  const lang = location.pathname.split("/")[1] || "en";
  const [chaletsData, setChaletsData] = useState([]);
  const [statusChalets, setStatusChalets] = useState([]);
  const [statusId, setStatusId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [governorate, setGovernorate] = useState([]);
  const [locationValue, setLocationValue] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [statueRes, chaletRes, governorateRes] = await Promise.all([
        axios.get(`${API_URL}/status/getallstatuses/${lang}`),
        
        // Conditional chalet API request
        locationValue 
          ? axios.get(`${API_URL}/BreifDetailsChalets/getChaletsByLocation/${locationValue}/${lang}`)
          : statusId 
            ? axios.get(`${API_URL}/chalets/getallchaletsbystatus/${statusId}/${lang}`)
            : axios.get(`${API_URL}/chalets/getAllChaletProps/${lang}`),
        // Static request for governorateRes
        axios.get(`${API_URL}/BreifDetailsChalets/getChaletsByvalue/${lang}`),
      ]);
      
      // Update state only if the data has changed
      if (statueRes.data.statuses !== statusChalets) {
        setStatusChalets(statueRes.data);
      }
      
      if (chaletRes.data !== chaletsData) {
        setChaletsData(chaletRes.data);
   
      }
      
      if (governorateRes.data !== governorate) {
        setGovernorate(governorateRes.data);
      }
   
      console.log("chalets data", chaletRes.data)
      
    } catch (error) {
      console.error("Error fetching chalets:", error);
    }
  }, [lang,locationValue, statusId, statusChalets, chaletsData, governorate]);
  
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [lang, statusId,locationValue]);
  const dataToDisplay = searchQuery ? searchResults : chaletsData;

  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    // Filter the courses based on the search query
    const filteredResults = chaletsData.filter((chalet) =>
      chalet.title.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(filteredResults);
  };

const handleStatusChange = (status_id) => {
  setStatusId(status_id);
  setLocationValue("");  // Reset location filter when status changes
};
  const handleLocationChange = (event) => {
    setLocationValue(event.target.value);
    setStatusId("")
    };
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
          <h1> {lang === "ar" ? "انواع الشاليهات" : "Types Of Chalets"}</h1>
          {statusChalets.map((statuses) => (
            <button
              key={statuses.id}
              className="chalets_btn"
              onClick={() => handleStatusChange(statuses.id)}
            >
              {statuses.status}
            </button>
          ))}
        </div>
      </div>
      <Container className="margin_section">
        <Row className="mb-3">
          <Col lg={4} md={6} sm={12}>
            <div className="navbar__search">
              <span>
                <i
                  className="fa-solid fa-magnifying-glass fa-sm"
                  style={{ color: "#833988" }}
                ></i>{" "}
              </span>
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                className="search_course"
                onChange={handleInputChange}
              />
            </div>
          </Col>
          <Col lg={4} md={6} sm={12}>
            <Form.Select aria-label="Default select example" onChange={handleLocationChange}>
              <option> Select Location</option>
              {governorate.map((location,index)=>(
                <option key={index} value={location.value}>{location.value}</option>
              ))}
             
            </Form.Select>
          </Col>
        </Row>
        <Row>
          {dataToDisplay.map((chal) => (
            <Col xl={4} md={6} sm={12} key={chal.id}>
              <Link
                to={`/${lang}/chaletdetails/${chal.id}`}
                state={{ price: chal.reserve_price }}
                onClick={() =>
                  localStorage.setItem("intial_Amount", chal.intial_Amount)
                }
                style={{ textDecoration: "none" }}
              >
                <Card className="cont_card_chalets">
                  <Card.Img
                    variant="top"
                    height={"200px"}
                    className="object-fit-cover"
                    srcSet={`https://res.cloudinary.com/dqimsdiht/${chal.image}?w=400&f_auto&q_auto:eco 400w`}
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
                      {chal.Chalets_Props && chal.Chalets_Props.length > 0 ? (
                        chal.Chalets_Props.slice(-4).map((prop, index) => (
                          <Col
                            xs={6}
                            sm={6}
                            md={6}
                            lg={6}
                            key={index}
                            className="mb-2"
                          >
                            <div className="d-flex justify-content-center">
                              <img
                                srcSet={`https://res.cloudinary.com/dqimsdiht/${prop.image}?w=400&f_auto&q_auto:eco 400w`}
                                height={"30px"}
                                width={"30px"}
                                alt="location"
                              />
                              <Card.Text className="column-title">
                                {prop.title}
                              </Card.Text>
                            </div>
                          </Col>
                        ))
                      ) : (
                        <Col xs={6} sm={6} md={6} lg={6}>
                          <div className="d-flex justify-content-evenly">
                            <Card.Text>
                              {lang === "ar"
                                ? "لا توجد خصائص"
                                : "No Properties"}
                            </Card.Text>
                          </div>
                        </Col>
                      )}
                      <div className="d-flex justify-content-evenly mt-5">
                        <Card.Text className="text_card_det ">
                          {lang === "ar"
                            ? "يبدأ السعر من "
                            : "Starting Price :"}{" "}
                          {chal.reserve_price} JD
                        </Card.Text>
                      </div>
                    </Row>

                    {/* This div will now appear at the bottom of the Card */}
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
          ))}
        </Row>

        <h4 style={{ color: "#152C5B", marginTop: "10vh" }}>
          Treasure to Choose
        </h4>
      </Container>
      <TopPicks />
    </>
  );
}

export default Chalets;
