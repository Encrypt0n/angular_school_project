import { Subject, User } from '@school-app/data';
import { Injectable } from '@nestjs/common';
import { SubjectDocument, Subject as SubjectModel } from './subject.schema';
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';
import { UserDocument } from '../user/user.schema';
import path = require('path');

@Injectable()
export class SubjectService {
        constructor(@InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>, @InjectModel(User.name) private userModel: Model<UserDocument>, private authService: AuthService) { }

    async getAll(): Promise<Subject[]> {
        console.log('API: get all subjects aangeroepen!');

        return this.subjectModel.find();
    }

    async createSubject(name: string, description: string, credits: number): Promise<string> {
        const subject = new this.subjectModel({name, description, credits});
        console.log("subject", subject);
        await subject.save();
       
        return subject.id;
      }

    async getOne(id: string): Promise<Subject> {
        console.log('API: get one subject (id: ' + id + ') aangeroepen!');
        const subject = await this.subjectModel.find({ "id": id }).populate('students', ['firstName', 'lastName'] );
        return subject.pop();
    }

    async editOne(id: string, newData: Subject): Promise<Subject> {
        console.log('API: update one subject (id: ' + id + ') aangeroepen!');
        let output;
        try {
            output = await this.subjectModel.updateOne({ "id": id }, { $set: { "name": newData.name, "description": newData.description, "credits": newData.credits } })
        } catch (error) {
            console.log(error);
        }

        return output;
    }

    async deleteOne(id: string): Promise<Subject> {
        console.log('API: delete one subject (id: ' + id + ') aangeroepen!');
        let output;
        try {
            output = await this.subjectModel.deleteOne({ "id": id });
        } catch (error) {
            console.log(error);
        }

        return output;
    }
}