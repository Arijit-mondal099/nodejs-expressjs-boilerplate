import type { Request, Response } from "express";

export interface ApiSuccessResponse<T = unknown> {
  success: true;
  message: string;
  data?: T;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

export type TypedRequest<
  TBody = unknown,
  TQuery = Record<string, string>,
  TParams = Record<string, string>
> = Request<TParams, unknown, TBody, TQuery>;

export type TypedResponse<T = unknown> = Response<ApiResponse<T>>;
