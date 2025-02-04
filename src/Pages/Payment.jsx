import { useEffect, useState } from "react";
import "../Css/Payment.css";
import { Row, Container, Col } from "react-bootstrap";
import { API_URL } from "../App";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useUser } from "../Component/UserContext";
import checked from "../assets/checked.png";
import failed from "../assets/cross.png";
import {
  PayPalButtons,
} from "@paypal/react-paypal-js";
const style = { layout: "vertical" };

function Payment() {
  const { userId } = useUser();
  const { reservation_id } = useParams();
  const lang = location.pathname.split("/")[1] || "en";
  const navigate = useNavigate();
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const initial_amount = queryParams.get("initial_amount");
  const total_amount = queryParams.get("total_amount");
  const [selectedPayment, setSelectedPayment] = useState("credit_card");
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [name, setName] = useState("");
  // const [final_price_pay, setFinal_price_pay] = useState(null);
  const [conversionRate, setConversionRate] = useState(0); // Store the conversion rate
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
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
    try {
      const res = await axios.post(`${API_URL}/payments/createPayment`, {
        user_id: userId || null,
        reservation_id: reservation_id,
        paymentMethod: selectedPayment,
        UserName: name,
        Phone_Number: phoneNumber,
        initialAmount:initial_amount
      });
      setResponse(res.data);
      window.scrollTo(0, 500);
      setTimeout(() => navigate(`/${lang}`), 5500);
    } catch (error) {
      console.error("Error confirming Payment:", error);
      setError(error.response?.data?.error || "An error occurred.");
    }
  };
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
    // const total_amount_usd = (final_price_pay / conversionRate).toFixed(2); // Convert JOD to USD
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
                    <Col sm={12} md={4} lg={4} className="mb-2">
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
                    <Col sm={12} md={4} lg={4} className="mb-2">
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
                    {/* Amazon */}
                    <Col sm={12} md={4} lg={4}>
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
                    </Col>
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

                    <input
                      className="input_payment my-2"
                      type="number"
                      required
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                      }}
                    />
                    {/* <Form.Select
                      aria-label="Default select example"
                      className="my-2"
                      value={final_price_pay ?? ""} 
                      onChange={(e) => setFinal_price_pay(e.target.value)}
                      required
                    >
                      <option>Choose Total Payment</option>
                      <option value={initial_amount}>Initial amount</option>
                      <option value={total_amount}>Total amount</option>
                    </Form.Select> */}

                    <PayPalButtons
                      style={style}
                      disabled={!name || !phoneNumber || !initial_amount}
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
                    via Cliq to the following phone number (0781234678),
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
                    <input
                      className="input_payment"
                      type="number"
                      required
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                      }}
                    />
                    <div className="col-auto text-center mt-2">
                      <button className="button button-primary btn_payment ">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* cash Info */}
              {selectedPayment === "cash" && (
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
                    <input
                      className="input_payment"
                      type="number"
                      required
                      onChange={(e) => {
                        setPhoneNumber(e.target.value);
                      }}
                    />
                    <div className="col-auto text-center mt-2">
                      <button className="button button-primary btn_payment ">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
        {response && (
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-lg-6 col-md-12 col-sm-12">
                <div className="message-box _success">
                  <img src={checked} alt="success" className="mb-3" />{" "}
                  <h4> Your payment was successful </h4>
                  <p> Thank you for your payment.</p>
                  {/* <p>Status: {response.status}</p>
                  <p>Order ID: {response.id}</p> */}
                  {/* <p>Name: {response.payer.name.given_name} {response.payer.name.surname}</p>
                  <p>Payer Id: {response.payer.name.payer_id}</p> */}
                  <p>Name: {response.payment.UserName}</p>
                  <p>Phone Number {response.payment.Phone_Number}</p>
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
