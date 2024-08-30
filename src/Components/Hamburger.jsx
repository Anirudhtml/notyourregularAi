import React from "react";
import "./Hamburger.css";

function Hamburger({ handleHamburger }) {
  return (
    <div onClick={() => handleHamburger()} class="hamburger">
      <input class="checkbox" type="checkbox" />
      <svg fill="none" viewBox="0 0 50 50" height="25" width="20">
        <path
          class="lineTop line"
          stroke-linecap="round"
          stroke-width="4"
          stroke="black"
          d="M6 11L44 11"
        ></path>
        <path
          stroke-linecap="round"
          stroke-width="4"
          stroke="black"
          d="M6 24H43"
          class="lineMid line"
        ></path>
        <path
          stroke-linecap="round"
          stroke-width="4"
          stroke="black"
          d="M6 37H43"
          class="lineBottom line"
        ></path>
      </svg>
    </div>
  );
}

export default Hamburger;
