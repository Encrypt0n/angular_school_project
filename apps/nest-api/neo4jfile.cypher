CREATE (informatica:Education {name:"Informatica", description: "Leuke opleiding", id:"1" })
CREATE (programmeren1:Subject {name:"Programmeren 1", description: "leuk vak", credits:3, id: "1", students: ["basvt2@gmail.com"]})


CREATE (informatica)-[:HasSubject]->(programmeren1)
