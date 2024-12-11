// Header.js
import { useCallback, useEffect, useState } from "react";
import "../Css/Header.css"; // Assuming you have the CSS saved in Nav.css
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../App";
import { useUser } from "./UserContext.jsx";

const Header = () => {
  const { userId, logout } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const lang = location.pathname.split("/")[1] || "en";
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [headers, setHeaders] = useState([]);
  const [logo, setLogo] = useState([]);

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
  const getheader = useCallback(async () => {
    try {
      const [headerRes, logoRes] = await Promise.all([
        axios.get(`${API_URL}/header/getAllHeaders/${lang}`),
        axios.get(`${API_URL}/logos/getalllogos`),
      ]);
      setHeaders(headerRes.data.headers);
      setLogo(logoRes.data);
    } catch (error) {
      console.error("Error fetching header :", error);
    }
  }, [lang]);

  useEffect(() => {
    getheader();
  }, [lang]);
  const handleAuth = useCallback(async () => {
    if (userId) {
      await logout(); // Call logout from context
    } else {
      navigate(`/${lang}/login`); // Navigate to login page if not logged in
    }
  }, [userId, logout, navigate, lang]);

  return (
    <nav>
      {logo.map((logos) => (
        <div className="logo" key={logos.id}>
          <img
            src={`https://res.cloudinary.com/durjqlivi/${logos.image}`}
            alt="Logo"
          />
        </div>
      ))}

      <div
        className={`hamburger ${isOpen ? "toggle" : ""}`}
        onClick={toggleMenu}
      >
        <div className="line1"></div>
        <div className="line2"></div>
        <div className="line3"></div>
      </div>

      <ul className={`nav-links ${isOpen ? "open" : ""}`} onClick={toggleMenu}>
        {headers.map((header) => (
          <li key={header.id}>
            <Link
              to={header.url === null ? `/${lang}` : `/${lang}/${header.url}`}
            >
              {header.header_name}
            </Link>
          </li>
        ))}
        {userId ? (
          <li>
            <Link to={`/${lang}/cashback`}>{lang === "ar" ? "الرصيد" : "Cashback"}</Link>
          </li>
        ) : null}

        {/* <li><Link to= {`/${lang}`}>{lang ==='ar' ?"الرئيسية": "Home"}</Link></li>
        <li><Link to={`/${lang}/chalets`}>{lang ==='ar' ?"الشاليهات": "Chalets"}</Link></li>
        <li><Link to={`${lang}/events`}>{lang ==='ar' ?"الفعاليات": "Events"}</Link></li>
        <li><Link to={`${lang}/lands`}>{lang ==='ar' ?"الاراضي": "Lands"}</Link></li> */}
        {/* <li><Link to={`${lang}/`}>Contact</Link></li> */}
        <li>
          {/* <Link to={`${lang}/login`}> */}
          <button onClick={handleAuth} className="Login-button">
            {userId
              ? `${lang === "ar" ? "تسجيل خروج" : "Logout"}`
              : `${lang === "ar" ? "تسجيل دخول" : "Login"}`}
          </button>
          {/* </Link> */}
        </li>

        {/* <li><Link to={`${lang}/login`}><button className="Login-button">{lang ==='ar' ?"تسجيل دخول": "Login"}</button></Link></li> */}
        <li>
          {" "}
          <div
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
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
