import React, { useState, useEffect, useCallback } from "react";

const useSearchResultRightClickMenu = () => {
  const [xLoc, setXLoc] = useState(0);
  const [yLoc, setYLoc] = useState(0);
  const [showMenu, setShowMenu] = useState(false);

  const contextMenuHandler = (e) => {
    e.preventDefault();
    setXLoc(e.pageX);
    setYLoc(e.pageY);
    setShowMenu(true);
    console.log("handler");
  };

  const rightClickMenu = useCallback(() => {
    const rows = document.querySelectorAll("tr:not(.dtrg-start)");
    // rows.removeEventListener("contextmenu", contextMenuHandler);

    rows.forEach((e) => {
      e.addEventListener("contextmenu", contextMenuHandler);
    });
  }, []);

  return { xLoc, yLoc, showMenu, rightClickMenu };
};

export default useSearchResultRightClickMenu;
