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
const languageJson = JSON.parse(
  await readFile(new URL("./language.json", import.meta.url))
);

eventEmitter.on("wf-init", (bool) => {
  console.clear();
  if (bool) {
    console.log(boxen('Warframe Cli Status',{padding:1}));
    getUserInputs();
  }
});

eventEmitter.emit("wf-init", true);
eventEmitter.on("userInput", callWarframeApi);

async function getUserInputs() {
  const missionTypes = missionsJson.map((mission) => {
    return Object.keys(mission)[0];
  });
  const input = await inquirer.prompt({
    name: "input",
    type: "list",
    message: `Please Pick a Mission type to get it's current status`,
    choices: missionTypes,
  });

  const languageQuery = await inquirer.prompt({
    name: "language",
    type: "list",
    message: "Select language [default: 'en']",
    choices: languageJson,
  });

  const missionInput = await input;
  const userInput = missionsJson.filter(
    (mission) => mission[missionInput.input]
  )[0];
  const inputsObject = { userInput, queries: { ...languageQuery } };
  console.log(inputsObject);
  eventEmitter.emit("userInput", inputsObject);
}

async function callWarframeApi({ userInput, queries }) {
  const missionType = Object.values(userInput)[0];
  const missionName = Object.keys(userInput)[0];

  const spinner = createSpinner(
    `Fetching Current ${missionName} Status...`
  ).start();
  try {
    const endPoint = await fetch(
      `https://api.warframestat.us/pc/${missionType}?language=${queries.language}`
    );
    const jsonData = await endPoint.json();
    console.log(jsonData);
    spinner.success({ text: `Here's the current status for ${missionName}` });
    return jsonData;
  } catch (err) {
    spinner.error({ text: `Unable to fetch curretn warframe status` });
    throw err;
  }
}
