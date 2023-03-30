const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
} = require("@discordjs/voice");
require("dotenv").config();
const stringSimilarity = require("string-similarity");

const Discord = require("discord.js");
const fs = require("fs");
const { type } = require("os");

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
var interval;
var min = 10; //seconds
var max = 20; //seconds
var connected = false;
var connection;
var playing = false;
var previousFile = "Welkom.mp3";
var timeout;

client.once("ready", () => {
  console.log("ONLINE!!");
});

function toggleRandomPlay(shouldBePlaying) {
  if (!shouldBePlaying && typeof timeout !== undefined) {
    clearTimeout(timeout);
    playing = false;
    console.log("Stopped playing");
    return;
  }

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
}

const playRandomFilesOnRepeat = (files) => {
  //pick random file, non repeating
  var randomFile = files[Math.floor(Math.random() * files.length)];
  while (randomFile === previousFile) {
    randomFile = files[Math.floor(Math.random() * files.length)];
  }
  console.log("next clip will be %s,", randomFile);

  //interval
  interval = min * 1000 + Math.floor(Math.random() * ((max - min) * 1000));
  console.log("the clip will start in %d seconds", interval / 1000);

  //will start in {interval} ms
  timeout = setTimeout(() => {
    if (!playing) return;
    previousFile = randomFile; // set previousFile so it wont repeat
    playResource("./mp3/" + randomFile);
    playRandomFilesOnRepeat(files);
  }, interval);
};

client.on("messageCreate", async (message) => {
  if (message.author.bot) {
    return;
  }

  //play
  if (message.content.startsWith("/play")) {
    if (!connected) {
      message.reply(
        `I'm not in the voice channel yet. Bimbo! Use '${joinCommand}' if you want me to join.`
      );
    }

    const args = message.content.split(/ +/);
    args.shift(); //remove /play
    const command = args.join(" ").toLowerCase();

    if (command === "") {
      message.reply(
        "Bimbo! If you use `/play`, you need to put a search query after it. If you want me to just talk randomly, say `/random`"
      );
      return;
    }
    console.log(command);
    searchAndPlay(command);

    return;
  }

  if (message.content.startsWith("/random")) {
    if (!connected) {
      message.reply(
        `I'm not in the voice channel yet. Bimbo! Use ${joinCommand} if you want me to join.`
      );
      return;
    }
    message.reply(
      `Okay! I'll now say something every ${min} to '${max}' seconds.`
    );
    toggleRandomPlay(true);
  }

  //stop
  if (message.content.startsWith("/stop")) {
    if (!connected) {
      message.reply(
        `What do you mean stop? I am not even in your voice channel. Fucking Bimbo. Use '${joinCommand}' if you want me to join.`
      );
      return;
    }
    toggleRandomPlay(false);
  }

  //joinMeSem
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

    playResource("./mp3/welkom.mp3"); //welcome message
  }
});

client.login(process.env.CLIENT_KEY);

const playResource = async (path) => {
  player.play(createAudioResource(path));
};

function searchAndPlay(query) {
  //get all files
  const mp3Files = fs
    .readdirSync("./mp3")
    .filter((file) => file.endsWith(".mp3"));

  //sort the files based on query, from most like the query, to least like the query
  const sortedFiles = mp3Files.sort((fileA, fileB) => {
    const similarityA = stringSimilarity.compareTwoStrings(fileA, query);
    const similarityB = stringSimilarity.compareTwoStrings(fileB, query);
    return similarityB - similarityA;
  });

  //use PlayResource to play the most similar .mp3 file.
  const mostSimilarFile = sortedFiles[0];
  console.log(`Playing ${mostSimilarFile} based on query "${query}"`);
  playResource(`./mp3/${mostSimilarFile}`);
}
