"use strict";
console.log('--> main.js active...');

/*************************
mainSearch()
 search.js:
   search()
      countHits.js/countKeywordHits()
      search.js/correlate()
      search.js/getgridPrecision()
 gridTotal()
*************************/

//Global Variables

var precision, regMgrs;
var keywordsIn = "";
var keywords = [];
var reporting = "";
var gridIn = "";

var grid = false;
var gridOptions = {};
var gridObject = {};

document.getElementById('keywordsIn').focus();
document.getElementById('keywordsIn').select();


/***********************************************************/
/***                    mainSearch()                     ***/
/***  responds to search button and runs search functions ***/
function mainSearch() {
  if (!grid) {
    setUpGrid();
  }
  gridOptions.api.setRowData([]);

  document.getElementById('countKeywords').textContent = '';
  gridObject = {};

  //Searches to find keywords, create a gist snippet and find any grids in the gist.
  search(gridObject);

  //Counts total grids and displays data in sidebar
  gridTotal();

  //shows export button when results table is created
  showExportBtn();

}   //end mainSearch()


//Table Output for AG-Grid

function setUpGrid() {
  var columnDefs = [
    //define three columns
    { headerName: "KEYWORD", field: "keyword", width: 120 },
    { headerName: "GRID", field: "grid", width: 150 },
    { headerName: "GIST", field: "gist", width: 1200 }
  ];

  gridOptions = {
    columnDefs: columnDefs,
    // rowHeight: 50,
    rowSelection: 'multiple',
    rowMultiSelectWithClick: true,
    rowData: []
    // getRowHeight: function(params) {
    //   // assuming 50 characters per line, working how how many lines we need
    //   return 18 * (Math.floor(params.data.name.length / 45) + 1);
    // }
  };

  var eGridDiv = document.querySelector('#myGrid');
  grid = new agGrid.Grid(eGridDiv, gridOptions);


  return grid;
}   //end setUpGrid()


function onBtnExport() {
  var params = {
    skipHeader: false,
    fileName: "Q-Tip.csv"
  };

  gridOptions.api.exportDataAsCsv(params);
}



