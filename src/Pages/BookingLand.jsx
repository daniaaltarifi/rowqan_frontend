import { useState, useEffect, useCallback } from "react";
import "../Css/Lands.css";
import axios from "axios";
import { API_URL } from "../App";
import { useParams } from "react-router-dom";
import ModelAlert from "../Component/ModelAlert";
import { useUser } from "../Component/UserContext";

const BookingLand = () => {
  const { id } = useParams();
  const { userId } = useUser();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [reservedTimes, setReservedTimes] = useState([]);
  const lang = location.pathname.split("/")[1] || "en";
  const [selectedTime, setSelectedTime] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [modalTitle, setModalTitle] = useState(""); // Title of the modal (Success or Error)
  const [modalMessage, setModalMessage] = useState(""); // Message for the modal

  const handleCloseModal = () => setShowModal(false); // Close modal handler
  const handleShowModal = () => setShowModal(true); // Show modal handler

  // Hardcoded times
  const times = [
    "01:00:00",
    "02:00:00",
    "03:00:00",
    "04:00:00",
    "05:00:00",
    "06:00:00",
    "07:00:00",
    "08:00:00",
    "09:00:00",
    "10:00:00",
    "11:00:00",
    "12:00:00",
    "13:00:00",
    "14:00:00",
    "15:00:00",
    "16:00:00",
    "17:00:00",
    "18:00:00",
    "19:00:00",
    "20:00:00",
    "21:00:00",
    "22:00:00",
    "23:00:00",
    "24:00:00",
  ];

  // Fetch reserved times for a specific date
  const fetchReservedTimes = useCallback(
    async (date) => {
      const formattedDate = date.toLocaleDateString();
      try {
        const { data } = await axios.get(
          `${API_URL}/reservationLands/getreservationslandsbyavailable_land_id/${id}/${lang}`
        );
        const reserved = data.reservation.filter(
          (res) => new Date(res.date).toLocaleDateString() === formattedDate
        );
        setReservedTimes(reserved.map((res) => res.time));
      } catch (error) {
        console.error("Error fetching reserved times:", error);
      }
    },
    [id, lang]
  );

  useEffect(() => {
    if (selectedDate) {
      fetchReservedTimes(selectedDate);
    }
  }, [selectedDate, fetchReservedTimes]);

  const handleChangeMonth = (offset) => {
    setCurrentDate((prev) => new Date(prev.setMonth(prev.getMonth() + offset)));
  };

  const handleSelectDate = (day) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    setSelectedDate(newDate);
    setSelectedTime("");
  };

  const { daysInMonth, startDay } = (() => {
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );
    return { daysInMonth: lastDay.getDate(), startDay: firstDay.getDay() };
  })();
  const handleReserveTime = async () => {
    if (!selectedDate || !lang || !id || !selectedTime) {
      setError("Please select a date and time to reserve");
      return;
    }

    // Ensure selectedDate is in your local timezone
    const localDate = new Date(selectedDate);
    const formattedDate = localDate.toLocaleDateString("en-CA"); // 'en-CA' gives YYYY-MM-DD format

    try {
      await axios.post(`${API_URL}/reservationLands/createreservationslands`, {
        date: formattedDate, // send the correctly formatted date
        lang: lang,
        time: selectedTime,
        available_land_id: id,
        user_id: userId
      });
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
            <button
              className="prev-month"
              onClick={() => handleChangeMonth(-1)}
            >
              Prev
            </button>
            <span className="month">
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button className="next-month" onClick={() => handleChangeMonth(1)}>
              Next
            </button>
          </div>
          <div className="days-of-week">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <span key={day}>{day}</span>
            ))}
          </div>
          <div className="calendar-days">
            {Array.from({ length: startDay }, (_, i) => (
              <span key={i} className="empty-day"></span>
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              return (
                <span
                  key={day}
                  className={`calendar-day ${
                    selectedDate?.getDate() === day ? "selected" : ""
                  }`}
                  onClick={() => handleSelectDate(day)}
                >
                  {day}
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {selectedDate && (
        <div className="reserved-times text-center mt-3">
          <h4>{lang === "ar" ? "الأوقات المحجوزة" : "Reserved Times"}</h4>
          {reservedTimes.length ? (
            <ul >
              {reservedTimes.map((time, index) => (
                <p key={index}>- {time}</p>
              ))}
            </ul>
          ) : (
            <p>
              {lang === "ar"
                ? "لا توجد أوقات محجوزة"
                : "No reserved times available"}
            </p>
          )}
        </div>
      )}

      <div className="time-picker-container">
        <label htmlFor="time-picker" className="time-picker-label">
          {lang === "ar" ? "اختر الوقت" : "Select Time"}
        </label>
        <select
          id="time-picker"
          value={selectedTime}
          onChange={(e) => setSelectedTime(e.target.value)}
          className="custom-select"
        >
          <option value="">Choose Time</option>
          {times
            .filter((time) => !reservedTimes.includes(time))
            .map((time) => (
              <option key={time} value={time}>
                {time}
              </option>
            ))}
        </select>
        <p>
          {lang === "ar" ? "الوقت المحدد" : "Selected Time"}: {selectedTime}
        </p>
        <button className="booknow_button_events" onClick={handleReserveTime}>
          <b>Reserve Now</b>{" "}
        </button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <ModelAlert 
        show={showModal} 
        handleClose={handleCloseModal} 
        title={modalTitle} 
        message={modalMessage} 
      />
      </div>
    </>
  );
};

export default BookingLand;
