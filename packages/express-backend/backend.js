// import express from "express";
// import cors from "cors";

// const app = express();
// const port = 6500;
// const users = {
//     users_list: [
//       {
//         id: "xyz789",
//         name: "Charlie",
//         job: "Janitor"
//       },
//       {
//         id: "abc123",
//         name: "Mac",
//         job: "Bouncer"
//       },
//       {
//         id: "ppp222",
//         name: "Mac",
//         job: "Professor"
//       },
//       {
//         id: "yat999",
//         name: "Dee",
//         job: "Aspring actress"
//       },
//       {
//         id: "zap555",
//         name: "Dennis",
//         job: "Bartender"
//       }
//     ]
//   };

// app.use(cors());
// app.use(express.json());

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });
// app.get("/users", (req, res) => {
//     res.send(users);
//   });
// const findUserByName = (name) => {
//     return users["users_list"].filter(
//       (user) => user["name"] === name
//     );
//   };
// const generateRandomId = () => {
//   // Generate a random number and convert it to a hexadecimal string
//   return Math.random().toString(36).substr(2, 9);
// };
// const addUser = (user) => {
// // users["users_list"].push(user);
// // return user;
// const randomId = generateRandomId();//Generate ID on server
// const userWithId = { ...user, id: randomId }; //Generate ID on server
// users["users_list"].push(userWithId);//Generate ID on server
// return userWithId;//Generate ID on server
// };
// const findUserById = (id) =>
//     users["users_list"].find((user) => user["id"] === id);

// app.get("/users", (req, res) => {
// const name = req.query.name;
// if (name != undefined) {
//     let result = findUserByName(name);
//     result = { users_list: result };
//     res.send(result);
// } else {
//     res.send(users);
// }
// });
// const findUserByNameAndJob = (name, job) => {
//     return users["users_list"].filter(
//       (user) => user["name"] === name && user["job"] === job
//     );
//   };
  
//   app.get("/users&job", (req, res) => {
//     const name = req.query.name;
//     const job = req.query.job;
//     if (name !== undefined && job !== undefined) {
//       let result = findUserByNameAndJob(name, job);
//       result = { users_list: result };
//       res.send(result);
//     } else {
//       res.send(users);
//     }
//   });
// app.get("/users/:id", (req, res) => {
//     const id = req.params["id"]; //or req.params.id
//     let result = findUserById(id);
//     if (result === undefined) {
//       res.status(404).send("Resource not found.");
//     } else {
//       res.send(result);
//     }
//   });

// app.post("/users", (req, res) => {
// const userToAdd = req.body;
// // addUser(userToAdd);
// // res.send();
// const addedUser = addUser(userToAdd); //part 4... use 201
// res.status(201).send(addedUser);//part 4... use 201
// });

// app.delete("/users/:id", (req, res) => {
//     const id = req.params.id;
//     const index = users.users_list.findIndex(user => user.id === id);
//     if (index !== -1) {
//       users.users_list.splice(index, 1);
//       res.status(204).send(`User with ID ${id} has been deleted.`);
//     } else {
//       res.status(404).send("Resource not found.");
//     }
//   });

// app.listen(port, () => {
//   console.log(
//     `Example app listening at http://localhost:${port}`
//   );
// });

import express from "express";
import cors from "cors";
import userService from "./user_service.js";

const app = express();
const port = 6903;
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", (req, res) => {
  const name = req.query["name"];
  const job = req.query["job"];
  userService
    .getUsers(name, job)
    .then((result) => {
      res.send({ users_list: result });
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("An error ocurred in the server.");
    });
});

app.get("/users/:id", (req, res) => {
  const id = req.params["id"];
  userService.findUserById(id).then((result) => {
    if (result === undefined || result === null)
      res.status(404).send("Resource not found.");
    else res.send({ users_list: result });
  });
});

app.post("/users", (req, res) => {
  const user = req.body;
  userService.addUser(user).then((savedUser) => {
    if (savedUser) res.status(201).send(savedUser);
    else res.status(500).end();
  });
});

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  if (name !== undefined && job !== undefined) {
    userService.findUserByNameAndJob(name, job)
      .then((result) => {
        res.send({ users_list: result });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("An error occurred in the server.");
      });
  } else {
    userService.getAllUsers()
      .then((users) => {
        res.send({ users_list: users });
      })
      .catch((error) => {
        console.log(error);
        res.status(500).send("An error occurred in the server.");
      });
  }
});


// DELETE user by ID
app.delete("/users/:id", (req, res) => {
  const id = req.params["id"];
  userService.deleteUserById(id)
    .then((result) => {
      if (result === undefined || result === null)
        res.status(404).send("Resource not found.");
      else 
        res.status(204).send("User deleted successfully.");
    })
    .catch((error) => {
      // Handle errors
      console.error("Error deleting user:", error);
      res.status(500).send("Internal Server Error");
    });
});


app.listen(port, () => {
  console.log(
    `Example app listening at http://localhost:${port}`
  );
});

