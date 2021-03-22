import { useState } from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";

// Bind modal to App (with id=root, see public/index.html) for accessibility
Modal.setAppElement("#root");

const ReactModal = ({ children, toggleVisibility }) => {
  // Configure state
  const [modalIsOpen, setIsOpen] = useState(true);

  const toggleModal = () => {
    setIsOpen(!modalIsOpen);
    toggleVisibility(!modalIsOpen);
  };

  return (
    <div className="m--y-2 container">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={toggleModal}
        contentLabel="App Modal"
        className="react-modal shadow--big"
      >
        {/* Close modal icon */}
        <span
          className="d--flex-center text--danger click--cursor"
          onClick={toggleModal}
        >
          <ion-icon name="close-circle-outline" size="large"></ion-icon>
        </span>

        {children}
      </Modal>
    </div>
  );
};

ReactModal.propTypes = {
  toggleVisibility: PropTypes.func.isRequired,
};

export default ReactModal;
