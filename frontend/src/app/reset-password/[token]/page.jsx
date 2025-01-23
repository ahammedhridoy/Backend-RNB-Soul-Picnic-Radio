import ResetPasswordForm from "@/components/ResetPasswordForm";
import React from "react";

export const metadata = {
  title: "Reset Password",
  description: "",
};

const ResetPassword = () => {
  return (
    <div className="container flex items-center justify-center min-h-screen mx-auto">
      <ResetPasswordForm />
    </div>
  );
};

export default ResetPassword;
