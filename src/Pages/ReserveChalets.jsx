import { useState, useEffect } from "react";
import "../Css/Lands.css";
import { Container } from "react-bootstrap";
import info from "../assets/info.png";
import days from "../assets/days.png";
import dollar from "../assets/dollar.png";
import people from "../assets/people.jpg";
import { GoPlus } from "react-icons/go";
import { LuMinus } from "react-icons/lu";
const ReserveChalets = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [value, setValue] = useState(0); // State to hold the value

  const increment = () => setValue(value + 1);
  const decrement = () => setValue(value - 1);
  // Get the current month's first day and number of days
  const getDaysInMonth = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay(); // day of week of the 1st of the month
    return { daysInMonth, startDay };
  };

  const handleSelectDate = (day) => {
    setSelectedDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    );
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

  const { daysInMonth, startDay } = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  useEffect(() => {
    // Re-render when the currentDate changes
  }, [currentDate]);

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
              (day) => (
                <span
                  key={day}
                  className={`calendar-day ${
                    selectedDate?.getDate() === day ? "selected" : ""
                  }`}
                  onClick={() => handleSelectDate(day)}
                >
                  {day}
                </span>
              )
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
            <button className="plus-minus-button" onClick={decrement}>
              <GoPlus />{" "}
            </button>
            <span className="value">{value}</span>
            <button className="plus-minus-button" onClick={increment}>
              <LuMinus />{" "}
            </button>
          </div>
        </h6>
        <h6>
        <div className="plus-minus-container">
            <img src={people} alt="info" height={"30px"} width={"30px"} />
            Number of additional visitors: 
            <button className="plus-minus-button" onClick={decrement}>
              <GoPlus />{" "}
            </button>
            <span className="value">{value}</span>
            <button className="plus-minus-button" onClick={increment}>
              <LuMinus />{" "}
            </button>
          </div>
        </h6>
        <h6>
          <img src={dollar} alt="info" height={"30px"} width={"30px"} />
          Value of Reservation is : $225
        </h6>
        <button className="booknow_button_events w-100 my-5 ">Confirm reservation</button>
      </Container>
    </>
  );
};

export default ReserveChalets;
