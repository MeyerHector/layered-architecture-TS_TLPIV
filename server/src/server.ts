import express, { Application } from "express";
import cors from "cors";
import morgan from "morgan";

// conexion a la base de datos
import { connectDB } from "./config/connectDB";

//rutas
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import taskRoutes from "./routes/task.routes";

export class Server {
  private app: Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = Number(process.env.PORT) || 3000;

    this.connectDB();
    this.middlewares();
    this.routes();
  }

  async connectDB() {
    await connectDB();
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(
      cors({
        allowedHeaders: ["Content-Type", "Authorization"],
        origin: "http://localhost:5173",
      })
    );
    this.app.use(morgan("dev"));
  }

  routes() {
    this.app.use("/api", userRoutes);
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api", taskRoutes);
  }

  Listen() {
    this.app.listen(this.port, () => {
      console.log(`Server running on port http://localhost:${this.port}`);
    });
  }
}
