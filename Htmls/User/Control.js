function printDiv(divName) {
  var printContents = document.getElementById(divName).innerHTML;
  var originalContents = document.body.innerHTML;

  // Temporarily replace the body content with the content to be printed
  document.body.innerHTML = printContents;

  // Open the print dialog
  window.print();

  // Restore the original body content
  document.body.innerHTML = originalContents;
}




function downloadDivContent() {
  // Get the content of the div
  let content = document.getElementById("contentToDownload").innerHTML;

  // Create a blob from the content
  let blob = new Blob([content], { type: "text/plain" });

  // Create a link element
  let link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "div_content.txt"; // Set the file name

  // Simulate a click on the link to start the download
  link.click();

  // Remove the link from the DOM
  link.remove();
}




// test 




function downloadDivContent() {
  // Get the div element
  let content = document.getElementById("contentToDownload");

  // Use html2canvas to capture the div content
  html2canvas(content).then((canvas) => {
    // Get the canvas data URL
    let dataURL = canvas.toDataURL("image/png"); // Use 'image/jpeg' for JPG

    // Create a link element
    let link = document.createElement("a");
    link.href = dataURL;
    link.download = "div_content.png"; // Use 'div_content.jpg' for JPG

    // Simulate a click on the link to start the download
    link.click();

    // Remove the link from the DOM
    link.remove();
  });
}
