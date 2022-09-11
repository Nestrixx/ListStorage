import fsPromises from "fs/promises";
import fs from "fs";
import readline from "node:readline";

type JobInfo = {
  url: string;
  company: string;
  title: string;
  date: Date;
};

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const writeToDb = async (currentJobInfo: JobInfo) => {
  if (!fs.existsSync(`${__dirname}/db.txt`)) {
    await fsPromises.writeFile(`${__dirname}/db.txt`, JSON.stringify([]));
  }
  try {
    const data = await fsPromises.readFile(`${__dirname}/db.txt`, "utf8");
    const newData = JSON.parse(data);
    newData.push(currentJobInfo);
    await fsPromises.writeFile(`${__dirname}/db.txt`, JSON.stringify(newData));
  } catch (err) {
    console.log("ERROR", err);
  }
};

rl.question("What is the URL ? ", (url: string) => {
  rl.question("what is the company ? ", (company: string) => {
    rl.question("what is the job title? ", async (title: string) => {
      const currentJobInfo: JobInfo = {
        url,
        company,
        title,
        date: new Date(),
      };
      await writeToDb(currentJobInfo);

      rl.close();
    });
  });
});

rl.on("close", () => {
  console.log("\nBYE BYE !!!");
  process.exit(0);
});
