const { cmd } = require('../command');

cmd({
    pattern: "sendinvite",
    alias: ["send-invite"],
    desc: "Invite a user to the group via link",
    category: "group",
    use: "<phone number>",
    filename: __filename,
}, 
async (conn, mek, m, { from, text, isGroup, isBotAdmins, isAdmins, reply }) => {
    try {
        // ✅ Must be used in group
        if (!isGroup) return reply("❌ This command can only be used *in a group chat*.");

        // ✅ Only group admins allowed
        if (!isAdmins) return reply("❌ Only group admins can use this command.");

        // ✅ Bot must be admin to get group invite code
        if (!isBotAdmins) return reply("❌ I need to be *admin* in this group to generate invite links.");

        // ✅ Validate phone number input
        if (!text) {
            return reply(
                `❌ *Please enter the number you want to invite.*\n\n` +
                `📌 *Example:*\n` +
                `*.sendinvite 234813XXXXXXX*\n\n` +
                `💡 Use *.invite* to get the group link manually.`
            );
        }

        if (text.includes("+")) return reply(`⚠️ *Remove the "+" sign.* Just use digits.`);
        if (isNaN(text)) return reply(`⚠️ *Enter a valid number (digits only with country code)*.`);

        // ✅ Generate group invite link
        let code = await conn.groupInviteCode(from);
        let link = `https://chat.whatsapp.com/${code}`;

        // ✅ Send invite to user's DM
        await conn.sendMessage(`${text}@s.whatsapp.net`, {
            text:
                `📩 *GROUP INVITATION*\n\n` +
                `👤 *Sender:* @${m.sender.split("@")[0]}\n` +
                `💬 *Group ID:* ${from}\n\n` +
                `🔗 ${link}`,
            mentions: [m.sender],
        });

        reply("✅ *Group invite link has been sent successfully!*");

    } catch (e) {
        console.error("Error in sendinvite command:", e);
        reply("⚠️ *An error occurred while sending the invite.*");
    }
});
