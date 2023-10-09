import { Request } from "express";

export type RequestWithBody<T> = Request<{}, {}, T>
export type ResponseWithQuery<T> = Request<{}, {}, {}, T>
export type RequestWithParams<T> = Request<T>
export type RequestWithParamsAndBody<T, B> = Request<T, {}, B>
