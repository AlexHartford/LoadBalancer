export class Server {
    name: string;
    port: number;
    value: number;
    capacity: number;

    constructor(private p: number, private c: number) {
        this.name = "Server " + p;
        this.port = p;
        // this.value = 500 - c + 1;
        this.value = c + 1;
        this.capacity = c;
    }
}