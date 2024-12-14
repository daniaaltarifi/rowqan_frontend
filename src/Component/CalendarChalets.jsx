import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ModelAlert from "./ModelAlert";
import axios from "axios";
import { API_URL } from "../App";

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
  console.log("first time", timeId);
  const handleSelectDate = (day) => {
    if (!timeId) {
      setError("Please select a time slot before selecting a date.");
      window.scrollTo(0, 250);
      return;
    }
    setError("");
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    // Format the selected date to compare with reserved dates
    const selectedFormattedDate = `${newDate.getFullYear()}-${(
      newDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${newDate.getDate().toString().padStart(2, "0")}`;
    setSelectedDate(newDate);
    console.log("Selected Formatted Date: ", selectedFormattedDate);
    console.log("Selected TimeId: ", timeId);

    // Check if the selected date and timeId are reserved
    const isDateReserved = reservedDatesMorning.some(
      (reserved) =>
        reserved.date === selectedFormattedDate && reserved.timeId === timeId
    );

    if (isDateReserved) {
      setModalTitle("This Date is reserved");
      setModalMessage(
        "This date and time are already reserved. Please choose another date."
      );
      handleShowModal();
    } else {
      // If the selected date and timeId are not reserved, set the selected date
      setSelectedDate(newDate);
    }
  };
  const getReservedDatesMorning = useCallback(async () => {
    if (!timeId) {
      console.log("time not defined");
      return;
    }
    try {
      const res = await axios.get(
        `${API_URL}/ReservationsChalets/reservationsByright_time_name/Mornning/${lang}`
      );

      // Prepare an array of reserved dates with their timeId for comparison
      const reservedDates = res.data.reservations.map((reservation) => {
        const utcDate = new Date(reservation.date); // Parse the date in UTC
        const localYear = utcDate.getUTCFullYear();
        const localMonth = utcDate.getUTCMonth();
        const localDay = utcDate.getUTCDate();
        // const timeId = reservation.right_time_id;

        // Format the local date in 'YYYY-MM-DD' for comparison
        const localFormattedDate = `${localYear}-${(localMonth + 1)
          .toString()
          .padStart(2, "0")}-${localDay.toString().padStart(2, "0")}`;

        return { date: localFormattedDate }; // Store both date and timeId
      });

      setReservedDatesMorning(reservedDates);
      console.log("first reservation", reservedDates);
    } catch (error) {
      console.error("Error fetching reserved dates:", error);
    }
  }, [lang]);
  const getReservedDatesEvening = useCallback(async () => {
    if (!timeId) {
      console.log("time not defined");
      return;
    }
    try {
      const res = await axios.get(
        `${API_URL}/ReservationsChalets/reservationsByright_time_name/Evening/${lang}`
      );

      // Prepare an array of reserved dates with their timeId for comparison
      const reservedDates = res.data.reservations.map((reservation) => {
        const utcDate = new Date(reservation.date); // Parse the date in UTC
        const localYear = utcDate.getUTCFullYear();
        const localMonth = utcDate.getUTCMonth();
        const localDay = utcDate.getUTCDate();
        // const timeId = reservation.right_time_id;

        // Format the local date in 'YYYY-MM-DD' for comparison
        const localFormattedDate = `${localYear}-${(localMonth + 1)
          .toString()
          .padStart(2, "0")}-${localDay.toString().padStart(2, "0")}`;

        return { date: localFormattedDate }; // Store both date and timeId
      });

      setReservedDatesEvening(reservedDates);
      console.log("first reservation", reservedDates);
    } catch (error) {
      console.error("Error fetching reserved dates:", error);
    }
  }, [lang]);

  useEffect(() => {
    getReservedDatesMorning();
    getReservedDatesEvening();
  }, [lang, currentDate]);

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

  const { daysInMonth, startDay } = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );
  return (
    <>
      <div className="date-picker-container">
        <div className="calendar">
          <h3 className="text-center" style={{ color: "#fff" }}>
            Morning Reserved Date{" "}
          </h3>
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
            {Array(startDay)
              .fill(null)
              .map((_, index) => (
                <span key={index} className="empty-day"></span>
              ))}
            {Array.from({ length: daysInMonth }, (_, index) => index + 1).map(
              (day) => {
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
                const isSelected = selectedDate?.getDate() === day;
                const isReserved = reservedDatesMorning.some(
                  (reservedDate) => reservedDate.date === currentFormattedDate
                );
                return (
                  <span
                    key={day}
                    className={`calendar-day ${isSelected ? "selected" : ""} ${
                      isReserved ? "reserved" : ""
                    }`}
                    onClick={() => handleSelectDate(day)} // Allow selection only if not reserved
                  >
                    {day}
                  </span>
                );
              }
            )}
          </div>
        </div>
        <div className="calendar">
          <h3 className="text-center" style={{ color: "#fff" }}>
            Evening Reserved Date
          </h3>

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
            {Array(startDay)
              .fill(null)
              .map((_, index) => (
                <span key={index} className="empty-day"></span>
              ))}
            {Array.from({ length: daysInMonth }, (_, index) => index + 1).map(
              (day) => {
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
                const isSelected = selectedDate?.getDate() === day;
                const isReserved = reservedDatesEvening.some(
                  (reservedDate) => reservedDate.date === currentFormattedDate
                );
                return (
                  <span
                    key={day}
                    className={`calendar-day ${isSelected ? "selected" : ""}${
                      isReserved ? "reserved" : ""
                    }`}
                    onClick={() => handleSelectDate(day)} // Allow selection only if not reserved
                  >
                    {day}
                  </span>
                );
              }
            )}
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
