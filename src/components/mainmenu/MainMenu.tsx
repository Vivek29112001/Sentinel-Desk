"use client"

import SystemChart from "@/src/components/SystemChart"

export default function MainMenu({ page, metrics, history }: any) {

  const Dashboard = () => (

    <div className="space-y-10">

      <h1 className="text-3xl font-bold">
        Desktop Monitoring Dashboard
      </h1>

      {metrics && (

        <div className="grid grid-cols-3 gap-5">

          <div className="p-5 bg-gray-100 rounded">
            CPU Usage
            <h2 className="text-xl">{metrics?.cpu ?? 0}%</h2>
          </div>

          <div className="p-5 bg-gray-100 rounded">
            Memory Usage
            <h2 className="text-xl">{metrics?.memory ?? 0}%</h2>
          </div>

          <div className="p-5 bg-gray-100 rounded">
            Disk Usage
            <h2 className="text-xl">{metrics?.disk ?? 0}%</h2>
          </div>

        </div>

      )}

      <SystemChart data={history}/>
       <SystemChart data={history}/>
        <SystemChart data={history}/>

    </div>

  )

  const OSInfo = () => (
    <h2 className="text-2xl font-bold">OS Information Module</h2>
  )

  const CPU = () => (
    <h2 className="text-2xl font-bold">CPU & Memory Module</h2>
  )

  const Disk = () => (
    <h2 className="text-2xl font-bold">Disk Usage Module</h2>
  )

  const Network = () => (
    <h2 className="text-2xl font-bold">Network Scanner</h2>
  )

  const Antivirus = () => (
    <h2 className="text-2xl font-bold">Antivirus Status</h2>
  )

  const AD = () => (
    <h2 className="text-2xl font-bold">AD Scanner</h2>
  )

  const renderPage = () => {

    switch(page){

      case "os": return <OSInfo/>
      case "cpu": return <CPU/>
      case "disk": return <Disk/>
      case "network": return <Network/>
      case "antivirus": return <Antivirus/>
      case "ad": return <AD/>

      default: return <Dashboard/>

    }

  }

  return (
    <div className="p-10">
      {renderPage()}
    </div>
  )
}