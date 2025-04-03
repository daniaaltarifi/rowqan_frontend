import { useCallback, useEffect, useState } from "react";
import "../Css/Header.css";
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
  const [headers, setHeaders] = useState([]);
  const [logo, setLogo] = useState([]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const getheader = useCallback(async () => {
    try {
      const [headerRes, logoRes] = await Promise.all([
        axios.get(`${API_URL}/header/getAllHeaders?lang=${lang}`),
        axios.get(`${API_URL}/logos/getalllogos`)
      ]);
      setHeaders(headerRes.data);
      setLogo(logoRes.data);
      console.log("Headers data:", headerRes.data);
    } catch (error) {
      console.error("Error fetching header :", error);
    }
  }, [lang]);

  useEffect(() => {
    getheader();
    console.log("headers data:", headers);
  }, [lang]);

  const handleAuth = useCallback(async () => {
    if (userId) {
      await logout();
    } else {
      navigate(`/${lang}/login`);
    }
  }, [userId, logout, navigate, lang]);

  return (
    <nav className={`nav`}>
      {logo.map((logos) => (
        <div className={`logo ${lang === "ar" ? "ltr" : ""}`} key={logos.id}>
          <Link to={`/${lang}`}>
            <img
              src={`https://res.cloudinary.com/dqimsdiht/${logos.image}`}
              alt="Logo"
            />
          </Link>
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
              to={
                header.header_name.toLowerCase() === "home"
                  ? `/${lang}`
                  : `/${lang}/${header.header_name}`
              }
            >
              {header.header_name}
            </Link>
          </li>
        ))}
        {userId && (
          <li>
            <Link to={`/${lang}/cashback`}>
              {lang === "ar" ? "البروفايل" : "Profile"}
            </Link>
          </li>
        )}
        <li>
          <button onClick={handleAuth} className="Login-button">
            {userId
              ? `${lang === "ar" ? "تسجيل خروج" : "Logout"}`
              : `${lang === "ar" ? "تسجيل دخول" : "Login"}`}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
