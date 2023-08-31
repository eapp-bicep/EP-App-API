export type CommonMessageResponse = {
  message: string;
};

export type ResponseWithData<T> = {
  message: string;
  data?: T;
};
