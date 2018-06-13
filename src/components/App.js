import React, { Component } from 'react';
import * as d3 from 'd3';

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      dataset: [],
    }
  }

  componentDidMount() {
    const URL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
    fetch(URL)
      .then(response => response.json())
      .then(gdpObject => {
        this.formatData(gdpObject.data);
      })
  }

  formatData(data) {
    var formattedData = data.map((point) => {
      var quarter;
      var month = point[0].substring(5, 7);
      var gdp = point[1];

      switch(month) {
        case "01":
          quarter = "Q1"
          break;
        case "04":
          quarter = "Q2"
          break;
        case "07":
          quarter = "Q3"
          break;
        case "10":
          quarter = "Q4"
          break;
      }
      return point[0].substring(0, 4) + ' ' + quarter + ' ' + gdp;
    })
    this.setState({
      dataset: formattedData,
    });
  }

  render() {
    const svgWidth = 1000;
    const svgHeight = 475;
    const numBars = 275;
    const margin = {top: 24, right: 24, bottom: 24, left: 24};
    const yearsOnly = this.state.dataset.map((point) => {
      return point.substring(0, 4);
    });
    const yearGDPValue = this.state.dataset.map((point) => {
      return [point.substring(0, 4), point.substring(5,8), point.substring(8)];
    });

    var bar = d3.select('svg')
                .attr('width', svgWidth)
                .attr('height', svgHeight)

                bar.selectAll('rect')
                .data(yearGDPValue)
                .enter()
                .append('rect')
                .style('fill', '#74b9ff')
                .attr('x', (d, i) => i * svgWidth/numBars)
                .attr('y', (d, i) => svgHeight - d[2]/40)
                .attr('width', svgWidth/numBars)
                .attr('height', (d, i) => d[2]/40)
                .on('mouseover', function(d, i) {
                  var info = document.getElementById('infoBox');
                  var yearElement = document.getElementById('yearQuarter');
                  var gdpElement = document.getElementById('gdpValue');
                  info.classList.remove('hide');
                  yearElement.innerHTML = (`${d[0] + ' ' + d[1]}`);
                  gdpElement.innerHTML = (`${d[2]}` + ' Billion');
                  this.style.fill = '#ffffff';
                })
                .on('mouseleave', function(d, i) {
                  var info = document.getElementById('infoBox');
                  info.classList.add('hide');
                  var yearElement = document.getElementById('yearQuarter');
                  var gdpElement = document.getElementById('gdpValue');
                  yearElement.innerHTML = '';
                  gdpElement.innerHTML = '';
                  this.style.fill = '#74b9ff';
                })

    //Define X-Axis
    const xScale = d3.scaleLinear()
      .domain([d3.min(yearsOnly), d3.max(yearsOnly)])
      .range([0, svgWidth])

    const xAxis = d3.axisBottom(xScale)
                    .tickFormat(d3.format('d'))

    bar.append('g')
      .attr('transform', 'translate(0,' + svgHeight + ')')
      .call(xAxis)

    // Define and position x-axis Label
    bar.append('text')
      .attr('transform', 'translate(' + (svgWidth/2) + ' , ' + (svgHeight + margin.top + 20) + ')')
      .attr('text-anchor', 'middle')
      .text('Year')

    //Define Y-axis
    const yScale = d3.scaleLinear()
      .domain([d3.max(yearGDPValue, (d) => Number(d[2])), 0])
      .range([0, svgHeight])

    const yAxis = d3.axisLeft(yScale);
    bar.append('g')
      .call(yAxis)

    // Define and position y-axis label
    bar.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', 0 - (svgHeight / 2))
      .attr('y', '-48px')
      .text('GDP')

    return (
      <div className='container'>
        <h1>Modeling US GDP Economic Data</h1>
        <div id="graph">
          <div id='infoBox' className='infoBox hide'>
            <p id='yearQuarter'></p>
            <p id='gdpValue'></p>
          </div>
          <svg>
          </svg>
        </div>
      </div>
    );
  }
}

export default App;
