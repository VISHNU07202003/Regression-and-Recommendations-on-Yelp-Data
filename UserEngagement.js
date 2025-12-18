import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import './UserEngagement.css';

Chart.register(...registerables);

function UserEngagement({ data }) {
  const chartRef = useRef();
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data || !data.daily) return;

    // Destroy previous chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const ctx = chartRef.current.getContext('2d');

    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.daily.map(d => d.day),
        datasets: [
          {
            label: 'Reviews',
            data: data.daily.map(d => d.reviews),
            backgroundColor: 'rgba(211, 35, 35, 0.7)',
            borderColor: '#d32323',
            borderWidth: 2,
            yAxisID: 'y'
          },
          {
            label: 'Active Users',
            data: data.daily.map(d => d.users),
            backgroundColor: 'rgba(0, 115, 187, 0.7)',
            borderColor: '#0073bb',
            borderWidth: 2,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 12,
                weight: '600'
              },
              padding: 15,
              usePointStyle: true
            }
          },
          tooltip: {
            backgroundColor: 'rgba(26, 26, 26, 0.95)',
            padding: 12,
            titleFont: {
              size: 14,
              weight: '600'
            },
            bodyFont: {
              size: 13
            },
            borderColor: '#d32323',
            borderWidth: 1,
            displayColors: true
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 12
              }
            }
          },
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Number of Reviews',
              font: {
                size: 13,
                weight: '600'
              }
            },
            grid: {
              color: 'rgba(0, 0, 0, 0.05)'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Active Users',
              font: {
                size: 13,
                weight: '600'
              }
            },
            grid: {
              drawOnChartArea: false
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  if (!data) return null;

  return (
    <div className="viz-card full-width">
      <div className="card-header">
        <div className="header-left">
          <h2>👤 User Engagement Metrics</h2>
          <p>Review activity patterns and user behavior</p>
        </div>
      </div>
      <div className="card-body">
        <div className="engagement-chart-container">
          <canvas ref={chartRef}></canvas>
        </div>
      </div>
    </div>
  );
}

export default UserEngagement;