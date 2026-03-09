"use client"

import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts"

export default function SystemChart({ data }: any) {

  return (

    <LineChart width={600} height={300} data={data}>

      <XAxis dataKey="time" />
      <YAxis />

      <Tooltip />

      <Line type="monotone" dataKey="cpu" />
      <Line type="monotone" dataKey="memory" />

    </LineChart>

  )

}