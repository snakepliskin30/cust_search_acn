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

  const buildSearchTable = () => {
    let collapsedGroups = {};
    const table = $("#searchResultTable").DataTable();
    table.destroy();
    const oTable = $("#searchResultTable").DataTable({
      destroy: true,
      paging: false,
      bFilter: false,
      bInfo: false,
      data: props.searchResult,
      columns: [{ data: "address" }, { data: "addressNotes" }, { data: "accountNo" }, { data: "accountStatus" }, { data: "revenueClass" }, { data: "groupByField" }],
      columnDefs: [
        {
          targets: [5], //Comma separated values
          visible: false,
          searchable: false,
        },
        {
          width: "40%",
          targets: 0,
        },
      ],
      language: {
        search: "Table search: ",
      },
      orderFixed: [[5, "asc"]],
      rowGroup: {
        // Uses the 'row group' plugin
        dataSrc: "groupByField",
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

    oTable.draw();

    $("#searchResultTable tbody").on("click", "tr.dtrg-start", function () {
      const name = $(this).data("name");
      collapsedGroups[name] = !collapsedGroups[name];
      oTable.draw(false);
    });
  };

  useEffect(() => {
    if (props.searchResult.length > 0) {
      buildSearchTable();
      const rows = document.querySelectorAll("tr:not(.dtrg-start)");
      rows.forEach((e) => {
        e.removeEventListener("contextmenu", contextMenuHandler);
      });

      rows.forEach((e) => {
        e.addEventListener("contextmenu", contextMenuHandler);
      });
    }
  }, [props.searchResult]);

  useEffect(() => {
    buildSearchTable();
  }, [expandAll]);

  const hideContextMenu = () => {
    setShowMenu(false);
  };

  const contextMenuHandler = (e) => {
    console.log("context");
    e.preventDefault();
    e.clientX + 200 > window.innerWidth ? setXLoc(window.innerWidth - 210) : setXLoc(e.clientX - 10);
    e.clientY + 70 > window.innerHeight ? setYLoc(window.innerHeight - 70) : setYLoc(e.clientY - 10);
    setSelectedRow(e.target.closest("tr").dataset.rowInfo);
    setShowMenu(true);
  };

  const expandAllHandler = () => {
    setExpandAll((current) => !current);
  };

  if (props.searchResult.length === 0) return <div>No Result</div>;
  return (
    <Fragment>
      <div className={classes.main}>
        <ButtonCancel onClick={expandAllHandler}>Expand All/Collapse All</ButtonCancel>
        <table id="searchResultTable" className="table table-hover w-100">
          <thead>
            <tr>
              <th>Premise Address</th>
              <th>Address Notes</th>
              <th>Account Number</th>
              <th>Account Status</th>
              <th>Revenue Class</th>
              <th>Group By</th>
            </tr>
          </thead>
          {/* <tbody>
            {props.searchResult.map((result, index) => (
              <tr key={index} data-row-info={JSON.stringify(result)}>
                <td>{result.address}</td>
                <td>{result.addressNotes}</td>
                <td>{result.accountNo}</td>
                <td>{result.accountStatus}</td>
                <td>{result.revenueClass}</td>
                <td className="d-none">{result.groupByField}</td>
              </tr>
            ))}
          </tbody> */}
        </table>
      </div>
      <SearchContextMenu xLoc={xLoc} yLoc={yLoc} selectedRow={selectedRow} showMenu={showMenu} onMouseLeave={hideContextMenu} />
    </Fragment>
  );
};

export default React.memo(SearchResult);
