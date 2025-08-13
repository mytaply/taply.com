  // ✅ SHA-256 hashing function
async function hashPassword(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashed = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashed;
}

// ✅ Login button click handler
document.querySelector('.logIn-btn').addEventListener('click', async function () {
  const emailInput = document.getElementById('email').value.trim();
  const passwordInput = document.getElementById('password').value;
  const loginS = document.querySelector('.logIn');
  const designS = document.querySelector('.design-section');
  const loginsbtn = document.querySelector('.logIn-btn');
  const errorMsg = document.querySelector('.error-msg');

  const sheetId = "1GOKMUAeNefOMPE8KflSIqeoodHYFesaD6aJgRGCi5Ng";
  const apiKey = "AIzaSyACww_yoqNc1ZnF14GTf-WmOR0_gYO8bms";
  const sheetRange = "card";

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${sheetRange}?key=${apiKey}`;

  try {
    loginsbtn.innerText = "Loading...";

    // ✅ Hash the input password first
    const hashedInputPassword = await hashPassword(passwordInput);

    const response = await fetch(url);
    const data = await response.json();

    if (!data.values || data.values.length === 0) {
      throw new Error("No data in sheet");
    }

    const rows = data.values;
    const headers = rows[0];
    const records = rows.slice(1).map(row =>
      headers.reduce((obj, key, i) => {
        obj[key] = row[i] || "";
        return obj;
      }, {})
    ).map((obj, idx) => {
      // attach Q column value explicitly (Q is the 17th column => index 16)
      // also keep original row if you want: obj.__row = rows[idx + 1];
      obj.Q = (rows[idx + 1] && rows[idx + 1][16]) ? rows[idx + 1][16] : (obj.Q || "");
      return obj;
    });

    // find user by email + hashed password
    const user = records.find(
      (record) =>
        (record.Email || "").toString().trim() === emailInput &&
        (record.Password || "") === hashedInputPassword
    );

    // If user found, check Q column for 'done'
    if (user) {
      // normalize Q value and check
      const qVal = (user.Q || "").toString().trim().toLowerCase();

      if (qVal === "done") {
        // Block login and show message (in Bengali)
        swal("এই একাউন্ট এর কার্ড ইতিমধ্যেই ডিসাইন সম্পন্ন হয়েছে", {
          icon: "info",
        });
        // reset button text and keep login visible
        loginsbtn.innerText = "Sign In";
        return;
      }

      // proceed with normal login flow
      loginsbtn.innerText = "Loading...";
      setTimeout(() => {
        loginS.style.display = 'none';
        designS.style.display = 'block';

        // populate fields safely (use empty string fallback)
        document.querySelector('textarea[name="UserId"]').value = user.UserId || "";
        document.querySelector('textarea[name="Id"]').value = user.Id || "";
        document.querySelector('textarea[name="Name"]').value = user.Name || "";
        document.querySelector('textarea[name="Email"]').value = user.Email || "";
        document.querySelector('textarea[name="Password"]').value = user.Password || "";
        document.querySelector('textarea[name="NFC"]').value = user.NFC || "";
        document.querySelector('textarea[name="custom_Logo"]').value = user.custom_Logo || "";

        document.getElementById('ctName').value = user.ctName || "";
        document.getElementById('ctProfessionOne').value = user.ctProfessionOne || "";
        document.getElementById('ctProfessionTow').value = user.ctProfessionTow || "";
        document.getElementById('ctProfessionThree').value = user.ctProfessionThree || "";

        const idValue = document.getElementById("Id").value;
        const url = "https://mytaply.github.io/taply.app/profile/?user=" + idValue;

        const qrContainers = document.querySelectorAll(".QR");
        qrContainers.forEach(function (qrContainer) {
          qrContainer.innerHTML = "";
            new QRCode(qrContainer, {
            text: url,
            width: 80,  // আগের মতোই
            height: 80, // আগের মতোই
            correctLevel: QRCode.CorrectLevel.L, // কম লেভেল রাখলে ব্লক বড় হবে
            margin: 2 // চারপাশে কিছু সাদা জায়গা রাখবে
          });
        });

        const appURl = document.getElementById("appURl");
        appURl.innerText = url;
        appURl.href = url;
        const appURLBtn = document.getElementById("appURLBtn");
        appURLBtn.href = url;

        console.log("Login successful and data loaded!");
        loginsbtn.innerText = "Sign In";
      }, 2000);
    } else {
      setTimeout(() => {
        errorMsg.style.display = 'block';
        loginS.style.display = 'block';
        designS.style.display = 'none';
        loginsbtn.innerText = "Sign In";
        console.error("Invalid email or password!");
      }, 2000);
    }
  } catch (error) {
    console.error("Error fetching data from Google Sheets API:", error);
    swal("Error", "ডেটা লোড করতে সমস্যা হয়েছে। পরে আবার চেষ্টা করুন।", "error");
    loginsbtn.innerText = "Sign In";
  }
});

// ✅ Enter key press to trigger login button
document.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    document.querySelector('.logIn-btn').click();
  }
});

//----------------------save content--------------------------------//
const scriptURL = "https://script.google.com/macros/s/AKfycbwM4HwOOpy7vAIMgRRJ_zYOkD0BuHr5eS4avSmO3omELVh58yHT9_qaNojLNS68FcqS_Q/exec";
const scriptURLOne = "https://script.google.com/macros/s/AKfycbw6Zbx9Fr-3JLG5L-t9WLc33Q9ZmmPu0-u58wPCbYHx9IMdqdZtf09CdUdhGIuJJ-DnAQ/exec";
const form = document.forms["submit-to-google-sheet"];
const fileInput = document.getElementById("media");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);

    // Handle file upload (if any)
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];

        // Size validation - less than 2MB
        if (file.size > 1024 * 1024 * 2) {
            swal("Error", "File size should be less than 2MB.", "error");
            return;
        }

        const reader = new FileReader();
        reader.onload = async function () {
            formData.append("media", reader.result.split(",")[1]); // Append base64 data
            await submitForm(formData);
        };
        reader.readAsDataURL(file);
    } else {
        await submitForm(formData);
    }
});

async function submitForm(formData) {
    const submitButton = document.querySelector("button[type='submit']");
    submitButton.disabled = true;
    submitButton.innerText = "Loading...";

    try {
        // Send to first Google Script
        await fetch(scriptURL, { method: "POST", body: formData });

        // Send to second Google Script
        await fetch(scriptURLOne, { method: "POST", body: formData });

        // Show success and reload after OK
        swal("Done", "", "success").then(() => {
            location.reload();
        });

        form.reset();
    } catch (error) {
        swal("Error", "Something went wrong. Please try again!", "error");
        console.error(error);
    } finally {
        submitButton.disabled = false;
        submitButton.innerText = "save";
    }
}


/*-------------------------Toggle Password Visibility-------------------------*/
  // TOGGLE PASSWORD VISIBILITY FOR ALL FIELDS WITH THE "toggle-password" CLASS
  const toggleButtons = document.querySelectorAll('.toggle-password');
  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input) {
        if (input.type === "password") {
          input.type = "text";
          button.textContent = "Hide";
        } else {
          input.type = "password";
          button.textContent = "Show";
        }
      }
    });
  });
/*----------------------------------card design----------------------------------*/
const ctn = document.getElementById('ctName');
const displayCtn = document.getElementById('display-ctn');
const displayCtnOne = document.getElementById('display-ctn-one');

// Update the top box content whenever the input changes
ctn.addEventListener('input', () => {
  displayCtn.textContent = ctn.value;
  displayCtnOne.textContent = ctn.value;
});

/*-----------profession input-----------*/
const ctpOne = document.getElementById('ctProfessionOne');
const displayCtpOne = document.getElementById('display-ctp-one');
const displayCtpOneOne = document.getElementById('display-ctp-one-one');

// Update the top box content whenever the input changes
ctpOne.addEventListener('input', () => {
  displayCtpOne.textContent = ctpOne.value;
  displayCtpOneOne.textContent = ctpOne.value;
});
/*-----------profession input tow-----------*/
const ctpTow = document.getElementById('ctProfessionTow');
const displayCtpTow = document.getElementById('display-ctp-tow');
const displayCtpTowTow = document.getElementById('display-ctp-tow-tow');

// Update the top box content whenever the input changes
ctpTow.addEventListener('input', () => {
  displayCtpTow.textContent = ' | ' + ctpTow.value;
  displayCtpTowTow.textContent = ' | ' + ctpTow.value;
});
/*-----------profession input Three-----------*/
const ctpThree = document.getElementById('ctProfessionThree');
const displayCtpThree = document.getElementById('display-ctp-three');
const displayCtpThreeThree = document.getElementById('display-ctp-three-three');

// Update the top box content whenever the input changes
ctpThree.addEventListener('input', () => {
  displayCtpThree.textContent = ' | ' + ctpThree.value;
  displayCtpThreeThree.textContent = ' | ' + ctpThree.value;
});
/*------------------------------------settings open------------------------------------*/
const settingBtns = document.querySelectorAll('.setting-btn');
const settingBoxes = document.querySelectorAll('.setting-box');

// Add event listeners to each button
settingBtns.forEach((btn, index) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation(); // Prevent the click from propagating to the document

    // Toggle the visibility of the corresponding setting box
    const settingBox = settingBoxes[index];
    settingBox.style.display = settingBox.style.display === 'block' ? 'none' : 'block';

    // Hide all other setting boxes
    settingBoxes.forEach((box, boxIndex) => {
      if (boxIndex !== index) {
        box.style.display = 'none';
      }
    });
  });
});

// Hide all setting boxes when clicking anywhere else on the document
document.addEventListener('click', () => {
  settingBoxes.forEach((box) => {
    box.style.display = 'none';
  });
});

// Prevent the setting box from closing when clicking inside it
settingBoxes.forEach((box) => {
  box.addEventListener('click', (e) => {
    e.stopPropagation();
  });
});

/*----------------------------------settings----------------------------------*/
// Name
const topLeftN = document.getElementById('top-left-n');
const topRightN = document.getElementById('top-right-n');
const ctnN = document.querySelectorAll('.ctn');

// Profession
const topLeftP = document.getElementById('top-left-p');
const topRightP = document.getElementById('top-right-p');
const ctnP = document.querySelectorAll('.ctp');
/*--------------------- Name ---------------------*/
// Name Top Left button click
topLeftN.addEventListener('click', () => {
  ctnN.forEach(element => {
    element.style.top = '2rem';
    element.style.bottom = '';
    element.style.left = '2rem';
    element.style.right = '';
  });
});

// Name Top Right button click
topRightN.addEventListener('click', () => {
  ctnN.forEach(element => {
    element.style.top = '2rem';
    element.style.bottom = '';
    element.style.left = '';
    element.style.right = '2rem';
  });
});

/*--------------------- Profession ---------------------*/
// Profession Top Left button click
topLeftP.addEventListener('click', () => {
  ctnP.forEach(element => {
    element.style.top = '4.5rem';
    element.style.bottom = '';
    element.style.left = '2rem';
    element.style.right = '';
  });
});

// Profession Top Right button click
topRightP.addEventListener('click', () => {
  ctnP.forEach(element => {
    element.style.top = '4.5rem';
    element.style.bottom = '';
    element.style.left = '';
    element.style.right = '2rem';
  });
});

/*------------------------------Add event listener to the button------------------------------*/
document.getElementById('add-profession-input').addEventListener('click', () => {
  // Get all the hidden textareas
  const textAreas = ['ctProfessionTow', 'ctProfessionThree'];
  
  for (let id of textAreas) {
    const textArea = document.getElementById(id);
    // Show the first hidden textarea
    if (textArea.style.display === 'none') {
      textArea.style.display = 'block';
      break;
    }
  }
});
document.getElementById('delete-profession-input').addEventListener('click', () => {
  const deleteCtpThree = document.getElementById('ctProfessionThree');
  const deleteCtpTow = document.getElementById('ctProfessionTow');
  const threeValue = document.getElementById('display-ctp-three');
  const towValue = document.getElementById('display-ctp-tow');

  if (deleteCtpThree.style.display === 'block') {
    deleteCtpThree.value = '';
    deleteCtpThree.style.display = 'none';
    threeValue.innerText ='';
  } else {
    deleteCtpTow.value = '';
    deleteCtpTow.style.display = 'none';
    towValue.innerText = '';
  }
});

/*-----------------------------textarea type number system-----------------------------*/
// Select all textareas with the class 'phoneNumber'
const textareanum = document.querySelectorAll('.phoneNumber');

// Initialize each textarea with '+880'
textareanum.forEach((textarea) => {
  if (!textarea.value.startsWith('+880')) {
    textarea.value = '+880';
  }

  textarea.addEventListener('input', () => {
    let value = textarea.value;
    
    // Make sure the value always begins with '+880'
    if (!value.startsWith('+880')) {
      value = '+880' + value.replace(/^\+?880?/, '');
    }
    
    // Get the part after '+880'
    let numberPart = value.slice(4);
    
    // Remove all non-numeric characters from the number part
    numberPart = numberPart.replace(/[^0-9]/g, '');
    
    // If the number starts with one or more 0's, remove them.
    // This allows the user to type a 0, but it won't be part of the final number.
    numberPart = numberPart.replace(/^0+/, '');
    
    // Insert a dash after the first 4 digits if more than 4 digits are present
    if (numberPart.length > 4) {
      numberPart = numberPart.slice(0, 4) + '-' + numberPart.slice(4);
    }
    
    // Update the textarea with '+880' and the formatted number
    textarea.value = '+880 ' + numberPart;
  });
});


/*------------------card background design*------------------*/
document.querySelectorAll('.card-color-box input[type="radio"]').forEach(input => {
  input.addEventListener('change', function () {
    const label = this.closest('label');
    // Get only the first image within the label
    const img = label.querySelector('img');
    
    // Retrieve all matching elements for svg-box and svg-box-one
    const svgBoxes = document.querySelectorAll('.svg-box');
    const svgBoxesOne = document.querySelectorAll('.svg-box-one');
    const cardTheme = document.querySelector('.front.card-theme');
    const backCardTheme = document.querySelector('.back.card-theme');
    const cardThemeSum = document.querySelector('.front.card-summary');
    const backCardThemeSum = document.querySelector('.back.card-summary');

    // Always clear previous content
    svgBoxes.forEach(box => box.innerHTML = "");
    svgBoxesOne.forEach(box => box.innerHTML = "");
    cardTheme.style.background = "";
    backCardTheme.style.background = "";
    cardThemeSum.style.background = "";
    backCardThemeSum.style.background = "";

    // Get computed styles from the label.
    const computedStyle = window.getComputedStyle(label);
    const bgImage = computedStyle.backgroundImage; // e.g., "none" or "linear-gradient(...)"
    const bgColor = computedStyle.backgroundColor;   // e.g., "rgb(255, 255, 255)" or "rgba(0, 0, 0, 0)"
    
    // Determine if a background style is explicitly defined.
    // (Assumes "transparent" means no background was set.)
    const hasBackground = (bgImage && bgImage !== 'none' && bgImage.includes('gradient'))
                          || (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent');

    if (hasBackground) {
      // If a background (solid or gradient) is set, apply it to the card theme containers.
      // Using the shorthand "background" will carry both color and any gradient.
      cardTheme.style.background = computedStyle.background;
      backCardTheme.style.background = computedStyle.background;
      cardThemeSum.style.background = computedStyle.background;
      backCardThemeSum.style.background = computedStyle.background;
    } else if (img) {
      // If there's no background style but an image exists, update the SVG boxes with the image's HTML.
      svgBoxes.forEach(box => box.innerHTML = img.outerHTML);
      svgBoxesOne.forEach(box => box.innerHTML = img.outerHTML);
    }
  });
});




// Select all radio inputs for background color
const radioInputs = document.querySelectorAll('input[type="radio"][name="background"]');
const cardTheme = document.querySelector('.front.card-theme');
const backCardTheme = document.querySelector('.back.card-theme');
const cardThemeSum = document.querySelector('.front.card-summary');
const backCardThemeSum = document.querySelector('.back.card-summary');

// Function to apply the color of the checked radio input
function applyColor() {
  // Loop through all inputs
  radioInputs.forEach((input) => {
    if (input.checked) {
      // Find the associated p.color element
      const colorElement = input.parentElement.querySelector('.color');
      if (colorElement) {
        // Apply the color to the target elements
        const color = window.getComputedStyle(colorElement).color;
        cardTheme.style.color = color;
        backCardTheme.style.color = color;
        cardThemeSum.style.color = color;
        backCardThemeSum.style.color = color;
      }
    }
  });
}

// Add event listeners to all radio inputs for background color
radioInputs.forEach((input) => {
  input.addEventListener('change', applyColor);
});

// Apply color on page load
applyColor();

/*----------------------------next button to submit----------------------------*/
document.getElementById('next').addEventListener('click', () => {
  // Hide the main preview and card design form
  const mainPreview = document.getElementById('main-preview');
  const cardDesignForm = document.querySelector('.card-design-form');
  if (mainPreview) mainPreview.style.display = 'none';
  if (cardDesignForm) cardDesignForm.style.display = 'none';

  // Show the design summary
  const designSummary = document.querySelector('.design-summary');
  if (designSummary) designSummary.style.display = 'block';
});
/*----------------------------back button to submit----------------------------*/
document.getElementById('back').addEventListener('click', () => {
  // Hide the main preview and card design form
  const mainPreview = document.getElementById('main-preview');
  const cardDesignForm = document.querySelector('.card-design-form');
  if (mainPreview) mainPreview.style.display = 'flex';
  if (cardDesignForm) cardDesignForm.style.display = 'flex';

  // Show the design summary
  const designSummary = document.querySelector('.design-summary');
  if (designSummary) designSummary.style.display = 'none';
});

/*----------------------------design selection slide----------------------------*/
document.addEventListener("DOMContentLoaded", function () {
  const faqToggles = document.querySelectorAll(".faq-toggle");

  faqToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const faqItem = toggle.parentElement;

      document.querySelectorAll(".faq-item").forEach((item) => {
        if (item !== faqItem) {
          item.classList.remove("active");
          item.querySelector(".faq-content").style.display = "none";
          item.querySelector(".faq-toggle").classList.remove("active");
        }
      });

      const content = toggle.nextElementSibling;
      faqItem.classList.toggle("active");
      toggle.classList.toggle("active");
      content.style.display =
        content.style.display === "block" ? "none" : "block";
    });
  });
});
/*----------------------------backgrund texture----------------------------*/
document.getElementById('cttd').addEventListener('change', function(e) {
  // Hide all textures
  document.querySelectorAll('.background-texture-box img').forEach(function(img) {
    img.style.display = 'none';
  });
  
  // Get the selected value
  const selectedTexture = e.target.value;
  
  // If a valid texture is selected, display all matching images
  if (selectedTexture !== 'solid') {
    document.querySelectorAll('.' + selectedTexture).forEach(function(img) {
      img.style.display = 'block';
    });
  }
});

/*----------------------------scroll top----------------------------*/
document.querySelectorAll('.designNext').forEach(button => {
  button.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});
/*----------------------------background design----------------------------*/
document.querySelectorAll('.bg-items').forEach(item => {
  item.addEventListener('click', function(e) {
    e.stopPropagation();
    const content = this.querySelector('.bg-content');
    if (!content) return;

    const isActive = content.classList.contains('active');
    
    // Close all other popovers and reset their arrows
    document.querySelectorAll('.bg-content').forEach(other => {
      if (other !== content) {
        other.classList.remove('active');
        const parentArrow = other.closest('.bg-items')?.querySelector('i');
        if (parentArrow) parentArrow.style.transform = 'rotate(0deg)';
      }
    });

    // Toggle current popover
    content.classList.toggle('active', !isActive);

    if (!isActive) {
      positionPopover(content, this);
    } else {
      const arrow = this.querySelector('i');
      if (arrow) arrow.style.transform = 'rotate(0deg)';
    }
  });
});

document.addEventListener('click', function(e) {
  if (!e.target.closest('.bg-items') && !e.target.closest('.bg-content')) {
    document.querySelectorAll('.bg-content').forEach(content => {
      content.classList.remove('active');
      // Reset all arrows
      const parentItem = content.closest('.bg-items');
      const arrow = parentItem?.querySelector('i');
      if (arrow) arrow.style.transform = 'rotate(0deg)';
    });
  }
});

function positionPopover(content, parentItem) {
  const arrow = parentItem.querySelector('i');
  // Reset arrow first
  if (arrow) arrow.style.transform = 'rotate(90deg)';

  // Reset positioning
  content.style.top = '110%';
  content.style.left = 'auto';
  content.style.bottom = 'auto';
  content.style.right = '0';

  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const contentRect = content.getBoundingClientRect();

  // Vertical positioning
  if (contentRect.bottom > viewportHeight) {
    content.style.top = 'auto';
    content.style.bottom = '110%';
    if (arrow) arrow.style.transform = 'rotate(-90deg)'; // Flipped arrow
  }

  // Horizontal positioning
  const updatedRect = content.getBoundingClientRect();
  if (updatedRect.right > viewportWidth) {
    content.style.left = 'auto';
    content.style.right = '0';
  } else if (updatedRect.left < 0) {
    content.style.left = '0';
  }

  // Additional horizontal arrow rotation if needed
  if (updatedRect.right > viewportWidth || updatedRect.left < 0) {
    if (arrow) arrow.style.transform = 'rotate(90deg)';
  }
}
/*----------------------------mandatori button active----------------------------*/
const textInput = document.getElementById('ctName');
    const actionButton = document.getElementById('next');

    textInput.addEventListener('input', () => {
      // Trim whitespace to check if there's real content
      if (textInput.value.trim() !== "") {
        actionButton.disabled = false;
        actionButton.style.background = "#3e88ff";
        actionButton.style.color = "#ffffff";
        actionButton.style.cursor = "pointer";
      } else {
        actionButton.disabled = true;
        actionButton.style.background = "#e5e7eb";
        actionButton.style.color = "#cbd5e1";
        actionButton.style.cursor = " not-allowed";
      }
    });
/*----------------------------card logo block and none----------------------------*/
document.addEventListener("DOMContentLoaded", function () {
  const radios = document.querySelectorAll('input[name="background"]');
  const logos = document.querySelectorAll('#taplyLogo');
  const nfcIcons = document.querySelectorAll('.nfc-icon-box svg path');
  const textures = document.querySelectorAll('.background-texture-box img');

  function setNfcIconStroke(color) {
    nfcIcons.forEach(icon => {
      icon.setAttribute('stroke', color);
    });
  }

  function toggleImages() {
    const selectedRadio = document.querySelector('input[name="background"]:checked');
    if (!selectedRadio) return;

    let color = "#ffffff";      // default color
    let filterValue = "none";   // default filter
    let opacityValue = "35%";

    if (selectedRadio.id === "aaaa") {
      color = "#1e293b";
      filterValue = "invert(100%)";
    } else if (selectedRadio.id === "ffff") {
      color = "#1e293b";
      filterValue = "invert(100%)";
    } else if (selectedRadio.id === "vvv") {
      color = "#1e293b";
      filterValue = "invert(100%)";
    } else {
      color = "#ffffff";
      filterValue = "none";
    }

    // Apply color to logos
    logos.forEach(logo => {
      logo.style.color = color;
    });

    // Apply filter and opacity to each texture image
    textures.forEach(img => {
      img.style.filter = filterValue;
      img.style.opacity = opacityValue;
    });

    setNfcIconStroke(color);
  }

  radios.forEach(radio => {
    radio.addEventListener("change", toggleImages);
  });

  toggleImages(); // Initial apply
});