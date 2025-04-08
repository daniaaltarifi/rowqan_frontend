import { Col, Container, Row, Form, Button, Alert } from "react-bootstrap";
import { useState } from "react";
import contactImg from "../assets/contact.jpg";
import { API_URL } from "../App";
import axios from "axios";
import '../Css/Contact.css';
import { Globe2, MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import SocialMediaButtons from "../Component/SocialMediaButtons";

function Contact() {
  const navigate = useNavigate();
  const location = useLocation();

  const lang = location.pathname.split("/")[1] || "en";
  const isArabic = lang === "ar";
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
  const [loading, setLoading] = useState(false);
  const [activeField, setActiveField] = useState(null);

 

  const toggleLanguage = () => {
    const newLang = isArabic ? "en" : "ar";
    const currentPath = location.pathname.split("/").slice(2).join("/");
    navigate(`/${newLang}${currentPath ? "/" + currentPath : "/chalets"}`);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFocus = (fieldName) => {
    setActiveField(fieldName);
  };

  const handleBlur = () => {
    setActiveField(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${API_URL}/ContactUs/createcontactus`, formData);
      
     
      setFormData({
        First_Name: "",
        Last_Name: "",
        EmailAddress: "",
        Phone_Number: "",
        Address: "",
        Messages: "",
        lang: lang,
      });

      setValidated(false);
      setMessageData(isArabic ? "تم إرسال الرسالة بنجاح" : "Message Sent Successfully");
      
  
      setTimeout(() => {
        const alertElement = document.querySelector('.success-alert');
        if (alertElement) alertElement.classList.add('bounce-in');
      }, 100);
      
    } catch (error) {
      console.error(error);
      setMessageData(isArabic ? "حدث خطأ، يرجى المحاولة مرة أخرى" : "An error occurred, please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page" dir={isArabic ? "rtl" : "ltr"}>
      <SocialMediaButtons />
      
      <div className="language-toggle-container">
        <button
          onClick={toggleLanguage}
          className="language-btn"
          aria-label="Toggle Language"
        >
          <Globe2 className="w-6 h-6" />
        </button>
      </div>
      
      <div className="contact-header">
        <p className="text-center subtitle">
          {isArabic 
            ? "نحن هنا للإجابة على جميع استفساراتك" 
            : "We're here to answer all your questions"}
        </p>
      </div>
      
      <Container className="contact-container">
        <Row className="contact-row">
          <Col lg={5} md={12} className="contact-info-col">
            <div className="contact-info-card">
              <h3 className="info-title">{isArabic ? "معلومات التواصل" : "Contact Information"}</h3>
              
              <div className="contact-image-wrapper">
                <img 
                  src={contactImg} 
                  alt={isArabic ? "تواصل معنا" : "Contact us"} 
                  className="contact-image"
                />
              </div>
              
              <div className="contact-details">
                <div className="info-item">
                  <MapPin className="info-icon" />
                  <div>
                    <h4>{isArabic ? "العنوان" : "Address"}</h4>
                    <p>123 Street Name, City, Country</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <Phone className="info-icon" />
                  <div>
                    <h4>{isArabic ? "الهاتف" : "Phone"}</h4>
                    <p>+1 234 567 8900</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <Mail className="info-icon" />
                  <div>
                    <h4>{isArabic ? "البريد الإلكتروني" : "Email"}</h4>
                    <p>info@example.com</p>
                  </div>
                </div>
                
                <div className="info-item">
                  <Clock className="info-icon" />
                  <div>
                    <h4>{isArabic ? "ساعات العمل" : "Working Hours"}</h4>
                    <p>{isArabic ? "الإثنين - الجمعة: 9:00 ص - 5:00 م" : "Mon - Fri: 9:00 AM - 5:00 PM"}</p>
                  </div>
                </div>
              </div>
            </div>
          </Col>
          
          <Col lg={7} md={12} className="contact-form-col">
            <div className="contact-form-card">
              <h3 className="form-title">{isArabic ? "أرسل لنا رسالة" : "Send us a message"}</h3>
              
              <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                className="contact-form"
              >
                <Row className="mb-3">
                  <Form.Group as={Col} md="6" className={`form-field ${activeField === 'First_Name' ? 'active' : ''}`}>
                    <Form.Label className="form-label">
                      {isArabic ? "الاسم الأول" : "First name"}
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="First_Name"
                      value={formData.First_Name}
                      onChange={handleChange}
                      onFocus={() => handleFocus('First_Name')}
                      onBlur={handleBlur}
                      className="form-input"
                      placeholder={isArabic ? "أدخل الاسم الأول" : "Enter first name"}
                    />
                    <Form.Control.Feedback>
                      {isArabic ? "يبدو جيداً!" : "Looks good!"}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="6" className={`form-field ${activeField === 'Last_Name' ? 'active' : ''}`}>
                    <Form.Label className="form-label">
                      {isArabic ? "الاسم الأخير" : "Last name"}
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="Last_Name"
                      value={formData.Last_Name}
                      onChange={handleChange}
                      onFocus={() => handleFocus('Last_Name')}
                      onBlur={handleBlur}
                      className="form-input"
                      placeholder={isArabic ? "أدخل الاسم الأخير" : "Enter last name"}
                    />
                    <Form.Control.Feedback>
                      {isArabic ? "يبدو جيداً!" : "Looks good!"}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} md="6" className={`form-field ${activeField === 'EmailAddress' ? 'active' : ''}`}>
                    <Form.Label className="form-label">
                      {isArabic ? "البريد الإلكتروني" : "Email"}
                    </Form.Label>
                    <Form.Control
                      required
                      type="email"
                      name="EmailAddress"
                      value={formData.EmailAddress}
                      onChange={handleChange}
                      onFocus={() => handleFocus('EmailAddress')}
                      onBlur={handleBlur}
                      className="form-input"
                      placeholder={isArabic ? "أدخل البريد الإلكتروني" : "Enter email address"}
                    />
                    <Form.Control.Feedback>
                      {isArabic ? "يبدو جيداً!" : "Looks good!"}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md="6" className={`form-field ${activeField === 'Phone_Number' ? 'active' : ''}`}>
                    <Form.Label className="form-label">
                      {isArabic ? "رقم الهاتف" : "Phone Number"}
                    </Form.Label>
                    <Form.Control
                      required
                      type="tel"
                      name="Phone_Number"
                      value={formData.Phone_Number}
                      onChange={handleChange}
                      onFocus={() => handleFocus('Phone_Number')}
                      onBlur={handleBlur}
                      className="form-input"
                      placeholder={isArabic ? "أدخل رقم الهاتف" : "Enter phone number"}
                    />
                    <Form.Control.Feedback>
                      {isArabic ? "يبدو جيداً!" : "Looks good!"}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className="mb-3">
                  <Form.Group as={Col} className={`form-field ${activeField === 'Address' ? 'active' : ''}`}>
                    <Form.Label className="form-label">
                      {isArabic ? "العنوان" : "Address"}
                    </Form.Label>
                    <Form.Control
                      required
                      type="text"
                      name="Address"
                      value={formData.Address}
                      onChange={handleChange}
                      onFocus={() => handleFocus('Address')}
                      onBlur={handleBlur}
                      className="form-input"
                      placeholder={isArabic ? "أدخل العنوان" : "Enter address"}
                    />
                    <Form.Control.Feedback>
                      {isArabic ? "يبدو جيداً!" : "Looks good!"}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <Row className="mb-4">
                  <Form.Group as={Col} className={`form-field ${activeField === 'Messages' ? 'active' : ''}`}>
                    <Form.Label className="form-label">
                      {isArabic ? "الرسالة" : "Message"}
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      required
                      name="Messages"
                      value={formData.Messages}
                      onChange={handleChange}
                      onFocus={() => handleFocus('Messages')}
                      onBlur={handleBlur}
                      className="form-textarea"
                      rows={4}
                      placeholder={isArabic ? "اكتب رسالتك هنا..." : "Write your message here..."}
                    />
                    <Form.Control.Feedback>
                      {isArabic ? "يبدو جيداً!" : "Looks good!"}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Row>

                <div className="submit-btn-container">
                  <Button 
                    className="submit-button" 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="spinner">
                        <div className="bounce1"></div>
                        <div className="bounce2"></div>
                        <div className="bounce3"></div>
                      </div>
                    ) : (
                      <>
                        <Send className="submit-icon" size={18} />
                        {isArabic ? "إرسال الرسالة" : "Send Message"}
                      </>
                    )}
                  </Button>
                </div>

                {messageData && (
                  <div className="mt-4">
                    <Alert
                      variant={messageData.toLowerCase().includes("error") || messageData.includes("خطأ") ? "danger" : "success"}
                      className={`message-alert ${messageData.toLowerCase().includes("error") || messageData.includes("خطأ") ? 'error-alert' : 'success-alert'}`}
                    >
                      {messageData}
                    </Alert>
                  </div>
                )}
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Contact;