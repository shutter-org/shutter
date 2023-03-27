const API_URL = "https://64220970a99ef00ff477ebd8--chic-klepon-7630da.netlify.app/";

export const searchTag = async (search: String, authKey: String) => {
    const key = "Bearer " + authKey;
    const response = await fetch(`${API_URL}/tags?search=${search}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": key,
        },
    });
    return response;
};