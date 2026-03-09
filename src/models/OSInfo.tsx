"use client"

import { useState } from "react"

export default function OSInfo() {

  const [data,setData] = useState<any>(null)

  const scan = async () => {
    const res = await window.electronAPI.scanSystem()
    setData(res)
  }

  return (

    <div>

      <h2 className="text-2xl font-bold mb-4">
        OS Information
      </h2>

      <button
        onClick={scan}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Scan
      </button>

      {data && (

        <pre className="mt-5 bg-black text-green-400 p-4">
          {JSON.stringify(data,null,2)}
        </pre>

      )}

    </div>

  )

}