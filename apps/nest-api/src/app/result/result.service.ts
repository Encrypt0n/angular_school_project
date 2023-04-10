//import { Subject } from '@school-app/data';
import { Injectable } from '@nestjs/common';
import { ResultDocument, Result as ResultModel, Result } from './result.schema';
import { SubjectDocument, Subject as SubjectModel, Subject } from '../subject/subject.schema';
import { UserDocument, User as UserModel, User } from '../user/user.schema';
import mongoose, { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import console = require('console');


@Injectable()
export class ResultService {
    
        constructor(@InjectModel(ResultModel.name) private resultModel: Model<ResultDocument>, @InjectModel(SubjectModel.name) private subjectModel: Model<SubjectDocument>, @InjectModel(UserModel.name) private userModel: Model<UserDocument>, private authService: AuthService) { }

    async getAll(): Promise<Result[]> {
        console.log('API: get all results aangeroepen!');

        let students: User[] = await this.userModel.find().populate('results.subject');
        let results: Result[] = [];
        students.forEach(student => {
            results.push(...student.results);
        });

        return await results;
            
       
    }

    async getAllByStudent(id: string): Promise<Result[]> {
        let student: User = await this.userModel.findOne({id: id}).populate('results.subject');
        console.log('API: get all results by student aangeroepen!');
    
        return student.results;
            
       
    }

    async createResult(studentId: string, subject: string, grade: number, rating: string): Promise<string> {
        //const student = await this.authService.getOne(studentId);

        
        console.log("subjectId", subject);
        const subjectt = await this.subjectModel.findOne({id: subject});
        const student = await this.userModel.findOne({id: studentId})
        console.log("subject", subjectt);
        const result = new this.resultModel({studentId, subject: subjectt._id, grade, rating});
        console.log("result", result);

        
        
        student.results.push(result);
        
        
        
        
        

        await student.save();

        

       
       
        return student.id;
      }

    async getOne(studentId: string, id: string): Promise<Result> {
        console.log('API: get one result (id: ' + id + ') aangeroepen!');
        console.log("studentId", studentId);
        const student = await this.userModel.findOne({id: studentId}).populate('results.subject');
        console.log("student", student);
        
        const result = student.results.filter(r => r.id === id);
        console.log("result", result[0]);
        
        //const results = await this.resultModel.aggregate([{ $match: { id: id } }]);
        return result[0];
    }

    async editOne(studentId: string, id: string, newData: Result): Promise<Result> {
        console.log('API: update one result (id: ' + id + ') aangeroepen!');
        //console.log("newData", newData);
        //console.log("subjectId", newData['subjectId']);
        
        const student = await this.userModel.findOne({id: studentId})
        const subject = await this.subjectModel.findOne({id: newData['subject']});


       console.log("subject", subject);


        let output;
        try {
            newData['subject'] = subject._id;
            let indexToUpdate = student.results.findIndex(result => result.id === newData.id);
            output = student.results[indexToUpdate] = newData;
            
            //student.results = Object.assign([], student.results);
            output = await student.save();
        } catch (error) {
            console.log(error);
        }

        return output;
    }

    async deleteOne(studentId: string, id: string): Promise<string> {
        console.log('API: delete one result (id: ' + id + ') aangeroepen!');
        const student = await this.userModel.findOne({id: studentId})
        let output;
        try {
            var index =  student.results.findIndex(x => x.id==id);
           // let indexToDelete = student.results.findIndex(result => result.id === id);
            console.log("indexToDelete", index);
            
            output = student.results.splice(index, 1);
            output = student.save();
            //output = await this.userModel.remove({ "id": id });
        } catch (error) {
            console.log(error);
        }

        return output;
    }
}