import { useCallback, useEffect, useState } from "react";
import { API_URL } from "../App";
import axios from "axios";
import "../Css/BLogs.css";
import { Container, Card, Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../Css/Events.css";
import "../Css/Home.css";
import "../Css/Chalets.css";
import { Globe2 } from "lucide-react"; 
import { useNavigate, useLocation } from "react-router-dom";


function Blogs() {
  const navigate = useNavigate();
  const location = useLocation();
  const lang = location.pathname.split("/")[1] || "en";
  const [blogs, setBlogs] = useState([]);


  const toggleLanguage = () => {
    const newLang = lang === "ar" ? "en" : "ar";
    const currentPath = location.pathname.split('/').slice(2).join('/');
    navigate(`/${newLang}${currentPath ? '/' + currentPath : '/chalets'}`);
  };



  const fetchData = useCallback(async () => {
    try {
      const blogRes = await axios.get(`${API_URL}/Blogs/getAllBlogs/${lang}`);
      if (blogRes.data !== blogs) {
        setBlogs(blogRes.data);
      }
    } catch (error) {
      console.error("Error fetching blogets:", error);
    }
  }, [lang, blogs]);



  useEffect(() => {
    window.scrollTo(0, 0);
    fetchData();
  }, [lang]);

  return (
    <div>
      <Container fluid>
        <div className="language-toggle-container" 
                     style={{
                       position: 'absolute',
                       top: '20px',
                       right: '20px',
                       zIndex: 1000
                     }}>
                  <button
                    onClick={toggleLanguage}
                    className="btn btn-light rounded-circle p-2"
                    style={{
                      backgroundColor: 'white',
                      border: '1px solid #ddd',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    <Globe2 className="w-6 h-6" />
                  </button>
                </div>
        
        <Row className="text-center">
          <Col className="background_blogs">
            <h1 className="title_blogs">
              {lang === "ar" ? "الموارد والمدونات" : "Resources And Blogs"}
            </h1>
            <h5 className="subtitle_blog">
              {lang === "ar"
                ? "تقدم مدوناتنا محتوى مفيدًا لمساعدتك في التخطيط لرحلتك القادمة التي لا تنسى. انغمس في اكتشاف سحر وراحة الحياة في مدوناتنا."
                : "our blogs offer insightful content to help you plan your next memorable escape. Dive in and discover the charm and comfort ofbloget living."}
            </h5>
            <svg
              className="wave"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 160" // Adjusted viewBox height
            >
              <path
                fill="var(--blue-color)"
                fillOpacity="1"
                d="M0,96L48,85.3C96,75,192,53,288,69.3C384,85,480,139,576,154.7C672,171,768,149,864,160C960,171,1056,213,1152,208C1248,203,1344,149,1392,122.7L1440,96L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
              ></path>
              <path
                fill="var(--beige-color)"
                fillOpacity="1"
                d="M0,48L48,42.7C96,37,192,27,288,34.7C384,43,480,69,576,77.3C672,85,768,74,864,80C960,86,1056,106,1152,104C1248,101,1344,75,1392,61.3L1440,48L1440,160L1392,160C1344,160,1248,160,1152,160C1056,160,960,160,864,160C768,160,672,160,576,160C480,160,384,160,288,160C192,160,96,160,48,160L0,160Z"
              ></path>
            </svg>
          </Col>
        </Row>
      </Container>
      <Container className="margin_section">
        <Row>
          {blogs.map((blog) => (
            <Col xl={4} md={6} sm={12} key={blog.id}>
              <Link
                to={`/${lang}/blogdetails/${blog.id}`}
                style={{ textDecoration: "none" }}
              >
                <Card className="cont_card_blogs">
                  <Card.Img
                    variant="top"
                    height={"200px"}
                    className="object-fit-cover"
                    srcSet={`https://res.cloudinary.com/dqimsdiht/${blog.image}?w=400&f_auto&q_auto:eco 400w`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    alt="blog img"
                    decoding="async"
                    loading="lazy"
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="title_chalets mt-3">
                      {blog.title}
                    </Card.Title>

                    <Row>
                      <div className="d-flex justify-content-evenly mt-3">
                        <Card.Text
                          className="column-title"
                          dangerouslySetInnerHTML={{
                            __html: blog.description,
                          }}
                        >
                        </Card.Text>
                      </div>
                    </Row>
                    <div className="d-flex justify-content-evenly mt-3 mt-auto ">
                      <button className="booknow_button_events ">
                        {lang === "ar" ? "شاهد المزيد" : "View More"}
                      </button>
                    </div>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default Blogs;
