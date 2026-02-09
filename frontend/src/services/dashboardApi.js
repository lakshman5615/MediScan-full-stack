import axiosInstance from "./axios";

export const getExpirySoonCount = async () => {
    const res = await axiosInstance.get("/api/dashboard/expiry-soon");
    return res.data;
};

export const getRecentSearches = async () => {
    const res = await axiosInstance.get("/api/dashboard/recent-search");
    return res.data;
}

export const getLowStockCount = async () => {
    const res = await axiosInstance.get("/api/dashboard/low-stock");
    return res.data;
};