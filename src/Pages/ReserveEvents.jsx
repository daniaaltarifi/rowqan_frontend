import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_URL } from "../App";
import ModelAlert from "../Component/ModelAlert";

const ReservationEvents = () => {
  const { id } = useParams();
  const lang = location.pathname.split("/")[1] || "en";

  const [reservations, setReservations] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [selectedDate, setSelectedDate] = useState(null); // Store selected date
  const [error, setError] = useState("");
  const [date, setDate] = useState(new Date()); // Current month
  const [showModal, setShowModal] = useState(false); // State to control modal visibility
  const [modalTitle, setModalTitle] = useState(""); // Title of the modal (Success or Error)
  const [modalMessage, setModalMessage] = useState(""); // Message for the modal

  const handleCloseModal = () => setShowModal(false); // Close modal handler
  // const handleShowModal = () => setShowModal(true);

  // Fetch reservations only once per language and ID
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/reservationsEvents/getAllReservationEventsByAvailableId/${id}/${lang}`
        );
        setReservations(response.data.reservations);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };
    fetchReservations();
  }, [id, lang]);

  // Handle month change (previous/next)
  const handleChangeMonth = useCallback((offset) => {
    setDate((prev) => new Date(prev.setMonth(prev.getMonth() + offset)));
  }, []);

  // Handle day selection on the calendar
  const handleSelectDate = useCallback(
    (day) => {
      const newDate = new Date(date.getFullYear(), date.getMonth(), day);
      setSelectedDate(newDate);
    },
    [date]
  );

  // Check for overlap with existing reservations
  const checkOverlap = (selectedDate, startTime, endTime) => {
    const selectedStart = new Date(selectedDate);
    selectedStart.setHours(
      parseInt(startTime.split(":")[0]),
      parseInt(startTime.split(":")[1])
    );

    const selectedEnd = new Date(selectedDate);
    selectedEnd.setHours(
      parseInt(endTime.split(":")[0]),
      parseInt(endTime.split(":")[1])
    );

    // Check if any reservation overlaps with the selected time range
    for (const reservation of reservations) {
      const reservationStart = new Date(
        reservation.date + " " + reservation.start_time
      );
      const reservationEnd = new Date(
        reservation.date + " " + reservation.end_time
      );

      // Check for time overlap: if selected start/end is within reservation or reservation is within selected time
      if (
        (selectedStart >= reservationStart && selectedStart < reservationEnd) ||
        (selectedEnd > reservationStart && selectedEnd <= reservationEnd) ||
        (selectedStart <= reservationStart && selectedEnd >= reservationEnd)
      ) {
        return true; // Overlap detected
      }
    }
    return false; // No overlap
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state

    if (!selectedDate) {
      setError("Please select a date.");
      return;
    }

    if (!startTime || !endTime) {
      setError("Please select both start and end times.");
      return;
    }

    // Check for overlap
    const isOverlapping = checkOverlap(selectedDate, startTime, endTime);
    if (isOverlapping) {
      setModalTitle("Error");
      setModalMessage(
        "The selected time range overlaps with an existing reservation."
      );
      setShowModal(true);
    } else {
      // Proceed with reservation
      try {
        await axios.post(
          `${API_URL}/reservationsEvents/createreservationevents`,
          {
            date: selectedDate, // send the correctly formatted date
            lang: lang,
            start_time: startTime,
            end_time: endTime,
            available_event_id: id,
          }
        );
        // On success, show the success modal
        setModalTitle("Success");
        setModalMessage("Your reservation has been successfully booked!");
        setShowModal(true);
      } catch (error) {
        // On failure, show the failure modal
        console.error("Error confirming reservation:", error);
        setModalTitle("Error");
        setModalMessage(
          "Failed to confirm reservation. Please try again later."
        );
        setShowModal(true);
      }
    }
  };
  // Calendar month and days calculation
  const { daysInMonth, startDay } = (() => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    return { daysInMonth: lastDay.getDate(), startDay: firstDay.getDay() };
  })();

  return (
    <div>
      <form onSubmit={handleSubmit}>
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
                {date.toLocaleString("default", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <button
                className="next-month"
                onClick={() => handleChangeMonth(1)}
              >
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
                const isSelected =
                  selectedDate && selectedDate.getDate() === day;
                return (
                  <span
                    key={day}
                    className={`calendar-day ${isSelected ? "selected" : ""}`}
                    onClick={() => handleSelectDate(day)}
                  >
                    {day}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <div className="text-center">
          <div className="my-4">
            <label>Start Time:</label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div>
            <label>End Time:</label>
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="booknow_button_events mt-5">
            <b>Reserve Now</b>
          </button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </form>
      <ModelAlert
        show={showModal}
        handleClose={handleCloseModal}
        title={modalTitle}
        message={modalMessage}
      />
    </div>
  );
};

export default ReservationEvents;
