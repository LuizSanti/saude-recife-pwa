import sharp from 'sharp'
import { readFileSync } from 'node:fs'

const FUNDO = '#00985d'
const logo = readFileSync('src/assets/logoSaudeSenior.svg')

async function gerar(tamanho, proporcao, arquivo) {
  const lado = Math.round(tamanho * proporcao)

  const logoPng = await sharp(logo, { density: 400 })
    .resize(lado, lado, {
      fit: 'contain',
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png()
    .toBuffer()

  await sharp({
    create: { width: tamanho, height: tamanho, channels: 4, background: FUNDO },
  })
    .composite([{ input: logoPng, gravity: 'center' }])
    .png()
    .toFile(`public/${arquivo}`)
}

await gerar(64, 0.8, 'pwa-64x64.png')
await gerar(192, 0.8, 'pwa-192x192.png')
await gerar(512, 0.8, 'pwa-512x512.png')
await gerar(512, 0.5, 'maskable-icon-512x512.png')
await gerar(180, 0.7, 'apple-touch-icon-180x180.png')

console.log('Ícones gerados em public/')