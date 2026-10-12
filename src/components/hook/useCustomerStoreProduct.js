import {useState} from "react";
import {api} from "../../config/app.js";
import toast from "react-hot-toast";
import {refetchCustomerStore} from "./useCustomerStore.js";

export const useCustomerStoreProduct = () => {
    const [loading, setLoading] = useState(false)
    const sale = async (data) => {
        setLoading(true)
        try {
            const res = await api.post('/customerstore', data)
            toast.success(res?.data?.message || 'Added to cart successfully!')
            refetchCustomerStore(data?.customer)
            return res.data
        } catch (e) {
            const msg = e.response?.data?.error || e.response?.data?.message || e?.message || 'server is error!'
            toast.error(msg)
        } finally {
            setLoading(false)
        }
    }
    return {
        sale,
        loading
    }
}
