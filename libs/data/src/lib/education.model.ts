import { Subject } from "./subject.model";
import { User } from "./user.model";

export class Education {
    id: string = '';
    name: string = '';
    description: string = '';
    subjects: Subject[] = [];

    constructor(id = '', name = '', description = '', subjects = []) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.subjects = subjects;
    }
}