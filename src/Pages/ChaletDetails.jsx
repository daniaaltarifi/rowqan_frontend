import { Container, Row, Col, Button } from "react-bootstrap";
import { useState, useCallback, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../App";
import ChatNowHeader from "../Component/ChatNowHeader";
import { useUser } from "../Component/UserContext";
import Carousel from "react-bootstrap/Carousel";
import PropTypes from "prop-types";
import '../Css/Events.css'

import { Globe2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

function ChaletsDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { userId } = useUser();
  const lang = location.pathname.split("/")[1] || "en";
  const price = localStorage.getItem("price") || 0;
  const [chaletsImages, setChaletsImages] = useState([]);
  const [dataChalets, setdataChalets] = useState([]);
  const [ratingUser, setRatingUser] = useState("");
  const [translatedData, setTranslatedData] = useState(null);

  // Toggle language and navigate to the corresponding route
  const toggleLanguage = () => {
    const newLang = lang === "ar" ? "en" : "ar";
    const currentPath = location.pathname.split("/").slice(2).join("/");
    navigate(`/${newLang}${currentPath ? "/" + currentPath : "/chalets"}`);
  };

  // Translations for UI elements
  const translations = {
    en: {
      detailsTitle: "Details for this chalets",
      chatNow: "Chat Now",
      price: "Price :",
      features: "Features :",
      reserveNow: "Reserve Now"
    },
    ar: {
      detailsTitle: "تفاصيل هذا الشاليه",
      chatNow: "دردش الأن",
      price: "السعر :",
      features: "المميزات :",
      reserveNow: "احجز الان"
    }
  };

  // Function to translate field labels
  const translateFieldLabel = (key) => {
    // Translation mapping for property types
    const fieldTranslations = {
      en: {
        bedrooms: "bedrooms",
        bathrooms: "bathrooms",
        location: "location",
        pool_size: "pool size",
        capacity: "capacity",
        number_of_rooms: "Number of Rooms",
        number_of_bathrooms: "Number of Bathrooms",
        building_area: "Building Area",
        number_of_visitors: "Number of Visitors",
        number_of_kitchen: "Number of Kitchen",
        number_of_swimming_pools: "Number of swimming pools",
        maids_room: "maids-room",
        laundry_room: "laundry-room",
        double_glazed_windows: "double-glazed-windows",
        electric_lampshade: "electric-lampshade",
        underfloor_heating: "underfloor-heating",
        microwave: "microwave",
        oven: "oven",
        // Add more field translations as needed
      },
      ar: {
        bedrooms: "غرف النوم",
        bathrooms: "الحمامات",
        location: "الموقع",
        pool_size: "حجم المسبح",
        capacity: "السعة",
        number_of_rooms: "عدد الغرف",
        number_of_bathrooms: "عدد الحمامات",
        building_area: "مساحة البناء",
        number_of_visitors: "عدد الزوار",
        number_of_kitchen: "عدد المطابخ",
        number_of_swimming_pools: "عدد المسابح",
        maids_room: "غرفة الخادمة",
        laundry_room: "غرفة الغسيل",
        double_glazed_windows: "نوافذ زجاج مزدوج",
        electric_lampshade: "مظلة كهربائية",
        underfloor_heating: "تدفئة تحت الأرضية",
        microwave: "ميكروويف",
        oven: "فرن",
        // Add more field translations as needed
      }
    };

    // Convert to lowercase and remove spaces and hyphens for matching
    const normalizedKey = key.toLowerCase().replace(/ /g, '_').replace(/-/g, '_');
    
    // Try to find a direct match first
    if (fieldTranslations[lang][normalizedKey]) {
      return fieldTranslations[lang][normalizedKey];
    }
    
    // Then try to find a partial match (for handling variations)
    for (const translationKey in fieldTranslations[lang]) {
      if (normalizedKey.includes(translationKey) || translationKey.includes(normalizedKey)) {
        return fieldTranslations[lang][translationKey];
      }
    }
    
    // Fallback to just formatting the key
    return lang === "ar" 
      ? key // Keep as is for Arabic if no translation found
      : key.replace(/_/g, " ").replace(/-/g, " "); // Format for English
  };

  // Function to translate feature content
  const translateFeature = (feature) => {
    // Dictionary of feature translations
    const featureTranslations = {
      en: {
        "Swimming Pool": "Swimming Pool",
        "Garden": "Garden",
        "Jacuzzi": "Jacuzzi",
        "BBQ Area": "BBQ Area",
        "WiFi": "WiFi",
        "Parking": "Parking",
        "maids-room": "maids-room",
        "laundry-room": "laundry-room",
        "double-glazed-windows": "double-glazed-windows",
        "electric-lampshade": "electric-lampshade",
        "underfloor-heating": "underfloor-heating",
        "microwave": "microwave",
        "oven": "oven",
      },
      ar: {
        "Swimming Pool": "مسبح",
        "Garden": "حديقة",
        "Jacuzzi": "جاكوزي",
        "BBQ Area": "منطقة شواء",
        "WiFi": "واي فاي",
        "Parking": "موقف سيارات",
        "maids-room": "غرفة الخادمة",
        "laundry-room": "غرفة الغسيل",
        "double-glazed-windows": "نوافذ زجاج مزدوج",
        "electric-lampshade": "مظلة كهربائية",
        "underfloor-heating": "تدفئة تحت الأرضية",
        "microwave": "ميكروويف",
        "oven": "فرن",
      }
    };

    // Check if we have a direct translation for this feature
    const trimmedFeature = feature.trim();
    if (featureTranslations[lang][trimmedFeature]) {
      return featureTranslations[lang][trimmedFeature];
    }
    
    // If no direct match, try to find a partial match
    for (const key in featureTranslations[lang]) {
      if (trimmedFeature.toLowerCase().includes(key.toLowerCase()) || 
          key.toLowerCase().includes(trimmedFeature.toLowerCase())) {
        return featureTranslations[lang][key];
      }
    }
    
    // Return the original if no translation found
    return trimmedFeature;
  };

  const isImage = (fileName) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
  };

  const isVideo = (fileName) => {
    return /\.(mp4|mov|avi|mkv)$/i.test(fileName);
  };

  // Process data after fetching to handle translations
  const processData = (data) => {
    if (!data) return null;
    
    // Create a deep copy to avoid modifying the original data
    let processed = JSON.parse(JSON.stringify(data));
    
    // Always process the data regardless of language
    try {
      let typeObj = {};
      
      if (processed.type) {
        typeObj = typeof processed.type === 'string' 
          ? JSON.parse(processed.type) 
          : processed.type;
      }
      
      // For Arabic, create translated version
      if (lang === "ar") {
        // Translate both keys and values
        const translatedType = {};
        Object.entries(typeObj).forEach(([key, value]) => {
          // Normalize the key by removing hyphens for matching
          const normalizedKey = key.replace(/-/g, '_');
          
          // Translate property names (keys)
          const translatedKey = translateFieldLabel(normalizedKey);
          
          // Translate values where needed
          let translatedValue = value;
          
          // Translate yes/no values
          if (typeof value === 'string') {
            if (value.toLowerCase() === 'yes') translatedValue = 'نعم';
            else if (value.toLowerCase() === 'no') translatedValue = 'لا';
            else if (value.toLowerCase() === 'available') translatedValue = 'متوفر';
            else if (value.toLowerCase() === 'not available') translatedValue = 'غير متوفر';
          }
          
          // Add translated key-value pair
          translatedType[translatedKey] = translatedValue;
        });
        
        processed.translatedType = translatedType;
        
        // Debug output
        console.log("Original keys:", Object.keys(typeObj));
        console.log("Translated keys:", Object.keys(translatedType));
      }
    } catch (error) {
      console.error("Error processing type data:", error);
    }
    
    return processed;
  };

  const fetchData = useCallback(async () => {
    try {
      const [imgchaletRes, chaletsRes, ratingRes] = await Promise.all([
        axios.get(`${API_URL}/chaletsimages/chaletgetChaletImage/${id}`),
        axios.get(`${API_URL}/chalets/getchaletbyid/${id}`),
        axios.get(`${API_URL}/NOstars/getAvergaestars/${id}`),
      ]);

      // Update images
      setChaletsImages(imgchaletRes.data);
      
      // Update chalet data
      setdataChalets(chaletsRes.data);
      
      // Process data for translations
      setTranslatedData(processData(chaletsRes.data));
      
      // Update rating
      setRatingUser(ratingRes.data.averageStars);
    } catch (error) {
      console.error("Error fetching chalet data:", error);
    }
  }, [id, lang]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [fetchData, id]);

  // Separate effect to manually process features when language changes
  useEffect(() => {
    if (dataChalets && dataChalets.features) {
      console.log("Processing features for language:", lang);
      
      // Force UI update by creating a new translatedData object
      setTranslatedData(prev => {
        if (!prev) return processData(dataChalets);
        
        const newData = {...prev};
        // Keep the original features string for rendering,
        // the translation happens in the render function via translateFeature
        return newData;
      });
    }
  }, [lang, dataChalets]);

  const colors = {
    orange: "#F2C265",
    grey: "#a9a9a9",
  };

  // Star icon SVG component
  const StarIcon = ({ filled }) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
    >
      <path
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
        fill={filled ? colors.orange : colors.grey} 
      />
    </svg>
  );

  StarIcon.propTypes = {
    filled: PropTypes.bool.isRequired,
  };

  return (
    <div>
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
      <ChatNowHeader dataChalets={dataChalets} chalet_id={id} price={price} />
      <Container className="mt-5">
        <h1>{translations[lang].detailsTitle}</h1>
        {/* Debug info - remove in production */}
        {/* <div>
          <small>Current language: {lang}</small>
          <br />
          <small>Data processed: {translatedData ? 'Yes' : 'No'}</small>
          {translatedData && translatedData.translatedType && (
            <>
              <br />
              <small>Translation applied: Yes</small>
              <br />
              <small>Translated keys: {Object.keys(translatedData.translatedType).join(', ')}</small>
            </>
          )}
        </div> */}
        <Row>
          <Col sm={12} md={12} lg={7}>
            <Carousel>
              {chaletsImages.map((image, index) => (
                <Carousel.Item key={index}>
                  {isImage(image) ? (
                    <img
                      alt="image"
                      className="slider_img rounded"
                      style={{ height: "65vh" }}
                      src={image}
                    />
                  ) : isVideo(image) ? (
                    <video
                      controls
                      width="100%"
                      height="455px"
                      src={image}
                      type="video/mp4"
                    ></video>
                  ) : null}
                </Carousel.Item>
              ))}
            </Carousel>
          </Col>

          <Col sm={12} md={12} lg={5}>
            {translatedData && (
              <div className="box_Brief_characteristics">
                <div>
                  <div className="mt-3">
                    <ul dir={lang === "ar" ? "rtl" : "ltr"} style={{textAlign: lang === "ar" ? "right" : "left"}}>
                      {translatedData.type &&
                        Object.entries(
                          lang === "ar" && translatedData.translatedType
                            ? translatedData.translatedType
                            : JSON.parse(translatedData.type)
                        ).map(([key, value], index) => (
                          <li key={index} className="py-2">
                            <b>{lang === "en" ? key.replace(/_/g, " ") : key}:</b> {value}
                          </li>
                        ))}
                    </ul>

                    <div className="cont_rating">
                      {[...Array(5)].map((_, index) => (
                        <span
                          key={index}
                          style={{
                            display: "inline-block",
                            marginRight: "5px",
                          }}
                        >
                          <StarIcon filled={ratingUser > index} />
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <Link to={userId ? `/${lang}/chatbot/${id}` : `/${lang}/login`}>
                  <Button variant="outline-warning" className="mt-3">
                    {translations[lang].chatNow}
                  </Button>
                </Link>
              </div>
            )}
          </Col>
        </Row>
        <Row>
          <Col sm={12} md={6} lg={6} className="mt-5">
            <div className="box_price">
              <h4
                style={{ color: "#152C5B", fontWeight: "600" }}
                className="px-3"
              >
                {translations[lang].price}
              </h4>
              <h5>{price} JD</h5>
            </div>
            <>
              <h4>{translations[lang].features}</h4>
              <h6>
                <ul dir={lang === "ar" ? "rtl" : "ltr"} style={{textAlign: lang === "ar" ? "right" : "left"}}>
                  {translatedData && translatedData.features
                    ? translatedData.features
                        .replace(/"/g, "")
                        .split(",")
                        .map((feature, index) => (
                          <li
                            key={index}
                            style={{ fontSize: "18px" }}
                            className="py-1"
                          >
                            {lang === "ar" ? translateFeature(feature) : feature.trim()}
                          </li>
                        ))
                    : null}
                </ul>
              </h6>
            </>
            <Link
              to={`/${lang}/bookingchalet/${id}`}
              state={{
                chaletsImages,
                dataChalets,
              }}
            >
              <button className="booknow_button_events mt-4">
                {translations[lang].reserveNow}
              </button>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ChaletsDetails;