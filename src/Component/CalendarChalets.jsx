import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ModelAlert from "./ModelAlert";
import axios from "axios";
import { API_URL } from "../App";
import PropTypes from "prop-types";
import clock from "../assets/clock.png";

function CalendarChalets({ setSelectedDate,setTimeIdDaily, setTimePriceDaily }) {
  const { id } = useParams();
  const lang = location.pathname.split("/")[1] || "en";
  const [currentDate, setCurrentDate] = useState(new Date());
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState("");
  const [reservedDates, setReservedDates] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  // State for the selected date from either calendar
  const [selectedDateAndTime, setSelectedDateAndTime] = useState({});
  const [rightTimes, setRightTimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);
  // Function to handle date selection for morning and evening calendars
  const handleSelectDate = (day, time_id,priceForDaily) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const selectedFormattedDate = `${newDate.getFullYear()}-${(
      newDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${newDate.getDate().toString().padStart(2, "0")}`;
    const isReserved = reservedDates[time_id]?.some(
      (reservedDate) => reservedDate.date === selectedFormattedDate
    );
  
    if (isReserved) {
      setModalTitle("This Date is Reserved");
      setModalMessage(
        "This date is already reserved. Please choose another date."
      );
      handleShowModal();
      return;
    }
    setSelectedDateAndTime({
      [time_id]: newDate, // Keep the selected date for the current calendar
    });
    setSelectedDate(newDate);
    setTimeIdDaily(time_id);
    setTimePriceDaily(priceForDaily)
  };

  const formatDate = (date) => {
    const localYear = date.getUTCFullYear();
    const localMonth = date.getUTCMonth();
    const localDay = date.getUTCDate();
    return `${localYear}-${(localMonth + 1)
      .toString()
      .padStart(2, "0")}-${localDay.toString().padStart(2, "0")}`;
  };

  const fetchReservedDates = useCallback(
    async (timeOfDay, timeId) => {
      try {
        const res = await axios.get(
          `${API_URL}/ReservationsChalets/getReservationsByRightTimeName/${id}/${timeOfDay}/${lang}`
        );
        const reservedDates = res.data.reserved_days.map((reservation) => {
          const utcDate = new Date(reservation);
          const formattedDate = formatDate(utcDate); // Use your date formatting logic
          return { date: formattedDate };
        });
  
        // Update the reservedDates state per timeId
        setReservedDates((prev) => ({
          ...prev,
          [timeId]: reservedDates, // Use timeId as the key
        }));
      } catch (error) {
        console.error(`Error fetching reserved dates for ${timeOfDay}:`, error);
      }
    },
    [lang, id]
  );
  useEffect(() => {
    if (rightTimes && rightTimes.length > 0) {
      rightTimes.forEach((time) => {
        fetchReservedDates(time.type_of_time, time.id);
      });
    }
  }, [rightTimes, lang, id, fetchReservedDates]);
  
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

  CalendarChalets.propTypes = {
    setSelectedDate: PropTypes.string.isRequired, // Ensure selectedDate is a Date object
    toggleDropdown: PropTypes.func.isRequired,
    setTimeIdDaily: PropTypes.string.isRequired,
    setTimePriceDaily: PropTypes.string.isRequired,
  };
  // const getTimesBychaletsId = useCallback(async () => {
  //   try {
  //     const res = await axios.get(
  //       `${API_URL}/RightTimes/getallrighttimesbyChaletId/${id}/${lang}`
  //     );
  //     setRightTimes(res.data);
  //     console.log("first time", res.data);
  //   } catch (error) {
  //     console.error("Error fetching available times:", error);
  //     alert(
  //       "There was an error fetching the available times. Please try again later."
  //     );
  //   }
  // }, [lang, id]);

  // useEffect(() => {
  //   getTimesBychaletsId();
  // }, [id]);
  const getTimesBychaletsId = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/RightTimes/getallrighttimesbyChaletId/${id}/${lang}`
      );
      setRightTimes(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching available times:", error);
      alert("There was an error fetching the available times. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [lang, id]);
  
  
  useEffect(() => {
    getTimesBychaletsId();
  }, [getTimesBychaletsId, id, lang]);
  
  return (
    <>
      <div className="date-picker-container">
        {loading ? (
      <p>Loading...</p>
    ) : rightTimes.length > 0 ? (
          rightTimes.map((time) => (
            <div className="calendar" key={time.id}>
              <h4 className="text-center" style={{ color: "#fff" }}>
                <img
                  src={clock}
                  alt="clock"
                  height={"30px"}
                  width={"35px"}
                />{" "}
                {time.type_of_time} Dates
              </h4>
              <h5 className="text-center" style={{ color: "#fff" }}>
                {time.from_time} - {time.to_time}
              </h5>
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
                {Array.from(
                  { length: daysInMonth },
                  (_, index) => index + 1
                ).map((day) => {
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
                  // const isSelected =
                  //   selectedDateAndTime[time.id]?.getDate() === day &&
                  //   selectedDateAndTime[time.id]?.getMonth() ===
                  //     currentDate.getMonth() &&
                  //   selectedDateAndTime[time.id]?.getFullYear() ===
                  //     currentDate.getFullYear();
                  // const isReserved = reservedDates.some(
                  //   (reservedDate) => reservedDate.date === currentFormattedDate
                  // );
                  const isReserved = reservedDates[time.id]?.some(
                    (reservedDate) => reservedDate.date === currentFormattedDate
                  );
                  
        
                  const isSelected =
                    selectedDateAndTime[time.id]?.getDate() === day &&
                    selectedDateAndTime[time.id]?.getMonth() ===
                      currentDate.getMonth() &&
                    selectedDateAndTime[time.id]?.getFullYear() ===
                      currentDate.getFullYear();
                  return (
                    <span
                      key={day}
                      className={`calendar-day ${
                        isSelected ? "selected" : ""
                      } ${isReserved ? "reserved" : ""}`}
                      onClick={() => handleSelectDate(day, time.id,time.After_Offer > 0  ? time.After_Offer : time.price)}
                    >
                      {day}
                    </span>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <p> No Times Available...</p>
        )}
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
