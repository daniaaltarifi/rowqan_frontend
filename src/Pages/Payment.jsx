import { useEffect, useState } from "react";
import "../Css/Payment.css";
import { Row, Container, Col } from "react-bootstrap";
import { API_URL } from "../App";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { useUser } from "../Component/UserContext";
import checked from "../assets/checked.png";
import failed from "../assets/cross.png";
import { PayPalButtons } from "@paypal/react-paypal-js";
const style = { layout: "vertical" };
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
// import flags from 'react-phone-number-input/flags'
import "react-phone-number-input/style.css";
import Form from "react-bootstrap/Form";

function Payment() {
  const { userId } = useUser();
  const { reservation_id } = useParams();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const initial_amount = queryParams.get("initial_amount");
  const total_amount = queryParams.get("total_amount");
  const [selectedPayment, setSelectedPayment] = useState("credit_card");
  const [phoneNumber, setPhoneNumber] = useState("+962");
  const [name, setName] = useState("");
  const [conversionRate, setConversionRate] = useState(0); // Store the conversion rate
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
      // Prepare the payment data
      const paymentData = {
        user_id: userId || null,
        reservation_id: reservation_id,
        paymentMethod: selectedPayment,
        UserName: name,
        Phone_Number: phoneNumber,
        initialAmount: initial_amount,
      };
  
      // If payment method is 'Cliq', prepare FormData for file upload
      if (selectedPayment === 'Cliq' && invoiceImg) {
        const formData = new FormData();
        // formData.append('user_id', userId || null);
        formData.append('reservation_id', reservation_id);
        formData.append('paymentMethod', selectedPayment);
        formData.append('UserName', name);
        formData.append('Phone_Number', "0782646464");
        formData.append('initialAmount', initial_amount);
        // Append the invoice image
        formData.append('image', invoiceImg);
  
        // Send the request with FormData (for Cliq)
        const res = await axios.post(`${API_URL}/payments/createPayment`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
  
        setResponse(res.data);
        window.scrollTo(0, 800);
        // setTimeout(() => navigate(`/${lang}`), 5500);
      } else {
        // Send the request with JSON (for other payment methods)
        const res = await axios.post(`${API_URL}/payments/createPayment`, paymentData);
  
        setResponse(res.data);
        window.scrollTo(0, 800);
        // setTimeout(() => navigate(`/${lang}`), 5500);
      }
    } catch (error) {
      console.error("Error confirming Payment:", error);
      window.scrollTo(0, 1000);
      setError(error.response?.data?.error || "An error occurred.");
    }
  };
  
  
  // const handleConfirmPayment = async (e) => {
  //   if (e && e.preventDefault) {
  //     e.preventDefault();
  //   }
  //   if (!phoneNumber || !phoneNumber.startsWith("+962")) {
  //     setValidatePhone("Phone number must start with +962");
  //     return;
  //   }
  //   if (!isValidPhoneNumber(phoneNumber)) {
  //     setValidatePhone("Invalid phone number format.");
  //     return;
  //   }
  //   try {
  //     // const paymentInfo={
  //     //   user_id: userId || null,
  //     //   reservation_id: reservation_id,
  //     //   paymentMethod: selectedPayment,
  //     //   UserName: name,
  //     //   Phone_Number: phoneNumber,
  //     //   initialAmount: initial_amount,
  //     // }
  //     // if(selectedPayment === 'Cliq'){
  //     //   paymentInfo.image = invoiceImg
  //     // }
  //     const res = await axios.post(`${API_URL}/payments/createPayment`,
  //        {
  //       user_id: userId || null,
  //       reservation_id: reservation_id,
  //       paymentMethod: selectedPayment,
  //       UserName: name,
  //       Phone_Number: phoneNumber,
  //       initialAmount: initial_amount,
  //     }
      
  //   );

  //     setResponse(res.data);
  //     window.scrollTo(0, 800);
  //     // setTimeout(() => navigate(`/${lang}`), 5500);
  //   } catch (error) {
  //     console.error("Error confirming Payment:", error);
  //     window.scrollTo(0, 1000);
  //     setError(error.response?.data?.error || "An error occurred.");
  //   }
  // };
  useEffect(() => {
    const fetchConversionRate = async () => {
      try {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/48fb1b6e8b9bab92bb9abe37/latest/USD`
        );
        const data = await response.json();
        if (data.result === "success") {
          const rate = data.conversion_rates.JOD; // Get the JOD to USD rate
          setConversionRate(rate); // Store the rate
        } else {
          console.error("Failed to fetch conversion rate");
        }
      } catch (error) {
        console.error("Error fetching exchange rate:", error);
      }
    };

    fetchConversionRate();
  }, []);
  const createOrder = (data, actions) => {
    const total_amount_usd = (initial_amount / conversionRate).toFixed(2); // Convert JOD to USD
    return actions.order
      .create({
        intent: "CAPTURE",
        purchase_units: [
          {
            description: "Chalets reservation",
            amount: {
              currency_code: "USD", // Use USD as the currency
              value: total_amount_usd, // Use the converted value
              name: name,
              phoneNumber: phoneNumber,
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId; // Return the order ID
      });
  };

  const onApprove = async (data, actions) => {
    const order = await actions.order.capture();
    if (order) {
      handleConfirmPayment();
    }
  };

  const onError = (err) => {
    console.error("PayPal error:", err);
    setError(err);
  };
  const handleChange = (value) => {
    if (!phoneTouched) {
      setPhoneTouched(true); // Mark input as touched after first change
    }
    if (!value) {
      setPhoneNumber("+962 "); // Reset if empty
    } else if (!value.startsWith("+962")) {
      setPhoneNumber("+962 " + value.replace(/[^0-9]/g, "")); // Prevent removing +962
    } else {
      setPhoneNumber(value); // Allow valid input
    }
  };
  const isPhoneValid =
    phoneNumber.startsWith("+962") && isValidPhoneNumber(phoneNumber);

  return (
    <div>
      <article className="card_cont">
        <div className="container main_cont_payment">
          <div className="card-title mb-5">
            <h2>Payment</h2>
            <h5>Initial Amount:{initial_amount}</h5>
            <h5>Total Amount:{total_amount}</h5>
          </div>
          <div className="card-body">
            <div className="payment-type">
              <Container>
                <h4>Choose payment method below</h4>
                <div className="types flex_display justify-space-between">
                  <Row>
                    {/* Credit Card */}
                    <Col sm={12} md={6} lg={6} className="mb-2">
                      <div
                        className={`type ${
                          selectedPayment === "credit_card" ? "selected" : ""
                        }`}
                        onClick={() => handlePaymentTypeChange("credit_card")}
                      >
                        <div className="logo_payment">
                          <i className="far fa-credit-card"></i>
                        </div>
                        <div className="text">
                          <p className="para_payment">Pay with Credit Card</p>
                        </div>
                      </div>
                    </Col>
                    {/* PayPal */}
                    <Col sm={12} md={6} lg={6} className="mb-2">
                      <div
                        className={`type ${
                          selectedPayment === "Cliq" ? "selected" : ""
                        }`}
                        onClick={() => handlePaymentTypeChange("Cliq")}
                      >
                        <div className="logo">
                          <i className="fab fa-paypal"></i>
                        </div>
                        <div className="text">
                          <p className="para_payment">Pay with Cliq</p>
                        </div>
                      </div>
                    </Col>
                    {/* cash */}
                    {/* <Col sm={12} md={4} lg={4}>
                      <div
                        className={`type ${
                          selectedPayment === "cash" ? "selected" : ""
                        }`}
                        onClick={() => handlePaymentTypeChange("cash")}
                      >
                        <div className="logo">
                          <i className="fab fa-amazon"></i>
                        </div>
                        <div className="text">
                          <p className="para_payment">Pay with Cash</p>
                        </div>
                      </div>
                    </Col> */}
                  </Row>
                </div>
              </Container>
            </div>

            {/* Conditionally render payment details based on the selected method */}
            <div className="payment-info row">
              {/* Credit Card Info */}
              {selectedPayment === "credit_card" && (
                <div className="col-12 col-md-6">
                  <form>
                    <label className="label_of_payment">Name</label>

                    <input
                      className="input_payment"
                      type="text"
                      required
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                    <label className="label_of_payment">Phone Number</label>

                    <div className="phone-input-container">
                      <PhoneInput
                        value={phoneNumber}
                        onChange={handleChange}
                        defaultCountry="JO" // Jordan flag will be displayed
                        international // Ensures international format
                      />
                      {phoneTouched && !isPhoneValid && (
                        <p style={{ color: "red" }}>
                          Invalid Phone Number Format
                        </p>
                      )}
                    </div>

                    <PayPalButtons
                      style={style}
                      disabled={
                        !name ||
                        !phoneNumber ||
                        !initial_amount ||
                        !phoneNumber.startsWith("+962") ||
                        !isValidPhoneNumber(phoneNumber)
                      }
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                      fundingSource="paypal"
                    />
                  </form>
                </div>
              )}

              {/* Cliq Info */}
              {selectedPayment === "Cliq" && (
                <div className="col-12 col-md-6">
                  <h4>Pay with Cliq</h4>
                  <p>
                    To confirm your reservation, please send the total amount
                    via Cliq to the following phone number (07 7534 7666),
                    Afterward, share the payment details via WhatsApp to
                    finalize and confirm your reservation then click submit.
                  </p>
                  <form onSubmit={handleConfirmPayment}>
                    <label className="label_of_payment">Name</label>
                    <input
                      className="input_payment"
                      type="text"
                      required
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                    <label className="label_of_payment">Phone Number</label>
                    <div className="phone-input-container">
                      <PhoneInput
                        value={phoneNumber}
                        onChange={handleChange}
                        defaultCountry="JO" // Jordan flag will be displayed
                        international // Ensures international format
                      />
                      {validatePhone && (
                        <p style={{ color: "red" }}>{validatePhone}</p>
                      )}
                    </div>
                    <Form.Group controlId="formFile" className="mb-3">
                      <Form.Label>Upload invoice image </Form.Label>
                      <Form.Control
                        type="file"
                        required
                        onChange={(e) => setInvoiceImg(e.target.files[0])}
                      />
                    </Form.Group>
                    <div className="col-auto text-center mt-2">
                      <button className="button button-primary btn_payment ">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* cash Info */}
              {/* {selectedPayment === "cash" && (
                <div className="col-12 col-md-6">
                  <h4>Pay with Cash</h4>
                  <p>
                    Please click on Submit to complete and confirm your
                    reservation.
                  </p>
                  <form onSubmit={handleConfirmPayment}>
                    <label className="label_of_payment">Name</label>
                    <input
                      className="input_payment"
                      type="text"
                      required
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
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
                      <button className="button button-primary btn_payment ">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              )} */}
            </div>
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
        {response && (
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-12 col-sm-12">
                <div className="message-box _success ">
                  <img src={checked} alt="success" className="mb-3" />{" "}
                  <h4> Your payment was successful </h4>
                  <p> Thank you for your payment.</p>
                  <div className="d-flex justify-content-between">
                    <span>
                      <b>Name:</b>
                    </span>
                    <span> {response.payment.UserName}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>
                      <b>Phone Number:</b>
                    </span>
                    <span> {response.payment.Phone_Number}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>
                      <b>Reservation id:</b>
                    </span>
                    <span> {response.payment.reservation_id}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>
                      <b>Status:</b>
                    </span>
                    <span> {response.payment.status}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>
                      <b>Payment Method:</b>
                    </span>
                    <span> {response.payment.paymentMethod}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>
                      <b>To Paid:</b>
                    </span>
                    <span> {response.payment.initialAmount}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>
                      <b>Remainning Amount:</b>
                    </span>
                    <span> {response.payment.RemainningAmount}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span>
                      <b>Created At:</b>
                    </span>
                    <span>
                      {" "}
                      {new Date(
                        response.payment.updatedAt
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <hr />
                  <h3 className="text-center invoice_text">Invoice Paid</h3>
                  <hr />
                  <span>
                    You can still view the invoice in the email that was sent to
                    you{" "}
                  </span>
                  <hr />
                  <span className="inquires">
                    For inquiries:contact@rowqan.com, phone:0791234678
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-12 col-sm-12">
                <div className="message-box _success _failed">
                  <img src={failed} alt="failed" className="mb-3" />{" "}
                  <h4> Your payment failed </h4>
                  <p style={{ color: "red", textAlign: "center" }}>
                    {" "}
                    {error} Try again later{" "}
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
