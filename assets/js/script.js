document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq__item");

  // Ensure all answers are hidden by default
  faqItems.forEach((item) => {
      const answer = item.querySelector(".faq__answer");
      const plusIcon = item.querySelector(".faq__icon--plus");
      const minusIcon = document.createElement("img");

      // Set minus icon attributes
      minusIcon.src = "assets/icons/minus.svg";
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
