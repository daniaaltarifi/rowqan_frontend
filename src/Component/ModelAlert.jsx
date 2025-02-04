import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import PropTypes from 'prop-types';
function ModelAlert({ show, handleClose, title, message }) {
  ModelAlert.propTypes = {
    show: PropTypes.bool.isRequired, 
    handleClose: PropTypes.func.isRequired, 
    title: PropTypes.string.isRequired, 
    message: PropTypes.string.isRequired, 

  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title style={{color:"#F2C79D"}}>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{background: "linear-gradient(90deg, #AFB7AB 0%, #F2C79D 100%)"}}>{message}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleClose}  style={{background: "linear-gradient(90deg, #AFB7AB 0%, #F2C79D 100%)",border:"none"}}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModelAlert;
