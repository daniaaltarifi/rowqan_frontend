import { Container } from 'react-bootstrap';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import PropTypes from 'prop-types'; // Import PropTypes

function BreadCrumbs({ page_to }) {
  const lang = location.pathname.split("/")[1] || "en";

  return (

    <Container className='mt-5'>
      <Breadcrumb>
        <Breadcrumb.Item active style={{ color: "#B0B0B0", textDecoration: "none" }}>
           {lang==='ar'?"الرئيسية ":"Home"}
        </Breadcrumb.Item>
        <Breadcrumb.Item active href="https://getbootstrap.com/docs/4.0/components/breadcrumb/">
          {page_to}
        </Breadcrumb.Item>
      </Breadcrumb>
    </Container>

  );
}

// Prop validation for 'page_to'
BreadCrumbs.propTypes = {
  page_to: PropTypes.string.isRequired, 
};

export default BreadCrumbs;
