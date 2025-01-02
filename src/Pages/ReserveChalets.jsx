import { useState } from "react";
import "../Css/Lands.css";
import { Container } from "react-bootstrap";
import info from "../assets/info.png";
import days from "../assets/days.png";
import dollar from "../assets/dollar.png";
import money from "../assets/save-money.png";
import people from "../assets/people.jpg";
import { GoPlus } from "react-icons/go";
import { LuMinus } from "react-icons/lu";
import axios from "axios";
import { API_URL } from "../App";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ModelAlert from "../Component/ModelAlert";
import { useUser } from "../Component/UserContext";
import SelectTime from "../Component/SelectTime";
import CalendarChalets from "../Component/CalendarChalets";

const ReserveChalets = () => {
  const { userId } = useUser();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const lang = location.pathname.split("/")[1] || "en";
  const { price, timeId, fulldayState, priceTime } = location.state || {};
  console.log("pricebertime", priceTime);
  // States
  const [defaultPrice, setDefaultPrice] = useState(price);
  const [initial_amount, setInitialAmount] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [number_of_daysValue, setNumberOfDaysValue] = useState(0);
  const [additional_visitorsValue, setAdditionalVisitorsValue] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  // Helper functions
  const updateState = (stateSetter, currentValue, increment = true) => {
    stateSetter(increment ? currentValue + 1 : Math.max(0, currentValue - 1));
  };

  const calculatePrice = () => {
    const additionalCost = number_of_daysValue * 20; // 20 JD per day
    const visitorsCost = additional_visitorsValue * 10; // 10 JD per additional visitor
    const priceBerTime = priceTime || 0;
    return defaultPrice + additionalCost + visitorsCost + priceBerTime;
  };

  const handleConfirmReservation = async () => {
    if (!selectedDate || !lang || !id || !timeId) {
      setError("Please make sure you have selected a date.");
      return;
    }

    const formattedDate = new Date(selectedDate).toLocaleDateString("en-CA");

    // Only send initial_amount if it has a valid value
    const reservationData = {
      date: formattedDate,
      lang,
      additional_visitors: additional_visitorsValue,
      number_of_days: number_of_daysValue,
      user_id: userId,
      chalet_id: id,
      right_time_id: timeId,
      initial_amount: initial_amount,
      status: "Pending",
    };

    if (defaultPrice > 0) {
      reservationData.initial_amount = defaultPrice;
    }

    try {
      await axios.post(
        `${API_URL}/ReservationsChalets/createReservationChalet`,
        reservationData
      );

      setModalTitle("Success");
      setModalMessage("Reservation confirmed successfully!");
      setShowModal(true);
      setTimeout(() => navigate(`/${lang}`), 2000);
    } catch (error) {
      console.error("Error confirming reservation:", error);
      setModalTitle("Error");
      setModalMessage("Failed to confirm reservation. Please try again later.");
      setShowModal(true);
    }
  };

  const [isOpen, setIsOpen] = useState(false);

  // Handle dropdown toggle
  const toggleDropdown = () => {
    if (!selectedDate) {
      setError("Please select a date first.");
      window.scrollTo(0, 250);
      return;
    }
    setIsOpen((prevIsOpen) => !prevIsOpen);
    setError(""); // Reset error on successful selection
  };
  window.scrollTo(0, 0);

  return (
    <>
      <CalendarChalets
        timeId={timeId}
        setSelectedDate={setSelectedDate}
        selectedDate={selectedDate}
      />
      <SelectTime
        isOpen={isOpen}
        toggleDropdown={toggleDropdown}
        selectedDate={selectedDate}

        // price={price}
      />

      <Container className="mt-5">
        <h6 className="py-2">
          <img src={info} alt="info" height={"30px"} width={"30px"} />
          The number of visitors to the chalet reaches 15 visitors
        </h6>

        {fulldayState && (
          <h6>
            <div className="plus-minus-container">
              <img src={days} alt="info" height={"30px"} width={"30px"} />
              Number Of Days:
              <button
                className="plus-minus-button"
                onClick={() =>
                  updateState(setNumberOfDaysValue, number_of_daysValue, false)
                }
              >
                <LuMinus />
              </button>
              <span className="number_of_daysvalue mx-2">
                {number_of_daysValue}
              </span>
              <button
                className="plus-minus-button"
                onClick={() =>
                  updateState(setNumberOfDaysValue, number_of_daysValue)
                }
              >
                <GoPlus />
              </button>
            </div>
          </h6>
        )}

        <h6>
          <div className="plus-minus-container">
            <img src={people} alt="info" height={"30px"} width={"30px"} />
            Number of additional visitors:
            <button
              className="plus-minus-button"
              onClick={() =>
                updateState(
                  setAdditionalVisitorsValue,
                  additional_visitorsValue,
                  false
                )
              }
            >
              <LuMinus />
            </button>
            <span className="number_of_daysvalue mx-2">
              {additional_visitorsValue}
            </span>
            <button
              className="plus-minus-button"
              onClick={() =>
                updateState(
                  setAdditionalVisitorsValue,
                  additional_visitorsValue
                )
              }
            >
              <GoPlus />
            </button>
          </div>
        </h6>
        <div className="d-flex mb-3">
          <img src={money} alt="info" height={"30px"} width={"30px"} />
          <h6 className="ms-2 mt-2">Initial amount:</h6>
          <input type="text" onChange={(e)=>{setInitialAmount(e.target.value)}}/>
        </div>
        <h6>
          <img src={dollar} alt="info" height={"30px"} width={"30px"} />
          Value of Reservation is: {calculatePrice()} JD
        </h6>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          className="booknow_button_events w-100 my-5"
          onClick={handleConfirmReservation}
        >
          Confirm reservation
        </button>

        <ModelAlert
          show={showModal}
          handleClose={() => setShowModal(false)}
          title={modalTitle}
          message={modalMessage}
        />
      </Container>
    </>
  );
};

export default ReserveChalets;
