import "../Css/SelectTime.css"; // CSS for styling
import morning from "../assets/morning.png";
import evening from "../assets/evening.png";
import fullday from "../assets/fullday.png";
import { Link } from "react-router-dom";
const SelectTime = ({ isOpen, toggleDropdown }) => {
  const lang = location.pathname.split("/")[1] || "en";

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
          <li>
            <Link to={`/${lang}/reservechalet/${"1"}`} className="d-flex align-items-center ">
              <img src={morning} alt="morning" height={"50px"} width={"50px"} />
              <h6 className="px-3">Mornning</h6>
              <h6>Enterrance: 10.00 - Exit: 21.00</h6>{" "}
            </Link>
          </li>
          <li>
          <Link to={`/${lang}/reservechalet/${"1"}`} className="d-flex align-items-center ">
          <img src={evening} alt="morning" height={"50px"} width={"50px"} />
              <h6 className="px-3">Evenning</h6>
              <h6>Enterrance:  22.00  -   Exit: 9.00</h6>{" "}
            </Link>          </li>
          <li>
          <Link to={`/${lang}/reservechalet/${"1"}`} className="d-flex align-items-center ">
          <img src={fullday} alt="morning" height={"50px"} width={"50px"} />
              <h6 className="px-3">Full day</h6>
              <h6>Enterrance:  10.00  -   Exit: 10.00</h6>{" "}
            </Link>          </li>
       
        </ul>
      )}
    </div>
  );
};

export default SelectTime;
