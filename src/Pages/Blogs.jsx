import { useCallback, useEffect, useState } from "react";
import { API_URL } from "../App";
import axios from "axios";
import '../Css/Home.css'
import { Container, Card, Row, Col } from "react-bootstrap";

function Blogs() {
  const lang = location.pathname.split("/")[1] || "en";
const [blogs,setBlogs]=useState([])
      const fetchData = useCallback(async () => {
        try {
          const blogRes = await
           axios.get(`${API_URL}/Blogs/getAllBlogs/${lang}`);
          if (blogRes.data !== blogs) {
            setBlogs(blogRes.data);
          }
        } catch (error) {
          console.error("Error fetching chalets:", error);
        }
      }, [lang,blogs]);
    
      useEffect(() => {
        window.scrollTo(0, 0);
        fetchData();
      }, [lang]);
    
  return (
    <div>
        <Container className="margin_section">
        <Row>
          {blogs.map((chal) => (
            <Col xl={4} md={6} sm={12} key={chal.id}>
             
                <Card className="cont_card_blogs">
                  <Card.Img
                    variant="top"
                    height={"200px"}
                    className="object-fit-cover"
                    srcSet={`https://res.cloudinary.com/durjqlivi/${chal.image}?w=400&f_auto&q_auto:eco 400w`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    alt="chal img"
                    decoding="async"
                    loading="lazy"
                  />
                  <Card.Body className="d-flex flex-column">
                    <Card.Title className="title_chalets mt-3">
                      {chal.title}
                    </Card.Title>

                    <Row className="">
                      <div className="d-flex justify-content-evenly mt-3">
                        <Card.Text className="column-title ">
                          {chal.description} 
                        </Card.Text>
                      </div>
                    </Row>
                  </Card.Body>
                </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  )
}

export default Blogs