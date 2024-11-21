import db from "./db";

export const connectDB = async () => {
  try {
    await db.authenticate();
    console.log("Database connection successful 🚀");

    await db.sync({ force: false });
    console.log("Synchronized tables successfully 🚀");
  } catch (error) {
    console.error(
      "Error connecting the database or synchronizing tables ✖️",
      error
    );
  }
};
