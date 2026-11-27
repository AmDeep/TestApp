import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Headphones, Play, Square, X } from 'lucide-react'
import { useUIStore } from './uiStore.js'

const VOICES = [
  { label:'Ava · US English', value:'en-US-AvaNeural' },
  { label:'Andrew · US English', value:'en-US-AndrewNeural' },
  { label:'Emma · US English', value:'en-US-EmmaNeural' },
  { label:'Brian · US English', value:'en-US-BrianNeural' },
  { label:'Clara · Canadian English', value:'en-CA-ClaraNeural' },
  { label:'Liam · Canadian English', value:'en-CA-LiamNeural' },
]

/** Azure Speech is loaded only after the user presses Play; no speech key reaches the browser. */
export default function AzureNarrator({ onNotice }) {
  const [open,setOpen]=useState(false)
  const voice=useUIStore(state=>state.speechVoice)
  const setVoice=useUIStore(state=>state.setSpeechVoice)
  const rate=useUIStore(state=>state.speechRate)
  const setRate=useUIStore(state=>state.setSpeechRate)
  const [status,setStatus]=useState('idle')
  const [message,setMessage]=useState('')
  const synthesizer=useRef(null)
  const fallbackUtterance=useRef(null)
  const stopped=useRef(false)

  const stop=useCallback(()=>{
    stopped.current=true
    try{synthesizer.current?.close()}catch{}
    synthesizer.current=null
    if('speechSynthesis' in window)window.speechSynthesis.cancel()
    fallbackUtterance.current=null
    setStatus('idle')
  },[])
  useEffect(()=>()=>stop(),[stop])

  async function play(){
    const content=document.querySelector('.content')?.innerText?.replace(/\s+/g,' ').trim().slice(0,7000)
    if(!content){onNotice?.('There is no page content to read.');return}
    stop();stopped.current=false;setStatus('loading');setMessage('Connecting to Microsoft neural speech…')
    try{
      const response=await fetch('/api/speech/token',{credentials:'include'})
      const data=await response.json()
      if(!response.ok)throw new Error(data.error||'Microsoft neural speech is not configured.')
      const sdk=await import('microsoft-cognitiveservices-speech-sdk')
      if(stopped.current)return
      const config=sdk.SpeechConfig.fromAuthorizationToken(data.token,data.region)
      config.speechSynthesisVoiceName=voice
      config.speechSynthesisOutputFormat=sdk.SpeechSynthesisOutputFormat.Audio24Khz48KBitRateMonoMp3
      const player=new sdk.SpeechSynthesizer(config,sdk.AudioConfig.fromDefaultSpeakerOutput())
      synthesizer.current=player;setStatus('speaking');setMessage('Speaking with Microsoft neural voice')
      player.speakTextAsync(content,result=>{
        if(stopped.current)return
        if(result.reason===sdk.ResultReason.SynthesizingAudioCompleted){setStatus('idle');setMessage('Finished');try{player.close()}catch{};synthesizer.current=null}
        else{setStatus('error');setMessage(result.errorDetails||'Speech synthesis did not complete');try{player.close()}catch{};synthesizer.current=null}
      },error=>{if(!stopped.current){setStatus('error');setMessage(String(error));try{player.close()}catch{};synthesizer.current=null}})
    }catch(error){
      if(stopped.current)return
      // Graceful local fallback; it may sound more robotic than Azure Neural voices.
      if('speechSynthesis' in window){try{const u=new SpeechSynthesisUtterance(content);u.rate=rate;u.pitch=1;u.onend=()=>{setStatus('idle');setMessage('Finished using browser voice')};u.onerror=()=>{setStatus('error');setMessage('Browser speech playback failed')};fallbackUtterance.current=u;window.speechSynthesis.speak(u);setStatus('speaking');setMessage('Using browser fallback · configure Azure Speech for neural voices')}catch{setStatus('error');setMessage(error.message)}}else{setStatus('error');setMessage(error.message)}
    }
  }
  return <div className="narrator-wrap">
    <button type="button" className="audio-control" title="Microsoft neural narration" aria-expanded={open} onClick={()=>setOpen(v=>!v)}><Headphones size={15}/><span>Voice</span></button>
    {open&&<section className="narrator-popover" role="dialog" aria-label="Voice narration settings">
      <header><div><b>Voice narration</b><small>Microsoft Azure neural speech</small></div><button className="icon-button" onClick={()=>setOpen(false)} aria-label="Close voice settings"><X size={15}/></button></header>
      <label>Voice<select value={voice} onChange={e=>setVoice(e.target.value)}>{VOICES.map(v=><option value={v.value} key={v.value}>{v.label}</option>)}</select></label>
      <label className="narrator-rate">Browser fallback speed <b>{rate.toFixed(1)}×</b><input type="range" min="0.8" max="1.2" step="0.1" value={rate} onChange={e=>setRate(Number(e.target.value))}/></label>
      <div className="narrator-actions"><button className="btn btn-dark" onClick={play} disabled={status==='loading'}>{status==='loading'?'Connecting…':<><Play size={14}/> Read page</>}</button><button className="btn btn-light" onClick={stop}><Square size={13}/> Stop</button></div>
      <p className={`narrator-status ${status==='error'?'error':''}`} aria-live="polite">{message||'Azure Neural voice is used when configured; browser speech is the fallback.'}</p>
      <small className="narrator-privacy">Page text is sent to your configured Azure Speech resource for synthesis. No audio recording is made.</small>
    </section>}
  </div>
}
