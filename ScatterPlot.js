import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './ScatterPlot.css';

function ScatterPlot({ businesses }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!businesses || businesses.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Filter valid data
    const validData = businesses.filter(d => d.reviewCount > 0 && d.rating > 0);

    const margin = { top: 20, right: 30, bottom: 60, left: 70 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const xScale = d3.scaleLog()
      .domain([1, d3.max(validData, d => d.reviewCount)])
      .range([0, width]);

    const yScale = d3.scaleLinear()
      .domain([0, 5])
      .range([height, 0]);

    // Color by category
    const categories = [...new Set(validData.map(d => d.category))];
    const colorScale = d3.scaleOrdinal()
      .domain(categories)
      .range(['#d32323', '#ff9500', '#0073bb', '#00a699', '#9b59b6', '#e74c3c']);

    // Add grid
    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yScale)
        .tickSize(-width)
        .tickFormat('')
      )
      .style('stroke', '#e8e8e8')
      .style('stroke-dasharray', '3,3');

    // Add dots
    svg.selectAll('.dot')
      .data(validData)
      .join('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.reviewCount))
      .attr('cy', d => yScale(d.rating))
      .attr('r', 0)
      .attr('fill', d => colorScale(d.category))
      .attr('opacity', 0.7)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('opacity', 1)
          .attr('stroke', '#1a1a1a')
          .attr('stroke-width', 2);
        showTooltip(event, d);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('opacity', 0.7)
          .attr('stroke', 'none');
        hideTooltip();
      })
      .transition()
      .duration(800)
      .delay((d, i) => i * 2)
      .attr('r', 6);

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale)
        .ticks(5)
        .tickFormat(d => d.toLocaleString())
      )
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
      .attr('y', height + 45)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('fill', '#1a1a1a')
      .text('Number of Reviews (log scale)');

    // Add Y axis label
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -50)
      .attr('x', -height / 2)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('fill', '#1a1a1a')
      .text('Average Rating (Stars)');

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${width - 120}, 10)`);

    categories.slice(0, 6).forEach((category, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 20})`);

      legendRow.append('circle')
        .attr('r', 5)
        .attr('fill', colorScale(category))
        .attr('opacity', 0.7);

      legendRow.append('text')
        .attr('x', 12)
        .attr('y', 4)
        .style('font-size', '11px')
        .style('fill', '#1a1a1a')
        .text(category);
    });

  }, [businesses]);

  const showTooltip = (event, d) => {
    const tooltip = d3.select('body').append('div')
      .attr('class', 'scatter-tooltip')
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
      <strong>${d.name}</strong><br/>
      Category: ${d.category}<br/>
      Rating: ${d.rating.toFixed(1)} ⭐<br/>
      Reviews: ${d.reviewCount.toLocaleString()}<br/>
      Location: ${d.city}
    `)
    .style('left', (event.pageX + 10) + 'px')
    .style('top', (event.pageY - 10) + 'px');
  };

  const hideTooltip = () => {
    d3.selectAll('.scatter-tooltip').remove();
  };

  return (
    <div className="viz-card">
      <div className="card-header">
        <div className="header-left">
          <h2>🎯 Reviews vs Rating</h2>
          <p>Business performance correlation</p>
        </div>
      </div>
      <div className="card-body">
        <svg ref={svgRef} className="scatter-svg"></svg>
      </div>
    </div>
  );
}

export default ScatterPlot;