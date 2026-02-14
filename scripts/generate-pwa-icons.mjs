#!/usr/bin/env node
import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')
const iconSvg = readFileSync(join(publicDir, 'icon.svg'))

const sizes = [192, 512, 180] // 180 for apple-touch-icon

for (const size of sizes) {
  const buffer = await sharp(iconSvg)
    .resize(size, size)
    .png()
    .toBuffer()
  
  const filename = size === 180 ? 'apple-touch-icon.png' : `icon-${size}.png`
  writeFileSync(join(publicDir, filename), buffer)
  console.log(`Generated ${filename}`)
}
