// Obtain the Discord objects
const fs = require('node:fs');
const { Client, Collection, Intents } = require('discord.js');
const { channelId, token }  = require("./config.json");

// Create the client: Configure the initial intents so the bot can interact
const client  = new Client({intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_MEMBERS]});

// Configure all possible commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

// To say hello once online
client.on('ready', () => {
    var channel = client.channels.cache.get(channelId);
    channel.send("Hola a todos. CasualBot is back in town!").then (msg => { 
        msg.react("807249991528874035");
        msg.react("875011686459920454");
        msg.react("853591135708512286");
    });

});

// Command management
client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		await interaction.reply({ content: '¡Oh, no! No se ha podido ejecutar el comando :C', ephemeral: true });
        console.error(error);		
	}
});

// Answers to the word "ping"
client.on('messageCreate', message => {
    if(message.content.toLowerCase() == "ping") {
        message.reply("pong");
        message.react(message.guild.emojis.cache.find(emoji => emoji.name === "hellmo"));
    }
    if(message.content.toLowerCase() == "pong" && !message.author.bot) {
        message.reply("¡tolón tolón!");
        message.react(message.guild.emojis.cache.find(emoji => emoji.name === "zhonglilaugh"));
    }
});

// Welcome new members and put basic role
client.on('guildMemberAdd', (member) => {
    var channel = client.channels.cache.get(channelId);
    var welcomeMsg = "Bienvenid@, " + member.nickname + ". ¡Que te diviertas!";
    channel.send(welcomeMsg);
    try {
        member.roles.add('338038924725190676');
        
    } catch(e) {
        channel.send("Oh... parece que no tengo permisos para darte un rol. Contacta con alguna administradora, a ver si nos puede solucionar esto. Lo siento :C");
    }    
});

// Connect the client
client.login(token);