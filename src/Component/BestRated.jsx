import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useCallback, useEffect, useState } from "react";
import { API_URL } from "../App";
import axios from "axios";
import { Link } from "react-router-dom";
function BestRated() {
  const lang = location.pathname.split("/")[1] || "en";
  const [BestRated, setBestRated] = useState([]);

  const getBestRated = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_URL}/NOstars/getNumberOfstarsGreaterThanFour/${lang}`
      );
      setBestRated(res.data);
    } catch (error) {
      console.error("Error fetching best rated services:", error);
    }
  }, [lang]);

  useEffect(() => {
    getBestRated();
  }, [lang]);

  return (
    <>
      <Container className=" mt-5 ">
        <Row>
          {BestRated.map((best) => (
            <>
              <Col xl={3} md={6} sm={12} key={best.id}>
              <Link to={`/${lang}/chaletdetails/${best.chalet_id}`} style={{textDecoration:"none"}}>
                <img
                  src={best.chalet?.image}
                  alt="top picks"
                  height={"200px"}
                  width={"100%"}
                  className="toppicks_home_img"
                />
                <div>
                  <h5 className="title_of_toppick">{best.chalet?.title}</h5>
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

export default BestRated;
