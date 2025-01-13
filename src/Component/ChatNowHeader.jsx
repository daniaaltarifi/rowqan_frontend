import { useEffect, useRef, useState } from "react";
import "../Css/ChatNowHeader.css";
import { Col, Container, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useUser } from "./UserContext";
function ChatNowHeader({ properitesChalets, chalet_id, price }) {
  // Reference to the header element
    const {userId}=useUser()
  const headerRef = useRef(null);
  const [isSticky, setIsSticky] = useState(false);
  const lang = location.pathname.split("/")[1] || "en";
  useEffect(() => {
    // const header = headerRef.current;

    const myFunction = () => {
      if (window.pageYOffset > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };
    window.onscroll = myFunction;

    return () => {
      window.onscroll = null;
    };
  }, []);
  ChatNowHeader.propTypes = {
    properitesChalets: PropTypes.array.isRequired,
    chalet_id: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
  };
  return (
    <div>
      <div className={`header ${isSticky ? "sticky" : ""}`} ref={headerRef}>
        <Container>
          <Row>
            <Col sm={6} md={6} xl={6}>
              {properitesChalets && properitesChalets.length > 0 && (
                <>
                  <h2 className="title_chat_header">
                    🌟 {properitesChalets[0].Chalet.title} 🌟
                  </h2>
                  <div className="d-flex flex-wrap">
                    {properitesChalets.slice(-4).map((prop) => (
                      <div className="d-flex" key={prop.id}>
                        <img
                          className="rounded-circle mx-2"
                          height={"25px"}
                          width={"25px"}
                          alt="properites"
                          srcSet={`
                       https://res.cloudinary.com/dqimsdiht/${prop.image}?w=400&f_auto&q_auto:eco 400w,
                      `}
                          sizes="(max-width: 768px) 100vw, 50vw"
                          decoding="async"
                          loading="lazy"
                        />{" "}
                        {prop.title} ,
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Col>
            <Col sm={6} md={6} xl={6} className="d-flex justify-content-center">
              <Link to={userId ? (`/${lang}/chatbot/${chalet_id}`) : (`/${lang}/login`)}>
                <button className="chat_now_btn_header m-2">Chat Now</button>
              </Link>
              <Link
                to={`/${lang}/reservechalet/${chalet_id}`}
                state={{
                  price,
                }}
              >
                <button className="chat_now_btn_header">Book Now</button>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default ChatNowHeader;
