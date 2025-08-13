const sheetId = "1GOKMUAeNefOMPE8KflSIqeoodHYFesaD6aJgRGCi5Ng";
const apiKey = "AIzaSyACww_yoqNc1ZnF14GTf-WmOR0_gYO8bms";

// ==================== 1️⃣ Reviews শিট (Infinite Scroll) ====================
const reviewsSheet = "Reviews";
let allRows = [];
const batchSize = 5;
let container, template;

function extractFileId(url) {
    if (!url) return "";
    const match = url.match(/[-\w]{25,}/);
    return match ? match[0] : "";
}

function createReviewCard(rowData, index) {
    const clone = template.cloneNode(true);
    clone.style.display = "";
    clone.setAttribute("data-row-index", index);

    // data-src-review-col
    clone.querySelectorAll('[data-src-review-col]').forEach(el => {
        const colIndex = parseInt(el.getAttribute('data-src-review-col'));
        if (!isNaN(colIndex) && rowData[colIndex]) {
            const fileId = extractFileId(rowData[colIndex]);
            if (fileId) {
                el.src = `https://drive.google.com/thumbnail?id=${fileId}&sz=s800`;
            }
        }
    });

    // data-txt-review-col
    clone.querySelectorAll("[data-txt-review-col]").forEach(el => {
        const colIndex = parseInt(el.getAttribute("data-txt-review-col"));
        el.innerHTML = rowData[colIndex] || "";
    });

    // data-value-review-col
    clone.querySelectorAll("[data-value-review-col]").forEach(el => {
        const colIndex = parseInt(el.getAttribute("data-value-review-col"));
        const value = parseInt(rowData[colIndex]) || 0;
        el.value = value;
        const stars = el.closest(".stars").querySelectorAll("ul li i");
        stars.forEach((star, i) => {
            star.style.color = i < value ? "gold" : "#ccc";
        });
    });

    return clone;
}

function fadeInElement(el) {
    requestAnimationFrame(() => {
        el.classList.add("visible");
    });
}

async function loadReviews() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${reviewsSheet}?key=${apiKey}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        const rows = data.values;
        if (!rows || rows.length < 2) return;

        template = document.querySelector(".reviewers-box");
        container = template.parentElement;
        template.style.display = "none";
        allRows = rows.slice(1);

        let loadedCount = 0;
        const sentinel = document.createElement("div");
        container.appendChild(sentinel);

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting && loadedCount < allRows.length) {
                    const end = Math.min(loadedCount + batchSize, allRows.length);
                    for (let i = loadedCount; i < end; i++) {
                        const card = createReviewCard(allRows[i], i);
                        container.insertBefore(card, sentinel);
                        fadeInElement(card);
                    }
                    loadedCount = end;
                }
            });
        }, { rootMargin: "200px" });

        observer.observe(sentinel);

    } catch (err) {
        console.error("Error loading reviews:", err);
    }
}

// ==================== 2️⃣ ReviewData শিট (Ratings & Percentages) ====================
const reviewDataSheet = "ReviewData";

async function loadReviewData() {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${reviewDataSheet}?key=${apiKey}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        const rows = data.values;
        if (!rows || rows.length < 2) return;

        const row = rows[1]; // 2nd row data

        // data-txt-reviewData-col
        document.querySelectorAll("[data-txt-reviewData-col]").forEach(el => {
            const colIndex = parseInt(el.getAttribute("data-txt-reviewData-col"));
            if (row[colIndex] !== undefined) {
                el.innerHTML = row[colIndex];
            }
        });

        // B–F যোগফল নিয়ে পার্সেন্ট বের করা
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

        // AVG স্টার আইকন বসানো (কলাম H)
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

    } catch (err) {
        console.error("Error loading review data:", err);
    }
}

// ==================== 3️⃣ DOM Ready হলে দুটোই লোড হবে ====================
document.addEventListener("DOMContentLoaded", () => {
    loadReviews();
    loadReviewData();
});