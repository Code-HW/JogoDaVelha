import React from "react";
import Circle from "../components/circle";
import X from "../components/x";
import "./style.css";

function Square({ value, event, color = "#411c52" }) {
  return (
    <button onClick={event} style={{ backgroundColor: color }}>
      {value === "X" ? (
        <X className="animate" fill="white" width="500px" />
      ) : null}
      {value === "O" ? (
        <Circle className="animate" fill="white" width="600px" />
      ) : null}
    </button>
  );
}

export default Square;
