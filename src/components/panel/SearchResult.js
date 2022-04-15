import React, { useEffect } from "react";

//Datatable Modules
import "jquery/dist/jquery.min.js";
import "datatables.net/js/jquery.dataTables";
import "datatables.net-dt/css/jquery.dataTables.css";
import "datatables.net-rowgroup/js/dataTables.rowGroup.min.js";
import $ from "jquery";

import "bootstrap/dist/css/bootstrap.min.css";
import classes from "./SearchResult.module.css";

const SearchResult = (props) => {
  let collapsedGroups = {};

  const buildSearchTable = () => {
    const oTable = $("#example").DataTable({
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
          // var collapsed = !!collapsedGroups[group]; // default to collapse all; original code
          const collapsed = !collapsedGroups[group]; // default to expand all

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

    $("#example tbody").on("click", "tr.dtrg-start", function () {
      const name = $(this).data("name");
      collapsedGroups[name] = !collapsedGroups[name];
      oTable.draw(false);
    });
  };

  useEffect(() => {
    buildSearchTable();
  }, []);

  return (
    <div className={classes.main}>
      <table id="example" className="table table-striped">
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
            <tr key={result.id}>
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
  );
};

export default React.memo(SearchResult);
