//   const rateNowBtn = document.getElementById('rateNow');
//   const ratePopupTemplate = document.getElementById('ratePopupTemplate');
//   const confirmPopupTemplate = document.getElementById('confirmPopupTemplate');

//   let overlay, ratePopup, confirmPopup;

//   rateNowBtn.addEventListener('click', () => {
//     // Overlay
//     overlay = document.createElement('div');
//     overlay.className = 'popup-overlay';
//     overlay.style.display = 'block';

//     // Rate Popup
//     ratePopup = ratePopupTemplate.content.firstElementChild.cloneNode(true);
//     ratePopup.style.display = 'block';

//     document.body.appendChild(overlay);
//     document.body.appendChild(ratePopup);
//     document.body.classList.add('no-scroll');

//     // Close Button
//     const closeBtn = ratePopup.querySelector('.close');
//     closeBtn.addEventListener('click', () => {
//       ratePopup.style.display = 'none';
//       showConfirmPopup();
//     });
//   });

//   function showConfirmPopup() {
//     confirmPopup = confirmPopupTemplate.content.firstElementChild.cloneNode(true);
//     confirmPopup.style.display = 'block';
//     document.body.appendChild(confirmPopup);

//     const keepBtn = confirmPopup.querySelector('#keepBtn');
//     const discardBtn = confirmPopup.querySelector('#discardBtn');

//     keepBtn.addEventListener('click', () => {
//       confirmPopup.style.display = 'none';
//       ratePopup.style.display = 'block';
//     });

//     discardBtn.addEventListener('click', () => {
//       confirmPopup.style.display = 'none';
//       ratePopup.style.display = 'none';
//       overlay.style.display = 'none';
//       document.body.classList.remove('no-scroll');
//     });
//   }
// const sheetId = "1GOKMUAeNefOMPE8KflSIqeoodHYFesaD6aJgRGCi5Ng";
// const apiKey = "AIzaSyACww_yoqNc1ZnF14GTf-WmOR0_gYO8bms";
// const sheetName = "appsData";
// const emailInput = document.getElementById("searchAccount");
// const loadingText = document.getElementById("loading");
// const accountBox = document.querySelector(".account");
// const rateStars = document.getElementById("rate-stars");
// const reviewBox = document.getElementById("review");
// const notFoundMsg = document.getElementById("notFoundMsg"); // নতুন মেসেজ এলিমেন্ট

// // শুরুতে সব হাইড করে রাখো
// rateStars.style.display = "none";
// reviewBox.style.display = "none";
// notFoundMsg.style.display = "none";

// emailInput.addEventListener("input", async () => {
//   const email = emailInput.value.trim();
//   if (!email) return;

//   loadingText.style.display = "inline";
//   accountBox.style.display = "none";
//   rateStars.style.display = "none";
//   reviewBox.style.display = "none";
//   notFoundMsg.style.display = "none";

//   try {
//     const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;
//     const res = await fetch(url);
//     const data = await res.json();
//     const rows = data.values;

//     if (!rows || rows.length === 0) {
//       loadingText.style.display = "none";
//       return;
//     }

//     const emailIndex = 3; // Column 4 (0-based index)
//     const foundRow = rows.find((row, index) => index !== 0 && row[emailIndex] === email);

//     if (foundRow) {
//       document.querySelectorAll("[data-txt-col]").forEach(el => {
//         const col = parseInt(el.getAttribute("data-txt-col"));
//         el.innerHTML = foundRow[col] || "N/A";
//       });

//       document.querySelectorAll("[data-value-col]").forEach(el => {
//         const col = parseInt(el.getAttribute("data-value-col"));
//         el.value = foundRow[col] || "N/A";
//       });

//       document.querySelectorAll("[data-src-col]").forEach(el => {
//         const col = parseInt(el.getAttribute("data-src-col"));
//         const originalUrl = foundRow[col] || "";

//         if (originalUrl) {
//           const match = originalUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
//           if (match && match[1]) {
//             const fileId = match[1];
//             const directUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=s800`;
//             el.src = directUrl;
//           } else {
//             el.src = originalUrl;
//           }
//         } else {
//           el.src = "";
//         }
//       });

//       accountBox.style.display = "flex";
//       rateStars.style.display = "flex";
//       reviewBox.style.display = "flex";
//       notFoundMsg.style.display = "none";
//     } else {
//       accountBox.style.display = "none";
//       rateStars.style.display = "none";
//       reviewBox.style.display = "none";
//       notFoundMsg.style.display = "block";
//       notFoundMsg.textContent = "Email not found in our records.";
//     }

//   } catch (error) {
//     console.error("Error fetching data:", error);
//   } finally {
//     loadingText.style.display = "none";
//   }
// });


//     const stars = document.querySelectorAll('#rate-stars span');
//     const countInput = document.getElementById('countStars');

//     stars.forEach(star => {
//       star.addEventListener('click', () => {
//         const rating = parseInt(star.getAttribute('data-value'));
//         countInput.value = rating;

//         stars.forEach(s => {
//           const sValue = parseInt(s.getAttribute('data-value'));
//           if (sValue <= rating) {
//             s.style.color = 'gold';
//           } else {
//             s.style.color = '#e5e7eb';
//           }
//         });
//       });
//     });
// // -------------------save reviews------------------------//
//   const reviews = 'https://script.google.com/macros/s/AKfycbyeisBfH5sybGPNDt7Bc0xTa3K78BbzIc_MpBSBDILWH3TvDtmM5XGpbL0-jH28Ys88VQ/exec'
//   const form = document.forms['submit-to-reviews']

//   form.addEventListener('submit', e => {
//     e.preventDefault()
//     fetch(reviews, { method: 'POST', body: new FormData(form)})
//       .then(response => console.log('Success!', response))
//       .catch(error => console.error('Error!', error.message))
//   })

document.addEventListener('DOMContentLoaded', () => {
  const rateNowBtn = document.getElementById('rateNow');
  const ratePopupTemplate = document.getElementById('ratePopupTemplate');
  const confirmPopupTemplate = document.getElementById('confirmPopupTemplate');

  let overlay, ratePopup, confirmPopup;

  // Google Sheet & Review API info
  const sheetId = "1GOKMUAeNefOMPE8KflSIqeoodHYFesaD6aJgRGCi5Ng";
  const apiKey = "AIzaSyACww_yoqNc1ZnF14GTf-WmOR0_gYO8bms";
  const sheetName = "appsData";
  const reviewsEndpoint = 'https://script.google.com/macros/s/AKfycbyeisBfH5sybGPNDt7Bc0xTa3K78BbzIc_MpBSBDILWH3TvDtmM5XGpbL0-jH28Ys88VQ/exec';

  // Rate Now button ক্লিক করলে
  rateNowBtn.addEventListener('click', () => {
    // Overlay তৈরি ও দেখানো
    overlay = document.createElement('div');
    overlay.className = 'popup-overlay';
    overlay.style.display = 'block';

    // পপআপ ক্লোন করে দেখানো
    ratePopup = ratePopupTemplate.content.firstElementChild.cloneNode(true);
    ratePopup.style.display = 'block';

    document.body.appendChild(overlay);
    document.body.appendChild(ratePopup);
    document.body.classList.add('no-scroll');

    // পপআপের ভিতরের ইনপুট, এলিমেন্টগুলো ধরো
    const emailInput = ratePopup.querySelector('#searchAccount');
    const loadingText = ratePopup.querySelector('#loading');
    const accountBox = ratePopup.querySelector('.account');
    const rateStars = ratePopup.querySelector('#rate-stars');
    const reviewBox = ratePopup.querySelector('#review');
    const notFoundMsg = ratePopup.querySelector('#notFoundMsg');

    // শুরুতে hide করে রাখো
    if (rateStars) rateStars.style.display = "none";
    if (reviewBox) reviewBox.style.display = "none";
    if (notFoundMsg) notFoundMsg.style.display = "none";

    // ইমেইল ইনপুটে টাইপ করলে সার্চ ফাংশন
    emailInput.addEventListener('input', async () => {
      const email = emailInput.value.trim();
      if (!email) return;

      loadingText.style.display = "inline";
      accountBox.style.display = "none";
      rateStars.style.display = "none";
      reviewBox.style.display = "none";
      notFoundMsg.style.display = "none";

      try {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        const rows = data.values;

        if (!rows || rows.length === 0) {
          loadingText.style.display = "none";
          return;
        }

        const emailIndex = 3;
        const foundRow = rows.find((row, idx) => idx !== 0 && row[emailIndex] === email);

        if (foundRow) {
          // ডেটা ফিলাপ
          ratePopup.querySelectorAll("[data-txt-col]").forEach(el => {
            const col = parseInt(el.getAttribute("data-txt-col"));
            el.innerHTML = foundRow[col] || "N/A";
          });

          ratePopup.querySelectorAll("[data-value-col]").forEach(el => {
            const col = parseInt(el.getAttribute("data-value-col"));
            el.value = foundRow[col] || "N/A";
          });

          ratePopup.querySelectorAll("[data-src-col]").forEach(el => {
            const col = parseInt(el.getAttribute("data-src-col"));
            const originalUrl = foundRow[col] || "";

            if (originalUrl) {
              const match = originalUrl.match(/\/d\/([a-zA-Z0-9_-]+)/);
              if (match && match[1]) {
                const fileId = match[1];
                const directUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=s800`;
                el.src = directUrl;
              } else {
                el.src = originalUrl;
              }
            } else {
              el.src = "";
            }
          });

          accountBox.style.display = "flex";
          rateStars.style.display = "flex";
          reviewBox.style.display = "flex";
          notFoundMsg.style.display = "none";
        } else {
          accountBox.style.display = "none";
          rateStars.style.display = "none";
          reviewBox.style.display = "none";
          notFoundMsg.style.display = "block";
          notFoundMsg.textContent = "Email not found in our records.";
        }
      } catch (e) {
        console.error(e);
      } finally {
        loadingText.style.display = "none";
      }
    });

    
    // পপআপ DOM-এ যুক্ত হয়ে গেছে, এখন ইনপুট নিয়ে আসি
  const dtInput = ratePopup.querySelector('#datetimeInput');
  if (dtInput) {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    const formatted = `${year}-${month}-${day}T${hours}:${minutes}`;

    dtInput.value = formatted;
  }

    // স্টার রেটিং ইভেন্ট লিসেনার
    const stars = ratePopup.querySelectorAll('#rate-stars span');
    const countInput = ratePopup.querySelector('#countStars');

    stars.forEach(star => {
      star.addEventListener('click', () => {
        const rating = parseInt(star.getAttribute('data-value'));
        countInput.value = rating;

        stars.forEach(s => {
          const sValue = parseInt(s.getAttribute('data-value'));
          s.style.color = sValue <= rating ? 'gold' : '#e5e7eb';
        });
      });
    });

    // সাবমিশন ফর্ম
    const form = ratePopup.querySelector('form[name="submit-to-reviews"]');
    if (form) {
      form.addEventListener('submit', e => {
        e.preventDefault();
        // পপআপ ওভারলে বন্ধ করা
          ratePopup.style.display = 'none';
          overlay.style.display = 'none';
          document.body.classList.remove('no-scroll');
        fetch(reviewsEndpoint, {
          method: 'POST',
          body: new FormData(form)
        })
        .then(res => {
        })
        .catch(err => {
          console.error('Submit error:', err);
        });
      });
    }

    // Close button event
    const closeBtn = ratePopup.querySelector('.close');
    closeBtn.addEventListener('click', () => {
      ratePopup.style.display = 'none';
      showConfirmPopup();
    });
  });

  // কনফার্ম পপআপ ফাংশন
  function showConfirmPopup() {
    confirmPopup = confirmPopupTemplate.content.firstElementChild.cloneNode(true);
    confirmPopup.style.display = 'block';
    document.body.appendChild(confirmPopup);

    const keepBtn = confirmPopup.querySelector('#keepBtn');
    const discardBtn = confirmPopup.querySelector('#discardBtn');

    keepBtn.addEventListener('click', () => {
      confirmPopup.style.display = 'none';
      ratePopup.style.display = 'block';
    });

    discardBtn.addEventListener('click', () => {
      confirmPopup.style.display = 'none';
      ratePopup.style.display = 'none';
      overlay.style.display = 'none';
      document.body.classList.remove('no-scroll');
    });
  }
});