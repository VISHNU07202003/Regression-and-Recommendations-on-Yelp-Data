import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import './TimelineChart.css';

function TimelineChart({ data }) {
  const svgRef = useRef();
  const [metric, setMetric] = useState('volume');

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 60, left: 70 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Parse dates
    const parseDate = d3.timeParse('%Y-%m-%d');
    const formattedData = data.map(d => ({
      ...d,
      date: parseDate(d.date)
    }));

    // Create scales
    const xScale = d3.scaleTime()
      .domain(d3.extent(formattedData, d => d.date))
      .range([0, width]);

    let yScale;
    if (metric === 'volume') {
      yScale = d3.scaleLinear()
        .domain([0, d3.max(formattedData, d => d.volume)])
        .nice()
        .range([height, 0]);
    } else if (metric === 'avgRating') {
      yScale = d3.scaleLinear()
        .domain([0, 5])
        .range([height, 0]);
    } else { // sentiment
      yScale = d3.scaleLinear()
        .domain([0, d3.max(formattedData, d => d.sentiment.positive)])
        .nice()
        .range([height, 0]);
    }

    // Add grid
    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale)
        .tickSize(-width)
        .tickFormat('')
      )
      .style('stroke', '#e8e8e8')
      .style('stroke-dasharray', '3,3');

    // Create line generator
    const line = d3.line()
      .x(d => xScale(d.date))
      .y(d => {
        if (metric === 'volume') return yScale(d.volume);
        if (metric === 'avgRating') return yScale(parseFloat(d.avgRating));
        return yScale(d.sentiment.positive);
      })
      .curve(d3.curveMonotoneX);

    // Add area
    const area = d3.area()
      .x(d => xScale(d.date))
      .y0(height)
      .y1(d => {
        if (metric === 'volume') return yScale(d.volume);
        if (metric === 'avgRating') return yScale(parseFloat(d.avgRating));
        return yScale(d.sentiment.positive);
      })
      .curve(d3.curveMonotoneX);

    svg.append('path')
      .datum(formattedData)
      .attr('fill', 'rgba(211, 35, 35, 0.1)')
      .attr('d', area);

    // Add line
    const path = svg.append('path')
      .datum(formattedData)
      .attr('fill', 'none')
      .attr('stroke', '#d32323')
      .attr('stroke-width', 3)
      .attr('d', line);

    // Animate line
    const totalLength = path.node().getTotalLength();
    path
      .attr('stroke-dasharray', totalLength + ' ' + totalLength)
      .attr('stroke-dashoffset', totalLength)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr('stroke-dashoffset', 0);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale)
        .ticks(8)
        .tickFormat(d3.timeFormat('%b %Y'))
      )
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#5a5a5a')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(yScale).ticks(6))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#5a5a5a');

    // Add Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -50)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('fill', '#1a1a1a')
      .text(metric === 'volume' ? 'Review Volume' : metric === 'avgRating' ? 'Average Rating' : 'Positive Reviews');

  }, [data, metric]);

  return (
    <div className="viz-card full-width">
      <div className="card-header">
        <div className="header-left">
          <h2>📈 Review Volume Over Time</h2>
          <p>Monthly trends with sentiment analysis</p>
        </div>
        <div className="header-actions">
          <button 
            className={`btn-metric ${metric === 'volume' ? 'active' : ''}`}
            onClick={() => setMetric('volume')}
          >
            Volume
          </button>
          <button 
            className={`btn-metric ${metric === 'sentiment' ? 'active' : ''}`}
            onClick={() => setMetric('sentiment')}
          >
            Sentiment
          </button>
          <button 
            className={`btn-metric ${metric === 'avgRating' ? 'active' : ''}`}
            onClick={() => setMetric('avgRating')}
          >
            Avg Rating
          </button>
        </div>
      </div>
      <div className="card-body">
        <svg ref={svgRef} className="timeline-svg"></svg>
      </div>
    </div>
  );
}

export default TimelineChart;