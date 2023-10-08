const { spawn } = require("child_process");
const fs = require("fs");
const cron = require("node-cron");

const { DB_NAME, DB_USER, DB_PASSWORD, DB_HOST, DB_PORT } = require("./config");

const backupDatabase = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, "0");
  const day = now.getDate().toString().padStart(2, "0");
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  const seconds = now.getSeconds().toString().padStart(2, "0");

  const backupFolder = `./backup/${year}_${month}`;
  const backupFilePath = `${backupFolder}/backup_${year}_${month}_${day}_${hours}${minutes}${seconds}.sql`;

  if (!fs.existsSync(backupFolder)) {
    fs.mkdirSync(backupFolder, { recursive: true });
  }

  const mysqldump = spawn("mysqldump", [
    `--host=${DB_HOST}`,
    `--port=${DB_PORT}`,
    `--user=${DB_USER}`,
    `--password=${DB_PASSWORD}`,
    DB_NAME,
  ]);

  const backupStream = fs.createWriteStream(backupFilePath);

  mysqldump.stdout.pipe(backupStream);

  mysqldump.stderr.on("data", (data) => {
    console.error(`Error: ${data}`);
  });

  mysqldump.on("close", (code) => {
    if (code === 0) {
      console.log(`Backup created successfully: ${backupFilePath}`);
    } else {
      console.error(`Backup process exited with code ${code}`);
    }
  });
};

cron.schedule("0 2 * * 0", backupDatabase);

console.log("Cron job for database backup has been scheduled.");

module.exports = backupDatabase;
