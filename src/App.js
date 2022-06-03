import './App.css';
import React from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import CheckoutForm from './CheckoutForm';

const stripePromise = loadStripe(
  'pk_test_51KDtbtGIRieBjuWQ1Dq1hONGsf8hfwQWNKcIY4ir8Siogdk58eQwKve8HYp2Rw5rMzKhsRQCHR3J64sQnWplYm6e00dhSKqE3g'
);

function App() {
  return (
    <div className="App">
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>     
    </div>
  );
};

export default App;
