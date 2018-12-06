"use strict";
console.log('--> search.js active...');

/*************************
 search.js:
  search()
  countHits.js/count()
  correlate()
    getgridPrecision()
 *************************/


/***********************************************************/
/***                      search()                      ***/
//Searches input reporting to finds keywords, totals, and correlate gists
//Calls countHits.js/count(), to get count of keywords in reporting

function search(gridObject) {

  // --- Input -- get user input when search button is clicked
   keywordsIn = document.getElementById("keywordsIn").value.toLowerCase().trim();

   keywords = keywordsIn.split(/\sor\s|,/ig);

  //remove spaces from keywords
  for (var i = 0, l = keywords.length; i < l; i++) {
    keywords[i] = keywords[i].trim();
  }

   reporting = document.getElementById("reportingIn").value;

  //get user input from radio buttons, parseInt converts string to number for use in getgridPrecision() switch statement
   gridIn = parseInt(document.querySelector('input[name="gridIn"]:checked').value);

  //Validate Input
  var message;
  message = document.getElementById("validateInput");
  message.innerHTML = "";
  try {
    if (keywordsIn === "") throw "empty, add search terms";
    if (reporting === "") throw "empty, add reporting";
    if (reporting.trim() === "") throw "empty, add reporting";
  }
  catch (err) {
    message.innerHTML = "Input is " + err;
    throw new Error("No input!");
  }

  // --- Count Hits
  //call countHits.js/counts() to count total keywords in reporting string
  keywords.forEach(countKeywordHits);

  // --- Gist
  //call correlate() to get the reporting gist snippet associated with a keyword and grid
  gridObject = correlate(gridObject); // --> see below for correlate()

  // --- Output
  //output to table with ag-grid

  var rowData = [];
  for (var term in gridObject) {
    gridObject[term].forEach(function (matchObject) {
      rowData.push(matchObject);
    });
  }
  gridOptions.api.setRowData(rowData);

}   //end search()

/***********************************************************/
/***                  correlate()                   ***/
// Get reporting gist correlated with keywords and grids
//For each keyword in array get grid if within 50 characters of keyword and create gist

function correlate(gridObject) {
  //TODO consider making gistLength a user input variable so user can decide gist snippet size
  //gistLegth is the number of characters on either side of the keyword. The total size from slider is divided by half.
  var gistLength = parseInt(gistSlider.value)/2;
  // var gistLength = 50;
  var countExtractedGrids = 0;
  var match;
  // var match = null;

  //get precision value of MGRS from getgridPrecision()
  var regMgrs = getgridPrecision(gridIn);   // --> see below for getgridPrecision()

  // iterate keywords array, get keyword occurrences, make gist, look for grid
  for (var i = 0; i < keywords.length; i++) {

    // --- Iterate reporting input to find each occurrence of the keyword
    //while a keyword is found in reporting, create a gist snippet, check for grid in snippet

    var keywordPattern = new RegExp(keywords[i], 'gi');

    while ((match = keywordPattern.exec(reporting)) !== null) {
      var keywordLocation = match.index;

      //Get the beginning of the gist
      var begin = keywordLocation - gistLength;

      //Make sure begin is a 0 or a positive number so it relative to the beginning of the reporting.
      // A negative number starts gist from end of reporting.
      if (begin > 0) {
        var beginGist = begin;
      } else {
        beginGist = 0;
      }

      //get the end of the gist snippet
      //make sure the endGist does not go past the end of reporting
      var end = keywordLocation + gistLength;
      if (end < reporting.length) {
        var endGist = end;
      } else {
        endGist = reporting.length;
      }   //end if-else


      //Use for output, slice a snippet of reporting using begin and end
      // var gistSnippet = reporting.slice(beginGist, endGist);
      var gistSnippet = "..." + reporting.slice(beginGist, endGist);

      //set regex.lastIndex to zero so it will not return null for last keyword occurrence
      regMgrs.lastIndex = 0;
      var gridMatch = regMgrs.exec(gistSnippet);

      // if grid is found in gistSnippet, then create an array in object if it doesn't have one
      if (gridMatch !== null) {
        //If there is not a keyword in gridObject, add a keyword array
        if (!gridObject.hasOwnProperty(keywords[i])) {
          gridObject[keywords[i]] = [];
        }   //end if loop

        //collect values into a temporary object then push to grid object
        var tempGridMatchObject = {
          keyword: keywords[i],
          grid: gridMatch[0],
          gist: gistSnippet
        };
        gridObject[keywords[i]].push(tempGridMatchObject);
        //get a count of keywords with grids for output to count box
        countExtractedGrids++;


      }  //end if loop if gridMatch = null, if not null find keyword and grid, when null skips here

    }  //end while loop end iterating reporting,  continue if keyword is in reporting

  }   //end of for loop iterating keywords

  document.getElementById("extractedLocations").innerHTML = countExtractedGrids
    + "<br/><br/>" + findPrecisionLabel(gridIn);

  return gridObject;
}     //end correlate()


/***********************************************************/
/***                  getgridPrecision()                   ***/
//get grid precision from user input and return Regex value

function getgridPrecision(gridIn) {

  switch (gridIn) {
    case 1:
      regMgrs = new RegExp(formatRegex('+'), 'g');
      break;
    case 10:
      regMgrs = new RegExp(formatRegex('{5}'), 'g');
      break;
    case 8:
      regMgrs = new RegExp(formatRegex('{4}'), 'g');
      break;
    case 6:
      regMgrs = new RegExp(formatRegex('{3}'), 'g');
      break;
    default:
      regMgrs = new RegExp(formatRegex('+'), 'g');
  }   //end switch(gridIn)
  return regMgrs;

  function formatRegex(input) {
    var baseRegexString = '\\d{1,2}[^ABIOYZabioyza][A-Za-z]{2}([0-9]{2})';
    return '\\b' + baseRegexString + input + '\\b';
  }
}

function findPrecisionLabel(gridIn) {

  switch (gridIn) {
    case 1:
      var precisionLabel = "Precision: 1, 10, 100 meters";
      break;
    case 10:
      precisionLabel = "Precision: 1m";
      break;
    case 8:
      precisionLabel = "Precision: 10m";
      break;
    case 6:
      precisionLabel = "Precision: 100m";
      break;
    default:
      precisionLabel = "Precision: 1, 10, 100 meters";
  }   //end switch(gridIn)
  return precisionLabel;
}
