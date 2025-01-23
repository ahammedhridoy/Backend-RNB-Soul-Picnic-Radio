"use client";
import { createContext, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Cookies from "js-cookie";
import apiClient from "@/config/axiosConfig";

export const GlobalContext = createContext(null);

export const GlobalContextProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [allImages, setAllImages] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    setLoading(true);

    const accessTokenFromCookie = Cookies.get("accessToken");
    const userFromCookie = Cookies.get("user");

    if (accessTokenFromCookie) {
      setAccessToken(accessTokenFromCookie);
    }

    if (userFromCookie) {
      setUser(JSON.parse(userFromCookie));
    }

    setLoading(false);
  }, []);

  // Fetch Single User
  const fetchSingleUser = async () => {
    setLoading(true);
    if (!user || !user.id) {
      console.error("User or user.id is undefined");
      return;
    }

    try {
      const response = await apiClient.get(`/api/v1/auth/user/${user.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response?.status === 200) {
        setCurrentUser(response.data.user);
      } else {
        console.error("Failed to fetch user:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch All Images
  const fetchAllImages = async () => {
    setLoading(true);
    try {
      const response = await apiClient.get(`api/v1/gallery/all`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response?.status === 200) {
        setAllImages(response?.data?.images);
      }
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch All users
  const fetchUsers = async () => {
    try {
      const response = await apiClient.get("/api/v1/auth/user/all", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        setUsers(response?.data?.users);
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching users");
      return [];
    }
  };

  // Update User
  const updateUser = async (userId, payload) => {
    try {
      const response = await apiClient.patch(
        `/api/v1/auth/user/update/${userId}`,
        payload, // Send JSON payload directly
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        toast.success("User updated successfully");
        fetchSingleUser();
        fetchUsers();
        return true;
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error.response?.data?.message || "Server error");
      return false;
    }
  };

  // Delete User
  const deleteUser = async (userId) => {
    try {
      const response = await apiClient.delete(
        `/api/v1/auth/user/delete/${userId}`,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("User deleted successfully");
        fetchUsers();
        return true;
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(error.response?.data?.message || "Server error");
      return false;
    }
  };

  // Update User Account
  const updateUserAccount = async (userId, payload) => {
    try {
      const response = await apiClient.patch(
        `/api/v1/auth/user/update/${userId}`,
        payload,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        fetchSingleUser();
        return true;
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error.response?.data?.message || "Failed to update user");
      return false;
    }
  };

  // Logout
  const userLogout = async () => {
    setLoading(true);
    try {
      const response = await apiClient.post(`/api/v1/auth/logout`, {
        withCredentials: true,
      });

      if (response?.status === 200) {
        toast.success("Logged out successfully");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        Cookies.remove("accessToken");
        Cookies.remove("user");
        Cookies.remove("accessTokenExp");
        window.location.href = "/";
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred during logout");
    } finally {
      setLoading(false);
    }
  };

  // Fetching
  useEffect(() => {
    fetchUsers();
    fetchAllImages();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        loading,
        accessToken,
        setCurrentUser,
        currentUser,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
