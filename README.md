# warframe-status-cli

Creating a cli to fetch and display current in-game status of the game warframe inside of the terminal, <br>
I built this cli tool because I spend most of the time inside the terminal, and it feels cumbersome to <br>
keep on looking up when or what is currently happening in warframe (mostly for eidolon hunts) on a separate browser.

## Installation and usage

```
$ npm install -g warframe-cli-status

//then run 'wf' in your terminal to get each event status' object data from warframe api

$ wf
┌───────────────────────────────┐
│                               │
│   WARFRAME EVENT STATUS CLI   │
│                               │
└───────────────────────────────┘
? Select a mission type to get its current status (Use arrow keys)
❯ all
  cetus (eidolon-hunts)
  archon
  sortie
  cambion-drift
  nightwave
  void-trader
(Move up and down to reveal more choices)
```

And that's it, you can choose which event you want to retrieve and pick a limited supported language.
