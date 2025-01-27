import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import ModelAlert from "./ModelAlert";
import { API_URL } from "../App";
import clock from "../assets/clock.png";

function WeeklyMonthlyCalendar({
  setSelectedDate,
  setEndDate,
  toggleDropdown,
  setNumberOfDaysValue
}) {
  const { id } = useParams();
  const lang = location.pathname.split("/")[1] || "en";

  const [currentDate, setCurrentDate] = useState(new Date());
  const [reservedStartDates, setReservedStartDates] = useState([]);
  const [selectedStartedDate, setSelectedStartedDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  // Format date as YYYY-MM-DD
  const formatDate = (date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  };

  // Fetch reserved dates for morning and evening
  const fetchReservedDates = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_URL}/ReservationsChalets/getReservationsByRightTime/${id}/${lang}`
      );
      const reservedDates = res.data.reserved_days.map((reservation) => {
        const utcDate = new Date(reservation);
        return { date: formatDate(utcDate) };
      });
      setReservedStartDates(reservedDates);
    } catch (error) {
      console.error(`Error fetching reserved dates :`, error);
    }
  }, [id, lang]);

  useEffect(() => {
    fetchReservedDates();
    // fetchReservedDates("Evening%20Full%20day", setReservedEndDates);
  }, [fetchReservedDates]);

  // Handle calendar navigation
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
    const startDay = firstDay.getDay(); // Day of the week for the 1st of the month
    return { daysInMonth, startDay };
  };

  const { daysInMonth, startDay } = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );
  const calculateNumberOfDays = (start, end) => {
    const differenceInTime = end - start; // Difference in milliseconds
    return Math.ceil(differenceInTime / (1000 * 60 * 60 * 24)) + 1; // Convert to days
  };

  // Handle date selection
  const handleSelectDate = (day, isStart) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const formattedDate = formatDate(newDate); // Helper function to format the date (e.g., YYYY-MM-DD)

    const reservedDatesList = reservedStartDates.map(
      (reserved) => reserved.date
    );

    // Check if the selected date is reserved
    const isReserved = reservedDatesList.includes(formattedDate);
    if (isReserved) {
      setModalTitle("This Date is Reserved");
      setModalMessage(
        "This date is already reserved. Please choose another date."
      );
      handleShowModal();
      return;
    }

    if (isStart) {
      // Validate start date
      if (selectedEndDate && newDate >= selectedEndDate) {
        setModalTitle("Invalid Start Date");
        setModalMessage("The start date must be earlier than the end date.");
        handleShowModal();
        return;
      }

      // Check if the range between start and end date includes any reserved dates
      if (
        selectedEndDate &&
        reservedDatesList.some(
          (reserved) =>
            new Date(reserved) > newDate && new Date(reserved) < selectedEndDate
        )
      ) {
        setModalTitle("Reserved Date in Period");
        setModalMessage(
          "You can't reserve this period because it includes a reserved date."
        );
        handleShowModal();
        return;
      }

      setSelectedStartedDate(newDate);
      setSelectedDate(newDate); // Update parent component's start date
      toggleDropdown();
    } else {
      // Validate end date
      if (selectedStartedDate && newDate <= selectedStartedDate) {
        setModalTitle("Invalid End Date");
        setModalMessage("The end date must be later than the start date.");
        handleShowModal();
        return;
      }

      // Check if the range between start and end date includes any reserved dates
      if (
        selectedStartedDate &&
        reservedDatesList.some(
          (reserved) =>
            new Date(reserved) > selectedStartedDate &&
            new Date(reserved) < newDate
        )
      ) {
        setModalTitle("Reserved Date in Period");
        setModalMessage(
          "You can't reserve this period because it includes a reserved date."
        );
        handleShowModal();
        return;
      }

      setSelectedEndDate(newDate);
      setEndDate(newDate); // Update parent component's end date
    }
    // If both start and end dates are selected, calculate number of days
    if (selectedStartedDate) {
      const days = calculateNumberOfDays(selectedStartedDate, newDate);
      setNumberOfDaysValue(days);
    }
  };

  return (
    <>
      <div className="date-picker-container">
        {/* Start Date Calendar */}
        <div className="calendar">
          <h3 className="text-center">
            <img src={clock} alt="clock" /> Select Start Date
          </h3>
          <div className="calendar-header">
            <button onClick={handlePrevMonth}>Prev</button>
            <span>
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button onClick={handleNextMonth}>Next</button>
          </div>
          <div className="calendar-days">
            {Array.from({ length: startDay })
              .fill(null)
              .map((_, idx) => (
                <span key={`empty-${idx}`} className="empty-day" />
              ))}
            {Array.from({ length: daysInMonth }, (_, idx) => idx + 1).map(
              (day) => {
                const isSelected = selectedStartedDate?.getDate() === day;
                const isReserved = reservedStartDates.some(
                  (reserved) =>
                    reserved.date ===
                    formatDate(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        day
                      )
                    )
                );

                return (
                  <span
                    key={day}
                    className={`calendar-day ${isSelected ? "selected" : ""} ${
                      isReserved ? "reserved" : ""
                    }`}
                    onClick={() => handleSelectDate(day, true)}
                  >
                    {day}
                  </span>
                );
              }
            )}
          </div>
        </div>

        {/* End Date Calendar */}
        <div className="calendar">
          <h3 className="text-center">
            <img src={clock} alt="clock" /> Select End Date
          </h3>
          <div className="calendar-header">
            <button onClick={handlePrevMonth}>Prev</button>
            <span>
              {currentDate.toLocaleString("default", {
                month: "long",
                year: "numeric",
              })}
            </span>
            <button onClick={handleNextMonth}>Next</button>
          </div>
          <div className="calendar-days">
            {Array.from({ length: startDay })
              .fill(null)
              .map((_, idx) => (
                <span key={`empty-${idx}`} className="empty-day" />
              ))}
            {Array.from({ length: daysInMonth }, (_, idx) => idx + 1).map(
              (day) => {
                const isSelected = selectedEndDate?.getDate() === day;
                const isReserved = reservedStartDates.some(
                  (reserved) =>
                    reserved.date ===
                    formatDate(
                      new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        day
                      )
                    )
                );

                return (
                  <span
                    key={day}
                    className={`calendar-day ${isSelected ? "selected" : ""} ${
                      isReserved ? "reserved" : ""
                    }`}
                    onClick={() => handleSelectDate(day, false)}
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
    </>
  );
}

WeeklyMonthlyCalendar.propTypes = {
  setSelectedDate: PropTypes.string.isRequired,
  setEndDate: PropTypes.string.isRequired,
  toggleDropdown: PropTypes.func.isRequired,
  setNumberOfDaysValue: PropTypes.string.isRequired,
};

export default WeeklyMonthlyCalendar;
