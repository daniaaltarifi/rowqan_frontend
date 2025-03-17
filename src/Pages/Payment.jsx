import { useEffect, useState } from "react";
import "../Css/Payment.css";
import { Row, Container, Col } from "react-bootstrap";
import { API_URL } from "../App";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useUser } from "../Component/UserContext";
import checked from "../assets/checked.png";
import failed from "../assets/cross.png";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import Form from "react-bootstrap/Form";

function Payment() {
  const { userId } = useUser();
  const { reservation_id } = useParams();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const initial_amount = queryParams.get("initial_amount");
  const total_amount = queryParams.get("total_amount");
  const [selectedPayment, setSelectedPayment] = useState("cash");
  const [phoneNumber, setPhoneNumber] = useState("+962");
  const [name, setName] = useState("");
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [validatePhone, setValidatePhone] = useState(null);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [invoiceImg, setInvoiceImg] = useState(null);

  const handlePaymentTypeChange = (paymentType) => {
    setSelectedPayment(paymentType);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleConfirmPayment = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
  
    if (!phoneNumber || !phoneNumber.startsWith("+962")) {
      setValidatePhone("Phone number must start with +962");
      return;
    }
    if (!isValidPhoneNumber(phoneNumber)) {
      setValidatePhone("Invalid phone number format.");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append('reservation_id', reservation_id);
      formData.append('paymentMethod', selectedPayment);
      formData.append('UserName', name);
      formData.append('Phone_Number', phoneNumber);
      formData.append('initialAmount', initial_amount);
      
      // Only append image if it exists (optional for Cliq)
      if (invoiceImg) {
        formData.append('image', invoiceImg);
      }
  
      const res = await axios.post(`http://localhost:5000/payments/createPayment`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      setResponse(res.data);
      window.scrollTo(0, 800);
    } catch (error) {
      console.error("Error confirming Payment:", error);
      window.scrollTo(0, 1000);
      setError(error.response?.data?.error || "An error occurred.");
    }
  };

  const handleChange = (value) => {
    if (!phoneTouched) {
      setPhoneTouched(true);
    }
    if (!value) {
      setPhoneNumber("+962 ");
    } else if (!value.startsWith("+962")) {
      setPhoneNumber("+962 " + value.replace(/[^0-9]/g, ""));
    } else {
      setPhoneNumber(value);
    }
  };

  const isPhoneValid = phoneNumber.startsWith("+962") && isValidPhoneNumber(phoneNumber);

  return (
    <div>
      <article className="card_cont">
        <div className="container main_cont_payment">
          <div className="card-title mb-5">
            <h2>Payment</h2>
            <h5>Initial Amount: {initial_amount}</h5>
            <h5>Total Amount: {total_amount}</h5>
          </div>
          <div className="card-body">
            <div className="payment-type">
              <Container>
                <h4>Choose payment method below</h4>
                <div className="types flex_display justify-space-between">
                  <Row>
                    {/* Cash Payment */}
                    <Col sm={12} md={6} lg={6} className="mb-2">
                      <div
                        className={`type ${selectedPayment === "cash" ? "selected" : ""}`}
                        onClick={() => handlePaymentTypeChange("cash")}
                        style={{ height: '100%', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                      >
                        <div className="logo_payment">
                          <i className="fas fa-money-bill"></i>
                        </div>
                        <div className="text">
                          <p className="para_payment">Pay with Cash</p>
                        </div>
                      </div>
                    </Col>
                    {/* Cliq */}
                    <Col sm={12} md={6} lg={6} className="mb-2">
                      <div
                        className={`type ${selectedPayment === "Cliq" ? "selected" : ""}`}
                        onClick={() => handlePaymentTypeChange("Cliq")}
                        style={{ height: '100%', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                      >
                        <div className="logo">
                          <i className="fab fa-paypal"></i>
                        </div>
                        <div className="text">
                          <p className="para_payment">Pay with Cliq</p>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Container>
            </div>

            <div className="payment-info row">
              {/* Cash Info */}
              {selectedPayment === "cash" && (
                <div className="col-12 col-md-6">
                  <form onSubmit={handleConfirmPayment}>
                    <label className="label_of_payment">Name</label>
                    <input
                      className="input_payment"
                      type="text"
                      required
                      onChange={(e) => setName(e.target.value)}
                    />
                    <label className="label_of_payment">Phone Number</label>
                    <div className="phone-input-container">
                      <PhoneInput
                        value={phoneNumber}
                        onChange={handleChange}
                        defaultCountry="JO"
                        international
                      />
                      {validatePhone && (
                        <p style={{ color: "red" }}>{validatePhone}</p>
                      )}
                    </div>
                    <div className="col-auto text-center mt-2">
                      <button className="button button-primary btn_payment">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Cliq Info */}
              {selectedPayment === "Cliq" && (
                <div className="col-12 col-md-6">
                  <h4>Pay with Cliq</h4>
                  <p>
                    To confirm your reservation, please send the total amount
                    via Cliq to the following phone number (07 7534 7666).
                    Afterward, share the payment details via WhatsApp to
                    finalize and confirm your reservation then click submit.
                  </p>
                  <form onSubmit={handleConfirmPayment}>
                    <label className="label_of_payment">Name</label>
                    <input
                      className="input_payment"
                      type="text"
                      required
                      onChange={(e) => setName(e.target.value)}
                    />
                    <label className="label_of_payment">Phone Number</label>
                    <div className="phone-input-container">
                      <PhoneInput
                        value={phoneNumber}
                        onChange={handleChange}
                        defaultCountry="JO"
                        international
                      />
                      {validatePhone && (
                        <p style={{ color: "red" }}>{validatePhone}</p>
                      )}
                    </div>
                    <Form.Group controlId="formFile" className="mb-3">
                      <Form.Label>Upload invoice image (optional)</Form.Label>
                      <Form.Control
                        type="file"
                        onChange={(e) => setInvoiceImg(e.target.files[0])}
                      />
                    </Form.Group>
                    <div className="col-auto text-center mt-2">
                      <button className="button button-primary btn_payment">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Payment Summary */}
            <div>
              <div className="d-flex justify-content-between">
                <p>Name:</p>
                <span>{name}</span>
              </div>
              <div className="d-flex justify-content-between">
                <p>Phone Number:</p>
                <span>{phoneNumber}</span>
              </div>
              <div className="d-flex justify-content-between">
                <p>Payment Method:</p>
                <span>{selectedPayment}</span>
              </div>
              <div className="d-flex justify-content-between">
                <p>To Paid:</p>
                <span>{initial_amount}</span>
              </div>
              <div className="d-flex justify-content-between">
                <p>Total Amount:</p>
                <span>{total_amount}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Created At:</span>
                <span>{new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Success Message */}
        {response && (
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-12 col-sm-12">
                <div className="message-box _success">
                  <img src={checked} alt="success" className="mb-3" />
                  <h4>Your payment was successful</h4>
                  <p>Thank you for your payment.</p>
                  <div className="d-flex justify-content-between">
                    <span><b>Name:</b></span>
                    <span>{response.payment.UserName}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span><b>Phone Number:</b></span>
                    <span>{response.payment.Phone_Number}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span><b>Reservation id:</b></span>
                    <span>{response.payment.reservation_id}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span><b>Status:</b></span>
                    <span>{response.payment.status}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span><b>Payment Method:</b></span>
                    <span>{response.payment.paymentMethod}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span><b>To Paid:</b></span>
                    <span>{response.payment.initialAmount}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span><b>Remaining Amount:</b></span>
                    <span>{response.payment.RemainningAmount}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span><b>Created At:</b></span>
                    <span>{new Date(response.payment.updatedAt).toLocaleDateString()}</span>
                  </div>
                  <hr />
                  <h3 className="text-center invoice_text">Invoice Paid</h3>
                  <hr />
                  <span>You can still view the invoice in the email that was sent to you</span>
                  <hr />
                  <span className="inquires">For inquiries: contact@rowqan.com, phone: 0791234678</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-12 col-sm-12">
                <div className="message-box _success _failed">
                  <img src={failed} alt="failed" className="mb-3" />
                  <h4>Your payment failed</h4>
                  <p style={{ color: "red", textAlign: "center" }}>
                    {error} Try again later
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

export default Payment;