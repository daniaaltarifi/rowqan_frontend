import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../App";
import PhoneInput from "react-phone-number-input";
import Swal from 'sweetalert2';
import PropTypes from 'prop-types';
// Import Globe icon
import { Globe2 } from "lucide-react";

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
  const navigate = useNavigate();
  const { state } = location;
  const { reservation_id } = useParams();
  const lang = location.pathname.split("/")[1] || "en";
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

  // Function to toggle language
  const toggleLanguage = () => {
    const newLang = lang === "ar" ? "en" : "ar";
    
    // Get the current path without the language part
    const pathParts = location.pathname.split("/");
    pathParts[1] = newLang;
    const newPath = pathParts.join("/");
    
    // Navigate to the same page but with the new language
    navigate(newPath, { 
      state: location.state // Preserve the state when changing language
    });
  };
  
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
      setValidatePhone(lang === "ar" 
        ? "يجب أن يبدأ رقم الهاتف بـ +962" 
        : "Phone number must start with +962"
      );
      return;
    }
  
    if (!isValidPhoneNumber(formData.phoneNumber)) {
      setValidatePhone(lang === "ar" 
        ? "صيغة رقم الهاتف غير صحيحة." 
        : "Invalid phone number format."
      );
      return;
    }
  
    if (!formData.name.trim()) {
      setError(lang === "ar" 
        ? "الرجاء إدخال الاسم الكامل" 
        : "Please enter your full name"
      );
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
        `http://localhost:5000/payments/createPayment`,
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
          title: lang === "ar" ? 'تحذير' : 'Warning',
          text: lang === "ar" 
            ? 'جاري معالجة الدفع، ولكن تعذر تحديث حالة الحجز' 
            : 'Payment processing, but could not update reservation status',
          icon: 'warning',
          confirmButtonText: lang === "ar" ? 'موافق' : 'OK'
        });
      }
    } catch (error) {
      console.error("Error confirming Payment:", error);
      setError(
        error.response?.data?.error || 
        (lang === "ar" 
          ? "حدث خطأ أثناء عملية الدفع." 
          : "An error occurred during payment."
        )
      );
    } finally {
      setIsLoading(false);
    }
  };
  
  const renderPaymentMethods = () => (
    <div className="payment-type">
      <h4>{lang === "ar" ? "اختر طريقة الدفع" : "Select Payment Method"}</h4>
      <div className="types flex_display justify-space-between">
        <PaymentOption 
          type="cash" 
          icon="fas fa-money-bill" 
          text={lang === "ar" ? "الدفع النقدي" : "Cash Payment"} 
          selectedPayment={formData.selectedPayment}
          onPaymentTypeChange={handlePaymentTypeChange}
        />
        <PaymentOption 
          type="Cliq" 
          icon="fab fa-paypal" 
          text={lang === "ar" ? "الدفع بواسطة كليك" : "Pay with Cliq"} 
          selectedPayment={formData.selectedPayment}
          onPaymentTypeChange={handlePaymentTypeChange}
        />
      </div>
    </div>
  );

  const renderCliqInstructions = () => (
    formData.selectedPayment === "Cliq" && (
      <div className="mb-4">
        <h4>{lang === "ar" ? "تعليمات الدفع بكليك" : "Cliq Payment Instructions"}</h4>
        <p>{lang === "ar" ? "الرجاء إرسال الدفعة إلى: 077-534-7666" : "Please send payment to: 077-534-7666"}</p>
        <p>
          {lang === "ar" 
            ? "بعد الدفع، شارك الإيصال عبر واتساب لتأكيد حجزك." 
            : "After payment, share the receipt via WhatsApp to confirm your reservation."
          }
        </p>
      </div>
    )
  );

  const renderPaymentForm = () => (
    <form onSubmit={handleConfirmPayment} className="payment-form">
      <div className="form-group">
        <label className="label_of_payment">{lang === "ar" ? "الاسم الكامل" : "Full Name"}</label>
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
        <label className="label_of_payment">{lang === "ar" ? "رقم الهاتف" : "Phone Number"}</label>
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
          <label className="label_of_payment">
            {lang === "ar" ? "إيصال الدفع (اختياري)" : "Payment Receipt (Optional)"}
          </label>
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
        {isLoading 
          ? (lang === "ar" ? "جاري المعالجة..." : "Processing...") 
          : (lang === "ar" ? "تأكيد الدفع" : "Confirm Payment")
        }
      </button>
    </form>
  );

  const renderPaymentSummary = () => (
    <div className="payment-summary mt-4">
      <h4>{lang === "ar" ? "ملخص الدفع" : "Payment Summary"}</h4>
      <div className="summary-item">
        <span>{lang === "ar" ? "الاسم:" : "Name:"}</span>
        <span>{formData.name}</span>
      </div>
      <div className="summary-item">
        <span>{lang === "ar" ? "رقم الهاتف:" : "Phone Number:"}</span>
        <span>{formData.phoneNumber}</span>
      </div>
      <div className="summary-item">
        <span>{lang === "ar" ? "طريقة الدفع:" : "Payment Method:"}</span>
        <span>{formData.selectedPayment === "cash" 
          ? (lang === "ar" ? "نقداً" : "Cash") 
          : "Cliq"
        }</span>
      </div>
      <div className="summary-item">
        <span>{lang === "ar" ? "المبلغ الأولي:" : "Initial Amount:"}</span>
        <span>{initial_amount} JD</span>
      </div>
      <div className="summary-item">
        <span>{lang === "ar" ? "المبلغ الإجمالي:" : "Total Amount:"}</span>
        <span>{total_amount} JD</span>
      </div>
      <div className="summary-item">
        <span>{lang === "ar" ? "التاريخ:" : "Date:"}</span>
        <span>{new Date().toLocaleDateString(lang === "ar" ? "ar-SA" : undefined)}</span>
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
              <h4>{lang === "ar" ? "تم الدفع بنجاح" : "Payment Successful"}</h4>
              <div className="payment-details">
                <div className="detail-item">
                  <span>{lang === "ar" ? "الاسم:" : "Name:"}</span>
                  <span>{response.payment.UserName}</span>
                </div>
                <div className="detail-item">
                  <span>{lang === "ar" ? "رقم الهاتف:" : "Phone Number:"}</span>
                  <span>{response.payment.Phone_Number}</span>
                </div>
                <div className="detail-item">
                  <span>{lang === "ar" ? "رقم الحجز:" : "Reservation ID:"}</span>
                  <span>{response.payment.reservation_id}</span>
                </div>
                <div className="detail-item">
                  <span>{lang === "ar" ? "الحالة:" : "Status:"}</span>
                  <span>{response.payment.status === "Pending" 
                    ? (lang === "ar" ? "قيد الانتظار" : "Pending") 
                    : response.payment.status
                  }</span>
                </div>
                <div className="detail-item">
                  <span>{lang === "ar" ? "طريقة الدفع:" : "Payment Method:"}</span>
                  <span>{response.payment.paymentMethod === "cash" 
                    ? (lang === "ar" ? "نقداً" : "Cash") 
                    : "Cliq"
                  }</span>
                </div>
                <div className="detail-item">
                  <span>{lang === "ar" ? "المبلغ المدفوع:" : "Amount Paid:"}</span>
                  <span>{response.payment.initialAmount} JD</span>
                </div>
                <div className="detail-item">
                  <span>{lang === "ar" ? "التاريخ:" : "Date:"}</span>
                  <span>{new Date(response.payment.updatedAt).toLocaleDateString(lang === "ar" ? "ar-SA" : undefined)}</span>
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
              <h4>{lang === "ar" ? "فشل الدفع" : "Payment Failed"}</h4>
              <p className="text-danger">{error}</p>
            </div>
          </div>
        </div>
      </div>
    )
  );

  return (
    <div className="payment-page">
      {/* Language Switcher Button */}
      <div
        className="language-toggle-container"
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          zIndex: 1000,
        }}
      >
        <button
          onClick={toggleLanguage}
          className="btn btn-light rounded-circle p-2"
          style={{
            backgroundColor: "white",
            border: "1px solid #ddd",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          <Globe2 className="w-6 h-6" />
        </button>
      </div>
      
      <article className="card_cont">
        <div className="container main_cont_payment">
          <div className="card-title mb-5">
            <h2>{lang === "ar" ? "الدفع" : "Payment"}</h2>
            <h5>{lang === "ar" ? "المبلغ الأولي: " : "Initial Amount: "}{initial_amount} JD</h5>
            <h5>{lang === "ar" ? "المبلغ الإجمالي: " : "Total Amount: "}{total_amount} JD</h5>
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