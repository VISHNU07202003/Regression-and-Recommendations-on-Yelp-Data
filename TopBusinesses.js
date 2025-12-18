import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './TopBusinesses.css';

function TopBusinesses({ businesses }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!businesses || businesses.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    // Get top 20 businesses by rating and review count
    const topBusinesses = [...businesses]
      .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount)
      .slice(0, 20);

    const margin = { top: 20, right: 30, bottom: 120, left: 200 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 600 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current)
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Create scales
    const yScale = d3.scaleBand()
      .domain(topBusinesses.map(d => d.name))
      .range([0, height])
      .padding(0.2);

    const xScale = d3.scaleLinear()
      .domain([0, 5])
      .range([0, width]);

    // Color scale based on rating
    const colorScale = d3.scaleSequential()
      .domain([3, 5])
      .interpolator(d3.interpolateReds);

    // Add grid
    svg.append('g')
      .attr('class', 'grid')
      .call(d3.axisBottom(xScale)
        .tickSize(height)
        .tickFormat('')
      )
      .style('stroke', '#e8e8e8')
      .style('stroke-dasharray', '3,3');

    // Add bars
    svg.selectAll('.bar')
      .data(topBusinesses)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', 0)
      .attr('y', d => yScale(d.name))
      .attr('width', 0)
      .attr('height', yScale.bandwidth())
      .attr('fill', d => colorScale(d.rating))
      .attr('rx', 4)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .attr('opacity', 0.8);
        showTooltip(event, d);
      })
      .on('mouseout', function() {
        d3.select(this)
          .attr('opacity', 1);
        hideTooltip();
      })
      .transition()
      .duration(1000)
      .delay((d, i) => i * 50)
      .attr('width', d => xScale(d.rating));

    // Add rating labels on bars
    svg.selectAll('.bar-label')
      .data(topBusinesses)
      .join('text')
      .attr('class', 'bar-label')
      .attr('x', d => xScale(d.rating) + 5)
      .attr('y', d => yScale(d.name) + yScale.bandwidth() / 2)
      .attr('dy', '.35em')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', '#1a1a1a')
      .style('opacity', 0)
      .text(d => `${d.rating.toFixed(1)} ⭐ (${d.reviewCount} reviews)`)
      .transition()
      .duration(1000)
      .delay((d, i) => i * 50 + 500)
      .style('opacity', 1);

    // Add Y axis
    svg.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#1a1a1a')
      .style('font-weight', '500');

    // Add X axis
    svg.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '12px')
      .style('fill', '#5a5a5a');

    // Add X axis label
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', height + 50)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('fill', '#1a1a1a')
      .text('Average Rating (Stars)');

  }, [businesses]);

  const showTooltip = (event, d) => {
    const tooltip = d3.select('body').append('div')
      .attr('class', 'business-tooltip')
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
      Location: ${d.city}, ${d.state}<br/>
      Rating: ${d.rating.toFixed(1)} ⭐<br/>
      Reviews: ${d.reviewCount.toLocaleString()}<br/>
      Price: ${d.priceRange || 'N/A'}
    `)
    .style('left', (event.pageX + 10) + 'px')
    .style('top', (event.pageY - 10) + 'px');
  };

  const hideTooltip = () => {
    d3.selectAll('.business-tooltip').remove();
  };

  return (
    <div className="viz-card" id="businesses">
      <div className="card-header">
        <div className="header-left">
          <h2>🏆 Top 20 Businesses</h2>
          <p>Highest rated by review volume</p>
        </div>
      </div>
      <div className="card-body">
        <svg ref={svgRef} className="top-businesses-svg"></svg>
      </div>
    </div>
  );
}

export default TopBusinesses;