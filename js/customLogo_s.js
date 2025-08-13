    const scriptURL = "https://script.google.com/macros/s/AKfycbzwvnGMQ_K1PXqkV4Ik0id5uJV4HjJR0NV79b-oH4s_mCcB4uQIxsMhzsyfVZxo2mq_/exec";
    const form = document.getElementById("submit-to-google-sheet");
    const fileInput = document.getElementById("media");
    const submitButton = document.getElementById("save");

    // Show image preview
    fileInput.addEventListener('change', function (event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
        };
        reader.readAsDataURL(file);
      } else {

      }
    });

    // Form submit
    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const file = fileInput.files[0];

      // Validate file
      if (!file) {
        swal("Error", "Please select an image file to upload.", "error");
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        swal("Error", "File size should be less than 2MB.", "error");
        return;
      }

      const reader = new FileReader();
      reader.onload = async function () {
        const base64Data = reader.result.split(",")[1]; // Extract base64 from data URL
        const formData = new FormData();
        formData.append("media", base64Data);

        // Submit form
        await submitForm(formData);
      };
      reader.readAsDataURL(file);
    });

    // Send to Google Apps Script
    async function submitForm(formData) {
      submitButton.disabled = true;
      submitButton.innerText = "Loading...";

      try {
        const response = await fetch(scriptURL, {
          method: "POST",
          body: formData
        });

        if (response.ok) {
          swal("Done", "Image uploaded successfully!", "success");
          form.reset();
        } else {
          swal("Error", "Upload failed. Try again later.", "error");
        }
      } catch (err) {
        console.error(err);
        swal("Error", "Something went wrong. Please try again.", "error");
      } finally {
        submitButton.disabled = false;
        submitButton.innerText = "Save";
      }
    }