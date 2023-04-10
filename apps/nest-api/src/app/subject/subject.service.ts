import { Education, Subject, User } from '@school-app/data';
import { Injectable } from '@nestjs/common';
import { SubjectDocument } from './subject.schema';
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';
import { UserDocument } from '../user/user.schema';

import { EducationDocument } from '../education/education.schema';

@Injectable()
export class SubjectService {
        constructor(@InjectModel(Subject.name) private subjectModel: Model<SubjectDocument>, @InjectModel(Education.name) private educationModel: Model<EducationDocument>, @InjectModel(User.name) private userModel: Model<UserDocument>, private authService: AuthService) { }

    async getAll(): Promise<SubjectDocument[]> {
        console.log('API: get all subjects aangeroepen!');

        return this.subjectModel.find();
    }

    async createSubject(name: string, description: string, credits: number, education: string): Promise<string> {
        console.log("educationId", education);
        
        const subject = new this.subjectModel({name, description, credits});
        const educationn = await this.educationModel.findOne({ id: education });
        console.log("subject", subject);
        subject.educations.push(educationn._id);
        await subject.save();

        educationn.subjects.push(subject._id);
        await educationn.save();
       
        return subject.id;
      }

    async getOne(id: string): Promise<SubjectDocument> {
        console.log('API: get one subject (id: ' + id + ') aangeroepen!');
        const subject = await this.subjectModel.find({ "id": id }).populate('educations', ['name'] );
        return subject.pop();
    }

    async editOne(id: string, newData: Subject): Promise<SubjectDocument> {
        console.log('API: update one subject (id: ' + id + ') aangeroepen!');
        
        const subject = await this.subjectModel.findOne({id: id})
        const education = await this.educationModel.findOne({id: newData['education']});


       console.log("education", education);

       education.subjects.push(subject._id);

         await education.save();
       

   // some angular libraries require breaking the array reference
   // to pick up the update in the array and trigger change detection.
   // In that case, you can do following

   //this.itemArray.items = Object.assign([], this.itemArray.items);

        let output;
        try {
            newData['education'] = education._id;
            subject.educations.push(education._id);
            subject.name = newData.name;
            subject.description = newData.description;
            subject.credits = newData.credits;
            //let indexToUpdate = s.results.findIndex(result => result.id === newData.id);
           // output = student.results[indexToUpdate] = newData;
            
            //student.results = Object.assign([], student.results);
            output = await subject.save();
        } catch (error) {
            console.log(error);
        }

        return output;
    }

    async deleteOne(id: string): Promise<SubjectDocument> {
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