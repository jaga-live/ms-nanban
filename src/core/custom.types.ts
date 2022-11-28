import { Request } from 'express';

/// /Custom Express Middleware
export interface Req extends Request{
    userData: any,
    authToken: string,
    files: any
}
