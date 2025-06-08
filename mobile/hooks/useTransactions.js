import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { API_URL } from '@/constants/api';

/**
 * Custom hook to manage transactions and summary for a user.
 * @param {string} userId
 * @returns {object}
 */
export const useTransactions = (userId) => {
    const [transactions, setTransactions] = useState([]);
    const [summary, setSummary] = useState({ balance: 0, income: 0, expenses: 0 });
    const [isLoading, setIsLoading] = useState(true);

    const fetchTransactions = useCallback(async () => {
        if (!userId) return;
        try {
            const response = await fetch(`${API_URL}/transactions/${userId}`);
            if (!response.ok) throw new Error("Failed to fetch transactions");
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            setTransactions([]);
            console.error("Error fetching transactions:", error);
        }
    }, [userId]);

    const fetchSummary = useCallback(async () => {
        if (!userId) return;
        try {
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`);
            if (!response.ok) throw new Error("Failed to fetch summary");
            const data = await response.json();
            setSummary(data);
        } catch (error) {
            setSummary({ balance: 0, income: 0, expenses: 0 });
            console.error("Error fetching summary:", error);
        }
    }, [userId]);

    const loadData = useCallback(async () => {
        if (!userId) return;
        setIsLoading(true);
        try {
            await Promise.all([fetchTransactions(), fetchSummary()]);
        } catch (error) {
            console.error("Error loading data:", error);
        } finally {
            setIsLoading(false);
        }
    }, [fetchTransactions, fetchSummary, userId]);

    /**
     * Delete a transaction by ID and refresh data.
     * @param {string|number} id
     */
    const deleteTransaction = async (id) => {
        try {
            const response = await fetch(`${API_URL}/transactions/${id}`, { method: "DELETE" });
            if (!response.ok) throw new Error("Failed to delete transaction");
            await loadData();
            Alert.alert("Success", "Transaction deleted successfully");
        } catch (error) {
            console.error("Error deleting transaction", error);
            Alert.alert("Error", error.message);
        }
    };

    return { transactions, summary, isLoading, loadData, deleteTransaction };
};