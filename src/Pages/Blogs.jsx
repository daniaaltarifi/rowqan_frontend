import { useCallback, useEffect, useState } from "react";
import { API_URL } from "../App";
import axios from "axios";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Globe2, Clock, ArrowRight, ArrowLeft } from "lucide-react";
import SocialMediaButtons from "../Component/SocialMediaButtons";

import "../Css/BLogs.css";
import "../Css/Events.css";
import "../Css/Home.css";
import "../Css/Chalets.css";

function Blogs() {
  const navigate = useNavigate();
  const location = useLocation();
  const lang = location.pathname.split("/")[1] || "en";
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  
  const toggleLanguage = () => {
    const newLang = lang === "ar" ? "en" : "ar";
    const currentPath = location.pathname.split("/").slice(2).join("/");
    navigate(`/${newLang}${currentPath ? "/" + currentPath : "/about"}`);
  };

  
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const blogRes = await axios.get(
        `${API_URL}/Blogs/getAllBlogs?lang=${lang}`
      );
      setBlogs(blogRes.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  }, [lang]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [lang, fetchData]);

  
  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  };


  const textVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  
  const truncateText = (text, maxLength = 100) => {
   
    const strippedText = text.replace(/<[^>]*>?/gm, '');
    if (strippedText.length <= maxLength) return text;
    return strippedText.substring(0, maxLength) + '...';
  };

  return (
    <div className="blogs-page">
      <SocialMediaButtons />
      
      
      <div className="blog-header position-relative">
        <Container fluid>
          {/* <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-end mb-4 pt-3"
          >
            <button
              onClick={toggleLanguage}
              className="language-toggle btn"
              aria-label={lang === "ar" ? "Switch to English" : "التبديل للعربية"}
            >
              <Globe2 className="w-6 h-6" />
              <span className="ms-2">
                {lang === "ar" ? "English" : "العربية"}
              </span>
            </button>
          </motion.div> */}

          <Row className="text-center">
            <Col className="header-content py-5">
              <motion.div
                variants={textVariants}
                initial="hidden"
                animate="visible"
              >
                <h1 className="blog-main-title mb-3">
                  {lang === "ar" ? "الموارد والمدونات" : "Resources And Blogs"}
                </h1>
                <h5 className="blog-subtitle mb-4 mx-auto">
                  {lang === "ar"
                    ? "تقدم مدوناتنا محتوى مفيدًا لمساعدتك في التخطيط لرحلتك القادمة التي لا تنسى. انغمس في اكتشاف سحر وراحة الحياة في مدوناتنا."
                    : "Our blogs offer insightful content to help you plan your next memorable escape. Dive in and discover the charm and comfort of chalet living."}
                </h5>
              </motion.div>
            </Col>
          </Row>
        </Container>
        
        
        <div className="header-bottom-shape">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 1440 100" 
            preserveAspectRatio="none"
          >
            <path 
              fill="#ffffff"
              d="M0,64L80,58.7C160,53,320,43,480,48C640,53,800,75,960,74.7C1120,75,1280,53,1360,42.7L1440,32L1440,100L1360,100C1280,100,1120,100,960,100C800,100,640,100,480,100C320,100,160,100,80,100L0,100Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* قسم المحتوى الرئيسي */}
      <Container className="blogs-container py-5">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            <Row className="g-4">
              {blogs.map((blog, index) => (
                <Col lg={4} md={6} sm={12} key={blog.id}>
                  <motion.div
                    custom={index}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: 20 }}
                    whileHover={{ y: -10, transition: { duration: 0.3 } }}
                  >
                    <Link
                      to={`/${lang}/blogdetails/${blog.id}`}
                      className="blog-card-link"
                    >
                      <Card className="blog-card h-100 shadow-sm">
                        <div className="card-img-wrapper">
                          <Card.Img
                            variant="top"
                            className="blog-card-img"
                            srcSet={`https://res.cloudinary.com/dqimsdiht/${blog.image}?w=400&f_auto&q_auto:eco 400w, https://res.cloudinary.com/dqimsdiht/${blog.image}?w=800&f_auto&q_auto:eco 800w`}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            alt={blog.title}
                            decoding="async"
                            loading="lazy"
                          />
                          <div className="card-img-overlay-gradient"></div>
                        </div>
                        <Card.Body className="d-flex flex-column">
                          <div className="blog-meta d-flex align-items-center mb-2">
                            <Clock size={16} className="me-1" />
                            <small className="text-muted">
                              {new Date().toLocaleDateString(lang === "ar" ? "ar-SA" : "en-US")}
                            </small>
                          </div>
                          <Card.Title className="blog-card-title mb-3">
                            {blog.title}
                          </Card.Title>

                          <Card.Text
                            className="blog-card-description mb-3"
                            dangerouslySetInnerHTML={{
                              __html: truncateText(blog.description, 120)
                            }}
                          ></Card.Text>
                          
                          <div className="mt-auto">
                            <button className="blog-read-more-btn d-flex align-items-center justify-content-center">
                              {lang === "ar" ? "شاهد المزيد" : "View More"}
                              {lang === "ar" ? <ArrowLeft size={16} className="ms-1" /> : <ArrowRight size={16} className="ms-1" />}
                            </button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Link>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </AnimatePresence>
        )}
        
        {blogs.length === 0 && !loading && (
          <div className="text-center py-5">
            <h3>{lang === "ar" ? "لا توجد مدونات متاحة حاليًا" : "No blogs available at the moment"}</h3>
          </div>
        )}
      </Container>
    </div>
  );
}

export default Blogs;