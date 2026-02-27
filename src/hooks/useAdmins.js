import { useState, useEffect, useCallback } from 'react';
import axiosClient from '../utils/axiosClient';
import { API_ENDPOINTS } from '../config/api';

export const useAdmins = (filters, page = 1) => {
    const [admins, setAdmins] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        superAdmins: 0,
        admins: 0
    });
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadAdmins = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const payload = {
                search_data: filters.searchTerm || "",
                profile_status: filters.statusFilter === "All Status" ? "" : filters.statusFilter,
                user_type: filters.userTypeFilter === "All Admins" ? "All Admins" : filters.userTypeFilter,
                page: page
            };

            const response = await axiosClient.post(API_ENDPOINTS.ADMIN_LIST, payload);
            console.log('Admin list API response:', response);
            console.log('Admins data:', response.admins);

            if (response) {
                setAdmins(response.admins || []);
                setTotalPages(response.total_pages || 1);
            }
        } catch (err) {
            console.error("Error fetching admins:", err);
            setError(err.response?.data?.message || "Failed to load admins list.");
            setAdmins([]);
        } finally {
            setLoading(false);
        }
    }, [filters.searchTerm, filters.statusFilter, filters.userTypeFilter, page]);

    const loadStats = useCallback(async () => {
        try {
            const response = await axiosClient.post(API_ENDPOINTS.ADMINS, {});
            if (response) {
                setStats({
                    total: response.total_admins || 0,
                    superAdmins: response.no_of_super_admin || 0,
                    admins: response.no_of_admin || 0
                });
            }
        } catch (err) {
            console.error("Error fetching stats:", err);
        }
    }, []);

    useEffect(() => {
        loadAdmins();
        loadStats();
    }, [loadAdmins]);

    const refreshData = () => {
        loadAdmins();
        loadStats();
    };

    return {
        admins,
        stats,
        totalPages,
        loading,
        error,
        refreshData
    };
};
