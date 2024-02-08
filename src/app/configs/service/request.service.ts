import apiService from "./api.service"

export interface RequestForm {
    description: string
    sendReceipt: boolean
    totalRequestValue: number
    dueDate: Date
}

export async function createRequest(data: RequestForm) {
    try {

        const response = await apiService.post('/payment-request-general', data)

        return {
            success: response.data.success,
            code: response.status,
            data: response.data.data,
        }

    } catch (error: any) {
        return {
            message: error.response.data?.message,
            code: error.response.data?.code,
            data: error.response.data?.data,
        };
    }
}