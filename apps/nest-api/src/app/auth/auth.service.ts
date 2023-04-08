import { Injectable } from '@nestjs/common';

import { JwtPayload, verify, sign } from 'jsonwebtoken';
import { hash, compare } from 'bcrypt';

import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { Identity, IdentityDocument } from './identity.schema';
import { User, UserDocument } from '../user/user.schema';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Identity.name) private identityModel: Model<IdentityDocument>,
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) {}

    async createUser(firstName: string, lastName: string, emailAddress: string, role: string): Promise<string> {
        const user = new this.userModel({firstName, lastName, emailAddress, role});
        console.log("user", user);
        await user.save();
       
        return user.id;
      }

    async verifyToken(token: string): Promise<string | JwtPayload> {
        return new Promise((resolve, reject) => {
            verify(token, process.env.JWT_SECRET, (err, payload) => {
                if (err) reject(err);
                else resolve(payload);
            })
        })
    }

    async registerUser(firstName: string, lastName: string, emailAddress: string, password: string, role: string) {
        const generatedHash = await hash(password, parseInt(process.env.SALT_ROUNDS, 10));

        const identity = new this.identityModel({hash: generatedHash, emailAddress});
        //console.log(identity);
        
        console.log(identity);
        await identity.save();
        console.log("identity", identity);
        
    }

    async getOne(id: string): Promise<User> {
        console.log('API: get one User (id: ' + id + ') aangeroepen!');
        const user = await this.userModel.aggregate([{ $match: { id: id } }]);
        return user[0];
    }

    async getAll(): Promise<User[]> {
        console.log('API: get all Users aangeroepen!');
        const users = await this.userModel.find();
        return users;
    }

    async editOne(id: string, newData: User): Promise<User> {
        console.log('API: update one user (id: ' + id + ') aangeroepen!');
        let output;
        try {
            output = await this.userModel.updateOne(newData)
        } catch (error) {
            console.log(error);
        }

        return output;
    }

    async generateToken(emailAddress: string, password: string): Promise<string> {
        const identity = await this.identityModel.findOne({emailAddress});

        if (!identity || !(await compare(password, identity.hash))) throw new Error("user not authorized");

        const user = await this.userModel.findOne({emailAddress: emailAddress});

        return new Promise((resolve, reject) => {
            sign({emailAddress, id: user.id}, process.env.JWT_SECRET, (err: Error, token: string) => {
                if (err) reject(err);
                else resolve(token);
            });
        })
    }
}
