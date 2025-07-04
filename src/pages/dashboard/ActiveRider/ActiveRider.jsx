import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ActiveRider = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Fetch active riders
  const {
    data: activeRiders = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["activeRiders"],
    queryFn: async () => {
      const res = await axiosSecure.get("/riders?status=approved");
      return res.data;
    },
  });

  // ✅ Mutation to deactivate rider
  const mutation = useMutation({
    mutationFn: async (id) => {
      const res = await axiosSecure.patch(`/riders/${id}`, {
        status: "deactivated",
      });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["activeRiders"] });
      Swal.fire({
        icon: "success",
        title: "Rider Deactivated",
        timer: 2000,
        showConfirmButton: false,
      });
    },
    onError: () => {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to deactivate rider!",
      });
    },
  });

  // ✅ Deactivate handler with confirmation
  const handleDeactivate = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to deactivate this rider?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, Deactivate",
    }).then((result) => {
      if (result.isConfirmed) {
        mutation.mutate(id);
      }
    });
  };

  // ✅ Search filter
  const filteredRiders = activeRiders.filter((rider) =>
    rider.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-primary mb-4 text-center">
        Active Riders ({filteredRiders.length})
      </h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name..."
          className="input input-bordered w-full md:w-96"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {isLoading ? (
        <p className="text-center">Loading...</p>
      ) : isError ? (
        <p className="text-red-500 text-center">Failed to load data.</p>
      ) : filteredRiders.length === 0 ? (
        <p className="text-gray-500 text-center">No active riders found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="table w-full table-zebra">
            <thead className="bg-green-600 text-white">
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
              {filteredRiders.map((rider, index) => (
                <tr key={rider._id}>
                  <td>{index + 1}</td>
                  <td>{rider.name}</td>
                  <td>{rider.email}</td>
                  <td>{rider.phone}</td>
                  <td>{rider.region}</td>
                  <td>{rider.district}</td>
                  <td>
                    {rider.bikeBrand} <br />
                    {rider.bikeNumber}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-error"
                      onClick={() => handleDeactivate(rider._id)}
                      disabled={mutation.isPending}
                    >
                      Deactivate
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

export default ActiveRider;
