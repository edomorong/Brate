export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { sol, brate, wallet, tx } = req.body;

  // Verificación básica
  if (!sol || !brate || !wallet || !tx) {
    return res.status(400).json({ error: "Faltan datos en el cuerpo de la petición" });
  }

  const content = `🟢 **Nueva compra detectada**\n\n💰 **${sol} SOL**\n🪙 **~${Math.round(brate).toLocaleString()} BRATE**\n👛 **Wallet:** ${wallet}\n🔗 [Ver en SolScan](${tx})`;

  try {
    const discordRes = await fetch(
      "https://discord.com/api/webhooks/1394695027740901408/jvd802zeOv7b1Us9K7jxr9_OLzRWdcE7OQXYJ3ugGSAvCbHvpdQihPsJexJ_lN09JNg4",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      }
    );

    if (!discordRes.ok) {
      const text = await discordRes.text();
      return res.status(500).json({ error: text });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
