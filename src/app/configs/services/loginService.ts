import apiService from "./apiService";

export async function login(data: any) {
    try {
        const response = await apiService.post('/signin', data)
        console.log(response, '--- response api')
    } catch (error) {
        console.log(error)
    }
}