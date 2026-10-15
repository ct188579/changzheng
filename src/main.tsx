import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

console.log(
  '%c南京信息职业技术学院  移动应用2504  陈涛',
  'padding:10px 24px;border:1px solid #b35940;border-radius:4px;background:#1a1614;' +
    'color:#e7d9c4;font:600 13px/1.7 "Noto Serif SC",serif;letter-spacing:.1em',
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
