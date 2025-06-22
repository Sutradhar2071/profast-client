import React from "react";
import Marquee from "react-fast-marquee";

// Import logos
import logo1 from '../../../assets/brands/amazon.png'
import logo2 from '../../../assets/brands/amazon_vector.png'
import logo3 from '../../../assets/brands/casio.png'
import logo4 from '../../../assets/brands/moonstar.png'
import logo5 from '../../../assets/brands/randstad.png'
import logo6 from '../../../assets/brands/start-people 1.png'
import logo7 from '../../../assets/brands/start.png'


const logos = [logo1, logo2, logo3, logo4, logo5, logo6, logo7];

const ClientLogos = () => {
  return (
    <section className="py-12 bg-base-100">
      <h2 className="text-2xl font-bold text-center mb-8">We've helped thousands of sales teams</h2>
      <Marquee direction="left" speed={70} gradient={false}>
        {logos.map((logo, index) => (
          <img
            key={index}
            src={logo}
            alt={`Logo ${index}`}
            className="h-6 mx-24 w-auto object-contain"
          />
        ))}
      </Marquee>
    </section>
  );
};

export default ClientLogos;
