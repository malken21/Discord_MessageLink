const { Client, GatewayIntentBits, Partials, WebhookClient } = require("discord.js");
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ], partials: [Partials.Channel]
});

const { TOKEN, Links } = require("./Config.json");

const Items = Links.map(item => {
    const split = item.WebHook.split("/");
    item.webhookToken = split.at(-1);
    item.webhookID = split.at(-2);
    return item;
});
console.log(Items)

client.on("ready", () => {
    console.log(`login: (${client.user.tag})`);
});

client.on('messageCreate', message => {
    Items.forEach((item) => {
        if (message.guildId === item.Guild_ID && message.channelId === item.Channel_ID) {
            if (!item.bot && message.author.bot) return;
            const send = {};

            send.content = message.content;
            send.username = message.author.username;
            send.avatarURL = message.author.avatarURL();
            send.tts = message.tts;
            send.embeds = message.embeds;
            send.components = message.components;
            const webhookClient = new WebhookClient({ id: item.webhookID, token: item.webhookToken });

            console.log(send)
            if (send.content != "" || send.embeds.length != 0 || send.attachments.length != 0)
                webhookClient.send(send);
            return;
        }
    });
});

client.login(TOKEN);