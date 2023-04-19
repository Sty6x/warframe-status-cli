#!/usr/bin/env node
import boxen from "boxen";
import chalk from "chalk";
import inquirer from "inquirer";
import { readFile } from "fs/promises";
import { EventEmitter } from "events";

const eventEmitter = new EventEmitter();

eventEmitter.on("wf-init", (bool) => {
  console.clear();
  if (bool) {
    console.log("Welcome to Warframe-Cli-Status");
  }
});
eventEmitter.emit("wf-init", true);
// api endpoint
// api endpoint https://api.warframestat.us/pc/{missiontype}/queries

let userInput;
const missionsJson = JSON.parse(
  await readFile(new URL("./missions.json", import.meta.url))
);

async function getUserInputs() {
  const input = inquirer.prompt({
    name: "input",
    type: "list",
    message: `Please Pick a Mission type to get it's current status`,
    choices: missionsJson,
  });
  userInput = await input.input;
  console.log(userInput);
  return;
}
getUserInputs();

async function callWarframeApic(type, queries) {
  const endpoint = `https://api.warframestat.us/pc/${type}/${queries}`;
}
