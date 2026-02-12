// ==================================================
// 🔐 CONFIGURATION
// Replace YOUR_API_BASE_URL with your real API
// in your local or production environment.
// ==================================================
const CONFIG = {
  API_BASE_URL: "YOUR_API_BASE_URL" // Example: https://abc123.execute-api.us-east-1.amazonaws.com/prod
};

// ==================================================
// ✅ SHOW SELECTED FILE NAME
// ==================================================
function showFileName() {
  const fileInput = document.getElementById("fileInput");
  const fileInfo = document.getElementById("fileInfo");
  const fileLabel = document.getElementById("fileLabel");

  if (fileInput.files && fileInput.files.length > 0) {
    const file = fileInput.files[0];
    const sizeKB = (file.size / 1024).toFixed(2);

    fileInfo.textContent = `Selected: ${file.name} (${sizeKB} KB)`;
    fileLabel.textContent = "Change File";
  } else {
    fileInfo.textContent = "";
    fileLabel.textContent = "Choose File";
  }
}

// ==================================================
// ⬆️ UPLOAD FILE
// ==================================================
async function uploadFile() {
  const fileInput = document.getElementById("fileInput");
  const status = document.getElementById("status");

  if (!fileInput.files.length) {
    alert("Please select a file");
    return;
  }

  const file = fileInput.files[0];
  status.innerText = "Uploading...";

  const reader = new FileReader();

  reader.onload = async () => {
    const base64Data = reader.result.split(",")[1];

    try {
      const response = await fetch(
        `${CONFIG.API_BASE_URL}/upload`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            filename: file.name,
            file: base64Data
          })
        }
      );

      const result = await response.json();

      if (response.ok) {
        status.innerHTML = `
          ✅ Uploaded successfully! <br><br>
          <button onclick="downloadFile('${result.fileId}')">
            Download Processed File
          </button>
        `;
      } else {
        status.innerText = "❌ Upload failed";
        console.error(result);
      }
    } catch (error) {
      status.innerText = "❌ Error uploading file";
      console.error(error);
    }
  };

  reader.readAsDataURL(file);
}

// ==================================================
// 🔽 DOWNLOAD FILE
// ==================================================
async function downloadFile(fileId) {
  try {
    const response = await fetch(
      `${CONFIG.API_BASE_URL}/download?fileId=${encodeURIComponent(fileId)}`
    );

    const result = await response.json();

    if (response.ok) {
      window.open(result.downloadUrl, "_blank");
    } else {
      alert("Download failed");
      console.error(result);
    }
  } catch (error) {
    alert("Error downloading file");
    console.error(error);
  }
}
