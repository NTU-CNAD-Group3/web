"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const data = [
  { name: "00:00", cpu: 65, memory: 58, network: 42 },
  { name: "04:00", cpu: 59, memory: 60, network: 45 },
  { name: "08:00", cpu: 80, memory: 71, network: 60 },
  { name: "12:00", cpu: 81, memory: 76, network: 65 },
  { name: "16:00", cpu: 76, memory: 70, network: 58 },
  { name: "20:00", cpu: 68, memory: 65, network: 50 },
  { name: "24:00", cpu: 62, memory: 60, network: 47 },
]

export function ServerMetrics() {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="cpu" stroke="#f97316" activeDot={{ r: 8 }} name="CPU (%)" />
          <Line type="monotone" dataKey="memory" stroke="#06b6d4" name="Memory (%)" />
          <Line type="monotone" dataKey="network" stroke="#8b5cf6" name="Network (Mbps)" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
