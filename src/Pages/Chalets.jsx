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
import FilterChalets from "../Component/FilterChalets";
import { cities } from "../Component/CityData";
import PropTypes from "prop-types";
function Chalets() {
  const { userId } = useUser();
  const lang = location.pathname.split("/")[1] || "en";
  const [statusChalets, setStatusChalets] = useState([]);
  const [statusId, setStatusId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [filterValues, setFilterValues] = useState({});
  const [availableAreas, setAvailableAreas] = useState([]);
  const [message, setMessage] = useState("");
  const [dataToDisplay, setDataToDisplay] = useState([]);
  const [allData, setAllData] = useState([]); // Original unfiltered data

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
  const fetchData = useCallback(async () => {
    try {
      const [statueRes, chaletRes] = await Promise.all([
        axios.get(`${API_URL}/status/getallstatuses/${lang}`),
        statusId
          ? axios.get(
              `${API_URL}/chalets/getallchaletsbystatus/${statusId}/${lang}`
            )
          : axios.get(`${API_URL}/chalets/getallchalets/${lang}`),
      ]);
      // Update state only if the data has changed
      if (statueRes.data.statuses !== statusChalets) {
        setStatusChalets(statueRes.data);
      }

      if (chaletRes.data !== dataToDisplay) {
        setDataToDisplay(chaletRes.data);
        setAllData(chaletRes.data);
      }
    } catch (error) {
      console.error("Error fetching chalets:", error);
    }
  }, [lang, statusId, statusChalets, dataToDisplay]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [lang, statusId]);

  const handleInputChange = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchQuery(query); // Update search query state

    if (query.trim() === "") {
      // If query is empty, reset to allData
      setDataToDisplay(allData);
    } else {
      // Filter chalets by title
      const filteredResults = allData.filter((chalet) =>
        chalet.title.toLowerCase().includes(query)
      );
      setDataToDisplay(filteredResults);
    }
  };
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setDataToDisplay(allData); // Reset to all data when query is cleared
    } else {
      const filteredResults = allData.filter((chalet) =>
        chalet.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setDataToDisplay(filteredResults);
    }
  }, [searchQuery, allData]); // Only re-run when searchQuery or allData changes

  const handleStatusChange = (status_id) => {
    setStatusId(status_id);
  };
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedAdditionalFeatures, setSelectedAdditionalFeatures] = useState(
    []
  );

  const fetchChaletData = useCallback(
    async (
      filters = {},
      city = null,
      area = null,
      key = null,
      value = null
    ) => {
      const queryKey = encodeURIComponent(key); // Encode the key
      const queryValue = encodeURIComponent(value);
      try {
        let response;

        const { features = [], additionalFeatures = [] } = filters;

        // Priority: If city or area is provided, call the `filterByAreaOrCity` API
        if (city || area) {
          response = await axios.post(
            `${API_URL}/chalets/filterByAreaOrCity/${lang}`,
            {
              city: city || null,
              area: area || null,
            }
          );
        }
        // If key and value are provided, call the `getAllChaletsByType` API
        else if (key && value) {
          response = await axios.get(
            `${API_URL}/chalets/getAllChaletsByType/${lang}?key=${queryKey}&value=${queryValue}`
          );
          console.log("Filter Value Sent to API:", key, value);
        }
        // If features or additional features are provided, call the `getchaletsbyfeature` API
        else if (features.length > 0 || additionalFeatures.length > 0) {
          const params = new URLSearchParams();
          if (features.length > 0) params.append("feature", features.join(","));
          if (additionalFeatures.length > 0)
            params.append("additionalFeatures", additionalFeatures.join(","));
          response = await axios.get(
            `${API_URL}/chalets/getchaletsbyfeature/${lang}?${params}`
          );
        }

        // Handle response
        if (response && response.data && response.data.length > 0) {
          setDataToDisplay(response.data); // Update the data to display
          setAllData(response.data);
          setMessage(""); // Clear any error messages
        } else {
          setDataToDisplay([]); // No data found
          setMessage(lang === "ar" ? "لا توجد شاليهات" : "No chalets found");
        }
      } catch (error) {
        console.error("Error fetching filtered data:", error);

        // Handle 404 errors gracefully
        if (error.response && error.response.status === 404) {
          setDataToDisplay([]); // Clear the data
          setMessage(lang === "ar" ? "لا توجد شاليهات" : "No chalets found");
        } else {
          setMessage(
            lang === "ar"
              ? "حدث خطأ ما"
              : "An error occurred while fetching chalets"
          );
        }
      }
    }
  );

  useEffect(() => {
    fetchChaletData({
      features: selectedFeatures,
      additionalFeatures: selectedAdditionalFeatures,
    });
  }, [selectedFeatures, selectedAdditionalFeatures]);
  // Handle city change
  const handleCityChange = (e) => {
    const cityId = e.target.value;
    setSelectedCity(cityId);

    const city = cities.find((city) => city.id === cityId);
    setAvailableAreas(city ? city.areas : []);
    setSelectedArea(""); // Reset area when the city changes

    fetchChaletData({}, cityId, null); // Fetch based on city
  };

  const handleAreaChange = (e) => {
    const areaId = e.target.value;
    setSelectedArea(areaId);

    fetchChaletData({}, selectedCity, areaId); // Fetch based on city and area
  };

  const handleFilterChange = useCallback(
    (key) => (e) => {
      const value = e.target.value.trim(); // Trim whitespace for consistent comparisons
      setFilterValues((prev) => ({ ...prev, [key]: value }));
      fetchChaletData({}, null, null, key, value); // Fetch data based on updated filter
    },
    [fetchChaletData]
  );
Chalets.propTypes={
  filled:PropTypes.string.isRequired,
}
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
          <Col lg={10} md={12} sm={12}>
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
                className="search_course mb-2"
                onChange={handleInputChange}
              />
            </div>
          </Col>
          {/* Filter Section */}
          <Col lg={2} md={12} sm={12}>
            <FilterChalets
              selectedCity={selectedCity}
              selectedArea={selectedArea}
              availableAreas={availableAreas}
              filterValues={filterValues}
              handleCityChange={handleCityChange}
              handleAreaChange={handleAreaChange}
              handleFilterChange={handleFilterChange}
              selectedAdditionalFeatures={selectedAdditionalFeatures}
              selectedFeatures={selectedFeatures}
              setSelectedAdditionalFeatures={setSelectedAdditionalFeatures}
              setSelectedFeatures={setSelectedFeatures}
            />
          </Col>
        </Row>

        <Row>
          {dataToDisplay.length > 0 ? (
            dataToDisplay.map((chal) => {
              const typeChalets = JSON.parse(
                chal.type.replace(/\\/g, "").replace(/^"|"$/g, "")
              );

              // Find the Evening time model
              const eveningTime = chal.RightTimeModels.find(
                (time) => time.type_of_time === "Evening"
              );
              const eveningPrice = eveningTime ? eveningTime.price : 0; // If no Evening time, fallback to default reserve price

              return (
                <Col xl={4} md={6} sm={12} key={chal.id}>
                  <Link
                    to={`/${lang}/chaletdetails/${chal.id}`}
                    onClick={() => {
                      try {
                        localStorage.setItem(
                          "intial_Amount",
                          chal.intial_Amount
                        );
                        localStorage.setItem("price", eveningPrice);
                      } catch (error) {
                        console.error("Error accessing localStorage", error);
                      }
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

                        <Row className="mt-4">
                          <div className="d-flex justify-content-evenly flex-wrap mb-3">
                            {Object.entries(typeChalets)
                              .filter(([key]) => key === "Number of Visitors") // Only keep the "Number_of_Visitors" key
                              .map(([key, value], index) => (
                                <Card.Text key={index} className="type_chalets">
                                  {key.replace(/_/g, " ")}: {value}
                                </Card.Text>
                              ))}
                          </div>
                          <div className="cont_rating">
                            {[...Array(5)].map((_, index) => (
                              <span
                                key={index}
                                style={{
                                  display: "inline-block",
                                  marginRight: "5px",
                                }}
                              >
                                <StarIcon filled={chal.Rating > index} />
                              </span>
                            ))}
                          </div>
                          <div className="d-flex justify-content-evenly mt-3">
                            <Card.Text className="text_card_det">
                              {lang === "ar"
                                ? "يبدأ السعر من "
                                : "Starting Price :"}{" "}
                              {eveningPrice} JD
                            </Card.Text>
                          </div>
                        </Row>

                        <div className="d-flex justify-content-evenly mt-3 mt-auto">
                          <button className="booknow_button_events">
                            {lang === "ar" ? "شاهد المزيد" : "View More"}
                          </button>

                          <Link
                            to={
                              userId
                                ? `/${lang}/chatbot/${chal.id}`
                                : `/${lang}/login`
                            }
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
            <p className="text-center">{message}</p> // Properly render the fallback message
          )}
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
