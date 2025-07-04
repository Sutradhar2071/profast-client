import React from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

const PendingRider = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  // ✅ Fetch pending riders
  const {
    data: pendingRiders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["pendingRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders?status=pending");
      return res.data;
    },
  });

  // ✅ Mutation for status update (approve/reject)
  const mutation = useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await axiosSecure.patch(`/riders/${id}`, { status });
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["pendingRiders"] });
      Swal.fire({
        icon: "success",
        title: `Rider ${
          variables.status === "approved" ? "Approved" : "Rejected"
        } Successfully`,
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Something went wrong!",
      });
    },
  });

  // ✅ Handle approve/reject with confirmation
  const handleStatusUpdate = async (id, newStatus) => {
    const result = await Swal.fire({
      title: `Are you sure?`,
      text: `Do you want to ${newStatus} this rider?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: newStatus === "approved" ? "#16a34a" : "#dc2626",
      cancelButtonColor: "#6b7280",
      confirmButtonText: `Yes, ${
        newStatus === "approved" ? "Approve" : "Reject"
      }`,
    });

    if (result.isConfirmed) {
      mutation.mutate({ id, status: newStatus });
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-primary mb-4 text-center">
        Pending Riders ({pendingRiders.length})
      </h2>

      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : isError ? (
        <p className="text-center text-red-500">Failed to load riders.</p>
      ) : pendingRiders.length === 0 ? (
        <p className="text-center text-gray-500">No pending riders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead className="bg-primary text-white">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Region</th>
                <th>District</th>
                <th>Bike</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingRiders.map((rider, index) => (
                <tr key={rider._id}>
                  <td>{index + 1}</td>
                  <td>{rider.name}</td>
                  <td>{rider.email}</td>
                  <td>{rider.phone}</td>
                  <td>{rider.region}</td>
                  <td>{rider.district}</td>
                  <td>
                    {rider.bikeBrand} <br /> {rider.bikeNumber}
                  </td>
                  <td className="flex gap-2">
                    <button
                      onClick={() => handleStatusUpdate(rider._id, "approved")}
                      className="btn btn-sm btn-success"
                      disabled={mutation.isPending}
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(rider._id, "rejected")}
                      className="btn btn-sm btn-error"
                      disabled={mutation.isPending}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default PendingRider;
