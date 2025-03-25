import { useCallback, useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import ModelAlert from "./ModelAlert";
import axios from "axios";
import { API_URL } from "../App";
import PropTypes from "prop-types";
import clock from "../assets/clock.png";
// Import Globe icon
import { Globe2 } from "lucide-react";

function CalendarChalets({
  setSelectedDate,
  setTimeIdDaily,
  setTimePriceDaily,
}) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
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
  
  // Function to toggle language
  const toggleLanguage = () => {
    const newLang = lang === "ar" ? "en" : "ar";
    
    // Get the current path without the language part
    const pathParts = location.pathname.split("/");
    pathParts[1] = newLang;
    const newPath = pathParts.join("/");
    
    // Navigate to the same page but with the new language
    navigate(newPath, { 
      state: location.state // Preserve the state when changing language
    });
  };

  const handleSelectDate = (day, time_id, priceForDaily) => {
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

    // Find the time object by ID
    const timeObject = rightTimes.find((time) => time.id === time_id);
    // Check if the selected date is reserved
    const isReserved = reservedDates.some(
      (reservedDate) =>
        reservedDate.date === selectedFormattedDate &&
        (reservedDate.time === timeObject?.type_of_time ||
          reservedDate.time === "FullDay")
    );

    if (isReserved) {
      setModalTitle(lang === "ar" ? "هذا التاريخ محجوز" : "This Date is Reserved");
      setModalMessage(
        lang === "ar" 
          ? "هذا التاريخ محجوز بالفعل. يرجى اختيار تاريخ آخر."
          : "This date is already reserved. Please choose another date."
      );
      handleShowModal();
      return;
    }

    // Proceed with the rest of your logic
    const dateInRightTimes = timeObject?.DatesForRightTimes.find(
      (dateObj) => dateObj.date === selectedFormattedDate
    );

    const finalPrice = dateInRightTimes
      ? dateInRightTimes.price
      : priceForDaily;

    setSelectedDateAndTime({ [time_id]: newDate });
    setSelectedDate(newDate);
    setTimeIdDaily(time_id);
    setTimePriceDaily(finalPrice);
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
    setSelectedDate: PropTypes.func.isRequired, // Ensure selectedDate is a Date object
    setTimeIdDaily: PropTypes.func.isRequired,
    setTimePriceDaily: PropTypes.func.isRequired,
  };
  
  const getTimesBychaletsId = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${API_URL}/RightTimes/getallrighttimesbyChaletId/${id}/${lang}`
      );
      setRightTimes(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching available times:", error);
      alert(
        lang === "ar"
          ? "حدث خطأ في جلب الأوقات المتاحة. يرجى المحاولة مرة أخرى لاحقًا."
          : "There was an error fetching the available times. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  }, [lang, id]);

  useEffect(() => {
    getTimesBychaletsId();
  }, [getTimesBychaletsId, id, lang]);
  
  useEffect(() => {
    fetch(
      `http://localhost:5000/ReservationsChalets/reservationsDatesByChaletId/${id}/${lang}`
    )
      .then((response) => response.json())
      .then((data) => {
        const formattedReservations = data.reservations.map((res) => ({
          date: res.start_date, // Keep the date
          time: res.Time, // Store the time slot
          status: res.status,
        }));
        setReservedDates(formattedReservations);
      })
      .catch((error) => console.error("Error fetching reservations:", error));
  }, [id, lang]);

  // Get translated day names
  const getDayNames = () => {
    if (lang === "ar") {
      return ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    } else {
      return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    }
  };

  const dayNames = getDayNames();

  return (
    <>
      {/* Language Switcher Button */}
      <div
        className="language-toggle-container"
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={toggleLanguage}
          className="btn btn-light rounded-circle p-2"
          style={{
            backgroundColor: "white",
            border: "1px solid #ddd",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Globe2 className="w-6 h-6" />
        </button>
      </div>

      <div className="date-picker-container">
        {loading ? (
          <p>{lang === "ar" ? "جاري التحميل..." : "Loading..."}</p>
        ) : rightTimes.length > 0 ? (
          rightTimes.map((time) => (
            <div className="calendar" key={time.id}>
              <h4 className="text-center" style={{ color: "#fff" }}>
                <img src={clock} alt="clock" height={"30px"} width={"35px"} />{" "}
                {lang === "ar" ? "تواريخ " + time.type_of_time : time.type_of_time + " Dates"}
              </h4>
              <h5 className="text-center" style={{ color: "#fff" }}>
                {time.from_time} - {time.to_time}
              </h5>
              <div className="calendar-header">
                <button className="prev-month" onClick={handlePrevMonth}>
                  {lang === "ar" ? "السابق" : "Prev"}
                </button>
                <span className="month">
                  {currentDate.toLocaleString(lang === "ar" ? "ar-SA" : "default", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button className="next-month" onClick={handleNextMonth}>
                  {lang === "ar" ? "التالي" : "Next"}
                </button>
              </div>
              <div className="days-of-week" style={{ direction: lang === "ar" ? "rtl" : "ltr" }}>
                {dayNames.map((day, index) => (
                  <span key={index}>{day}</span>
                ))}
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

                 
                  const reservedData = reservedDates.find(
                    (reserved) =>
                      reserved.date === currentFormattedDate &&
                      reserved.time === time.type_of_time
                  );

                  const isPending = reservedData?.status === "Pending";
                  const isConfirmed = reservedData?.status === "Confirmed";

                  const isSelected =
                    selectedDateAndTime[time.id]?.getDate() === day &&
                    selectedDateAndTime[time.id]?.getMonth() ===
                      currentDate.getMonth() &&
                    selectedDateAndTime[time.id]?.getFullYear() ===
                      currentDate.getFullYear();

                  return (
                    <div
                      key={day}
                      className="calendar-day-container"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        position: "relative",
                      }}
                    >
                      <span
                        className={`calendar-day 
          ${isSelected ? "selected" : ""} 
          ${isPending ? "pending" : ""} 
          ${isConfirmed ? "reserved" : ""}`}
                        onClick={() =>
                          isPending || isConfirmed
                            ? null
                            : handleSelectDate(
                                day,
                                time.id,
                                time.After_Offer > 0
                                  ? time.After_Offer
                                  : time.price
                              )
                        }
                      >
                        {day}
                      </span>
                      {(isPending || isConfirmed) && (
                        <span
                          className="status-text"
                          style={{
                            fontSize: "0.7rem",
                            color: isPending ? "yellow" : "red",
                            marginTop: "2px",
                          }}
                        >
                          {lang === "ar" 
                            ? (reservedData?.status === "Pending" ? "قيد الانتظار" : "مؤكد") 
                            : reservedData?.status}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <p>{lang === "ar" ? "لا توجد أوقات متاحة..." : "No Times Available..."}</p>
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