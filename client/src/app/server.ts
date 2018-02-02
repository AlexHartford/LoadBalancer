export class Server {
    name: string;
    port: number;
    value: number;
    capacity: number;

    constructor(private p: number, private c: number) {
        this.name = "Server " + p;
        this.port = p;
        this.value = 1;
        this.capacity = c;
    }
}