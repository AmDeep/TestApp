import React, { useEffect } from 'react'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Bold, Italic, List, ListOrdered, Undo2, Redo2 } from 'lucide-react'

export default function RichJournalEditor({value='',onChange}){
 const editor=useEditor({immediatelyRender:false,extensions:[StarterKit,Placeholder.configure({placeholder:'Capture observations, ideas and things to revisit…'})],content:value||'',onUpdate:({editor})=>onChange(editor.getHTML())})
 useEffect(()=>{if(editor&&value!==editor.getHTML())editor.commands.setContent(value||'',{emitUpdate:false})},[editor,value])
 if(!editor)return <div className="rich-editor-loading">Preparing your journal editor…</div>
 const actions=[['Bold',Bold,()=>editor.chain().focus().toggleBold().run(),editor.isActive('bold')],['Italic',Italic,()=>editor.chain().focus().toggleItalic().run(),editor.isActive('italic')],['Bulleted list',List,()=>editor.chain().focus().toggleBulletList().run(),editor.isActive('bulletList')],['Numbered list',ListOrdered,()=>editor.chain().focus().toggleOrderedList().run(),editor.isActive('orderedList')],['Undo',Undo2,()=>editor.chain().focus().undo().run(),false],['Redo',Redo2,()=>editor.chain().focus().redo().run(),false]]
 return <div className="rich-editor"><div className="rich-editor-toolbar">{actions.map(([label,Icon,run,active])=><button key={label} type="button" title={label} aria-label={label} aria-pressed={!!active} className={active?'active':''} onClick={run}><Icon size={15}/></button>)}</div><EditorContent editor={editor}/></div>
}
