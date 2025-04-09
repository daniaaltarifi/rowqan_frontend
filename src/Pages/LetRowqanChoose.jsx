import React, { useState, useEffect } from "react";
import { Globe2, Calendar, Check, PhoneCall, MapPin } from "lucide-react";
import DatePicker from "react-datepicker";
import PropTypes from "prop-types";
import "react-datepicker/dist/react-datepicker.css";
import emailjs from "@emailjs/browser";
import Swal from "sweetalert2";
import { API_URL } from "../App";
import SocialMediaButtons from "../Component/SocialMediaButtons";

const translations = {
  ar: {
    pageTitle: "خليها علينا",
    subTitle: "دع روقان يختار لك",
    reservationType: "نوع الحجز",
    required: "مطلوب",
    other: 'أخرى',
    types: {
      family: "عائلي",
      shabab: "شباب",
      banat: "بنات",
      romantic: "رومانسي",
      birthday: "عيد ميلاد",
      graduation: "تخرج",
      wedding: "زفاف / خطوبة",
      
    },
    familyDetails: {
      title: "تفاصيل العائلات",
      numberOfFamilies: "عدد العائلات",
      familyCount: "كم عدد العائلات؟",
    },
    duration: {
      title: "مدة الحجز والتاريخ",
      startDate: "تاريخ البداية",
      selectDate: "اختر التاريخ",
      selectDuration: "اختر المدة",
      options: {
        oneDay: "يوم واحد (10 صباحاً - 9 مساءً)",
        oneNight: "ليلة واحدة (9 مساءً - 10 صباحاً)",
        twoDaysMorning: "يومان - يبدأ صباحاً",
        twoDaysEvening: "يومان - يبدأ مساءً",
        oneWeek: "أسبوع",
        oneMonth: "شهر",
        custom: "مدة مخصصة",
      },
    },
    visitors: {
      title: "عدد الزوار",
      count: "عدد الأشخاص",
    },
    facilities: {
      title: "المرافق والميزات",
      outdoorPool: "مسبح خارجي",
      indoorPool: "مسبح داخلي",
      heatedPool: "مسبح مدفأ",
      footballField: "ملعب كرة قدم",
      tableTennis: "تنس طاولة",
      foosball: "كرة قدم طاولة",
      bbqArea: "منطقة شواء",
      scenicView: "إطلالة جميلة",
      fullPrivacy: "خصوصية كاملة",
      newChalet: "شاليه جديد",
      numberOfRooms: "عدد الغرف",
    },
    rating: {
      title: "تصنيف الشاليه المفضل",
      selectRating: "اختر التصنيف",
      stars: {
        three: "★★★ (3 نجوم)",
        four: "★★★★ (4 نجوم)",
        five: "★★★★★ (5 نجوم)",
      },
    },
    calendar: {
      months: [
        "يناير",
        "فبراير",
        "مارس",
        "إبريل",
        "مايو",
        "يونيو",
        "يوليو",
        "أغسطس",
        "سبتمبر",
        "أكتوبر",
        "نوفمبر",
        "ديسمبر",
      ],
      days: ["أحد", "اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"],
      today: "اليوم",
      clear: "مسح",
    },
    location: {
      title: "الموقع المفضل",
      options: {
        amman: "عمان",
        salt: "السلط",
        jerash: "جرش",
        ajloun: "عجلون",
        deadSea: "البحر الميت",
        Irbid:"اربد",
        Perrin:"بيرين",
        Airport_Road:"طريق المطار",
        other: "أخرى",
        currentLocation: "موقعي الحالي",
      },
      placeholder: "أدخل موقعًا آخر",
      currentLocation: {
        buttonLabel: "موقعي الحالي",
        capture: {
          longitude: "خط الطول",
          latitude: "خط العرض",
          capturedAt: "وقت التقاط الموقع",
        },
        openMapLabel: "افتح الموقع على الخريطة",
        errors: {
          notSupported: "خدمة الموقع غير متوفرة على هذا المتصفح.",
          permissionDenied:
            "تم رفض الوصول إلى الموقع. يرجى التأكد من تشغيل خدمات الموقع.",
          positionUnavailable: "معلومات الموقع غير متوفرة حاليًا.",
        },
      },
      
    },
    budget: {
      title: "الميزانية",
      placeholder: "أدخل الميزانية بالدينار الأردني",
      required: "مطلوب",
      validationMessages: {
        family: "الحد الأدنى للميزانية للحجز العائلي 70 دينار",
        shabab: "الحد الأدنى للميزانية لحجز الشباب 80 دينار",
        banat: "الحد الأدنى للميزانية لحجز البنات 80 دينار",
        romantic: "الحد الأدنى للميزانية للحجز الرومانسي 90 دينار",
        birthday: "الحد الأدنى للميزانية لحجز عيد الميلاد 100 دينار",
        graduation: "الحد الأدنى للميزانية لحجز التخرج 120 دينار",
        wedding: "الحد الأدنى للميزانية لحجز الزفاف 180 دينار",
      },
    },
    additionalNotes: {
      title: "ملاحظات إضافية",
      placeholder: "أدخل أي ملاحظات أو طلبات خاصة",
    },
    contact: {
      title: "معلومات التواصل",
      fullName: {
        label: "الاسم الكامل",
        placeholder: "أدخل اسمك الكامل",
        error: "الاسم الكامل مطلوب",
      },
      phoneNumber: {
        label: "رقم الهاتف",
        placeholder: "مثال: +962 79xxxxxxx",
        error: "رقم الهاتف مطلوب",
        invalidError: "يرجى إدخال رقم هاتف أردني صحيح (مثل: +962 79xxxxxxx)",
      },
      contactMethod: {
        call: "اتصال",
        whatsapp: "واتساب",
      },
      callButton: {
        label: "اتصال",
        number: "0786399917",
      },
      whatsappButton: {
        label: "مراسلة على واتساب",
        number: "0786399917",
        defaultMessage: "مرحبًا، أود الاستفسار عن حجز شاليه",
      },
    },
    submission: {
      buttonLabel: "أرسل الطلب الآن",
      successTitle: "تم إرسال الطلب بنجاح!",
      successMessage: "طلبك ارسل بنجاح رح بتم التواصل معك من قبل فريق روقان.",
      errorTitle: "خطأ في الإرسال",
      errorMessage: "عذرًا، حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.",
      okButton: "حسنًا",
    },
  },
  en: {
    pageTitle: "Let Rowqan Choose",
    other: 'Other',
    subTitle: "Let us handle your reservation",
    reservationType: "Reservation Type",
    required: "Required",
    types: {
      family: "Family",
      shabab: "Shabab",
      banat: "Banat",
      romantic: "Romantic",
      birthday: "Birthday",
      graduation: "Graduation",
      wedding: "Wedding / Engagement",
    },
    familyDetails: {
      title: "Family Details",
      numberOfFamilies: "Number of Families",
      familyCount: "How many families?",
    },
    duration: {
      title: "Reservation Duration & Date",
      startDate: "Start Date",
      selectDate: "Select Date",
      selectDuration: "Select Duration",
      options: {
        oneDay: "One day (10 AM – 9 PM)",
        oneNight: "One night (9 PM – 10 AM)",
        twoDaysMorning: "Two days – Starting Morning",
        twoDaysEvening: "Two days – Starting Evening",
        oneWeek: "One week",
        oneMonth: "One month",
        custom: "Custom Duration",
      },
    },
    visitors: {
      title: "Number of Visitors",
      count: "Number of people",
    },
    facilities: {
      title: "Facilities & Features",
      outdoorPool: "Outdoor Pool",
      indoorPool: "Indoor Pool",
      heatedPool: "Heated Pool",
      footballField: "Football Field",
      tableTennis: "Table Tennis",
      foosball: "Foosball",
      bbqArea: "BBQ Area",
      scenicView: "Scenic View",
      fullPrivacy: "Full Privacy",
      newChalet: "New Chalet",
      numberOfRooms: "Number of Rooms",
    },
    rating: {
      title: "Preferred Chalet Rating",
      selectRating: "Select Rating",
      stars: {
        three: "★★★ (3 Stars)",
        four: "★★★★ (4 Stars)",
        five: "★★★★★ (5 Stars)",
      },
    },
    calendar: {
      months: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      today: "Today",
      clear: "Clear",
    },
    location: {
      title: "Preferred Location",
      options: {
        amman: "Amman",
        salt: "Salt",
        jerash: "Jerash",
        ajloun: "Ajloun",
        deadSea: "Dead Sea",
        Irbid:"Irbid",
        Perrin:"Perrin",
        Airport_Road: "Airport_Road",
        other: "Other",
        currentLocation: "My Location",
      },
      placeholder: "Enter another location",
      currentLocation: {
        buttonLabel: "My Location",
        capture: {
          longitude: "Longitude",
          latitude: "Latitude",
          capturedAt: "Location captured at",
        },
        openMapLabel: "Open Location on Map",
        errors: {
          notSupported: "Geolocation is not supported by this browser.",
          permissionDenied:
            "Location access was denied. Please ensure location services are enabled.",
          positionUnavailable: "Location information is currently unavailable.",
        },
      },
    },
    budget: {
      title: "Budget",
      placeholder: "Enter total budget in JOD",
      required: "Required",
      validationMessages: {
        family: "Minimum budget for Family reservation is 70 JOD",
        shabab: "Minimum budget for Shabab reservation is 80 JOD",
        banat: "Minimum budget for Banat reservation is 80 JOD",
        romantic: "Minimum budget for Romantic reservation is 90 JOD",
        birthday: "Minimum budget for Birthday reservation is 100 JOD",
        graduation: "Minimum budget for Graduation reservation is 120 JOD",
        wedding: "Minimum budget for Wedding reservation is 180 JOD",
        invalid: "Budget is invalid for the selected reservation type",
      },
    },
    additionalNotes: {
      title: "Additional Notes",
      placeholder: "Enter any special requests or notes",
    },
    contact: {
      title: "Contact Information",
      fullName: {
        label: "Full Name",
        placeholder: "Enter your full name",
        error: "Full name is required",
      },
      phoneNumber: {
        label: "Phone Number",
        placeholder: "Example: +962 79xxxxxxx",
        error: "Phone number is required",
        invalidError:
          "Please enter a valid Jordanian phone number (e.g., +962 79xxxxxxx)",
      },
      contactMethod: {
        call: "Call",
        whatsapp: "WhatsApp",
      },
      callButton: {
        label: "Call",
        number: "0786399917",
      },
      whatsappButton: {
        label: "Message on WhatsApp",
        number: "0786399917",
        defaultMessage:
          "Hello, I would like to inquire about a chalet reservation",
      },
    },
    submission: {
      buttonLabel: "Submit Request Now",
      successTitle: "Request Submitted Successfully!",
      successMessage:
        "Your request has been sent successfully. A member of the Rowqan team will contact you.",
      errorMessage:
        "Sorry, an error occurred while sending the request. Please try again.",
      okButton: "OK",
    },
  },
};

const backgroundStyle = {
  background: `linear-gradient(135deg, 
      #6DA6BA 0%, 
      #AFB7AB 50%, 
      #F2C79D 100%)`,
  backgroundSize: "200% 200%",
  animation: "gradientShift 5s ease infinite",
};

const CustomDatePickerInput = React.forwardRef(
  ({ value, onClick, placeholder, lang }, ref) => {
    return (
      <div className="relative">
        <input
          type="text"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer bg-white text-center"
          onClick={onClick}
          value={value}
          placeholder={placeholder}
          readOnly
          ref={ref}
        />
        <Calendar
          className={`absolute ${
            lang === "ar" ? "left-3" : "right-3"
          } top-3 h-5 w-5 text-gray-400`}
        />
      </div>
    );
  }
);

CustomDatePickerInput.displayName = "CustomDatePickerInput";

CustomDatePickerInput.propTypes = {
  value: PropTypes.string,
  onClick: PropTypes.func,
  placeholder: PropTypes.string,
  lang: PropTypes.oneOf(["ar", "en"]),
};

CustomDatePickerInput.defaultProps = {
  value: "",
  onClick: () => {},
  placeholder: "",
  lang: "ar",
};

const handleDirectCall = () => {
  const phoneNumber = "0786399917";

  try {
    const cleanedNumber = phoneNumber.replace(/\D/g, "");

    window.location.href = `tel:+962${cleanedNumber.slice(1)}`;
  } catch (error) {
    const confirmation = window.confirm(
      `سيتم الاتصال على الرقم: ${phoneNumber}`
    );

    if (confirmation) {
      alert(`The Calling does not support ${error}`);
    }
  }
};

const LetRowqanChoose = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState(null);

  const [lang, setLang] = useState("en");
  const [reservationType, setReservationType] = useState("");
  const [familyCount, setFamilyCount] = useState(1);
  const [startDate, setStartDate] = useState(null);
  const [duration, setDuration] = useState("");
  const [visitorCount, setVisitorCount] = useState(1);
  const [facilities, setFacilities] = useState({
    outdoorPool: false,
    indoorPool: false,
    heatedPool: false,
    footballField: false,
    tableTennis: false,
    foosball: false,
    bbqArea: false,
    scenicView: false,
    fullPrivacy: false,
    newChalet: false,
  });

  useEffect(() => {
    emailjs.init({
      publicKey: "5MLzPwwzLqFmboNft",
      blockHeadless: true,
      limitRate: {
        id: "app",
        throttle: 10000,
      },
    });
  }, []);

  

  const [numberOfRooms, setNumberOfRooms] = useState(1);
  const [rating, setRating] = useState("");

  const [location, setLocation] = useState("");
  const [otherLocation, setOtherLocation] = useState("");
  const [currentLocation, setCurrentLocation] = useState(null);

  const [budget, setBudget] = useState("");
  const [budgetError, setBudgetError] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [contactMethod, setContactMethod] = useState("call");
  const [fullNameError, setFullNameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const [locationError, setLocationError] = useState(null);

  const [otherType, setOtherType] = useState("");

  const [typeError, setTypeError] = useState("");

  const [otherRating, setOtherRating] = useState("");
  const [ratingError, setRatingError] = useState("");

  const [otherDuration, setOtherDuration] = useState("");
  const [durationError, setDurationError] = useState("");

  const [showOtherFacility, setShowOtherFacility] = useState(false);
  const [otherFacility, setOtherFacility] = useState("");

  const handleRatingChange = (e) => {
    const value = e.target.value;
    setRating(value);
    if (value !== "other") {
      setOtherRating("");
    }
    setRatingError("");
  };

  const handleTypeSelection = (key) => {
    setReservationType(key);
    setTypeError("");
    if (key !== "other") {
      setOtherType("");
    }
  };


  
  const handleDurationChange = (key) => {
    setDuration(key);
    if (key !== 'other') {
      setOtherDuration('');  
    }
    setDurationError('');
  };


  const handleInputChange = (e) => {
    const value = e.target.value;
    // Allow numbers starting from 0
    if (value === "" || /^\d+$/.test(value)) {
      const numValue = value === "" ? 0 : parseInt(value);
      // Allow 0 in the input field
      if (numValue >= 0) {
        setFamilyCount(numValue);
      }
    }
  };

  const handleFacilityChange = (key, checked) => {
    setFacilities({
      ...facilities,
      [key]: checked,
    });
  };

  
  const [, setIsSubmitted] = useState(false);

  const t = translations[lang];

  const toggleLanguage = () => {
    setLang(lang === "ar" ? "en" : "ar");
  };






  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const getFinalValue = (standardValue, isOther, otherValue) => {
        return isOther === 'other' ? otherValue : standardValue;
    };



    const formatPhoneForAPI = (phone) => {
     
      let cleaned = phone.replace(/\D/g, '');
      
      
      if (cleaned.startsWith('962')) {
          cleaned = cleaned.substring(3);
      }
      
      
      if (cleaned.startsWith('0')) {
          cleaned = cleaned.substring(1);
      }
      
      
      if (cleaned.length !== 9) {
          throw new Error('رقم الهاتف يجب أن يكون 9 أرقام');
      }
      
      
      return "+962" + cleaned;
  };
    
    const selectedFacilities = Object.entries(facilities)
        .filter(([, isSelected]) => isSelected)
        .map(([facility]) => facility);

    if (showOtherFacility && otherFacility) {
        selectedFacilities.push(otherFacility);
    }

    
    const requestData = {
        reservation_type: reservationType === 'other' ? otherType : reservationType,
        Rating: rating === 'other' ? parseInt(otherRating) : 
               rating === 'five' ? 5 : 
               rating === 'four' ? 4 : 
               rating === 'three' ? 3 : null,
        startDate: startDate ? startDate.toISOString().split('T')[0] : null,
        Duration: duration === 'other' ? otherDuration : t.duration.options[duration],
        number_of_visitors: visitorCount,
        Facilities: selectedFacilities,
        number_of_rooms: numberOfRooms,
        Preferred_Location: location === 'other' ? otherLocation : t.location.options[location],
        Budget: parseFloat(budget),
        Additional_Notes: additionalNotes,
        Full_Name: fullName,
        Phone_Number: formatPhoneForAPI(phoneNumber) 
    };

    try {
        
        const apiResponse = await fetch(`${API_URL}/RowqanChoose/createChoose`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData)
        });

        if (!apiResponse.ok) {
            throw new Error(`HTTP error! status: ${apiResponse.status}`);
        }

        
        const emailParams = {
            to_email: "khalidnaser245@gmail.com",
            from_name: String(fullName || "Unknown Sender"),
            phone_number: String(phoneNumber || "No Phone"),
            contact_method: String(contactMethod || "Not Specified"),
            reservation_type: String(reservationType || "No Type Selected"),
            start_date: startDate ? startDate.toLocaleDateString() : "No Date",
            duration: String(getFinalValue(duration, duration, otherDuration) || "Unspecified"),
            visitor_count: String(visitorCount || 0),
            family_count: reservationType === "family" ? String(familyCount) : "N/A",
            number_of_rooms: String(numberOfRooms || 0),
            rating: String(rating || "No Rating"),
            location: getLocationLink(),
            facilities: selectedFacilities.join(", ") || "No Facilities",
            budget: `${String(budget || 0)} JOD`,
            additional_notes: String(additionalNotes || "No Additional Notes"),
        };

        const emailResult = await emailjs.send(
            "service_y4q64ed",
            "template_yt4v1gr",
            emailParams,
            "5MLzPwwzLqFmboNft"
        );

      
        console.log(emailResult)
    

        
        resetForm();
        setSubmissionStatus("success");

    } catch (error) {
        console.error("Error:", error);

        let errorMessage = "حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.";

        if (error.status === 412) {
            errorMessage = "خطأ في المصادقة. يرجى التحقق من إعدادات EmailJS.";
        } else if (error.status === 429) {
            errorMessage = "تم تجاوز حد الإرسال. يرجى المحاولة لاحقًا.";
        } else if (error.status === 400) {
            errorMessage = "خطأ في البيانات المرسلة. يرجى التحقق من صحة المدخلات.";
        }

        Swal.fire({
            icon: "error",
            title: "Error!",
            text: errorMessage,
            confirmButtonColor: "#d33",
            confirmButtonText: "OK",
        });

        setSubmissionStatus("error");
    } finally {
        setIsSubmitting(false);
    }
};

  const getLocationLink = () => {
    if (currentLocation) {
      const mapsUrl = `https://www.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}`;
      return `${t.location.currentLocation.label}: ${mapsUrl}`;
    }

    if (location && location !== "other") {
      const locationCoordinates = {
        amman: "31.9454,35.9284",
        salt: "32.0385,35.7272",
        jerash: "32.2808,35.8917",
        ajloun: "32.3328,35.7519",
        deadSea: "31.5590,35.4732",
      };

      if (locationCoordinates[location]) {
        const mapsUrl = `https://www.google.com/maps?q=${locationCoordinates[location]}`;
        return `${t.location.options[location]}: ${mapsUrl}`;
      }

      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        t.location.options[location]
      )}`;
      return `${t.location.options[location]}: ${mapsUrl}`;
    }

    if (location === "other" && otherLocation.trim()) {
      const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        otherLocation
      )}`;
      return `${t.location.options.other}: ${otherLocation} - ${mapsUrl}`;
    }

    return "No Location";
  };

  const handleWhatsAppMessage = () => {
    const phoneNumber = "0786399917".replace(/\D/g, "");

    const whatsappUrl = `https://api.whatsapp.com/send?phone=962${phoneNumber.slice(
      1
    )}&text=${encodeURIComponent(t.contact.whatsappButton.defaultMessage)}`;

    try {
      window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      window.location.href = whatsappUrl;
      console.log(`Faild to sending the whats app ${error}`);
    }
  };

  const WhatsAppIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-6 h-6 mr-2"
    >
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.07 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.817 9.817 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.42 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.95-.4-4.22-1.15l-.69-.43-3.73 1 1.05-3.65-.5-.72c-.83-1.29-1.26-2.8-1.26-4.34 0-4.33 3.53-7.86 7.87-7.86zm1.54 5.55c-.3 0-.77.11-1.17.56-.41.45-1.56 1.53-1.56 3.73 0 2.21 1.61 4.35 1.84 4.65.23.3 3.18 5.09 7.87 6.76 3.89 1.52 4.68 1.22 5.52 1.14.84-.08 2.71-1.11 3.09-2.18.38-1.07.38-1.98.27-2.18-.12-.2-.42-.31-.87-.56-.46-.25-2.71-1.34-3.12-1.49-.4-.15-.71-.23-1.01.23-.3.45-1.15 1.49-1.41 1.79-.26.3-.52.34-.97.11-.46-.25-1.93-.71-3.68-2.27-1.36-1.21-2.27-2.71-2.53-3.16-.26-.45-.03-.69.2-.92.21-.21.46-.56.69-.84.23-.28.31-.45.46-.75.15-.3.08-.58-.04-.84-.12-.25-1.09-2.64-1.49-3.61-.38-.95-.77-.83-1.07-.84z" />
    </svg>
  );



  const handleOtherRatingChange = (e) => {

    const value = e.target.value;
    const numberValue = value.replace(/[^0-9]/g, "");

    if (numberValue === "") {
      setOtherRating("");
      setRatingError("This field is required");
    } else {
      const num = parseInt(numberValue);
      if (num >= 1 && num <= 10) {
        setOtherRating(numberValue);
        setRatingError("");
      }
    }
  };

  const validateRating = () => {
    if (!rating) {
      setRatingError("Please select a rating");
      return false;
    }
    if (rating === "other" && !otherRating) {
      setRatingError("Please enter a rating value");
      return false;
    }
    return true;
  };

  const validateFullName = () => {
    if (!fullName.trim()) {
      setFullNameError(t.contact.fullName.error);
      return false;
    }
    setFullNameError("");
    return true;
  };

  const validatePhoneNumber = () => {
    const jordanianPhoneRegex = /^(\+962|962)?(7|9)\d{8}$|^0(7|9)\d{8}$/;

    const cleanedPhoneNumber = phoneNumber.replace(/[\s-]/g, "");

    if (!cleanedPhoneNumber) {
      setPhoneNumberError(t.contact.phoneNumber.error);
      return false;
    }

    if (!jordanianPhoneRegex.test(cleanedPhoneNumber)) {
      setPhoneNumberError(t.contact.phoneNumber.invalidError);
      return false;
    }

    const formattedNumber = formatPhoneNumber(cleanedPhoneNumber);
    setPhoneNumber(formattedNumber);
    setPhoneNumberError("");
    return true;
  };

  const formatPhoneNumber = (phoneNum) => {
    const cleaned = phoneNum.replace(/\D/g, "");

    if (cleaned.startsWith("07") || cleaned.startsWith("09")) {
      return `+962 ${cleaned.slice(1)}`;
    }

    if (cleaned.startsWith("7") || cleaned.startsWith("9")) {
      return `+962 ${cleaned}`;
    }

    if (cleaned.startsWith("962")) {
      return `+962 ${cleaned.slice(3)}`;
    }

    return phoneNum;
  };

  const resetForm = () => {
    setReservationType("");
    setFamilyCount(1);
    setStartDate(null);
    setDuration("");
    setVisitorCount(1);
    setFacilities({
      outdoorPool: false,
      indoorPool: false,
      heatedPool: false,
      footballField: false,
      tableTennis: false,
      foosball: false,
      bbqArea: false,
      scenicView: false,
      fullPrivacy: false,
      newChalet: false,
    });
    setNumberOfRooms(1);
    setRating("");
    setLocation("");
    setOtherLocation("");
    setBudget("");
    setAdditionalNotes("");
    setFullName("");
    setPhoneNumber("");
    setContactMethod("call");
    setIsSubmitted(false);
  };

  const handleGetCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationData = {
            latitude,
            longitude,
            timestamp: new Date(position.timestamp).toLocaleString(),
          };
          setCurrentLocation(locationData);
          setLocationError(null);
        },
        (error) => {
          let errorMessage;
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = t.location.currentLocation.errors.permissionDenied;
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage =
                t.location.currentLocation.errors.positionUnavailable;
              break;
            default:
              errorMessage = t.location.currentLocation.errors.notSupported;
          }
          setLocationError(errorMessage);
          setCurrentLocation(null);
        }
      );
    } else {
      setLocationError(t.location.currentLocation.errors.notSupported);
    }
  };

  const openLocationOnMap = () => {
    if (currentLocation) {
      const { latitude, longitude } = currentLocation;
      const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
      window.open(googleMapsUrl, "_blank", "noopener,noreferrer");
    }
  };

  const locale = {
    localize: {
      month: (n) => t.calendar.months[n],
      day: (n) => t.calendar.days[n],
    },
    formatLong: {
      date: () => "MM/dd/yyyy",
    },
  };

  const validateBudget = (value) => {
    if (!reservationType) {
      setBudgetError(


        lang === "ar"
          ? "يرجى اختيار نوع الحجز أولاً"
          : "Please select a reservation type first"
      );
      return false;
    }

    const numericBudget = parseFloat(value);

    const minimumBudgets = {
      family: 70,
      shabab: 80,
      banat: 80,
      romantic: 90,
      birthday: 100,
      graduation: 120,
      wedding: 180,
    };

    const minBudget = minimumBudgets[reservationType];

    if (isNaN(numericBudget) || numericBudget < minBudget) {
      setBudgetError(t.budget.validationMessages[reservationType]);
      return false;
    }

    setBudgetError("");
    return true;
  };

  const handleBudgetChange = (e) => {
    const value = e.target.value;
    setBudget(value);
    validateBudget(value);
  };

  if (submissionStatus) {
    return (
      <div
        className="modal d-block"
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content text-center p-4">
            <div className="d-flex justify-content-center mb-4">
              {submissionStatus === "success" ? (
                <Check
                  className="text-success"
                  style={{ width: "4rem", height: "4rem" }}
                />
              ) : (
                <div
                  className="text-danger"
                  style={{ width: "4rem", height: "4rem" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>
              )}
            </div>
            <h2 className="fs-1 fw-bold mb-4 text-dark">
              {submissionStatus === "success"
                ? t.submission.successTitle
                : t.submission.errorTitle}
            </h2>
            <p className="text-secondary mb-4">
              {submissionStatus === "success"
                ? t.submission.successMessage
                : t.submission.errorMessage}
            </p>
            <button
              onClick={() => setSubmissionStatus(null)}
              className="btn btn-primary w-100 py-3 rounded"
            >
              {t.submission.okButton}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
    className={`min-vh-100 bg-light ${lang === "ar" ? "rtl" : "ltr"}`} 
  >
      <div className="container py-4">
        <SocialMediaButtons/>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center py-4">
          <div>
            <h1 className="display-5 fw-bold text-dark">{t.pageTitle}</h1>
            <p className="mt-2 text-secondary">{t.subTitle}</p>
          </div>
          {/* <button
            onClick={toggleLanguage}
            className="btn btn-light rounded-circle p-2"
            aria-label="Toggle language"
          >
            <Globe2 className="w-6 h-6" />
          </button> */}
        </div>

        {/* Form */}
        <div className="bg-white shadow rounded p-4 w-100">
          <form className="row g-4">
            {/* Reservation Type */}
            <div className="col-12">
              <label className="form-label fw-medium">
                {t.reservationType} <span className="text-danger">*</span>
              </label>
              <div className="row g-3">
                {/* Standard Options */}
                {Object.entries(t.types).map(([key, value]) => (
                  <div className="col-12 col-md-6 col-lg-4" key={key}>
                    <div
                      className={`
                cursor-pointer rounded border p-3
                ${
                  reservationType === key
                    ? "border-primary bg-primary bg-opacity-10"
                    : typeError
                    ? "border-danger border-2"
                    : "border-secondary-subtle"
                }
              `}
                      onClick={() => handleTypeSelection(key)}
                    >
                      <div className="d-flex align-items-center">
                        <div className="form-check">
                          <input
                            className={`form-check-input ${
                              typeError ? "is-invalid" : ""
                            }`}
                            type="radio"
                            name="reservationType"
                            id={`type-${key}`}
                            checked={reservationType === key}
                            onChange={() => handleTypeSelection(key)}
                            required
                          />
                          <label
                            className="form-check-label"
                            htmlFor={`type-${key}`}
                          >
                            {value}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Other Option */}
                <div className="col-12 col-md-6 col-lg-4">
                  <div
                    className={`
              cursor-pointer rounded border p-3
              ${
                reservationType === "other"
                  ? "border-primary bg-primary bg-opacity-10"
                  : typeError
                  ? "border-danger border-2"
                  : "border-secondary-subtle"
              }
            `}
                    onClick={() => handleTypeSelection("other")}
                  >
                    <div className="d-flex align-items-center">
                      <div className="form-check">
                        <input
                          className={`form-check-input ${
                            typeError ? "is-invalid" : ""
                          }`}
                          type="radio"
                          name="reservationType"
                          id="type-other"
                          checked={reservationType === "other"}
                          onChange={() => handleTypeSelection("other")}
                          required
                        />
                        <label
                          className="form-check-label"
                          htmlFor="type-other"
                        >
                          Other
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Text Field for Other Option */}
                {reservationType === "other" && (
                  <div className="col-12">
                    <input
                      type="text"
                      className={`form-control ${
                        typeError && !otherType ? "is-invalid" : ""
                      }`}
                      placeholder="Please specify your reservation type"
                      value={otherType}
                      onChange={(e) => {
                        setOtherType(e.target.value);
                        if (e.target.value) setTypeError("");
                      }}
                    />
                  </div>
                )}
              </div>

              {typeError && (
                <div className="mt-2 text-danger small">{typeError}</div>
              )}
            </div>

            {/* Chalet Rating */}
            <div className="col-12">
              <h3 className="fs-5 fw-medium text-dark">
                {t.rating.title} <span className="text-danger">*</span>
              </h3>
              <div className="position-relative">
                <select
                  value={rating}
                  onChange={handleRatingChange}
                  onBlur={validateRating}
                  className={`form-select p-3 ${
                    ratingError ? "is-invalid" : ""
                  }`}
                  required
                >
                  <option value="" disabled>
                    {t.rating.selectRating}
                  </option>
                  <option value="three" className="text-warning">
                    {t.rating.stars.three}
                  </option>
                  <option value="four" className="text-warning">
                    {t.rating.stars.four}
                  </option>
                  <option value="five" className="text-warning">
                    {t.rating.stars.five}
                  </option>
                  <option value="other">Other</option>
                </select>

                {/* Text Field for Other Rating */}
                {rating === "other" && (
                  <div className="mt-3">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      className={`form-control ${
                        ratingError && !otherRating ? "is-invalid" : ""
                      }`}
                      placeholder="Enter rating (1-10)"
                      value={otherRating}
                      onChange={handleOtherRatingChange}
                      onBlur={validateRating}
                      required
                    />
                    <small className="text-muted">
                      Please enter a number between 1 and 10
                    </small>
                  </div>
                )}

                {ratingError && (
                  <div className="invalid-feedback d-block">{ratingError}</div>
                )}
              </div>
            </div>

            {/* Family Count (shown only when Family type is selected) */}
            {reservationType === "family" && (
              <div className="col-12">
                <label className="form-label fw-medium">
                  {t.familyDetails.numberOfFamilies}
                </label>

                {/* Counter buttons - still starts from 1 */}
                <div className="d-flex align-items-center gap-3 mb-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-circle p-2"
                    style={{ width: "40px", height: "40px" }}
                    onClick={() => setFamilyCount(Math.max(1, familyCount - 1))}
                  >
                    -
                  </button>
                  <span
                    className="fs-4 fw-medium text-center"
                    style={{ width: "40px" }}
                  >
                    {familyCount}
                  </span>
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-circle p-2"
                    style={{ width: "40px", height: "40px" }}
                    onClick={() => setFamilyCount(familyCount + 1)}
                  >
                    +
                  </button>
                </div>

                {/* Text input field - starts from 0 */}
                <div className="mt-2">
                  <input
                    type="text"
                    className="form-control"
                    value={familyCount}
                    onChange={handleInputChange}
                    min="0"
                    placeholder="Enter number of families"
                  />
                  <small className="text-muted">
                    You can either use the buttons above or directly enter the
                    number here
                  </small>
                </div>
              </div>
            )}

            {/* Duration and Date */}
            <div className="col-12">
              <h3 className="fs-5 fw-medium text-dark">{t.duration.title}</h3>

              {/* Start Date */}
              <div className="mb-3">
                <label className="form-label fw-medium">
                  {t.duration.startDate} <span className="text-danger">*</span>
                </label>
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  minDate={new Date()}
                  locale={locale}
                  dateFormat="dd/MM/yyyy"
                  placeholderText={t.duration.selectDate}
                  customInput={<CustomDatePickerInput lang={lang} />}
                  className="form-control w-100"
                />
              </div>

              {/* Duration Options */}
              <div className="mb-3">
                <label className="form-label fw-medium">
                  {t.duration.selectDuration}{" "}
                  <span className="text-danger">*</span>
                </label>
                <div className="row g-3">
                  {/* Standard duration options */}
                  {Object.entries(t.duration.options).map(([key, value]) => (
                    <div className="col-12 col-md-6" key={key}>
                      <div
                        className={`
                cursor-pointer rounded border p-3
                ${
                  duration === key
                    ? "border-primary bg-primary bg-opacity-10"
                    : "border-secondary-subtle"
                }
              `}
                        onClick={() => handleDurationChange(key)}
                      >
                        <div className="d-flex align-items-center">
                          <div className="form-check">
                            <input
                              className="form-check-input"
                              type="radio"
                              name="duration"
                              id={`duration-${key}`}
                              checked={duration === key}
                              onChange={() => handleDurationChange(key)}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`duration-${key}`}
                            >
                              {value}
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Other duration option */}
                  <div className="col-12 col-md-6">
                    <div
                      className={`
              cursor-pointer rounded border p-3
              ${
                duration === "other"
                  ? "border-primary bg-primary bg-opacity-10"
                  : "border-secondary-subtle"
              }
            `}
                      onClick={() => handleDurationChange("other")}
                    >
                      <div className="d-flex align-items-center">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="duration"
                            id="duration-other"
                            checked={duration === "other"}
                            onChange={() => handleDurationChange("other")}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="duration-other"
                          >
                            Other
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Text field for other duration */}
                  {duration === "other" && (
                    <div className="col-12">
                      <input
                        type="text"
                        className={`form-control ${
                          durationError && !otherDuration ? "is-invalid" : ""
                        }`}
                        placeholder="Please specify your preferred duration"
                        value={otherDuration}
                        onChange={(e) => {
                          setOtherDuration(e.target.value);
                          if (e.target.value) setDurationError("");
                        }}
                      />
                      {durationError && !otherDuration && (
                        <div className="invalid-feedback">
                          Please specify your duration
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Number of Visitors */}
            <div className="col-12">
              <label className="form-label fw-medium">
                {t.visitors.title} <span className="text-danger">*</span>
              </label>
              <div className="d-flex align-items-center gap-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-circle p-2"
                  style={{ width: "40px", height: "40px" }}
                  onClick={() => setVisitorCount(Math.max(1, visitorCount - 1))}
                >
                  -
                </button>
                <span
                  className="fs-4 fw-medium text-center"
                  style={{ width: "40px" }}
                >
                  {visitorCount}
                </span>
                <button
                  type="button"
                  className="btn btn-outline-secondary rounded-circle p-2"
                  style={{ width: "40px", height: "40px" }}
                  onClick={() => setVisitorCount(visitorCount + 1)}
                >
                  +
                </button>
              </div>
            </div>

            {/* Facilities & Features */}
            <div className="col-12">
              <h3 className="fs-5 fw-medium text-dark mb-3">
                {t.facilities.title}
              </h3>
              <div className="row g-3">
                {/* Standard Facilities */}
                {Object.entries(facilities).map(([key, checked]) => (
                  <div key={key} className="col-12 col-md-6 col-lg-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={key}
                        checked={checked}
                        onChange={(e) =>
                          handleFacilityChange(key, e.target.checked)
                        }
                      />
                      <label className="form-check-label" htmlFor={key}>
                        {t.facilities[key]}
                      </label>
                    </div>
                  </div>
                ))}

                {/* Other Facility Option */}
                <div className="col-12 col-md-6 col-lg-4">
                  <div className="form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="facility-other"
                      checked={showOtherFacility}
                      onChange={(e) => {
                        setShowOtherFacility(e.target.checked);
                        if (!e.target.checked) {
                          setOtherFacility("");
                        }
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="facility-other"
                    >
                      Other
                    </label>
                  </div>
                </div>

                {/* Other Facility Input Field */}
                {showOtherFacility && (
                  <div className="col-12">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Please specify other facilities"
                      value={otherFacility}
                      onChange={(e) => setOtherFacility(e.target.value)}
                    />
                  </div>
                )}
              </div>

              {/* Number of Rooms */}
              <div className="mt-3">
                <label className="form-label fw-medium">
                  {t.facilities.numberOfRooms}
                </label>
                <div className="d-flex align-items-center gap-3">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-circle p-2"
                    style={{ width: "40px", height: "40px" }}
                    onClick={() =>
                      setNumberOfRooms(Math.max(1, numberOfRooms - 1))
                    }
                  >
                    -
                  </button>
                  <span
                    className="fs-4 fw-medium text-center"
                    style={{ width: "40px" }}
                  >
                    {numberOfRooms}
                  </span>
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-circle p-2"
                    style={{ width: "40px", height: "40px" }}
                    onClick={() => setNumberOfRooms(numberOfRooms + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Location Section */}
              <div className="mt-4">
                <h3 className="fs-5 fw-medium text-dark mb-3">
                  {t.location.title}
                </h3>
                <div className="row g-3">
                  {["amman", "salt", "jerash", "ajloun", "deadSea","Irbid","Perrin","Airport_Road"].map(
                    (key) => (
                      <div className="col-12 col-md-6 col-lg-4" key={key}>
                        <div
                          className={`
                            cursor-pointer rounded border p-3
                            ${
                              location === key
                                ? "border-primary bg-primary bg-opacity-10"
                                : "border-secondary-subtle"
                            }
                          `}
                          onClick={() => {
                            setLocation(key);
                            setOtherLocation("");
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <div className="form-check">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="location"
                                id={`location-${key}`}
                                checked={location === key}
                                onChange={() => {
                                  setLocation(key);
                                  setOtherLocation("");
                                }}
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`location-${key}`}
                              >
                                {t.location.options[key]}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}

                  {/* Other Location */}
                  <div className="col-12 col-md-6 col-lg-4">
                    <div
                      className={`
                        cursor-pointer rounded border p-3
                        ${
                          location === "other"
                            ? "border-primary bg-primary bg-opacity-10"
                            : "border-secondary-subtle"
                        }
                      `}
                      onClick={() => setLocation("other")}
                    >
                      <div className="d-flex align-items-center">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="location"
                            id="location-other"
                            checked={location === "other"}
                            onChange={() => setLocation("other")}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="location-other"
                          >
                            {t.location.options.other}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Other Location Input */}
                {location === "other" && (
                  <div className="mt-3 d-flex gap-2">
                    <input
                      type="text"
                      value={otherLocation}
                      onChange={(e) => setOtherLocation(e.target.value)}
                      placeholder={t.location.placeholder}
                      className="form-control"
                    />
                    <button
                      onClick={() => {
                        if (otherLocation.trim()) {
                          window.open(
                            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              otherLocation
                            )}`,
                            "_blank",
                            "noopener,noreferrer"
                          );
                        }
                      }}
                      className="btn btn-primary"
                    >
                      <MapPin className="w-5 h-5" />
                    </button>
                  </div>
                )}

                {currentLocation && (
                  <div className="mt-3 p-3 bg-light rounded">
                    <p className="small text-secondary">
                      {t.location.currentLocation.capture.longitude}:{" "}
                      {currentLocation.longitude}
                    </p>
                    <p className="small text-secondary">
                      {t.location.currentLocation.capture.latitude}:{" "}
                      {currentLocation.latitude}
                    </p>
                    <p className="small text-muted">
                      {t.location.currentLocation.capture.capturedAt}:{" "}
                      {currentLocation.timestamp}
                    </p>

                    {/* Open on Map Button */}
                    <button
                      onClick={openLocationOnMap}
                      className="mt-2 btn btn-success w-100 d-flex align-items-center justify-content-center"
                    >
                      <MapPin
                        className="me-2"
                        style={{ width: "20px", height: "20px" }}
                      />
                      {t.location.currentLocation.openMapLabel}
                    </button>
                  </div>
                )}

                {/* Error Handling */}
                {locationError && (
                  <div className="mt-3 p-3 bg-danger bg-opacity-10 rounded">
                    <p className="small text-danger">{locationError}</p>
                  </div>
                )}

                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleGetCurrentLocation}
                    className="btn btn-primary w-100 d-flex align-items-center justify-content-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="me-2"
                      style={{ width: "20px", height: "20px" }}
                    >
                      <path d="M20 10c0 6-8 0-8 0s-8 6-8 0a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {t.location.options.currentLocation}
                  </button>
                </div>
              </div>
            </div>

            {/* Budget Section */}
            <div className="col-12 mt-3">
              <label className="form-label fw-medium">
                {t.budget.title} <span className="text-danger">*</span>
              </label>
              <div>
                <input
                  type="number"
                  value={budget}
                  onChange={handleBudgetChange}
                  placeholder={t.budget.placeholder}
                  className={`form-control ${budgetError ? "is-invalid" : ""}`}
                  min="0"
                  step="0.01"
                />
                {budgetError && (
                  <div className="invalid-feedback">{budgetError}</div>
                )}
              </div>
            </div>

            {/* Additional Notes Section */}
            <div className="col-12 mt-3">
              <label className="form-label fw-medium">
                {t.additionalNotes.title}
              </label>
              <textarea
                value={additionalNotes}
                onChange={(e) => setAdditionalNotes(e.target.value)}
                placeholder={t.additionalNotes.placeholder}
                rows="4"
                className="form-control"
              />
            </div>
            {/* Full Name Input */}
            <div className="col-12 mt-3">
              <label className="form-label fw-medium">
                {t.contact.fullName.label}{" "}
                <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setFullNameError("");
                }}
                onBlur={validateFullName}
                placeholder={t.contact.fullName.placeholder}
                className={`form-control ${fullNameError ? "is-invalid" : ""}`}
              />
              {fullNameError && (
                <div className="invalid-feedback">{fullNameError}</div>
              )}
            </div>

            {/* Phone Number Input */}
            <div className="col-12 mt-3">
              <label className="form-label fw-medium">
                {t.contact.phoneNumber.label}{" "}
                <span className="text-danger">*</span>
              </label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  // Allow input but remove non-numeric characters except +
                  const value = e.target.value.replace(/[^\d+]/g, "");
                  setPhoneNumber(value);
                  setPhoneNumberError("");
                }}
                onBlur={validatePhoneNumber}
                placeholder={t.contact.phoneNumber.placeholder}
                className={`form-control ${
                  phoneNumberError ? "is-invalid" : ""
                }`}
              />
              {phoneNumberError && (
                <div className="invalid-feedback">{phoneNumberError}</div>
              )}
            </div>

            {/* Contact Method */}
            <div className="col-12 mt-3">
              <label className="form-label fw-medium">
                {t.contact.contactMethod.label}
              </label>
              <div className="d-flex gap-3">
                {["call", "whatsapp"].map((method) => (
                  <div
                    key={method}
                    className={`
                      cursor-pointer rounded border p-3 flex-grow-1
                      ${
                        contactMethod === method
                          ? "border-primary bg-primary bg-opacity-10"
                          : "border-secondary-subtle"
                      }
                    `}
                    onClick={() => setContactMethod(method)}
                  >
                    <div className="d-flex align-items-center justify-content-center">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="contactMethod"
                          id={`contact-${method}`}
                          checked={contactMethod === method}
                          onChange={() => setContactMethod(method)}
                        />
                        <label
                          className="form-check-label"
                          htmlFor={`contact-${method}`}
                        >
                          {t.contact.contactMethod[method]}
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Call Button (only shown when Call method is selected) */}
            {contactMethod === "call" && (
              <div className="col-12 mt-3">
                <button
                  onClick={handleDirectCall}
                  className="btn btn-success w-100 d-flex align-items-center justify-content-center p-3"
                >
                  <PhoneCall
                    className="me-2"
                    style={{ width: "24px", height: "24px" }}
                  />
                  {t.contact.callButton.label} {t.contact.callButton.number}
                </button>
              </div>
            )}

            {/* WhatsApp Message Button (only shown when WhatsApp method is selected) */}
            {contactMethod === "whatsapp" && (
              <div className="col-12 mt-3">
                <button
                  onClick={handleWhatsAppMessage}
                  className="btn btn-success w-100 d-flex align-items-center justify-content-center p-3"
                >
                  <WhatsAppIcon />
                  {t.contact.whatsappButton.label}{" "}
                  {t.contact.whatsappButton.number}
                </button>
              </div>
            )}

            {/* Submission and Clear Buttons */}
            <div className="col-12 mt-4">
              <div className="d-flex gap-3">
                <button
                  style={{
                    ...backgroundStyle,
                    color: "#FFFFFF",
                    opacity: isSubmitting ? 0.7 : 1,
                  }}
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`btn ${
                    isSubmitting ? "btn-secondary" : "btn-primary"
                  } w-100 py-3`}
                >
                  {isSubmitting ? "Sending....." : t.submission.buttonLabel}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-danger w-100 py-3"
                >
                  {lang === "ar" ? "مسح الفورم" : "Clear Form"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LetRowqanChoose;
