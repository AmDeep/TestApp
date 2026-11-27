import React,{useCallback,useEffect,useRef,useState} from 'react'
import {Headphones,Play,Square,X,LoaderCircle} from 'lucide-react'
import {useUIStore} from './uiStore.js'

const VOICES=[
 {group:'American English · feminine',items:[['af_heart','Heart'],['af_bella','Bella'],['af_nicole','Nicole'],['af_sarah','Sarah'],['af_sky','Sky'],['af_nova','Nova'],['af_aoede','Aoede'],['af_kore','Kore'],['af_alloy','Alloy'],['af_jessica','Jessica'],['af_river','River']]},
 {group:'American English · masculine',items:[['am_michael','Michael'],['am_fenrir','Fenrir'],['am_puck','Puck'],['am_adam','Adam'],['am_echo','Echo'],['am_eric','Eric'],['am_liam','Liam'],['am_onyx','Onyx']]},
 {group:'British English',items:[['bf_emma','Emma'],['bf_isabella','Isabella'],['bf_alice','Alice'],['bf_lily','Lily'],['bm_george','George'],['bm_lewis','Lewis'],['bm_daniel','Daniel'],['bm_fable','Fable']]}
]
const MODEL='onnx-community/Kokoro-82M-v1.0-ONNX'
let enginePromise
function getEngine(setMessage){
 if(!enginePromise)enginePromise=(async()=>{setMessage('Loading the local Kokoro voice model (first use downloads it once)…');const {KokoroTTS}=await import('kokoro-js');let webgpu=false;try{if(navigator.gpu){const adapter=await navigator.gpu.requestAdapter();webgpu=!!adapter}}catch{}if(webgpu){try{setMessage('Preparing WebGPU speech engine…');return await KokoroTTS.from_pretrained(MODEL,{dtype:'fp32',device:'webgpu'})}catch(error){setMessage('WebGPU is unavailable here. Switching to the compatible WebAssembly engine…')}}setMessage('Preparing WebAssembly speech engine…');return KokoroTTS.from_pretrained(MODEL,{dtype:'q8',device:'wasm'})})().catch(error=>{enginePromise=null;throw error})
 return enginePromise
}
function toWavBlob(samples,sampleRate){
 const data=samples instanceof Float32Array?samples:Float32Array.from(samples),buffer=new ArrayBuffer(44+data.length*2),view=new DataView(buffer)
 const write=(offset,value)=>{for(let i=0;i<value.length;i++)view.setUint8(offset+i,value.charCodeAt(i))}
 write(0,'RIFF');view.setUint32(4,36+data.length*2,true);write(8,'WAVE');write(12,'fmt ');view.setUint32(16,16,true);view.setUint16(20,1,true);view.setUint16(22,1,true);view.setUint32(24,sampleRate,true);view.setUint32(28,sampleRate*2,true);view.setUint16(32,2,true);view.setUint16(34,16,true);write(36,'data');view.setUint32(40,data.length*2,true)
 let offset=44;for(let i=0;i<data.length;i++,offset+=2){const s=Math.max(-1,Math.min(1,data[i]));view.setInt16(offset,s<0?s*0x8000:s*0x7fff,true)}return new Blob([buffer],{type:'audio/wav'})
}
function splitText(text,max=420){const sentences=text.match(/[^.!?\n]+[.!?]?|\n+/g)||[text],parts=[];let current='';for(const sentence of sentences){const next=(current+' '+sentence).trim();if(next.length>max&&current){parts.push(current);current=sentence.trim()}else current=next}if(current)parts.push(current);return parts}
export default function KokoroNarrator({onNotice}){
 const [open,setOpen]=useState(false),[status,setStatus]=useState('idle'),[message,setMessage]=useState(''),[progress,setProgress]=useState(0)
 const voice=useUIStore(s=>s.speechVoice),setVoice=useUIStore(s=>s.setSpeechVoice),rate=useUIStore(s=>s.speechRate),setRate=useUIStore(s=>s.setSpeechRate)
 const player=useRef(null),stopFlag=useRef(false),urls=useRef([]),resolvePlayback=useRef(null)
 const stop=useCallback(()=>{stopFlag.current=true;try{player.current?.pause();if(player.current)player.current.currentTime=0}catch{}player.current=null;resolvePlayback.current?.();resolvePlayback.current=null;urls.current.forEach(URL.revokeObjectURL);urls.current=[];setStatus('idle');setProgress(0)},[])
 useEffect(()=>{if(!allVoices.some(([id])=>id===voice))setVoice('af_heart')},[voice,setVoice]);useEffect(()=>()=>stop(),[stop])
 async function play(){
  const content=document.querySelector('.content')?.innerText?.replace(/\s+/g,' ').trim().slice(0,6500)
  if(!content){onNotice?.('There is no page content to read.');return}
  stop();stopFlag.current=false;setStatus('loading');setProgress(0)
  try{
   const tts=await getEngine(setMessage);if(stopFlag.current)return
   const chunks=splitText(content);setMessage(`Generating local speech · ${chunks.length} segments`)
   for(let i=0;i<chunks.length;i++){
    if(stopFlag.current)break
    setMessage(`Generating segment ${i+1} of ${chunks.length}…`)
    const generated=await tts.generate(chunks[i],{voice})
    if(stopFlag.current)break
    const blob=toWavBlob(generated.audio,generated.sampling_rate),url=URL.createObjectURL(blob);urls.current.push(url)
    const audio=new Audio(url);audio.playbackRate=rate;player.current=audio
    setStatus('speaking');setProgress(Math.round((i/chunks.length)*100));setMessage(`Reading segment ${i+1} of ${chunks.length} · synthesized on this device`)
    await new Promise((resolve,reject)=>{resolvePlayback.current=resolve;audio.onended=()=>{resolvePlayback.current=null;resolve()};audio.onerror=()=>{resolvePlayback.current=null;reject(new Error('Audio playback failed.'))};audio.play().catch(error=>{resolvePlayback.current=null;reject(error)})})
   }
   if(!stopFlag.current){setProgress(100);setStatus('idle');setMessage('Finished reading. Your text stayed in this browser.')}else setMessage('Playback stopped.')
  }catch(error){if(!stopFlag.current){setStatus('error');setMessage(error.message||'Local speech could not start. Try another browser or reload the page.')}}
 }
 const allVoices=VOICES.flatMap(g=>g.items)
 return <div className="narrator-wrap"><button type="button" className="audio-control" title="Local neural speech narration" aria-expanded={open} onClick={()=>setOpen(v=>!v)}><Headphones size={15}/><span>Voice</span></button>{open&&<section className="narrator-popover" role="dialog" aria-label="Local voice settings"><header><div><b>Voice narration</b><small>Kokoro · open-source neural TTS</small></div><button className="icon-button" onClick={()=>setOpen(false)} aria-label="Close voice settings"><X size={15}/></button></header><label>Voice<select value={voice} onChange={e=>setVoice(e.target.value)}>{VOICES.map(group=><optgroup key={group.group} label={group.group}>{group.items.map(([id,name])=><option key={id} value={id}>{name}</option>)}</optgroup>)}</select></label><label className="narrator-rate">Speech speed <b>{rate.toFixed(1)}×</b><input type="range" min="0.8" max="1.2" step="0.1" value={rate} onChange={e=>setRate(Number(e.target.value))}/></label><div className="narrator-actions"><button className="btn btn-dark" onClick={play} disabled={status==='loading'||status==='speaking'}>{status==='loading'?<><LoaderCircle size={14}/> Loading…</>:<><Play size={14}/> Read page</>}</button><button className="btn btn-light" onClick={stop}><Square size={13}/> Stop</button></div>{status==='loading'||status==='speaking'?<div className="narrator-progress"><i style={{width:`${progress}%`}}/></div>:null}<p className={`narrator-status ${status==='error'?'error':''}`} aria-live="polite">{message||'Choose a voice and read the current page. The neural model is downloaded once and cached by your browser.'}</p><small className="narrator-privacy">Runs locally in your browser using Kokoro-82M and ONNX Runtime. No API key, server speech service, or audio upload. First use downloads the model (tens to hundreds of MB depending on runtime).</small></section>}</div>
}
