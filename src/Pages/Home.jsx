import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import "../Css/Home.css";
// import TopPicks from "../Component/TopPicks";
// import BestRated from "../Component/BestRated";
import React, { useCallback, useEffect, useState } from "react";
import { API_URL } from "../App";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const lang = location.pathname.split("/")[1] || "en";
  const [heroes, setHeroes] = useState([]);
  const [services, setServices] = useState([]);
  const [chaletOffersData, setChaletOffersData] = useState([]);

  const getHero = useCallback(async () => {
    const [heroRes, servRes, offersRes] = await Promise.all([
      axios.get(`${API_URL}/heroes/getAllHeroes/${lang}`),
      // axios.get(`https://kassel.icu/rowqan/wp-json/wp/v2/hero?acf_format=standard&_fields=id,title.rendered,acf.title,acf.description,acf.image,acf.title_btn&lang=${lang}`),
      axios.get(`${API_URL}/chalets/getallchalets/${lang}`),
      axios.get(
        `${API_URL}/chalets/getChaletsByTypeOfTimeAndOffer/Morning/${lang}`
      ),
    ]);
    setHeroes(heroRes.data);
    const chalets = servRes.data.slice(-4);
    setServices(chalets);
    if (offersRes.data.success === true) {
      const offers = offersRes.data.data.slice(-4);
      setChaletOffersData(offers);
    }
  }, [lang]);
  useEffect(() => {
    window.scrollTo(0, 0);
    getHero();
  }, [lang]);

  return (
    <div className="home-container">
      <Container>
        <Row className="align-items-center justify-content-center hero_cont">
          {heroes.map((hero) => (
            <React.Fragment key={hero.id}>
              <Col lg={6} md={6}>
                <h1 className="maintext_home">{hero.title} </h1>
                <p className="text_home">{hero.description}</p>
                <Link to={`/${lang}/chalets`}>
                  <button className="Login-button">{hero.title_btn}</button>
                </Link>
              </Col>
              <Col lg={6} md={6}>
                <Image
                  src={`https://res.cloudinary.com/dqimsdiht/image/upload/f_auto,q_auto,w_800/${hero.image}`}
                  srcSet={`
    https://res.cloudinary.com/dqimsdiht/image/upload/f_auto,q_auto,w_400/${hero.image} 400w,
    https://res.cloudinary.com/dqimsdiht/image/upload/f_auto,q_auto,w_800/${hero.image} 800w
  `}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt="home img"
                  className="mainHome_img"
                  loading="eager"
                />
              </Col>
            </React.Fragment>
          ))}
        </Row>
        <section className="margin_section cont_chalets_home">
          <Container>
            <Row>
              <Col xl={4}>
                <button
                  className="service_home_overlay services_btn_home"
                  onClick={() => navigate(`/${lang}/chalets`)}
                >
                  {lang === "ar" ? "الشاليهات" : "Chalets"}
                </button>
              </Col>
            </Row>
          </Container>
          <Container className="text-center mt-5">
            <Row>
              {services.map((service) => (
                <Col
                  xl={3}
                  md={6}
                  sm={12}
                  className="cont_img_home_serv"
                  key={service.id}
                >
                  <Link to={`/${lang}/chaletdetails/${service.id}`}>
                    <img
                      // src={service.image}
                      src={service.image} // Default image
                      srcSet={`${service.image}?w=400&f_auto&q_auto:eco 400w,
                    ${service.image}?w=800&f_auto&q_auto:eco 800w,
                    ${service.image}?w=1200&f_auto&q_auto:eco 1200w`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      alt="service"
                      height={"250px"}
                      width={"420px"}
                      className="img_services_home"
                    />

                    <div className="bottom-right">{service.title}</div>
                  </Link>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
        {/* <section className="margin_section">
          <Container>
            <Row>
              <Col xl={4}>
                <button
                  className="service_home_overlay services_btn_home"
                  onClick={() => navigate(`/${lang}/chalets`)}
                >
                  {lang === "ar" ? "أفضل تقييم" : "Best Rated"}
                </button>
              </Col>
            </Row>
          </Container>
          <BestRated />
        </section> */}
        <section className="margin_section">
          <Container >
            <Row>
              <Col xl={4}>
                <button
                  className="service_home_overlay services_btn_home"
                  onClick={() => navigate(`/${lang}/offers`)}
                >
                  {lang === "ar" ? "العروض" : "Offers"}
                </button>
              </Col>
            </Row>
          </Container>
          <Container className="text-center mt-5 ">
            <Row>
              {chaletOffersData.map((service) => (
                <Col
                  xl={3}
                  md={6}
                  sm={12}
                  className="cont_img_home_serv"
                  key={service.id}
                >
                  <Link to={`/${lang}/chaletdetails/${service.id}`}>
                    <img
                      src={service.image} // Default image
                      srcSet={`${service.image}?w=400&f_auto&q_auto:eco 400w,
                      ${service.image}?w=800&f_auto&q_auto:eco 800w,
                      ${service.image}?w=1200&f_auto&q_auto:eco 1200w`}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      alt="service"
                      height={"250px"}
                      width={"420px"}
                      className="img_services_home"
                    />

                    <div className="bottom-right">{service.title}</div>
                  </Link>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      </Container>
    </div>
  );
}

export default Home;
