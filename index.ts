import express from "express";
import fs from "fs";
import path from "path";
import { User } from "./interfaces";

const app = express();
const port = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "views"));

app.use("/css", express.static(path.join(process.cwd(), "css")));
app.use("/images", express.static(path.join(process.cwd(), "images")));
app.use(express.urlencoded({ extended: true }));

function loadUsers(): User[] {
  const filePath = path.join(process.cwd(), "users.json");
  const fileContent = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent) as User[];
}

function getNumberParam(
  req: express.Request,
  res: express.Response,
  paramName: string
): number | null {
  const value = req.params[paramName];

  if (!value) {
    res.status(400).send(`Missing parameter: ${paramName}`);
    return null;
  }

  const numberValue = Number(value);

  if (Number.isNaN(numberValue)) {
    res.status(400).send(`Invalid parameter: ${paramName}`);
    return null;
  }

  return numberValue;
}

app.get("/", (req, res) => {
  let users = loadUsers();

  const search = (req.query.search as string) || "";
  const sort = (req.query.sort as string) || "name";
  const order = (req.query.order as string) || "asc";

  if (search) {
    users = users.filter((user) =>
      user.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  users.sort((a: any, b: any) => {
    if (a[sort] < b[sort]) return order === "asc" ? -1 : 1;
    if (a[sort] > b[sort]) return order === "asc" ? 1 : -1;
    return 0;
  });

  res.render("index", {
    users,
    search,
    sort,
    order,
  });
});

app.get("/user/:id", (req, res) => {
  const id = getNumberParam(req, res, "id");
  if (id === null) return;

  const users = loadUsers();
  const user = users.find((user) => user.id === id);

  if (!user) {
    return res.status(404).send("User not found");
  }

  res.render("detail", {
    user,
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});