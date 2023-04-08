import { User } from '@school-app/data';
import { Injectable } from '@nestjs/common';
import { UserDocument, User as UserModel } from './user.schema';
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class UserService {
        constructor(@InjectModel(UserModel.name) private userModel: Model<UserDocument>) { }

    async getAll(): Promise<User[]> {
        console.log('API: get all users aangeroepen!');

        return this.userModel.find();
    }

    async getOne(id: string): Promise<User> {
        console.log('API: get one user (id: ' + id + ') aangeroepen!');
        const users = await this.userModel.aggregate([{ $match: { id: id } }]);
        return users[0];
    }

    async editOne(id: string, newData: User): Promise<User> {
        console.log('API: update one user (id: ' + id + ') aangeroepen!');
        let output;
        try {
            output = await this.userModel.updateOne({ "id": id }, { $set: { "firstName": newData.firstName, "lastName": newData.lastName, "emailAddress": newData.emailAddress } })
        } catch (error) {
            console.log(error);
        }

        return output;
    }

    async deleteOne(id: string): Promise<User> {
        console.log('API: delete one user (id: ' + id + ') aangeroepen!');
        let output;
        try {
            output = await this.userModel.deleteOne({ "id": id });
        } catch (error) {
            console.log(error);
        }

        return output;
    }
}