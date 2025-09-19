const { getLinkDetectionMode } = require("../linkDetection");
const { getWarnings, addWarning, resetWarnings } = require("../warnings");

const setupLinkDetection = (sock) => {
    sock.ev.on("messages.upsert", async ({ messages }) => {
        for (const message of messages) {
            const groupJid = message.key.remoteJid;
            if (!groupJid.endsWith("@g.us") || message.key.fromMe) continue;

            try {
                const { mode } = getLinkDetectionMode(groupJid);
                if (!mode) continue;

                const msgText = message.message?.conversation || 
                                message.message?.extendedTextMessage?.text || "";

                                const linkRegex = /(?:https?:\/\/)?(?:www\.)?(?:[\w-]+\.)+[a-z]{2,}(?:\/[^\s]*)?|(?:https?:\/\/)?(?:chat\.whatsapp\.com|discord\.gg|t\.me|bit\.ly|wa\.me)\/[^\s]+/gi;

                                if (!linkRegex.test(msgText)) continue;

                console.log(`🔗 Detected link in group ${groupJid}: ${msgText}`);

                const participant = message.key.participant || message.participant || message.key.remoteJid;
                const username = message.pushName || message.message?.senderName || participant?.split("@")[0] || "user";

                const groupMetadata = await sock.groupMetadata(groupJid);
                const groupName = groupMetadata.subject || "this group";
                const isAdmin = groupMetadata.participants.some(
                    (member) => member.id === participant && member.admin
                );

                if (isAdmin) {
                    console.log(`✅ Ignoring admin: ${participant}`);
                    continue;
                }

                // Delete the message
                await sock.sendMessage(groupJid, { delete: message.key });

                if (mode === "warn") {
                    const warningCount = addWarning(groupJid, participant);
                    await sock.sendMessage(
                        groupJid,
                        {
                            text: `🚫 *${username}*, sending links in *${groupName}* is not allowed.\n⚠️ Warning: ${warningCount}/3`,
                            mentions: [participant]
                        }
                    );

                    if (warningCount >= 3) {
                        await sock.groupParticipantsUpdate(groupJid, [participant], "remove");
                        await sock.sendMessage(
                            groupJid,
                            {
                                text: `@${participant.split("@")[0]} (*${username}*) has been removed from *${groupName}* for ignoring multiple link warnings. 🚷`,
                                mentions: [participant]
                            }
                        );
                        resetWarnings(groupJid, participant);
                    }

                } else if (mode === "kick") {
                    await sock.groupParticipantsUpdate(groupJid, [participant], "remove");
                    await sock.sendMessage(
                        groupJid,
                        {
                            text: `@${participant.split("@")[0]} (*${username}*) has been removed instantly for posting a link. ❌\n\nLinks are *strictly prohibited* in *${groupName}*!`,
                            mentions: [participant]
                        }
                    );

                } else if (mode === "delete") {
                    await sock.sendMessage(
                        groupJid,
                        {
                            text: `🔍 *${username}*, your link was removed.\n🚫 Please avoid posting links in *${groupName}*.`,
                            mentions: [participant]
                        }
                    );
                }

            } catch (error) {
                console.error("Error in link detection:", error);
            }
        }
    });
};

module.exports = { setupLinkDetection };
