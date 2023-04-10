import { User } from "@school-app/data";
import { ObjectId } from "mongoose";
import { Subject } from "./subject.model";

export interface Education {
    //_id: Education;
    id: string;
    name: string;
    description: string;
    subjects: Subject[];
}