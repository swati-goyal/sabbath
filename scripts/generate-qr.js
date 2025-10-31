import os from 'os';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';

const PORT = process.env.PORT || 3000;
const PUBLIC_URL = "https://swati-goyal.github.io/sabbath/";
// process.env.PUBLIC_URL; // e.g. https://<user>.github.io/<repo>/

function getLocalIPv4() {
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost';
}

async function main() {
  const ip = getLocalIPv4();
  const base = PUBLIC_URL ? PUBLIC_URL.replace(/\/$/, '') : `http://${ip}:${PORT}`;
  const url = `${base}?reveal=1`;

  const outDir = path.join(process.cwd(), 'qr');
  const outPath = path.join(outDir, 'qr.png');
  fs.mkdirSync(outDir, { recursive: true });

  await QRCode.toFile(outPath, url, {
    type: 'png',
    errorCorrectionLevel: 'H',
    margin: 2,
    width: 512
  });

  console.log(`QR generated for ${url}`);
  console.log(`Saved to: ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


