document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq__item");

  // Ensure all answers are hidden by default
  faqItems.forEach((item) => {
      const answer = item.querySelector(".faq__answer");
      const plusIcon = item.querySelector(".faq__icon--plus");
      const minusIcon = document.createElement("img");

      // Set minus icon attributes
      minusIcon.src = "/assets/icons/minus.svg";
      minusIcon.alt = "Collapse";
      minusIcon.classList.add("faq__icon", "faq__icon--minus");
      minusIcon.style.display = "none"; // Hide minus icon initially

      // Insert minus icon after the plus icon
      plusIcon.insertAdjacentElement("afterend", minusIcon);

      // Hide answers by default
      answer.style.display = "none";

      // Add click event listener to toggle visibility
      const questionHeader = item.querySelector(".faq__header");
      questionHeader.addEventListener("click", () => {
          const isExpanded = item.classList.toggle("faq__item--expanded");

          // Toggle icon visibility
          plusIcon.style.display = isExpanded ? "none" : "inline-block";
          minusIcon.style.display = isExpanded ? "inline-block" : "none";

          // Toggle the answer visibility
          answer.style.display = isExpanded ? "block" : "none";
      });
  });
});


document.addEventListener('DOMContentLoaded', () => {
  const categories = document.querySelectorAll('.category');
  const dropdownToggle = document.querySelector('.category-dropdown__toggle');
  const dropdownList = document.querySelector('.category-dropdown__list');
  const dropdownItems = document.querySelectorAll('.category-dropdown__item');
  const dropdownText = document.querySelector('.category-dropdown__text');

  // Function to update the active category
  const updateActiveCategory = (value) => {
    categories.forEach(category => {
      if (category.getAttribute('data-value') === value) {
        category.classList.add('active');
      } else {
        category.classList.remove('active');
      }
    });
    dropdownText.textContent = value; // Update dropdown toggle text
    dropdownText.style.color = '#000000'; // Set text color to match active state
  };

  // Handle clicks on horizontal buttons
  categories.forEach(category => {
    category.addEventListener('click', () => {
      const value = category.getAttribute('data-value');
      updateActiveCategory(value);
    });
  });

  // Toggle dropdown visibility
  dropdownToggle.addEventListener('click', (e) => {
    e.preventDefault();
    dropdownList.classList.toggle('active');
    dropdownToggle.classList.toggle('open');
    dropdownToggle.setAttribute('aria-expanded', dropdownToggle.classList.contains('open'));
  });

  // Handle dropdown item selection
  dropdownItems.forEach(item => {
    item.addEventListener('click', () => {
      const value = item.getAttribute('data-value');
      updateActiveCategory(value);
      dropdownList.classList.remove('active');
      dropdownToggle.classList.remove('open');
      dropdownToggle.setAttribute('aria-expanded', 'false');
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!dropdownToggle.contains(e.target) && !dropdownList.contains(e.target)) {
      dropdownList.classList.remove('active');
      dropdownToggle.classList.remove('open');
      dropdownToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Initialize with the current active category
  const initialActive = document.querySelector('.category.active');
  if (initialActive) {
    updateActiveCategory(initialActive.getAttribute('data-value'));
  }
});