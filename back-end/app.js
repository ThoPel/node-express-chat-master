require("dotenv").config();
const express = require("express");
const schemaMessage = require("./models/message");
const schemaUser = require("./models/user");

// export one function that gets called once as the server is being initialized
module.exports = function(app, server) {
  const mongoose = require("mongoose");
  mongoose
    .connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_URL}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
      { useNewUrlParser: true, useUnifiedTopology: true }
    )
    .then(() => console.log("DB is OK"))
    .catch(() => console.log("DB failed"));

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "*");
    next();
  });

  app.use(express.json());

  const io = require("socket.io")(server, {
    cors: {
      origin: "http://127.0.0.1:5500",
      methods: ["GET", "POST"],
    },
  });

  require("./socket/chat")(io);

  app.use(function(req, res, next) {
    req.io = io;
    next();
  });

  app.get("/messages", (req, res, next) => {
    schemaMessage
      .find()
      .then((messages) => res.status(200).json(messages))
      .catch((error) => res.status(400).json({ error }));
  });

  app.post('/messages/new', (req, res, next) => {
    const message = new schemaMessage({...req.body});
    message.save().then(() => {
      res.status(201).json({
        message: 'Message envoyé'
      })
    }).catch((error) => {
      res.status(400).json({error})
    })
  });


  app.get("/users", (req, res, next) => {
    schemaUser
      .find()
      .then((users) => res.status(200).json(users))
      .catch((error) => res.status(400).json({ error }));
  });

  app.post('/users/new', (req, res, next) => {
    const user = new schemaUser({...req.body});
    user.save().then(() => {
      res.status(201).json({
        message: 'Utilisateur créé'
      })
    }).catch((error) => {
      res.status(400).json({error})
    })
  });
};
