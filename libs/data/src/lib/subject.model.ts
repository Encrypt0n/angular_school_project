import { User } from "./user.model";

export class Subject {
    id: string = '';
    name: string = '';
    description: string = '';
    credits: number = 0;
    students: User[] = [];

    constructor(id = '', name = '', description = '', credits = 0, students = []) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.credits = credits;
        this.students = students;
    }
}