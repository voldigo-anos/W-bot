const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

const CACHE = path.join(__dirname, "cache");
if (!fs.existsSync(CACHE)) fs.mkdirSync(CACHE, { recursive: true });

module.exports = {
  config: {
    name: "ytb",
    aliases: [],
    version: "1.1",
    author: "Neoaz 🐊 x Christus",
    countDown: 5,
    role: 0,
    category: "media",
    description: {
      en: "YouTube downloader"
    },
    nixPrefix: true,
    guide: {
      en: "{pn} -a <query>\n{pn} -v <query>"
    }
  },

  onStart: async function ({ sock, chatId, args, event, senderId, reply, prefix, commandName }) {
    const type = args[0];
    const query = args.slice(1).join(" ");

    if (!["-a", "-v"].includes(type) || !query) {
      return reply(`❌ Usage: ${prefix}${commandName} -a <query> ou -v <query>`);
    }

    try {
      const res = await axios.get(`https://neokex-dlapis.vercel.app/api/search?q=${encodeURIComponent(query)}`);
      const results = res.data.results.slice(0, 6);

      if (results.length === 0) return reply("❌ Aucun résultat trouvé.");

      let msg = "🎬 *Résultats YouTube*\n\n";

      results.forEach((v, i) => {
        msg += `${i + 1}. ${v.title}\n⏱ ${v.duration}\n\n`;
      });

      msg += "📩 Réponds avec un numéro (1-6)";

      const sent = await sock.sendMessage(chatId, {
        image: { url: results[0].thumbnail },
        caption: msg
      }, { quoted: event });

      global.NixBot.onReply.push({
        commandName: "ytb",
        messageID: sent.key.id,
        author: senderId,
        results,
        downloadType: type === "-a" ? "audio" : "video"
      });

    } catch (e) {
      console.error(e);
      reply("❌ Erreur lors de la recherche.");
    }
  },

  onReply: async function ({ sock, chatId, message, senderId, event }) {
    const repliedMsgId = event.message?.extendedTextMessage?.contextInfo?.stanzaId;
    if (!repliedMsgId) return;

    const data = global.NixBot.onReply.find(
      r => r.commandName === "ytb" && r.author === senderId && r.messageID === repliedMsgId
    );
    if (!data) return;

    const text = message.message?.conversation || message.message?.extendedTextMessage?.text || "";
    const choice = parseInt(text);

    if (isNaN(choice) || choice < 1 || choice > data.results.length) {
      return sock.sendMessage(chatId, { text: "❌ Choix invalide." }, { quoted: event });
    }

    const selected = data.results[choice - 1];

    const idx = global.NixBot.onReply.findIndex(r => r.messageID === data.messageID);
    if (idx !== -1) global.NixBot.onReply.splice(idx, 1);

    try {
      await sock.sendMessage(chatId, {
        delete: {
          remoteJid: chatId,
          fromMe: true,
          id: data.messageID
        }
      });
    } catch (e) {}

    const waitMsg = await sock.sendMessage(chatId, {
      text: `⏳ Téléchargement de "${selected.title}"...`
    }, { quoted: event });

    try {
      const dlRes = await axios.get(`https://neokex-dlapis.vercel.app/api/alldl?url=${encodeURIComponent(selected.url)}`);
      const pollUrl = dlRes.data[data.downloadType].downloadUrl;

      let streamUrl = null;

      for (let i = 0; i < 60; i++) {
        const statusRes = await axios.get(pollUrl);
        if (statusRes.data.status === "completed") {
          streamUrl = statusRes.data.viewUrl;
          break;
        }
        await new Promise(r => setTimeout(r, 1000));
      }

      if (!streamUrl) throw new Error("Timeout");

      const ext = data.downloadType === "audio" ? "mp3" : "mp4";
      const filePath = path.join(CACHE, `${Date.now()}.${ext}`);

      const fileRes = await axios.get(streamUrl, { responseType: "arraybuffer" });
      await fs.writeFile(filePath, Buffer.from(fileRes.data));

      await sock.sendMessage(chatId, {
        [data.downloadType === "audio" ? "audio" : "video"]: fs.readFileSync(filePath),
        mimetype: data.downloadType === "audio" ? "audio/mpeg" : "video/mp4",
        caption: selected.title
      }, { quoted: event });

      await sock.sendMessage(chatId, { delete: waitMsg.key });

      fs.remove(filePath).catch(() => {});
    } catch (e) {
      console.error(e);
      await sock.sendMessage(chatId, {
        text: "❌ Erreur lors du téléchargement.",
        edit: waitMsg.key
      });
    }
  }
};
