import React from "react";

// custom control to display modal
function Modal(props) {
  return (
    <div
      className="modal"
      onClick={() => (props.onClose ? props.onClose() : "")}
    >
      <div
        className="modal_content custom-scroll"
        onClick={(event) => event.stopPropagation()}
      >
        {/* render the content passed as children */}
        {props.children}
      </div>
    </div>
  );
}

export default Modal;
