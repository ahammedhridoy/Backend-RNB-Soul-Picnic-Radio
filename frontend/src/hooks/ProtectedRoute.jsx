"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Next.js navigation hook
import Cookies from "js-cookie";
import LoadingSpinner from "@/components/LoadingSpinner";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    const user = Cookies.get("user");

    if (!user || !accessToken) {
      setTimeout(() => {
        router.push("/");
      }, 1000);
      return;
    }

    setLoading(false);
  }, [router]);

  if (loading) return <LoadingSpinner />;

  return <>{children}</>;
};

export default ProtectedRoute;
