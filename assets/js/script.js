document.addEventListener("DOMContentLoaded", () => {
    const faqItems = document.querySelectorAll(".faq__item");
  
    // Ensure all answers are hidden by default
    faqItems.forEach((item) => {
      const answer = item.querySelector(".faq__answer");
      const icon = item.querySelector(".faq__icon");
  
      // Hide answers and set default icon state
      answer.style.display = "none";
      icon.textContent = "+"; // Default to "+" for all items
  
      // Add click event listener to toggle visibility
      const questionButton = item.querySelector(".faq__header");
      questionButton.addEventListener("click", () => {
        const isExpanded = item.classList.toggle("faq__item--expanded");
  
        // Toggle the icon and answer visibility
        icon.textContent = isExpanded ? "−" : "+";
        answer.style.display = isExpanded ? "block" : "none";
      });
    });
  });
  