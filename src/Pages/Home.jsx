import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Image from "react-bootstrap/Image";
import "../Css/Home.css";
import React, { useCallback, useEffect, useState, useRef } from "react";
import { API_URL } from "../App";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe2 } from "lucide-react";



function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [heroes, setHeroes] = useState([]);
  const [services, setServices] = useState([]);
  const [chaletOffersData, setChaletOffersData] = useState([]);
  const [lang, setLang] = useState(location.pathname.split("/")[1] || "en");
  const [isServicesVisible, setIsServicesVisible] = useState(false);
  const [isOffersVisible, setIsOffersVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  
 

  const toggleLanguage = () => {
    const newLang = lang === "ar" ? "en" : "ar";
    
    navigate(`/${newLang}`);
    
    setLang(newLang);
  };


  

  // Refs for intersection observer
  const heroRef = useRef(null);
  const servicesRef = useRef(null);
  const offersRef = useRef(null);

  const getHero = useCallback(async () => {
    const [heroRes, servRes, offersRes] = await Promise.all([
      axios.get(`${API_URL}/heroes/getAllHeroes?lang=${lang}`),
      axios.get(`${API_URL}/chalets/getallchalets?lang=${lang}`),
      axios.get(
        `${API_URL}/chalets/getChaletsByTypeOfTimeAndOffer/Morning?lang=${lang}`
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
  }, [getHero, lang]);

  // Set up intersection observers with more advanced triggers
  useEffect(() => {
    // Auto-trigger hero animation on page load
    setTimeout(() => {
      setHasAnimated(true);
    }, 300);

    const setupObserver = (ref, setVisibleFunc, options = {}) => {
      const defaultOptions = { 
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px' 
      };
      
      const mergedOptions = { ...defaultOptions, ...options };
      
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleFunc(true);
            observer.disconnect();
          }
        },
        mergedOptions
      );
      
      if (ref.current) {
        observer.observe(ref.current);
      }
      
      return observer;
    };

    const servicesObserver = setupObserver(
      servicesRef, 
      setIsServicesVisible
    );

    const offersObserver = setupObserver(
      offersRef, 
      setIsOffersVisible
    );

    return () => {
      servicesObserver.disconnect();
      offersObserver.disconnect();
    };
  }, [services, chaletOffersData]);

  // const toggleLanguage = () => {
  //   const newLang = lang === "ar" ? "en" : "ar";
  //   setLang(newLang);
  //   const newPath = location.pathname.split("/").slice(2).join("/");
  //   navigate(`/${newLang}/${newPath}`);
  // };

  return (
    <div className="home-container">
      
      <Container>
      <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-end mb-4"
        >
          <button
            onClick={toggleLanguage}
            className="btn btn-outline-secondary rounded-circle p-2"
            style={{
              border: '1px solid #ddd',
              background: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <Globe2 className="w-6 h-6" />
            <span className="ms-2 visually-hidden">
              {lang === "ar" ? "English" : "العربية"}
            </span>
          </button>
        </motion.div>
        <Row className="justify-content-end py-3">
          {/* <Col xs="auto">
            <button
              onClick={toggleLanguage}
              className="btn btn-light rounded-circle p-2 language-btn"
              aria-label="Toggle language"
            >
              <Globe2 className="w-6 h-6" />
              <span className="ms-2">{lang === "ar" ? "English" : "عربي"}</span>
            </button>
          </Col> */}
        </Row>
        <Row className="align-items-center justify-content-center hero_cont" ref={heroRef}>
          {heroes.map((hero) => (
            <React.Fragment key={hero.id}>
              <Col lg={6} md={6} className={`hero-text-content ${hasAnimated ? 'animate-fade-up' : ''}`}>
                <h1 className="maintext_home animate-text-reveal">{hero.title}</h1>
                <p className={`text_home ${hasAnimated ? 'animate-fade-in-delay-1' : ''}`}>{hero.description}</p>
                <Link to={`/${lang}/chalets`}>
                  <button className={`Login-button ${hasAnimated ? 'animate-bounce-in-delay-2' : ''}`}>{hero.title_btn}</button>
                </Link>
              </Col>
              <Col lg={6} md={6} className={`hero-image-content ${hasAnimated ? 'animate-slide-in-right' : ''}`}>
                <Image
                  src={`https://res.cloudinary.com/dqimsdiht/image/upload/f_auto,q_auto,w_800/${hero.image}`}
                  srcSet={`
                    https://res.cloudinary.com/dqimsdiht/image/upload/f_auto,q_auto,w_400/${hero.image} 400w,
                    https://res.cloudinary.com/dqimsdiht/image/upload/f_auto,q_auto,w_800/${hero.image} 800w
                  `}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  alt="home img"
                  className="mainHome_img floating-shadow"
                  loading="eager"
                />
              </Col>
            </React.Fragment>
          ))}
        </Row>
        <section className="margin_section cont_chalets_home" ref={servicesRef}>
          <Container>
            <Row>
              <Col xl={4}>
                <button
                  className={`service_home_overlay services_btn_home ${isServicesVisible ? 'animate-scale-rotate-in' : ''}`}
                  onClick={() => navigate(`/${lang}/chalets`)}
                >
                  {lang === "ar" ? "الشاليهات" : "Chalets"}
                </button>
              </Col>
            </Row>
          </Container>
          <Container className="text-center mt-5">
            <Row>
              {services.map((service, index) => (
                <Col
                  xl={3}
                  md={6}
                  sm={12}
                  className={`cont_img_home_serv ${isServicesVisible ? 'animate-item-appear' : ''}`}
                  key={service.id}
                  style={{ 
                    animationDelay: `${index * 0.15}s`,
                    opacity: isServicesVisible ? 1 : 0
                  }}
                >
                  <Link to={`/${lang}/chaletdetails/${service.id}`} className="img-hover-effect-wrapper">
                    <div className="img-hover-effect-container">
                      <img
                        src={service.image}
                        srcSet={`${service.image}?w=400&f_auto&q_auto:eco 400w,
                          ${service.image}?w=800&f_auto&q_auto:eco 800w,
                          ${service.image}?w=1200&f_auto&q_auto:eco 1200w`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        alt="service"
                        height={"250px"}
                        width={"420px"}
                        className="img_services_home"
                      />
                      <div className="img-overlay"></div>
                    </div>
                    <div className="bottom-right shine-text">{service.title}</div>
                  </Link>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
        <section className="margin_section" ref={offersRef}>
          <Container>
            <Row>
              <Col xl={4}>
                <button
                  className={`service_home_overlay services_btn_home ${isOffersVisible ? 'animate-scale-rotate-in' : ''}`}
                  onClick={() => navigate(`/${lang}/offers`)}
                >
                  {lang === "ar" ? "العروض" : "Offers"}
                </button>
              </Col>
            </Row>
          </Container>
          <Container className="text-center mt-5">
            <Row className="staggered-row">
              {chaletOffersData.map((service, index) => (
                <Col
                  xl={3}
                  md={6}
                  sm={12}
                  className={`cont_img_home_serv ${isOffersVisible ? 'animate-item-appear-alternate' : ''}`}
                  key={service.id}
                  style={{ 
                    animationDelay: `${index * 0.15}s`,
                    opacity: isOffersVisible ? 1 : 0
                  }}
                >
                  <Link to={`/${lang}/chaletdetails/${service.id}`} className="img-hover-effect-wrapper">
                    <div className="img-hover-effect-container">
                      <img
                        src={service.image}
                        srcSet={`${service.image}?w=400&f_auto&q_auto:eco 400w,
                          ${service.image}?w=800&f_auto&q_auto:eco 800w,
                          ${service.image}?w=1200&f_auto&q_auto:eco 1200w`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        alt="service"
                        height={"250px"}
                        width={"420px"}
                        className="img_services_home"
                      />
                      <div className="img-overlay"></div>
                    </div>
                    <div className="bottom-right shine-text">{service.title}</div>
                  </Link>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      </Container>

    
      <style>
        {`
          /* Advanced Animation Keyframes */
          @keyframes fadeIn {
            0% { opacity: 0; }
            100% { opacity: 1; }
          }
          
          @keyframes fadeUp {
            0% { 
              opacity: 0;
              transform: translateY(30px);
            }
            100% { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideInRight {
            0% { 
              opacity: 0;
              transform: translateX(100px) scale(0.9) rotate(2deg);
            }
            20% {
              opacity: 0.3;
              transform: translateX(60px) scale(0.95) rotate(1deg);
            }
            60% {
              opacity: 0.8;
              transform: translateX(10px) scale(1.02) rotate(-1deg);
            }
            80% {
              transform: translateX(0) scale(1.01) rotate(0.5deg);
            }
            100% { 
              opacity: 1;
              transform: translateX(0) scale(1) rotate(0);
            }
          }
          
          @keyframes scaleRotateIn {
            0% {
              opacity: 0;
              transform: scale(0.4) rotate(-10deg);
            }
            50% {
              opacity: 0.7;
              transform: scale(1.1) rotate(5deg);
            }
            100% {
              opacity: 1;
              transform: scale(1) rotate(0);
            }
          }
          
          @keyframes appearFromBottom {
            0% {
              opacity: 0;
              transform: translateY(60px) scale(0.9);
            }
            50% {
              opacity: 0.5;
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
          
          @keyframes appearFromSide {
            0% {
              opacity: 0;
              transform: translateX(40px) translateY(20px) scale(0.9);
            }
            70% {
              opacity: 0.8;
              transform: translateX(-5px) translateY(0) scale(1.02);
            }
            100% {
              opacity: 1;
              transform: translateX(0) translateY(0) scale(1);
            }
          }
          
          @keyframes bounceIn {
            0% {
              opacity: 0;
              transform: scale(0.3);
            }
            40% {
              opacity: 0.7;
              transform: scale(1.1);
            }
            60% {
              transform: scale(0.9);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
          
          @keyframes floatShadow {
            0% {
              transform: translateY(0) rotate(0deg);
              box-shadow: 16px 16px 4px 0px rgba(109, 166, 186, 0.9);
            }
            25% {
              transform: translateY(-15px) rotate(1deg);
              box-shadow: 16px 26px 12px 0px rgba(109, 166, 186, 0.7);
            }
            50% {
              transform: translateY(-20px) rotate(-1deg);
              box-shadow: 16px 30px 15px 0px rgba(109, 166, 186, 0.6);
            }
            75% {
              transform: translateY(-10px) rotate(1deg);
              box-shadow: 16px 22px 10px 0px rgba(109, 166, 186, 0.8);
            }
            100% {
              transform: translateY(0) rotate(0deg);
              box-shadow: 16px 16px 4px 0px rgba(109, 166, 186, 0.9);
            }
          }
          
          @keyframes pulse {
            0% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.03);
            }
            100% {
              transform: scale(1);
            }
          }
          
          @keyframes glow {
            0% {
              filter: drop-shadow(0 0 2px rgba(109, 166, 186, 0.3));
            }
            50% {
              filter: drop-shadow(0 0 15px rgba(109, 166, 186, 0.6));
            }
            100% {
              filter: drop-shadow(0 0 2px rgba(109, 166, 186, 0.3));
            }
          }
          
          @keyframes textReveal {
            0% {
              clip-path: polygon(0 0, 0 0, 0 100%, 0 100%);
              opacity: 0;
            }
            100% {
              clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
              opacity: 1;
            }
          }
          
          @keyframes shine {
            0% {
              background-position: -100% 0;
            }
            100% {
              background-position: 200% 0;
            }
          }
          
          @keyframes gradientBackground {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          
          /* Enhanced Animation Classes */
          .animate-fade-up {
            animation: fadeUp 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }
          
          .animate-fade-in {
            animation: fadeIn 1.5s ease-out forwards;
          }
          
          .animate-fade-in-delay-1 {
            opacity: 0;
            animation: fadeIn 1.2s ease-out 0.3s forwards;
          }
          
          .animate-slide-in-right {
            animation: slideInRight 1.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
          }
          
          .animate-bounce-in-delay-2 {
            opacity: 0;
            animation: bounceIn 1s cubic-bezier(0.215, 0.61, 0.355, 1) 0.6s forwards;
          }
          
          .animate-scale-rotate-in {
            animation: scaleRotateIn 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          }
          
          .animate-item-appear {
            animation: appearFromBottom 0.9s cubic-bezier(0.23, 1, 0.32, 1) forwards;
          }
          
          .animate-item-appear-alternate {
            animation: appearFromSide 0.9s cubic-bezier(0.23, 1, 0.32, 1) forwards;
          }
          
          .animate-text-reveal {
            opacity: 0;
            animation: textReveal 1.5s cubic-bezier(0.77, 0, 0.175, 1) 0.2s forwards;
          }
          
          /* Enhanced Styling */
          .floating-shadow {
            animation: 
              floatShadow 6s ease-in-out infinite,
              pulse 8s ease-in-out infinite,
              glow 7s ease-in-out infinite;
            will-change: transform, box-shadow, filter;
          }
          
          .hero-image-content:hover .floating-shadow {
            animation-play-state: paused;
            transform: scale(1.05) translateY(-10px);
            transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            box-shadow: 20px 30px 20px 0px rgba(109, 166, 186, 0.75);
          }
          
          .shine-text {
            background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%);
            background-size: 200% auto;
            -webkit-background-clip: text;
            background-clip: text;
            animation: shine 3s linear infinite;
            text-shadow: 0 2px 4px rgba(0,0,0,0.5);
            font-weight: 500;
          }
          
          .img-hover-effect-wrapper {
            display: block;
            position: relative;
            overflow: hidden;
            border-radius: 15px;
            transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }
          
          .img-hover-effect-container {
            position: relative;
            overflow: hidden;
            border-radius: 15px;
          }
          
          .img-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, rgba(109, 166, 186, 0) 0%, rgba(242, 199, 157, 0.2) 100%);
            opacity: 0;
            transition: opacity 0.4s ease;
          }
          
          .img-hover-effect-wrapper:hover .img-overlay {
            opacity: 1;
          }
          
          .img_services_home {
            transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
            transform-origin: center;
            border-radius: 15px;
          }
          
          .img-hover-effect-wrapper:hover .img_services_home {
            transform: scale(1.08);
            box-shadow: 0 10px 20px rgba(0,0,0,0.3);
          }
          
          .img-hover-effect-wrapper:hover {
            transform: translateY(-8px);
            box-shadow: 5px 15px 15px rgba(109, 166, 186, 0.5);
          }
          
          .service_home_overlay {
            position: relative;
            overflow: hidden;
            transition: all 0.4s ease;
            background: linear-gradient(45deg, #F2C79D 0%, #6da6ba 100%);
            background-size: 200% 200%;
            animation: gradientBackground 8s ease infinite;
          }
          
          .service_home_overlay:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(242, 199, 157, 0.5);
          }
          
          .Login-button {
            position: relative;
            overflow: hidden;
            transition: all 0.4s ease;
          }
          
          .Login-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          }
          
          .Login-button:after {
            content: "";
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0) 100%);
            transition: all 0.6s ease;
          }
          
          .Login-button:hover:after {
            left: 100%;
          }
          
          .staggered-row {
            perspective: 1000px;
          }
          
          /* Responsive Adjustments */
          @media screen and (max-width: 768px) {
            .animate-slide-in-right {
              animation-duration: 1s;
            }
            
            .animate-item-appear, .animate-item-appear-alternate {
              animation-duration: 0.7s;
            }
            
            .floating-shadow {
              animation-duration: 4s;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Home;