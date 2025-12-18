import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './RatingHeatmap.css';

function RatingHeatmap({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 50, right: 50, bottom: 100, left: 150 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Get unique categories and hours
    const categories = [...new Set(data.map(d => d.category))];
    const hours = [...new Set(data.map(d => d.hour))].sort((a, b) => a - b);

    // Create scales
    const xScale = d3.scaleBand()
      .domain(hours)
      .range([0, width])
      .padding(0.05);

    const yScale = d3.scaleBand()
      .domain(categories)
      .range([0, height])
      .padding(0.05);

    const colorScale = d3.scaleSequential()
      .interpolator(d3.interpolateReds)
      .domain([0, d3.max(data, d => d.value)]);

    // Add cells
    svg.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', d => xScale(d.hour))
      .attr('y', d => yScale(d.category))
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .attr('fill', d => colorScale(d.value))
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .attr('rx', 4)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('stroke', '#d32323')
          .attr('stroke-width', 3);
        
        showTooltip(event, d);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('stroke', 'white')
          .attr('stroke-width', 2);
        
        hideTooltip();
      });

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale).tickFormat(d => `${d}:00`))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#5a5a5a');

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#5a5a5a');

    // Add X axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + 60)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('fill', '#1a1a1a')
      .text('Time of Day (Hour)');

    // Add Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -height / 2)
      .attr('y', -100)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('fill', '#1a1a1a')
      .text('Business Category');

    // Add legend
    const legendWidth = 300;
    const legendHeight = 20;

    const legendScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([0, legendWidth]);

    const legendAxis = d3.axisBottom(legendScale)
      .ticks(5)
      .tickFormat(d => d.toFixed(0));

    const legend = svg.append('g')
      .attr('transform', `translate(${width - legendWidth},${-30})`);

    const defs = svg.append('defs');
    const linearGradient = defs.append('linearGradient')
      .attr('id', 'legend-gradient');

    linearGradient.selectAll('stop')
      .data(d3.range(0, 1.1, 0.1))
      .join('stop')
      .attr('offset', d => `${d * 100}%`)
      .attr('stop-color', d => colorScale(d * d3.max(data, d => d.value)));

    legend.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#legend-gradient)');

    legend.append('g')
      .attr('transform', `translate(0,${legendHeight})`)
      .call(legendAxis)
      .selectAll('text')
      .style('font-size', '11px');

    legend.append('text')
      .attr('x', legendWidth / 2)
      .attr('y', -8)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .text('Review Volume');

  }, [data]);

  const showTooltip = (event, d) => {
    const tooltip = d3.select('body').append('div')
      .attr('class', 'heatmap-tooltip')
      .style('position', 'absolute')
      .style('background', 'rgba(26, 26, 26, 0.95)')
      .style('color', 'white')
      .style('padding', '12px 16px')
      .style('border-radius', '8px')
      .style('font-size', '14px')
      .style('pointer-events', 'none')
      .style('box-shadow', '0 4px 12px rgba(0,0,0,0.3)')
      .style('z-index', '9999');

    tooltip.html(`
      <strong>${d.category}</strong><br/>
      Time: ${d.hour}:00<br/>
      Reviews: ${d.value}<br/>
      Avg Rating: ${d.avgRating} ⭐
    `)
    .style('left', (event.pageX + 10) + 'px')
    .style('top', (event.pageY - 10) + 'px');
  };

  const hideTooltip = () => {
    d3.selectAll('.heatmap-tooltip').remove();
  };

  return (
    <div className="viz-card full-width" id="reviews">
      <div className="card-header">
        <div className="header-left">
          <h2>🔥 Rating Distribution Heatmap</h2>
          <p>Review activity by business category and time of day</p>
        </div>
      </div>
      <div className="card-body">
        <svg ref={svgRef} className="heatmap-svg"></svg>
      </div>
    </div>
  );
}

export default RatingHeatmap;