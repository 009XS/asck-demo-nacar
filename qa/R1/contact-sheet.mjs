import sharp from 'sharp'
import { readFileSync } from 'node:fs'
const m=JSON.parse(readFileSync('public/film/manifest.json','utf8'))
const ids=Array.from({length:12},(_,i)=>Math.round(i*263/11))
const tiles=await Promise.all(ids.map(async(index,i)=>({input:await sharp(`public${m.sets.desktop[index]}`).resize(480,270,{fit:'cover'}).webp().toBuffer(),left:(i%4)*480,top:Math.floor(i/4)*270})))
await sharp({create:{width:1920,height:810,channels:3,background:'#10201c'}}).composite(tiles).webp().toFile('qa/R1/film-12-contact-sheet.webp')
