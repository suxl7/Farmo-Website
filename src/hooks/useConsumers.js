import { useState, useEffect, useCallback } from 'react';
import axiosClient from '../utils/axiosClient';
import { API_ENDPOINTS } from '../config/api';

export const useConsumers = (filters, page = 1) => {
    const [consumers, setConsumers] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        verified: 0,
        pending: 0
    });
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const loadConsumers = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const payload = {
                search_data: filters.searchTerm || "",
                profile_status: filters.statusFilter === "All Status" ? "" : filters.statusFilter,
                verification: filters.verifiedFilter === "All Verification" ? "" : filters.verifiedFilter,
                district: filters.districtFilter === "Any District" ? "" : filters.districtFilter,
                user_type: "Consumer",
                page: page
            };

            const response = await axiosClient.post(API_ENDPOINTS.USER_SEARCH, payload);
            console.log('Consumers API response:', response);
            console.log('Total pages:', response.total_pages || response.data?.total_pages);
            console.log('Current page:', page);
            console.log('Consumers count:', (response.users || response.data?.users || response.data || []).length);

            if (response) {
                const consumersList = response.users || response.data?.users || response.data || [];
                setConsumers(consumersList);
                setTotalPages(response.total_pages || response.data?.total_pages || 1);
            }
        } catch (err) {
            console.error("Error fetching consumers:", err);
            setError(err.response?.data?.message || "Failed to load consumers list.");
            setConsumers([]);
        } finally {
            setLoading(false);
        }
    }, [filters.searchTerm, filters.statusFilter, filters.verifiedFilter, filters.districtFilter, page]);

    const loadStats = useCallback(async () => {
        try {
            const response = await axiosClient.post(API_ENDPOINTS.CONSUMERS, {});
            console.log('Consumers stats API response:', response);
            if (response) {
                const statsData = {
                    total: response.total_consumer || 0,
                    active: response.activated_consumer || 0,
                    verified: response.verified_consumer || 0,
                    pending: response.verification_pending_consumer || 0
                };
                setStats(statsData);
            }
        } catch (err) {
            console.error("Error fetching stats:", err);
        }
    }, []);

    useEffect(() => {
        loadConsumers();
        loadStats();
    }, [loadConsumers]);

    const refreshData = () => {
        loadConsumers();
        loadStats();
    };

    return {
        consumers,
        stats,
        totalPages,
        loading,
        error,
        refreshData
    };
};
