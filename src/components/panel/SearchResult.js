import React, { Fragment, useEffect, useState } from "react";
import PropTypes from "prop-types";
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
  console.log("searchResult", props.searchResult);
  const [selectedRow, setSelectedRow] = useState("");
  const [xLoc, setXLoc] = useState(0);
  const [yLoc, setYLoc] = useState(0);
  const [showMenu, setShowMenu] = useState(false);
  const [expandAll, setExpandAll] = useState(true);

  const buildSearchTable = () => {
    let columns;
    let columnDefs;
    if (props.searchResult.isCustSearch) {
      columns = [
        { data: "address", title: "Premise Address" },
        { data: "addressNotes", title: "Address Notes" },
        { data: "accountNoFormatted", title: "Account Number" },
        { data: "accountStatus", title: "Account Status" },
        { data: "revenueClass", title: "Revenue Class" },
        { data: "groupByField", title: "Group By" },
      ];
      columnDefs = [
        {
          targets: [5], //Comma separated values
          visible: false,
          searchable: false,
        },
        {
          width: "40%",
          targets: 0,
        },
      ];
    } else {
      columns = [
        { data: "fullname", title: "Customer Name" },
        { data: "addressNotes", title: "Address Notes" },
        { data: "accountNoFormatted", title: "Account Number" },
        { data: "accountStatus", title: "Account Status" },
        { data: "revenueClass", title: "Revenue Class" },
        { data: "groupByField", title: "Group By" },
      ];
      columnDefs = [
        {
          targets: [1, 5], //Comma separated values
          visible: false,
          searchable: false,
        },
        {
          width: "40%",
          targets: 0,
        },
      ];
    }
    let collapsedGroups = {};
    const oTable = $("#searchResultTable").DataTable({
      destroy: true,
      paging: false,
      bFilter: false,
      bInfo: false,
      data: props.searchResult.data,
      columns: columns,
      columnDefs: columnDefs,
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

    $("#searchResultTable tbody").on("click", "tr.dtrg-start", function () {
      const name = $(this).data("name");
      collapsedGroups[name] = !collapsedGroups[name];
      oTable.draw(false);
    });

    const rows = document.querySelectorAll("tr:not(.dtrg-start)");
    rows.forEach((e) => {
      e.addEventListener("contextmenu", contextMenuHandler);
    });
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

  useEffect(() => {
    if (props.searchResult.data.length > 0) {
      buildSearchTable();
    }
  }, [props.searchResult]);

  useEffect(() => {
    buildSearchTable();
  }, [expandAll]);

  const hideContextMenu = () => {
    setShowMenu(false);
  };

  const expandAllHandler = () => {
    setExpandAll((current) => !current);
  };

  if (props.searchResult.data.length === 0) return <div>No Result</div>;
  return (
    <Fragment>
      <div className={classes.main}>
        <ButtonCancel onClick={expandAllHandler}>
          Expand All/Collapse All
        </ButtonCancel>
        <table id="searchResultTable" className="table table-hover w-100">
          {/* <thead>
            <tr>
              <th>Premise Address</th>
              <th>Address Notes</th>
              <th>Account Number</th>
              <th>Account Status</th>
              <th>Revenue Class</th>
              <th>Group By</th>
            </tr>
          </thead> */}
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

SearchResult.propTypes = {
  searchResult: PropTypes.array.isRequired,
};

export default React.memo(SearchResult);
