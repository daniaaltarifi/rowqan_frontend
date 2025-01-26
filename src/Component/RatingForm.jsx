import { useCallback, useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import { Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { API_URL } from "../App";
import { useUser } from "./UserContext";

const RatingForm = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [errorRating, setErrorRating] = useState("");
  const [errorComment, setErrorComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const lang = location.pathname.split("/")[1] || "en";
  const [chalets, setChalets] = useState([]);
  const [chalet_id, setChalet_id] = useState("");
  const { userId } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (rating === 0) {
      setErrorRating("Please select a rating.");
      return;
    } else {
      setErrorRating("");
    }

    if (chalet_id.trim() === "") {
      setErrorComment("Please provide a Chalet.");
      return;
    } else {
      setErrorComment("");
    }
    try {
      await axios.post(
        `${API_URL}/NOstars/createstars`,
        { chalet_id, no_start: rating }, // Correctly format the payload
        {
          headers: {
            "Content-Type": "application/json", // Correct Content-Type for JSON data
          },
        }
      );
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      setErrorComment(error);
    }
    // Trigger modal to show
  };

  const resetFeedback = () => {
    setRating(0);
    setSubmitted(false);
  };

  const renderStars = () => {
    return [...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
        <span
          key={index}
          className="cursor-pointer text-2xl"
          style={{
            color:
              starValue <= (hoveredRating || rating) ? "#FFD700" : "#CCCCCC",
            fontSize: "3rem", // Gold for selected stars, grey otherwise
          }}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => setRating(starValue)}
        >
          ★
        </span>
      );
    });
  };
  const getChaletsReservationByUser = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_URL}/ReservationsChalets/reservationsByUserId/${userId}/${lang}`
      );
      setChalets(res.data);
      console.log("first request", res.data);
    } catch (error) {
      console.error("Error fetching reservation:", error);
    }
  }, [lang]);

  useEffect(() => {
    getChaletsReservationByUser();
  }, [lang]);
  return (
    <section className="section">
    <div className="star-rating-bx">
      <div className="star-widget">
        <Container>
          <Row>
            <Col
              lg={12}
              md={12}
              sm={12}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <form
                onSubmit={handleSubmit}
                style={{
                  padding: "65px",
                  boxShadow: "8px 8px 12px 12px #6da6ba",
                }}
              >
                <h2 className="text-center">{lang === 'ar' ? ' اترك لنا تعليق':'Feedback'}</h2>
  
                <div className="stars text-center">{renderStars(5)}</div>
  
                <p id="error-rating" className="text-danger">{errorRating}</p>
  
                <div>
                  <Form.Select
                    aria-label="Default select example"
                    onChange={(e) => setChalet_id(e.target.value)}
                  >
                    <option>{lang === 'ar' ? ' اختر شاليه':'Select Chalets'}</option>
                    {chalets.map((chalet) => (
                      <option value={chalet.chalet_id} key={chalet.id}>
                        {chalet.Chalet?.title}
                      </option>
                    ))}
                  </Form.Select>
                  <p id="error-comment" className="text-danger">{errorComment}</p>
                </div>
  
                {/* Centered Submit Button */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: "20px",
                  }}
                >
                  <button type="submit" className="booknow_button_events w-50">
                    {lang === "ar" ? "ارسال" : "Submit"}
                  </button>
                </div>
              </form>
            </Col>
          </Row>
        </Container>
  
        {/* Modal */}
        {submitted && (
          <div className="modal fade show d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-header">
                  <h3 className="modal-title">Thank you</h3>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={resetFeedback}
                  ></button>
                </div>
                <div className="modal-body">
                  <p>We appreciate you sending us your feedback.</p>
                  <p>
                    <strong>You selected: </strong>⭐ {rating}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  </section>
  
  );
};

export default RatingForm;
