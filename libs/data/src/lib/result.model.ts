import { Subject } from "./data";

export class Result {
    id: string = '';
    studentId: string = '';
    subject: Subject;
    grade: number = 0;
    rating: string = '';
    date: string = '';

    constructor(id = '', studentId = '', subject = new Subject(), grade = 0, rating = '', date = '') {
        this.id = id;
        this.studentId = studentId;
        this.subject = subject;
        this.grade = grade;
        this.rating = rating;
        this.date = date;
    }
}