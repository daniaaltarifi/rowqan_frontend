// Header.js
import  { useState } from "react";
import '../Css/Header.css'; // Assuming you have the CSS saved in Nav.css
import { Link } from "react-router-dom";
import logo from '../assets/logo.png';
import { useNavigate } from "react-router-dom";
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate()
  const lang = location.pathname.split("/")[1] || "en";
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };
  const handleSelection = (event) => {
    const newLang = event.target.value;
    setSelectedOption(newLang);
    setDropdownVisible(false);
    navigate(`/${newLang}`);
  };
  return (
    <nav>
      <div className="logo">
        <img src={logo} alt="Logo" />
      </div>

      <div className={`hamburger ${isOpen ? 'toggle' : ''}`} onClick={toggleMenu}>
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
      </div>

      <ul className={`nav-links ${isOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <li><Link to= "/">{lang ==='ar' ?"الرئيسية": "Home"}</Link></li>
        <li><Link to={`/${lang}/chalets`}>{lang ==='ar' ?"الشاليهات": "Chalets"}</Link></li>
        <li><Link to={`${lang}/events`}>{lang ==='ar' ?"الفعاليات": "Events"}</Link></li>
        <li><Link to={`${lang}/lands`}>{lang ==='ar' ?"الاراضي": "Lands"}</Link></li>
        {/* <li><Link to={`${lang}/`}>Contact</Link></li> */}
        <li><Link to={`${lang}/login`}><button className="Login-button">{lang ==='ar' ?"تسجيل دخول": "Login"}</button></Link></li>
        <li> <div
            className="dropdown-container border-none"
            onClick={toggleDropdown}
          >
            <div className="dropdown-wrapper">
              <select
                className="form-select small-select"
                value={selectedOption}
                onChange={handleSelection}
              >
                <option value="en">en</option>
                <option value="ar">ar</option>
              </select>
            </div>
          </div></li>
      </ul>
    </nav>
  );
};

export default Header;
