import { sendMail } from "../helpers/nodemailer";
import { UserService } from "../services/User.service";
import db from "./db";

export const connectDB = async () => {
  const usersService = new UserService();
  db.authenticate()
    .then(() => {
      console.log("database connection successful 🚀");
    })
    .catch((error) => {
      console.error("error connecting the database ✖️", error);
    });
  await db
    .sync({ force: false })
    .then(async () => {
      console.log("synchronized tables successfully 🚀");
      const users = await usersService.getAllUsers();
      users.map((user) => {
        user.tasks.map((task) => {
          if (task.completed) return;
          const taskDate = new Date(
            new Date(task.date).toISOString().split("T")[0]
          ).getTime();
          const currentDate = new Date(
            new Date().toISOString().split("T")[0]
          ).getTime();
          const oneDayInMs = 24 * 60 * 60 * 1000;
          if (taskDate - currentDate === oneDayInMs) {
            sendMail(
              user.email,
              "Tienes una tarea que vence mañana",
              `<!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Recordatorio de Tarea</title>
          <style>
          body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333333;
          margin: 0;
          padding: 0;
          }
          .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f9f9f9;
          }
          .header {
          background-color: #4CAF50;
          color: white;
          text-align: center;
          padding: 20px;
          }
          .content {
          background-color: white;
          padding: 20px;
          border-radius: 5px;
          }
          .footer {
          text-align: center;
          margin-top: 20px;
          font-size: 12px;
          color: #666666;
          }
          </style>
      </head>
      <body>
          <div class="container">
          <div class="header">
          <h1>Recordatorio de Tarea</h1>
          </div>
          <div class="content">
          <h2>¡Hola, ${user.name}!</h2>
          <p>Tienes una tarea programada para mañana:</p>
          <h3 style="color: #4CAF50;">${task.title}</h3>
          <h4 style="color: #808080;">${task.description}</h4>
          <p>¡Que tengas un excelente día!</p>
          <img src="https://media0.giphy.com/media/xUPJPlFxssGpmLemru/200w.gif?cid=6c09b9524y5cfeb9ksnm44yamf08qx52uy8wqssezdpy0ef6&ep=v1_gifs_search&rid=200w.gif&ct=g" alt="Excelente dia tkm" style="width: 100%">
          </div>
          <div class="footer">
          <p>Este es un mensaje automático. Por favor, no respondas a este correo.</p>
          <p>© 2024 Taskier. Todos los derechos reservados.</p>
          </div>
          </div>
      </body>
      </html>`
            );
          }
        });
      });
    })
    .catch((error) => {
      console.error("error synchronizing tables ✖️", error);
    });
};
