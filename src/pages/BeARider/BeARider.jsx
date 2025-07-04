import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useAuth from "../../hooks/useAuth";
import warehouseData from "../../assets/warehouses.json";
import Swal from "sweetalert2";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const BeARider = () => {
  const { user } = useAuth();
  const [regions, setRegions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const axiosSecure = useAxiosSecure();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm();

  const watchRegion = watch("region");

  useEffect(() => {
    const uniqueRegions = [
      ...new Set(warehouseData.map((item) => item.region)),
    ];
    setRegions(uniqueRegions);
  }, []);

  useEffect(() => {
    if (watchRegion) {
      const filteredDistricts = warehouseData
        .filter((item) => item.region === watchRegion)
        .map((item) => item.district);
      setDistricts(filteredDistricts);
    } else {
      setDistricts([]);
    }
  }, [watchRegion]);

  const onSubmit = async (data) => {
    const riderData = {
      ...data,
      name: user.displayName,
      email: user.email,
      status: "pending",
    };

    try {
      const res = await axiosSecure.post("/riders", riderData);

      if (res.data.insertedId) {
        Swal.fire({
          icon: "success",
          title: "Application Submitted",
          text: "Your rider application has been submitted successfully!",
          confirmButtonText: "OK",
          timer: 3000,
        });

        // ✅ Reset form fields
        reset();
      }
    } catch (error) {
      console.error("Submission failed:", error);
      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: "Please try again later.",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg my-10">
      <h2 className="text-3xl font-bold text-center mb-6 text-primary">
        Become A Rider
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid md:grid-cols-2 gap-6"
      >
        {/* Name (readonly) */}
        <div>
          <label className="label">
            <span className="label-text text-white">Full Name</span>
          </label>
          <input
            type="text"
            defaultValue={user?.displayName || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100 placeholder-black"
            placeholder="Your full name"
          />
        </div>

        {/* Email (readonly) */}
        <div>
          <label className="label">
            <span className="label-text text-white">Email Address</span>
          </label>
          <input
            type="email"
            defaultValue={user?.email || ""}
            readOnly
            className="input input-bordered w-full bg-gray-100 placeholder-black"
            placeholder="Your email"
          />
        </div>

        {/* Age */}
        <div>
          <label className="label">
            <span className="label-text text-white">Age</span>
          </label>
          <input
            type="number"
            {...register("age", { required: true, min: 18 })}
            placeholder="Enter your age"
            className="input input-bordered w-full placeholder-black"
          />
          {errors.age && (
            <p className="text-red-500 text-sm mt-1">Minimum age 18 required</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="label">
            <span className="label-text text-white">Phone Number</span>
          </label>
          <input
            type="tel"
            {...register("phone", { required: true })}
            placeholder="e.g. 01XXXXXXXXX"
            className="input input-bordered w-full placeholder-black"
          />
        </div>

        {/* Region */}
        <div>
          <label className="label">
            <span className="label-text text-white">Region</span>
          </label>
          <select
            {...register("region", { required: true })}
            className="select select-bordered w-full placeholder-black"
          >
            <option value="">Select Region</option>
            {regions.map((region, idx) => (
              <option key={idx} value={region}>
                {region}
              </option>
            ))}
          </select>
          {errors.region && (
            <p className="text-red-500 text-sm mt-1">Region is required</p>
          )}
        </div>

        {/* District */}
        <div>
          <label className="label">
            <span className="label-text text-white">District</span>
          </label>
          <select
            {...register("district", { required: true })}
            className="select select-bordered w-full placeholder-black"
            disabled={!watchRegion}
          >
            <option value="">Select District</option>
            {districts.map((district, idx) => (
              <option key={idx} value={district}>
                {district}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="text-red-500 text-sm mt-1">District is required</p>
          )}
        </div>

        {/* National ID */}
        <div>
          <label className="label">
            <span className="label-text text-white">National ID</span>
          </label>
          <input
            type="text"
            {...register("nid", { required: true })}
            placeholder="Enter your NID"
            className="input input-bordered w-full placeholder-black"
          />
          {errors.nid && (
            <p className="text-red-500 text-sm mt-1">National ID is required</p>
          )}
        </div>

        {/* Bike Brand */}
        <div>
          <label className="label">
            <span className="label-text text-white">Bike Brand</span>
          </label>
          <input
            type="text"
            {...register("bikeBrand", { required: true })}
            placeholder="e.g. Yamaha, Honda"
            className="input input-bordered w-full placeholder-black"
          />
          {errors.bikeBrand && (
            <p className="text-red-500 text-sm mt-1">Bike brand is required</p>
          )}
        </div>

        {/* Bike Number */}
        <div>
          <label className="label">
            <span className="label-text text-white">Bike Number</span>
          </label>
          <input
            type="text"
            {...register("bikeNumber", { required: true })}
            placeholder="e.g. DHAKA-METRO-XY-1234"
            className="input input-bordered w-full placeholder-black"
          />
          {errors.bikeNumber && (
            <p className="text-red-500 text-sm mt-1">Bike number is required</p>
          )}
        </div>

        {/* Additional Info */}
        <div className="md:col-span-2">
          <label className="label">
            <span className="label-text text-white">
              Additional Info (optional)
            </span>
          </label>
          <textarea
            {...register("additionalInfo")}
            placeholder="Write any additional info..."
            className="textarea textarea-bordered w-full placeholder-black"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="md:col-span-2">
          <button type="submit" className="btn text-black btn-primary w-full">
            Submit Rider Application
          </button>
        </div>
      </form>
    </div>
  );
};

export default BeARider;
