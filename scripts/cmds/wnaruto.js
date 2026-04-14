const axios = require('axios');
const fs = require('fs');
const path = require('path');

const characters = [
  { name: "Naruto Uzumaki", power: 50, basic: "Rasengan 🌀", ultimate: "Multi-Clones + Rasengan Géant 🌪️" },
  { name: "Naruto (Mode Ermite)", power: 60, basic: "Rasengan Géant 🌪️", ultimate: "Futon Rasenshuriken 🌪️💨" },
  { name: "Naruto (Rikudo)", power: 70, basic: "Orbe Truth Seeker ⚫", ultimate: "Bijuu Mode Rasenshuriken 🦊🌪️" },
  { name: "Naruto (Baryon Mode)", power: 85, basic: "Punch Ultra Rapide ⚡", ultimate: "Explosion Chakra Nucléaire ☢️" },
  { name: "Sasuke Uchiha", power: 60, basic: "Chidori ⚡", ultimate: "Kirin ⚡🌩️" },
  { name: "Sasuke (Taka)", power: 65, basic: "Chidori Nagashi ⚡💧", ultimate: "Susano'o 💀" },
  { name: "Sasuke (Rinnegan)", power: 70, basic: "Amaterasu 🔥", ultimate: "Indra's Arrow ⚡🏹" },
  { name: "Kakashi Hatake", power: 60, basic: "Raikiri ⚡", ultimate: "Kamui 🌀" },
  { name: "Kakashi (DMS)", power: 75, basic: "Kamui Raikiri ⚡🌀", ultimate: "Susano'o Parfait 💠" },
  { name: "Minato Namikaze", power: 80, basic: "Hiraishin Rasengan ⚡🌀", ultimate: "Mode Kyuubi 🦊" },
  { name: "Hashirama Senju", power: 70, basic: "Foret Naissante 🌳", ultimate: "Art Senin 🌿" },
  { name: "Tobirama Senju", power: 60, basic: "Suiton: Dragon 🌊", ultimate: "Edo Tensei ⚰️" },
  { name: "Tsunade", power: 60, basic: "Coup Surprenant 💥", ultimate: "Sceau Byakugō 💎" },
  { name: "Hiruzen Sarutobi", power: 65, basic: "5 Éléments 🌍🔥💧🌪️⚡", ultimate: "Shinigami Seal ☠️" },
  { name: "Pain (Tendo)", power: 68, basic: "Shinra Tensei ⬇️", ultimate: "Chibaku Tensei ⬆️" },
  { name: "Konan", power: 55, basic: "Danse de Papier 📄", ultimate: "Mer de Papiers Explosifs 💥📄" },
  { name: "Nagato", power: 68, basic: "Absorption Chakra 🌀", ultimate: "Réanimation Universelle ⚰️" },
  { name: "Deidara", power: 60, basic: "Argile Explosive C2 💣", ultimate: "Auto-Destruction C0 💥" },
  { name: "Kakuzu", power: 60, basic: "Futon - Zankokuhaha 💨", ultimate: "Cœurs Enchaînés 💔" },
  { name: "Hidan", power: 50, basic: "Attaque Rituelle ⛧", ultimate: "Rituel Jashin ⛧" },
  { name: "Sasori", power: 58, basic: "Marionnettes 🎭", ultimate: "Armée des 100 🎭" },
  { name: "Itachi Uchiha", power: 70, basic: "Tsukuyomi 🌙", ultimate: "Amaterasu + Susano'o 🔥💀" },
  { name: "Kisame Hoshigaki", power: 62, basic: "Requin Géant 🦈", ultimate: "Fusion avec Samehada 🦈" },
  { name: "Orochimaru", power: 65, basic: "Poignée du Serpent Spectral 🐍", ultimate: "Mode Sage Blanc 🐍" },
  { name: "Asuma Sarutobi", power: 55, basic: "Lames de Chakra 🔪", ultimate: "Furie Mode 💨" },
  { name: "Maito Gai", power: 70, basic: "Feu de la Jeunesse 🔥", ultimate: "8ème Porte - Nuit de la Mort 💀" },
  { name: "Kurenai Yuhi", power: 45, basic: "Genjutsu 🌸", ultimate: "Piège Floral 🌸" },
  { name: "Gaara", power: 68, basic: "Sable Mouvant 🏜️", ultimate: "Armure + Sable Funéraire ⚔️🏜️" },
  { name: "Temari", power: 58, basic: "Vent Tranchant 🌪️", ultimate: "Danse de la Faucheuse 🌪️" },
  { name: "Kankuro", power: 56, basic: "Poupée Karasu 🎭", ultimate: "Piège des 3 Marionnettes 🎭" },
  { name: "Hinata Hyuga", power: 52, basic: "Paume du Hakkē ✋", ultimate: "Protection des 64 Coups ✋✋" },
  { name: "Neji Hyuga", power: 60, basic: "Tourbillon Divin 🌪️", ultimate: "64 Points du Hakkē ✋" },
  { name: "Rock Lee", power: 65, basic: "Lotus Recto 🌸", ultimate: "6ème Porte - Paon du Midi 🦚" },
  { name: "Shikamaru Nara", power: 60, basic: "Ombre Manipulatrice 🕳️", ultimate: "Piège Stratégique Total 🕳️" },
  { name: "Sakura Haruno", power: 60, basic: "Coup Supersonique 💥", ultimate: "Sceau Byakugō Déchaîné 💎" },
  { name: "Madara Uchiha", power: 75, basic: "Susano'o 💀", ultimate: "Limbo + Météores ☄️" },
  { name: "Madara (Rikudo)", power: 85, basic: "Truth Seeker Orbs ⚫", ultimate: "Infinite Tsukuyomi 🌙" },
  { name: "Obito Uchiha", power: 70, basic: "Kamui 🌀", ultimate: "Jūbi Mode 🔥" },
  { name: "Obito (Rikudo)", power: 80, basic: "Gunbai Uchiwa 🌀", ultimate: "Shinra Tensei ⬇️" },
  { name: "Zetsu", power: 40, basic: "Attaque Furtive 🥷", ultimate: "Infection de Corps 🦠" },
  { name: "Kaguya Otsutsuki", power: 78, basic: "Portail Dimensionnel 🌀", ultimate: "Os Cendré + Expansion Divine ☄️" },
  { name: "Ay (Raikage)", power: 66, basic: "Coup Raikage ⚡", ultimate: "Mode Foudre ⚡" },
  { name: "Mei Terumi", power: 60, basic: "Acide Bouillant 🧪", ultimate: "Vapeur Destructrice 💨" },
  { name: "Onoki", power: 65, basic: "Technique de Légèreté 🪶", ultimate: "Jinton: Dématérialisation 💎" },
  { name: "Killer Bee", power: 68, basic: "Lames à 8 Sabres ⚔️", ultimate: "Mode Hachibi 🐙" },
  { name: "Boruto Uzumaki", power: 60, basic: "Rasengan Invisible 👻🌀", ultimate: "Karma Activé + Jōgan 👁️" },
  { name: "Boruto (Karma)", power: 75, basic: "Rasengan Spatial 🌌", ultimate: "Pouvoir Otsutsuki 🌙" },
  { name: "Kawaki", power: 70, basic: "Transformation Morpho ⚔️", ultimate: "Karma Full Power 💀" },
  { name: "Sarada Uchiha", power: 58, basic: "Chidori ⚡", ultimate: "Sharingan 3 Tomoe 🔴" },
  { name: "Mitsuki", power: 60, basic: "Serpent Blanc 🐍", ultimate: "Mode Sage 🐍" },
  { name: "Jigen", power: 82, basic: "Rods Dimensionnels ⚡", ultimate: "Transformation Karma 🔥" },
  { name: "Isshiki Otsutsuki", power: 90, basic: "Sukunahikona 🔍", ultimate: "Daikokuten ⏳" },
  { name: "Momoshiki Otsutsuki", power: 84, basic: "Rasengan Géant 🌪️", ultimate: "Absorption Chakra 🌀" },
  { name: "Indra Otsutsuki", power: 78, basic: "Chidori Ultime ⚡", ultimate: "Susano'o Parfait 💠" },
  { name: "Asura Otsutsuki", power: 76, basic: "Rasengan Originel 🌀", ultimate: "Mode Sage des Six Chemins ☯️" },
  { name: "Hagoromo Otsutsuki", power: 88, basic: "Creation of All Things 🌍", ultimate: "Six Paths Senjutsu ☯️" },
  { name: "Hamura Otsutsuki", power: 80, basic: "Tenseigan Activation ✨", ultimate: "Moon Sword Slash 🌙" },
  { name: "Shisui Uchiha", power: 72, basic: "Body Flicker ⚡", ultimate: "Kotoamatsukami 👁️" },
  { name: "Danzo Shimura", power: 62, basic: "Wind Blade 💨", ultimate: "Izanagi ⏳" },
  { name: "Chojuro", power: 55, basic: "Hiramekarei 🗡️", ultimate: "Demon Sword Release 🗡️" },
  { name: "Kurotsuchi", power: 56, basic: "Lava Style 🌋", ultimate: "Ash Stone Seal 🪨" },
  { name: "Darui", power: 58, basic: "Black Lightning ⚫⚡", ultimate: "Gale Style Laser Circus ⚡" },
  { name: "Suigetsu Hozuki", power: 52, basic: "Water Gun 💧", ultimate: "Giant Water Form 🌊" },
  { name: "Jugo", power: 54, basic: "Curse Mark Punch 💢", ultimate: "Full Curse Mark Transformation 💢" },
  { name: "Karin Uzumaki", power: 48, basic: "Chakra Chains 🔗", ultimate: "Healing Bite 🩸" }
];

const damageSystem = {
  basic: { min: 8, max: 15, chakraCost: 0 },
  special: { min: 15, max: 25, chakraCost: 20 },
  ultimate: { min: 30, max: 45, chakraCost: 75, failChance: 0.3 },
  charge: { chakraGain: 25 }
};

function getHealthColor(hp) {
  if (hp === 100) return "💚";
  if (hp >= 85) return "💚";
  if (hp >= 55) return "💛";
  if (hp >= 25) return "🧡";
  if (hp > 0) return "❤️";
  return "💔";
}

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  config: {
    name: "naruto-storm",
    aliases: ["naruto", "ns", "storm"],
    version: "4.2.0",
    author: "Christus",
    countDown: 5,
    role: 0,
    description: {
      en: "Naruto fighting game with advanced chakra system, 60+ characters, special moves and ultimate jutsus"
    },
    category: "game",
    nixPrefix: true,
    guide: {
      en: "   {pn} - Start a Naruto Storm battle"
    }
  },

  onStart: async function ({ sock, chatId, args, event, senderId, reply, prefix, commandName, usersData }) {
    const threadId = chatId;
    const userId = senderId;

    if (!global.NixBot.narutoSessions) global.NixBot.narutoSessions = {};
    global.NixBot.narutoSessions[threadId] = {
      step: "waiting_start",
      players: {},
      turn: null,
      p1Character: null,
      p2Character: null,
      p1HP: 100,
      p2HP: 100,
      p1Chakra: 100,
      p2Chakra: 100,
      chakraRegen: 5,
      defending: false,
      lastAction: null,
      lastPlayer: null
    };

    const imageUrl = "https://i.ibb.co/1Gdycvds/image.jpg";
    const sentMsg = await sock.sendMessage(chatId, {
      image: { url: imageUrl },
      caption: `🎮 𝗡𝗔𝗥𝗨𝗧𝗢-𝗦𝗧𝗢𝗥𝗠 𝗩𝟰.𝟮\n━━━━━━━━━━━━━━\n𝗘𝗻𝘃𝗼𝘆𝗲𝘇 "start" 𝗽𝗼𝘂𝗿 𝗰𝗼𝗺𝗺𝗲𝗻𝗰𝗲𝗿`
    }, { quoted: event });

    global.NixBot.onReply.push({
      commandName: "naruto-storm",
      messageID: sentMsg.key.id,
      author: userId,
      type: "naruto_start",
      threadId: threadId,
      step: "waiting_start"
    });

    setTimeout(() => {
      const idx = global.NixBot.onReply.findIndex(r => r.messageID === sentMsg.key.id);
      if (idx !== -1) {
        global.NixBot.onReply.splice(idx, 1);
        delete global.NixBot.narutoSessions[threadId];
        sock.sendMessage(chatId, { text: "⏰ Temps écoulé. La partie a été annulée." }, { quoted: event });
      }
    }, 60000);
  },

  onReply: async function ({ sock, chatId, message, senderId, event, usersData }) {
    const repliedMsgId = event.message?.extendedTextMessage?.contextInfo?.stanzaId;
    if (!repliedMsgId) return;

    const data = global.NixBot.onReply.find(
      r => r.commandName === "naruto-storm" && r.author === senderId && r.messageID === repliedMsgId
    );
    if (!data) return;

    const threadId = data.threadId || chatId;
    const session = global.NixBot.narutoSessions?.[threadId];
    if (!session) {
      return sock.sendMessage(chatId, { text: "❌ Aucune partie en cours dans ce salon. Lancez /naruto-storm pour commencer." }, { quoted: event });
    }

    const body = message.message?.conversation || message.message?.extendedTextMessage?.text || "";
    const cleanBody = body.trim().toLowerCase();
    if (!cleanBody) return;

    if (cleanBody === "fin") {
      delete global.NixBot.narutoSessions[threadId];
      const toDelete = global.NixBot.onReply.filter(r => r.threadId === threadId);
      for (const r of toDelete) {
        const idx = global.NixBot.onReply.findIndex(item => item.messageID === r.messageID);
        if (idx !== -1) global.NixBot.onReply.splice(idx, 1);
      }
      return sock.sendMessage(chatId, { text: "🔄 Partie terminée. Envoyez /naruto-storm pour recommencer." }, { quoted: event });
    }

    switch (data.type) {
      case "naruto_start": {
        if (cleanBody === "start") {
          session.step = "choose_p1";
          session.players.p1 = senderId;

          const sentMsg = await sock.sendMessage(chatId, {
            text: "🧙 𝗝𝗼𝘂𝗲𝘂𝗿 𝟭\n𝗧𝗮𝗽𝗲𝘇 'p1' 𝗽𝗼𝘂𝗿 𝘀𝗲́𝗹𝗲𝗰𝘁𝗶𝗼𝗻𝗻𝗲𝗿 𝘃𝗼𝘁𝗿𝗲 𝗽𝗲𝗿𝘀𝗼𝗻𝗻𝗮𝗴𝗲"
          }, { quoted: event });

          global.NixBot.onReply.push({
            commandName: "naruto-storm",
            messageID: sentMsg.key.id,
            author: senderId,
            type: "naruto_choose_p1",
            threadId: threadId
          });
          const idx = global.NixBot.onReply.findIndex(r => r.messageID === repliedMsgId);
          if (idx !== -1) global.NixBot.onReply.splice(idx, 1);
        } else {
          sock.sendMessage(chatId, { text: "❌ Veuillez répondre avec 'start' pour commencer." }, { quoted: event });
        }
        break;
      }

      case "naruto_choose_p1": {
        if (senderId !== data.author) return;
        if (cleanBody === "p1") {
          session.step = "choose_p2";
          const sentMsg = await sock.sendMessage(chatId, {
            text: "🧝 𝗝𝗼𝘂𝗲𝘂𝗿 𝟮\n𝗧𝗮𝗽𝗲𝘚 'p2' 𝗽𝗼𝘂𝗿 𝘃𝗼𝘂𝘀 𝗶𝗻𝘀𝗰𝗿𝗶𝗿𝗲"
          }, { quoted: event });
          global.NixBot.onReply.push({
            commandName: "naruto-storm",
            messageID: sentMsg.key.id,
            author: null,
            type: "naruto_choose_p2",
            threadId: threadId
          });
          const idx = global.NixBot.onReply.findIndex(r => r.messageID === repliedMsgId);
          if (idx !== -1) global.NixBot.onReply.splice(idx, 1);
        } else {
          sock.sendMessage(chatId, { text: "❌ Veuillez répondre avec 'p1'." }, { quoted: event });
        }
        break;
      }

      case "naruto_choose_p2": {
        if (senderId === session.players.p1) {
          return sock.sendMessage(chatId, { text: "❌ Vous ne pouvez pas être les deux joueurs !" }, { quoted: event });
        }
        if (cleanBody === "p2") {
          session.players.p2 = senderId;
          session.step = "choose_characters_p1";

          let characterList = "🎭 𝗖𝗛𝗢𝗜𝗦𝗜𝗦𝗦𝗘𝗭 𝗩𝗢𝗧𝗥𝗘 𝗣𝗘𝗥𝗦𝗢𝗡𝗡𝗔𝗚𝗘\n━━━━━━━━━━━━━━\n";
          characters.forEach((char, i) => {
            characterList += `${i + 1}. ${char.name} (${char.power}★)\n`;
          });

          const p1Name = event.pushName || "Joueur 1";
          const sentMsg = await sock.sendMessage(chatId, {
            text: characterList + `\n\n@${p1Name} 𝗝𝗼𝘂𝗲𝘂𝗿 𝟭, 𝗿𝗲́𝗽𝗼𝗻𝗱𝗲𝘇 𝗮𝘃𝗲𝗰 𝗹𝗲 𝗻𝘂𝗺𝗲́𝗿𝗼 𝗱𝘂 𝗽𝗲𝗿𝘀𝗼𝗻𝗻𝗮𝗴𝗲`
          }, { quoted: event });

          global.NixBot.onReply.push({
            commandName: "naruto-storm",
            messageID: sentMsg.key.id,
            author: session.players.p1,
            type: "naruto_choose_characters_p1",
            threadId: threadId
          });
          const idx = global.NixBot.onReply.findIndex(r => r.messageID === repliedMsgId);
          if (idx !== -1) global.NixBot.onReply.splice(idx, 1);
        } else {
          sock.sendMessage(chatId, { text: "❌ Veuillez répondre avec 'p2'." }, { quoted: event });
        }
        break;
      }

      case "naruto_choose_characters_p1": {
        if (senderId !== data.author) return;
        const indexP1 = parseInt(cleanBody) - 1;
        if (isNaN(indexP1) || indexP1 < 0 || indexP1 >= characters.length) {
          return sock.sendMessage(chatId, { text: "❌ Numéro invalide. Répondez avec un nombre entre 1 et " + characters.length }, { quoted: event });
        }
        session.p1Character = characters[indexP1];
        session.step = "choose_characters_p2";

        const sentMsgP2 = await sock.sendMessage(chatId, {
          text: `✅ 𝗝𝗼𝘂𝗲𝘂𝗿 𝟭: ${session.p1Character.name}\n\n𝗝𝗼𝘂𝗲𝘂𝗿 𝟮, 𝗰𝗵𝗼𝗶𝘀𝗶𝘀𝘀𝗲𝘇 𝘃𝗼𝘁𝗿𝗲 𝗽𝗲𝗿𝘀𝗼𝗻𝗻𝗮𝗴𝗲 (1-${characters.length})`
        }, { quoted: event });

        global.NixBot.onReply.push({
          commandName: "naruto-storm",
          messageID: sentMsgP2.key.id,
          author: session.players.p2,
          type: "naruto_choose_characters_p2",
          threadId: threadId
        });
        const idx = global.NixBot.onReply.findIndex(r => r.messageID === repliedMsgId);
        if (idx !== -1) global.NixBot.onReply.splice(idx, 1);
        break;
      }

      case "naruto_choose_characters_p2": {
        if (senderId !== data.author) return;
        const indexP2 = parseInt(cleanBody) - 1;
        if (isNaN(indexP2) || indexP2 < 0 || indexP2 >= characters.length) {
          return sock.sendMessage(chatId, { text: "❌ Numéro invalide. Répondez avec un nombre entre 1 et " + characters.length }, { quoted: event });
        }
        session.p2Character = characters[indexP2];
        session.turn = "p1";
        session.step = "battle";

        const p1Name = event.pushName || "Joueur 1";
        const p2Name = "Joueur 2";

        const battleStartMsg = `⚔️ 𝗖𝗢𝗠𝗕𝗔𝗧 𝗗𝗘𝗕𝗨𝗧\n━━━━━━━━━━━━━━\n✦ ${session.p1Character.name} (${p1Name}) 𝗩𝗦 ${session.p2Character.name} (${p2Name})\n\n𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝗲𝘀 𝗱𝗶𝘀𝗽𝗼𝗻𝗶𝗯𝗹𝗲𝘀:\n» 𝗮 - 𝗔𝘁𝘁𝗮𝗾𝘂𝗲 𝗯𝗮𝘀𝗶𝗾𝘂𝗲 (${damageSystem.basic.min}-${damageSystem.basic.max}%)\n» 𝗯 - 𝗧𝗲𝗰𝗵𝗻𝗶𝗾𝘂𝗲 𝘀𝗽é𝗰𝗶𝗮𝗹𝗲 (-${damageSystem.special.chakraCost} chakra)\n» 𝘅 - 𝗧𝗲𝗰𝗵𝗻𝗶𝗾𝘂𝗲 𝘂𝗹𝘁𝗶𝗺𝗲 (-${damageSystem.ultimate.chakraCost} chakra)\n» 𝗰 - 𝗖𝗵𝗮𝗿𝗴𝗲𝗿 𝗰𝗵𝗮𝗸𝗿𝗮 (+${damageSystem.charge.chakraGain}%)\n» 𝗱 - 𝗗é𝗳𝗲𝗻𝘀𝗲 (𝗿é𝗱𝘂𝗶𝘁 𝗹𝗲𝘀 𝗱é𝗴â𝘁𝘀)\n\n@${p1Name} 𝗝𝗼𝘂𝗲𝘂𝗿 𝟭, 𝗰'𝗲𝘀𝘁 à 𝘁𝗼𝗶 𝗱𝗲 𝗷𝗼𝘂𝗲𝗿 !`;

        const sentMsgBattle = await sock.sendMessage(chatId, { text: battleStartMsg }, { quoted: event });

        global.NixBot.onReply.push({
          commandName: "naruto-storm",
          messageID: sentMsgBattle.key.id,
          author: session.players.p1,
          type: "naruto_battle",
          threadId: threadId
        });
        const idx = global.NixBot.onReply.findIndex(r => r.messageID === repliedMsgId);
        if (idx !== -1) global.NixBot.onReply.splice(idx, 1);
        break;
      }

      case "naruto_battle": {
        const currentPlayer = session.turn === "p1" ? session.players.p1 : session.players.p2;
        if (senderId !== currentPlayer) return;

        if (cleanBody === 'c' && session.lastAction === 'c' && session.lastPlayer === senderId) {
          return sock.sendMessage(chatId, { text: "❌ Vous ne pouvez pas charger votre chakra deux fois de suite !" }, { quoted: event });
        }

        const attacker = session.turn === "p1" ? session.p1Character : session.p2Character;
        const defender = session.turn === "p1" ? session.p2Character : session.p1Character;
        const hpKey = session.turn === "p1" ? "p2HP" : "p1HP";
        const chakraKey = session.turn === "p1" ? "p1Chakra" : "p2Chakra";

        let damage = 0;
        let tech = "Attaque basique";
        let effect = "👊";
        let chakraUsed = 0;
        let missed = false;
        let chargeMessage = "";

        switch (cleanBody) {
          case 'a':
            damage = randomBetween(damageSystem.basic.min, damageSystem.basic.max);
            tech = "Attaque basique";
            effect = "👊";
            break;
          case 'b':
            if (session[chakraKey] < damageSystem.special.chakraCost) {
              missed = true;
            } else {
              damage = randomBetween(damageSystem.special.min, damageSystem.special.max);
              chakraUsed = damageSystem.special.chakraCost;
              tech = attacker.basic;
              effect = attacker.basic.split(' ').pop();
            }
            break;
          case 'x':
            if (session[chakraKey] < damageSystem.ultimate.chakraCost) {
              missed = true;
            } else {
              chakraUsed = damageSystem.ultimate.chakraCost;
              if (Math.random() < damageSystem.ultimate.failChance) {
                missed = true;
                tech = attacker.ultimate + " (échoué)";
                effect = "❌";
              } else {
                damage = randomBetween(damageSystem.ultimate.min, damageSystem.ultimate.max);
                tech = attacker.ultimate;
                effect = attacker.ultimate.split(' ').pop();
              }
            }
            break;
          case 'c':
            session[chakraKey] = Math.min(100, session[chakraKey] + damageSystem.charge.chakraGain);
            chargeMessage = `🔋 ${attacker.name} accumule +${damageSystem.charge.chakraGain}% de chakra !`;
            session.lastAction = 'c';
            session.lastPlayer = senderId;
            session.turn = session.turn === "p1" ? "p2" : "p1";
            session.defending = false;
            await sendBattleUpdate();
            const idxC = global.NixBot.onReply.findIndex(r => r.messageID === repliedMsgId);
            if (idxC !== -1) global.NixBot.onReply.splice(idxC, 1);
            return;
          case 'd':
            session.defending = session.turn;
            session.lastAction = 'd';
            session.lastPlayer = senderId;
            session.turn = session.turn === "p1" ? "p2" : "p1";
            await sock.sendMessage(chatId, { text: `🛡️ ${attacker.name} se met en position défensive !` }, { quoted: event });
            await sendBattleUpdate();
            const idxD = global.NixBot.onReply.findIndex(r => r.messageID === repliedMsgId);
            if (idxD !== -1) global.NixBot.onReply.splice(idxD, 1);
            return;
          default:
            return sock.sendMessage(chatId, { text: "❌ Commande invalide\n» a - Attaque\n» b - Technique\n» x - Ultime\n» c - Charger\n» d - Défense" }, { quoted: event });
        }

        if (!missed) {
          if (session.defending && session.defending !== session.turn) {
            damage = Math.floor(damage * 0.6);
            tech += " (défendu)";
          }
          session[chakraKey] -= chakraUsed;
          session[chakraKey] = Math.max(0, session[chakraKey]);
          session[hpKey] -= damage;
          session[hpKey] = Math.max(0, session[hpKey]);
        }

        session.lastAction = cleanBody;
        session.lastPlayer = senderId;

        if (session.turn === "p1") {
          session.p1Chakra = Math.min(100, session.p1Chakra + session.chakraRegen);
        } else {
          session.p2Chakra = Math.min(100, session.p2Chakra + session.chakraRegen);
        }

        async function sendBattleUpdate() {
          let msgContent = "";
          if (cleanBody !== 'c' && !missed) {
            msgContent += `⚡ ${attacker.name} utilise ${tech} ${effect}\n💥 Inflige ${damage}% de dégâts à ${defender.name} !\n\n`;
          } else if (missed) {
            msgContent += `⚡ ${attacker.name} tente ${tech}...\n❌ Échoue ! (${session[chakraKey] < damageSystem.ultimate.chakraCost ? "Chakra insuffisant" : "Technique ratée"})\n\n`;
          }
          msgContent += `━━━━━━━━━━━━━━\n${getHealthColor(session.p1HP)}|${session.p1Character.name}: HP ${session.p1HP}%\n💙| Chakra ${session.p1Chakra}%\n━━━━━━━━━━━━━━\n${getHealthColor(session.p2HP)}|${session.p2Character.name}: HP ${session.p2HP}%\n💙| Chakra ${session.p2Chakra}%\n━━━━━━━━━━━━━━\n`;
          if (chargeMessage) msgContent += `${chargeMessage}\n`;

          if (session.p1HP <= 0 || session.p2HP <= 0) {
            const winner = session.p1HP <= 0 ? session.p2Character.name : session.p1Character.name;
            msgContent += `🏆 𝗩𝗜𝗖𝗧𝗢𝗜𝗥𝗘 𝗗𝗘 ${winner} !\n𝗙𝗶𝗻 𝗱𝘂 𝗰𝗼𝗺𝗯𝗮𝘁. 𝗧𝗮𝗽𝗲𝘇 'fin' 𝗽𝗼𝘂𝗿 𝗿𝗲𝗰𝗼𝗺𝗺𝗲𝗻𝗰𝗲𝗿.`;
            delete global.NixBot.narutoSessions[threadId];
            await sock.sendMessage(chatId, { text: msgContent }, { quoted: event });
            return;
          } else {
            session.turn = session.turn === "p1" ? "p2" : "p1";
            session.defending = false;
            const nextPlayer = session.turn === "p1" ? session.players.p1 : session.players.p2;
            const nextName = (nextPlayer === session.players.p1 ? "Joueur 1" : "Joueur 2");
            msgContent += `@${nextName} 𝗝𝗼𝘂𝗲𝘂𝗿 ${session.turn === "p1" ? "1" : "2"}, 𝗰'𝗲𝘀𝘁 à 𝘁𝗼𝗶 𝗱𝗲 𝗷𝗼𝘂𝗲𝗿 !`;
            const sentMsg = await sock.sendMessage(chatId, { text: msgContent }, { quoted: event });
            global.NixBot.onReply.push({
              commandName: "naruto-storm",
              messageID: sentMsg.key.id,
              author: nextPlayer,
              type: "naruto_battle",
              threadId: threadId
            });
          }
        }

        await sendBattleUpdate();
        const idx = global.NixBot.onReply.findIndex(r => r.messageID === repliedMsgId);
        if (idx !== -1) global.NixBot.onReply.splice(idx, 1);
        break;
      }

      default:
        break;
    }
  }
};