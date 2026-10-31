import { baseUrl } from '@/baseUrl';
import axios from 'axios';
import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
const data1 = {
  "File No": "",
  "Record No": "",
  "Invoice date": "",
  "Device Name": "",
  "agency name": "",
  // "agent no": "",
  // "balance": "",
  // "city": "",
  // "company name": "",
  // "cust name": "",
  // "email": "",
  // "invoice no": "",
  // "monthly cost": "",
  // "phone No": "",
  // "phone cost": "",
  // "price plans": "",
  // "remark": "",
  // "state": "",
}



const FileTable = ({ urlParams, id, admin, level, itemsPerPage = 10, jumbleUpReports = false, duplicateReports = false }) => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReports: 0,
    hasNextPage: false,
    hasPrevPage: false,
    limit: itemsPerPage
  });

  // Simple cache to avoid refetching same data
  const [cache, setCache] = useState(new Map());

  // Utility function to duplicate an array
// Utility function to duplicate each item next to its original
    const duplicateArray = (array) => {
        if (!array || array.length === 0) {
            console.warn('⚠️ duplicateArray called with empty or invalid array');
            return [];
        }

        const duplicated = [];

        // For each item, push the item and its duplicate together
        array.forEach(item => {
            duplicated.push(item);           // Original
            duplicated.push({ ...item });    // Duplicate (new object)
        });

        console.log('Original array length:', array.length);
        console.log('Duplicated array length:', duplicated.length);
        console.log('First 3 original:', array.slice(0, 3).map(item => item._id || item.id || 'no-id'));
        console.log('First 6 duplicated (pairs):', duplicated.slice(0, 6).map(item => item._id || item.id || 'no-id'));

        return duplicated;
    };


  // Utility function to shuffle/jumble an array
  const shuffleArray = (array) => {
    if (!array || array.length <= 1) {
      return array || [];
    }
    
    const shuffled = [...array]; // Create a copy to avoid mutating original
    
    // Fisher-Yates shuffle algorithm
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      // Swap elements
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    console.log('Original array length:', array.length);
    console.log('Shuffled array length:', shuffled.length);
    console.log('First 3 original:', array.slice(0, 3).map(item => item._id || item.id || 'no-id'));
    console.log('First 3 shuffled:', shuffled.slice(0, 3).map(item => item._id || item.id || 'no-id'));
    
    return shuffled;
  };

  const getReports = async (page = currentPage, search = searchQuery) => {
    // Create cache key (include jumbleUpReports to cache jumbled and non-jumbled data separately)
    const cacheKey = `${urlParams}-${id}-${page}-${search}-${jumbleUpReports}`;
    
    // Check cache first
    if (cache.has(cacheKey)) {
      const cachedData = cache.get(cacheKey);
      setData(cachedData.reports);
      setPagination(cachedData.pagination);
      return;
    }


    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        ...(search && { search: search })
      });

      const url = `${baseUrl}api/v1/user/${urlParams}/${id}?${params}`;
      const res = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      
      console.log(res);
      
      let responseData, responsePagination;
      
      // Handle both old and new API response formats
      if (res?.data?.data?.reports && res?.data?.data?.pagination) {
        // New paginated format
        responseData = res.data.data.reports;
        responsePagination = res.data.data.pagination;
      } else if (Array.isArray(res?.data?.data)) {
        // Old format - fallback (array of reports)
        responseData = res.data.data;
        responsePagination = {
          currentPage: 1,
          totalPages: 1,
          totalReports: res.data.data.length,
          hasNextPage: false,
          hasPrevPage: false,
          limit: itemsPerPage
        };
      } else {
        // Empty or error response
        responseData = [];
        responsePagination = {
          currentPage: 1,
          totalPages: 1,
          totalReports: 0,
          hasNextPage: false,
          hasPrevPage: false,
          limit: itemsPerPage
        };
      }
      
      // Apply jumbling if enabled
      console.log('jumbleUpReports prop:', jumbleUpReports);
      console.log('responseData length:', responseData.length);
      const jumbledData = jumbleUpReports ? shuffleArray(responseData) : responseData;
      //apply duplicate reports if enabled
      const finalData = duplicateReports ? duplicateArray(jumbledData) : jumbledData;
      console.log('finalData length:', finalData.length);
      
      // Cache the response
      setCache(prev => {
        const newCache = new Map(prev);
        newCache.set(cacheKey, {
          reports: finalData,
          pagination: responsePagination
        });
        return newCache;
      });
      
      setData(finalData);
      setPagination(responsePagination);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setData([]);
    } finally {
      setLoading(false);
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
          getReports(1, value); // Fetch with new search term
        }, 500); // 500ms delay
      };
    })(),
    []
  );

  // Handle search input change
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  useEffect(() => {
    getReports();
  }, []);

  // Refetch data when jumbleUpReports changes
  useEffect(() => {
    if (jumbleUpReports !== undefined) {
      // Clear cache when jumbleUpReports changes to ensure fresh data
      setCache(new Map());
      getReports();
    }
  }, [jumbleUpReports]);

  const handleDelete = async (value) => {
    const confirmation = confirm("Are you sure?");
    if (!confirmation) return;

    try {
      const url = `${baseUrl}api/v1/user/delete-reports/${value._id}`;
      await axios.delete(url, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      // Optimistically remove from current list
      setData((prev) => prev.filter((item) => item._id !== value._id));

      // Update pagination counts locally
      setPagination((prev) => ({
        ...prev,
        totalReports: Math.max(0, (prev.totalReports || 0) - 1),
      }));

      // Invalidate cache to avoid stale pages
      setCache(new Map());

      // If current page becomes empty and there is a previous page, go back a page
      setTimeout(() => {
        if (data.length - 1 === 0 && pagination.hasPrevPage) {
          const newPage = Math.max(1, (pagination.currentPage || 1) - 1);
          setCurrentPage(newPage);
          getReports(newPage, searchQuery);
        }
      }, 0);

      alert("report deleted successfully");
    } catch (err) {
      console.error("Error during report deletion", err?.response?.data || err?.message);
      alert("Failed to delete report. Please try again.");
    }
  };

  const handleDeleteAll = async () => {
    const confirmation = confirm("Are you sure you want to delete ALL reports for this user? This action cannot be undone.");
    if (!confirmation) return;

    try {
      const url = `${baseUrl}api/v1/user/delete-all-reports/${id}`;
      const res = await axios.delete(url, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      // Clear all data and reset pagination
      setData([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalReports: 0,
        hasNextPage: false,
        hasPrevPage: false,
        limit: itemsPerPage
      });

      // Clear cache
      setCache(new Map());

      alert(res?.data?.message || "All reports deleted successfully");
    } catch (err) {
      console.error("Error during delete all reports", err?.response?.data || err?.message);
      alert("Failed to delete all reports. Please try again.");
    }
  };

  const nextPage = () => {
    if (pagination.hasNextPage) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      getReports(newPage, searchQuery);
    }
  };

  const prevPage = () => {
    if (pagination.hasPrevPage) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      getReports(newPage, searchQuery);
    }
  };

  console.log(data,'workingdata')
  const renderTableData = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
            Loading reports...
          </td>
        </tr>
      );
    }

    if (data.length === 0) {
      return (
        <tr>
          <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
            No reports found
          </td>
        </tr>
      );
    }

    return data.map((value, index) => (
      <tr key={index}>
        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900 cursor-hover" style={{color:'blue'}}>
          <Link
            to={{
              pathname:
                admin === "yes" && level === "medical"
                  ? `/admin-medical-report/${value._id}`
                  : admin === "yes" && level === "telecom"
                    ? `/admin-telecom-report/${value._id}`
                    : admin === "no" && level === "telecom"
                      ? `/user-telecom-report/${value._id}`
                      : `/user-medical-report/${value._id}`,
            }}
          >
            {value["File No"] || "-"}
          </Link>
        </td>
        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900 " >
          {value["Record No"] || "-"}
        </td>
        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
          {value["Entry Date"] || "-"}
        </td>
        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
          {value["Ref No"] || "-"}
        </td>
        <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
          {value["Invoice No"] || "-"}
        </td>
        <button onClick={() => handleDelete(value)} className="px-6 py-2 rounded bg-red-500 text-sm text-white mt-3 text-center">
          Delete
        </button>
      </tr>
    ));
  };

  const renderPagination = () => {
    return (
      <div className="flex justify-center gap-2 items-center mt-4">
        {pagination.totalPages > 0 && (
          <>
            <button
              onClick={prevPage}
              disabled={!pagination.hasPrevPage || loading}
              className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="text-sm text-gray-600">
              Page {pagination.currentPage} of {pagination.totalPages}
              {pagination.totalReports > 0 && (
                <span className="ml-2">({pagination.totalReports} total reports)</span>
              )}
            </div>
            <button
              onClick={nextPage}
              disabled={!pagination.hasNextPage || loading}
              className="px-3 py-1 rounded bg-blue-500 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="overflow-x-auto mb-10">
    
      
      {/* Search input and Delete All button */}
      <div className="mb-4 flex justify-end items-center gap-4 pr-4">
        <div className="relative w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            {/* Search Icon SVG */}
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 104.5 4.5a7.5 7.5 0 0012.15 12.15z" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={e => handleSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition text-gray-700 placeholder-gray-400"
          />
        </div>
        
        {/* Delete All button - only visible to admin */}
        {admin === "yes" && (
          <button
            onClick={handleDeleteAll}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium"
          >
            Delete All Reports
          </button>
        )}
      </div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th
              className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
            >
              File No
            </th>
            <th
              className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
            >
              Record No
            </th>
            <th
              className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
            >
           Entry Dates
              
            </th>
            <th
              className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
            >
             Ref No

            </th>
            <th
              className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
            >
             Invoice No
            </th>
            <th
              className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider"
            >
              Action
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {renderTableData()}
        </tbody>
      </table>
      <div className="mt-4">{renderPagination()}</div>
    </div>
  );
};

export default FileTable;
