import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ModelAlert from "./ModelAlert";
import axios from "axios";
import { API_URL } from "../App";
import PropTypes from "prop-types";

function CalendarChalets({ timeId, setSelectedDate, selectedDate }) {
  const { id } = useParams();
  const lang = location.pathname.split("/")[1] || "en";
  const [currentDate, setCurrentDate] = useState(new Date());
  const [error, setError] = useState("");
  const [reservedDatesMorning, setReservedDatesMorning] = useState([]);
  const [reservedDatesEvening, setReservedDatesEvening] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  // CalendarChalets.propTypes = {
  //   timeId: PropTypes.string.isRequired, // Fix to bool type as per usage
  //   setSelectedDate: PropTypes.string.isRequired, // Ensure selectedDate is a Date object
  //   selectedDate: PropTypes.string.isRequired,
  // };
  // State for the selected date from either calendar
  const [selectedMorningDate, setSelectedMorningDate] = useState(null);
  const [selectedEveningDate, setSelectedEveningDate] = useState(null);

  // Function to handle date selection for morning and evening calendars
  const handleSelectDate = (day, isMorning) => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const selectedFormattedDate = `${newDate.getFullYear()}-${(newDate.getMonth() + 1).toString().padStart(2, "0")}-${newDate.getDate().toString().padStart(2, "0")}`;

    // Clear the other calendar's selected date if it's selected
    if (isMorning) {
      setSelectedMorningDate(newDate);
      setSelectedEveningDate(null); // Clear evening selection if morning is selected
      setSelectedDate(newDate); // Update the parent component's selected date

    } else {
      setSelectedEveningDate(newDate);
      setSelectedMorningDate(null); // Clear morning selection if evening is selected
      setSelectedDate(newDate); // Update the parent component's selected date
    }

    // Check if the selected date is reserved
    const reservedDates = isMorning ? reservedDatesMorning : reservedDatesEvening;
    const isDateReserved = reservedDates.some((reserved) => reserved.date === selectedFormattedDate);
    
    if (isDateReserved) {
      setModalTitle("This Date is reserved");
      setModalMessage("This date is already reserved. Please choose another date.");
      handleShowModal();
    }
  };

  const formatDate = (date) => {
    const localYear = date.getUTCFullYear();
    const localMonth = date.getUTCMonth();
    const localDay = date.getUTCDate();
    return `${localYear}-${(localMonth + 1).toString().padStart(2, "0")}-${localDay.toString().padStart(2, "0")}`;
  };

  // Fetch reserved dates for morning and evening
  const fetchReservedDates = useCallback(async (timeOfDay, setReservedDates) => {
    try {
      const res = await axios.get(`${API_URL}/ReservationsChalets/reservationsByright_time_name/${id}/${timeOfDay}/${lang}`);
      const reservedDates = res.data.reservations.map((reservation) => {
        const utcDate = new Date(reservation.date);
        const formattedDate = formatDate(utcDate);
        return { date: formattedDate };
      });

      setReservedDates(reservedDates);
    } catch (error) {
      console.error(`Error fetching reserved dates for ${timeOfDay}:`, error);
    }
  }, [lang, id]);

  useEffect(() => {
    fetchReservedDates("Morning%20Full%20day", setReservedDatesMorning);
    fetchReservedDates("Evening%20Full%20day", setReservedDatesEvening);
  }, [lang, id, currentDate, fetchReservedDates]);

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

  const getDaysInMonth = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay(); // day of week of the 1st of the month
    return { daysInMonth, startDay };
  };

  const { daysInMonth, startDay } = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
 
  return (
    <>
      <div className="date-picker-container">
        <div className="calendar">
          <h3 className="text-center" style={{ color: "#fff" }}>
            Morning Reserved Date
          </h3>
          <div className="calendar-header">
            <button className="prev-month" onClick={handlePrevMonth}>Prev</button>
            <span className="month">{currentDate.toLocaleString("default", { month: "long", year: "numeric" })}</span>
            <button className="next-month" onClick={handleNextMonth}>Next</button>
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
            {Array(startDay).fill(null).map((_, index) => <span key={index} className="empty-day"></span>)}
            {Array.from({ length: daysInMonth }, (_, index) => index + 1).map((day) => {
              const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const currentFormattedDate = `${currentDay.getFullYear()}-${(currentDay.getMonth() + 1).toString().padStart(2, "0")}-${currentDay.getDate().toString().padStart(2, "0")}`;
              const isSelected = selectedMorningDate?.getDate() === day;
              const isReserved = reservedDatesMorning.some((reservedDate) => reservedDate.date === currentFormattedDate);
              return (
                <span
                  key={day}
                  className={`calendar-day ${isSelected ? "selected" : ""} ${isReserved ? "reserved" : ""}`}
                  onClick={() => handleSelectDate(day, true)}
                >
                  {day}
                </span>
              );
            })}
          </div>
        </div>
        <div className="calendar">
          <h3 className="text-center" style={{ color: "#fff" }}>
            Evening Reserved Date
          </h3>
          <div className="calendar-header">
            <button className="prev-month" onClick={handlePrevMonth}>Prev</button>
            <span className="month">{currentDate.toLocaleString("default", { month: "long", year: "numeric" })}</span>
            <button className="next-month" onClick={handleNextMonth}>Next</button>
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
            {Array(startDay).fill(null).map((_, index) => <span key={index} className="empty-day"></span>)}
            {Array.from({ length: daysInMonth }, (_, index) => index + 1).map((day) => {
              const currentDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
              const currentFormattedDate = `${currentDay.getFullYear()}-${(currentDay.getMonth() + 1).toString().padStart(2, "0")}-${currentDay.getDate().toString().padStart(2, "0")}`;
              const isSelected = selectedEveningDate?.getDate() === day;
              const isReserved = reservedDatesEvening.some((reservedDate) => reservedDate.date === currentFormattedDate);
              return (
                <span
                  key={day}
                  className={`calendar-day ${isSelected ? "selected" : ""} ${isReserved ? "reserved" : ""}`}
                  onClick={() => handleSelectDate(day, false)}
                >
                  {day}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      <ModelAlert
        show={showModal}
        handleClose={handleCloseModal}
        title={modalTitle}
        message={modalMessage}
      />
      {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
    </>
  );
}

export default CalendarChalets;
