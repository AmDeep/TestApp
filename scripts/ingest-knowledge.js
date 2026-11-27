import path from 'node:path'
import { mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import dotenv from 'dotenv'
import { PGlite } from '@electric-sql/pglite'
import { ingestKnowledge } from '../src/knowledge.js'
dotenv.config()
const root=path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const dir=process.env.DATABASE_DIR||path.join(root,'data','db')
mkdirSync(path.dirname(dir),{recursive:true})
const db=new PGlite(dir)
try{await db.waitReady;const result=await ingestKnowledge(db,{force:process.argv.includes('--force')});console.log('\nKnowledge ingestion complete:',result)}catch(error){console.error('Knowledge ingestion failed:',error);process.exitCode=1}finally{await db.close()}
