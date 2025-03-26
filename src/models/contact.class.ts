export class Contact {
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
    // birthDate: number | null;
    street: string;
    zipCode: number;
    city: string;
    password: string = ''; // Add this property

    constructor(obj?: any) {
        this.id = obj ? obj.id : null;
        this.firstName = obj ? obj.firstName : '';
        this.lastName = obj ? obj.lastName : '';
        this.email = obj ? obj.email : '';
        // this.birthDate = obj ? obj.birthDate : null;
        this.street = obj ? obj.street : '';
        this.zipCode = obj ? obj.zipCode : '';
        this.city = obj ? obj.city : '';
        this.password = obj ? obj.password : ''; // Add this line
    }

    toJSON() {
        return {
            id: this.id,
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
            // birthDate: this.birthDate,
            street: this.street,
            zipCode: this.zipCode,
            city: this.city,
            password: this.password // Add this line
        };
    }
}
