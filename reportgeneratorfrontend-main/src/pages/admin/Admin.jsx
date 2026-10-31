import { baseUrl } from "@/baseUrl";
import Header from "@/components/Header/Header";
import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react"; // or use any other icon library


const Admin = ({ itemsPerPage = 10 }) => {
  const [userUpdates, setUserUpdates] = useState({});
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(() => {
    // Restore current page from sessionStorage if available
    const savedPage = sessionStorage.getItem('adminCurrentPage');
    return savedPage ? parseInt(savedPage, 10) : 1;
  });
  const [searchTerm, setSearchTerm] = useState(() => {
    // Restore search term from sessionStorage if available
    return sessionStorage.getItem('adminSearchTerm') || "";
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalUsers: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: itemsPerPage
  });
  const [loading, setLoading] = useState(false);

  // Save current page to sessionStorage
  const saveCurrentPage = (page) => {
    sessionStorage.setItem('adminCurrentPage', page.toString());
  };

  // Save search term to sessionStorage
  const saveSearchTerm = (term) => {
    sessionStorage.setItem('adminSearchTerm', term);
  };

  const getUsers = async (page = currentPage, search = searchTerm) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        search: search
      });

      const res = await axios.get(`${baseUrl}api/v1/user/get-users?${params}`, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      
      const responseData = res?.data?.data;
      setUsers(responseData?.users || []);
      setPagination(responseData?.pagination || pagination);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (userId, field, value) => {
    setUserUpdates((prev) => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value,
      },
    }));
  };

  const setPasswordAndLevel = async (userId) => {
    const updates = userUpdates[userId] || {};
    const data = {
      userId,
      level: updates.accessLevel,
      accessMessage: updates.accessMessage,
      password: updates.password,
    };

    try {
      const res = await axios.post(
          `${baseUrl}api/v1/user/set-password-level`,
          data,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
      );
      alert(res?.data?.message);
      await getUsers();
      setUserUpdates((prev) => {
        const copy = { ...prev };
        delete copy[userId];
        return copy;
      });
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Error updating user information. Please try again.");
    }
  };

  const handleUserAction = async (endpoint, userId, actionLabel) => {
    try {
      const res = await axios.post(
          `${baseUrl}api/v1/user/${endpoint}`,
          { id: userId },
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
      );
      alert(res?.data?.message);
      getUsers();
    } catch (error) {
      console.error(`${actionLabel} Error:`, error);
    }
  };

  const deleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      const res = await axios.delete(
          `${baseUrl}api/v1/user/delete-a-user/${userId}`,
          {
            headers: { "Content-Type": "application/json" },
            withCredentials: true,
          }
      );
      alert(res?.data?.message);
      getUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (value) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setCurrentPage(1); // Reset to first page when searching
          saveCurrentPage(1); // Save the reset page
          getUsers(1, value); // Fetch with new search term
        }, 500); // 500ms delay
      };
    })(),
    []
  );

  // Handle search input change
  const handleSearchChange = (value) => {
    setSearchTerm(value);
    saveSearchTerm(value);
    debouncedSearch(value);
  };

  const nextPage = () => {
    if (pagination.hasNextPage) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      saveCurrentPage(newPage);
      getUsers(newPage, searchTerm);
    }
  };

  const prevPage = () => {
    if (pagination.hasPrevPage) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      saveCurrentPage(newPage);
      getUsers(newPage, searchTerm);
    }
  };

  const renderTableData = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
            Loading users...
          </td>
        </tr>
      );
    }

    if (users.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
            No users found
          </td>
        </tr>
      );
    }

    return users.map((user, index) => {
      const globalIndex = (currentPage - 1) * itemsPerPage + index + 1;
      return (
        <tr key={user._id} className="border-b hover:bg-gray-100">
          <td className="px-4 text-center py-2">{globalIndex}</td>
          <td className="px-4 text-center py-2">
            <div className="flex items-center justify-center gap-2">
              <Link to={`/report/${user._id}`} className="text-blue-600 hover:underline">
                {user.name}
              </Link>
              {user.isFreezed && (
                <span className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full font-medium">
                  FROZEN
                </span>
              )}
              {user.jumbleUpReports && (
                <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full font-medium">
                  JUMBLED
                </span>
              )}
              {user.duplicateReport && (
                <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full font-medium">
                  DUPLICATE
                </span>
              )}
            </div>
          </td>
          <td className="px-4 py-2">
            <input
                className="w-full px-2 py-1 border rounded"
                type="text"
                value={userUpdates[user._id]?.password ?? user.password}
                onChange={(e) => handleInputChange(user._id, "password", e.target.value)}
            />
          </td>
          <td className="px-4 py-2">
            <select
                className="w-full px-2 py-1 border rounded"
                value={userUpdates[user._id]?.accessLevel ?? user.accessLevel}
                onChange={(e) => handleInputChange(user._id, "accessLevel", e.target.value)}
            >
              <option value="">Select Level</option>
              <option value="telecom">Telecom</option>
              <option value="medical">Medical</option>
            </select>
          </td>
          <td className="px-4 py-2">
            <input
                className="w-full px-2 py-1 border rounded"
                type="text"
                value={userUpdates[user._id]?.accessMessage ?? user.accessMessage}
                onChange={(e) => handleInputChange(user._id, "accessMessage", e.target.value)}
            />
          </td>
          <td className="px-4 py-2">
            <div className="flex flex-col space-y-2">
              <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => setPasswordAndLevel(user._id)}
                    className="px-3 py-1 rounded bg-green-500 text-white whitespace-nowrap"
                >
                  Submit
                </button>
                <button
                    onClick={() => handleUserAction("deny-access", user._id, "DENY ACCESS")}
                    className="px-3 py-1 rounded bg-red-500 text-white whitespace-nowrap"
                >
                  Deny
                </button>
                <button
                    onClick={() => handleUserAction("grant-access", user._id, "GRANT ACCESS")}
                    className="px-3 py-1 rounded bg-blue-500 text-white whitespace-nowrap"
                >
                  Grant
                </button>
                <button
                    onClick={() => handleUserAction("reset-password", user._id, "RESET PASSWORD")}
                    className="px-3 py-1 rounded bg-gray-500 text-white whitespace-nowrap"
                >
                  Reset
                </button>

                <button
                    onClick={() =>{
                      if(!(user?.corrupted)){
                        handleUserAction("set-user-corrupted-status", user._id, "SET CORRUPT STATUS")

                      }else{
                        handleUserAction("set-user-uncorrupted-status", user._id, "SET UNCORRUPT STATUS")

                      }

                    }
                    }
                    className={`px-3 py-1 rounded text-white whitespace-nowrap ${
                        user?.corrupted ? "bg-red-600" : "bg-green-600"
                    }`}
                >
                  {user?.corrupted ? "Uncorrupt Data" : "Corrupt Data"}
                </button>

                <button
                    onClick={() => handleUserAction("toggle-is-freezed", user._id, "TOGGLE FREEZE")}
                    className={`px-3 py-1 rounded text-white whitespace-nowrap ${
                        user?.isFreezed ? "bg-orange-600" : "bg-blue-600"
                    }`}
                >
                  {user?.isFreezed ? "Unfreeze User" : "Freeze User"}
                </button>

                <button
                    onClick={() => handleUserAction("toggle-jumble-up-reports", user._id, "TOGGLE JUMBLE REPORTS")}
                    className={`px-3 py-1 rounded text-white whitespace-nowrap ${
                        user?.jumbleUpReports ? "bg-purple-600" : "bg-indigo-600"
                    }`}
                >
                  {user?.jumbleUpReports ? "Disable Jumble" : "Enable Jumble"}
                </button>

                <button
                    onClick={() => handleUserAction("toggle-duplicate-report", user._id, "TOGGLE DUPLICATE REPORT")}
                    className={`px-3 py-1 rounded text-white whitespace-nowrap ${
                        user?.duplicateReport ? "bg-yellow-600" : "bg-amber-600"
                    }`}
                >
                  {user?.duplicateReport ? "Disable Duplicate" : "Enable Duplicate"}
                </button>

              </div>
              <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => handleUserAction("deny-report-access", user._id, "DENY REPORT")}
                    className="px-3 py-1 rounded bg-red-500 text-white whitespace-nowrap"
                >
                  Deny Report
                </button>
                <button
                    onClick={() => handleUserAction("grant-report-access", user._id, "GRANT REPORT")}
                    className="px-3 py-1 rounded bg-gray-500 text-white whitespace-nowrap"
                >
                  Grant Report
                </button>
                <button
                    onClick={() => deleteUser(user._id)}
                    className="px-3 py-1 rounded bg-red-600 text-white whitespace-nowrap"
                >
                  Delete
                </button>
              </div>
            </div>
          </td>
        </tr>
      );
    });
  };

  const renderPagination = () => (
      <div className="flex justify-center gap-2 items-center mt-4 mb-5">
        <button
            onClick={prevPage}
            disabled={!pagination.hasPrevPage || loading}
            className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <div className="text-sm text-gray-600">
          Page {pagination.currentPage} of {pagination.totalPages} 
          {pagination.totalUsers > 0 && (
            <span className="ml-2">({pagination.totalUsers} total users)</span>
          )}
        </div>
        <button
            onClick={nextPage}
            disabled={!pagination.hasNextPage || loading}
            className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
  );

  useEffect(() => {
    // Use the restored current page and search term
    getUsers(currentPage, searchTerm);
    
    // Optional: Clean up sessionStorage when component unmounts
    // Uncomment the return statement below if you want to clear the saved state
    // return () => {
    //   sessionStorage.removeItem('adminCurrentPage');
    //   sessionStorage.removeItem('adminSearchTerm');
    // };
  }, []);

  return (
      <>
        <Header />
        <div className="flex items-center px-4 py-2">
          <div className="relative w-full max-w-sm">
    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
      <Search className="w-5 h-5" />
    </span>
            <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
            <tr>
              <th className="px-4 py-2">ID</th>
              <th className="px-4 py-2">Username</th>
              <th className="px-4 py-2">Password</th>
              <th className="px-4 py-2">Access Level</th>
              <th className="px-4 py-2">Access Message</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
            </thead>
            <tbody>{renderTableData()}</tbody>
          </table>
          {renderPagination()}
        </div>
      </>
  );
};

export default Admin;
