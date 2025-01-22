const html5QrCode = new Html5Qrcode("reader");

function onScanSuccess(decodedText) {
  html5QrCode.stop();
  document.getElementById("status").innerText = "⏳ Waiting..."

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
          const decodedElement = document.getElementById("decoded");
          decodedElement.innerText = `${decodedText}`;
          const toggleValue = document.querySelector(".toggle-switch input").checked ? "P" : "A"; // Determine the toggle state
          const firstLetter = decodedText.charAt(0);
          if (data.isValid) {
            document.body.classList.remove("white-class");
              switch (data.class) {
                  case "G":
                      if (decodedText.startsWith("AM")) {
                        document.body.style.backgroundColor = "#87CEEB";
                        statusElement.innerText = `✅ 🟦 - AM Guest: ${data.info}`;
                      } else if(decodedText.startsWith("PM")) {
                        document.body.style.backgroundColor = "#008000";
                        statusElement.innerText = `✅ 🟩 - PM Guest: ${data.info}`;
                      } 

                      if (firstLetter == toggleValue){
                        document.getElementById("AMPM").innerText = "✅"
                      } else {
                        document.getElementById("AMPM").innerText = "❌❌❌"
                      }

                      break;
                  case "S":
                      document.body.style.backgroundColor = "#white";
                      statusElement.innerText = `✅ 🤍 - Speaker/Moderator: ${data.info}`;
                      document.getElementById("AMPM").innerText = "..."

                      break;
                  case "E":
                      document.body.style.backgroundColor = "#898989";
                      statusElement.innerText = `✅ 🩶 - Exhibitor/Brand Rep: ${data.info}`;
                      document.getElementById("AMPM").innerText = "..."

                      break;
                  case "T":
                      document.body.style.backgroundColor = "#ffc300";
                      statusElement.innerText = `✅ 💛 - TBT/180 Staff: ${data.info}`;
                      document.getElementById("AMPM").innerText = "..."

                      break;
                  default:
                      document.body.style.backgroundColor = "grey";
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
    document.body.className = "white-class";
    document.getElementById("status").innerText = "🚀 Ready to scan!"
    document.getElementById("decoded").innerText = "Awaiting scan..."
    document.getElementById("AMPM").innerText = "..."


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
    document.getElementById("decoded").innerText = "Awaiting scan..."
    document.getElementById("status").innerText = "Awaiting scan..."
    document.getElementById("AMPM").innerText = "..."
    html5QrCode.stop().then(() => {
        console.log("Scanner stopped");
    }).catch(err => {
        console.error("Error stopping QR scanner:", err);
    });
}

// Buttons to control the scanner
document.getElementById("start-button").addEventListener("click", startScanner);
document.getElementById("stop-button").addEventListener("click", stopScanner);
