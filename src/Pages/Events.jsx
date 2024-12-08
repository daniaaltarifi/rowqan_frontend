import Carousel from "react-bootstrap/Carousel";
import "../Css/Events.css";
import BreadCrumbs from "../Component/BreadCrumbs";
import { Container, Row, Col } from "react-bootstrap";
import { MdDateRange } from "react-icons/md";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../App";

function Events() {
  const lang = location.pathname.split("/")[1] || "en";

  const [sliderRes, setSliderRes] = useState([]);
  const [categoryEvents, setCategoryEvents] = useState([]);
  const [eventsRes, setEventsRes] = useState([]);
  const [categoryId, setCategoryId] = useState(null);

  // Fetch data from API
  const fetchData = useCallback(async () => {
    try {
      const [sliderRes, categoryEvents, eventsRes] = await Promise.all([
        axios.get(`${API_URL}/heroevents/allheroevents/${lang}`),
        axios.get(`${API_URL}/events/getalleventtypes`),
        categoryId
        ? axios.get(`${API_URL}/subevents/getsubeventsbyid/${categoryId}/${lang}`)
        : axios.get(`${API_URL}/subevents/getallsubevents/${lang}`),      ]);
      setSliderRes(sliderRes.data);
      setCategoryEvents(categoryEvents.data);
      setEventsRes(eventsRes.data);
    } catch (error) {
      console.error("Error fetching best rated services:", error);
    }
  }, [lang,categoryId]);

  useEffect(() => {
    fetchData();
  }, [lang,categoryId]);

  return (
    <div>
      {/* Carousel */}
      <Carousel fade>
        {sliderRes.map((slide) => (
          <Carousel.Item key={slide.id}>
            <img
              src={`https://res.cloudinary.com/durjqlivi/${slide.image}`}
              alt="slider"
              className="slider_img"
            />
            <div className="top_left custom-breadcrumbs">
              <BreadCrumbs
                page_to={lang === "ar" ? "/ صفحة الفعاليات" : "/ Events Page"}
              />
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Explore By Category Section */}
      <Container className="margin_section">
        <h4 className="title_events">
          {lang === "ar" ? "استكشف حسب الفئة" : "Explore By Category"}
        </h4>
        <Row>
          {categoryEvents.map((cate) => (
            <Col xl={3} md={6} sm={12} className="mb-3" key={cate.id}>
              <button
                className="category_events"
                onClick={() => setCategoryId(cate.id)}
              >
                {cate.event_type}
              </button>
            </Col>
          ))}
        </Row>

        {/* Event Listings */}
        <Row className="mt-5">
        {eventsRes.length > 0 ? (
            eventsRes.map((event) => (
              <Col
                xl={6}
                md={6}
                sm={12}
                className="cont_img_home_serv"
                key={event.id}
              >
                <Link to={`/${lang}/eventscategory/${event.id}`}>
                  <img
                    src={`https://res.cloudinary.com/durjqlivi/${event.image}`}
                    alt="service img"
                    className="img_services_home img_events"
                  />
                  <div className="events_date_bottom_right">
                    <div className="d-flex">
                      <MdDateRange className="mb-2" />
                      <h6 className="mx-2">{event.date}</h6>
                    </div>
                    <h6>{event.title}</h6>
                  </div>
                </Link>
              </Col>
            ))
          ) : (
            // <div>No events found for this category</div>
            <div></div>

          )}
        </Row>
      </Container>
    </div>
  );
}

export default Events;
