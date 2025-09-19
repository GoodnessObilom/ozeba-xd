const { getLinkDetectionMode } = require("./linkDetection");
const { incrementWarning, resetWarning, getWarningCount } = require("./warnings");
const { getPDMStatus, updatePDMStatus } = require('../plugins/pdmCommands');
const fs = require('fs');

const setupLinkDetection = (sock) => {
    sock.ev.on("messages.upsert", async ({ messages }) => {
        for (const message of messages) {
            if (!message.message) continue;
            const groupJid = message.key.remoteJid;
            if (!groupJid || !groupJid.endsWith("@g.us") || message.key.fromMe) continue;

            const msgText = message.message?.conversation || message.message?.extendedTextMessage?.text || "";
            const linkRegex = /(?:https?:\/\/)?(?:www\.)?(?:[\w-]+\.)+[a-z]{2,}(?:\/[^\s]*)?|(?:https?:\/\/)?(?:chat\.whatsapp\.com|discord\.gg|t\.me|bit\.ly|wa\.me)\/[^\s]+/gi;

            if (linkRegex.test(msgText)) {
                console.log(`Detected link in group ${groupJid}: ${msgText}`);

                const participant = message.key.participant;
                if (!participant) continue;

                const mode = await getLinkDetectionMode(groupJid) || "warn";

                // Delete the message properly
                await sock.sendMessage(groupJid, { delete: { remoteJid: groupJid, fromMe: false, id: message.key.id } });

                // Notify if PDM is enabled
                const pdmEnabled = await getPDMStatus(groupJid);
                if (pdmEnabled) {
                    await sock.sendMessage(groupJid, {
                        text: `❌ Links are not allowed in this group. @${participant.split('@')[0]} has been warned.`,
                        mentions: [participant],
                    });
                }

                if (mode === "kick") {
                    await sock.groupParticipantsUpdate(groupJid, [participant], "remove");
                    await sock.sendMessage(groupJid, {
                        text: `🚫 @${participant.split('@')[0]} has been removed for sending links.`,
                        mentions: [participant],
                    });
                } else if (mode === "warn") {
                    const warningCount = incrementWarning(groupJid, participant);
                    await sock.sendMessage(groupJid, {
                        text: `⚠️ @${participant.split('@')[0]}, links are not allowed!\nWarning count: ${warningCount}/3`,
                        mentions: [participant],
                    });

                    if (warningCount >= 3) {
                        await sock.groupParticipantsUpdate(groupJid, [participant], "remove");
                        await sock.sendMessage(groupJid, {
                            text: `🚫 @${participant.split('@')[0]} has been removed after 3 warnings.`,
                            mentions: [participant],
                        });
                        resetWarning(groupJid, participant);
                    }
                }
            }
        }
    });

    sock.ev.on('group.participants.update', async (event) => {
        const { id: groupJid, participants, action } = event;
        
        // Log the event for debugging
        console.log("Event:", JSON.stringify(event, null, 2));
    
        const pdmEnabled = await getPDMStatus(groupJid);
        if (!pdmEnabled) return;
    
        const user = participants[0]; // The user being promoted/demoted
    
        try {
            const groupMetadata = await sock.groupMetadata(groupJid);
            if (!groupMetadata) return;
    
            // Use actor/author if present and not same as user
            let actor = event.actor || event.author;
            if (!actor || actor === user) {
                actor = null; // Unknown actor
            }

            const actorContact = groupMetadata.participants.find(p => p.id === actor);
            const userContact = groupMetadata.participants.find(p => p.id === user);

            const actorName = actorContact?.notify || actorContact?.name || (actor ? actor.split('@')[0] : "An admin");
            const userName = userContact?.notify || userContact?.name || user.split('@')[0] || "User";

            if (action === 'promote') {
                const promoMsg = `🎉 *${actorName}* promoted *@${user.split('@')[0]}* to admin.\n\n*Congratulations ${userName}!* 🎉`;
                await sock.sendMessage(groupJid, { text: promoMsg, mentions: actor ? [actor, user] : [user] });
            }

            if (action === 'demote') {
                const demoMsg = `🚫 *${actorName}* demoted *@${user.split('@')[0]}* from admin.\n\n*${userName}, step back and regroup.* 😔`;
                await sock.sendMessage(groupJid, { text: demoMsg, mentions: actor ? [actor, user] : [user] });
            }
        } catch (err) {
            console.error('Error:', err);
        }
    });
};

module.exports = setupLinkDetection;
