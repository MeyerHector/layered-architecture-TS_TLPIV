import { Server } from "./server";
console.log(process.env.port);
const server = new Server();

server.Listen();
