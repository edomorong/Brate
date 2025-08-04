import fetch from "node-fetch";

const BUYER_WALLET = "7vPwgHYpdwXiqoRy25uAUat1WdH8CXdueVUTDbDkgiGF"; // TU WALLET PHANTOM
const SOL_AMOUNT = 0.01; // Prueba con 0.01 SOL

async function testBuyBrate() {
  console.log(`Probando compra de ${SOL_AMOUNT} SOL para ${BUYER_WALLET}...`);

  try {
    const res = await fetch("http://localhost:3000/api/buy-brate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        buyer: BUYER_WALLET,
        solAmount: SOL_AMOUNT,
      }),
    });

    const data = await res.json();
    console.log("Respuesta del servidor:", data);
  } catch (err) {
    console.error("Error en la prueba:", err);
  }
}

testBuyBrate();
