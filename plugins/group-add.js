const { cmd } = require('../command');

cmd({
    pattern: "add",
    alias: ["a"],
    desc: "Adds a member to the group",
    category: "admin",
    filename: __filename,
    use: "<countrycode+number>"
},
async (conn, mek, m, {
    from, q, isGroup, isBotAdmins, reply, quoted, senderNumber
}) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        
        const botOwner1 = conn.user.id.split(":")[0];
        const botOwner2 = conn.user.lid ? conn.user.lid.split(":")[0] : null;

        if (senderNumber !== botOwner1 && senderNumber !== botOwner2) {
            return reply("❌ Only group admins can use this command.");
        }

        if (!isBotAdmins) return reply("❌ I need to be an admin to use this command.");

        if (!q) return reply("❌ Please provide a number with country code\nExample: .add 2348133742");
        
        // Clean and validate the number
        const number = q.replace(/[^0-9]/g, '');
        
        // Validate number format
        if (number.length < 10) {
            return reply("❌ Invalid number. Please use format: countrycode + number\nExample: .add 2348133742");
        }
        
        if (number.startsWith('0')) {
            return reply("❌ Don't use 0 at start. Use country code instead\nExample: .add 2348133742");
        }

        const targetID = number + "@s.whatsapp.net";
        
        // Try to add the user
        const result = await conn.groupParticipantsUpdate(from, [targetID], "add");
        
        if (!result || !result[0]) return reply("❌ Failed to add user");

        switch (result[0].status) {
            case "200":
                return reply(`✅ Successfully added @${targetID.split('@')[0]}`, { mentions: [targetID] });
            case "403":
            case "408":
                try {
                    const inviteCode = await conn.groupInviteCode(from);
                    const inviteLink = `https://chat.whatsapp.com/${inviteCode}`;
                    await conn.sendMessage(targetID, {
                        text: `Hello! You were invited to join our group but your privacy settings prevent direct adds.\n\nHere's the group invite link:\n${inviteLink}`
                    });
                    return reply(`📨 User has restricted adds. Sent the group link to @${targetID.split('@')[0]} in DM.`, { mentions: [targetID] });
                } catch (error) {
                    return reply("❌ User has restricted adds. Failed to send group link.");
                }
            case "409":
                return reply("❌ The user is already in the group");
            case "500":
                return reply("❌ Group is full or reached participant limit");
            default:
                return reply("❌ Failed to add user. Make sure the number is correct.");
        }
    } catch (error) {
        return reply("❌ Failed to add member. Check the number format.");
    }
});