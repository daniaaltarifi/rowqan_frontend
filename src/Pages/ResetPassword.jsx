import { Container, Row, Col, Form } from "react-bootstrap";
import forgetpassword from "../assets/forget.png";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../App";
function ResetPassword() {
  const lang = location.pathname.split("/")[1] || "en";
  const [passwordvisible, setPasswordvisible] = useState(false);
  const togglepasswordVisible = () => {
    setPasswordvisible(!passwordvisible);
  };
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const { token } = useParams(); // Get the token from the URL
  const navigate = useNavigate();
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      const res = await axios.post(
        `${API_URL}/users/reset-password/${token}`,
        { password, confirmPassword },
        { headers: { "Content-Type": "application/json" } }
      );
      setMessage(res.data.message);
      setError("");
      setTimeout(() => {
        navigate(`/${lang}/login`);
      }, 2500);
    } catch (err) {
      setError("حدث خطأ أثناء إعادة تعيين كلمة المرور. حاول مرة أخرى.");
      console.error("Reset Password error:", err);
      setMessage("");
    }
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
              onSubmit={handleResetPassword}
              className="w-75" // Apply width to form
            >
              <h1 className="title_forgetpass">
                {" "}
                {lang === "ar" ? "تعيين كلمة مرور" : "Set a password   "}
              </h1>
              <h6 className="parg_forgetpass">
                {lang === "ar"
                  ? "لقد تم إعادة تعيين كلمة المرور السابقة الخاصة بك. يرجى تعيين كلمة مرور جديدة لحسابك"
                  : " Your previous password has been reseted. Please set a newpassword for your account"}
              </h6>

              <Form.Group controlId="validationCustom02">
                <Form.Label>
                  {" "}
                  {lang === "ar" ? "انشاء كلمة مرور" : "Create Password"}
                </Form.Label>
                <div className="password-input-wrapper">
                  <Form.Control
                    required
                    type={passwordvisible ? "text" : "password"}
                    placeholder="7789BM6X@@H&$K_"
                    className="form_input_auth"
                    onChange={(e) => setPassword(e.target.value)}
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
                <Form.Label>
                  {" "}
                  {lang === "ar"
                    ? "أعد إدخال كلمة المرور"
                    : " Re-enter Password"}
                </Form.Label>
                <div className="password-input-wrapper">
                  <Form.Control
                    required
                    type={passwordvisible ? "text" : "password"}
                    placeholder="7789BM6X@@H&$K_"
                    className="form_input_auth"
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                {lang === "ar" ? "ارسال" : "Submit"}
              </button>
              {message && <p className="message">{message}</p>}
              {error && <p className="error_message">{error}</p>}
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
