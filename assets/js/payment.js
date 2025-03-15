document.addEventListener('DOMContentLoaded', () => {
    const orderButtons = document.querySelectorAll('.pricing__button');
    
    orderButtons.forEach(button => {
      button.addEventListener('click', async function() {
        // Get the parent pricing item
        const pricingItem = this.closest('.pricing__item');
        
        // Extract the plan name and price
        const planName = pricingItem.querySelector('.pricing__plan').textContent.trim();
        const priceText = pricingItem.querySelector('.pricing__price').textContent;
        const price = parseFloat(priceText.match(/\$(\d+)/)[1]); // Extract the numeric price
        
        // Show loading state
        const originalText = this.textContent;
        this.textContent = 'Processing...';
        this.disabled = true;
        
        try {
          // Call the Vercel API route
          const response = await fetch('/api/create-checkout', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              planName: planName,
              amount: price
            })
          });
          
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          
          const { url } = await response.json();
          
          // Open Stripe checkout in a new tab/window
          window.open(url, '_blank');
          
          // Reset button
          this.textContent = originalText;
          this.disabled = false;
        } catch (error) {
          console.error('Payment error:', error);
          this.textContent = originalText;
          this.disabled = false;
          alert('There was an error processing your payment. Please try again.');
        }
      });
    });
  });