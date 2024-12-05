import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useCallback, useEffect, useState } from "react";
import { API_URL } from "../App";
import axios from "axios";
function BestRated() {
  const lang = location.pathname.split("/")[1] || "en";
  const [BestRated, setBestRated] = useState([]);

  const getBestRated = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_URL}/services/getAllServicesByServiceStatus/Best Rated/${lang}`
      );
      console.log("first response", res.data);
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
                <img
                  src={`https://res.cloudinary.com/durjqlivi/${best.image}`}
                  alt="top picks"
                  height={"200px"}
                  width={"100%"}
                  className="toppicks_home_img"
                />
                <div>
                  <h5 className="title_of_toppick">{best.title}</h5>
                  {/* <p className="parg_of_toppicks">
                Colombo, Sri Lanka
                </p> */}
                </div>
              </Col>
            </>
          ))}
        </Row>
      </Container>
    </>
  );
}

export default BestRated;
