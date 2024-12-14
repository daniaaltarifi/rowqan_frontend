import { useState } from "react";
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

function Login() {
  const { setUserId } = useUser();
  const navigate = useNavigate();
  const lang = location.pathname.split("/")[1] || "en";
  const [validated, setValidated] = useState(false);
  const [passwordvisible, setPasswordvisible] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleSubmit = async (event) => {
    const form = event.currentTarget;
  
    // Prevent form submission if it's invalid
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
  
    // Set validated state to true (you can adjust as per your form's behavior)
    setValidated(true);
    event.preventDefault();
  
    try {
      const response = await axios.post(
        `${API_URL}/users/login`,
        {
          email: formData.email,
          password: formData.password,
          lang: lang,
        },
        {
          withCredentials: true, // Ensure cookies are handled
        }
      );
  
      // Check if login is successful (status 200)
      if (response.status === 200) {
        Cookies.set("token", response.data.token, { expires: 7, secure: true });
        setUserId(response.data.userId);
        navigate(`/${lang}`);
      }
  
    } catch (error) {
      // If the error response is from the backend, handle different error statuses
      if (error.response) {  
        if (error.response.status === 404) {
          setError(lang === 'en' ? 'User not found' : 'المستخدم غير موجود');
        } else if (error.response.status === 401) {
          setError(lang === 'en' ? 'Invalid credentials' : 'بيانات الاعتماد غير صحيحة');
        } else {
          setError(lang === 'en' ? 'An error occurred. Please try again.' : 'حدث خطأ. يرجى المحاولة مرة أخرى.');
        }
      } else {
        setError(lang === 'en' ? 'An error occurred. Please try again.' : 'حدث خطأ. يرجى المحاولة مرة أخرى.');
      }
    }
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
              <h2>Rowqan</h2>
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
            <h1 className="create_acc_title">Sign In</h1>

            <Form.Group controlId="validationCustom02" className="w-75">
              <Form.Label>Email</Form.Label>
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
              <Form.Label>Password</Form.Label>
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
                Forget Password
              </Link>
            </Form.Group>
            <button type="submit" className="Login-button w-50 mt-3">
              Login
            </button>
            {error && <p style={{color:"red"}}>{error}</p>}

            <Link to={`/${lang}/signup`} className="link_auth">
              SignUp
            </Link>
            {/* <div>
              <img
                src={gmail}
                alt="social icon"
                height={"30px"}
                width={"30px"}
              />
              <img
                src={facebook}
                alt="social icon"
                height={"30px"}
                width={"30px"}
                className="ms-2"
              />
              <img
                src={instagram}
                alt="social icon"
                height={"30px"}
                width={"30px"}
                className="ms-2"
              />
            </div> */}
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;
