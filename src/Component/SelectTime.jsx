import "../Css/SelectTime.css"; // CSS for styling
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../App";
import PropTypes from "prop-types";

const SelectTime = ({ isOpen, toggleDropdown, selectedDate }) => {
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
    return `${year}-${month}-${day}`;  // Format as YYYY-MM-DD
  };

  // Get available times for the selected date
  const getTimes = useCallback(async () => {
    const formattedDate = formatDate(selectedDate);
    if (!formattedDate) return; // Avoid making API call if selectedDate is invalid

    try {
      const res = await axios.get(`${API_URL}/ReservationsChalets/available-times/${id}/${formattedDate}/${lang}`);
      setTimes(res.data);
    } catch (error) {
      console.error("Error fetching available times:", error);
      alert("There was an error fetching the available times. Please try again later.");
    }
  }, [lang, selectedDate, id]);

  useEffect(() => {
    getTimes();
  }, [getTimes]);

  const handleTimeSelection = (timeId, fulldayState,priceTime) => {
    navigate("", {
      state: { timeId, fulldayState,priceTime },
    });
    // localStorage.setItem("priceTime", priceTime);
  };

  const reserveTime = async (timeId, nameTime,priceTime) => {
    if (!timeId) {
      alert("Please choose a time");
      return;
    }

    try {
      // Create reservation
      await axios.post(`${API_URL}/ReservationDates/createreservationdate`, {
        chalet_id: id,
        right_time_id: timeId,
      });

      // Set full day state based on time reservation
      // eslint-disable-next-line no-unused-vars
      setFulldayState((prevState) => {
        const newState = nameTime === "Full day";
        handleTimeSelection(timeId, newState,priceTime);
        
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
    toggleDropdown: PropTypes.func.isRequired,
    selectedDate: PropTypes.instanceOf(Date), // Ensure selectedDate is a Date object
  };

  return (
    <div className="dropdown_select_time d-flex justify-content-center align-items-center">
      <button className="booknow_button_events mb-3" onClick={toggleDropdown}>
        Choose Time
      </button>

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
                    reserveTime(timeReservation.id, timeReservation.name,timeReservation.price);
                  }}
                >
                  <img
                    src={`https://res.cloudinary.com/durjqlivi/${timeReservation.image}`}
                    alt="time"
                    className="rounded-circle"
                    height={"50px"}
                    width={"50px"}
                  />
                  <h6 className="px-3">{timeReservation.name}</h6>
                  <h6>{timeReservation.time}</h6>
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
