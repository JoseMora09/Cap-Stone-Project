import React, { useEffect, useRef } from "react";

// custom component to render a dropdown with the options passed as props
function Dropdown(props) {
  const dropdownRef = useRef();

  const handleClick = (event) => {
    if (
      dropdownRef &&
      !dropdownRef.current?.contains(event.target) &&
      props.onClose
    )
      props.onClose();
  };

  useEffect(() => {
    // add event listener dynamically
    document.addEventListener("click", handleClick);

    return () => {
      // remove the event listener
      document.removeEventListener("click", handleClick);
    };
  });

  return (
    <div
      ref={dropdownRef}
      className={`dropdown custom-scroll ${props.class ? props.class : ""}`}
    >
      {/* rendering children as options */}
      {props.children}
    </div>
  );
}

export default Dropdown;
