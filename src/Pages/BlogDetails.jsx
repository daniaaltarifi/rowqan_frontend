import { Container, Col, Row } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../App";
import { Globe2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";


function BlogDetails() {

  const navigate = useNavigate();
  const location = useLocation();

  const { id } = useParams();
  const lang = location.pathname.split("/")[1] || "en";
  const [blogs, setBlogs] = useState([]);

  const toggleLanguage = () => {
    const newLang = lang === "ar" ? "en" : "ar";
    const currentPath = location.pathname.split("/").slice(2).join("/");
    navigate(`/${newLang}${currentPath ? "/" + currentPath : "/chalets"}`);
  };

  const fetchData = useCallback(async () => {
    try {
      const blogRes = await axios.get(
        `${API_URL}/Blogs/getBlogById/${id}/${lang}`
      );
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
      <Container>
        {blogs.map((blog) => (
          <Row key={blog.id}>
            <Col
              lg={12}
              md={6}
              sm={12}
              className="d-flex justify-content-center"
            >
              <img
                srcSet={`https://res.cloudinary.com/dqimsdiht/${blog.image}?w=400&f_auto&q_auto:eco 400w`}
                alt="blog"
                style={{ borderRadius: "25px", height: "500px", width: "100%" }}
              />
            </Col>
            <Col
              lg={12}
              md={6}
              sm={12}
              className="d-flex flex-column justify-content-center align-items-center"
            >
              <div className="cont_blog_details">
                <h1 className="mt-4" style={{ textAlign: "center" }}>
                  {blog.title}
                </h1>
                <p
                            dangerouslySetInnerHTML={{
                              __html: blog.description,
                            }}
                          ></p>
                {/* <p className="mt-5">{blog.description}</p> */}
              </div>
            </Col>
          </Row>
        ))}
      </Container>
    </div>
  );
}

export default BlogDetails;
