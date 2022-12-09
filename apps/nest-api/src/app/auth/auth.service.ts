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
        await user.save();
        console.log(user.id);
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

        await identity.save();
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
