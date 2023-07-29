// import mongoose from 'mongoose';

// export interface I_UserDocument extends mongoose.Document {
//     name: string;
//     password: string;
// }

// const UserSchema: mongoose.Schema<I_UserDocument> = new mongoose.Schema({
//     name: { type: String, unique: true },
//     password: { type: String }
// });

// const UserModel = mongoose.model<I_UserDocument>('User', UserSchema);

// export default UserModel;
import mongoose, { Document, Model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

export interface I_UserDocument extends Document {
    name: string;
    password: string;
}

export interface I_UserModel extends Model<I_UserDocument> {}

export type DocumentDefinition<T> = Omit<T, keyof Document> & Document;

const UserSchema: Schema<I_UserDocument> = new Schema({
    name: { type: String, unique: true },
    password: { type: String }
});
const saltRounds = 8;

UserSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, saltRounds);
    }
    next();
});

const UserModel: I_UserModel = mongoose.model<I_UserDocument, I_UserModel>('User', UserSchema);

export default UserModel;
