/*-------------------------Content Transformation-------------------------*/
window.addEventListener("DOMContentLoaded", function () {
  const title = localStorage.getItem("Title") || "N/A";
  const price = localStorage.getItem("Price") || "N/A";
  const NFC = localStorage.getItem("NFC") || "N/A";
  const style = localStorage.getItem("style") || "N/A";

  const titleElement = document.getElementById("Title");
  const priceElement = document.getElementById("price");
  const NFCElement = document.getElementById("NFC");
  const nfcStatus = document.getElementById("nfcStatus");
  const styleElement = document.getElementById("style");
  const customLogo = document.getElementById("customLogo");

  if (titleElement) titleElement.textContent = title;
  if (priceElement) priceElement.textContent = price;
  if (NFCElement) NFCElement.textContent = NFC;
  if (nfcStatus) nfcStatus.value = NFC;
  if (styleElement) styleElement.textContent = style;
  if (customLogo) customLogo.value = style;
});
/*-------------------------nfc and custom logo enabled or disabled------------------------- */
window.addEventListener('DOMContentLoaded', () => {
    const nfcSpan = document.getElementById("NFC");
    if (nfcSpan.textContent.trim() === "Enabled") {
      nfcSpan.style.color = "#22c55e";
    } else {
      nfcSpan.style.color = "#ef4444";
    }
});
window.addEventListener('DOMContentLoaded', () => {
    const style = document.getElementById("style");
    if (style.textContent.trim() === "Enabled") {
      style.style.color = "#22c55e";
    } else {
      style.style.color = "#ef4444";
    }
});
  // --------------------------email check----------------------------
const sheetId = "1GOKMUAeNefOMPE8KflSIqeoodHYFesaD6aJgRGCi5Ng";
const apiKey = "AIzaSyACww_yoqNc1ZnF14GTf-WmOR0_gYO8bms";
const sheetName = "order";

document.getElementById('email').addEventListener('blur', async function () {
  const emailInput = this.value.trim().toLowerCase();
  const errorElement = document.getElementById('email-error');
  const signUpBtn = document.getElementById('signUp-btn');

  if (!emailInput) return;

  try {
    const response = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetName}?key=${apiKey}`
    );
    const data = await response.json();

    if (!data.values || data.values.length === 0) {
      console.log("Sheet is empty or not found");
      return;
    }

    const emailExists = data.values.some(row => {
      const emailInSheet = row[3]; // কলাম C (index 2)
      return emailInSheet && emailInSheet.trim().toLowerCase() === emailInput;
    });

    if (emailExists) {
      errorElement.style.display = 'inline';
      signUpBtn.disabled = true;
      signUpBtn.style.background = '#e5e7eb';
    } else {
      errorElement.style.display = 'none';
      signUpBtn.disabled = false;
      signUpBtn.style.background = '#3e88ff';
    }

  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

  /*-------------------------Registration System-------------------------*/
document.addEventListener('DOMContentLoaded', () => {
    // Constants
    const ERROR_DISPLAY_TIME = 3000;
    const PASSWORD_MIN_LENGTH = 8;

    // Secure ID generation
    const generateSecureId = (length, chars) => {
        const buffer = new Uint32Array(length);
        window.crypto.getRandomValues(buffer);
        return Array.from(buffer, (num) => chars[num % chars.length]).join('');
    };

    // Password hashing function (SHA-256)
    async function hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashed = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        return hashed;
    }

    // DOM Elements
    const elements = {
        signUpBtn: document.querySelector('.signUp-btn'),
        signupForm: document.getElementById('signupForm'),
        errorMessage: document.getElementById('error-message'),
        toggleButtons: document.querySelectorAll('.toggle-password')
    };

    // Validation functions
    const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    const validatePassword = (password) =>
        password.length >= PASSWORD_MIN_LENGTH &&
        /[A-Z]/.test(password) &&
        /\d/.test(password);

    // Error display
    const showError = (message, element = null) => {
        if (elements.errorMessage) {
            elements.errorMessage.textContent = message;
            elements.errorMessage.style.display = 'block';
            if (element) element.focus();

            setTimeout(() => {
                elements.errorMessage.style.display = 'none';
            }, ERROR_DISPLAY_TIME);
        }
    };

    // Toggle password visibility
    const handlePasswordToggle = (button) => {
        const input = document.getElementById(button.dataset.target);
        if (!input) return;
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        button.textContent = isPassword ? 'Hide' : 'Show';
        button.setAttribute('aria-label', `${isPassword ? 'Hide' : 'Show'} password`);
    };

    // Set loading state
    const setLoadingState = (isLoading) => {
        if (!elements.signUpBtn) return;
        if (isLoading) {
            elements.signUpBtn.disabled = true;
            elements.signUpBtn.innerHTML = `<span class="loader"></span> Signing up...`;
        } else {
            elements.signUpBtn.disabled = false;
            elements.signUpBtn.textContent = 'Sign Up';
        }
    };

    // Signup handler
    const handleSignup = async (event) => {
        event.preventDefault();

        const getValue = (id) => document.getElementById(id)?.value.trim();
        const [name, email, password, confirmPassword] = ['name', 'email', 'password', 'confirm-password'].map(getValue);

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            return showError('Please fill all required fields');
        }
        if (!validateEmail(email)) {
            return showError('Please enter a valid email address', document.getElementById('email'));
        }
        if (password !== confirmPassword) {
            return showError('Passwords do not match', document.getElementById('confirm-password'));
        }
        if (!validatePassword(password)) {
            return showError(`Password must be at least ${PASSWORD_MIN_LENGTH} characters with an uppercase letter and a number`, document.getElementById('password'));
        }

        try {
            setLoadingState(true);

            // ✅ Hash the password before sending/storing
            const hashedPassword = await hashPassword(password);

            // Generate IDs
            const ids = {
                orderId: generateSecureId(8, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'),
                userId: generateSecureId(18, 'abcdefghijklmnopqrstuvwxyz0123456789')
            };

            // Populate hidden fields
            Object.entries({
                OrderId: ids.orderId,
                Id: ids.userId,
                acName: name,
                acEmail: email,
                Pass: hashedPassword,
                orderName: name,
                orderEmail: email,
            }).forEach(([id, value]) => {
                const field = document.getElementById(id);
                if (field) field.value = value;
            });

            // Simulated delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Transition to next section
            document.querySelector('.signUp').remove();
            document.querySelector('.cashOut-section').style.display = 'block';

        } catch (error) {
            showError('Registration failed. Please try again.');
        } finally {
            setLoadingState(false);
        }
    };

    // Event listeners
    if (elements.signUpBtn) elements.signUpBtn.addEventListener('click', handleSignup);
    if (elements.signupForm) elements.signupForm.addEventListener('submit', handleSignup);
    elements.toggleButtons.forEach(button =>
        button.addEventListener('click', () => handlePasswordToggle(button))
    );
});
// ------------------------------------------------invoice sum---------------------------------------------//
// ====== PRICE TO subTotal ======
const priceElement = document.querySelector('.price');
const subTotalElement = document.getElementById('subTotal');

function updateSubTotal() {
  const priceText = priceElement.textContent.trim();
  const numericValue = parseFloat(priceText.replace(/[^\d.]/g, '')) || 0;
  subTotalElement.textContent = numericValue.toFixed(2);
}

updateSubTotal();

const priceObserver = new MutationObserver(updateSubTotal);
priceObserver.observe(priceElement, {
  childList: true,
  characterData: true,
  subtree: true
});


// ====== SHIPPING TO shippingCost ======
const shippingElement = document.querySelector('.shipping-cost');
const shippingCostElement = document.getElementById('shippingCost');

function updateShippingCost() {
  const shippingText = shippingElement.textContent.trim();
  const numericValue = parseFloat(shippingText.replace(/[^\d.]/g, '')) || 0;
  shippingCostElement.textContent = numericValue.toFixed(2);
}

updateShippingCost();

const shippingObserver = new MutationObserver(updateShippingCost);
shippingObserver.observe(shippingElement, {
  childList: true,
  characterData: true,
  subtree: true
});

// হিসাব আপডেট ফাংশন
function updateTotal() {
  const subTotal = parseFloat(document.getElementById('subTotal')?.textContent) || 0;
  const shippingCost = parseFloat(document.getElementById('shippingCost')?.textContent) || 0;
  const discount = parseFloat(document.getElementById('discount')?.textContent) || 0;

  const total = (subTotal + shippingCost - discount).toFixed(2);
  document.getElementById('total').textContent = total;
}

// প্রতিটা ফিল্ড পর্যবেক্ষণে রাখা হবে (MutationObserver)
['subTotal', 'shippingCost', 'discount'].forEach(id => {
  const element = document.getElementById(id);
  if (element) {
    const observer = new MutationObserver(updateTotal);
    observer.observe(element, { childList: true });
  }
});

// প্রথমবার হিসাব করাও
updateTotal();

//-----------------------------promo code------------------------------------//
document.querySelector('.promocode-btn').addEventListener('click', function () {
  const promoInput = document.querySelector('.promo-code-input');
  const discountElement = document.getElementById('discount');
  const promoCodeSms = document.querySelector('.promo-code-sms');

  const inputValue = promoInput.value.trim().toLowerCase();

  let discountValue = 0;
  let message = '';

  if (inputValue === 'a') {
    discountValue = 50;
    message = `Promo code applied. ${discountValue} taka discount.`;
    promoCodeSms.style.color = '#22c55e';
  } else {
    const numeric = parseFloat(inputValue);
    if (!isNaN(numeric)) {
      discountValue = numeric;
      message = `Promo code applied. ${discountValue} taka discount.`;
    } else {
      message = 'Invalid promo code. Please try again.';
      promoCodeSms.style.color = '#ef4444';
    }
  }

  discountElement.textContent = discountValue.toFixed(2);
  promoCodeSms.innerText = message;
});

//-----------------------------------------payment selection-------------------------------------//
  const radioInputs = document.querySelectorAll('input[name="paymentMethod"]');
  const paymentValueElement = document.getElementById('payment-value');
  const totalElement = document.getElementById('total');

  // ফাংশন: radio-circle active ক্লাস ও payment-value আপডেট
  function handlePaymentMethodChange() {
    // সব radio-circle থেকে active ক্লাস সরানো
    document.querySelectorAll('.radio-circle').forEach(circle => {
      circle.classList.remove('active');
    });

    // যেই input checked হলো
    const checkedInput = document.querySelector('input[name="paymentMethod"]:checked');
    if (checkedInput) {
      // active ক্লাস অ্যাড
      const selectedLabel = document.querySelector(`label[for="${checkedInput.id}"]`);
      if (selectedLabel) {
        const radioCircle = selectedLabel.querySelector('.radio-circle');
        if (radioCircle) {
          radioCircle.classList.add('active');
        }
      }

      // payment-value সেট করা
      if (checkedInput.id === 'cod') {
        paymentValueElement.innerText = '200.00';
      } else {
        const total = totalElement.innerText || totalElement.value || '0';
        paymentValueElement.innerText = total;
      }
    }
  }

  // radio input change ইভেন্টে listener
  radioInputs.forEach(input => {
    input.addEventListener('change', handlePaymentMethodChange);
  });

  // total এর মান পরিবর্তন হলে আপডেট (যদি cod সিলেক্ট না থাকে)
  const observer = new MutationObserver(() => {
    const codChecked = document.getElementById('cod').checked;
    if (!codChecked) {
      const total = totalElement.innerText || totalElement.value || '0';
      paymentValueElement.innerText = total;
    }
  });

  if (totalElement) {
    observer.observe(totalElement, { childList: true, subtree: true, characterData: true });
    totalElement.addEventListener('input', () => {
      const codChecked = document.getElementById('cod').checked;
      if (!codChecked) {
        const total = totalElement.value || '0';
        paymentValueElement.innerText = total;
      }
    });
  }

  // পেজ লোড হলে একবার চালানো
  window.addEventListener('DOMContentLoaded', handlePaymentMethodChange);




/*-------------------------District to Serial Thana-------------------------*/
document.getElementById('District').addEventListener('change', function () {
  const district = this.value.toLowerCase().replace(/\s+/g, '-');
  const allThanaOptions = document.querySelectorAll('.thana-option');

  // Hide all options first
  allThanaOptions.forEach(option => {
    option.style.display = 'none';
  });

  // Show only selected district's options
  document.querySelectorAll(`.thana-option.${district}-thana`).forEach(option => {
    option.style.display = 'block';
  });
});

//--------------------------------------product price store input----------------------------------------------------//
  setInterval(function () {
    const mappings = [
      { id: 'subTotal', name: 'Product_price' },
      { id: 'shippingCost', name: 'Shipping' },
      { id: 'discount', name: 'Discount' },
      { id: 'total', name: 'Total' }
    ];

    mappings.forEach(({ id, name }) => {
      const textEl = document.getElementById(id);
      const inputEl = document.querySelector(`input[name="${name}"]`);
      if (textEl && inputEl) {
        inputEl.value = textEl.textContent.trim();
      } else {
        console.warn(`Missing element: id=${id} or input[name="${name}"]`);
      }
    });
  }, 200);
    /*-------------------------payment method-------------------------*/
  /*-------------------------Payment Selection System-------------------------*/
  /*-------------------------Database Submission-------------------------*/
// === cashOut.js (fixed) ===
const scriptURL = 'https://script.google.com/macros/s/AKfycbzLrVAJo56dSnuBBSyb_p3DcniOwLfVMGv-YPDHe78NeqHLITOo3_tPcvgNDQSwJy0JWQ/exec';
const scriptURLOne = 'https://script.google.com/macros/s/AKfycbwM4HwOOpy7vAIMgRRJ_zYOkD0BuHr5eS4avSmO3omELVh58yHT9_qaNojLNS68FcqS_Q/exec';
const scriptURLTwo = 'https://script.google.com/macros/s/AKfycbw6Zbx9Fr-3JLG5L-t9WLc33Q9ZmmPu0-u58wPCbYHx9IMdqdZtf09CdUdhGIuJJ-DnAQ/exec';
const dashboardGraph = 'https://script.google.com/macros/s/AKfycbxnMJ9qkm_lWBoYIbjbM7WP-T4WJpiLoFiI7oOrHO0-QebY-wiagPjxAfbxMN86JNCHnw/exec';
const VLDID = 'https://script.google.com/macros/s/AKfycbwkChVJnLPs401FFnVYL7VISSf8VYsJqx5UvBifd0pABsYRLxCXFbG1iLKL_Gg-YN9zqA/exec'; // Replace with your correct URL

const form = document.forms['submit-to-google-sheet'];
const orderBtn = document.querySelector('.com-order-btn');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  orderBtn.disabled = true;
  const originalText = orderBtn.textContent;
  orderBtn.textContent = 'Loading...';

  // Create one FormData object, then clone it for each fetch
  const formData = new FormData(form);
  const clones = [
    new FormData(form),
    new FormData(form),
    new FormData(form),
    new FormData(form)
  ];

  const urls = [scriptURL, scriptURLOne, scriptURLTwo, dashboardGraph];
  const requests = urls.map((url, i) =>
    fetch(url, { method: 'POST', body: clones[i] })
  );

  Promise.all(requests)
    .then(async (responses) => {
      const jsons = await Promise.all(responses.map((res) =>
        res.ok ? res.json() : Promise.resolve(null)
      ));

      const [json1, json2, json3, json4] = jsons;

      if (!json1 || !json2 || !json3 || !json4) {
        throw new Error('One or more submissions failed');
      }

      form.reset();
      document.getElementById('cashOut-section').remove();
      document.getElementById('confirmation_msg').style.display = 'block';
    })
    .catch((error) => {
      console.error('Submission error:', error);
      orderBtn.disabled = false;
      orderBtn.textContent = originalText;
    });
});


/*-----------------------------------------orders date-----------------------------------------*/
function updateDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  const formattedDate = `${year}-${month}-${day}`;
  document.getElementById('currentDate').value = formattedDate;
}

updateDate();

setInterval(updateDate, 60000);

document.addEventListener("visibilitychange", () => {
  if (!document.hidden) updateDate();
});