import React from "react";
import track from "../../../assets/benifits/track.png";
import support from "../../../assets/benifits/support.png";
import delivery from "../../../assets/benifits/delivery.png";

const benefits = [
  {
    id: 1,
    title: "Live Parcel Tracking",
    description:
      "Stay updated in real-time with our live parcel tracking feature. From pick-up to delivery, monitor your shipment's journey and get instant status updates for complete peace of mind.",
    image: track,
  },
  {
    id: 2,
    title: "100% Safe Delivery",
    description:
      "We ensure your parcels are handled with the utmost care and delivered securely to their destination. Our reliable process guarantees safe and damage-free delivery every time.",
    image: delivery,
  },
  {
    id: 3,
    title: "24/7 Call Center Support",
    description:
      "Our dedicated support team is available around the clock to assist you with any questions, updates, or delivery concerns—anytime you need us.",
    image: support,
  },
];

const Benefits = () => {
  return (
    <div className="my-16 px-4 md:px-8 lg:px-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold">Why Choose Us</h2>
      </div>

      <div className="grid gap-6">
        {benefits.map((item) => (
          <div
            key={item.id}
            className="card lg:card-side bg-base-100 shadow-md hover:shadow-xl transition-all duration-300"
          >
            {/* Left Image */}
            <div className="flex justify-center items-center w-full lg:w-1/3 p-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-[100px] h-[100px] object-contain"
              />
            </div>

            {/* Vertical Divider (full height responsive) */}
            <div className="hidden lg:flex items-stretch">
              <div className="w-px bg-base-300 mx-2"></div>
            </div>

            {/* Right Content */}
            <div className="card-body lg:w-2/3 flex justify-center flex-col text-center lg:text-left">
              <h3 className="card-title text-xl font-semibold">{item.title}</h3>
              <p className="text-gray-600">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Benefits;
