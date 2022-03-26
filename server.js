// Require das dependencias instaladas (express, path e socket.io)
const express = require("express");
const path = require("path");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server);

// Configuração do servidor para usar o arquivo index.html
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "public"));
app.engine("html", require("ejs").renderFile);
app.set("view engine", "html");

// Configuração do servidor para renderizar no index.html
app.use("/", (req, res) => {
  res.render("index.html");
});

// Criaçao de um array de mensagens
let messages = [];

// Configuração do servidor para receber as mensagens
io.on("connection", (socket) => {
  console.log("New user connected");

  // Armazenando as mensagens enviadas, para retornar caso o usuário der refresh na página. Vale lembrar que se o servidor for reiniciado, as mensagens não serão mais exibidas.
  socket.emit("previousMessages", messages);

  // Recebendo as mensagens do usuário
  socket.on("sendMessage", (data) => {
    messages.push(data);
    socket.broadcast.emit("receivedMessage", data);
  });
});

// Configuração do servidor para rodar na porta 3000
server.listen(3000);
