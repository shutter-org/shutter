const API_URL = "http://127.0.0.1:5000";

export const addPublicationToGallery = async (gallery_id: string, publication_id: string, authKey: String) => {
    const key = "Bearer " + authKey;
    const response = await fetch(`${API_URL}/gallerys/${gallery_id}/publications`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": key,
        },
        body: JSON.stringify({ "publication_id": publication_id }),
    });
    return response;
}