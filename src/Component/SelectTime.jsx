import "../Css/SelectTime.css"; // CSS for styling
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../App";
const SelectTime = ({ isOpen, toggleDropdown ,price}) => {

  const lang = location.pathname.split("/")[1] || "en";
  const navigate = useNavigate();
  const { id } = useParams();
  const [times, setTimes] = useState([]);
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
  const handleTimeSelection = (timeId) => {
    navigate(`/${lang}/reservechalet/${id}`, {
      state: {timeId,price} 
    });
  };
  const reserveTime = async (timeId) => {
    if (!timeId) {
      alert("Please choose a time");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/ReservationDates/createreservationdate`,
        {
          chalet_id: id,
          right_time_id: timeId,
        }
      );
      handleTimeSelection(timeId)
    
    } catch (error) {
      console.error("Error making reservation:", error);
    }
    toggleDropdown(); // Close the dropdown after reservation
  };

  return (
    <div className="dropdown_select_time">
      <button
        className="booknow_button_events w-100 mb-3 "
        onClick={toggleDropdown}
      >
        Book Now
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
                  reserveTime(timeReservation.id);
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
