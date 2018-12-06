"use strict";
console.log('--> main.js active...');

/*************************
toggleText()
resetForm()
sampleData()
*************************/



/***********************************************************/
/*              toggleText()                          */
//***** Expands/collapses instructions *****

function toggleText() {
  var divID = "MyDiv";
  var divObject = document.getElementById(divID);

  if (divObject.className === "divVisible")
    return divObject.className = "divHidden";
  else
    return divObject.className = "divVisible";
}   //end toggleText()



/***********************************************************/
/*              showExportBtn()                          */
//***** shows export button *****

function showExportBtn() {
  var divID = "showExport";
  var divObject = document.getElementById(divID);

  // if (divObject.className === "divVisible")
    return divObject.className = "divVisible";
  // else
    // return divObject.className = "divVisible";
}   //end showExprotBtn()



/***********************************************************/
//*****              gistSlider()                       ***/

var gistSlider = document.getElementById("gist-slider");
var gistSliderOutput = document.getElementById("gist-size-out");
gistSliderOutput.innerHTML = gistSlider.value; // Display the default slider value

// Update the current slider value (each time you drag the slider handle)
gistSlider.oninput = function() {
  gistSliderOutput.innerHTML = this.value;
};


/***********************************************************/
//*****              resetForm()                       ***/

function resetForm() {
  document.getElementById("keywordsIn").value = "";
  document.getElementById("reportingIn").value = "";
  document.getElementById("gist-slider").value = "75";
  window.location.reload();

}   //end resetForm()

