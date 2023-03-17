const API_URL = "http://127.0.0.1:5000";

export const getPublication = async (publicationId: String, authKey: String) => {
    const key = "Bearer " + authKey;
    const response = await fetch(`${API_URL}/publications/${publicationId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": key,
        },
    });
    return response;
};

export const ratePublication = async (publicationId: String, rating: boolean, authKey: String) => {
    const key = "Bearer " + authKey;
    const response = await fetch(`${API_URL}/publications/${publicationId}/like`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": key,
        },
        body: JSON.stringify({ "rating": rating }),
    });
    return response;
};

export const updateRatingPublication = async (publicationId: String, rating: boolean, authKey: String) => {
    const key = "Bearer " + authKey;
    const response = await fetch(`${API_URL}/publications/${publicationId}/like`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": key,
        },
        body: JSON.stringify({ "rating": rating }),
    });
    return response;
};

export const deleteRatingPublication = async (publicationId: String, authKey: String) => {
    const key = "Bearer " + authKey;
    const response = await fetch(`${API_URL}/publications/${publicationId}/like`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": key,
        },
    });
    return response;
};