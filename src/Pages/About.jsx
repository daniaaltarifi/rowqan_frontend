import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Container, Row, Col } from "react-bootstrap";
import { motion } from "framer-motion";
import { API_URL } from "../App";

const imageVariants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    y: 50 
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: {
      type: "spring", 
      stiffness: 100, 
      damping: 10,    
      duration: 0.8   
    }
  }
};

const textVariants = {
  hidden: { 
    opacity: 0, 
    x: -50 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      delay: 0.3 
    }
  }
};

function About() {
  const lang = location.pathname.split("/")[1] || "en";
  const [heroes, setHeroes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getHero = useCallback(async () => {
    try {
      setIsLoading(true);
      const heroRes = await axios.get(`${API_URL}/aboutUs/getabout/${lang}`);
      setHeroes(heroRes.data);
      setError(null);
    } catch (err) {
      setError("Failed to load about information");
      console.error("Error fetching about page data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    window.scrollTo(0, 0);
    getHero();
  }, [getHero]);

  return (
    <div className="about-page py-5" style={{ minHeight: '80vh' }}>
      <Container>
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="text-center my-5" style={{ minHeight: '60vh' }}>
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          </div>
        ) : (
          heroes.map((hero) => (
            <Row 
              key={hero.id} 
              className="align-items-center mb-5 g-4"
            >
              <Col 
                xs={12} 
                md={6} 
                className="order-md-1 order-2 text-center text-md-start pe-md-5"
              >
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={textVariants}
                  className="pt-md-5 mt-md-4"
                >
                  <h1 className="display-5 mb-4 fw-bold">
                    {hero.title}
                  </h1>
                  <p className="lead text-muted mb-0">
                    {hero.description}
                  </p>
                </motion.div>
              </Col>
              <Col 
                xs={12} 
                md={6} 
                className="order-md-2 order-1 mb-4 mb-md-0"
              >
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={imageVariants}
                  className="image-container position-relative"
                >
                  <img 
                    src={`https://res.cloudinary.com/dqimsdiht/${hero.image}?w=800&f_auto&q_auto:eco`}
                    srcSet={`
                      https://res.cloudinary.com/dqimsdiht/${hero.image}?w=400&f_auto&q_auto:eco 400w,
                      https://res.cloudinary.com/dqimsdiht/${hero.image}?w=800&f_auto&q_auto:eco 800w
                    `}
                    sizes="(max-width: 576px) 100vw, 
                           (max-width: 992px) 50vw, 
                           500px"
                    alt={hero.title}
                    className="img-fluid rounded shadow-lg"
                    loading="lazy"
                  />
                </motion.div>
              </Col>
            </Row>
          ))
        )}
      </Container>
    </div>
  );
}

export default About;