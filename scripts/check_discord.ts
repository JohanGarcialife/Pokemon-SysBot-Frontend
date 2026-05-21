import dotenv from 'dotenv';
dotenv.config();

async function run() {
  const token = process.env.DISCORD_TOKEN;
  const channelId = process.env.DISCORD_CHANNEL_ID_ZA_FREE || "1498832934927601734"; // Z-A Free channel ID

  if (!token) {
    console.error("Error: DISCORD_TOKEN is not defined in environment variables!");
    return;
  }

  console.log(`Fetching messages from Discord channel ${channelId}...`);
  try {
    const res = await fetch(`https://discord.com/api/v9/channels/${channelId}/messages?limit=10`, {
      headers: {
        'Authorization': token
      }
    });

    if (!res.ok) {
      console.error(`Error: ${res.status} ${res.statusText}`);
      console.error(await res.text());
      return;
    }

    const messages = await res.json() as any[];
    console.log(`Found ${messages.length} messages:`);
    for (const msg of messages) {
      console.log('--------------------------------------------------');
      console.log(`Author: ${msg.author.username} (${msg.author.id})`);
      console.log(`Content: ${msg.content}`);
      console.log(`Timestamp: ${msg.timestamp}`);
      if (msg.attachments && msg.attachments.length > 0) {
        console.log(`Attachments:`, msg.attachments.map((a: any) => a.filename));
      }
    }
  } catch (err) {
    console.error(err);
  }
}

run();
