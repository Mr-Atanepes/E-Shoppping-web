import React, { useState } from 'react';
import '../styles/CheckoutPage.css';

function CheckoutPage() {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      {step === 1 && (
        <div className="checkout-step">
          <h2>Shipping Information</h2>
          {/* Add shipping form here */}
          <button onClick={nextStep}>Next</button>
        </div>
      )}
      {step === 2 && (
        <div className="checkout-step">
          <h2>Payment Information</h2>
          {/* Add payment form here */}
          <button onClick={prevStep}>Back</button>
          <button onClick={nextStep}>Next</button>
        </div>
      )}
      {step === 3 && (
        <div className="checkout-step">
          <h2>Review Order</h2>
          {/* Add order summary here */}
          <button onClick={prevStep}>Back</button>
          <button>Place Order</button>
        </div>
      )}
    </div>
  );
}

export default CheckoutPage;
