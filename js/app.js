//--------------------------------------dropdown menu-----------------------------------------------//
const dropdownLinks = document.querySelectorAll('.dropdown-link');
const dropdownMenus = document.querySelectorAll('.dropdown-menu');

dropdownLinks.forEach((link, index) => {
  let menu = dropdownMenus[index];
  let isMenuVisible = false;

  link.addEventListener('click', function (e) {
    e.stopPropagation();

    // Hide all other dropdowns
    dropdownMenus.forEach((m, i) => {
      if (i !== index) {
        m.style.display = 'none';
      }
    });

    // Toggle this dropdown
    isMenuVisible = menu.style.display === 'block';
    menu.style.display = isMenuVisible ? 'none' : 'block';
  });

  // Prevent closing when clicking inside menu
  menu.addEventListener('click', function (e) {
    e.stopPropagation();
  });
});

// Click anywhere to close all menus
document.addEventListener('click', function () {
  dropdownMenus.forEach(menu => {
    menu.style.display = 'none';
  });
});


//benefit content show and hide
const buttons = document.querySelectorAll(".benefit-btn");
const contentBoxes = document.querySelectorAll(".benefit-content-box");

// Add click event listeners to all buttons
buttons.forEach((button) => {
    button.addEventListener("click", () => {
        buttons.forEach((btn) => btn.classList.remove("active"));

        contentBoxes.forEach((box) => (box.style.display = "none"));

        button.classList.add("active");

        const targetContentId = button.id.replace("-btn", "-content");
        const targetContentBox = document.getElementById(targetContentId);
        if (targetContentBox) {
            targetContentBox.style.display = "block";
        }
    });
});

//FAQS sections
document.addEventListener("DOMContentLoaded", function () {
  const faqGroups = document.querySelectorAll(".faqs-box");

  faqGroups.forEach((group) => {
    const faqToggles = group.querySelectorAll(".faq-toggle");

    faqToggles.forEach((toggle) => {
      toggle.addEventListener("click", () => {
        const faqItem = toggle.parentElement;
        const isActive = faqItem.classList.contains("active");

        // এই গ্রুপের সব faq-item থেকে active রিমুভ
        group.querySelectorAll(".faq-item").forEach((item) => {
          item.classList.remove("active");
          item.querySelector(".faq-toggle").classList.remove("active");
        });

        // যদি আগে থেকে active না থাকে, তবে active করো
        if (!isActive) {
          faqItem.classList.add("active");
          toggle.classList.add("active");
        }
      });
    });
  });
});

  //---------------------------------------- scroll top------------------------// Select the scroll-to-top button using its class
const scrollTopBtn = document.querySelector('.scrollTopBtn');

// Show the button when the user scrolls down more than 100px
window.addEventListener('scroll', function() {
  if (document.documentElement.scrollTop > 100 || document.body.scrollTop > 100) {
    scrollTopBtn.style.display = 'block';
  } else {
    scrollTopBtn.style.display = 'none';
  }
});

// Scroll to the top when the button is clicked
scrollTopBtn.addEventListener('click', function() {
  if ('scrollBehavior' in document.documentElement.style) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    window.scrollTo(0, 0);
  }
});

