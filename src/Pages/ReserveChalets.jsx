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
import { useLocation, useParams } from "react-router-dom";
import ModelAlert from "../Component/ModelAlert";
import { useUser } from "../Component/UserContext";

const ReserveChalets = () => {
  const{userId}=useUser()
  const location = useLocation();
  const lang = location.pathname.split("/")[1] || "en";
  const { id } = useParams();
  const { timeId, price } = location.state || {};
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [number_of_daysvalue, setnumber_of_daysValue] = useState(0); // State to hold the number_of_daysvalue
  const [additional_visitorsvalue, setadditional_visitorsValue] = useState(0);
  const [reservedDates, setReservedDates] = useState([]); // Reserved dates from API
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [modalTitle, setModalTitle] = useState(""); // Title of the modal (Success or Error)
  const [modalMessage, setModalMessage] = useState(""); // Message for the modal

  const handleCloseModal = () => setShowModal(false); // Close modal handler
  const handleShowModal = () => setShowModal(true); // Show modal handler

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
    return price + additionalCost + visitorsCost;
  };

  const getDaysInMonth = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay(); // day of week of the 1st of the month
    return { daysInMonth, startDay };
  };

  const handleSelectDate = (day) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(newDate);
  };

  const handlePrevMonth = () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(currentDate.getMonth() - 1);
    setCurrentDate(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(currentDate.getMonth() + 1);
    setCurrentDate(nextMonth);
  };

  const getReservedDates = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_URL}/ReservationsChalets/reservationsByChaletId/${id}/${lang}`
      );
      const reservedDates = res.data.reservations.map((reservation) => {
        // Parse the reservation date from UTC to local date format (YYYY-MM-DD)
        const utcDate = new Date(reservation.date);
        const localYear = utcDate.getUTCFullYear();
        const localMonth = utcDate.getUTCMonth();
        const localDay = utcDate.getUTCDate();

        // Format the local date in 'YYYY-MM-DD' to compare with the calendar days
        const localFormattedDate = `${localYear}-${(localMonth + 1)
          .toString()
          .padStart(2, "0")}-${localDay.toString().padStart(2, "0")}`;
        return localFormattedDate;
      });
      setReservedDates(reservedDates);
    } catch (error) {
      console.error("Error fetching reserved dates:", error);
    }
  }, [lang, id]);

  useEffect(() => {
    getReservedDates();
  }, [lang, id, currentDate]);

  const { daysInMonth, startDay } = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );
  const handleConfirmReservation = async () => {
    if (!selectedDate || !lang || !id || !timeId) {
      setError("Please select a date");
      return;
    }
  
    // Ensure selectedDate is in your local timezone
    const localDate = new Date(selectedDate);
    const formattedDate = localDate.toLocaleDateString('en-CA'); // 'en-CA' gives YYYY-MM-DD format
    
    try {
      await axios.post(
        `${API_URL}/ReservationsChalets/createReservationChalet`,
        {
          initial_amount: price,
          date: formattedDate,  // send the correctly formatted date
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
    } catch (error) {
      // On failure, show the failure modal
      console.error("Error confirming reservation:", error);
      setModalTitle("Error");
      setModalMessage("Failed to confirm reservation. Please try again later.");
      handleShowModal();
    }
  };

  return (
    <>
      <div className="date-picker-container">
        <div className="calendar">
          <div className="calendar-header">
            <button className="prev-month" onClick={handlePrevMonth}>
              Prev
            </button>
            <span className="month">
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button className="next-month" onClick={handleNextMonth}>
              Next
            </button>
          </div>
          <div className="days-of-week">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>
          <div className="calendar-days">
            {/* Render empty spaces for days before the 1st of the month */}
            {Array(startDay)
              .fill(null)
              .map((_, index) => (
                <span key={index} className="empty-day"></span>
              ))}

            {/* Render actual days */}
            {Array.from({ length: daysInMonth }, (_, index) => index + 1).map(
              (day) => {
                // Create a local date for each day of the current month
                const currentDay = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day
                );
                const currentFormattedDate = `${currentDay.getFullYear()}-${(
                  currentDay.getMonth() + 1
                )
                  .toString()
                  .padStart(2, "0")}-${currentDay
                  .getDate()
                  .toString()
                  .padStart(2, "0")}`;

                const isReserved = reservedDates.includes(currentFormattedDate); // Check if the day is reserved
                const isSelected = selectedDate?.getDate() === day;

                return (
                  <span
                    key={day}
                    className={`calendar-day ${isSelected ? "selected" : ""} ${
                      isReserved ? "reserved" : ""
                    }`}
                    onClick={() => !isReserved && handleSelectDate(day)} // Allow selection only if not reserved
                  >
                    {day}
                  </span>
                );
              }
            )}
          </div>
        </div>
      </div>
      <Container className="mt-5">
        <h6 className="py-2">
          <img src={info} alt="info" height={"30px"} width={"30px"} />
          The number of visitors to the chalet reaches 15 visitors
        </h6>
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
            <span className="number_of_daysvalue mx-2">{number_of_daysvalue}</span>
            <button
              className="plus-minus-button"
              onClick={number_of_daysincrement}
            >
              <GoPlus />
            </button>
          </div>
        </h6>
        <h6>
          <div className="plus-minus-container">
            <img src={people} alt="info" height={"30px"} width={"30px"}/>
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
