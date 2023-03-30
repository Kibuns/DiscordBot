# Case
While working on our group project, we noticed that one particular group member called Sem made a lot of random noises and weird quotes while on Discord,
seemingly out of nowhere. The rest of the group quickly got used to this. But what would happen if [Sem](https://github.com/Semm6) got sick? We wouldn't survive without his ear penetrating harsh sounds and quotes.
That's when I came up with the idea for SemBot.

## SemBot
SemBot Is a node Discord bot which simulates Sem being in your voice channel. The bot can come into your voice channel and play random files at random intervals.

## Functionality

`/join`: Joins you if you're in a voice channel, greets you with a welcome message.

`/play <query>`: Searches your mp3 folder and plays the .mp3 file who's file name is most similar to your search query

`/random`:  Plays a random file from the mp3 folder in a random interval between `min` and `max` seconds, (these values are currently still hardcoded).
