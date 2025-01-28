import { Container, Row, Col } from "react-bootstrap";
import "../Css/Footer.css";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../App";
import { Link } from "react-router-dom";
import arrow from "../assets/arrowtop.png";
function Footer() {
  const lang = location.pathname.split("/")[1] || "en";
  const [footer, setFooter] = useState([]);
  const [iconfooter, setIconFooter] = useState([]);
  const getData = useCallback(async () => {
    try {
      const [footerRes, iconFooterRes] = await Promise.all([
        axios.get(`${API_URL}/footer/getAllFooters/${lang}`),
        axios.get(`${API_URL}/footericons/getAllFooterIcons`),
      ]);
      setFooter(footerRes.data);
      setIconFooter(iconFooterRes.data);
    } catch (error) {
      console.error("Error fetching footer:", error);
    }
  }, [lang]);

  useEffect(() => {
    getData();
  }, [lang]);
  const scrolltoTop = () => [window.scrollTo(0, 0)];

  return (
    <>
      <section className="margin_section">
        <hr />
        <Container className=" mt-5">
          <Row>
            <Col xl={6} md={6} sm={12}>
              <h1 className="title_footer">Rowqan</h1>
              {footer.map((foot) => (
                <h6 className="parg_footer" key={foot.id}>
                  {foot.title}
                </h6>
              ))}
            </Col>
            <Col xl={6} md={6} sm={12}>
              <h1 className="title_footer">Become hotel Owner</h1>
              <button className="Login-button">Register Now</button>
            </Col>
          </Row>
        </Container>
        <Container fluid>
          <Row className="cont_copyright">
            <Col xl={4} md={12} sm={12}>
              <button
                type="button"
                className="btn arrow_btn"
                onClick={scrolltoTop}
              >
                <img src={arrow} alt="arrow" />
              </button>
            </Col>
            <Col xl={8} md={12} sm={12} className="cont_icons_footer">
              {iconfooter.map((icons) => (
                <Link target="blank" to={icons.link_to} key={icons.id}>
                  <img
                    src={`https://res.cloudinary.com/dqimsdiht/${icons.icon}`}
                    alt="icon"
                    className="rounded-circle mx-3"
                    height={"25px"}
                    width={"25px"}
                  />
                </Link>
              ))}

              <h6 className="text_copyright">
                Copyright 2024 • All rights reserved • Rowqan
              </h6>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Footer;
