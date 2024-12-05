import  { useState, useEffect } from 'react';
import '../Css/Lands.css';

const BookingLand = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const lang = location.pathname.split("/")[1] || "en";

  // Get the current month's first day and number of days
  const getDaysInMonth = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDay = firstDay.getDay(); // day of week of the 1st of the month
    return { daysInMonth, startDay };
  };

  const handleSelectDate = (day) => {
    setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
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

  const { daysInMonth, startDay } = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());

  useEffect(() => {
    // Re-render when the currentDate changes
  }, [currentDate]);
  const times = [
    "1:00", "2:00", "3:00", "4:00", "5:00", "6:00", "7:00", "8:00", "9:00",
    "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", 
    "18:00", "19:00", "20:00", "21:00", "22:00", "23:00", "24:00"
  ];

  const [selectedTime, setSelectedTime] = useState(times[0]); // Default to 1:00

  const handleChange = (event) => {
    setSelectedTime(event.target.value);
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
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
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
          {Array(startDay).fill(null).map((_, index) => (
            <span key={index} className="empty-day"></span>
          ))}
          {/* Render actual days */}
          {Array.from({ length: daysInMonth }, (_, index) => index + 1).map(day => (
            <span
              key={day}
              className={`calendar-day ${selectedDate?.getDate() === day ? 'selected' : ''}`}
              onClick={() => handleSelectDate(day)}
            >
              {day}
            </span>
          ))}
        </div>
      </div>
    </div>
    {/* TIME PICKER */}
    <div className="time-picker-container">
      <label htmlFor="time-picker" className="time-picker-label">
        {lang==='ar'?"اختر الوقت":"Select Time"}
      </label>
      <div className="custom-time-picker">
        <select
          id="time-picker"
          value={selectedTime}
          onChange={handleChange}
          className="custom-select"
        >
          {times.map((time) => (
            <option key={time} value={time}>
              {time}
            </option>
          ))}
        </select>
      </div>
      <p>        {lang==='ar'?"الوقت المحدد":"Selected Time"}
      {selectedTime}</p>
    </div>
    </>

  );
};

export default BookingLand;
