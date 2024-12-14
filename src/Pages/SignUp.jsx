import { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import auth from "../assets/auth.jpg";
import "../Css/Auth.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../App";
function SignUp() {
  const navigate=useNavigate()
  const [validated, setValidated] = useState(false);
  const lang = location.pathname.split("/")[1] || "en";
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    country: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      event.preventDefault();
    }
  
    // Check if the email or any required field is empty
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.name || !formData.phone_number || !formData.country) {
      setError(lang === "ar" ? "جميع الحقول مطلوبة" : "All fields are required");
      return;
    }
    // Check password and confirm password match
    if (formData.password !== formData.confirmPassword) {
      setError(lang === "ar" ? "كلمة المرور غير متطابقة" : "Passwords do not match");
      return;
    }
  
    try {
      await axios.post(
        `${API_URL}/users/createUser`,
        {
          name: formData.name,
          email: formData.email,
          phone_number: formData.phone_number,
          country: formData.country,
          password: formData.password,
          lang: lang
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    
      navigate(`/${lang}/login`);
    } catch (error) {
      // Handle database duplicate email error (ER_DUP_ENTRY)
      if (error.response && error.response.data && error.response.data.code === 'ER_DUP_ENTRY') {
        setError(lang === "ar" ? "البريد الالكتروني موجود" : "Email already exists");
      } else {
        console.log(`Error fetching post data ${error}`);
        setError(lang === "ar" ? "حدث خطأ في النظام" : "An error occurred");
      }
    }
    setValidated(true);

  };
  

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };
  return (
    <Container>
      <Row>
        <Col xl={6} md={12} sm={12}>
          <div className="image-container">
            <div className="text-overlay">
              <h2>Rowqan</h2>
            </div>
            <img src={auth} alt="auth img" className="auth_img" />
          </div>
        </Col>

        <Col xl={6} md={12} sm={12}>
          <h1 className="create_acc_title">Create Account</h1>
          <Form
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
            className="cont_form"
          >
            <Form.Group controlId="validationCustom01" className="w-50">
              <Form.Label>Name</Form.Label>
              <Form.Control
                required
                type="text"
                placeholder="Enter your name"
                className="form_input_auth"
                onChange={handleChange}
                name="name"
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="validationCustom02" className="w-50">
              <Form.Label>Email</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="name@gmail.com"
                className="form_input_auth"
                onChange={handleChange}
                name="email"
              />
              <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="validationCustomUsername" className="w-50">
              <Form.Label>Phone No</Form.Label>
              <Form.Control
                required
                type="number"
                placeholder="0799999999"
                className="form_input_auth"
                onChange={handleChange}
                name="phone_number"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid Phone No.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="validationCustom03" className="w-50">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                placeholder="Country Name"
                required
                className="form_input_auth"
                onChange={handleChange}
                name="country"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid Country Name.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="validationCustom04" className="w-50">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                minLength={6}
                placeholder="Enter your password"
                required
                className="form_input_auth"
                onChange={handleChange}
                name="password"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid Password.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="validationCustom05" className="w-50">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                minLength={6}
                placeholder="Confirm Password"
                required
                className="form_input_auth"
                onChange={handleChange}
                name="confirmPassword"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a Confirm Password.
              </Form.Control.Feedback>
            </Form.Group>
            <button type="submit" className="Login-button w-50 mt-3">
              Register
            </button>
            {error && <p style={{color:"red"}}>{error}</p>}
            <Link to={`/${lang}/login`} className="link_auth">
              Login
            </Link>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default SignUp;
