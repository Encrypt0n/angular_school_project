import { User } from "@school-app/data";
import { ObjectId } from "mongoose";
import { Education } from "./education.model";

export interface Subject {
    _id: Subject;
    id: string;
    name: string;
    description: string;
    credits: number;
    educations: Education[];
    students: User[];
    education: string;
}