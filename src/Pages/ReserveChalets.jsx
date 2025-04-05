import { useEffect, useState } from "react";
import "../Css/Lands.css";
import { Container } from "react-bootstrap";
import info from "../assets/info.png";
import dollar from "../assets/dollars.png";
import money from "../assets/save-money.png";
import people from "../assets/people.jpg";
import { GoPlus } from "react-icons/go";
import { LuMinus } from "react-icons/lu";
import axios from "axios";
import { API_URL } from "../App";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ModelAlert from "../Component/ModelAlert";
import { useUser } from "../Component/UserContext";
import SelectTime from "../Component/SelectTime";
import CalendarChalets from "../Component/CalendarChalets";
import Form from "react-bootstrap/Form";
import WeeklyMonthlyCalendar from "../Component/WeeklyMonthlyCalendar";
import "../Css/Chalets.css";
import "../Css/Events.css";
// Import Globe icon
import { Globe2 } from "lucide-react";
import SocialMediaButtons from "../Component/SocialMediaButtons";

const ReserveChalets = () => {
  const { userId } = useUser();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const lang = location.pathname.split("/")[1] || "en";
  const { priceTime, timeId } = location.state || {};
  const [numberOfFamilies, setNumberOfFamilies] = useState(null); // State to store the number of families
  const [timeIdDaily, setTimeIdDaily] = useState(null);
  const [timePriceDaily, setTimePriceDaily] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Convert the stored value to a number, or use 0 if it's null or not a valid number
  const storedPrice = Number(localStorage.getItem("price")) || 0;
  const intial_Amount = Number(localStorage.getItem("intial_Amount")) || 0;

  const [selectedDate, setSelectedDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [number_of_daysValue, setNumberOfDaysValue] = useState(0);
  const [additional_visitorsValue, setAdditionalVisitorsValue] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [typeOfReseravtion, setTypeOfReservation] = useState("Daily");
  const [isReservationTypeChanged, setIsReservationTypeChanged] =
    useState(false); // New state
  const [lastFinalPrice, setLastFinalPrice] = useState("");

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

  useEffect(() => {
    window.scrollTo(0, 0);
    setNumberOfFamilies(localStorage.getItem("Number of Visitors"));
  }, []);

  // Helper functions
  const updateState = (stateSetter, currentValue, increment = true) => {
    stateSetter(increment ? currentValue + 1 : Math.max(0, currentValue - 1));
  };
  const handleTypeOfReservationChange = (e) => {
    const selectedType = e.target.value;
    setTypeOfReservation(selectedType);
    // Reset related states and mark type as changed
    setNumberOfDaysValue(0);
    setAdditionalVisitorsValue(0);
    setTimePriceDaily(null);
    setIsReservationTypeChanged(true); // Mark reservation type as changed
  };

  const calculatePrice = () => {
    const additionalCost = number_of_daysValue * 20; // 20 JD per day
    const visitorsCost = additional_visitorsValue * 10; // 10 JD per additional visitor
    const priceBerTime = timePriceDaily || priceTime;
    // If the reservation type was recently changed, reset to storedPrice
    if (isReservationTypeChanged) {
      setIsReservationTypeChanged(false); // Reset the flag
      return storedPrice;
    }
    // Use priceBerTime if it exists, otherwise use storedPrice
    const basePrice = priceBerTime ?? storedPrice;

    const totalAmount = basePrice + additionalCost + visitorsCost;
    setLastFinalPrice(totalAmount);
    return totalAmount;
  };
  useEffect(() => {
    calculatePrice();
  }, [
    number_of_daysValue,
    additional_visitorsValue,
    timePriceDaily,
    priceTime,
    storedPrice,
    isReservationTypeChanged,
  ]);
  const handleConfirmReservation = async () => {
    if (!selectedDate || !lang || !id) {
      setError("Please make sure you have selected a Date and Time.");
      setIsLoading(false);
      return;
    }
     // Check for weekly or monthly reservation types
   if ((typeOfReseravtion === "Weekly" || typeOfReseravtion === "Monthly") && !endDate) {
    setError("Please select an End Date for Weekly or Monthly reservations.");
    setIsLoading(false);
    return;
  }
    setIsLoading(true);
    const formattedStartDate = new Date(selectedDate).toLocaleDateString(
      "en-CA"
    );
    const formattedEndDate = new Date(endDate).toLocaleDateString("en-CA");

    const reservationData = {
      start_date: formattedStartDate,
      end_date: typeOfReseravtion === "Daily" ? null : formattedEndDate,
      lang: lang,
      additional_visitors: additional_visitorsValue,
      number_of_days: number_of_daysValue,
      Reservation_Type: typeOfReseravtion,
      user_id: userId,
      chalet_id: id,
      right_time_id: timeIdDaily || timeId,
      total_amount: lastFinalPrice,
      Status:"Pending"

    };

    try {
      const res = await axios.post(
        `${API_URL}/ReservationsChalets/createReservationChalet`,
        reservationData
      );
      const reservation_id = res.data.reservation.id;
      const total_amount = res.data.reservation.total_amount;
     setTimeout(
      () =>
        navigate(
          `/${lang}/payment/${reservation_id}`,
          {
            state: {
              initialAmount: intial_Amount,
              totalAmount: total_amount,
              reservationType: typeOfReseravtion,
              chaletId: id
            }
          }
        ),
      2000
    );
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.error
          ? error.response.data.error
          : "Failed to confirm reservation. Please try again later.";

      setModalTitle("Error");
      setModalMessage(errorMessage);
      setShowModal(true);
      setIsLoading(false);
    }
  };
  const toggleDropdown = () => {
    setIsOpen(() => {
      const newIsOpen = true;
      return newIsOpen;
    });
    setError(""); 
  };

  return (
    <>
    <SocialMediaButtons/>
     
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
      
      <Container className="mt-5">
        <Form.Select
          aria-label="Default select example"
          value={typeOfReseravtion ?? ""}
          onChange={handleTypeOfReservationChange}
        >
          <option>
            {lang === "ar" ? "اختر نوع الحجز" : "Select type of reservation"}
          </option>
          <option value="Daily">{lang === "ar" ? "يومي" : "Daily"}</option>
          <option value="Weekly">{lang === "ar" ? "اسبوعي" : "Weekly"}</option>
          <option value="Monthly">{lang === "ar" ? "شهري" : "Monthly"}</option>
        </Form.Select>
      </Container>
      {typeOfReseravtion === "Daily" ? (
        <CalendarChalets
          setSelectedDate={setSelectedDate}
          setTimeIdDaily={setTimeIdDaily}
          setTimePriceDaily={setTimePriceDaily}
        />
      ) : (
        <WeeklyMonthlyCalendar
          setEndDate={setEndDate}
          setSelectedDate={setSelectedDate}
          toggleDropdown={toggleDropdown}
          setNumberOfDaysValue={setNumberOfDaysValue}
        />
      )}
      <SelectTime
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        toggleDropdown={toggleDropdown}
        selectedDate={selectedDate}
      />
      <Container className="mt-5">
        <h6 className="py-2">
          <img src={info} alt="info" height={"30px"} width={"30px"} />

          {lang === "ar"
            ? ` عدد الزائرين لهذا الشاليه ${numberOfFamilies} زوار `
            : ` The number of visitors to the chalet reaches ${numberOfFamilies} visitors`}
        </h6>

        <h6>
          <div className="plus-minus-container">
            <img src={people} alt="info" height={"30px"} width={"30px"} />
            {lang === "ar"
              ? " عدد الزوار الاضافيين "
              : "Number of additional visitors:"}
            <button
              className="plus-minus-button"
              onClick={() =>
                updateState(
                  setAdditionalVisitorsValue,
                  additional_visitorsValue,
                  false
                )
              }
            >
              <LuMinus />
            </button>
            <span className="number_of_daysvalue mx-2">
              {additional_visitorsValue}
            </span>
            <button
              className="plus-minus-button"
              onClick={() =>
                updateState(
                  setAdditionalVisitorsValue,
                  additional_visitorsValue
                )
              }
            >
              <GoPlus />
            </button>
          </div>
        </h6>
        <div className="d-flex mb-3">
          <img src={money} alt="info" height={"30px"} width={"30px"} />
          <h6 className="ms-2 mt-2">
            {lang === "ar" ? "المبلغ الاولي :" : "Initial amount:"}{" "}
            {intial_Amount} JD
          </h6>
        </div>
        <h6>
          <img src={dollar} alt="info" height={"30px"} width={"30px"} />
          {lang === "ar" ? "قيمة الحجز هي : " : "Value of Reservation is:"}{" "}
          {lastFinalPrice} JD
        </h6>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          className="booknow_button_events w-100 my-5"
          onClick={handleConfirmReservation}
        >
          {isLoading ? (
            <div className="flex justify-center items-center space-x-2">
              <div className="w-4 h-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span>{lang === "ar" ? "جاري التحميل..." : "Loading..."}</span>
            </div>
          ) : lang === "ar" ? (
            "تأكيد الحجز"
          ) : (
            "Confirm Reservation"
          )}
        </button>

        <ModelAlert
          show={showModal}
          handleClose={() => setShowModal(false)}
          title={modalTitle}
          message={modalMessage}
        />
      </Container>
    </>
  );
};

export default ReserveChalets;