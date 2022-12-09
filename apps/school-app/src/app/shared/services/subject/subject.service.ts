import { Injectable } from '@angular/core';
import { Subject } from '../../models/subject.model';

@Injectable({providedIn: 'root'})

export class SubjectService {
    subjects: Subject[] = [
        {
            subjectId: 1,
            name: "Relationele databases 2",
            description: "Dit vak gaat over het leggen van relaties in databases en het maken van een ERD",
            credits: 3
        },
        {
            subjectId: 2,
            name: "Programmeren 2",
            description: "Dit vak gaat over het programmeren van grotere applicaties, " +
            "hierbij wordt ook verbinding gelegd met een database. "+
            "Je zult ook leren hoe je een UML diagram maakt",
            credits: 5
        },
        {
            subjectId: 3,
            name: "Reflecteren",
            description: "Dit vak gaat over het beheersen en inzien van sociale vlakken binnen " +
            "je werk als programmeur",
            credits: 2
        },
        {
            subjectId: 4,
            name: "Bedrijfsprocessen",
            description: "Dit vak gaat over het leggen van verbanden en snel vaststellen " +
            "van welke stappen binnen een proces plaatsvinden",
            credits: 3
        },
        {
            subjectId: 5,
            name: "Duurzame ontwikkeling",
            description: "Dit vak gaat over welke rol ons vak speelt binnen het milieu",
            credits: 1.5
        }
    ]


constructor() {}

getAllSubjects(): Subject[] {
    return this.subjects;
}

getSubjectById(id: number): Subject {
    return this.subjects.filter(subject => subject.subjectId == id)[0];
}

addSubject(subject: Subject) {
    this.subjects.push(subject);
}

deleteSubject(id: number) {
    let subject = this.subjects.findIndex((subject) => subject.subjectId == id);
    this.subjects.splice(subject, 1);
}

updateSubject(subjectToUpdate: Subject) {
    this.subjects.forEach(subject => {
        if(subject.subjectId == subjectToUpdate.subjectId) {
            subject = subjectToUpdate;
        }
    })
}

}