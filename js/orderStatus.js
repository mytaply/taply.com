const apiKey = "AIzaSyACww_yoqNc1ZnF14GTf-WmOR0_gYO8bms";
        
document.getElementById("check-status").addEventListener("click", function() {
  const query = document.getElementById("order-input").value.trim();
  if (!query) {
    alert("Please enter an Order ID or Email Address.");
    return;
  }
  
  // Define your spreadsheet details
  const spreadsheetId = "1GOKMUAeNefOMPE8KflSIqeoodHYFesaD6aJgRGCi5Ng";
  const range = "order!A:V"; 
  
  // Build the Google Sheets API URL using the API key
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${range}?key=${apiKey}`;
  
  fetch(url)
    .then(response => response.json())
    .then(data => {
      const rows = data.values;
      if (!rows || rows.length < 2) {
        throw new Error("No data found in spreadsheet");
      }
      
      // Assume the first row is the header row
      const headers = rows[0];
      const userIdIndex = headers.indexOf("UserId");
      const nameIndex = headers.indexOf("orderName");
      const emailIndex = headers.indexOf("Email");
      const statusIndex = headers.indexOf("Status");
      const dateIndex = headers.indexOf("Date");
      
      let result = null;
      // Loop through each row (starting from row index 1)
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i];
        if (
          (row[userIdIndex] && row[userIdIndex].toLowerCase() === query.toLowerCase()) ||
          (row[emailIndex] && row[emailIndex].toLowerCase() === query.toLowerCase())
        ) {
          result = {
            orderId: row[userIdIndex],
            customerName: row[nameIndex],
            email: row[emailIndex],
            status: row[statusIndex], // Added missing comma here
            date: row[dateIndex]
          };
          break;
        }
      }
      
      if (result) {
        document.getElementById("order-id").textContent = result.orderId;
        document.getElementById("customer-name").textContent = result.customerName;
        document.getElementById("email").textContent = result.email;
        document.getElementById("status").textContent = result.status;
        document.getElementById("date").textContent = result.date;
        
        // Update timeline progress based on the status value
        const progressBar = document.querySelector(".time-line-progress");

        const stmiOneElements = document.querySelectorAll(".stmiOne");
        const stmiTowElements = document.querySelectorAll(".stmiTow");
        const stmiThreeElements = document.querySelectorAll(".stmiThree");
        const stmiForeElements = document.querySelectorAll(".stmiFore");
        const stmiFiveElements = document.querySelectorAll(".stmiFive");
        const stmiSixElements = document.querySelectorAll(".stmiSix");

        const stmOneElements = document.querySelectorAll(".stmOne");
        const stmTowElements = document.querySelectorAll(".stmTow");
        const stmThreeElements = document.querySelectorAll(".stmThree");
        const stmForeElements = document.querySelectorAll(".stmFore");
        const stmFiveElements = document.querySelectorAll(".stmFive");
        const stmSixElements = document.querySelectorAll(".stmSix");

        const statusBg = document.querySelectorAll(".status-bg");

        // Reset all styles to default initially
        function resetStyles() {
        progressBar.style.width = ""; // Resets to original CSS value

        stmiOneElements.forEach(el => el.style.color = "");
        stmiTowElements.forEach(el => el.style.color = "");
        stmiThreeElements.forEach(el => el.style.color = "");
        stmiForeElements.forEach(el => el.style.color = "");
        stmiFiveElements.forEach(el => el.style.color = "");
        stmiSixElements.forEach(el => el.style.color = "");

        stmOneElements.forEach(el => el.style.background = "");
        stmTowElements.forEach(el => el.style.background = "");
        stmThreeElements.forEach(el => el.style.background = "");
        stmForeElements.forEach(el => el.style.background = "");
        stmFiveElements.forEach(el => el.style.background = "");
        stmSixElements.forEach(el => el.style.background = "");

        statusBg.forEach(el => el.style.background = "");
        
        }

        if (result.status) {
        const status = result.status.toLowerCase();
        resetStyles(); // Clear previous state before applying new styles

        switch (status) {
            case "process":
            progressBar.style.width = "7%";
            stmiOneElements.forEach(el => el.style.color = "#3e88ff");

            stmOneElements.forEach(el => el.style.background = "#3e88ff");

            statusBg.forEach(el => el.style.background = "#d4edbc");
            statusBg.forEach(el => el.style.color = "#2c5c00");
            break;
            
            case "design":
            progressBar.style.width = "24%";
            // Apply styles to both first and second elements
            stmiOneElements.forEach(el => el.style.color = "#3e88ff");
            stmiTowElements.forEach(el => el.style.color = "#3e88ff");

            statusBg.forEach(el => el.style.background = "#d4edbc");
            statusBg.forEach(el => el.style.color = "#2c5c00");

            stmOneElements.forEach((el, index) => {
                if (index === 0) {
                el.innerHTML = "&check;";
                el.style.background = "#3e88ff"; 
                } else {
                el.style.background = "#3e88ff";
                el.innerHTML = "";
                }
            });
            stmTowElements.forEach(el => el.style.background = "#3e88ff");
            break;
            
            case "printing":
            progressBar.style.width = "41%";
            // Apply styles to both first and second elements
            stmiOneElements.forEach(el => el.style.color = "#3e88ff");
            stmiTowElements.forEach(el => el.style.color = "#3e88ff");
            stmiThreeElements.forEach(el => el.style.color = "#3e88ff");

            statusBg.forEach(el => el.style.background = "#d4edbc");
            statusBg.forEach(el => el.style.color = "#2c5c00");

            stmOneElements.forEach((el, index) => {
                if (index === 0) {
                el.innerHTML = "&check;";
                el.style.background = "#3e88ff"; 
                } else {
                el.style.background = "#3e88ff";
                el.innerHTML = "";
                }
            });
            stmTowElements.forEach((el, index) => {
                if (index === 0) {
                el.innerHTML = "&check;";
                el.style.background = "#3e88ff"; 
                } else {
                el.style.background = "#3e88ff";
                el.innerHTML = "";
                }
            });
            stmThreeElements.forEach(el => el.style.background = "#3e88ff");
            break;

            case "packaging":
            progressBar.style.width = "58%";
            // Apply styles to both first and second elements
            stmiOneElements.forEach(el => el.style.color = "#3e88ff");
            stmiTowElements.forEach(el => el.style.color = "#3e88ff");
            stmiThreeElements.forEach(el => el.style.color = "#3e88ff");
            stmiForeElements.forEach(el => el.style.color = "#3e88ff");

            statusBg.forEach(el => el.style.background = "#d4edbc");
            statusBg.forEach(el => el.style.color = "#2c5c00");

            stmOneElements.forEach((el, index) => {
                if (index === 0) {
                el.innerHTML = "&check;";
                el.style.background = "#3e88ff"; 
                } else {
                el.style.background = "#3e88ff";
                el.innerHTML = "";
                }
            });
            stmTowElements.forEach((el, index) => {
                if (index === 0) {
                el.innerHTML = "&check;";
                el.style.background = "#3e88ff"; 
                } else {
                el.style.background = "#3e88ff";
                el.innerHTML = "";
                }
            });
            stmThreeElements.forEach((el, index) => {
                if (index === 0) {
                el.innerHTML = "&check;";
                el.style.background = "#3e88ff"; 
                } else {
                el.style.background = "#3e88ff";
                el.innerHTML = "";
                }
            });
            stmForeElements.forEach(el => el.style.background = "#3e88ff");
            break;

            case "ready for delivery":
            progressBar.style.width = "75%";
            // Apply styles to both first and second elements
            stmiOneElements.forEach(el => el.style.color = "#3e88ff");
            stmiTowElements.forEach(el => el.style.color = "#3e88ff");
            stmiThreeElements.forEach(el => el.style.color = "#3e88ff");
            stmiForeElements.forEach(el => el.style.color = "#3e88ff");
            stmiFiveElements.forEach(el => el.style.color = "#3e88ff");

            statusBg.forEach(el => el.style.background = "#d4edbc");
            statusBg.forEach(el => el.style.color = "#2c5c00");

            stmOneElements.forEach((el, index) => {
                if (index === 0) {
                el.innerHTML = "&check;";
                el.style.background = "#3e88ff"; 
                } else {
                el.style.background = "#3e88ff";
                el.innerHTML = "";
                }
            });
            stmTowElements.forEach((el, index) => {
                if (index === 0) {
                el.innerHTML = "&check;";
                el.style.background = "#3e88ff"; 
                } else {
                el.style.background = "#3e88ff";
                el.innerHTML = "";
                }
            });
            stmThreeElements.forEach((el, index) => {
                if (index === 0) {
                el.innerHTML = "&check;";
                el.style.background = "#3e88ff"; 
                } else {
                el.style.background = "#3e88ff";
                el.innerHTML = "";
                }
            });
            stmForeElements.forEach((el, index) => {
                if (index === 0) {
                el.innerHTML = "&check;";
                el.style.background = "#3e88ff"; 
                } else {
                el.style.background = "#3e88ff";
                el.innerHTML = "";
                }
            });
            stmFiveElements.forEach(el => el.style.background = "#3e88ff");
            break;
            
            case "delivery success":
            progressBar.style.width = "92%";
            // Apply styles to both first and second elements
            stmiOneElements.forEach(el => el.style.color = "#3e88ff");
            stmiTowElements.forEach(el => el.style.color = "#3e88ff");
            stmiThreeElements.forEach(el => el.style.color = "#3e88ff");
            stmiForeElements.forEach(el => el.style.color = "#3e88ff");
            stmiFiveElements.forEach(el => el.style.color = "#3e88ff");
            stmiSixElements.forEach(el => el.style.color = "#3e88ff");

            statusBg.forEach(el => el.style.background = "#3498db");
            statusBg.forEach(el => el.style.color = "#ffffff");

            stmOneElements.forEach((el, index) => {
                if (index === 0) {
                el.innerHTML = "&check;";
                el.style.background = "#3e88ff"; 
                } else {
                el.style.background = "#3e88ff";
                el.innerHTML = "";
                }
            });
            stmTowElements.forEach((el, index) => {
                if (index === 0) {
                el.innerHTML = "&check;";
                el.style.background = "#3e88ff"; 
                } else {
                el.style.background = "#3e88ff";
                el.innerHTML = "";
                }
            });
            stmThreeElements.forEach((el, index) => {
                if (index === 0) {
                el.innerHTML = "&check;";
                el.style.background = "#3e88ff"; 
                } else {
                el.style.background = "#3e88ff";
                el.innerHTML = "";
                }
            });
            stmForeElements.forEach((el, index) => {
                if (index === 0) {
                el.innerHTML = "&check;";
                el.style.background = "#3e88ff"; 
                } else {
                el.style.background = "#3e88ff";
                el.innerHTML = "";
                }
            });
            stmFiveElements.forEach((el, index) => {
                if (index === 0) {
                el.innerHTML = "&check;";
                el.style.background = "#3e88ff"; 
                } else {
                el.style.background = "#3e88ff";
                el.innerHTML = "";
                }
            });
            stmSixElements.forEach((el, index) => {
                if (index === 0) {
                el.innerHTML = "&check;";
                el.style.background = "#3e88ff"; 
                } else {
                el.style.background = "#3e88ff";
                el.innerHTML = "";
                }
            });
            break;

            case "payment error":
            progressBar.style.width = "7%";
            // Style text elements (orange)
            stmiOneElements.forEach(el => el.style.color = "#3e88ff");

            statusBg.forEach(el => el.style.background = "#f51919");
            statusBg.forEach(el => el.style.color = "#ffffff");

            // Style progress markers
            stmOneElements.forEach((el, index) => {
                if (index === 0) {
                el.innerHTML = "&times;";
                // Reset background to original state
                el.style.background = "#f51919"; 
                } else {
                // Other elements get orange background
                el.style.background = "#3e88ff";
                // Clear any existing content
                el.innerHTML = "";
                }
            });
            break;
            
            default:
            // Optional: Handle unknown status or keep default reset
            break;
        }
        }
        
        document.querySelector(".display-status").style.display = "block";
      } else {
        alert("Order not found. Please check your input and try again.");
      }
    })
    .catch(error => {
      console.error("Error:", error);
      alert("An error occurred while checking the order status.");
    });
});