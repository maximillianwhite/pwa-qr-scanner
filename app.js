// Load the list of valid codes
let codes = [];
fetch("codes.json")
    .then(response => response.json())
    .then(data => codes = data)
    .catch(error => {
        console.error("Error loading codes:", error);
        document.getElementById("status").innerText = "❌ Failed to load codes.";
    });

const html5QrCode = new Html5Qrcode("reader");

function onScanSuccess(decodedText) {

  const resultElement = document.getElementById("result");
  const statusElement = document.getElementById("status");

  // Find the code in the JSON array
  const matchedCode = codes.find(item => item.code === decodedText);

  if (matchedCode) {
    console.log("matchedCode:", typeof matchedCode.class);

    // Display associated info
    // resultElement.innerText = `Code: ${decodedText}`;
    document.getElementById("status").innerText = `✅ Valid: ${matchedCode.info}`;

    // Change background color based on class
    switch (matchedCode.class) {
      case "G":
        document.body.style.backgroundColor = "#C1E1C1";
        html5QrCode.stop();
        break;
      case "S":
        document.body.style.backgroundColor = "#FFC300";
        html5QrCode.stop();
        break;
      case "O":
        document.body.style.backgroundColor = "A7C7E7";
        html5QrCode.stop();
        break;
      default:
        document.body.style.backgroundColor = "black";
        html5QrCode.stop();
    }
  } else {
    // Invalid code
    document.body.style.backgroundColor = "#FAA0A0";

    //resultElement.innerText = `Code: ${decodedText}`;
    document.getElementById("status").innerText = "❌ Code is not valid!";
    html5QrCode.stop(); // Stop scanning

  }
}



// Start the scanner
function startScanner() {
    document.body.style.backgroundColor = "white";

    html5QrCode.start(
        { facingMode: "environment" }, // Rear camera if available
        { fps: 10, qrbox: 250 },
        (decodedText) => {
            console.log("INITIAL SCAN:", decodedText);

            onScanSuccess(decodedText)
            // if (codes.includes(decodedText)) {
            //     document.getElementById("status").innerText = "✅ Code is valid!";
            //     document.body.style.backgroundColor = "#C1E1C1";
            //     html5QrCode.stop(); // Stop scanning
            // } else {
            //     document.getElementById("status").innerText = "❌ Code is not valid!";
            //     document.body.style.backgroundColor = "#FAA0A0";
            //     html5QrCode.stop(); // Stop scanning
            // }
        },
        (error) => {
            console.warn(`Scan error: ${error}`);
        }
    ).catch(err => {
        console.error("Error starting QR scanner:", err);
    });
}

// Stop the scanner
function stopScanner() {
    document.body.style.backgroundColor = "white";
    html5QrCode.stop().then(() => {
        console.log("Scanner stopped");
    }).catch(err => {
        console.error("Error stopping QR scanner:", err);
    });
}

// Buttons to control the scanner
document.getElementById("start-button").addEventListener("click", startScanner);
document.getElementById("stop-button").addEventListener("click", stopScanner);
