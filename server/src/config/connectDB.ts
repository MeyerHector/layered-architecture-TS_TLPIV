import db from "./db";

export const connectDB = async () => {
  db.authenticate()
    .then(() => {
      console.log("database connection successful 🚀");
    })
    .catch((error) => {
      console.error("error connecting the database ✖️", error);
    });
  await db
  .sync({ force: true })
  .then(() => {
    console.log("synchronized tables successfully 🚀");
  })
  .catch((error) => {
    console.error("error synchronizing tables ✖️", error);
  });
};
