import { useState, useEffect, useCallback } from "react";
import "../Css/Lands.css";
import { Container } from "react-bootstrap";
import info from "../assets/info.png";
import days from "../assets/days.png";
import dollar from "../assets/dollar.png";
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
  const location = useLocation();
  const navigate = useNavigate();
  const lang = location.pathname.split("/")[1] || "en";
  const { id } = useParams();
  const {price,timeId,fulldayState  } = location.state || {};
  console.log("time",timeId)
  const [defaultPrice, setDefaultPrice] = useState(price);

  const [selectedDate, setSelectedDate] = useState(null);
    const [number_of_daysvalue, setnumber_of_daysValue] = useState(0); 
  const [additional_visitorsvalue, setadditional_visitorsValue] = useState(0);
  const [showModal, setShowModal] = useState(false); 
  const [modalTitle, setModalTitle] = useState(""); 
  const [modalMessage, setModalMessage] = useState(""); 
  const handleCloseModal = () => setShowModal(false); 
  const handleShowModal = () => setShowModal(true);

  const [error, setError] = useState("");
  const number_of_daysincrement = () =>
    setnumber_of_daysValue(number_of_daysvalue + 1);
  const number_of_daysdecrement = () => {
    if (number_of_daysdecrement > 0) {
      setnumber_of_daysValue(number_of_daysvalue - 1);
    }
  };

  const additional_visitorsincrement = () =>
    setadditional_visitorsValue(additional_visitorsvalue + 1);
  const additional_visitorsdecrement = () => {
    if (additional_visitorsvalue > 0) {
      setadditional_visitorsValue(additional_visitorsvalue - 1);
    }
  };
  const calculatePrice = () => {
    const additionalCost = number_of_daysvalue * 20; // 20 JD per day
    const visitorsCost = additional_visitorsvalue * 10; // 10 JD per additional visitor
    return defaultPrice + additionalCost + visitorsCost;
  };


 


  const handleConfirmReservation = async () => {
    console.log("SelectedDate: ", selectedDate);

    if (!selectedDate || !lang || !id || !timeId) {
      setError("Please make sure you are selected a date.");
      return;
    }

    // Ensure selectedDate is in your local timezone
    const localDate = new Date(selectedDate);
    const formattedDate = localDate.toLocaleDateString("en-CA"); // 'en-CA' gives YYYY-MM-DD format

    try {
      await axios.post(
        `${API_URL}/ReservationsChalets/createReservationChalet`,
        {
          initial_amount: defaultPrice,
          date: formattedDate, // send the correctly formatted date
          lang: lang,
          additional_visitors: additional_visitorsvalue,
          number_of_days: number_of_daysvalue,
          user_id: userId,
          chalet_id: id,
          right_time_id: timeId,
        }
      );
      // On success, show the success modal
      setModalTitle("Success");
      setModalMessage("Reservation confirmed successfully!");
      handleShowModal();
      setTimeout(() => {
        navigate(`/${lang}`);
      }, 2000);
    } catch (error) {
      // On failure, show the failure modal
      console.error("Error confirming reservation:", error);
      setModalTitle("Error");
      setModalMessage("Failed to confirm reservation. Please try again later.");
      handleShowModal();
    }
  };
  const [isOpen, setIsOpen] = useState(false);

  // Toggle the dropdown visibility
  const toggleDropdown = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };
  return (
    <>
      <SelectTime
        isOpen={isOpen}
        toggleDropdown={toggleDropdown}
        // price={price}
      />

<CalendarChalets
   timeId={timeId}
   setSelectedDate={setSelectedDate}
   selectedDate={selectedDate} 
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
              onClick={number_of_daysdecrement}
            >
              <LuMinus />
            </button>
            <span className="number_of_daysvalue mx-2">
              {number_of_daysvalue}
            </span>
            <button
              className="plus-minus-button"
              onClick={number_of_daysincrement}
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
              onClick={additional_visitorsdecrement}
            >
              <LuMinus />
            </button>
            <span className="number_of_daysvalue mx-2">
              {additional_visitorsvalue}
            </span>
            <button
              className="plus-minus-button"
              onClick={additional_visitorsincrement}
            >
              <GoPlus />
            </button>
          </div>
        </h6>
        <h6>
          <img src={dollar} alt="info" height={"30px"} width={"30px"} />
          Value of Reservation is: {calculatePrice()} JD
        </h6>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <button
          className="booknow_button_events w-100 my-5 "
          onClick={handleConfirmReservation}
        >
          Confirm reservation
        </button>
        <ModelAlert
          show={showModal}
          handleClose={handleCloseModal}
          title={modalTitle}
          message={modalMessage}
        />
      </Container>
    </>
  );
};

export default ReserveChalets;
