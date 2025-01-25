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
  const [events, setEvents] = useState([]);

  useEffect(() => {
    setLoading(true);

    const accessTokenFromCookie = JSON.parse(
      localStorage.getItem("accessToken")
    );
    const userFromCookie = JSON.parse(localStorage.getItem("user"));

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
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
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

  // Get All Events
  const fetchEvents = async (e) => {
    setLoading(true);
    try {
      const res = await apiClient.get("/api/v1/event/all");
      if (res?.status === 200) {
        setEvents(res?.data?.events);
      }
    } catch (error) {
      console.error("Error getting Events:", error);
      toast.error(error.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  // Delete Event
  const deleteEvent = async (eventId, accessToken) => {
    try {
      const response = await apiClient.delete(`/api/v1/event/${eventId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        toast.success("Event deleted successfully");
        fetchEvents();
        return true;
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast.error(error.response?.data?.message || "Server error");
      return false;
    }
  };

  // Update blog
  const updateEvent = async (eventId, formData) => {
    try {
      const response = await apiClient.patch(
        `/api/v1/event/${eventId}`,
        formData,
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        toast.success("Event updated successfully");
        fetchEvents();
        return true;
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error(error.response?.data?.message || "Server error");
      return false;
    }
  };

  // Fetching
  useEffect(() => {
    fetchUsers();
    fetchEvents();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        loading,
        accessToken,
        setCurrentUser,
        currentUser,
        accessToken,
        events,
        updateEvent,
        deleteEvent,
        userLogout,
        updateUser,
        fetchUsers,
        fetchSingleUser,
        updateUserAccount,
        deleteUser,
        fetchEvents,
        users,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};
