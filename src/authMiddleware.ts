import jwt, { JwtPayload } from 'jsonwebtoken';
import "dotenv/config";
import { Request, Response, NextFunction } from 'express';

export function jwtMiddleware(req: Request, res: Response, next: NextFunction): void {
    const token = req.header('Authorization');
    if (!token) {
        res.status(401).json({ error: 'Access denied' })
        return;
    };
    try {
        const decoded = jwt.verify(token.replace("Bearer ", ''), process.env.SECRET_KEY as string) as JwtPayload;
        res.locals.userId = decoded.userId;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
