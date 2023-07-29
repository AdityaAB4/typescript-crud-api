import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

export const SECRET_KEY: Secret = 'your-secret-key-here';

export interface CustomRequest extends Request {
    token: string | JwtPayload;
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).send('Please authenticate 1');
        }
        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
        (req as CustomRequest).token = decoded;

        next();
    } catch (err) {
        console.error(err); // Log the error for debugging purposes
        return res.status(401).send('Please authenticate 2');
    }
};

// org working 1
// import jwt, { Secret, JwtPayload } from 'jsonwebtoken';
// import { Request, Response, NextFunction } from 'express';

// export const SECRET_KEY: Secret = 'your-secret-key-here';

// export interface CustomRequest extends Request {
//     token: string | JwtPayload;
// }

// export const auth = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const token = req.header('Authorization')?.replace('Bearer ', '');

//         if (!token) {
//             throw new Error();
//         }

//         const decoded = jwt.verify(token, SECRET_KEY);
//         (req as CustomRequest).token = decoded;

//         next();
//     } catch (err) {
//         res.status(401).send('Please authenticate');
//     }
// };
