const sheetId = "1GOKMUAeNefOMPE8KflSIqeoodHYFesaD6aJgRGCi5Ng";
const apiKey = "AIzaSyACww_yoqNc1ZnF14GTf-WmOR0_gYO8bms";
const sheetName = "ReviewData";

const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;

fetch(sheetUrl)
  .then(res => res.json())
  .then(data => {
    const rows = data.values;
    if (!rows || rows.length < 2) return;

    const row = rows[1]; // 2nd row data

    // 1. data-txt-reviewData-col বসানো
    document.querySelectorAll("[data-txt-reviewData-col]").forEach(el => {
      const colIndex = parseInt(el.getAttribute("data-txt-reviewData-col"));
      if (row[colIndex] !== undefined) {
        el.innerHTML = row[colIndex];
      }
    });

    // 2. B–F যোগফল নিয়ে পার্সেন্ট বের করা
    const counts = [];
    for (let i = 1; i <= 5; i++) {
      counts.push(parseFloat(row[i]) || 0);
    }
    const total = counts.reduce((sum, val) => sum + val, 0);

    for (let i = 1; i <= 5; i++) {
      const percent = total > 0 ? (counts[i - 1] / total) * 100 : 0;
      document.querySelectorAll(`[data-txt-starP-col="${i}"]`).forEach(el => {
        el.style.width = percent + "%";
      });
    }

    // 3. AVG স্টার আইকন বসানো (কলাম H)
    const avgStars = parseFloat(row[7]) || 0;
    const fullStar = '<i class="fa-solid fa-star"></i>';
    const halfStar = '<i class="fa-solid fa-star-half-stroke"></i>';
    const emptyStar = '<i class="fa-regular fa-star"></i>';

    let starsHtml = "";
    for (let s = 1; s <= 5; s++) {
      if (avgStars >= s) {
        starsHtml += fullStar;
      } else if (avgStars >= s - 0.5) {
        starsHtml += halfStar;
      } else {
        starsHtml += emptyStar;
      }
    }
    document.querySelectorAll(`[data-txt-star-col="7"]`).forEach(el => {
      el.innerHTML = starsHtml;
    });
  })
  .catch(err => console.error("Error loading sheet:", err));