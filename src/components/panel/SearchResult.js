import React, { Fragment, useCallback, useEffect, useState } from "react";
import SearchContextMenu from "../layout/SearchContextMenu";
import ButtonCancel from "../ui/ButtonCancel";

//Datatable Modules
import "jquery/dist/jquery.min.js";
import "datatables.net/js/jquery.dataTables";
import "datatables.net-rowgroup/js/dataTables.rowGroup.min.js";
import $ from "jquery";

import "datatables.net-dt/css/jquery.dataTables.css";
import "bootstrap/dist/css/bootstrap.min.css";

import classes from "./SearchResult.module.css";

const SearchResult = (props) => {
  const [selectedRow, setSelectedRow] = useState("");
  const [xLoc, setXLoc] = useState(0);
  const [yLoc, setYLoc] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [expandAll, setExpandAll] = useState(true);

  const hideContextMenu = () => {
    setShowMenu(false);
  };

  const contextMenuHandler = (e) => {
    console.log("context");
    e.preventDefault();
    e.clientX + 200 > window.innerWidth
      ? setXLoc(window.innerWidth - 210)
      : setXLoc(e.clientX - 10);
    e.clientY + 70 > window.innerHeight
      ? setYLoc(window.innerHeight - 70)
      : setYLoc(e.clientY - 10);
    setSelectedRow(e.target.closest("tr").dataset.rowInfo);
    setShowMenu(true);
  };

  const buildSearchTable = useCallback(() => {
    let collapsedGroups = {};
    const oTable = $("#searchResultTable").DataTable({
      destroy: true,
      paging: false,
      bFilter: false,
      bInfo: false,
      language: {
        search: "Table search: ",
      },
      orderFixed: [[4, "asc"]],
      rowGroup: {
        // Uses the 'row group' plugin
        dataSrc: 4,
        startRender: function (rows, group) {
          let collapsed;
          // var collapsed = !!collapsedGroups[group]; // default to collapse all; original code
          if (expandAll) {
            collapsed = !collapsedGroups[group]; // default to expand all
          } else {
            collapsed = !!collapsedGroups[group];
          }

          rows.nodes().each(function (r) {
            r.style.display = "none";
            if (collapsed) {
              r.style.display = "";
            }
          });
          // Add category name to the <tr>. NOTE: Hardcoded colspan
          return $("<tr/>")
            .append('<td colspan="8">' + group + " (" + rows.count() + ")</td>")
            .attr("data-name", group)
            .toggleClass("collapsed", collapsed);
        },
      },
    });

    $("#searchResultTable tbody").on("click", "tr.dtrg-start", function () {
      const name = $(this).data("name");
      collapsedGroups[name] = !collapsedGroups[name];
      oTable.draw(false);
    });
  }, [expandAll]);

  const expandAllHandler = () => {
    setExpandAll((current) => !current);
  };

  useEffect(() => {
    if (props.searchResult.length > 0) {
      buildSearchTable();

      const rows = document.querySelectorAll("tr:not(.dtrg-start)");
      rows.forEach((e) => {
        e.addEventListener("contextmenu", contextMenuHandler);
      });

      return () => {
        const oldRows = document.querySelectorAll("tr:not(.dtrg-start)");
        rows.forEach((e) => {
          e.removeEventListener("contextmenu", contextMenuHandler);
        });
      };
    }
  }, [props.searchResult, buildSearchTable]);

  useEffect(() => {
    buildSearchTable();
  }, [expandAll, buildSearchTable]);

  if (props.searchResult.length === 0) return <div>No Result</div>;
  return (
    <Fragment>
      <div className={classes.main}>
        <ButtonCancel onClick={expandAllHandler}>
          Expand All/Collapse All
        </ButtonCancel>
        <table id="searchResultTable" className="table table-striped w-100">
          <thead>
            <tr>
              <th>Title</th>
              <th>Price</th>
              <th>Rating</th>
              <th>Count</th>
              <th className="d-none">Category</th>
            </tr>
          </thead>
          <tbody>
            {props.searchResult.map((result) => (
              <tr key={result.id} data-row-info={JSON.stringify(result)}>
                <td>{result.title}</td>
                <td>{`$${result.price}`}</td>
                <td>{result.rating.rate}</td>
                <td>{result.rating.count}</td>
                <td className="d-none">{result.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <SearchContextMenu
        xLoc={xLoc}
        yLoc={yLoc}
        selectedRow={selectedRow}
        showMenu={showMenu}
        onMouseLeave={hideContextMenu}
      />
    </Fragment>
  );
};

export default React.memo(SearchResult);
