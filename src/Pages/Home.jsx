import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import Button from "react-bootstrap/Button";
import Dropdown from "react-bootstrap/Dropdown";

import "../Css/Home.css";
import calendar from "../assets/calendar.png";
import user from "../assets/user.png";
import locations from "../assets/location.png";
import TopPicks from "../Component/TopPicks";
import BestRated from "../Component/BestRated";
import { useCallback, useEffect, useState } from "react";
import { API_URL } from "../App";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
function Home() {
  const location = useLocation();
  const lang = location.pathname.split("/")[1] || "en";
  const [heroes, setHeroes] = useState([]);
  const [services, setServices] = useState([]);
  const getHero = useCallback(async () => {
    const [heroRes, servRes] = await Promise.all([
      axios.get(`${API_URL}/heroes/getAllHeroes/${lang}`),
      axios.get(`${API_URL}/services/getAllServices/${lang}`),
    ]);
    setHeroes(heroRes.data);
    setServices(servRes.data);
  }, [lang]);
  useEffect(() => {
    getHero();
  }, [lang]);

  return (
    <div className="home-container">
      <Container>
        <Row className="align-items-center justify-content-center">
          {heroes.map((hero) => (
            <>
              <Col md={6} key={hero.id}>
                <h1 className="maintext_home">{hero.title} </h1>
                <p className="text_home">{hero.description}</p>
                <Link to={`/${lang}/chalets`}><button className="Login-button">{hero.title_btn}</button></Link>
              </Col>
              <Col md={6}>
                <Image
                  src={`https://res.cloudinary.com/durjqlivi/${hero.image}`}
                  className="mainHome_img img-fluid"
                />
              </Col>
            </>
          ))}
        </Row>
        <section className=" margin_section">
          <div className="cont_search">
            <Col className="col_cont_search">
              <Button variant="light" className="filter_home">
                <img src={calendar} alt="calendar icon" />
                <span className="btn_text_filter">{lang === 'ar' ? 'هل متاح':'Check Available'}</span>
              </Button>
              <Dropdown>
                <Dropdown.Toggle variant="light" className="filter_home">
                  <img src={user} alt="user icon" />
                  <span className="btn_text_filter"> {lang === 'ar' ? 'الاشخاص':'Person'}</span>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">
                    Another action
                  </Dropdown.Item>
                  <Dropdown.Item href="#/action-3">
                    Something else
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <Button variant="light" className="filter_home">
                <img src={locations} alt="location icon" />
                <span className="btn_text_filter"> {lang === 'ar' ? 'الموقع':'Select Location'}</span>
              </Button>

              <button className="Login-button search_btn_home">{lang === 'ar' ? 'بحث':'Search'}</button>
            </Col>
          </div>
        </section>

        <section className="margin_section ">
          <Container>
            <Row>
              <Col xl={4}>
                <button className="service_home_overlay services_btn_home">
                  {lang === "ar" ? "الخدمات" : "Services"}
                </button>
              </Col>
            </Row>
          </Container>
          <Container className="text-center mt-5 ">
            <Row>
              {services.map((service) => (
                <>
                  <Col
                    xl={4}
                    md={6}
                    sm={12}
                    className="cont_img_home_serv"
                    key={service.id}
                  >
                <Link to={`/${lang}/${service.url}`}>
                    <img
                      src={`https://res.cloudinary.com/durjqlivi/${service.image}`}
                      alt="service"
                      height={"250px"}
                      width={"420px"}
                      className="img_services_home"
                    />

                    <div className="bottom-right">{service.title}</div>
                </Link>
                  </Col>

                </>
              ))}
            </Row>
          </Container>
        </section>
        <section className="margin_section">
          <Container>
            <Row>
              <Col xl={4}>
                <button className="service_home_overlay services_btn_home">
                  {lang === "ar" ? "أفضل تقييم" : "Best Rated"}
                </button>
              </Col>
            </Row>
          </Container>
          <BestRated />
        </section>
        <section className="margin_section">
          <Container>
            <Row>
              <Col xl={4}>
                <button className="service_home_overlay services_btn_home">
                  {lang === "ar" ? "الأكثر اختيارا" : " Most Picked "}
                </button>
              </Col>
            </Row>
          </Container>
          <TopPicks />
        </section>
      </Container>
    </div>
  );
}

export default Home;
