import { useState } from "react";
import { Container, Row, Col, Form } from "react-bootstrap";
import auth from "../assets/auth.jpg";
import "../Css/Auth.css";
import { Link } from "react-router-dom";
function SignUp() {
  const [validated, setValidated] = useState(false);
  const lang = location.pathname.split("/")[1] || "en";
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
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
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid Country Name.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="validationCustom04" className="w-50">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter your password"
                required
                className="form_input_auth"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid Password.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="validationCustom05" className="w-50">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="text"
                placeholder="Confirm Password"
                required
                className="form_input_auth"
              />
              <Form.Control.Feedback type="invalid">
                Please provide a Confirm Password.
              </Form.Control.Feedback>
            </Form.Group>
            <button type="submit" className="Login-button w-50 mt-3">
              Register
            </button>
            <Link to={`/${lang}/login`}className="link_auth">
              Login
            </Link>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default SignUp;
