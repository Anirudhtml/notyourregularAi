import React from "react";
import './Popup.css';

function Popup({ content, title, setTitle, handleTitleClick }) {

  const handleSubmit = (e) => {
    e.preventDefault();
    handleTitleClick();
    setTitle(capitalizeFirstLetter(title))
  };

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
  
  return (
    <div>
      <div className="popUp">
        <p>{content}</p>
        <form onSubmit={handleSubmit}>
          <input
            onChange={(e) => setTitle(capitalizeFirstLetter(e.target.value))}
            value={title}
          />
          <button type="submit">
            Ok
          </button>
        </form>
      </div>
    </div>
  );
}

export default Popup;
