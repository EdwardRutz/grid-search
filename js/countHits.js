"use strict";
console.log("--> countHits active...");


/*************************
countHits.js
  countKeywordHits()
  gridTotal()
  extractedGrids()
  sampleData()
*************************/



/***********************************************************/
/***                      countKeywordHits()                      ***/
//Called from search(), counts keyword using regEx
//counts total keywords in reporting string



function countKeywordHits(value) {
  var termItem = new RegExp(value, 'ig');
  var count = (reporting.match(termItem) || []).length;
  var countKeywords = value + " - " + count + "<br>";

  return document.getElementById("countKeywords").innerHTML += countKeywords;

}   //end countKeywordHits


/***********************************************************/
/*              gridTotal()                          */
//Gets Total of all MGRS grids and outputs to "Total Location Count"
//.toString() converts, needs to be string for output

var gridCount = '';

function gridTotal() {
  // noinspection Annotator
  gridCount = reporting.match(/\d{1,2}[^ABIOYZabioyza][A-Za-z]{2}([0-9]{2})+/g).length;

  return document.getElementById("totalLocCount").innerHTML = gridCount;

}   //end gridTotal



