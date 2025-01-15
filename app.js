// Load the list of valid codes
// let codes = [];
// fetch("codes.json")
//     .then(response => response.json())
//     .then(data => codes = data)
//     .catch(error => {
//         console.error("Error loading codes:", error);
//         document.getElementById("status").innerText = "❌ Failed to load codes.";
//     });

const html5QrCode = new Html5Qrcode("reader");

function onScanSuccess(decodedText) {
  html5QrCode.stop();
  document.getElementById("status").innerText = "⏳ Waiting..."

  // Replace 'your-webhook-id' with your actual Make webhook URL
  fetch("https://hook.eu2.make.com/ytl5sarw52y1dcq7mx9oilz6xj3a8snp", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({ code: decodedText }) // Send the scanned QR code
  })
      .then(response => response.json())
      .then(data => {
          const statusElement = document.getElementById("status");
          if (data.isValid) {
              // Valid code
              statusElement.innerText = `✅ Valid: ${data.info}`;
              switch (data.class) {
                  case "G":
                      document.body.style.backgroundColor = "#C1E1C1";
                      break;
                  case "S":
                      document.body.style.backgroundColor = "#FFC300";
                      break;
                  case "O":
                      document.body.style.backgroundColor = "#A7C7E7";
                      break;
                  default:
                      document.body.style.backgroundColor = "black";
              }
          } else {
              // Invalid code
              statusElement.innerText = "❌ Code is not valid!";
              document.body.style.backgroundColor = "#FAA0A0";
          }
          //html5QrCode.stop(); // Stop the scanner after processing
      })
      .catch(error => {
          console.error("Error communicating with webhook:", error);
          document.getElementById("status").innerText = "❌ Error processing the code.";
      });
}




// Start the scanner
function startScanner() {
    document.body.style.backgroundColor = "white";
    document.getElementById("status").innerText = "🚀 Ready to scan!"

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
