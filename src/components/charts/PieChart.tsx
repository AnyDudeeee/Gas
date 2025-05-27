import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface PieChartProps {
  title: string;
  labels: string[];
  data: number[];
  colors?: string[];
  className?: string;
}

const PieChart: React.FC<PieChartProps> = ({
  title,
  labels,
  data,
  colors = ['#2563eb', '#f59e0b', '#ef4444', '#10b981', '#6366f1'],
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
        // Ensure we have enough colors
        const usedColors = [...colors];
        while (usedColors.length < data.length) {
          usedColors.push(colors[usedColors.length % colors.length]);
        }
        
        chartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels,
            datasets: [
              {
                data,
                backgroundColor: usedColors,
                borderColor: '#ffffff',
                borderWidth: 2,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  usePointStyle: true,
                  padding: 20,
                  font: {
                    size: 12,
                  },
                },
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
            cutout: '70%',
          },
        });
      }
    }
    
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [title, labels, data, colors]);
  
  return (
    <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
      <div style={{ height: '250px' }}>
        <canvas ref={chartRef}></canvas>
      </div>
    </div>
  );
};

export default PieChart;