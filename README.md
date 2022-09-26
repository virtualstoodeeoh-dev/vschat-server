# Virtual Stoodeeoh - VSChat Server

Allows you to create a chat server with MongoDB and Express for VSChat Clients.

## Requirements

- Express Server
- MongoDB database

## Install

```
npm i @vstoodeeoh/vschat-server
```

## Initialize VSChat

```
const vsChat = require("vs-chat-server");
const express = require("express");
const cors = require("cors");

const app = express();
vsChat.init(app, "mongodb://localhost:27017/chatAppTest", "secret_key"); // Express app, MongoDB con string, secret key

// Middlewares
app.use(cors({ credentials: true, origin: true }));
app.use(express.json({ limit: "50mb" }));

vsChat.listen(8900); // Socket Port Number

app.listen(process.env.PORT || 5555, () => {
  console.log("Server running on port " + 5555);
});
```

## Parameters

### init

- Express Server (Required)
- MongoDB URI (Required)
- Secret Key (Required) // Client's will require this key to access.

### listen

- Socket Port (Required)

## Notes

That's all that required to get started with setting up the chat server.

[Virtual Stoodeeoh Inc.](https://pages.github.com/)
