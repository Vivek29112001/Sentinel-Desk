"use client"

export default function Sidebar({ setPage }: any) {

  const items = [
    { id: "dashboard", label: "Dashboard" },
    { id: "os", label: "1. OS Info" },
    { id: "cpu", label: "2. CPU & Memory" },
    { id: "disk", label: "3. Disk Usage" },
    { id: "network", label: "4. Network" },
    { id: "antivirus", label: "5. Antivirus" },
    { id: "ad", label: "6. AD Scanner" }
  ]

  return (

    <div className="w-64 h-screen bg-blue-900 text-white flex flex-col p-5">

     {/* Logo / Name */}
      <div className="p-0 border-b  flex items-center gap-3">

        <img
          src="/logo.png"
          className="w-10 h-10"
        />

        <h2 className="text-lg font-bold">
          Turbo Scanner
        </h2>

      </div>

      <div className="flex flex-col gap-2">

        {items.map((item)=>(
          <div
            key={item.id}
            onClick={()=>setPage(item.id)}
            className="p-3 hover:bg-blue-700 cursor-pointer rounded"
          >
            {item.label}
          </div>
        ))}

      </div>

    </div>

  )

}