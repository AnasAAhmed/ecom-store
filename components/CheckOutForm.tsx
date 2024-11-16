// import React, { useState } from "react";
// import { useRouter } from 'next/router';
// import { useStripe, useElements, PaymentElement, CardElement } from "@stripe/react-stripe-js";
// import toast from "react-hot-toast";
// import { useClerk } from "@clerk/nextjs";
// import useCart from "@/lib/hooks/useCart";

// const CheckOutForm: React.FC = () => {
//   const stripe = useStripe();
//   const elements = useElements();
//   const router = useRouter();
//   const { user } = useClerk();
//   const { cartItems, clearCart } = useCart();

//   const [isProcessing, setIsProcessing] = useState<boolean>(false);
//   const [shippingInfo, setShippingInfo] = useState({
//     street: '',
//     city: '',
//     state: '',
//     postalCode: '',
//     country: ''
//   });

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setShippingInfo({
//       ...shippingInfo,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (!stripe || !elements) return;

//     // Validate shipping information
//     if (!shippingInfo.street || !shippingInfo.city || !shippingInfo.state || !shippingInfo.postalCode || !shippingInfo.country) {
//       toast.error("Please fill out all shipping details");
//       return;
//     }

//     setIsProcessing(true);

//     try {
//       // Create payment intent
//       const paymentIntentRes = await fetch("/api/payment-intent", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify({
//           cartItems,
//           shippingInfo,
//           user
//         })
//       });

//       if (!paymentIntentRes.ok) {
//         throw new Error("Failed to create payment intent");
//       }

//       const { clientSecret } = await paymentIntentRes.json();

//       // Confirm payment intent
//       const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
//         payment_method: {
//           card: elements.getElement(CardElement)!
//         }
//       });

//       if (error) {
//         throw new Error(error.message);
//       }

//       if (paymentIntent && paymentIntent.status === "succeeded") {
//         // Create order
//         const orderRes = await fetch("/api/orders", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json"
//           },
//           body: JSON.stringify({
//             cartItems,
//             shippingInfo,
//             user
//           })
//         });

//         if (!orderRes.ok) {
//           throw new Error("Failed to create order");
//         }

//         clearCart();
//         toast.success("Order created successfully!");
//         router.push("/orders");
//       }
//     } catch (error) {
//       toast.error(error.message || "Failed to process payment");
//     } finally {
//       setIsProcessing(false);
//     }
//   };

//   return (
//     <div className="checkout-container">
//       <form onSubmit={handleSubmit}>
//         <div>
//           <h2>Shipping Details</h2>
//           <label>
//             Street:
//             <input
//               type="text"
//               name="street"
//               value={shippingInfo.street}
//               onChange={handleChange}
//               required
//             />
//           </label>
//           <label>
//             City:
//             <input
//               type="text"
//               name="city"
//               value={shippingInfo.city}
//               onChange={handleChange}
//               required
//             />
//           </label>
//           <label>
//             State:
//             <input
//               type="text"
//               name="state"
//               value={shippingInfo.state}
//               onChange={handleChange}
//               required
//             />
//           </label>
//           <label>
//             Postal Code:
//             <input
//               type="text"
//               name="postalCode"
//               value={shippingInfo.postalCode}
//               onChange={handleChange}
//               required
//             />
//           </label>
//           <label>
//             Country:
//             <input
//               type="text"
//               name="country"
//               value={shippingInfo.country}
//               onChange={handleChange}
//               required
//             />
//           </label>
//         </div>
//         <div>
//           <h2>Payment Details</h2>
//           <PaymentElement />
//         </div>
//         <button type="submit" disabled={isProcessing}>
//           {isProcessing ? "Processing..." : `Pay $${cartItems.reduce((acc, item) => acc + item.item.price * item.quantity, 0)}`}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CheckOutForm;
