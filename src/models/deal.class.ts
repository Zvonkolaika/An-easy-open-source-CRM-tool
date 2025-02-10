export class Deal {
    id?: string; // Optional because it will be added after the document is created
    name: string;
    stage: string;
    value: number;
    contact: string;
    expectedCloseDate: number | null;

    constructor(obj?: any) {
        this.id = obj ? obj.id : null;
        this.name = obj ? obj.name : '';
        this.stage = obj ? obj.stage : '';
        this.value = obj ? obj.value : '';
        this.contact = obj ? obj.contact : '';
        this.expectedCloseDate = obj ? obj.expectedCloseDate : null;
    }

    toJSON() {
        return {
            id: this.id,
            name: this.name,
            stage: this.stage,
            value: this.value,
            contact: this.contact,
            expectedCloseDate: this.expectedCloseDate
        };
}
}