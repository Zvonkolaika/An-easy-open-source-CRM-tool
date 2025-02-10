export class User {
    id?: string; // Optional because it will be added after the document is created
    firstName: string;
    lastName: string;
    // birthDate: number;
    email: string;
    birthDate: number | null;
    street: string;
    zipCode: number;
    city: string;
    type: string;
    priority: string;

    constructor(obj?: any) {
        this.id = obj ? obj.id : null;
        this.firstName = obj ? obj.firstName : '';
        this.lastName = obj ? obj.lastName : '';
        this.email = obj ? obj.email : '';
        // this.birthDate = obj ? obj.birthDate : '';
        this.birthDate = obj ? obj.birthDate : null;
        this.street = obj ? obj.street : '';
        this.zipCode = obj ? obj.zipCode : '';
        this.city = obj ? obj.city : '';
        this.type = obj ? obj.type : '';
        this.priority = obj ? obj.priority : '';
        // if(obj) {
        // this.firstName = obj.firstName;
        // }
        // else{
        // this.firstName = '';
        // }
    }

    toJSON() {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            birthDate: this.birthDate,
            street: this.street,
            zipCode: this.zipCode,
            city: this.city,
            type: this.type,
            priority: this.priority
        };
    
}
}