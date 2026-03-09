"use client"

export default function Header({ metrics }: any) {

  return (

    <div className="h-16 bg-white border-b flex items-center justify-between px-8">

      <h1 className="text-xl font-bold">
        Desktop Monitoring System
      </h1>

      {/* Live Data */}
      <div className="flex gap-6 text-sm">

        <div className="bg-gray-100 px-4 py-2 rounded">
          CPU: <span className="font-bold">{metrics?.cpu ?? 0}%</span>
        </div>

        <div className="bg-gray-100 px-4 py-2 rounded">
          Memory: <span className="font-bold">{metrics?.memory ?? 0}%</span>
        </div>

        <div className="bg-gray-100 px-4 py-2 rounded">
          Disk: <span className="font-bold">{metrics?.disk ?? 0}%</span>
        </div>

      </div>

    </div>

  )

}