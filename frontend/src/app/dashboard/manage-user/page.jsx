import AddUser from "@/components/AddUser";
import AllUser from "@/components/AllUser";
import LoadMoreBtn from "@/components/LoadMoreBtn";
import ProtectedRoute from "@/hooks/ProtectedRoute";
import React from "react";

const ManageUser = () => {
  return (
    <ProtectedRoute>
      <div>
        <div className="p-2">
          {/* Add User */}
          <AddUser />
          {/* All Users */}
          <AllUser />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default ManageUser;
