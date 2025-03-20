import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../App";
import PhoneInput from "react-phone-number-input";
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';


import "react-phone-number-input/style.css";
import '../Css/Payment.css';


import checked from "../assets/checked.png";
import failed from "../assets/cross.png";


const PaymentOption = ({ type, icon, text, selectedPayment, onPaymentTypeChange }) => (
  <div 
    className={`type ${selectedPayment === type ? "selected" : ""}`}
    onClick={() => onPaymentTypeChange(type)}
  >
    <div className="logo_payment">
      <i className={icon}></i>
    </div>
    <div className="text">
      <p className="para_payment">{text}</p>
    </div>
  </div>
);

PaymentOption.propTypes = {
  type: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  selectedPayment: PropTypes.string.isRequired,
  onPaymentTypeChange: PropTypes.func.isRequired
};


function Payment() {
  
  const location = useLocation();
  const { state } = location;
  const { reservation_id } = useParams();
  const initial_amount = state?.initialAmount || "0";
  const total_amount = state?.totalAmount || "0"; 

  const [formData, setFormData] = useState({
    selectedPayment: "cash",
    phoneNumber: "+962",
    name: "",
    invoiceImg: null
  });
  
  const [error, setError] = useState(null);
  const [validatePhone, setValidatePhone] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);

  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  
  const isValidPhoneNumber = (phone) => {
    const phoneWithoutCode = phone.replace("+962", "");
    return /^(7\d{8})$/.test(phoneWithoutCode);
  };

  
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handlePaymentTypeChange = (paymentType) => {
    setFormData(prev => ({ 
      ...prev, 
      selectedPayment: paymentType,
      invoiceImg: null 
    }));
  };

  const handleConfirmPayment = async (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }
    
    
    setError(null);
    setValidatePhone(null);
  
    if (!formData.phoneNumber || !formData.phoneNumber.startsWith("+962")) {
      setValidatePhone("Phone number must start with +962");
      return;
    }
  
    if (!isValidPhoneNumber(formData.phoneNumber)) {
      setValidatePhone("Invalid phone number format.");
      return;
    }
  
    if (!formData.name.trim()) {
      setError("Please enter your full name");
      return;
    }
  
    setIsLoading(true);
  
    try {
      const paymentData = {
        reservation_id: Number(reservation_id),
        paymentMethod: formData.selectedPayment,
        UserName: formData.name,
        Phone_Number: formData.phoneNumber,
        initialAmount: initial_amount,
        Status: 'Pending',  
        payment_status: 'Pending' 
      };

      const formDataToSend = new FormData();
      Object.keys(paymentData).forEach(key => {
        formDataToSend.append(key, paymentData[key]);
      });

      if (formData.invoiceImg) {
        formDataToSend.append('image', formData.invoiceImg);
      }

      const paymentResponse = await axios.post(
        `${API_URL}/payments/createPayment`, 
        formDataToSend, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      setResponse(paymentResponse.data);

      
      try {
        await axios.post(`${API_URL}/reservations/${reservation_id}`, {
          Status: 'Pending',
          payment_status: 'Pending'
        });
      } catch (updateError) {
        console.error('Error updating reservation status:', updateError);
        Swal.fire({
          title: 'Warning',
          text: 'Payment processing, but could not update reservation status',
          icon: 'warning',
          confirmButtonText: 'OK'
        });
      }
    } catch (error) {
      console.error("Error confirming Payment:", error);
      setError(error.response?.data?.error || "An error occurred during payment.");
    } finally {
      setIsLoading(false);
    }
  };

  
  const renderPaymentMethods = () => (
    <div className="payment-type">
      <h4>Select Payment Method</h4>
      <div className="types flex_display justify-space-between">
        <PaymentOption 
          type="cash" 
          icon="fas fa-money-bill" 
          text="Cash Payment" 
          selectedPayment={formData.selectedPayment}
          onPaymentTypeChange={handlePaymentTypeChange}
        />
        <PaymentOption 
          type="Cliq" 
          icon="fab fa-paypal" 
          text="Pay with Cliq" 
          selectedPayment={formData.selectedPayment}
          onPaymentTypeChange={handlePaymentTypeChange}
        />
      </div>
    </div>
  );

  const renderCliqInstructions = () => (
    formData.selectedPayment === "Cliq" && (
      <div className="mb-4">
        <h4>Cliq Payment Instructions</h4>
        <p>Please send payment to: 077-534-7666</p>
        <p>After payment, share the receipt via WhatsApp to confirm your reservation.</p>
      </div>
    )
  );

  const renderPaymentForm = () => (
    <form onSubmit={handleConfirmPayment} className="payment-form">
      <div className="form-group">
        <label className="label_of_payment">Full Name</label>
        <input
          type="text"
          className="input_payment"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
        />
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="form-group">
        <label className="label_of_payment">Phone Number</label>
        <PhoneInput
          value={formData.phoneNumber}
          onChange={(value) => setFormData(prev => ({ ...prev, phoneNumber: value || "+962" }))}
          defaultCountry="JO"
          international
          className="phone-input"
        />
        {validatePhone && <div className="error-message">{validatePhone}</div>}
      </div>

      {formData.selectedPayment === "Cliq" && (
        <div className="form-group">
          <label className="label_of_payment">Payment Receipt (Optional)</label>
          <input
            type="file"
            className="form-control"
            name="invoiceImg"
            onChange={handleInputChange}
            accept="image/*"
          />
        </div>
      )}

      <button 
        type="submit" 
        className="button button-primary btn_payment"
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Confirm Payment"}
      </button>
    </form>
  );

  const renderPaymentSummary = () => (
    <div className="payment-summary mt-4">
      <h4>Payment Summary</h4>
      <div className="summary-item">
        <span>Name:</span>
        <span>{formData.name}</span>
      </div>
      <div className="summary-item">
        <span>Phone Number:</span>
        <span>{formData.phoneNumber}</span>
      </div>
      <div className="summary-item">
        <span>Payment Method:</span>
        <span>{formData.selectedPayment}</span>
      </div>
      <div className="summary-item">
        <span>Initial Amount:</span>
        <span>{initial_amount} JD</span>
      </div>
      <div className="summary-item">
        <span>Total Amount:</span>
        <span>{total_amount} JD</span>
      </div>
      <div className="summary-item">
        <span>Date:</span>
        <span>{new Date().toLocaleDateString()}</span>
      </div>
    </div>
  );

  const renderSuccessMessage = () => (
    response && (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="message-box _success">
              <img src={checked} alt="Success" className="mb-3" />
              <h4>Payment Successful</h4>
              <div className="payment-details">
                <div className="detail-item">
                  <span>Name:</span>
                  <span>{response.payment.UserName}</span>
                </div>
                <div className="detail-item">
                  <span>Phone Number:</span>
                  <span>{response.payment.Phone_Number}</span>
                </div>
                <div className="detail-item">
                  <span>Reservation ID:</span>
                  <span>{response.payment.reservation_id}</span>
                </div>
                <div className="detail-item">
                  <span>Status:</span>
                  <span>{response.payment.status}</span>
                </div>
                <div className="detail-item">
                  <span>Payment Method:</span>
                  <span>{response.payment.paymentMethod}</span>
                </div>
                <div className="detail-item">
                  <span>Amount Paid:</span>
                  <span>{response.payment.initialAmount} JD</span>
                </div>
                <div className="detail-item">
                  <span>Date:</span>
                  <span>{new Date(response.payment.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );

  const renderErrorMessage = () => (
    error && (
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-12 col-sm-12">
            <div className="message-box _failed">
              <img src={failed} alt="Failed" className="mb-3" />
              <h4>Payment Failed</h4>
              <p className="text-danger">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  );

  
  return (
    <div className="payment-page">
      <article className="card_cont">
        <div className="container main_cont_payment">
          <div className="card-title mb-5">
            <h2>Payment</h2>
            <h5>Initial Amount: {initial_amount} JD</h5>
            <h5>Total Amount: {total_amount} JD</h5>
          </div>

          <div className="card-body">
            {renderPaymentMethods()}
            {renderCliqInstructions()}
            {renderPaymentForm()}
            {renderPaymentSummary()}
          </div>
        </div>

        {renderSuccessMessage()}
        {renderErrorMessage()}
      </article>
    </div>
  );
}

export default Payment;