import { useQuery } from "@tanstack/react-query";
import React from "react";
import useAuth from "../../../hooks/useAuth";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { FaTrashAlt, FaMoneyBillWave, FaEye } from "react-icons/fa";
import { format } from "date-fns";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const MyParcels = () => {
  const { user } = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate(); // for view details

  const { data: parcels = [], refetch } = useQuery({
  queryKey: ["my-parcels", user?.email],
  enabled: !!user?.email, // ✅ user.email defined থাকলেই query চলবে
  queryFn: async () => {
    const res = await axiosSecure.get(`/parcels?email=${user.email}`);
    return res.data;
  },
});


  const handleDelete = async (id) => {
    console.log(id)
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      await axiosSecure.delete(`/parcels/${id}`);
      Swal.fire("Deleted!", "Parcel has been deleted.", "success");
      refetch();
    }
  };

  const handlePay = (parcel) => {
    console.log(parcel)
    Swal.fire("Payment", `You clicked pay for ${parcel}`,"info");
    navigate(`/dashboard/payment/${parcel}`)
  };

  const handleView = (id) => {
    navigate(`/dashboard/parcel/${id}`); // route to parcel details page
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">📦 My Parcels ({parcels.length})</h2>

      <div className="overflow-x-auto">
        <table className="table table-zebra w-full">
          <thead className="bg-base-200">
            <tr>
              <th>#</th>
              <th>Title</th>
              <th>Type</th>
              <th>Created At</th>
              <th>Cost</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {parcels.map((parcel, index) => (
              <tr key={parcel._id}>
                <td>{index + 1}</td>
                <td>{parcel.title || "Untitled"}</td>
                <td className="capitalize">{parcel.type}</td>
                <td>{format(new Date(parcel.creation_date), "PPPp")}</td>
                <td>৳ {parcel.cost}</td>
                <td>
                  <span
                    className={`badge px-3 py-1 text-white ${
                      parcel.status === "paid" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {parcel.status}
                  </span>
                </td>
                <td className="flex flex-wrap gap-2">
                  <button
                    className="btn btn-xs btn-info flex items-center gap-1"
                    onClick={() => handleView(parcel._idz)}
                  >
                    <FaEye /> View
                  </button>
                  <button
                    className="btn btn-xs btn-success flex items-center gap-1"
                    onClick={() => handlePay(parcel._id)}
                    disabled={parcel.status === "paid"}
                  >
                    <FaMoneyBillWave /> Pay
                  </button>
                  <button
                    className="btn btn-xs btn-error flex items-center gap-1"
                    onClick={() => handleDelete(parcel._id)}
                  >
                    <FaTrashAlt /> Delete
                  </button>
                </td>
              </tr>
            ))}
            {parcels.length === 0 && (
              <tr>
                <td colSpan="7" className="text-center text-gray-500 py-6">
                  No parcels found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyParcels;
