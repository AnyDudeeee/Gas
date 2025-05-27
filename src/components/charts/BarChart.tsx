import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface BarChartProps {
  title: string;
  labels: string[];
  data: number[];
  color?: string;
  className?: string;
}

const BarChart: React.FC<BarChartProps> = ({
  title,
  labels,
  data,
  color = '#2563eb',
  className = ''
}) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  
  useEffect(() => {
    if (chartRef.current) {
      // Destroy previous chart if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      
      const ctx = chartRef.current.getContext('2d');
      
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels,
            datasets: [
              {
                label: title,
                data,
                backgroundColor: color,
                borderColor: color,
                borderWidth: 1,
                borderRadius: 4,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              title: {
                display: true,
                text: title,
                font: {
                  size: 14,
                },
                padding: {
                  bottom: 10,
                },
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  display: true,
                  drawBorder: false,
                  color: '#f1f5f9',
                },
                ticks: {
                  precision: 0,
                },
              },
              x: {
                grid: {
                  display: false,
                },
              },
            },
          },
        });
      }
    }
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [title, labels, data, color]);
  
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <div style={{ height: '250px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default BarChart;