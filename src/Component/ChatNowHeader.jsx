import { useEffect, useRef, useState } from "react";
import "../Css/ChatNowHeader.css";
import { Col, Container, Row } from "react-bootstrap";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { useUser } from "./UserContext";
function ChatNowHeader({ dataChalets, chalet_id, price }) {
  // Reference to the header element
  const { userId } = useUser();
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
    dataChalets: PropTypes.array.isRequired,
    chalet_id: PropTypes.string.isRequired,
    price: PropTypes.string.isRequired,
  };
  return (
    <div>
      <div className={`header ${isSticky ? "sticky" : ""}`} ref={headerRef}>
        <Container>
          <Row>
            <Col sm={6} md={6} xl={6}>
              {dataChalets && (
                <>
                  <h2 className="title_chat_header">
                    🌟 {dataChalets.title} 🌟
                  </h2>
                </>
              )}
            </Col>
            <Col sm={6} md={6} xl={6} className="d-flex justify-content-center">
              <Link
                to={userId ? `/${lang}/chatbot/${chalet_id}` : `/${lang}/login`}
              >
                <button className="chat_now_btn_header m-2">{lang==='ar' ? 'دردش الان' : 'Chat Now'}</button>
              </Link>
              <Link
                to={`/${lang}/reservechalet/${chalet_id}`}
                state={{
                  price,
                  type: dataChalets.type,
                }}
              >
                <button className="chat_now_btn_header"> {lang=== 'ar' ? 'احجز الان ' : ' Book Now'}</button>
              </Link>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default ChatNowHeader;
