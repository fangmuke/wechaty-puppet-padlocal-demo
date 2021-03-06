import {PuppetPadlocal} from "wechaty-puppet-padlocal";
import {Contact, Message, ScanStatus, Wechaty} from "wechaty";
import * as config from "config";
require('console-stamp')(console);

const host: string = config.get("padLocal.host");
const port: number = config.get("padLocal.port");
const token: string = config.get("padLocal.token");
const serverCAFilePath: string = config.get("padLocal.serverCAFilePath");

const puppet = new PuppetPadlocal({
    endpoint: `${host}:${port}`,
    token,
    serverCAFilePath
})

const bot = new Wechaty({
    name: "TestBot",
    puppet,
})

.on("scan", (qrcode: string, status: ScanStatus) => {
    if (status === ScanStatus.Waiting && qrcode) {
        const qrcodeImageUrl = ["https://api.qrserver.com/v1/create-qr-code/?data=", encodeURIComponent(qrcode)].join("");
        console.log("TestBot", `onScan: ${ScanStatus[status]}(${status}) - ${qrcodeImageUrl}`);
    } else {
        console.log("TestBot", `onScan: ${ScanStatus[status]}(${status})`);
    }
})

.on("login", (user: Contact) => {
    console.log("TestBot", `${user} login`);
})

.on("logout", (user: Contact, reason: string) => {
    console.log("TestBot", `${user} logout, reason: ${reason}`);
})

.on("message", async (message: Message) => {
    console.log("TestBot", `on message: ${message.toString()}`);
})


bot.start();

console.log("TestBot", "started.");
