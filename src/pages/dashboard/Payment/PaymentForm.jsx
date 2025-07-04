import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAuth from "../../../hooks/useAuth";
import Swal from "sweetalert2";

const PaymentForm = () => {
  const [error, setError] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const { user } = useAuth();

  const axiosSecure = useAxiosSecure();

  const { parcelId } = useParams();
  const { isPending, data: parcelInfo = {} } = useQuery({
    queryKey: ["parcels", parcelId],
    queryFn: async () => {
      const res = await axiosSecure.get(`/parcels/${parcelId}`);
      return res.data;
    },
  });

  if (isPending) {
    return "....loading";
  }

  //   console.log(parcelInfo);
  const amount = parcelInfo.cost;

  const amountCents = amount * 100;
  console.log(amountCents);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const card = elements.getElement(CardElement);
    if (!card) return;

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card,
    });

    if (error) {
      setError(error.message);
      return;
    }

    setError("");
    const res = await axiosSecure.post("/create-payment-intent", {
      amountCents,
      parcelId,
    });

    const clientSecret = res.data.clientSecret;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card,
        billing_details: {
          name: user.displayName,
          email: user.email,
        },
      },
    });

    if (result.error) {
      setError(result.error.message);
    } else {
      if (result.paymentIntent.status === "succeeded") {
        setError("");
        console.log("✅ Payment succeeded!");

        // STEP 1: Update parcel status to "paid"
        await axiosSecure.patch(`/parcels/${parcelId}/pay`);

        // STEP 2: Save payment history to DB
        const paymentData = {
          parcelId,
          trackingId: parcelInfo.trackingId,
          title: parcelInfo.title,
          amount: parcelInfo.cost,
          email: user.email,
          method: "card",
          status: "paid",
          createdAt: new Date(),
        };

        await axiosSecure.post("/payments", paymentData);

        // ✅ SweetAlert2 success message with tracking ID
        Swal.fire({
          icon: "success",
          title: "🎉 Payment Successful!",
          html: `Tracking ID: <strong>${parcelInfo.trackingId}</strong><br>Your payment for <strong>${parcelInfo.title}</strong> is completed.`,
          confirmButtonText: "Go to My Parcels",
          confirmButtonColor: "#3085d6",
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/dashboard/myParcels");
          }
        });
      }
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-6 rounded-xl shadow-md w-full max-w-md mx-auto"
      >
        <CardElement className="p-2 border rounded"></CardElement>

        <button
          type="submit"
          className="btn btn-primary text-black w-full"
          disabled={!stripe}
        >
          pay ${amount}
        </button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </div>
  );
};

export default PaymentForm;
