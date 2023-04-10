import { Subject } from "./subject.schema";

export interface SubjectBody {

    id: string;
    name: string;
    description: string;
    credits: number;
    education: string;
}