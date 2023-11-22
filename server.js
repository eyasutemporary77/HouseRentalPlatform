const http = require("http");
const app = require("./app/app");
const { extendJoi } = require("./startup/validate");
require("./startup/database");
require("./startup/routes")(app);
require("./startup/validate");
const { connectCloudinary } = require("./startup/cloudary");
const fs = require("fs");
const options = {
  key: fs.readFileSync("certificates/key.pem"),
  cert: fs.readFileSync("certificates/cert.pem"),
};
const server = http.createServer( app);
server.on("error", (error) => {
  console.error("Server error:", error);
});
connectCloudinary();
extendJoi();
const PORT =  process.env.PORT ||  8000;
server.listen(PORT, () => {
  console.log("LISTENING ON PORT", PORT);
});
