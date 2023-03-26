import React from "react";
import "./procced.css";

const Proceed = (props) => {
  return (
    <div>
      <div className="proceed-popup-box">
        <div className="proceed-box">
          <div className="proceed-popup-header">Your Total is</div>
          <span className="proceed-close-icon" onClick={props.handleClose}>
            x
          </span>
          {props.content}
        </div>
      </div>
    </div>
  );
};

export default Proceed;
