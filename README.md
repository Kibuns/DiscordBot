# Case
While working on our group project, we noticed that one particular group member called Sem made a lot of random noises and weird quotes while on Discord,
seemingly out of nowhere. The rest of the group quickly got used to this. But what would happen if [Sem](https://github.com/Semm6) got sick? We wouldn't survive without his ear penetrating harsh sounds and quotes.
That's when I came up with the idea for SemBot.

## SemBot
SemBot Is a node Discord bot which simulates Sem being in your voice channel. The bot can come into your voice channel and play random files at random intervals.

## Get Started
To get started working on this project, please go to the [contributing](https://github.com/Kibuns/DiscordBot/blob/master/CONTRIBUTING.md) document.

### Setup

prerequisites:
- [ffmpeg](https://ffmpeg.org/download.html) installed : [tutorial](https://www.youtube.com/results?search_query=how+to+install+ffmpeg)
- a discord application, with all message and voice channel permisions: [tutorial](https://youtu.be/j_sD9udZnCk?t=522)

When cloning the project, create a "mp3" folder. and a .env file to put your discord application token inside of. Next, add some mp3 files that the bot will play at random. then pick one of those files` paths to be the path for the welcome message. This file will be playes as soon as the bot joins your voice channel

## Functionality

`/join`: Joins you if you're in a voice channel, greets you with a welcome message.

`/play <query>`: Searches your mp3 folder and plays the .mp3 file who's file name is most similar to your search query

`/random`:  Plays a random file from the mp3 folder in a random interval between `min` and `max` seconds, (these values are currently still hardcoded).
