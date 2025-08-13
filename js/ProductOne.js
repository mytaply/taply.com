/*-----------------------------------------------products images-----------------------------------------------*/
  const chaildImages = document.querySelectorAll('.chaild-image');
  const parentsImageDiv = document.getElementById('parents-image');

  let currentIndex = 0;

  // ড্র্যাগের জন্য ভ্যারিয়েবল
  let isDragging = false;
  let startX = 0;
  let threshold = 50; // কত পিক্সেল ড্র্যাগ করলে স্লাইড হবে

  function updateParentsImage(index) {
    if (index < 0) index = chaildImages.length - 1;
    if (index >= chaildImages.length) index = 0;
    currentIndex = index;

    chaildImages.forEach((div, i) => {
      div.classList.toggle('active', i === currentIndex);
    });

    const img = chaildImages[currentIndex].querySelector('img');
    if (img) {
      parentsImageDiv.innerHTML = '';
      parentsImageDiv.appendChild(img.cloneNode(true));
    }
  }

  // প্রথম ছবি দেখানো
  updateParentsImage(currentIndex);

  // chaild-image ক্লিক ইভেন্ট
  chaildImages.forEach((div, i) => {
    div.addEventListener('click', () => {
      updateParentsImage(i);
    });
  });

  // মাউস ইভেন্ট
  parentsImageDiv.addEventListener('mousedown', e => {
    isDragging = true;
    startX = e.clientX;
  });

  parentsImageDiv.addEventListener('mouseup', e => {
    if (!isDragging) return;
    isDragging = false;
    let diffX = e.clientX - startX;

    if (diffX > threshold) {
      // ডান থেকে বাম ড্র্যাগ (আগের ছবি)
      updateParentsImage(currentIndex - 1);
    } else if (diffX < -threshold) {
      // বাম থেকে ডান ড্র্যাগ (পরের ছবি)
      updateParentsImage(currentIndex + 1);
    }
  });

  // টাচ ইভেন্ট (মোবাইলের জন্য)
  parentsImageDiv.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
  });

  parentsImageDiv.addEventListener('touchend', e => {
    let endX = e.changedTouches[0].clientX;
    let diffX = endX - startX;

    if (diffX > threshold) {
      updateParentsImage(currentIndex - 1);
    } else if (diffX < -threshold) {
      updateParentsImage(currentIndex + 1);
    }
  });


/*-----------------------------quick logo with and without----------------------*/
/*-----------------------------quick nfc yes and no-----------------------------*/
document.addEventListener("DOMContentLoaded", () => { 
  const priceElement = document.querySelector(".discount-price");
  const sellElement = document.querySelector(".sell-price");
  const nfcToggle = document.getElementById('nfcToggle');
  const nfcValue = document.getElementById('nfcValue');
  const nfcStatus = document.getElementById('nfcStatus');

  const StyleToggle = document.getElementById('StyleToggle');
  const StyleValue = document.getElementById('StyleValue');
  const styleStatus = document.getElementById('styleStatus');

  // Pricing configuration
  const basePrice = 999;
  const baseSell = 599;
  const currencyOptions = {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  };

  function updatePrices() {
    let finalPrice = basePrice;
    let finalSell = baseSell;

    // NFC feature
    if (nfcToggle.checked) {
      finalPrice += 10; // 100 increase
      finalSell += 10;
      nfcValue.value = "Enabled";
      nfcStatus.innerHTML = 'Enabled';
      nfcStatus.style.color = '#22c55e';
    } else {
      nfcValue.value = "Disabled";
      nfcStatus.innerHTML = 'Disabled';
      nfcStatus.style.color = '#ef4444';
    }

    // Style feature
    if (StyleToggle.checked) {
      finalPrice += 20; // 200 increase
      finalSell += 20;
      StyleValue.value = "Enabled";
      styleStatus.innerHTML = 'Enabled';
      styleStatus.style.color = '#22c55e';
    } else {
      StyleValue.value = "Disabled";
      styleStatus.innerHTML = 'Disabled';
      styleStatus.style.color = '#ef4444';
    }

    // Update displays with currency formatting
    priceElement.textContent = finalPrice.toLocaleString('en-US', currencyOptions);
    sellElement.textContent = finalSell.toLocaleString('en-US', currencyOptions);
  }

  // Event listeners
  nfcToggle.addEventListener("change", updatePrices);
  StyleToggle.addEventListener("change", updatePrices);

  // Initialize
  updatePrices();
});

/*-----------------------buy click to cash out.html-----------------------*/
document.querySelector(".product-buy-btn").addEventListener("click", function () {
    // Get the values
    const title = document.querySelector(".p-title").textContent.trim();
    const price = document.querySelector(".sell-price").textContent.trim();
    const nfc = document.querySelector('input[name="NFC_value"]').value;
    const style = document.querySelector('input[name="Style-value"]').value;

    // Store values in localStorage
    localStorage.setItem("Title", title);
    localStorage.setItem("Price", price);
    localStorage.setItem("NFC", nfc);
    localStorage.setItem("style", style);
});



