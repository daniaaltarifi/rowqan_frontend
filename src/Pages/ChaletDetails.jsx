import { Container, Row, Col, Button } from "react-bootstrap";
import { useState, useCallback, useEffect } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../App";
import ChatNowHeader from "../Component/ChatNowHeader";
import { useUser } from "../Component/UserContext";
import Carousel from "react-bootstrap/Carousel";
import PropTypes from "prop-types";
import '../Css/Events.css';

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
      
      setdataChalets(chaletData);
      
     
      setRatingUser(ratingRes.data.averageStars);
    } catch (error) {
      console.error("Error fetching chalet data:", error);
    }
  }, [id, lang]); 

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [fetchData, id, lang]); 

  const colors = {
    orange: "#F2C265",
    grey: "#a9a9a9",
  };

 
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

 
  const uiText = {
    detailsTitle: lang === "ar" ? "تفاصيل هذا الشاليه" : "Details for this chalets",
    chatNow: lang === "ar" ? "دردش الأن" : "Chat Now",
    price: lang === "ar" ? "السعر :" : "Price :",
    features: lang === "ar" ? "المميزات :" : "Features :",
    reserveNow: lang === "ar" ? "احجز الان" : "Reserve Now"
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
      <ChatNowHeader 
        dataChalets={dataChalets || {}} 
        chalet_id={id} 
        price={price} 
      />
      <Container className="mt-5">
        <h1>{uiText.detailsTitle}</h1>
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
            {dataChalets && dataChalets.type && (
              <div className="box_Brief_characteristics">
                <div>
                  <div className="mt-3">
                    <ul dir={lang === "ar" ? "rtl" : "ltr"} style={{textAlign: lang === "ar" ? "right" : "left"}}>
                      {(() => {
                        try {
                         
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
                          
                          return typeEntries.map(([key, value], index) => (
                            <li key={index} className="py-2">
                              <b>{key.replace(/_/g, " ").replace(/-/g, " ")}:</b> {value}
                            </li>
                          ));
                        } catch (error) {
                          console.error("Error parsing type data:", error, dataChalets.type);
                          return <li>Error loading characteristics</li>;
                        }
                      })()}
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
                    {uiText.chatNow}
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
                {uiText.price}
              </h4>
              <h5>{price} JD</h5>
            </div>
            <>
              <h4>{uiText.features}</h4>
              <h6>
                <ul dir={lang === "ar" ? "rtl" : "ltr"} style={{textAlign: lang === "ar" ? "right" : "left"}}>
                  {(() => {
                    try {
                      if (!dataChalets || !dataChalets.features) return null;
                      
                      
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
                            console.log(`The Error is :${e}`)
                          }
                        } else {
                          
                          featuresArray = dataChalets.features.replace(/"/g, "").split(/[,،]+/);
                        }
                      } else if (Array.isArray(dataChalets.features)) {
                        featuresArray = dataChalets.features;
                      }
                      
                      return featuresArray.map((feature, index) => (
                        <li
                          key={index}
                          style={{ fontSize: "18px" }}
                          className="py-1"
                        >
                          {feature.trim()}
                        </li>
                      ));
                    } catch (error) {
                      console.error("Error parsing features:", error, dataChalets.features);
                      return <li>Error loading features</li>;
                    }
                  })()}
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
                {uiText.reserveNow}
              </button>
            </Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default ChaletsDetails;