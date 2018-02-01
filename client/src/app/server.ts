export class Server {
    name: string;
    port: number;
    value: number;
    capacity: number;

    constructor(private n: string, private p: number, private v: number, private c: number) {
        this.name = n;
        this.port = p;
        this.value = v;
        this.capacity = c;
    }
}