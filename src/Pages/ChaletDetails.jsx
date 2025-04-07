import { useState, useCallback, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Container, Row, Col, Button } from "react-bootstrap";
import axios from "axios";
import { API_URL } from "../App";
import ChatNowHeader from "../Component/ChatNowHeader";
import { useUser } from "../Component/UserContext";
import SocialMediaButtons from "../Component/SocialMediaButtons";
import { Globe2, Star, Wifi, Home, Coffee, Users, Bath } from "lucide-react";
import '../Css/ChaletDetails.css';

function ChaletsDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { userId } = useUser();
  const lang = location.pathname.split("/")[1] || "en";
  const price = localStorage.getItem("price") || 0;
  const [chaletsImages, setChaletsImages] = useState([]);
  const [dataChalets, setDataChalets] = useState([]);
  const [ratingUser, setRatingUser] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [hoverEffect, setHoverEffect] = useState(false);

  const toggleLanguage = () => {
    const newLang = lang === "ar" ? "en" : "ar";
    const currentPath = location.pathname.split("/").slice(2).join("/");
    navigate(`/${newLang}${currentPath ? "/" + currentPath : "/chalets"}`);
  };

  const isImage = (fileName) => {
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
  };

  const isVideo = (fileName) => {
    return /\.(mp4|mov|avi|mkv)$/i.test(fileName);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [imgchaletRes, chaletsRes, ratingRes] = await Promise.all([
        axios.get(`${API_URL}/chaletsimages/chaletgetChaletImage/${id}`),
        axios.get(`${API_URL}/chalets/getchaletbyid/${id}?lang=${lang}`), 
        axios.get(`${API_URL}/NOstars/getAvergaestars/${id}`),
      ]);
      
      setChaletsImages(imgchaletRes.data);
      
      const chaletData = Array.isArray(chaletsRes.data) && chaletsRes.data.length > 0 
        ? chaletsRes.data[0]  
        : chaletsRes.data;    
      
      setDataChalets(chaletData);
      setRatingUser(ratingRes.data.averageStars || 0);
    } catch (error) {
      console.error("Error fetching chalet data:", error);
    } finally {
      setLoading(false);
    }
  }, [id, lang]); 

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [fetchData, id, lang]); 

  const openGallery = (index) => {
    setActiveImageIndex(index);
    setShowImageGallery(true);
    document.body.style.overflow = 'hidden';
  };

  const closeGallery = () => {
    setShowImageGallery(false);
    document.body.style.overflow = 'auto';
  };


  const navigateGallery = (direction) => {
    if (direction === 'next') {
      setActiveImageIndex((prevIndex) => 
        prevIndex === chaletsImages.length - 1 ? 0 : prevIndex + 1
      );
    } else {
      setActiveImageIndex((prevIndex) => 
        prevIndex === 0 ? chaletsImages.length - 1 : prevIndex - 1
      );
    }
  };

  const getRatingStars = (rating) => {
    return Array(5).fill(0).map((_, index) => (
      <Star 
        key={index}
        size={20}
        className={`star-icon ${rating > index ? 'filled' : ''}`}
        fill={rating > index ? '#F2C79D' : 'none'}
        stroke={rating > index ? '#F2C79D' : '#a9a9a9'}
      />
    ));
  };

  const parseFeatures = () => {
    try {
      if (!dataChalets || !dataChalets.features) return [];
      
      let featuresArray = [];
      if (typeof dataChalets.features === 'string') {
        if (dataChalets.features.includes('"')) {
          try {
            const cleanedFeatures = dataChalets.features
              .replace(/\\/g, '')
              .replace(/^"/, '')
              .replace(/"$/, '');
            
            featuresArray = cleanedFeatures.split(/[,،]+/);
          } catch (e) {
            featuresArray = dataChalets.features.replace(/"/g, "").split(/[,،]+/);
            console.log(`The Error is :${e}`);
          }
        } else {
          featuresArray = dataChalets.features.replace(/"/g, "").split(/[,،]+/);
        }
      } else if (Array.isArray(dataChalets.features)) {
        featuresArray = dataChalets.features;
      }
      
      return featuresArray.map(feature => feature.trim()).filter(feature => feature);
    } catch (error) {
      console.error("Error parsing features:", error, dataChalets.features);
      return [];
    }
  };

  const parseTypeData = () => {
    try {
      if (!dataChalets || !dataChalets.type) return [];
      
      let typeEntries = [];
      
      if (typeof dataChalets.type === 'string') {
        let typeStr = dataChalets.type.trim();
        if (typeStr.startsWith('"') && typeStr.endsWith('"')) {
          typeStr = typeStr.substring(1, typeStr.length - 1);
        }
        
        if ((typeStr.startsWith('{') && typeStr.endsWith('}')) || 
            typeStr.includes(':') || typeStr.includes('"')) {
          try {
            const cleanStr = typeStr
              .replace(/\\/g, '')
              .replace(/"{/g, '{')
              .replace(/}"/g, '}')
              .replace(/،/g, ',') 
              .replace(/\s+/g, ' ');
            
            const typeData = JSON.parse(cleanStr);
            typeEntries = Object.entries(typeData);
          } catch (jsonError) {
            console.log("JSON parse failed, trying manual parse", jsonError);
            
            if (typeStr.startsWith('{')) typeStr = typeStr.substring(1);
            if (typeStr.endsWith('}')) typeStr = typeStr.substring(0, typeStr.length - 1);
            
            const pairs = typeStr.split(/[,،]+/);
            
            typeEntries = pairs.map(pair => {
              const keyValue = pair.split(/:|：/);
              if (keyValue.length >= 2) {
                let key = keyValue[0].trim();
                let value = keyValue[1].trim();
                
                if (key.startsWith('"') && key.endsWith('"')) {
                  key = key.substring(1, key.length - 1);
                }
                if (value.startsWith('"') && value.endsWith('"')) {
                  value = value.substring(1, value.length - 1);
                }
                
                return [key, value];
              }
              return ['', '']; 
            }).filter(([key]) => key !== ''); 
          }
        } else {
          typeEntries = [["Value", typeStr]];
        }
      } else if (typeof dataChalets.type === 'object') {
        typeEntries = Object.entries(dataChalets.type);
      }
      
      return typeEntries;
    } catch (error) {
      console.error("Error parsing type data:", error, dataChalets.type);
      return [];
    }
  };

  // Get feature icon based on feature name
  const getFeatureIcon = (feature) => {
    const lowercaseFeature = feature.toLowerCase();
    if (lowercaseFeature.includes('wifi') || lowercaseFeature.includes('انترنت')) {
      return <Wifi size={20} />;
    } else if (lowercaseFeature.includes('room') || lowercaseFeature.includes('غرفة')) {
      return <Home size={20} />;
    } else if (lowercaseFeature.includes('coffee') || lowercaseFeature.includes('قهوة')) {
      return <Coffee size={20} />;
    } else if (lowercaseFeature.includes('people') || lowercaseFeature.includes('أشخاص')) {
      return <Users size={20} />;
    } else if (lowercaseFeature.includes('bath') || lowercaseFeature.includes('حمام')) {
      return <Bath size={20} />;
    } else {
      return <Star size={20} />;
    }
  };

  const uiText = {
    detailsTitle: lang === "ar" ? "تفاصيل الشاليه" : "Chalet Details",
    chatNow: lang === "ar" ? "دردش الآن" : "Chat Now",
    price: lang === "ar" ? "السعر" : "Price",
    features: lang === "ar" ? "المميزات" : "Features",
    overview: lang === "ar" ? "نظرة عامة" : "Overview",
    reserveNow: lang === "ar" ? "احجز الآن" : "Reserve Now",
    loading: lang === "ar" ? "جاري التحميل..." : "Loading...",
    gallery: lang === "ar" ? "معرض الصور" : "Photo Gallery",
    perNight: lang === "ar" ? "لليلة" : "per night",
    viewMore: lang === "ar" ? "عرض المزيد" : "View more photos",
    close: lang === "ar" ? "إغلاق" : "Close",
    noImages: lang === "ar" ? "لا توجد صور متاحة" : "No images available",
    nextImage: lang === "ar" ? "الصورة التالية" : "Next image",
    prevImage: lang === "ar" ? "الصورة السابقة" : "Previous image"
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <div className="loading-text">{uiText.loading}</div>
      </div>
    );
  }

  const features = parseFeatures();
  const typeData = parseTypeData();

  return (
    <div className={`chalets-details-page ${lang === "ar" ? "rtl" : "ltr"}`}>
      <SocialMediaButtons className="social-buttons" />
      
      <button
        onClick={toggleLanguage}
        className="language-toggle-btn"
        aria-label={lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}
      >
        <Globe2 />
      </button>
      
      <ChatNowHeader 
        dataChalets={dataChalets || {}} 
        chalet_id={id} 
        price={price} 
      />
      
      <Container className="main-container">
        <section className="page-header">
          <h1 className="main-title">{uiText.detailsTitle}</h1>
          <div className="rating-row">
            <div className="stars-container">
              {getRatingStars(ratingUser)}
              <span className="rating-value">{parseFloat(ratingUser).toFixed(1)}</span>
            </div>
          </div>
        </section>
        
        <Row className="main-content-row">
          <Col lg={8} md={12} className="gallery-section">
            {chaletsImages.length > 0 ? (
              <div className="images-container">
                <div className="main-image-container" 
                  onClick={() => openGallery(activeImageIndex)}
                  onMouseEnter={() => setHoverEffect(true)}
                  onMouseLeave={() => setHoverEffect(false)}
                >
                  {isImage(chaletsImages[activeImageIndex]) ? (
                    <img
                      src={chaletsImages[activeImageIndex]}
                      alt="Chalet"
                      className={`main-image ${hoverEffect ? 'hover-effect' : ''}`}
                    />
                  ) : isVideo(chaletsImages[activeImageIndex]) ? (
                    <video
                      src={chaletsImages[activeImageIndex]}
                      controls
                      className="main-video"
                    ></video>
                  ) : null}
                  <div className={`overlay ${hoverEffect ? 'show' : ''}`}>
                    <span className="view-text">{uiText.viewMore}</span>
                  </div>
                </div>
                
                <div className="thumbnails-container">
                  {chaletsImages.slice(0, 4).map((image, index) => (
                    <div 
                      key={index}
                      className={`thumbnail ${activeImageIndex === index ? 'active' : ''}`}
                      onClick={() => setActiveImageIndex(index)}
                    >
                      {isImage(image) ? (
                        <img src={image} alt={`Thumbnail ${index + 1}`} />
                      ) : isVideo(image) ? (
                        <div className="video-thumbnail">
                          <img src="/path-to-video-placeholder.jpg" alt="Video thumbnail" />
                          <div className="video-icon">▶</div>
                        </div>
                      ) : null}
                    </div>
                  ))}
                  {chaletsImages.length > 4 && (
                    <div 
                      className="thumbnail more-photos"
                      onClick={() => openGallery(4)}
                    >
                      <div className="more-overlay">+{chaletsImages.length - 4}</div>
                      {isImage(chaletsImages[4]) && <img src={chaletsImages[4]} alt="More photos" />}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="no-images-container">
                <div className="no-images-message">
                  {uiText.noImages}
                </div>
              </div>
            )}
          </Col>
          
          <Col lg={4} md={12} className="details-section">
            <div className="details-card">
              <div className="price-section">
                <div className="price-amount">
                  <span className="amount">{price}</span>
                  <span className="currency">JD</span>
                  <span className="per-night">{uiText.perNight}</span>
                </div>
              </div>
              
              <div className="overview-section">
                <h3 className="section-subtitle">{uiText.overview}</h3>
                <ul className="details-list">
                  {typeData.map(([key, value], index) => (
                    <li key={index} className="detail-item">
                      <div className="detail-label">{key.replace(/_/g, " ").replace(/-/g, " ")}</div>
                      <div className="detail-value">{value}</div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="action-buttons">
                <Link 
                  to={userId ? `/${lang}/chatbot/${id}` : `/${lang}/login`}
                  className="chat-now-link"
                >
                  <Button className="chat-now-button">
                    {uiText.chatNow}
                  </Button>
                </Link>
                
                <Link
                  to={`/${lang}/bookingchalet/${id}`}
                  state={{
                    chaletsImages,
                    dataChalets,
                  }}
                  className="reserve-now-link"
                >
                  <Button className="reserve-now-button">
                    {uiText.reserveNow}
                  </Button>
                </Link>
              </div>
            </div>
          </Col>
        </Row>
        
        {features.length > 0 && (
          <section className="features-section">
            <h2 className="section-title">{uiText.features}</h2>
            <div className="features-grid">
              {features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <div className="feature-icon">
                    {getFeatureIcon(feature)}
                  </div>
                  <div className="feature-text">{feature}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </Container>
      
      {/* Full-screen image gallery */}
      {showImageGallery && (
        <div className="fullscreen-gallery">
          <button className="close-gallery" onClick={closeGallery}>
            &times;
          </button>
          
          <div className="gallery-content">
            <button 
              className="gallery-nav prev" 
              onClick={() => navigateGallery('prev')}
              aria-label={uiText.prevImage}
            >
              ‹
            </button>
            
            <div className="gallery-image-container">
              {isImage(chaletsImages[activeImageIndex]) ? (
                <img
                  src={chaletsImages[activeImageIndex]}
                  alt="Gallery"
                  className="gallery-image"
                />
              ) : isVideo(chaletsImages[activeImageIndex]) ? (
                <video
                  src={chaletsImages[activeImageIndex]}
                  controls
                  autoPlay
                  className="gallery-video"
                ></video>
              ) : null}
            </div>
            
            <button 
              className="gallery-nav next" 
              onClick={() => navigateGallery('next')}
              aria-label={uiText.nextImage}
            >
              ›
            </button>
          </div>
          
          <div className="gallery-thumbnails">
            {chaletsImages.map((image, index) => (
              <div 
                key={index}
                className={`gallery-thumbnail ${activeImageIndex === index ? 'active' : ''}`}
                onClick={() => setActiveImageIndex(index)}
              >
                {isImage(image) ? (
                  <img src={image} alt={`Thumbnail ${index + 1}`} />
                ) : (
                  <div className="video-thumbnail-small">
                    <div className="video-icon-small">▶</div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <div className="gallery-counter">
            {activeImageIndex + 1} / {chaletsImages.length}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChaletsDetails;