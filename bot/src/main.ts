import { config } from "dotenv";
config();

import * as TelegramBot from "node-telegram-bot-api";
import * as express from "express";
import * as bodyParser from "body-parser";
import { generateMessage, messageCreatePayment, messageReserveTable, messageReturnPayment } from "./services/generateMessage/generateMessage.service";
import { OrganizationRepository } from "./repository/organization.repository";
import { connection } from "./db/connection";
const expressAccessToken = require('express-access-token');
const app = express();

//1858418208:AAEYdcVa3DEScKZd63BGrEa08nj4_hRjtdc
//5298758359:AAEuosP07NVoy67XQBSBeRUyQ56_niJsq08

// new 5298758359:AAHwrFD23e_RBUSXmimi72p5wI8MZtLYGTg
// хинкалыч 5298758359:AAEwUrxQnV4M1vpKXAHzK8_uqVXO8nWaFbo
// тест бот 1858418208:AAHbGAeh6mG-XYsASrs7f_CRgxt4OMnmduw

const bot = new TelegramBot("5298758359:AAEwUrxQnV4M1vpKXAHzK8_uqVXO8nWaFbo", { polling: true });

app.use(bodyParser());

const accessTokens = [
	process.env.TOKEN
];
const firewall = (req, res, next) => {
  const authorized = accessTokens.includes(req.accessToken);
  if(!authorized) return res.status(403).send('Forbidden');
  next();
};


// attaching to route group
app.use(
  expressAccessToken, // attaching accessToken to request
  firewall, // firewall middleware that handles uses req.accessToken
);



app.post("/sendDuplicate/:organizationId", async (req, res) => {
    const organization = req.params.organizationId;
    const body = req.body;
    const organizationDoc = await OrganizationRepository.getOne(organization);

    console.log(body,organization,organizationDoc)
    if (!organizationDoc) {
        return res.status(200).json({
            haveProblem: true,
            message: "Organization not found"
        });
    }
    

    const message = generateMessage(body);

    await bot.sendMessage(organizationDoc.chat, message);

    res.status(200).json({ haveProblem: false, message: "Message is send" });
});


app.post("/reserveTable/:organizationId", async (req, res) => {
  const organization = req.params.organizationId;
  const body = req.body;
  const organizationDoc = await OrganizationRepository.getOne(organization);

  console.log(body,organization,organizationDoc)
  if (!organizationDoc) {
      return res.status(200).json({
          haveProblem: true,
          message: "Organization not found"
      });
  }
  

  const message = messageReserveTable(body);

  await bot.sendMessage(organizationDoc.chat, message);

  res.status(200).json({ haveProblem: false, message: "Message is send" });
});


app.post("/payment/:organizationId", async (req, res) => {
  const organization = req.params.organizationId;
  const body = req.body;
  const organizationDoc = await OrganizationRepository.getOne(organization);

  if (!organizationDoc) {
      return res.status(200).json({
          haveProblem: true,
          message: "Organization not found"
      });
  }
  

  const message = messageCreatePayment(body)

  await bot.sendMessage(organizationDoc.chat, message);

  res.status(200).json({ haveProblem: false, message: "Message is send" });
});


app.post("/return_payment/:organizationId", async (req, res) => {
  const organization = req.params.organizationId;
  const body = req.body;
  const organizationDoc = await OrganizationRepository.getOne(organization);


  if (!organizationDoc) {
      return res.status(200).json({
          haveProblem: true,
          message: "Organization not found"
      });
  }
  

  const message = messageReturnPayment(body)

  await bot.sendMessage(organizationDoc.chat, message);

  res.status(200).json({ haveProblem: false, message: "Message is send" });
});

app.post("/canselpayment/:organizationId", async (req, res) => {
  const organization = req.params.organizationId;
  const body = req.body;
  const organizationDoc = await OrganizationRepository.getOne(organization);


  if (!organizationDoc) {
      return res.status(200).json({
          haveProblem: true,
          message: "Organization not found"
      });
  }
  

  const message = messageReturnPayment(body)

  await bot.sendMessage(organizationDoc.chat, message);

  res.status(200).json({ haveProblem: false, message: "Message is send" });
});


bot.onText(/\/reg (.+)/i, async (msg, match) => {
    const chatId = msg.chat.id;

  const organizationDoc = await OrganizationRepository.getOne(match[1]);
  console.log(organizationDoc,chatId)

    if (organizationDoc) {
        return bot.sendMessage(
            chatId,
            "Данная организация уже зарегистрирована в боте"
        );
    }

    await OrganizationRepository.register(chatId, match[1]);

    bot.sendMessage(chatId, "Ваше заведение успешно зарегистрированно");
});

bot.onText(/\/del (.+)/i, async (msg, match) => {
    const chatId = msg.chat.id;
    const organization = match[1];

    if (!organization) {
        return bot.sendMessage(chatId, "Заданная организация пуста");
    }

    const result = await OrganizationRepository.removeOne(chatId, match[1]);
    if (result.deletedCount === 0) {
        return bot.sendMessage(chatId, "Нечего удалять");
    }
    bot.sendMessage(chatId, "Успешно удалено");
});

connection().then(() => {
    app.listen(process.env.PORT, () => {
        console.log("start");
    });
});
