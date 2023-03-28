const API_URL = "http://127.0.0.1:5000/";

export const getUser = async (username: String, authKey: String) => {
    const key = "Bearer " + authKey;
    const response = await fetch(`${API_URL}/users/${username}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": key,
        },
    });
    return response;
};

export const updateUser = async (username: String, authKey: String, body: {}) => {
    const key = "Bearer " + authKey;
    const response = await fetch(`${API_URL}/users/${username}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": key,
        },
        body: JSON.stringify(body),
    });
    return response;
};

export const deleteUser = async (username: String, authKey: String) => {
    const key = "Bearer " + authKey;
    const response = await fetch(`${API_URL}/users/${username}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": key,
        },
    });
    return response;
};

export const getMoreUserPublications = async (username: String, page: number, authKey: String) => {
    const key = "Bearer " + authKey;
    const response = await fetch(`${API_URL}/users/${username}/publications?page=${page}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": key,
        },
    });
    return response;
};

export const getMoreUserFollows = async (username: String, follows: string, page: number, authKey: String) => {
    const key = "Bearer " + authKey;
    const response = await fetch(`${API_URL}/users/${username}/${follows}?page=${page}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": key,
        },
    });
    return response;
};

export const searchUser = async (search: String, authKey: String) => {
    const key = "Bearer " + authKey;
    const response = await fetch(`${API_URL}/users?search=${search}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": key,
        },
    });
    return response;
}

export const followUser = async (username: String, authKey: String) => {
    const key = "Bearer " + authKey;
    const response = await fetch(`${API_URL}/users/${username}/follow`, {
        method: "POST",

        headers: {
            "Content-Type": "application/json",
            "Authorization": key,
        },
    });
    return response;
}

export const unfollowUser = async (username: String, authKey: String) => {
    const key = "Bearer " + authKey;
    const response = await fetch(`${API_URL}/users/${username}/follow`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": key,
        },
    });
    return response;
};

