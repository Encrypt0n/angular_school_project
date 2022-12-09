export class LoginModel {
    emailAddress = '';
    password = '';
 
   

    constructor(emailAddress = '', password = '') {
  
        this.emailAddress = emailAddress;
        this.password = password;
  
      
    }
}