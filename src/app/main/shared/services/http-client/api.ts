/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { isAxiosError } from 'axios';

import { ResponseAPI } from './types';

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

export const httpClient = {
  async doGet<T = any>(
    url: string,
    options?: {
      params?: Record<string, string>;
      query?: Record<string, string>;
      headers?: Record<string, boolean | string>;
    }
  ): Promise<ResponseAPI<T>> {
    try {
      const queries = new URLSearchParams(options?.query).toString();

      const response = await axios.get(`${url}${queries ? `?${queries}` : ''}`, {
        ...options?.params,
        headers: options?.headers
      });

      return response.data;
    } catch (error) {
      if (isAxiosError<ResponseAPI<T>, Error>(error) && error.response) {
        return {
          success: false,
          message: error.response.data.message,
          invalidFields: error.response.data.invalidFields
        };
      }
      return {
        success: false,
        message: 'Erro inesperado, tente novamente mais tarde.',
        invalidFields: []
      };
    }
  },

  doPost: async <T = any>(url: string, data: any): Promise<ResponseAPI<T>> => {
    try {
      const response = await axios.post(url, data);

      return response.data;
    } catch (error) {
      if (isAxiosError<ResponseAPI<T>, Error>(error) && error.response) {
        return {
          success: false,
          message: error.response.data.message,
          invalidFields: error.response.data.invalidFields
        };
      }
      return {
        success: false,
        message: 'Erro inesperado, tente novamente mais tarde.',
        invalidFields: []
      };
    }
  },

  doPut: async <T = any>(url: string, data?: any, params?: any): Promise<ResponseAPI<T>> => {
    try {
      const response = await axios.put(url, data, {
        params
      });

      return response.data;
    } catch (error) {
      if (isAxiosError<ResponseAPI<T>, Error>(error) && error.response) {
        return {
          success: false,
          message: error.response.data.message,
          invalidFields: error.response.data.invalidFields
        };
      }
      return {
        success: false,
        message: 'Erro inesperado, tente novamente mais tarde.',
        invalidFields: []
      };
    }
  },

  doDelete: async <T = any>(url: string, params?: any): Promise<ResponseAPI<any>> => {
    try {
      const response = await axios.delete(url, { params });

      return response.data;
    } catch (error) {
      if (isAxiosError<ResponseAPI<T>, Error>(error) && error.response) {
        return {
          success: false,
          message: error.response.data.message,
          invalidFields: error.response.data.invalidFields
        };
      }
      return {
        success: false,
        message: 'Erro inesperado, tente novamente mais tarde.',
        invalidFields: []
      };
    }
  },

  doUpload: async <T = any>(url: string, data: any): Promise<ResponseAPI<any>> => {
    try {
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      if (isAxiosError<ResponseAPI<T>, Error>(error) && error.response) {
        return {
          success: false,
          message: error.response.data.message,
          invalidFields: error.response.data.invalidFields
        };
      }
      return {
        success: false,
        message: 'Erro inesperado, tente novamente mais tarde.',
        invalidFields: []
      };
    }
  }
};
