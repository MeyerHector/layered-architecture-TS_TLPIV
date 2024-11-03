import db from "./db";

export const connectDB = async () => {
  try {
    // Intenta autenticar la conexión a la base de datos
    await db.authenticate();
    console.log("Database connection successful 🚀");

    // Sincroniza los modelos con la base de datos
    await db.sync({ force: false });
    console.log("Synchronized tables successfully 🚀");
  } catch (error) {
    console.error("Error connecting or synchronizing the database ✖️", error);
  }
};
