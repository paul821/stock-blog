'use client';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ChartCellProps {
  data: any[];
  type?: 'line' | 'bar';
  title?: string;
}

export function ChartCell({ data, type = 'line', title }: ChartCellProps) {
  return (
    <div className="w-full h-80">
      {title && <h4 className="text-lg font-semibold mb-4">{title}</h4>}
      <ResponsiveContainer width="100%" height="100%">
        {type === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="volume" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="price" fill="#3b82f6" />
            <Bar dataKey="volume" fill="#10b981" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
