const express = require("express");
const router = express.Router();
const app = express();
const bodyParser = require("body-parser");
const fs = require("fs");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Authorization, Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

router.get("/dir", async (req, res, next) => {
  try {
    const dirStructure = await iterateAllTheDir(req.query.path);
    // console.log(req.params)
    return res.send(dirStructure);
  } catch (e) {
    res.status(500);
    return res.json({ message: "internal server error" });
  }
});

app.use(router);

app.listen(8000, () => {
  console.log("port started on 8000");
});

const mainDir = "/home/bakhtiyar";

async function iterateAllTheDir(dirName) {
  const structure = {
    dirName,
    children: [],
  };
  const files = await new Promise((resolve, reject) => {
    fs.readdir(dirName, async (err, files) => {
      resolve(files);
    });
  });
  for (let i = 0; i < files.length; i++) {
    try {
      if (fs.statSync(`${dirName}/${files[i]}`).isFile()) {
        structure.children.push({
          path: `${dirName}/${files[i]}`,
          isDir: false,
          dirName: files[i],
        });
      } else {
        structure.children.push({
          path: `${dirName}/${files[i]}`,
          isDir: true,
          dirName: files[i],
        });
      }
    } catch (error) {}
  }
  return structure;
}
