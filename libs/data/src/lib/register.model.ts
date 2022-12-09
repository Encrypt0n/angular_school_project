export class RegisterModel {
    firstName = '';
    lastName = '';
    emailAddress = '';
    password = '';
    //birthday = Date;
    //city = '';
   // street = '';
   // zipcode = '';
    role = '';
   

    constructor(firstName = '', lastName = '', emailAddress = '', password = '', /*birthday = Date, city = '', street = '', zipcode = '',*/ role = 'student') {
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailAddress = emailAddress;
        this.password = password;
       // this.birthday = birthday;
       // this.city = city;
       // this.street = street;
       // this.zipcode = zipcode;
        this.role = role;
      
    }
}
