import { Document, Model, Schema } from 'mongoose';
import { DocumentDefinition } from '../models/User';
import UserModel, { I_UserDocument } from '../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../middleware/auth';

export async function register(user: DocumentDefinition<I_UserDocument>): Promise<void> {
    try {
        await UserModel.create(user);
    } catch (error) {
        throw error;
    }
}

export async function login(user: DocumentDefinition<I_UserDocument>) {
    try {
        const foundUser = await UserModel.findOne({ name: user.name });

        if (!foundUser) {
            throw new Error('Name of user is not correct');
        }

        const isMatch = bcrypt.compareSync(user.password, foundUser.password);
        const _id = foundUser._id.toString();
        const name = user.name;

        if (isMatch) {
            const token = jwt.sign({ _id: foundUser._id.toString(), name: foundUser.name }, SECRET_KEY, {
                expiresIn: '2 days'
            });

            return { user: { _id, name }, token: token };
        } else {
            throw new Error('Password is not correct');
        }
    } catch (error) {
        throw error;
    }
}
