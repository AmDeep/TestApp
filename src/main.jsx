import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import './index.css'

class AppErrorBoundary extends React.Component {
  constructor(props){super(props);this.state={hasError:false}}
  static getDerivedStateFromError(){return {hasError:true}}
  componentDidCatch(error,info){console.error('Harmonious Home render error:',error,info)}
  render(){
    if(this.state.hasError)return <main className="app-error"><div className="brand-mark" style={{margin:'0 auto'}}>H</div><h1>We hit an unexpected snag.</h1><p>Your saved workspace data has not been intentionally cleared. Reload the application to try again. If this repeats, export a backup when the workspace is available and share the browser console error with support.</p><button className="btn btn-dark" onClick={()=>window.location.reload()}>Reload application ↻</button></main>
    return this.props.children
  }
}

const queryClient = new QueryClient({ defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } } })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode><QueryClientProvider client={queryClient}><AppErrorBoundary><App/></AppErrorBoundary><Toaster position="bottom-right" richColors closeButton duration={3200}/></QueryClientProvider></React.StrictMode>
)
