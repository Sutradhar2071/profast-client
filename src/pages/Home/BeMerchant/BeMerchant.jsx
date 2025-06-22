import React from "react";
import location from "../../../assets/location-merchant.png";

const BeMerchant = () => {
  return (
    <div className="p-20 rounded-4xl bg-[url(assets/be-a-merchant-bg.png)] bg-no-repeat text-white bg-[#03373D]">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <img src={location} className="max-w-sm rounded-lg shadow-2xl" />
        <div>
          <h1 className="text-5xl font-bold">
            Merchant and Customer Satisfaction is Our First Priority
          </h1>
          <p className="py-6">
            We offer the lowest delivery charge with the highest value along
            with 100% safety of your product. Pathao courier delivers your
            parcels in every corner of Bangladesh right on time.
          </p>
          <button className="btn text-black p-3 rounded-full btn-primary">
            Become a Merchant
          </button>
          <button className="btn btn-outline ms-4 rounded-full btn-primary">
            Earn with Profast Courier
          </button>
        </div>
      </div>
    </div>
  );
};

export default BeMerchant;
