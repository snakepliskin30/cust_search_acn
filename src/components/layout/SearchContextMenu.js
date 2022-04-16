import React from "react";

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

export default SearchContextMenu;
