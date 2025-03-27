export class Contact {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    street: string;
    zipCode: number;
    city: string;
    password: string = ''; 
    constructor(obj?: any) {
        this.id = obj ? obj.id : null;
        this.firstName = obj ? obj.firstName : '';
        this.lastName = obj ? obj.lastName : '';
        this.email = obj ? obj.email : '';
        this.street = obj ? obj.street : '';
        this.zipCode = obj ? obj.zipCode : '';
        this.city = obj ? obj.city : '';
        this.password = obj ? obj.password : ''; 
    }

    toJSON() {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            street: this.street,
            zipCode: this.zipCode,
            city: this.city,
            password: this.password 
        };
    }
}
