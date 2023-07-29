import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import Author, { IAuthor, IAuthorModel } from '../models/Author';
import { I_UserDocument } from '../models/User';
interface CustomRequest extends Request {
    user: {
        id: string;
        // Add other properties related to the logged-in user if needed
    };
}
const jwt = require('jsonwebtoken');

const createAuthor = (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body;

    // Assuming the token is in the 'authorization' header with the format 'Bearer <token>'
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    // Verify the token and extract the user ID from the payload
    const decodedToken = jwt.decode(token);
    const userId = decodedToken ? decodedToken._id : null;

    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    const author = new Author({
        _id: new mongoose.Types.ObjectId(),
        name,
        createdBy: userId // Assign the user ID to the `createdBy` field
    });

    return author
        .save()
        .then((author) => res.status(201).json({ author }))
        .catch((error) => res.status(500).json({ error }));
};

// org working 29july
// const createAuthor = (req: Request, res: Response, next: NextFunction) => {
//     const { name } = req.body;
//     // const userId = req.user.id; // Replace `req.user.id` with the actual property containing the user's ID

//     const author = new Author({
//         _id: new mongoose.Types.ObjectId(),
//         name
//         // createdBy: userId // Assign the user ID to the `createdBy` field
//     });

//     return author
//         .save()
//         .then((author) => res.status(201).json({ author }))
//         .catch((error) => res.status(500).json({ error }));
// };

const readAuthor = (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.params.authorId;

    return Author.findById(authorId)
        .then((author) => (author ? res.status(200).json({ author }) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json({ error }));
};

const readAll = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    // Verify the token and extract the user ID from the payload
    const decodedToken = jwt.decode(token);
    const userId = decodedToken ? decodedToken._id : null;
    //  const currentUserId = req.currentUser?.id; // Assuming you have the current user's ID available in req.currentUser.id

    // If currentUserId is not available, you can handle the appropriate error response.
    if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    return Author.find({ createdBy: userId })
        .then((authors: IAuthorModel[]) => res.status(200).json({ authors }))
        .catch((error) => res.status(500).json({ error }));

    // return Author.find()
    //     .then((authors) => res.status(200).json({ authors }))
    //     .catch((error) => res.status(500).json({ error }));
};
const updateAuthor = (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.params.authorId;
    return Author.findById(authorId)
        .then((author) => {
            if (author) {
                author.set(req.body);
                return author
                    .save()
                    .then((author) => res.status(201).json({ author }))
                    .catch((error) => res.status(500).json({ error }));
            } else {
                res.status(404).json({ message: 'Not found' });
            }
        })
        .catch((error) => res.status(500).json({ error }));
};
const deleteAuthor = (req: Request, res: Response, next: NextFunction) => {
    const authorId = req.params.authorId;

    return Author.findByIdAndDelete(authorId)
        .then((author) => (author ? res.status(201).json({ message: 'deleted' }) : res.status(404).json({ message: 'Not found' })))
        .catch((error) => res.status(500).json({ error }));
};

export default { createAuthor, readAuthor, readAll, updateAuthor, deleteAuthor };
