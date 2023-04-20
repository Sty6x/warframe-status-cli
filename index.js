#!/usr/bin/env node
import boxen from "boxen";
import chalk from "chalk";
import inquirer from "inquirer";
import { readFile } from "fs/promises";
import { EventEmitter } from "events";
import { createSpinner } from "nanospinner";
const eventEmitter = new EventEmitter();
const missionsJson = JSON.parse(
  await readFile(new URL("./missions.json", import.meta.url))
);

eventEmitter.on("wf-init", (bool) => {
  console.clear();
  if (bool) {
    console.log("Welcome to Warframe-Cli-Status");
    getUserInputs();
  }
});

eventEmitter.emit("wf-init", true);
eventEmitter.on("userInput", callWarframeApi);

async function getUserInputs() {
  const missionTypes = missionsJson.map((mission) => {
    return Object.keys(mission)[0];
  });
  const input = inquirer.prompt({
    name: "input",
    type: "list",
    message: `Please Pick a Mission type to get it's current status`,
    choices: missionTypes,
  });
  const types = await input;
  const userInput = missionsJson.filter((mission) => mission[types.input])[0];
  console.log(userInput);
  eventEmitter.emit("userInput", userInput);
}

async function callWarframeApi(type, queries = { language: "en" }) {
  const missionType = Object.keys(type)[0];
  const spinner = createSpinner(
    `Fetching Current ${missionType} Status...`
  ).start();
  try {
    const endPoint = await fetch(
      `https://api.warframestat.us/pc/${type[missionType]}?language=${queries.language}`
    );
    const jsonData = await endPoint.json();
    console.log(jsonData);
    spinner.success({ text: `Here's the current status for ${missionType}` });
    return jsonData;
  } catch (err) {
    spinner.error({ text: `Unable to fetch curretn warframe status` });
    throw err;
  }
}
