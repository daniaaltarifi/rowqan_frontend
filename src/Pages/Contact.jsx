import { Col, Container, Row, FloatingLabel, Form, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import contactimg from "../assets/contact.jpg";
import { API_URL } from "../App";
import axios from "axios";
import '../Css/Contact.css'
function Contact() {
  const lang = location.pathname.split("/")[1] || "en";
  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    First_Name: "",
    Last_Name: "",
    EmailAddress: "",
    Phone_Number: "",
    Address: "",
    Messages: "",
    lang: lang,
  });
  const [messageData, setMessageData] = useState("");


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the form from reloading the page
    const form = event.currentTarget;

    // Check if form is valid
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true); // Mark form as validated
      return;
    }

    try {
    await axios.post(`${API_URL}/ContactUs/createcontactus`, formData);
        // Reset form fields to empty after successful submission
        setFormData({
          First_Name: "",
          Last_Name: "",
          EmailAddress: "",
          Phone_Number: "",
          Address: "",
          Messages: "",
          lang: lang,
        });

        // Reset validation state
        setValidated(false);
        // Show the success message
        setMessageData("Message Sent Successfully");

    } catch (error) {
      console.error(error);
      setMessageData("An error occurred, please try again.");
    }
  };

  return (
    <>
      <section>
        <Container className="cont_form_apply">
          <Row>
            <Col xl={5} md={12} sm={12} className="cont_backg_apply">
              <h5 className="text-center mb-5 title_contact">
                {lang === "ar" ? "تواصل معنا" : "Contact Information"}
              </h5>
              <img
                src={contactimg}
                alt="apply"
                height={"320px"}
                width={"100%"}
                className="rounded"
              />
            </Col>
            <Col xl={7} md={12} sm={12}>
              <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                className="form_data"
              >
                <Row className="mb-3">
                  {/* Form fields */}
                  <Form.Group as={Col} xl="6" md="12" sm="12" controlId="validationCustom01">
                    <Form.Label className="input_form">{lang === "ar" ? "الاسم الاول" : "First name"}</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="First_Name"
                      value={formData.First_Name}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} xl="6" md="12" sm="12" controlId="validationCustom02">
                    <Form.Label className="input_form">{lang === "ar" ? "الاسم الاخير" : "Last name"}</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="Last_Name"
                      value={formData.Last_Name}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} xl="6" md="12" sm="12" controlId="validationCustom03">
                    <Form.Label className="input_form">{lang === "ar" ? "البريد الالكتروني" : "Email"}</Form.Label>
                    <Form.Control
                      required
                      type="email"
                      name="EmailAddress"
                      value={formData.EmailAddress}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} xl="6" md="12" sm="12" controlId="validationCustom04">
                    <Form.Label className="input_form">{lang === "ar" ? "رقم الهاتف" : "Phone Number"}</Form.Label>
                    <Form.Control
                      required
                      type="number"
                      name="Phone_Number"
                      value={formData.Phone_Number}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} xl="6" md="12" sm="12" controlId="validationCustom05">
                    <Form.Label className="input_form">{lang === "ar" ? "العنوان" : "Address"}</Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="Address"
                      value={formData.Address}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Label className="input_form">{lang === "ar" ? "الرسالة" : "Message"}</Form.Label>
                  <FloatingLabel controlId="floatingTextarea2">
                    <Form.Control
                      as="textarea"
                      required
                      style={{ height: "100px" }}
                      name="Messages"
                      value={formData.Messages}
                      onChange={handleChange}
                    />
                  </FloatingLabel>
                </Row>

                <div className="div_btn_applynow">
                  <Button className="btn_apply_now" type="submit">
                    {lang === "ar" ? "ارسال الرسالة" : "Send Message"}
                  </Button>
                </div>

                {messageData && (
                  <div className="mt-3">
                    <Alert
                      variant={
                        messageData.toLowerCase().includes("error") ? "danger" : "success"
                      }
                    >
                      {messageData}
                    </Alert>
                  </div>
                )}
              </Form>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}

export default Contact;
