import "../Css/SelectTime.css"; // CSS for styling
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../App";
import PropTypes from 'prop-types';
const SelectTime = ({ isOpen, toggleDropdown}) => {

  const lang = location.pathname.split("/")[1] || "en";
  const navigate = useNavigate();
  const { id } = useParams();
  const [times, setTimes] = useState([]);
const [fulldayState, setFulldayState] = useState(false)

  const gettimes = useCallback(async () => {
    try {
      const res = await axios.get(
        `${API_URL}/RightTimes/getallrighttimes/${lang}/${id}`
      );
      setTimes(res.data.rightTimes);
    } catch (error) {
      console.error("Error fetching top rated services:", error);
    }
  }, [lang]);

  useEffect(() => {
    gettimes();
  }, [lang]);
  const handleTimeSelection = (timeId,fulldayState) => {
    navigate(``, {
      state: {timeId,fulldayState} 
    });
  };
  const reserveTime = async (timeId,nameTime) => {
    if (!timeId) {
      alert("Please choose a time");
      return;
    }

    try {
       await axios.post(
        `${API_URL}/ReservationDates/createreservationdate`,
        {
          chalet_id: id,
          right_time_id: timeId,
        }
      );
      
      setFulldayState(prevState => {
        const newState = nameTime === 'Full day';
        handleTimeSelection(timeId, newState);
        return newState;
      });
      
    
    } catch (error) {
      console.error("Error making reservation:", error);
    }
    toggleDropdown(); // Close the dropdown after reservation
  };
  SelectTime.propTypes = {
    isOpen: PropTypes.string.isRequired, 
    toggleDropdown: PropTypes.func.isRequired,
    price: PropTypes.number.isRequired,
  };

  
  return (
    <div className="dropdown_select_time d-flex justify-content-center align-items-center">
      <button
        className="booknow_button_events  mb-3 "
        onClick={toggleDropdown}
      >
     Choose Time
      </button>
      {/* Show dropdown when isOpen is true */}
      {isOpen && (
        <ul>
          <h5>Choose the right time</h5>
          {times.map((timeReservation) => (
            <li key={timeReservation.id}>
              <Link
               
                className="d-flex align-items-center"
                onClick={() => {
                  reserveTime(timeReservation.id, timeReservation.name);
                }}
              >
                <img
                  src={`https://res.cloudinary.com/durjqlivi/${timeReservation.image}`}
                  alt="morning"
                  className="rounded-circle"
                  height={"50px"}
                  width={"50px"}
                />
                <h6 className="px-3">{timeReservation.name}</h6>
                <h6>{timeReservation.time}</h6>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SelectTime;
