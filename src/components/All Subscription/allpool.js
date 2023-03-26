import React from "react";
import "./allpool.css";

const AllPool = (props) => {
  return (
    <div>
      <div className="popup-box">
        <div className="box">
          <div className="popup-header">Pool Interest</div>
          <span className="close-icon" onClick={props.handleClose}>
            x
          </span>
          {props.content}
        </div>
      </div>
    </div>
  );
};

export default AllPool;
