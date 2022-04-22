import React from "react";
import PropTypes from "prop-types";

const SearchContextMenu = (props) => {
  const openContactHandler = () => {
    console.log(JSON.parse(props.selectedRow));
  };

  const style = () => {
    return {
      height: 70,
      width: 200,
      borderRadius: 5,
      backgroundColor: "#ff5c58",
      color: "#fcd2d1",
      flexDirection: "column",
      padding: 10,
      top: props.yLoc,
      left: props.xLoc,
      transform: props.showMenu ? "scale(1)" : "scale(0)",
      transformOrigin: "top left",
      position: "fixed",
      transition: "transform 0.2s ease-in-out",
      boxShadow: "3px 3px 8px 0px rgba(0, 0, 0, 0.5)",
    };
  };
  return (
    <div
      id="searchContextMenu"
      style={style()}
      onMouseLeave={props.onMouseLeave}
    >
      <div onClick={openContactHandler}>Open 360</div>
      <div>Start Service</div>
    </div>
  );
};

SearchContextMenu.propTypes = {
  selectedRow: PropTypes.string.isRequired,
  xLoc: PropTypes.number.isRequired,
  yLoc: PropTypes.number.isRequired,
  showMenu: PropTypes.bool.isRequired,
  onMouseLeave: PropTypes.func.isRequired,
};

export default SearchContextMenu;
