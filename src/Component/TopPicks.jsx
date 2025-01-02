import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../App";
import { Link } from "react-router-dom";
function TopPicks() {
  const lang = location.pathname.split("/")[1] || "en";
  const [topPicks, settopPicks] = useState([]);

  const gettopPicks = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_URL}/services/getAllServicesByServiceStatus/Most Picked/${lang}`
      );
      const lastFourServices= res.data.slice(-4)
      settopPicks(lastFourServices);
    } catch (error) {
      console.error("Error fetching top rated services:", error);
    }
  }, [lang]);

  useEffect(() => {
    gettopPicks();
  }, [lang]);

  return (
    <>
      <Container className=" mt-5 ">
        <Row>
          {topPicks.map((top) => (
            <>
              <Col xl={3} md={6} sm={12} key={top.id}>
              <Link to={`/${lang}/${top.url}`} style={{textDecoration:"none"}}>

                <img
                  src={`https://res.cloudinary.com/durjqlivi/${top.image}`}
                  alt="top picks"
                  height={"200px"}
                  width={"100%"}
                  className="toppicks_home_img"
                />
                <div>
                  <h5 className="title_of_toppick">{top.title}</h5>
                </div>
                </Link>
              </Col>
            </>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default TopPicks;
