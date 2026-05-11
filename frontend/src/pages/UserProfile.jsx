import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaCalendar, FaWallet, FaEdit, FaTimes } from "react-icons/fa";
import { userAPI } from "../api/api";
import Layout from "../components/Layout";

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: "", password: "", confirmPassword: "" });
  const [updating, setUpdating] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState("");

  const fetchProfile = async () => {
    try {
      setError("");
      setLoading(true);
      const response = await userAPI.getProfile();
      setProfile(response.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const openEditModal = () => {
    if (profile) {
      setEditFormData({ name: profile.name, password: "", confirmPassword: "" });
      setEditError("");
      setEditSuccess("");
      setModalOpen(true);
    }
  };

  const closeEditModal = () => {
    setModalOpen(false);
    setEditFormData({ name: "", password: "", confirmPassword: "" });
    setEditError("");
    setEditSuccess("");
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({ ...editFormData, [name]: value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError("");
    setEditSuccess("");

    // Validation
    if (!editFormData.name.trim()) {
      setEditError("Name cannot be empty");
      return;
    }

    if (editFormData.password && editFormData.password.length < 8) {
      setEditError("Password must be at least 8 characters long");
      return;
    }

    if (editFormData.password !== editFormData.confirmPassword) {
      setEditError("Passwords do not match");
      return;
    }

    setUpdating(true);
    try {
      const updateData = { name: editFormData.name };
      if (editFormData.password) {
        updateData.password = editFormData.password;
      }

      await userAPI.updateProfile(updateData);
      setEditSuccess("Profile updated successfully!");
      
      // Refresh profile data
      await fetchProfile();
      
      setTimeout(() => {
        closeEditModal();
      }, 1500);
    } catch (err) {
      console.error("Error updating profile:", err);
      const errorMsg = err.response?.data?.message || err.message || "Failed to update profile";
      setEditError(errorMsg);
    } finally {
      setUpdating(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-UG", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Layout
      title="Profile"
      subtitle="Manage your account information"
    >
      <div className="flex items-center justify-center p-4 sm:p-6 overflow-auto">
        <div className="w-full max-w-2xl">
          {/* -------- LOADING STATE -------- */}
          {loading && (
            <div className="flex items-center justify-center h-96">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
                <p className="mt-4 text-gray-600">Loading profile...</p>
              </div>
            </div>
          )}

          {/* -------- ERROR STATE -------- */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg p-4 mb-6 flex items-center gap-3">
              <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-red-800 dark:text-red-300 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* -------- PROFILE CONTENT -------- */}
          {!loading && profile && (
            <div className="space-y-6">
              {/* Main Profile Card */}
              <div className="bg-white dark:bg-[#0B1120] border border-transparent dark:border-gray-800 rounded-lg shadow-sm overflow-hidden">
                {/* Header with avatar background */}
                <div className="h-24 sm:h-32 bg-gradient-to-r from-emerald-500 to-emerald-600"></div>

                {/* Profile Info */}
                <div className="relative px-4 sm:px-6 pb-6">
                  {/* Avatar and Name */}
                  <div className="flex flex-col sm:flex-row sm:items-end sm:gap-4 mb-6 -mt-12 sm:-mt-16">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg bg-emerald-100 dark:bg-emerald-900 flex items-center justify-center border-4 border-white dark:border-[#0B1120] shadow-md flex-shrink-0 mx-auto sm:mx-0">
                      <FaUser className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600" />
                    </div>
                    <div className="text-center sm:text-left pb-0 sm:pb-2">
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-gray-100">{profile.name}</h2>
                      <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">Account Owner</p>
                    </div>
                  </div>

                  {/* Info Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 sm:mt-8">
                    {/* Email */}
                    <div className="bg-gray-50 dark:bg-[#0A0F1C] border border-transparent dark:border-gray-800 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FaEnvelope className="text-emerald-600 w-4 h-4 flex-shrink-0" />
                        <label className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">Email Address</label>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200 text-sm sm:text-lg break-all">{profile.email}</p>
                    </div>

                    {/* Member Since */}
                    <div className="bg-gray-50 dark:bg-[#0A0F1C] border border-transparent dark:border-gray-800 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FaCalendar className="text-emerald-600 w-4 h-4 flex-shrink-0" />
                        <label className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">Member Since</label>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200 text-sm sm:text-lg">{formatDate(profile.createdAt)}</p>
                    </div>

                    {/* Total Budgets */}
                    <div className="bg-gray-50 dark:bg-[#0A0F1C] border border-transparent dark:border-gray-800 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FaWallet className="text-emerald-600 w-4 h-4 flex-shrink-0" />
                        <label className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">Active Budgets</label>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200 text-sm sm:text-lg font-semibold">{profile.totalBudgets}</p>
                    </div>

                    {/* Account Status */}
                    <div className="bg-gray-50 dark:bg-[#0A0F1C] border border-transparent dark:border-gray-800 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <svg className="text-emerald-600 w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <label className="text-xs sm:text-sm font-semibold text-gray-600 dark:text-gray-400">Account Status</label>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200 text-sm sm:text-lg">
                        <span className="inline-block px-3 py-1 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 rounded-full text-xs sm:text-sm font-semibold">
                          Active
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div>
                <button
                  onClick={openEditModal}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg transition flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <FaEdit className="w-4 h-4" />
                  Edit Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* -------- EDIT MODAL -------- */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-[#0B1120] rounded-lg shadow-xl border border-transparent dark:border-gray-800 max-w-md w-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">Edit Profile</h2>
              <button
                onClick={closeEditModal}
                className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <FaTimes className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {/* Error Message */}
              {editError && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg p-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-red-800 dark:text-red-300 text-sm">{editError}</p>
                </div>
              )}

              {/* Success Message */}
              {editSuccess && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900/50 rounded-lg p-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-green-800 dark:text-green-300 text-sm">{editSuccess}</p>
                </div>
              )}

              {/* Name Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={editFormData.name}
                  onChange={handleEditInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-transparent text-gray-800 dark:text-gray-100"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">New Password (Optional)</label>
                <input
                  type="password"
                  name="password"
                  value={editFormData.password}
                  onChange={handleEditInputChange}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-transparent text-gray-800 dark:text-gray-100"
                  placeholder="Leave empty to keep current password"
                />
              </div>

              {/* Confirm Password Input */}
              {editFormData.password && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Confirm Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={editFormData.confirmPassword}
                    onChange={handleEditInputChange}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-transparent text-gray-800 dark:text-gray-100"
                    placeholder="Confirm your new password"
                  />
                </div>
              )}
            </form>

            {/* Modal Footer */}
            <div className="flex gap-3 px-6 py-4 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={closeEditModal}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSubmit}
                disabled={updating}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                {updating ? (
                  <>
                    <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}