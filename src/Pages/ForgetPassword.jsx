import { Container, Row, Col, Form } from "react-bootstrap";
import forgetpassword from "../assets/forget.png";
import { useState } from "react";
import axios from "axios";
import { API_URL } from "../App";
function ForgetPassword() {
  const lang = location.pathname.split("/")[1] || "en";
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/users/forgot-password`, {
        email,
      });

      // Check if the response indicates that the email does not exist
      if (
        res.data === "The email does not exist. Please enter the correct email."
      ) {
        setError(
          lang === "ar"
            ? " البريد الإلكتروني غير موجود. الرجاء إدخال بريد إلكتروني صحيح"
            : "Email does not exist. Please enter a valid email."
        );
        setMessage(""); // Clear any previous messages
      } else {
        setMessage(
          lang === "ar"
            ? "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
            : "A password reset link has been sent to your email."
        );
        setError(""); // Clear any previous errors
      }
    } catch (err) {
      setError(
        lang === "ar"
          ? "حدث خطأ أثناء محاولة إرسال الرابط. الرجاء المحاولة مرة أخرى"
          : "An error has occurred"
      );
      console.error("Forgot Password error:", err);
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
              onSubmit={handleForgotPassword}
              className="w-75" // Apply width to form
            >
              <h1 className="title_forgetpass">
                {lang === "ar" ? "نسيت كلمة السر؟" : "Forgot your password?"}
              </h1>
              <h6 className="parg_forgetpass">
                {lang === "ar"
                  ? "لا تقلق، هذا يحدث لنا جميعًا. أدخل بريدك الإلكتروني أدناه لاستعادة كلمة المرور الخاصة بك"
                  : " Don’t worry, happens to all of us. Enter your email below to recover your password"}
              </h6>

              <Form.Group controlId="validationCustom02">
                <Form.Label>
                  {" "}
                  {lang === "ar" ? "البيرد الالكتروني" : "Email"}
                </Form.Label>
                <Form.Control
                  required
                  type="email"
                  placeholder="name@gmail.com"
                  className="form_input_auth"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
              </Form.Group>
              {message && <p className="success_message">{message}</p>}
              {error && <p className="error_message">{error}</p>}
              <button type="submit" className="Login-button w-100 mt-5">
                {lang === "ar" ? "ارسال" : "Submit"}
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

export default ForgetPassword;
