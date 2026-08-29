import React from 'react';

function CheckoutSteps(props) {
  const steps = [
    { num: 1, name: 'Sign In', active: props.step1 },
    { num: 2, name: 'Shipping', active: props.step2 },
    { num: 3, name: 'Payment', active: props.step3 },
    { num: 4, name: 'Place Order', active: props.step4 },
  ];

  return (
    <div className="checkout-steps">
      <div className="checkout-step-line"></div>
      {steps.map((s) => (
        <div
          key={s.num}
          className={`checkout-step-item ${s.active ? 'active' : ''}`}
        >
          <div className="checkout-step-node">
            {s.active ? <i className="fa fa-check" style={{ fontSize: '1.2rem' }}></i> : s.num}
          </div>
          <div className="checkout-step-label">{s.name}</div>
        </div>
      ))}
    </div>
  );
}

export default CheckoutSteps;