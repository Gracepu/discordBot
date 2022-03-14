const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('role')
		.setDescription('Añade un nuevo rol a un usuario')
		.addUserOption(option =>
			option.setName('user')
				.setDescription('Usuario afectado')
				.setRequired(true))
		.addRoleOption(option =>
			option.setName('role')
				.setDescription('El rol deseado')
				.setRequired(true)),
	async execute(interaction) {
		if(!interaction.member.permissions.has("MANAGE_ROLES")) return interaction.reply({ content: "¡No puedes hacer eso sin permisos! >:C", ephemeral: true});

		const user = interaction.options.getUser('user');
        const role = interaction.options.getRole('role');
		const member = interaction.guild.members.cache.get(user.id) || await interaction.guild.members.fetch(user.id).catch(err => {});
		const botRole = interaction.guild.me.roles.highest.position;	// guild.me -> bot info structure
		
		if(botRole <= role.position) return interaction.reply({content: "Oh... parece que no tengo permisos para cambiar a este rol. Lo siento :C", ephemeral: true});
		if(interaction.member.roles.highest.position <= member.roles.highest.position) return interaction.reply({ content: "¡OH NO! ¡¡UN INTENTO DE GOLPE DE ESTADO CONTRA " + user.username + "!! T^T"});
		if(member.roles.highest.position >= role.position) return interaction.reply({ content: "¿Pero qué haces, mi niño? Ese rol no le va a servir para nada @_@", ephemeral: true });

		member.roles.add(role.id);
		await interaction.reply("¡Rol de " + user.username + " cambiado a " + role.name + "!");
	},
};