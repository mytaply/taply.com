document.addEventListener("DOMContentLoaded", function () {
  const dropArea = document.getElementById('dropArea');
  const customFile = document.getElementById('media');
  const logoImages = document.querySelectorAll('.custom-logo-priview');
  const taplyLogos = document.querySelectorAll('#taplyLogo'); // Ideally should be class if multiple
  const previewBox = document.querySelector('.customLogo_priview_box');
  const customLogoPreviews = document.querySelectorAll('#custom_logo_priview'); // Ideally should be class if multiple
  const deleteButton = document.getElementById('delete_logo');

  function isImageFile(file) {
    return file && file.type.startsWith('image/');
  }

  function removeTaplyLogos() {
    taplyLogos.forEach(logo => logo.remove());
  }

  function displayFileToAllImages(file) {
    if (!isImageFile(file)) {
      alert("Please upload an image file (jpg, png, webp, etc).");
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
      const imageData = e.target.result;

      // Show in logo previews
      logoImages.forEach(img => {
        img.src = imageData;
        img.style.display = "block";
      });

      customLogoPreviews.forEach(img => {
        img.src = imageData;
        img.style.display = "block";
      });

      if (previewBox) {
        previewBox.style.display = "block";
      }

      if (dropArea) {
        dropArea.style.display = "none";
      }

      removeTaplyLogos();
    };

    reader.readAsDataURL(file);
  }

  if (dropArea) {
    dropArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      dropArea.classList.add('dragover');
    });

    dropArea.addEventListener('dragleave', () => {
      dropArea.classList.remove('dragover');
    });

    dropArea.addEventListener('drop', (e) => {
      e.preventDefault();
      dropArea.classList.remove('dragover');
      const file = e.dataTransfer.files[0];
      displayFileToAllImages(file);
    });
  }

  if (customFile) {
    customFile.addEventListener('change', () => {
      const file = customFile.files[0];
      displayFileToAllImages(file);
    });
  }

  if (deleteButton) {
    deleteButton.addEventListener('click', function () {
      // Clear preview images
      logoImages.forEach(img => {
        img.src = "";
        img.style.display = "none";
      });

      customLogoPreviews.forEach(img => {
        img.src = "";
        img.style.display = "none";
      });

      if (previewBox) {
        previewBox.style.display = "none";
      }

      if (dropArea) {
        dropArea.style.display = "flex";
      }

      if (customFile) {
        customFile.value = "";
      }
    });
  }
});




document.addEventListener("DOMContentLoaded", async () => {
    const sheetId = "1GOKMUAeNefOMPE8KflSIqeoodHYFesaD6aJgRGCi5Ng";
    const apiKey = "AIzaSyACww_yoqNc1ZnF14GTf-WmOR0_gYO8bms";
    const sheetRange = "card!O2:O"; // O কলাম (O2 থেকে শুরু করে নিচ পর্যন্ত)

    const customLogo = document.getElementById("customLogo");

    try {
        const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetRange}?key=${apiKey}`);
        const data = await response.json();

        const values = data.values || [];

        // চেক করা হবে – যদি কোনো সেল এ "Disabled" লেখা থাকে
        const isDisabled = values.some(row => row[0] && row[0].trim().toLowerCase() === "disabled");

        if (isDisabled && customLogo) {
            customLogo.remove();
        }
    } catch (error) {
        console.error("Sheet data fetch error:", error);
    }
});