import apiService from "./api.service";

export async function disableUser(id_user_ad: string) {
    try {
        const response = await apiService.put(`/users/${id_user_ad}/disable`)

    } catch (error) {
        return {
            message: error.response.data?.message,
            code: error.response.data?.code,
            data: error.response.data?.data,
        };
    }
}