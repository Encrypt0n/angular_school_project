import { Education } from "./education.model";
import { User } from "./user.model";

export class Subject {
    id: string = '';
    name: string = '';
    description: string = '';
    credits: number = 0;
    educations: Education[] = [];
    education: string = '';
    students: User[] = [];

    constructor(id = '', name = '', description = '', credits = 0, educations = [], students = [], education = '') {
        this.id = id;
        this.name = name;
        this.description = description;
        this.credits = credits;
        this.educations = educations;
        this.students = students;
        this.education = education;
    }
}