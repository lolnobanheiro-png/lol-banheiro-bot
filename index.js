const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys')
const qrcode = require('qrcode-terminal')

async function connectToWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys')
    const sock = makeWASocket({ auth: state, printQRInTerminal: true })

    sock.ev.on('creds.update', saveCreds)

    sock.ev.on('messages.upsert', async m => {
        const msg = m.messages[0]
        if (!msg.message || msg.key.fromMe) return
        const from = msg.key.remoteJid
        const text = (msg.message.conversation || msg.message.extendedTextMessage?.text || "").toLowerCase()

        // 1. MENU COMPLETO
        if (text === '!menu') {
            const menu = `🎮 *LOL BANHEIRO BOT - MEGA MENU* 🎮\n\n` +
                         `*DIVERSÃO & SORTE:* \n` +
                         `!lane, !tilt, !pescar, !roleta, !bau, !elo-fake, !minha-skin\n\n` +
                         `*INTERAÇÃO DE GRUPO:* \n` +
                         `!x1, !fakenews, !talarico, !top-feeder, !shippar, !time\n\n` +
                         `*DICAS & DESAFIOS:* \n` +
                         `!ban-lol, !build-troll, !status, !cantada`
            await sock.sendMessage(from, { text: menu })
        }

        // 2. CATEGORIA: DESAFIOS E RANKINGS
        if (text === '!elo-fake') {
            const elos = ['Ferro IV', 'Bronze I', 'Prata IV', 'Ouro II', 'Platina III', 'Esmeralda I', 'Diamante IV', 'Mestre', 'Grão-Mestre', 'Desafiante'];
            const elo = elos[Math.floor(Math.random() * elos.length)];
            await sock.sendMessage(from, { text: `🏆 Seu elo hoje é: *${elo}*!` });
        }

        if (text === '!top-feeder') {
            await sock.sendMessage(from, { text: `🍔 O radar de lanches detectou que @${msg.key.participant?.split('@')[0]} é o maior FEEDER do grupo hoje!`, mentions: [msg.key.participant] });
        }

        if (text === '!ban-lol') {
            const champs = ['Yasuo', 'Yone', 'Master Yi', 'Shaco', 'Teemo', 'Yuumi'];
            const ban = champs[Math.floor(Math.random() * champs.length)];
            await sock.sendMessage(from, { text: `🚫 Invocador, você está PROIBIDO de jogar de *${ban}* hoje!` });
        }

        // 3. CATEGORIA: INTERAÇÃO E SHIPS
        if (text === '!shippar') {
            await sock.sendMessage(from, { text: `❤️ O Oráculo diz que @${msg.key.participant?.split('@')[0]} e um bot iniciante seriam um Duo perfeito!`, mentions: [msg.key.participant] });
        }

        if (text === '!time') {
            await sock.sendMessage(from, { text: `⚖️ Dividam-se! Os que dão 'FF 15' vs Os que 'Acreditam no Late Game'.` });
        }

        // 4. CATEGORIA: RPG E SKINS
        if (text === '!minha-skin') {
            const skins = ['Teemo Abelhinha', 'Yasuo Emissário da Escuridão', 'Lux Elementalista', 'Garen Galante'];
            const skin = skins[Math.floor(Math.random() * skins.length)];
            await sock.sendMessage(from, { text: `✨ Você na vida real seria a skin: *${skin}*!` });
        }

        if (text === '!build-troll') {
            const builds = ['Yuumi Full AD', 'Soraka Crítico', 'Garen Full AP', 'Jinx Tank'];
            await sock.sendMessage(from, { text: `🛠️ Desafio aceito! Vá de: *${builds[Math.floor(Math.random() * builds.length)]}*` });
        }

        // --- REPETINDO OS COMANDOS ANTERIORES PARA NÃO PERDER ---
        if (text === '!lane') {
            const r = ['Topo', 'Selva', 'Mid', 'ADC', 'Suporte'];
            await sock.sendMessage(from, { text: `🛡️ Rota: *${r[Math.floor(Math.random() * r.length)]}*` });
        }

        if (text === '!tilt') {
            await sock.sendMessage(from, { text: `😡 Tilt: *${Math.floor(Math.random() * 101)}%*` });
        }

        if (text === '!pescar') {
            const p = ['🐟 Peixe', '🐠 Raro', '👟 Bota', '🦈 Tubarão'];
            await sock.sendMessage(from, { text: `🎣 Pescou: *${p[Math.floor(Math.random() * p.length)]}*!` });
        }

        if (text === '!roleta') {
            const m = Math.random() < 0.2 ? "💥 *POW!* Foi de base!" : "🔫 *CLICK.* Sobreviveu!";
            await sock.sendMessage(from, { text: m });
        }

        if (text === '!fakenews') {
            const n = ["Yasuo será removido.", "Próximo campeão será o 'Dono da Lan House'.", "Teemo terá invisibilidade global."];
            await sock.sendMessage(from, { text: `📰 *FAKE NEWS:* ${n[Math.floor(Math.random() * n.length)]}` });
        }

        if (text === '!cantada') {
            const c = ["Me chama de Smite e não me deixa passar nada!", "Você não é a Lux, mas me iluminou."];
            await sock.sendMessage(from, { text: `😏 ${c[Math.floor(Math.random() * c.length)]}` });
        }
    })
}

connectToWhatsApp()
