import React from 'react'
import { DndContext, KeyboardSensor, PointerSensor, closestCorners, useDroppable, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, arrayMove, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, Circle, Clock3, CheckCircle2 } from 'lucide-react'

const LANES=[{id:'planned',label:'Planned',Icon:Circle},{id:'doing',label:'In progress',Icon:Clock3},{id:'done',label:'Completed',Icon:CheckCircle2}]
function SortableProject({item,onDelete}){
 const {attributes,listeners,setNodeRef,transform,transition,isDragging}=useSortable({id:String(item.id)})
 return <article ref={setNodeRef} style={{transform:CSS.Transform.toString(transform),transition,opacity:isDragging ? .45 : 1}} className="project-row sortable-project kanban-card">
  <button type="button" className="drag-handle" aria-label={`Drag ${item.title} to another project stage`} {...attributes} {...listeners}><GripVertical size={16}/></button>
  <div className="project-main"><b>{item.title}</b><small>{item.room||'Whole home'} · {item.priority||'medium'} priority · {item.estimate?`Estimate ${Number(item.estimate).toLocaleString()}`:'No estimate'}</small></div>
  <button type="button" className="icon-button" aria-label={`Delete ${item.title}`} onClick={()=>onDelete(item.id)}><Trash2 size={15}/></button>
 </article>
}
function Lane({lane,items,onDelete}){
 const {setNodeRef,isOver}=useDroppable({id:`lane:${lane.id}`})
 const Icon=lane.Icon
 return <section ref={setNodeRef} className={`project-lane ${isOver?'drop-active':''}`} aria-label={`${lane.label} projects`}>
  <header><span><Icon size={15}/><b>{lane.label}</b></span><em>{items.length}</em></header>
  <SortableContext items={items.map(x=>String(x.id))} strategy={verticalListSortingStrategy}>
   <div className="project-lane-list">{items.map(item=><SortableProject key={item.id} item={item} onDelete={onDelete}/>)}{!items.length&&<div className="lane-empty">Drop a project here</div>}</div>
  </SortableContext>
 </section>
}
export default function ProjectBoard({projects=[],onReorder,onStatus,onDelete}){
 const sensors=useSensors(useSensor(PointerSensor,{activationConstraint:{distance:6}}),useSensor(KeyboardSensor,{coordinateGetter:sortableKeyboardCoordinates}))
 const normalized=projects.map(x=>({...x,status:LANES.some(l=>l.id===x.status)?x.status:'planned'}))
 function handleDragEnd({active,over}){
  if(!over)return
  const activeItem=normalized.find(x=>String(x.id)===String(active.id));if(!activeItem)return
  const overId=String(over.id)
  let nextStatus=overId.startsWith('lane:')?overId.slice(5):normalized.find(x=>String(x.id)===overId)?.status
  if(!LANES.some(l=>l.id===nextStatus))return
  const next=normalized.map(x=>String(x.id)===String(active.id)?{...x,status:nextStatus}:x)
  if(activeItem.status!==nextStatus){onStatus(activeItem.id,nextStatus);onReorder(next)}
  else if(!overId.startsWith('lane:')){const laneItems=next.filter(x=>x.status===nextStatus);const from=laneItems.findIndex(x=>String(x.id)===String(active.id));const to=laneItems.findIndex(x=>String(x.id)===overId);if(from>=0&&to>=0&&from!==to){const moved=arrayMove(laneItems,from,to);let cursor=0;onReorder(next.map(x=>x.status===nextStatus?moved[cursor++]:x))}}
 }
 return <DndContext sensors={sensors} collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
  <div className="project-kanban">{LANES.map(lane=><Lane key={lane.id} lane={lane} items={normalized.filter(x=>x.status===lane.id)} onDelete={onDelete}/>)}</div>
 </DndContext>
}
