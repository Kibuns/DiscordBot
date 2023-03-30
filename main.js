const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  AudioPlayerStatus,
  NoSubscriberBehavior,
  AudioResource,
  VoiceConnectionStatus,
} = require("@discordjs/voice");

const Discord = require("discord.js");
const fs = require("fs");
const { join } = require("path");
require("dotenv").config();

const client = new Discord.Client({
  intents: [
    Discord.IntentsBitField.Flags.Guilds,
    Discord.IntentsBitField.Flags.GuildMembers,
    Discord.IntentsBitField.Flags.GuildMessages,
    Discord.IntentsBitField.Flags.MessageContent,
    Discord.IntentsBitField.Flags.GuildVoiceStates,
  ],
});
const joinCommand = "/joinMeSem";
const player = createAudioPlayer();
var interval = 3000;
var min = 180;
var max = 400;
var RandomPlaysIntervals;
var connected = false;
var connection;
var playing = false;
var previousFile = "Welkom.mp3";

client.once("ready", () => {
  console.log("ONLINE!!");
});

const startRandomPlay = (connection) => {
  interval = 1500;

  const mp3Files = fs
    .readdirSync("./mp3")
    .filter((file) => file.endsWith(".mp3"))
    .filter((file) => !file.includes("welkom"));

  if (mp3Files.length === 0) {
    console.log("No MP3 files found in the 'mp3_files' directory");
    return;
  }
  playing = true;
  playRandomFilesOnRepeat(mp3Files);
};

const playRandomFilesOnRepeat = (files) => {
  // RandomPlaysIntervals = setInterval(() => {
  //   const randomFile = files[Math.floor(Math.random() * files.length)];
  //   console.log(randomFile);
  //   playResource("./mp3/" + randomFile);
  //   interval = min + Math.floor(Math.random() * max);
  // }, interval);
  setTimeout(() => {
    if (!playing) return;
    interval = min * 1000 + Math.floor(Math.random() * ((max - min) * 1000));
    console.log("next clip will start in %d seconds", interval / 1000);
    var randomFile = files[Math.floor(Math.random() * files.length)];
    while (randomFile === previousFile) {
      randomFile = files[Math.floor(Math.random() * files.length)];
    }
    previousFile = randomFile;
    console.log(randomFile);
    playResource("./mp3/" + randomFile);
    playRandomFilesOnRepeat(files);
  }, interval);
};

client.on("messageCreate", async (message) => {
  if (message.author.bot) {
    return;
  }

  if (message.content.startsWith("/play")) {
    if (!connected) {
      message.reply(
        `I'm not in the voice channel yet. Bimbo! Use '${joinCommand}' if you want me to join.`
      );
      return;
    }
    startRandomPlay(connection);
  }

  if (message.content.startsWith("/stop")) {
    if (!connected) {
      message.reply(
        `What do you mean stop? I am not even in your voice channel. Fucking Bimbo. Use '${joinCommand}' if you want me to join.`
      );
      return;
    }
    console.log("stop playing");
    playing = false;
  }
  if (message.content.startsWith(joinCommand)) {
    if (!message.member.voice.channel) {
      message.reply("You need to join a voice channel first. Bimbo!");
      return;
    }
    connection = joinVoiceChannel({
      channelId: message.member.voice.channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator,
    });
    connection.subscribe(player);
    message.reply("joined your channel!");
    connected = true;
    console.log("clear");
    clearInterval(RandomPlaysIntervals);

    playResource("./mp3/welkom.mp3"); //welcome message
  }
});

player.on(AudioPlayerStatus.Playing, () => {
  console.log("The audio player has started playing!");
});

client.login(process.env.CLIENT_KEY);

const playResource = async (path) => {
  player.play(createAudioResource(path));
};
