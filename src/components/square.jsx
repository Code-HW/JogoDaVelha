import React from "react";
import "./style.css";

function Square({ value, event, color = "#411c52" }) {
  return (
    <button onClick={event} style={{ backgroundColor: color }}>
      {value}
    </button>
  );
}

export default Square;
