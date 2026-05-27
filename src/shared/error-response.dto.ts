export type ErrorResponseDto = {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
};
