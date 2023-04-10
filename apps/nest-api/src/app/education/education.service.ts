import { Subject, User, Education } from '@school-app/data';
import { Injectable } from '@nestjs/common';
import { EducationDocument, Education as EducationModel } from './education.schema';
import { Model } from 'mongoose'
import { InjectModel } from '@nestjs/mongoose';
import { AuthService } from '../auth/auth.service';
import { UserDocument } from '../user/user.schema';
import path = require('path');
import { Neo4jService } from '../neo4j/neo4j.service';

@Injectable()
export class EducationService {
        constructor(@InjectModel(Education.name) private educationModel: Model<EducationDocument>, @InjectModel(User.name) private userModel: Model<UserDocument>, private authService: AuthService, private neo4jService: Neo4jService) { }

    async getAll(): Promise<Education[]> {
        console.log('API: get all educations aangeroepen!');

        

        return this.educationModel.find().populate('subjects', ['name'] );;
    }

    async createEducation(name: string, description: string): Promise<string> {
        const education = new this.educationModel({name, description});
        console.log("education", education);
        await education.save();
       
        return education.id;
      }

    async getOne(id: string): Promise<EducationDocument> {
        console.log('API: get one education (id: ' + id + ') aangeroepen!');
        const education = await this.educationModel.find({ "id": id }).populate('subjects', ['name'] );
        return education.pop();
    }

    async editOne(id: string, newData: Education): Promise<EducationDocument> {
        console.log('API: update one education (id: ' + id + ') aangeroepen!');
        let output;
        try {
            output = await this.educationModel.updateOne({ "id": id }, { $set: { "name": newData.name, "description": newData.description } })
        } catch (error) {
            console.log(error);
        }

        return output;
    }

    async deleteOne(id: string): Promise<EducationDocument> {
        console.log('API: delete one education (id: ' + id + ') aangeroepen!');
        let output;
        try {
            output = await this.educationModel.deleteOne({ "id": id });
        } catch (error) {
            console.log(error);
        }

        return output;
    }

    async getFinishedSubjects(education: string, subject: string): Promise<any> {
        console.log("education", education);
        console.log("subject", subject);
        
        
        console.log('API: get finished subjects aangeroepen!');
        let output;
        try {
            output = await this.neo4jService.singleRead(
                "MATCH (e:Education {name: '"+education+"'})-[*]->(n) WHERE (n:Subject AND n.name = '"+subject+"') OR (n:Education) RETURN n");
            
        } catch (error) {
            console.log(error);
        }
        const students = output.records.map(record => record.get('n').properties.students);

        let foundStudents = [];
        for (let student of students) {
            try {
                let found = await this.userModel.findOne({emailAddress: student.pop()}).exec();
                foundStudents.push(found);
            } catch(e) {
                console.log(`did not find rider ${student} in database`);
            }
        }
        console.log(foundStudents);
        return foundStudents;

  

        
    }
}