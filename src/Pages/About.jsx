import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Container, Row, Col,Image } from "react-bootstrap";
import { API_URL } from "../App";

function About() {
  const lang = location.pathname.split("/")[1] || "en";
 const [heroes, setHeroes] = useState([]);
  const getHero = useCallback(async () => {
    const heroRes = await 
      axios.get(`${API_URL}/aboutUs/getabout/${lang}`);
    setHeroes(heroRes.data);
  }, [lang]);
  useEffect(() => {
    window.scrollTo(0, 0);
    getHero();
  }, [lang]);
  return (
    <div>
    <div className="home-container">
         <Container>
        <Row className="align-items-center justify-content-center">
          {heroes.map((hero) => (
            <React.Fragment key={hero.id}>
              <Col md={6} >
                <h1 className="maintext_home">{hero.title} </h1>
                <p className="text_home">{hero.description}</p>
              </Col>
              <Col md={6}>
                <Image
                srcSet={`
                  https://res.cloudinary.com/dqimsdiht/${hero.image}?w=400&f_auto&q_auto:eco 400w,
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
        </Container>
          </div>
    </div>
  )
}

export default About