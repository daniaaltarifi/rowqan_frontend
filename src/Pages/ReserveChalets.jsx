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

const ReserveChalets = () => {
  const { userId } = useUser();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const lang = location.pathname.split("/")[1] || "en";
  const { priceTime, timeId } = location.state || {};
  const typeChalets = location.state?.type || null;
  const [numberOfFamilies, setNumberOfFamilies] = useState(null); // State to store the number of families
const [timeIdDaily,setTimeIdDaily] = useState(null); 
const [timePriceDaily,setTimePriceDaily] = useState(null); 
const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (typeChalets) {
      try {
        const typeData = JSON.parse(typeChalets);
        const familiesCount = typeData["Number of Families"] || null;
        setNumberOfFamilies(familiesCount);
      } catch (error) {
        console.error("Error parsing the type data:", error);
      }
    }
  }, [typeChalets]);

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
  const [isReservationTypeChanged, setIsReservationTypeChanged] = useState(false); // New state

  useEffect(() => {
    window.scrollTo(0, 0);
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
    return totalAmount;
  };
  
  const handleConfirmReservation = async () => {
     if (!selectedDate || !lang || !id ) {
      setError("Please make sure you have selected a Date and Time.");
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    const formattedStartDate = new Date(selectedDate).toLocaleDateString("en-CA");
    const formattedEndDate = new Date(endDate).toLocaleDateString("en-CA");

    const reservationData = {
      start_date: formattedStartDate,
      end_date: typeOfReseravtion === 'Daily' ? null : formattedEndDate,
      lang: lang,
      additional_visitors: additional_visitorsValue,
      number_of_days: number_of_daysValue,
      Reservation_Type: typeOfReseravtion,
      user_id: userId,
      chalet_id: id,
      right_time_id: timeIdDaily || timeId,
    };

    try {
      const res = await axios.post(
        `${API_URL}/ReservationsChalets/createReservationChalet`,
        reservationData
      );

      // setModalTitle("Success");
      // setModalMessage("Reservation confirmed successfully!");
      // setShowModal(true);
      // console.log("end",formattedEndDate)
      const reservation_id = res.data.reservation.id;
      const total_amount = res.data.reservation.total_amount;
      setTimeout(() => navigate(`/${lang}/payment/${reservation_id}?initial_amount=${intial_Amount}&total_amount=${total_amount}`), 2000);
    } catch (error) {
      console.error("Error confirming reservation:", error);
      setModalTitle("Error");
      setModalMessage("Failed to confirm reservation. Please try again later.");
      setShowModal(true);
      setIsLoading(false);

    }
  };
  const toggleDropdown = () => {
    setIsOpen(() => {
      const newIsOpen = true;
      console.log("Dropdown state:", newIsOpen ? "Opened" : "Closed"); // Log the state to debug
      return newIsOpen;
    });
    setError(""); // Reset error on successful selection
  };

  return (
    <>
      <Container className="mt-5">
        <Form.Select
          aria-label="Default select example"
          onChange={handleTypeOfReservationChange}         >
          <option>Select type of reservation</option>
          <option value="Daily">Daily</option>
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
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
          The number of visitors to the chalet reaches {numberOfFamilies}{" "}
          visitors
        </h6>

        {/* {fulldayState && (
          <h6>
            <div className="plus-minus-container">
              <img src={days} alt="info" height={"30px"} width={"30px"} />
              Number Of Days:
              <button
                className="plus-minus-button"
                onClick={() =>
                  updateState(setNumberOfDaysValue, number_of_daysValue, false)
                }
              >
                <LuMinus />
              </button>
              <span className="number_of_daysvalue mx-2">
                {number_of_daysValue}
              </span>
              <button
                className="plus-minus-button"
                onClick={() =>
                  updateState(setNumberOfDaysValue, number_of_daysValue)
                }
              >
                <GoPlus />
              </button>
            </div>
          </h6>
        )} */}

        <h6>
          <div className="plus-minus-container">
            <img src={people} alt="info" height={"30px"} width={"30px"} />
            Number of additional visitors:
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
          <h6 className="ms-2 mt-2">Initial amount: {intial_Amount} JD</h6>
        </div>
        <h6>
          <img src={dollar} alt="info" height={"30px"} width={"30px"} />
          Value of Reservation is: {calculatePrice()} JD
        </h6>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button
          className="booknow_button_events w-100 my-5"
          onClick={handleConfirmReservation}
        >
          {isLoading ? (
    <div className="flex justify-center items-center space-x-2">
      <div className="w-4 h-4 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <span>{lang === 'ar' ? 'جاري التحميل...' : 'Loading...'}</span>
    </div>
  ) : (
    lang === 'ar' ? 'تأكيد الحجز' : 'Confirm Reservation'
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
