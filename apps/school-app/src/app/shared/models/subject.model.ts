import { User } from "@school-app/data";
import { ObjectId } from "mongoose";

export interface Subject {
    _id: Subject;
    id: string;
    name: string;
    description: string;
    credits: number;
    students: User[];
}