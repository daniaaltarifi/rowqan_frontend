import { Container, Row, Col } from "react-bootstrap";
import "../Css/Footer.css";
function Footer() {
  return (
    <>
      <section className="margin_section">
        <hr />
        <Container className=" mt-5">
          <Row>
            <Col xl={6} md={6} sm={12}>
              <h1 className="title_footer">Rowqan</h1>
              <h6 className="parg_footer">
                We kaboom your beauty holiday instantly and memorable.
              </h6>
            </Col>
            <Col xl={6} md={6} sm={12}>
              <h1 className="title_footer">Become hotel Owner</h1>
              <button className="Login-button">Register Now</button>
            </Col>
          </Row>
        </Container>
        <Col xl={12} md={12} sm={12} className="cont_copyright">
          <h6 className="text_copyright">
            Copyright 2024 • All rights reserved • Salman Faris
          </h6>
        </Col>
      </section>
    </>
  );
}

export default Footer;
