import React from "react";
import { Toast, ToastContainer } from "react-bootstrap";

const ToastMessage = ({ showToast, setShowToast, message }) => {
  return (
    <ToastContainer position="top-center" className="p-3">
      <Toast
        bg="primary"
        show={showToast}
        onClose={() => setShowToast(false)}
        delay={3000}
        autohide
      >
        <Toast.Body>{message}</Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastMessage;
