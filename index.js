#!/usr/bin/env node
import boxen from "boxen";
import chalk from "chalk";
import inquirer from "inquirer";
import { readFile } from "fs/promises";
import { EventEmitter } from "events";
const eventEmitter = new EventEmitter();
const missionsJson = JSON.parse(
  await readFile(new URL("./missions.json", import.meta.url))
);

eventEmitter.on("wf-init", (bool) => {
  console.clear();
  if (bool) {
    console.log("Welcome to Warframe-Cli-Status");
  }
});
eventEmitter.emit("wf-init", true);
// api endpoint
// api endpoint https://api.warframestat.us/pc/{missiontype}/queries

eventEmitter.on("userInput", callWarframeApi);

async function getUserInputs() {
  const input = inquirer.prompt({
    name: "input",
    type: "list",
    message: `Please Pick a Mission type to get it's current status`,
    choices: missionsJson,
  });
  const userInput = await input;
  console.log(userInput);
  eventEmitter.emit("userInput", userInput);
}

async function callWarframeApi(type, queries = { language: "en" }) {
  console.log(type);
  const endPoint = await fetch(`https://api.warframestat.us/pc/${type.input}`);
  const jsonData = await endPoint.json();
  console.log(jsonData);
  return jsonData;
}
getUserInputs();
