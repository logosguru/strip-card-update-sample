import React from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import axios from 'axios';

import CardSection from './CardSection';

axios.defaults.baseURL = 'https://w95fqtylb6.execute-api.us-east-1.amazonaws.com';
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';

axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';

axios.interceptors.request.use(
    async (config) => {
        try {
            const token = "eyJraWQiOiI0MFErR25HeFQzNHhFdGpLbnd5NnVOU0l2NkgzdG05WkJPbEdZcDRBdlM4PSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJkZWYwMGI3OC1lZWQ2LTQ4NzktYTU0ZS02NDJiYzYxMGIyYWIiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV84WE4wS3pRRDIiLCJjbGllbnRfaWQiOiIxcjVqZXZocmR1ZmVicG1yOWtlNWlzY3Q5byIsIm9yaWdpbl9qdGkiOiI4YmRlMjI2ZC02MGUwLTQzM2QtOTIzZi0zYmQ5ZDM5YTM5NTEiLCJldmVudF9pZCI6IjhiMTg5N2I3LTRjYTItNDcyMy1iY2Y0LTBhZDI0ZTc4NmJjZiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2NTMwNjg2MDAsImV4cCI6MTY1NDI4MzE5OCwiaWF0IjoxNjU0Mjc5NTk5LCJqdGkiOiI0ZTdkMmNhOS1hNDhhLTRmN2MtODBlMC01ZTRkNTdiZTQwYzUiLCJ1c2VybmFtZSI6ImRlZjAwYjc4LWVlZDYtNDg3OS1hNTRlLTY0MmJjNjEwYjJhYiJ9.i3U3N47YNPug34rGbmcDyp4eFYt8M9JFXuiIhD65sll1-upXTKeY0t1DR4MwsWaJOf1rvozivCzExAREUv4D7u_D-qcgWSUAt8UrVjEVvrBzL8582RFYLSvi1nTINLTMLJjp3HFZifyilM4-J4gIOEQf54wTBlyCAVp15lsmD8mn3-Nd-45AgIhU52NpPpITT8Rc4wlt_fwmUAzYV4fA2prMpfgBu7FNw1dE5gScwRK3QVURF5RJrkUzXg-ricSTwPBwsc3Sz9TQw9WnyQC6cDHaphNSVCfNWzMWNhE0IALk_weuPG0mMh3WNUplZqeBnygfMfd4MwV8OgtSSkro8Q";
            config.headers.Authorization = `Bearer ${token}`;
            return config;
        } catch (error) {
            return config;
        }
    },
    (err) => {
        return Promise.reject(err);
    }
);

axios.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default function CheckoutForm() {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        // We don't want to let default form submission happen here,
        // which would refresh the page.
        event.preventDefault();
        
        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            // Make sure to disable form submission until Stripe.js has loaded.
            alert('Strip.js has not yet loaded.')
            return;
        }

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)
        });

        if (error) {
            // Show error to your customer (for example, insufficient funds)
            console.log(error.message);
        } else {
            // The payment has been processed!
            console.log(paymentMethod);
            // Attach payment method to the customer & create a subscription
            await axios
                .post('/billing/payment_method', {
                    stripe_payment_method_id: paymentMethod.id,
                    card: paymentMethod.card
                })
                .then((response) => {
                    alert(response.data.message);
                })
                .catch(function (error) {
                    if (error.response) {
                        alert('Payment Failed. - ' + error.response.data.message);
                    }
                });

        }
    };

    return (
        <form onSubmit={handleSubmit}>
           
            <CardSection />
            <button style={{ margin: '30px 0', font: '14px' }} disabled={!stripe}>Update Credit Card</button>
        </form>
    );
}