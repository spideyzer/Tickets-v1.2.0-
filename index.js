require("dotenv").config();
const {
    Client,
    GatewayIntentBits,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
    PermissionsBitField,
} = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.MessageContent,
    ],
});

const ticketCategories = {
    support: {
        categoryId: process.env.SUPPORT_CATEGORY_ID,
        logChannel: process.env.SUPPORT_LOG_CHANNEL_ID,
        roleId: process.env.SUPPORT_ROLE_ID,
    },
    creators: {
        categoryId: process.env.CREATORS_CATEGORY_ID,
        logChannel: process.env.CREATORS_LOG_CHANNEL_ID,
        roleId: process.env.CREATORS_ROLE_ID,
    },
    packs: {
        categoryId: process.env.PACKS_CATEGORY_ID,
        logChannel: process.env.PACKS_LOG_CHANNEL_ID,
        roleId: process.env.PACKS_ROLE_ID,
    },
    dev: {
        categoryId: process.env.DEV_CATEGORY_ID,
        logChannel: process.env.DEV_LOG_CHANNEL_ID,
        roleId: process.env.DEV_ROLE_ID,
    },
    report_admin: {
        categoryId: process.env.REPORT_ADMIN_CATEGORY_ID,
        logChannel: process.env.REPORT_ADMIN_LOG_CHANNEL_ID,
        roleId: process.env.REPORT_ADMIN_ROLE_ID,
    },
    player_report: {
        categoryId: process.env.PLAYER_REPORT_CATEGORY_ID,
        logChannel: process.env.PLAYER_REPORT_LOG_CHANNEL_ID,
        roleId: process.env.PLAYER_REPORT_ROLE_ID,
    },
};

const universalAdminRole = "1332722914746830961"; // Replace with actual admin role ID

client.once("ready", () => {
    console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isButton()) return;

    const categoryKey = interaction.customId.replace("ticket_", "");
    if (ticketCategories[categoryKey]) {
        await createTicket(interaction, categoryKey);
    } else if (interaction.customId.startsWith("claim_")) {
        await claimTicket(interaction);
    } else if (interaction.customId.startsWith("close_")) {
        await closeTicket(interaction);
    }
});

async function createTicket(interaction, categoryKey) {
    const { categoryId, logChannel, roleId } = ticketCategories[categoryKey];

    const ticketChannel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        type: 0, // Text channel
        parent: categoryId,
        permissionOverwrites: [
            {
                id: interaction.guild.id,
                deny: [PermissionsBitField.Flags.ViewChannel],
            },
            {
                id: interaction.user.id,
                allow: [
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.SendMessages,
                ],
            },
            {
                id: roleId,
                allow: [
                    PermissionsBitField.Flags.ViewChannel,
                    PermissionsBitField.Flags.SendMessages,
                ],
            },
        ],
    });

    const embed = new EmbedBuilder()
        .setTitle("🎫 Ticket Created")
        .setDescription(
            `Hello <@${interaction.user.id}>, a support team member will assist you soon.`,
        )
        .setColor(0x2ecc71);

    const buttons = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
            .setCustomId(`claim_${ticketChannel.id}`)
            .setLabel("Claim")
            .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
            .setCustomId(`close_${ticketChannel.id}`)
            .setLabel("Close")
            .setStyle(ButtonStyle.Danger),
    );

    await ticketChannel.send({
        content: `<@&${roleId}>`,
        embeds: [embed],
        components: [buttons],
    });

    const logEmbed = new EmbedBuilder()
        .setTitle("📩 Ticket Opened")
        .setDescription(`User <@${interaction.user.id}> created a ticket.`)
        .setColor(0xf1c40f);

    const logChannelObj = await interaction.guild.channels.fetch(logChannel);
    if (logChannelObj) {
        logChannelObj.send({ embeds: [logEmbed] });
    }

    await interaction.reply({
        content: `✅ Ticket created: ${ticketChannel}`,
        ephemeral: true,
    });
}

async function claimTicket(interaction) {
    const ticketChannel = interaction.channel;
    const user = interaction.user;
    const member = await interaction.guild.members.fetch(user.id);

    const category = Object.values(ticketCategories).find(
        (cat) => ticketChannel.parentId === cat.categoryId,
    );
    if (!category)
        return interaction.reply({
            content: "⚠ Unable to identify category.",
            ephemeral: true,
        });

    const hasPermission =
        member.roles.cache.has(category.roleId) ||
        member.roles.cache.has(universalAdminRole);
    if (!hasPermission) {
        return interaction.reply({
            content: "❌ You do not have permission to claim this ticket.",
            ephemeral: true,
        });
    }

    await ticketChannel.send({
        content: `✅ Ticket claimed by <@${user.id}>.`,
    });

    const logEmbed = new EmbedBuilder()
        .setTitle("✅ Ticket Claimed")
        .setDescription(`Ticket claimed by <@${user.id}>.`)
        .setColor(0x3498db);

    const logChannel = await interaction.guild.channels.fetch(
        category.logChannel,
    );
    if (logChannel) logChannel.send({ embeds: [logEmbed] });

    interaction.reply({
        content: "🎟 Ticket successfully claimed.",
        ephemeral: true,
    });
}

async function closeTicket(interaction) {
    const ticketChannel = interaction.channel;
    const category = Object.values(ticketCategories).find(
        (cat) => ticketChannel.parentId === cat.categoryId,
    );
    if (!category)
        return interaction.reply({
            content: "⚠ Unable to identify category.",
            ephemeral: true,
        });

    const messages = await ticketChannel.messages.fetch({ limit: 100 });
    let transcriptText = `Transcript for ${ticketChannel.name}\n\n`;

    messages.reverse().forEach((msg) => {
        const timestamp = new Date(msg.createdTimestamp).toLocaleString();
        transcriptText += `[${timestamp}] ${msg.author.tag}: ${msg.content}\n`;
    });

    const transcriptPath = path.join(
        __dirname,
        `transcript-${ticketChannel.id}.txt`,
    );
    fs.writeFileSync(transcriptPath, transcriptText);

    const logEmbed = new EmbedBuilder()
        .setTitle("❌ Ticket Closed")
        .setDescription(`Ticket closed by <@${interaction.user.id}>.`)
        .setColor(0xe74c3c);

    const logChannel = await interaction.guild.channels.fetch(
        category.logChannel,
    );
    if (logChannel) {
        await logChannel.send({ embeds: [logEmbed] });
        await logChannel.send({ files: [transcriptPath] });
    }

    await ticketChannel.delete();
    fs.unlinkSync(transcriptPath);
}

client.login(process.env.TOKEN);
