import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './GeographicMap.css';

function GeographicMap({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create projection (simple coordinate system for demo)
    const xScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.lng))
      .range([50, width - 50]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(data, d => d.lat))
      .range([height - 50, 50]);

    // Size scale based on review count
    const sizeScale = d3.scaleSqrt()
      .domain([0, d3.max(data, d => d.reviews)])
      .range([10, 50]);

    // Color scale based on avg rating
    const colorScale = d3.scaleSequential()
      .domain([3, 5])
      .interpolator(d3.interpolateReds);

    // Add background map outline (simplified)
    svg.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#f7f7f7')
      .attr('stroke', '#d4d4d4')
      .attr('rx', 8);

    // Add city circles
    svg.selectAll('.city-circle')
      .data(data)
      .join('circle')
      .attr('class', 'city-circle')
      .attr('cx', d => xScale(d.lng))
      .attr('cy', d => yScale(d.lat))
      .attr('r', 0)
      .attr('fill', d => colorScale(d.avgRating))
      .attr('opacity', 0.7)
      .attr('stroke', 'white')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('opacity', 1)
          .attr('stroke', '#d32323')
          .attr('stroke-width', 3);
        showTooltip(event, d);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('opacity', 0.7)
          .attr('stroke', 'white')
          .attr('stroke-width', 2);
        hideTooltip();
      })
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .attr('r', d => sizeScale(d.reviews));

    // Add city labels
    svg.selectAll('.city-label')
      .data(data)
      .join('text')
      .attr('class', 'city-label')
      .attr('x', d => xScale(d.lng))
      .attr('y', d => yScale(d.lat) - sizeScale(d.reviews) - 8)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', '#1a1a1a')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .text(d => d.city)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100 + 500)
      .style('opacity', 1);

    // Add legend
    const legendData = [
      { size: 'Small', value: d3.min(data, d => d.reviews) },
      { size: 'Medium', value: d3.median(data, d => d.reviews) },
      { size: 'Large', value: d3.max(data, d => d.reviews) }
    ];

    const legend = svg.append('g')
      .attr('transform', `translate(20, ${height - 120})`);

    legend.append('text')
      .attr('x', 0)
      .attr('y', -10)
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', '#1a1a1a')
      .text('Review Volume');

    legendData.forEach((item, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 30})`);

      legendRow.append('circle')
        .attr('r', sizeScale(item.value))
        .attr('fill', colorScale(3.8))
        .attr('opacity', 0.7)
        .attr('stroke', 'white')
        .attr('stroke-width', 2);

      legendRow.append('text')
        .attr('x', 40)
        .attr('y', 5)
        .style('font-size', '11px')
        .style('fill', '#5a5a5a')
        .text(`${item.size} (${Math.round(item.value).toLocaleString()})`);
    });

  }, [data]);

  const showTooltip = (event, d) => {
    const tooltip = d3.select('body').append('div')
      .attr('class', 'geo-tooltip')
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
      <strong>${d.city}, ${d.state}</strong><br/>
      Businesses: ${d.businesses.toLocaleString()}<br/>
      Reviews: ${d.reviews.toLocaleString()}<br/>
      Avg Rating: ${d.avgRating.toFixed(1)} ⭐
    `)
    .style('left', (event.pageX + 10) + 'px')
    .style('top', (event.pageY - 10) + 'px');
  };

  const hideTooltip = () => {
    d3.selectAll('.geo-tooltip').remove();
  };

  return (
    <div className="viz-card" id="users">
      <div className="card-header">
        <div className="header-left">
          <h2>🗺️ Geographic Distribution</h2>
          <p>User activity by city</p>
        </div>
      </div>
      <div className="card-body">
        <svg ref={svgRef} className="geo-svg"></svg>
      </div>
    </div>
  );
}

export default GeographicMap;