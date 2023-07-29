import mongoose, { Document, Schema } from 'mongoose';

export interface IAuthor {
    name: string;
    createdBy: mongoose.Types.ObjectId;
}

export interface IAuthorModel extends IAuthor, Document {}

const AuthorSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        createdBy: { type: mongoose.Types.ObjectId, ref: 'User', required: true }
    },
    {
        versionKey: false
    }
);

export default mongoose.model<IAuthorModel>('Author', AuthorSchema);

// import mongoose, { Document, Schema } from 'mongoose';

// export interface IAuthor {
//     name: string;
//     createdBy: mongoose.Types.ObjectId; // Reference to the User who created this author
// }

// export interface IAuthorModel extends IAuthor, Document {}

// const AuthorSchema: Schema = new Schema(
//     {
//         name: { type: String, required: true },
//         createdBy: { type: mongoose.Types.ObjectId, ref: 'User', required: true } // Reference to the User model
//     },
//     {
//         versionKey: false
//     }
// );

// const default mongoose.model<IAuthorModel>('Author', AuthorSchema);

// export default AuthorModel;
