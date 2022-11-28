import { NextFunction, Request, Response } from 'express';

export abstract class Middleware {
    public abstract execute(req: Request, res: Response, next : NextFunction): Promise<void> | void
}
