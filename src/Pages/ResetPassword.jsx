import { Container, Row, Col, Form } from "react-bootstrap";
import forgetpassword from "../assets/forget.png";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 
function ResetPassword() {
  const [validated, setValidated] = useState(false);
  const [passwordvisible, setPasswordvisible] = useState(false);
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);
  };
  const togglepasswordVisible = () => {
    setPasswordvisible(!passwordvisible);
  };
  return (
    <section>
      <Container>
        <Row>
          <Col
            xl={6}
            md={12}
            sm={12}
            className="d-flex justify-content-center align-items-center" // Center the form inside the column
          >
            <Form
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
              className="w-75" // Apply width to form
            >
              <h1 className="title_forgetpass">Set a password</h1>
              <h6 className="parg_forgetpass">
                Your previous password has been reseted. Please set a new
                password for your account.{" "}
              </h6>

              <Form.Group controlId="validationCustom02">
                <Form.Label>Create Password</Form.Label>
                <div className="password-input-wrapper">
                  <Form.Control
                    required
                    type={passwordvisible ? "text" : "password"}
                    placeholder="7789BM6X@@H&$K_"
                    className="form_input_auth"
                  />
                  <button
                    type="button"
                    className="password-visibility-toggle"
                    onClick={togglepasswordVisible}
                  >
                    {passwordvisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </div>
              </Form.Group>
              <Form.Group controlId="validationCustom03">
                <Form.Label>Re-enter Password</Form.Label>
                <div className="password-input-wrapper">
                  <Form.Control
                    required
                    type={passwordvisible ? "text" : "password"}
                    placeholder="7789BM6X@@H&$K_"
                    className="form_input_auth"
                  />
                  <button
                    type="button"
                    className="password-visibility-toggle"
                    onClick={togglepasswordVisible}
                  >
                    {passwordvisible ? <FaEyeSlash /> : <FaEye />}
                  </button>
                  <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                </div>
              </Form.Group>
              <button type="submit" className="Login-button w-100 mt-5">
                Submit
              </button>
            </Form>
          </Col>

          <Col
            xl={6}
            md={12}
            sm={12}
            className="d-flex justify-content-center align-items-center"
          >
            <img
              src={forgetpassword}
              alt="Forget Password"
              className="img-fluid"
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
}

export default ResetPassword;
