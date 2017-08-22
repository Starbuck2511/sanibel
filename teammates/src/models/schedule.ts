export class Schedule {
    id: string;
    name: string;
    date: string;
    type: string;
    current: string;
    uid: string;
    feedback: {
        accepts: any,
        declines: any
    };

}