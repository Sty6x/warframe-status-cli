#!/usr/bin/env node
import boxen from "boxen";
import inquirer from "inquirer";
import { readFile } from "fs/promises";
import { EventEmitter } from "events";
import { createSpinner } from "nanospinner";
const eventEmitter = new EventEmitter();
const missionsJson = JSON.parse(
	await readFile(new URL("./missions.json", import.meta.url))
);
const languagesJson = JSON.parse(
	await readFile(new URL("./languages.json", import.meta.url))
);

eventEmitter.on("wf-init", (isInit) => {
	console.clear();
	if (isInit) {
		console.log(boxen("WARFRAME EVENT STATUS CLI", { padding: 1 }));
		getUserInputs();
	}
});

eventEmitter.emit("wf-init", true);

async function getUserInputs() {
	const missionTypes = missionsJson.map((mission) => {
		return Object.keys(mission)[0];
	});
	const missionInput = await inquirer.prompt({
		name: "input",
		type: "list",
		message: `Select a mission type to get its current status`,
		choices: missionTypes,
	});

	const languageQuery = await inquirer.prompt({
		name: "language",
		type: "list",
		message: "Select language [default: 'en']",
		choices: languagesJson,
	});

	const missionData = await missionInput;
	const [mission] = missionsJson.filter(
		(missionJson) => missionJson[missionData.input]
	);
	console.log(mission);
	const inputsObject = {
		mission: { name: Object.keys(mission), type: Object.values(mission) },
		queries: { ...languageQuery },
	};
	console.log(inputsObject);
	eventEmitter.emit("userInput", inputsObject);
}

async function callWarframeApi({ mission: { name, type }, queries }) {
	console.log(name, type);
	const spinner = createSpinner(
		`Fetching current event status for ${name}...`
	).start();
	try {
		const endPoint = await fetch(
			`https://api.warframestat.us/pc/${type}?language=${queries.language}`
		);
		const jsonData = await endPoint.json();
		spinner.success({ text: `Current event status for ${name}` });
		return jsonData;
	} catch (err) {
		spinner.error({ text: `Unable to fetch current warframe status` });
		throw err;
	}
}

eventEmitter.on("userInput", displayEventStatus);
async function displayEventStatus(inputsObject) {
	const { mission, queries } = await inputsObject;
	const warframeEventStatus = await callWarframeApi({ mission, queries });
	console.log(warframeEventStatus);
}
