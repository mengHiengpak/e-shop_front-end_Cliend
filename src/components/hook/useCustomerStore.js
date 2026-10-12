import {useEffect, useSyncExternalStore} from "react";
import {api} from "../../config/app.js";
import toast from "react-hot-toast";

let state = {data: null, isLoading: false, error: null};
let customerId = null;
const listeners = new Set();

const emit = () => {
    listeners.forEach((listener) => listener());
};

const setState = (patch) => {
    state = {...state, ...patch};
    emit();
};

const subscribe = (listener) => {
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
};

const getSnapshot = () => state;

const fetchStore = async (id = customerId) => {
    if (!id) return;
    const isNewCustomer = customerId !== id;
    customerId = id;
    setState({isLoading: true, error: null, ...(isNewCustomer ? {data: null} : {})});
    try {
        const res = await api.get(`/customerstore/customer/${id}`);
        setState({data: res.data});
    } catch (e) {
        const status = e.response?.status;
        if (status === 404 || status === 400) {
            setState({data: null});
        } else {
            const msg = e.response?.data?.message || e.response?.data?.error || e.message || 'server is error!';
            setState({error: msg});
            toast.error(msg);
            console.error(msg);
        }
    } finally {
        setState({isLoading: false});
    }
};

export const refetchCustomerStore = (id) => fetchStore(id || customerId);

export const useCustomerStore = (id) => {
    const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

    useEffect(() => {
        if (id) {
            fetchStore(id);
        } else {
            customerId = null;
            setState({data: null, isLoading: false, error: null});
        }
        // oxlint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return {
        ...snapshot,
        refetch: () => fetchStore(id),
    };
};
