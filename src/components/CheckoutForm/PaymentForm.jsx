import React, { useRef, useEffect } from "react";
import { Typography, Button, Divider } from "@material-ui/core";

import Review from "./Review";
const PaymentForm = ({
  checkoutToken,
  nextStep,
  backStep,
  onCaptureCheckout,
}) => {
  const paypal = useRef();

  useEffect(() => {
    window.paypal
      .Buttons({
        createOrder: (data, actions, err) => {
          return actions.order.create({
            intent: "CAPTURE",
            purchase_units: [
              {
                description: "",
                amount: {
                  currency_code: "INR",
                  value: checkoutToken.live.subtotal.raw,
                },
              },
            ],
          });
        },
        onApprove: async (data, actions) => {
          const order = await actions.order.capture();
          onCaptureCheckout(checkoutToken.id, order);
          nextStep();
        },
        onError: (err) => {
          console.log(err);
        },
      })
      .render(paypal.current);
  }, []);

  return (
    <>
      <Review checkoutToken={checkoutToken} />
      <Divider />
      <Typography variant="h6" gutterBottom style={{ margin: "20px 0" }}>
        Payment method
      </Typography>
      <div ref={paypal}></div>
      <Button variant="outlined" onClick={backStep}>Back</Button>
    </>
  );
};

export default PaymentForm;
