export const PAGE_SLUGS = Object.freeze({
  overview:'overview', assessment:'assessment', results:'results', layout:'room-plan',
  explore:'explorer', rooms:'room-journal', projects:'projects', budget:'budget',
  finance:'finance', maintenance:'maintenance', compare:'compare', history:'history',
  account:'household', settings:'settings', assistant:'home-assistant'
})
export const SLUG_PAGES = Object.freeze(Object.fromEntries(Object.entries(PAGE_SLUGS).map(([page,slug])=>[slug,page])))
export const FINANCE_SECTIONS = Object.freeze(['overview','transactions','vendors','orders','invoices'])

export function routeFromPath(pathname='/') {
  const parts=String(pathname||'/').replace(/^\/+|\/+$/g,'').split('/').filter(Boolean)
  const root=parts[0]==='app'?parts.slice(1):parts
  if(!root.length)return {page:'overview',financeTab:'overview',invalid:false}
  const page=SLUG_PAGES[root[0]]
  if(!page)return {page:'overview',financeTab:'overview',invalid:true}
  const financeTab=page==='finance'&&FINANCE_SECTIONS.includes(root[1])?root[1]:'overview'
  const invalid=page==='finance'?(root.length>2||(root[1]!==undefined&&!FINANCE_SECTIONS.includes(root[1]))):root.length>1
  return {page,financeTab,invalid}
}
export function routeUrl(page,financeTab='overview') {
  const slug=PAGE_SLUGS[page]||PAGE_SLUGS.overview
  return `/app/${slug}${page==='finance'?`/${FINANCE_SECTIONS.includes(financeTab)?financeTab:'overview'}`:''}`
}
