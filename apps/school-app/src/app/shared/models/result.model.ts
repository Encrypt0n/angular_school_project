import { Subject } from "@school-app/data";

export interface Result {
    id: string;
    studentId: string;
    subject: Subject;
    grade: number;
    rating: string;
    date: string;
}