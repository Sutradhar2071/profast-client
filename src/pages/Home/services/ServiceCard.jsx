import React from "react";

const ServiceCard = ({ service }) => {
    const {icon:Icon ,title, description} = service
  return (
    <div className="card bg-base-100 shadow-md hover:shadow-xl hover:bg-gray-200 transition duration-300">
      <div className="card-body items-center text-center">
        <Icon className="text-4xl text-primary mb-3" />
        <h2 className="card-title text-lg">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default ServiceCard;
