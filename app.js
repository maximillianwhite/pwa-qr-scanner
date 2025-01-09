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

// Start the scanner
function startScanner() {
    document.body.style.backgroundColor = "white";

    html5QrCode.start(
        { facingMode: "environment" }, // Rear camera if available
        { fps: 10, qrbox: 250 },
        (decodedText) => {
            console.log("QR Code Scanned:", decodedText);

            if (codes.includes(decodedText)) {
                document.getElementById("status").innerText = "✅ Code is valid!";
                document.body.style.backgroundColor = "#C1E1C1";
                html5QrCode.stop(); // Stop scanning
            } else {
                document.getElementById("status").innerText = "❌ Code is not valid!";
                document.body.style.backgroundColor = "#FAA0A0";
                html5QrCode.stop(); // Stop scanning
            }
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
    html5QrCode.stop().then(() => {
        console.log("Scanner stopped");
    }).catch(err => {
        console.error("Error stopping QR scanner:", err);
    });
}

// Example buttons to control the scanner
document.getElementById("start-button").addEventListener("click", startScanner);
document.getElementById("stop-button").addEventListener("click", stopScanner);
