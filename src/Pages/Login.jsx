import {useEffect, useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import auth from "../assets/auth.jpg";
import "../Css/Auth.css";
import { Link, useNavigate } from "react-router-dom";
// import gmail from "../assets/gmail.png";
// import facebook from "../assets/facebook.png";
// import instagram from "../assets/instagram.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Cookies from "cookies-js";
import axios from "axios";
import { API_URL } from "../App";
import { useUser } from "../Component/UserContext";
import ModelAlert from "../Component/ModelAlert";

function Login() {
  const { setUserId } = useUser();
  const navigate = useNavigate();
  const lang = location.pathname.split("/")[1] || "en";
  // eslint-disable-next-line no-unused-vars
  const [validated, setValidated] = useState(false);
  const [passwordvisible, setPasswordvisible] = useState(false);
  const [error, setError] = useState(null);
  const [mfaCode, setMfaCode] = useState("");
  const [smShow, setSmShow] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  useEffect(()=>{
window.scrollTo(0, 0);
  },[])
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!mfaCode) {
        const response = await axios.post(`${API_URL}/users/login`, {
          email: formData.email,
          password: formData.password,
          lang: lang,
        });
  
        if (
          response.status === 200 &&
          response.data === "MFA code has been sent to your email. Please enter the code to complete login."
        ) {
          setError("");
          setModalTitle("Success");
          setModalMessage(response.data);
          setShowModal(true);
          setSmShow(true);
        }
      } else {
        // Verify email, password, and MFA code
        const res = await axios.post(`${API_URL}/users/login`, {
          email: formData.email,
          password: formData.password,
          mfaCode,
        },  {
          withCredentials: true, // Ensure cookies are handled
        });
  
        if (res.status === 200) {
          Cookies.set("token", res.data.token, { expires: 7, secure: true });
          setUserId(res.data.userId);
          navigate(`/${lang}`);
        }
      }
    } catch (err) {
      handleError(err);  // Call handleError to display error message
    }
  };
  
  const handleError = (err) => {
    if (!err.response || !err.response.status) {
      setError("Unable to connect to the server. Check your internet connection.");
      return;
    }
  
    const { status, data } = err.response;
  
    // Define a mapping for errors based on status code and message
    const errorMessages = {
      400: {
        "User not found": "The email you entered does not belong to any account.",
        "Invalid password": "The password you entered is incorrect. Please try again.",
        "Email is not authorized for login process": "Your email is not allowed to log in.",
        "MFA code has expired": "Your MFA code has expired. Please request a new one.",
        "Invalid MFA code": "The MFA code you entered is invalid. Please try again.",
      },
      403: {
        "Access is restricted to Jordan IPs only.": "You can only log in from Jordan IPs.",
        "Login not allowed from this device": "Login not allowed from this device.",
      },
      500: {
        default: "An internal server error occurred. Please try again later.",
      },
    };
  
    // Match the error response to the correct message
    const message =
      errorMessages[status]?.[data] ||  // Match exact error message
      errorMessages[status]?.default ||  // Default for the status code
      "An unexpected error occurred. Please try again later.";  // Fallback for unknown errors
  
    setError(message);
  };
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevdata) => ({
      ...prevdata,
      [name]: value,
    }));
  };
  const togglePasswordVisible = () => {
    setPasswordvisible(!passwordvisible);
  };
  return (
    <Container>
      <Row>
        <Col xl={6} md={12} sm={12}>
          <div className="image-container">
            <div className="text-overlay text-overlay_img">
              <h2>{lang === 'ar' ? 'روقان' : 'Rowqan'}</h2>
            </div>
            <img
              src={auth}
              alt="auth img"
              className="auth_img login_auth_img"
            />
          </div>
        </Col>

        <Col xl={6} md={12} sm={12} className="">
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            className="cont_form"
          >
            <h1 className="create_acc_title">{lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}</h1>

            <Form.Group controlId="validationCustom02" className="w-75">
              <Form.Label>{lang === 'ar' ? 'البريد الالكتروني' : 'Email'}</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="name@gmail.com"
                className="form_input_auth"
                onChange={handleChange}
                name="email"
              />
            </Form.Group>
            <Form.Group controlId="validationCustom04" className="w-75">
              <Form.Label>{lang === 'ar' ? 'كلمة السر' : 'Password'}</Form.Label>
              <div className="password-input-wrapper">
                <Form.Control
                  type={passwordvisible ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  className="form_input_auth"
                  onChange={handleChange}
                  name="password"
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a valid Password.
                </Form.Control.Feedback>
                <button
                  type="button"
                  onClick={togglePasswordVisible}
                  className="password-visibility-toggle"
                >
                  {passwordvisible ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <Link to={`/${lang}/forgetpassword`} className="forget_password">
                {lang === 'ar' ? 'نسيت كلمة السر' : 'Forget Password'}
              </Link>
            </Form.Group>
            {smShow && (
              <Form.Group
                controlId="validationCustom04"
                className="w-75 d-flex flex-column align-items-center"
              >
                <Form.Label>{lang === 'ar' ? 'الكود' : 'Code'}</Form.Label>
                <Form.Control
                  required
                  type="text"
                  className={`form_input_auth ${error && "error_input"}`}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                />
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="Login-button w-50 my-3"
                >
                  {lang === 'ar' ? 'تسجيل دخول' : 'Login'}
                </button>
              </Form.Group>
            )}

            {!mfaCode && !smShow && (
              <button
                type="button"
                onClick={handleSubmit}
                className="Login-button w-50 mt-3"
              >
                 {lang === 'ar' ? 'ارسال الكود' : 'Send Code'}
              </button>
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}

            <Link to={`/${lang}/signup`} className="link_auth">
              {lang === 'ar' ? 'تسجيل حساب' : 'SignUp'}
            </Link>
          </Form>
        </Col>
      </Row>
      <ModelAlert
        show={showModal}
        handleClose={() => setShowModal(false)}
        title={modalTitle}
        message={modalMessage}
      />
    </Container>
  );
}

export default Login;
