import React from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { format } from "date-fns";
import districtData from "../../assets/warehouses.json";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

// 🔐 Tracking ID generator
const generateTrackingId = () => {
  return (
    "TRK" +
    Date.now().toString().slice(-8) +
    Math.floor(100 + Math.random() * 900)
  );
};

const AddParcelPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();

  const type = watch("type");
  const weight = watch("weight");
  const senderRegion = watch("senderRegion");
  const receiverRegion = watch("receiverRegion");

  const getCoveredAreas = (region) => {
    const match = districtData.find((d) => d.region === region);
    return match ? match.covered_area : [];
  };

  const isWithinCity = () =>
    senderRegion && receiverRegion && senderRegion === receiverRegion;

  const calculateCost = (type, weight, isSameCity) => {
    let base = 0,
      extraWeightCharge = 0,
      extraCityCharge = 0;

    if (type === "document") {
      base = isSameCity ? 60 : 80;
    } else {
      const w = parseFloat(weight) || 0;
      base = isSameCity ? 110 : 150;
      if (w > 3) {
        extraWeightCharge = Math.ceil(w - 3) * 40;
        if (!isSameCity) extraCityCharge = 40;
      }
    }

    const total = base + extraWeightCharge + extraCityCharge;
    return { base, extraWeightCharge, extraCityCharge, total };
  };

  const onSubmit = async (data) => {
    const sameCity = isWithinCity();
    const costDetails = calculateCost(data.type, data.weight, sameCity);

    const { value: paymentMethod } = await Swal.fire({
      title: "Delivery Cost Breakdown",
      html: `
        <table style="width:100%; text-align:left; margin-bottom:10px">
          <tr><td><strong>Base Price:</strong></td><td>৳${costDetails.base}</td></tr>
          <tr><td><strong>Extra Weight:</strong></td><td>৳${costDetails.extraWeightCharge}</td></tr>
          <tr><td><strong>Out of City:</strong></td><td>৳${costDetails.extraCityCharge}</td></tr>
          <tr><td><strong>Total:</strong></td><td><strong>৳${costDetails.total}</strong></td></tr>
        </table>
        <strong>Select Payment Method:</strong><br/>
        <select id="swal-payment-method" class="swal2-select">
          <option value="cash-on-delivery">Cash on Delivery</option>
          <option value="bkash">bKash</option>
          <option value="nagad">Nagad</option>
          <option value="rocket">Rocket</option>
        </select>
      `,
      showCancelButton: true,
      preConfirm: () => document.getElementById("swal-payment-method").value,
    });

    if (paymentMethod) {
      const parcelData = {
        ...data,
        cost: costDetails.total, // ✅ মোট খরচ
        costBreakdown: costDetails, // ✅ খরচের ব্রেকডাউন (base, extra)
        paymentMethod, // ✅ কাস্টমার কোন মেথডে পেমেন্ট করবে
        trackingId: generateTrackingId(), // ✅ ট্র্যাকিং আইডি
        status: "pending", // ✅ initial status
        creation_date: new Date().toISOString(), // ✅ ISO format
        createdBy: user?.email || "guest", // ✅ ইউজার ইনফো (যদি থাকে)
      };

      // ✅ TODO: Send to backend
      console.log("📦 Parcel Data:", parcelData);

      axiosSecure.post("/parcels", parcelData).then((res) => {
        console.log(res.data);
        if (res.data.insertedId) {
          Swal.fire(
            "Success!",
            `Your parcel has been submitted.\nTracking ID: ${parcelData.trackingId}`,
            "success"
          );
        }
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-2">Add Parcel</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Parcel Info */}
        <section>
          <h3 className="text-lg font-semibold mb-2">Parcel Info</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label>Type</label>
              <select
                {...register("type", { required: true })}
                className="input input-bordered w-full"
              >
                <option value="">Select Type</option>
                <option value="document">Document</option>
                <option value="non-document">Non-Document</option>
              </select>
            </div>
            <div>
              <label>Title</label>
              <input
                {...register("title", { required: true })}
                className="input input-bordered w-full"
              />
            </div>
            {type === "non-document" && (
              <div>
                <label>Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  {...register("weight", { required: true, min: 0.1 })}
                  className="input input-bordered w-full"
                />
              </div>
            )}
          </div>
        </section>

        {/* Sender Info */}
        <section className="bg-gray-50 p-4 rounded-md shadow-sm">
          <h3 className="text-lg font-semibold mb-4 border-b pb-1">
            Sender Info
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              {...register("senderName", { required: true })}
              defaultValue={user?.email}
              placeholder="Sender Name"
              className="input input-bordered w-full"
            />
            <input
              {...register("senderContact", { required: true })}
              placeholder="Sender Contact"
              className="input input-bordered w-full"
            />
            <select
              {...register("senderRegion", { required: true })}
              className="input input-bordered w-full"
            >
              <option value="">Select Region</option>
              {districtData.map((d, i) => (
                <option key={i} value={d.region}>
                  {d.region}
                </option>
              ))}
            </select>
            <select
              {...register("senderServiceCenter", { required: true })}
              className="input input-bordered w-full"
            >
              <option value="">Select Service Center</option>
              {getCoveredAreas(senderRegion).map((area, i) => (
                <option key={i} value={area}>
                  {area}
                </option>
              ))}
            </select>
            <input
              {...register("senderAddress", { required: true })}
              placeholder="Sender Address"
              className="input input-bordered w-full md:col-span-2"
            />
            <textarea
              {...register("pickupInstruction", { required: true })}
              placeholder="Pickup Instruction"
              className="textarea textarea-bordered w-full md:col-span-2"
              rows={2}
            />
          </div>
        </section>

        {/* Receiver Info */}
        <section className="bg-gray-50 p-4 rounded-md shadow-sm">
          <h3 className="text-lg font-semibold mb-4 border-b pb-1">
            Receiver Info
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              {...register("receiverName", { required: true })}
              placeholder="Receiver Name"
              className="input input-bordered w-full"
            />
            <input
              {...register("receiverContact", { required: true })}
              placeholder="Receiver Contact"
              className="input input-bordered w-full"
            />
            <select
              {...register("receiverRegion", { required: true })}
              className="input input-bordered w-full"
            >
              <option value="">Select Region</option>
              {districtData.map((d, i) => (
                <option key={i} value={d.region}>
                  {d.region}
                </option>
              ))}
            </select>
            <select
              {...register("receiverServiceCenter", { required: true })}
              className="input input-bordered w-full"
            >
              <option value="">Select Service Center</option>
              {getCoveredAreas(receiverRegion).map((area, i) => (
                <option key={i} value={area}>
                  {area}
                </option>
              ))}
            </select>
            <input
              {...register("receiverAddress", { required: true })}
              placeholder="Receiver Address"
              className="input input-bordered w-full md:col-span-2"
            />
            <textarea
              {...register("deliveryInstruction", { required: true })}
              placeholder="Delivery Instruction"
              className="textarea textarea-bordered w-full md:col-span-2"
              rows={2}
            />
          </div>
        </section>

        <div className="text-center">
          <button type="submit" className="btn btn-primary text-black px-8">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddParcelPage;
