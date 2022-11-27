import { Injectable } from '@angular/core';
import { Result } from '../../models/result.model';

@Injectable({providedIn: 'root'})

export class ResultService {
    results: Result[] = [
        {
            resultId: 1,
            studentId: 1,
            subjectId: 1,
            grade: 7,
            rating: "Goed",
            date: "20-05-2021"
        },
        {
            resultId: 2,
            studentId: 2,
            subjectId: 1,
            grade: 8,
            rating: "Goed",
            date: "20-05-2021"
        },
        {
            resultId: 3,
            studentId: 3,
            subjectId: 1,
            grade: 7.5,
            rating: "Goed",
            date: "20-05-2021"
        },
        {
            resultId: 4,
            studentId: 4,
            subjectId: 1,
            grade: 7,
            rating: "Goed",
            date: "20-05-2021"
        },
        {
            resultId: 5,
            studentId: 5,
            subjectId: 1,
            grade: 6,
            rating: "Voldoende",
            date: "20-05-2021"
        },
    ]


constructor() {}

getAllResults(): Result[] {
    return this.results;
}

getResultById(id: number): Result {
    return this.results.filter(result => result.resultId == id)[0];
}

addResult(result: Result) {
    this.results.push(result);
}

deleteResult(id: number) {
    let result = this.results.findIndex((result) => result.resultId == id);
    this.results.splice(result, 1);
}

updateResult(resultToUpdate: Result) {
    this.results.forEach(result => {
        if(result.resultId == resultToUpdate.resultId) {
            result = resultToUpdate;
        }
    })
}

}