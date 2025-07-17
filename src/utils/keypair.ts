import { Keypair } from '@solana/web3.js';

const secretKey = JSON.parse(process.env.PRIVATE_KEY as string);
const keypair = Keypair.fromSecretKey(Uint8Array.from(secretKey));

export default keypair;
