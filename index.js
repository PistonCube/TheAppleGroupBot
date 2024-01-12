import chalk from 'chalk';
import mineflayer from 'mineflayer';
import fs from 'fs';
import { Client as DiscordClient, GatewayIntentBits } from 'discord.js';

const config = JSON.parse(fs.readFileSync('config.json', 'utf-8'));

const bot = mineflayer.createBot({
  host: config.host,
  port: config.port,
  username: config.username,
  version: config.version,
});

const discordClient = new DiscordClient({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

discordClient.login(config.token);

const joinDiscordMessages = [
  `> ¡Hola! Soy el bot de ${config.clan}. ¡Únete a nuestro Discord en ${config.discord}`,
  `> ¿Ya conoces nuestro Discord? ¡Es genial! ${config.discord}`,
  `> ¡Hey! Si aún no lo has hecho, únete a nuestro Discord en ${config.discord}`,
  `> ¡Saludos! ¿Sabías que tenemos un Discord increíble? ¡Únete ya! ${config.discord}`,
  `> ¡Hola, soy el bot de ${config.clan} Codeado Por PistonCube y te invito a unirte a nuestro Discord! ${config.discord}`,
];

function sendRandomJoinDiscordMessage() {
  const randomIndex = Math.floor(Math.random() * joinDiscordMessages.length);
  const randomMessage = joinDiscordMessages[randomIndex];
  bot.chat(randomMessage);
}

setInterval(sendRandomJoinDiscordMessage, 20000);

bot.on('message', (msg) => {
  let m = msg.toString();

  // Obtener el nombre del jugador que envió el mensaje
  const playerName = msg.extra && msg.extra.length > 0 ? msg.extra[0].text : null;

  if (m.match('/login')) {
    bot.chat(`/login ${config.password}`);
  } else if (m.match('/register')) {
    bot.chat(`/register ${config.password} ${config.password}`);
  } else if (m.toLowerCase().includes('!discord') && playerName) {
    // Enviar un mensaje privado al jugador con la URL del Discord
    bot.chat(`/msg ${playerName} ¡Bienvenido! Puedes unirte a nuestro Discord en ${config.discord}`);

  }

  // Envía el mensaje a Discord
  const channel = discordClient.channels.cache.get(config.discordChannelId);
  if (channel) {
    channel.send(`Minecraft: ${m}`);
  }
});

bot.once('spawn', () => {
  console.log(chalk.green('Bot created by PistonCube'));
  bot.chat(`¡Hola, soy ${config.username}!`);
  console.log(chalk.blue(`Estoy Online en ${config.host}`));
});

bot.on('kicked', (reason) => {
  console.error(chalk.red('Kicked:'), reason);
});

bot.on('error', (err) => {
  console.error(chalk.red('Bot error:'), err);
});

bot.on('end', () => {
  console.log(chalk.red('Bot disconnected'));
});
