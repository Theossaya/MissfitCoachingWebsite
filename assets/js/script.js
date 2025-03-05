document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq__item");

  // Ensure all answers are hidden by default
  faqItems.forEach((item) => {
    const answer = item.querySelector(".faq__answer");
    const plusIcon = item.querySelector(".faq__icon--plus");
    const minusIcon = document.createElement("img");

    // Set minus icon attributes
    minusIcon.src = "/MissfitCoachingWebsite/assets/icons/minus.svg";
    minusIcon.alt = "Collapse";
    minusIcon.classList.add("faq__icon", "faq__icon--minus");
    minusIcon.style.display = "none"; // Hide minus icon initially

    // Insert minus icon after the plus icon
    plusIcon.insertAdjacentElement("afterend", minusIcon);

    // Hide answers by default
    answer.style.display = "none";

    // Add click event listener to the entire FAQ item (not just the header)
    item.addEventListener("click", (e) => {
      // Prevent default behavior if the click is on a link or button (optional, adjust as needed)
      if (e.target.tagName === "A" || e.target.tagName === "BUTTON") return;

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




document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.header__menu-toggle');
  const mobileMenu = document.querySelector('.header__mobile-menu');
  const desktopDropdownToggles = document.querySelectorAll('.header__nav-link--dropdown');
  const mobileDropdownToggles = document.querySelectorAll('.header__mobile-nav-link--dropdown');
  const navLinks = document.querySelectorAll('.header__nav-link, .header__mobile-nav-link');

  // Toggle mobile menu
  menuToggle.addEventListener('click', () => {
    const isExpanded = mobileMenu.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isExpanded);
  });

  // Toggle desktop dropdowns (on click)
  desktopDropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const dropdown = toggle.nextElementSibling;
      const isExpanded = dropdown.classList.toggle('active');
      
      // Update aria-expanded
      toggle.setAttribute('aria-expanded', isExpanded);
      
      // Rotate angle icon
      const icon = toggle.querySelector('.header__nav-icon');
      if (icon) {
        icon.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    });

    // Close other desktop dropdowns when one opens
    toggle.addEventListener('click', () => {
      desktopDropdownToggles.forEach(otherToggle => {
        if (otherToggle !== toggle) {
          const otherDropdown = otherToggle.nextElementSibling;
          otherDropdown.classList.remove('active');
          otherToggle.setAttribute('aria-expanded', 'false');
          const otherIcon = otherToggle.querySelector('.header__nav-icon');
          if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
        }
      });
    });
  });

  // Toggle mobile dropdowns (on click)
  mobileDropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      const dropdown = toggle.nextElementSibling;
      const isExpanded = dropdown.classList.toggle('active');
      
      // Rotate angle icon
      const icon = toggle.querySelector('.header__mobile-nav-icon');
      if (icon) {
        icon.style.transform = isExpanded ? 'rotate(180deg)' : 'rotate(0deg)';
      }
    });
  });

  // Close mobile menu and dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
      mobileMenu.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      
      // Close all mobile dropdowns
      document.querySelectorAll('.header__mobile-nav-dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
      });
      // Reset mobile angle icons
      document.querySelectorAll('.header__mobile-nav-icon').forEach(icon => {
        icon.style.transform = 'rotate(0deg)';
      });
    }

    // Close desktop dropdowns when clicking outside
    if (!document.querySelector('.header__nav.hero__nav').contains(e.target)) {
      document.querySelectorAll('.header__nav-dropdown').forEach(dropdown => {
        dropdown.classList.remove('active');
      });
      desktopDropdownToggles.forEach(toggle => {
        toggle.setAttribute('aria-expanded', 'false');
      });
      document.querySelectorAll('.header__nav-icon').forEach(icon => {
        icon.style.transform = 'rotate(0deg)';
      });
    }
  });
});


document.addEventListener('DOMContentLoaded', () => {
  function initSlider(sliderClass) {
    const slidesContainer = document.querySelector(`.${sliderClass}__slides`);
    const slides = document.querySelectorAll(`.${sliderClass}__slide`);
    const prevArrow = document.querySelector(`.${sliderClass}__arrow--left`);
    const nextArrow = document.querySelector(`.${sliderClass}__arrow--right`);
    const pagination = document.querySelector(`.${sliderClass}__pagination`);
    const totalSlides = slides.length;
    let currentSlide = 1;
    let isTransitioning = false;

    // Clone slides for infinite loop
    const firstSlideClone = slides[0].cloneNode(true);
    const lastSlideClone = slides[totalSlides - 1].cloneNode(true);
    slidesContainer.appendChild(firstSlideClone);
    slidesContainer.insertBefore(lastSlideClone, slides[0]);
    const allSlides = document.querySelectorAll(`.${sliderClass}__slide`);

    function updateSlideWidth() {
      const containerWidth = slidesContainer.parentElement.offsetWidth;
      return containerWidth > 0 ? containerWidth : 700; // Fallback to 700px if width is 0
    }

    let slideWidth = updateSlideWidth();
    slidesContainer.style.transition = 'none';
    slidesContainer.style.transform = `translateX(-${slideWidth}px)`;
    setTimeout(() => {
      slidesContainer.style.transition = 'transform 0.5s ease';
    }, 0);

    // Show slide function
    function showSlide(index, skipTransition = false) {
      if (isTransitioning && !skipTransition) return;
      isTransitioning = true;

      slideWidth = updateSlideWidth();
      slidesContainer.style.transition = skipTransition ? 'none' : 'transform 0.5s ease';
      slidesContainer.style.transform = `translateX(-${index * slideWidth}px)`;
      currentSlide = index;

      let paginationNumber = ((currentSlide - 1 + totalSlides) % totalSlides) + 1;
      pagination.textContent = `${paginationNumber} / ${totalSlides}`;

      if (!skipTransition) {
        setTimeout(() => { isTransitioning = false; }, 500);
      } else {
        isTransitioning = false;
      }
    }

    // Handle transition end for looping
    slidesContainer.addEventListener('transitionend', () => {
      if (currentSlide === 0) {
        showSlide(totalSlides, true);
      } else if (currentSlide === totalSlides + 1) {
        showSlide(1, true);
      } else {
        isTransitioning = false;
      }
    });

    // Navigation
    prevArrow.addEventListener('click', () => {
      if (!isTransitioning) showSlide(currentSlide - 1);
    });
    nextArrow.addEventListener('click', () => {
      if (!isTransitioning) showSlide(currentSlide + 1);
    });

    // Handle resize
    window.addEventListener('resize', () => {
      setTimeout(() => {
        slideWidth = updateSlideWidth();
        showSlide(currentSlide, true); // Update position without transition
      }, 100);
    });

    // Start at first slide
    showSlide(1);
  }

  initSlider('testimonial-slider');
  initSlider('testimonial-slider-2');
});


// Footer dropdown functionality
document.addEventListener('DOMContentLoaded', function() {
  // Get all footer headings
  const footerHeadings = document.querySelectorAll('.footer__heading');
  
  // Function to check if we're in mobile view
  function isMobileView() {
    return window.innerWidth <= 723;
  }
  
  // Function to handle click on headings
  function toggleDropdown(event) {
    if (!isMobileView()) return; // Don't do anything if not in mobile view
    
    const heading = event.currentTarget;
    const list = heading.nextElementSibling;
    const upIcon = heading.querySelector('.footer__heading-icon-up');
    const downIcon = heading.querySelector('.footer__heading-icon-down');
    
    // Toggle the active class on the list
    list.classList.toggle('active');
    
    // Toggle the visibility of the icons
    if (upIcon && downIcon) {
      if (list.classList.contains('active')) {
        upIcon.style.display = 'block';
        downIcon.style.display = 'none';
      } else {
        upIcon.style.display = 'none';
        downIcon.style.display = 'block';
      }
    }
  }
  
  // Add click event listener to all headings
  footerHeadings.forEach(heading => {
    heading.addEventListener('click', toggleDropdown);
  });
  
  // Reset all dropdowns when resizing above mobile breakpoint
  window.addEventListener('resize', function() {
    if (!isMobileView()) {
      document.querySelectorAll('.footer__list').forEach(list => {
        list.classList.remove('active');
      });
      
      document.querySelectorAll('.footer__heading-icon-up').forEach(icon => {
        icon.style.display = 'none';
      });
      
      document.querySelectorAll('.footer__heading-icon-down').forEach(icon => {
        icon.style.display = 'block';
      });
    }
  });
});