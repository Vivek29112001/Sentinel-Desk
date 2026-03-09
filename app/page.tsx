"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/src/components/sidebar/Sidebar"
import MainMenu from "@/src/components/mainmenu/MainMenu"
import Header from "@/src/components/header/Header"

export default function Home() {

  const [page,setPage] = useState("dashboard")
  const [metrics,setMetrics] = useState<any>(null)
  const [history,setHistory] = useState<any[]>([])

  const scan = async () => {

    if (!window?.electronAPI) return

    const result = await window.electronAPI.scanSystem()

    if (!result) return

    setMetrics(result)

    setHistory(prev => [
      ...prev.slice(-20),
      {
        time:new Date().toLocaleTimeString(),
        cpu:result.cpu,
        memory:result.memory
      }
    ])

  }

  useEffect(()=>{

    scan()

    const interval = setInterval(scan,5000)

    return ()=>clearInterval(interval)

  },[])


  return (

    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar setPage={setPage}/>

      {/* Right Side */}
      <div className="flex flex-col flex-1">

        {/* Header */}
        <Header metrics={metrics}/>

        {/* Main Menu */}
        <div className="flex-1 overflow-y-auto">

          <MainMenu
            page={page}
            metrics={metrics}
            history={history}
          />

        </div>

      </div>

    </div>

  )

}