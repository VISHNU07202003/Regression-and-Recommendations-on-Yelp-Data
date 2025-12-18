import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import './CategoryChart.css';

function CategoryChart({ data }) {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll('*').remove();

    const width = svgRef.current.clientWidth;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 40;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Color scale
    const colorScale = d3.scaleOrdinal()
      .domain(data.map(d => d.category))
      .range(['#d32323', '#ff9500', '#0073bb', '#00a699', '#9b59b6', '#e74c3c']);

    // Pie layout
    const pie = d3.pie()
      .value(d => d.count)
      .sort(null);

    const arc = d3.arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius);

    const arcHover = d3.arc()
      .innerRadius(radius * 0.5)
      .outerRadius(radius * 1.08);

    // Draw slices
    const slices = svg.selectAll('.slice')
      .data(pie(data))
      .join('g')
      .attr('class', 'slice');

    slices.append('path')
      .attr('d', arc)
      .attr('fill', d => colorScale(d.data.category))
      .attr('stroke', 'white')
      .attr('stroke-width', 3)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arcHover);
        showTooltip(event, d.data);
      })
      .on('mouseout', function() {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arc);
        hideTooltip();
      })
      .transition()
      .duration(1000)
      .attrTween('d', function(d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return function(t) {
          return arc(i(t));
        };
      });

    // Add percentage labels
    slices.append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('fill', 'white')
      .style('pointer-events', 'none')
      .style('text-shadow', '0 1px 3px rgba(0,0,0,0.5)')
      .style('opacity', 0)
      .text(d => `${d.data.percentage.toFixed(1)}%`)
      .transition()
      .delay(1000)
      .duration(500)
      .style('opacity', 1);

    // Add center text
    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '-0.5em')
      .style('font-size', '16px')
      .style('font-weight', '600')
      .style('fill', '#1a1a1a')
      .text('Total Businesses');

    svg.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '1.2em')
      .style('font-size', '24px')
      .style('font-weight', '700')
      .style('fill', '#d32323')
      .text(d3.sum(data, d => d.count).toLocaleString());

    // Add legend
    const legend = svg.append('g')
      .attr('transform', `translate(${radius + 30}, ${-radius})`);

    data.forEach((item, i) => {
      const legendRow = legend.append('g')
        .attr('transform', `translate(0, ${i * 25})`);

      legendRow.append('rect')
        .attr('width', 18)
        .attr('height', 18)
        .attr('fill', colorScale(item.category))
        .attr('rx', 3);

      legendRow.append('text')
        .attr('x', 25)
        .attr('y', 13)
        .style('font-size', '12px')
        .style('fill', '#1a1a1a')
        .text(`${item.category} (${item.percentage.toFixed(1)}%)`);
    });

  }, [data]);

  const showTooltip = (event, d) => {
    const tooltip = d3.select('body').append('div')
      .attr('class', 'category-tooltip')
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
      Businesses: ${d.count.toLocaleString()}<br/>
      Percentage: ${d.percentage.toFixed(1)}%<br/>
      Avg Rating: ${d.avgRating.toFixed(1)} ⭐<br/>
      Total Reviews: ${d.reviews.toLocaleString()}
    `)
    .style('left', (event.pageX + 10) + 'px')
    .style('top', (event.pageY - 10) + 'px');
  };

  const hideTooltip = () => {
    d3.selectAll('.category-tooltip').remove();
  };

  return (
    <div className="viz-card">
      <div className="card-header">
        <div className="header-left">
          <h2>🥧 Business Categories</h2>
          <p>Distribution by category</p>
        </div>
      </div>
      <div className="card-body">
        <svg ref={svgRef} className="category-svg"></svg>
      </div>
    </div>
  );
}

export default CategoryChart;