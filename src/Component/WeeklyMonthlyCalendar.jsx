import { useCallback, useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import axios from "axios";
import ModelAlert from "./ModelAlert";
import { API_URL } from "../App";
import clock from "../assets/clock.png";
import { Globe2 } from "lucide-react";

function WeeklyMonthlyCalendar({
  setSelectedDate,
  setEndDate,
  toggleDropdown,
  setNumberOfDaysValue
}) {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const lang = location.pathname.split("/")[1] || "en";

  const [currentDate, setCurrentDate] = useState(new Date());
  const [reservedStartDates, setReservedStartDates] = useState([]);
  const [selectedStartedDate, setSelectedStartedDate] = useState(null);
  const [selectedEndDate, setSelectedEndDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  // Format numbers for Arabic locale
  const formatNumber = (number) => {
    if (lang === "ar") {
      return number.toString().replace(/\d/g, (d) => {
        return ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'][d];
      });
    }
    return number;
  };
  
  // Toggle language function
  const toggleLanguage = () => {
    const newLang = lang === "ar" ? "en" : "ar";
    const currentPath = location.pathname.split('/').slice(2).join('/');
    navigate(`/${newLang}${currentPath ? '/' + currentPath : ''}`);
  };

  // Format date as YYYY-MM-DD
  const formatDate = (date) => {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
  };

  // Fetch reserved dates
  const fetchReservedDates = useCallback(async () => {
    setLoading(true);
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
      console.error(`Error fetching reserved dates:`, error);
    } finally {
      setLoading(false);
    }
  }, [id, lang]);

  useEffect(() => {
    fetchReservedDates();
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
    const formattedDate = formatDate(newDate);

    const reservedDatesList = reservedStartDates.map(
      (reserved) => reserved.date
    );

    // Check if the selected date is reserved
    const isReserved = reservedDatesList.includes(formattedDate);
    if (isReserved) {
      setModalTitle(lang === "ar" ? "هذا التاريخ محجوز" : "This Date is Reserved");
      setModalMessage(
        lang === "ar"
          ? "هذا التاريخ محجوز بالفعل. الرجاء اختيار تاريخ آخر."
          : "This date is already reserved. Please choose another date."
      );
      handleShowModal();
      return;
    }

    if (isStart) {
      // Validate start date
      if (selectedEndDate && newDate >= selectedEndDate) {
        setModalTitle(lang === "ar" ? "تاريخ بداية غير صالح" : "Invalid Start Date");
        setModalMessage(
          lang === "ar"
            ? "يجب أن يكون تاريخ البداية قبل تاريخ النهاية."
            : "The start date must be earlier than the end date."
        );
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
        setModalTitle(lang === "ar" ? "تاريخ محجوز في الفترة" : "Reserved Date in Period");
        setModalMessage(
          lang === "ar"
            ? "لا يمكنك حجز هذه الفترة لأنها تتضمن تاريخاً محجوزاً."
            : "You can't reserve this period because it includes a reserved date."
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
        setModalTitle(lang === "ar" ? "تاريخ نهاية غير صالح" : "Invalid End Date");
        setModalMessage(
          lang === "ar"
            ? "يجب أن يكون تاريخ النهاية بعد تاريخ البداية."
            : "The end date must be later than the start date."
        );
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
        setModalTitle(lang === "ar" ? "تاريخ محجوز في الفترة" : "Reserved Date in Period");
        setModalMessage(
          lang === "ar"
            ? "لا يمكنك حجز هذه الفترة لأنها تتضمن تاريخاً محجوزاً."
            : "You can't reserve this period because it includes a reserved date."
        );
        handleShowModal();
        return;
      }

      setSelectedEndDate(newDate);
      setEndDate(newDate); // Update parent component's end date
    }
    // If both start and end dates are selected, calculate number of days
    if (selectedStartedDate && !isStart) {
      const days = calculateNumberOfDays(selectedStartedDate, newDate);
      setNumberOfDaysValue(days);
    }
  };

  // Get localized day names
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
        style={{
          position: "absolute",
          top: "20px",
          right: lang === "ar" ? "auto" : "20px",
          left: lang === "ar" ? "20px" : "auto",
          zIndex: 1000,
        }}
      >
        <button
          onClick={toggleLanguage}
          style={{
            backgroundColor: "white",
            border: "1px solid #ddd",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            borderRadius: "50%",
            padding: "8px",
            cursor: "pointer",
            transition: "transform 0.3s ease",
          }}
          onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.1)"}
          onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
        >
          <Globe2 style={{ width: "24px", height: "24px" }} />
        </button>
      </div>

      <div 
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "10px",
          direction: lang === "ar" ? "rtl" : "ltr",
        }}
      >
        {loading ? (
          <p style={{ color: "#fff", fontSize: "18px", width: "100%", textAlign: "center" }}>
            {lang === "ar" ? "جاري التحميل..." : "Loading..."}
          </p>
        ) : (
          <>
            {/* Start Date Calendar */}
            <div 
              style={{
                width: "350px",
                borderRadius: "10px",
                padding: "15px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                margin: "10px 0",
                background: "linear-gradient(180deg, #6da6ba 0%, rgba(109, 166, 186, 0.9) 100%)",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ marginBottom: "15px", textAlign: "center" }}>
                <h4 style={{ color: "#fff", margin: "0 0 8px 0", fontSize: "18px", fontWeight: "600" }}>
                  <img 
                    src={clock} 
                    alt="clock" 
                    style={{ 
                      verticalAlign: "middle", 
                      marginRight: lang === "ar" ? "0" : "8px",
                      marginLeft: lang === "ar" ? "8px" : "0",
                      height: "30px", 
                      width: "35px" 
                    }} 
                  />{" "}
                  {lang === "ar" ? "حدد تاريخ البدء" : "Select Start Date"}
                </h4>
              </div>
              <div 
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <button 
                  onClick={handlePrevMonth}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    border: "none",
                    borderRadius: "5px",
                    color: "#fff",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"}
                >
                  {lang === "ar" ? "السابق" : "Prev"}
                </button>
                <span 
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#fff",
                  }}
                >
                  {currentDate.toLocaleString(lang === "ar" ? "ar-SA" : "default", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button 
                  onClick={handleNextMonth}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    border: "none",
                    borderRadius: "5px",
                    color: "#fff",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"}
                >
                  {lang === "ar" ? "التالي" : "Next"}
                </button>
              </div>
              <div 
                style={{ 
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  textAlign: "center",
                  marginBottom: "10px",
                }}
              >
                {dayNames.map((day, index) => (
                  <span 
                    key={index}
                    style={{
                      color: "#fff",
                      fontSize: "14px",
                      padding: "5px 0",
                      fontWeight: "500",
                    }}
                  >
                    {day}
                  </span>
                ))}
              </div>
              <div 
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "5px",
                }}
              >
                {Array(startDay)
                  .fill(null)
                  .map((_, index) => (
                    <span key={`empty-start-${index}`} style={{ display: "block", height: "32px" }}></span>
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
                  const currentFormattedDate = formatDate(currentDay);

                  const isReserved = reservedStartDates.some(
                    (reserved) => reserved.date === currentFormattedDate
                  );

                  const isSelected =
                    selectedStartedDate?.getDate() === day &&
                    selectedStartedDate?.getMonth() === currentDate.getMonth() &&
                    selectedStartedDate?.getFullYear() === currentDate.getFullYear();

                  return (
                    <div
                      key={`start-${day}`}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        position: "relative",
                        padding: "2px",
                      }}
                    >
                      <span
                        onClick={() => !isReserved && handleSelectDate(day, true)}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          cursor: isReserved ? "not-allowed" : "pointer",
                          backgroundColor: isReserved 
                            ? "rgba(255, 0, 0, 0.3)" 
                            : isSelected 
                              ? "rgba(242, 199, 157, 0.7)" 
                              : "rgba(255, 255, 255, 0.1)",
                          color: "#fff",
                          fontSize: "14px",
                          fontWeight: isSelected ? "bold" : "normal",
                          transition: "all 0.2s ease",
                        }}
                        onMouseOver={(e) => {
                          if (!isReserved) {
                            e.currentTarget.style.backgroundColor = "rgba(242, 199, 157, 0.5)";
                            e.currentTarget.style.transform = "scale(1.1)";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!isReserved) {
                            e.currentTarget.style.backgroundColor = isSelected 
                              ? "rgba(242, 199, 157, 0.7)" 
                              : "rgba(255, 255, 255, 0.1)";
                            e.currentTarget.style.transform = "scale(1)";
                          }
                        }}
                      >
                        {formatNumber(day)}
                      </span>
                      {isReserved && (
                        <span
                          style={{
                            fontSize: "10px",
                            color: "#ff6666",
                            marginTop: "2px",
                            fontWeight: "500",
                          }}
                        >
                          {lang === "ar" ? "محجوز" : "Reserved"}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* End Date Calendar */}
            <div 
              style={{
                width: "350px",
                borderRadius: "10px",
                padding: "15px",
                boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                margin: "10px 0",
                background: "linear-gradient(180deg, #6da6ba 0%, rgba(109, 166, 186, 0.9) 100%)",
                transition: "transform 0.3s ease",
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = "translateY(-5px)"}
              onMouseOut={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ marginBottom: "15px", textAlign: "center" }}>
                <h4 style={{ color: "#fff", margin: "0 0 8px 0", fontSize: "18px", fontWeight: "600" }}>
                  <img 
                    src={clock} 
                    alt="clock" 
                    style={{ 
                      verticalAlign: "middle", 
                      marginRight: lang === "ar" ? "0" : "8px",
                      marginLeft: lang === "ar" ? "8px" : "0",
                      height: "30px", 
                      width: "35px" 
                    }} 
                  />{" "}
                  {lang === "ar" ? "حدد تاريخ الانتهاء" : "Select End Date"}
                </h4>
              </div>
              <div 
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "15px",
                }}
              >
                <button 
                  onClick={handlePrevMonth}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    border: "none",
                    borderRadius: "5px",
                    color: "#fff",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"}
                >
                  {lang === "ar" ? "السابق" : "Prev"}
                </button>
                <span 
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#fff",
                  }}
                >
                  {currentDate.toLocaleString(lang === "ar" ? "ar-SA" : "default", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button 
                  onClick={handleNextMonth}
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    border: "none",
                    borderRadius: "5px",
                    color: "#fff",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                  }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)"}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)"}
                >
                  {lang === "ar" ? "التالي" : "Next"}
                </button>
              </div>
              <div 
                style={{ 
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  textAlign: "center",
                  marginBottom: "10px",
                }}
              >
                {dayNames.map((day, index) => (
                  <span 
                    key={index}
                    style={{
                      color: "#fff",
                      fontSize: "14px",
                      padding: "5px 0",
                      fontWeight: "500",
                    }}
                  >
                    {day}
                  </span>
                ))}
              </div>
              <div 
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "5px",
                }}
              >
                {Array(startDay)
                  .fill(null)
                  .map((_, index) => (
                    <span key={`empty-end-${index}`} style={{ display: "block", height: "32px" }}></span>
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
                  const currentFormattedDate = formatDate(currentDay);

                  const isReserved = reservedStartDates.some(
                    (reserved) => reserved.date === currentFormattedDate
                  );

                  const isSelected =
                    selectedEndDate?.getDate() === day &&
                    selectedEndDate?.getMonth() === currentDate.getMonth() &&
                    selectedEndDate?.getFullYear() === currentDate.getFullYear();

                  return (
                    <div
                      key={`end-${day}`}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        position: "relative",
                        padding: "2px",
                      }}
                    >
                      <span
                        onClick={() => !isReserved && handleSelectDate(day, false)}
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          cursor: isReserved ? "not-allowed" : "pointer",
                          backgroundColor: isReserved 
                            ? "rgba(255, 0, 0, 0.3)" 
                            : isSelected 
                              ? "rgba(242, 199, 157, 0.7)" 
                              : "rgba(255, 255, 255, 0.1)",
                          color: "#fff",
                          fontSize: "14px",
                          fontWeight: isSelected ? "bold" : "normal",
                          transition: "all 0.2s ease",
                        }}
                        onMouseOver={(e) => {
                          if (!isReserved) {
                            e.currentTarget.style.backgroundColor = "rgba(242, 199, 157, 0.5)";
                            e.currentTarget.style.transform = "scale(1.1)";
                          }
                        }}
                        onMouseOut={(e) => {
                          if (!isReserved) {
                            e.currentTarget.style.backgroundColor = isSelected 
                              ? "rgba(242, 199, 157, 0.7)" 
                              : "rgba(255, 255, 255, 0.1)";
                            e.currentTarget.style.transform = "scale(1)";
                          }
                        }}
                      >
                        {formatNumber(day)}
                      </span>
                      {isReserved && (
                        <span
                          style={{
                            fontSize: "10px",
                            color: "#ff6666",
                            marginTop: "2px",
                            fontWeight: "500",
                          }}
                        >
                          {lang === "ar" ? "محجوز" : "Reserved"}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
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
  setSelectedDate: PropTypes.func.isRequired,
  setEndDate: PropTypes.func.isRequired,
  toggleDropdown: PropTypes.func.isRequired,
  setNumberOfDaysValue: PropTypes.func.isRequired,
};

export default WeeklyMonthlyCalendar;