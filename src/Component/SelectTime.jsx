import "../Css/SelectTime.css"; // CSS for styling
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../App";
import PropTypes from "prop-types";
import clock from "../assets/clock.png";

const SelectTime = ({ isOpen, setIsOpen, toggleDropdown, selectedDate }) => {
  const lang = location.pathname.split("/")[1] || "en";
  const navigate = useNavigate();
  const { id } = useParams();

  const [times, setTimes] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [fulldayState, setFulldayState] = useState(false);

  // Improved date formatting function
  const formatDate = (date) => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, "0"); // Month is 0-indexed
    const day = d.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`; // Format as YYYY-MM-DD
  };

  // Get available times for the selected date
  const getTimes = useCallback(async () => {
    const formattedDate = formatDate(selectedDate);
    if (!formattedDate) return; // Avoid making API call if selectedDate is invalid

    try {
      const res = await axios.get(
        `${API_URL}/RightTimes/getallrighttimesbyChaletId/${id}/${lang}`
      );
      setTimes(res.data);
    } catch (error) {
      console.error("Error fetching available times:", error);
      // alert("There was an error fetching the available times. Please try again later.");
    }
  }, [lang, selectedDate, id]);

  useEffect(() => {
    getTimes();
  }, [getTimes]);

  const handleTimeSelection = (timeId, fulldayState, priceTime) => {
    navigate("", {
      state: { timeId, fulldayState, priceTime },
    });
    setIsOpen(false);
    // localStorage.setItem("priceTime", priceTime);
  };

  const reserveTime = async (timeId, nameTime, priceTime) => {
    if (!timeId) {
      alert("Please choose a time");
      return;
    }

    try {
      // eslint-disable-next-line no-unused-vars
      setFulldayState((prevState) => {
        const newState = nameTime === "FullDay";
        handleTimeSelection(timeId, newState, priceTime);
        return newState;
      });

      toggleDropdown(); // Close the dropdown after reservation
    } catch (error) {
      console.error("Error making reservation:", error);
      alert("There was an error reserving the time. Please try again later.");
    }
  };

  // PropTypes definition to ensure the correct data types
  SelectTime.propTypes = {
    isOpen: PropTypes.bool.isRequired, // Fix to bool type as per usage
    setIsOpen: PropTypes.bool.isRequired, // Fix to bool type as per usage
    toggleDropdown: PropTypes.func.isRequired,
    selectedDate: PropTypes.instanceOf(Date), // Ensure selectedDate is a Date object
  };

  return (
    <div className="dropdown_select_time d-flex justify-content-center align-items-center">
      {/* Show dropdown when isOpen is true */}
      {isOpen && (
        <ul>
          <h5>Choose the right time</h5>
          {times.length === 0 ? (
            <p>No available times for this date.</p> // If no times are available, show a message
          ) : (
            times.map((timeReservation) => (
              <li key={timeReservation.id}>
                <Link
                  className="d-flex align-items-center"
                  onClick={() => {
                    reserveTime(
                      timeReservation.id,
                      timeReservation.type_of_time,
                      timeReservation.After_Offer > 0
                        ? timeReservation.After_Offer
                        : timeReservation.price
                    );
                  }}
                >
                  <img
                    src={clock}
                    alt="time"
                    className="rounded-circle"
                    height={"40px"}
                    width={"40px"}
                  />
                  <h6 className="px-3">{timeReservation.type_of_time}</h6>
                  <h6>
                    {" "}
                    {timeReservation.from_time} - {timeReservation.to_time}
                  </h6>
                </Link>
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

export default SelectTime;
