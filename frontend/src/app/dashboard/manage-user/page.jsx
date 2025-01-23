import AddUser from "@/components/AddUser";
import AllUser from "@/components/AllUser";
import LoadMoreBtn from "@/components/LoadMoreBtn";
import React from "react";

const ManageUser = () => {
  return (
    <div>
      <div className="p-2">
        {/* Add User */}
        <AddUser />
        {/* All Users */}
        <AllUser />
        {/* Load More */}
        <div className="flex justify-center mt-5">
          <LoadMoreBtn />
        </div>
      </div>
    </div>
  );
};

export default ManageUser;
