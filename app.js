// Load the list of valid codes from a JSON file (hosted online or locally)
let codes = [];
fetch("codes.json") // Replace with your URL if hosted externally
    .then(response => response.json())
    .then(data => codes = data)
    .catch(error => {
        console.error("Error loading codes:", error);
        document.getElementById("status").innerText = "❌ Failed to load codes.";
    });


    console.log("Html5QrcodeScanner:", typeof Html5QrcodeScanner);




// QR code scanning logic
function onScanSuccess(decodedText) {
    document.getElementById("result").innerText = decodedText;

    // Validate the scanned code
    if (!decodedText || decodedText.trim() === "") {
        document.getElementById("status").innerText = "❌ Invalid QR code.";
        return;
    }

    // Compare scanned code with the list
    if (codes.includes(decodedText)) {
        document.getElementById("status").innerText = "✅ Code is valid!";
    } else {
        document.getElementById("status").innerText = "❌ Code is not valid!";
    }
}

function onScanFailure(error) {
    console.warn(`Code scan error: ${error}`);
}

// Initialize QR scanner
const html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
html5QrcodeScanner.render(onScanSuccess, onScanFailure);
