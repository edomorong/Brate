// src/utils/discord.js
const fetch = require('node-fetch');

const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1394695027740901408/jvd802zeOv7b1Us9K7jxr9_OLzRWdcE7OQXYJ3ugGSAvCbHvpdQihPsJexJ_lN09JNg4';

/**
 * Envía un mensaje de texto plano al webhook de Discord
 * @param {string} content - El mensaje a enviar.
 */
async function sendDiscordMessage(content) {
  if (!DISCORD_WEBHOOK_URL) {
    console.error('❌ Webhook URL no definida.');
    return;
  }

  try {
    const res = await fetch(DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });

    if (!res.ok) {
      const errMsg = await res.text();
      console.error(`❌ Error al enviar mensaje a Discord: ${res.status} - ${errMsg}`);
    } else {
      console.log('✅ Mensaje enviado a Discord correctamente.');
    }
  } catch (err) {
    console.error('❌ Fallo en el webhook de Discord:', err.message);
  }
}

module.exports = { sendDiscordMessage };

if (require.main === module) {
  sendDiscordMessage('🔔 Test de conexión a Discord desde el backend.');
}