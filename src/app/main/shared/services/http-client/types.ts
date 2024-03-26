// generic if unknown type extends any

export type ResponseAPI<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      message: string;
      invalidFields: {
        field: string;
        messages: string;
      }[];
    };
