import {legend} from './Legend.js'


// select elements section
const mapContainer = document.querySelector('#map_container');
const mapSection = document.getElementById('map_section');

// compute map e data
const world = await d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-50m.json')
const countries = await topojson.feature(world, world.objects.countries);
const countrymesh = await topojson.mesh(world,
                                        world.objects.countries,
                                        ((a, b) => a !== b));
const codes = await d3.csv('https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/slim-3/slim-3.csv')

const row = d => {
    d.year = +d['year_(n)'];
    d.score = +d['score'];
    return d;
};
const data = await d3.csv('./rsf_all.csv', row);

// data country selections 
const selectedYear = 2022;
const filteredData = data.filter(d => d.year === selectedYear);

const width = mapContainer.offsetWidth;
const height = mapContainer.offsetHeight;

// // compute width and height of svg map's container
// const getDim = () => {
//     const width = mapSection.offsetWidth;
//     console.log(width);
//     const height = mapSection.offsetHeight;
//     return {width: width, height: height};
// }

const missingDataColor = 'grey';

// construct a path generator
const projection = d3.geoNaturalEarth1();
const pathGenerator = d3.geoPath(projection.scale(1).translate([0, 0]));

const numericByIsoCode = new Map();
codes.forEach(code => {
    const alphaCode = code['alpha-3'];
    const numericCode = code['country-code'];
    numericByIsoCode.set(alphaCode, numericCode);                
});

const rowByNumericCode = new Map();
filteredData.forEach(d => {
    const isoCode = d['iso'];
    const numericCode = numericByIsoCode.get(isoCode);
    rowByNumericCode.set(numericCode, d);
})      
// functions
function zoomed(event) {
    const {transform} = event;
    countriesG.attr('transform', transform);
}
// scales
const colorValue = d => d.score;
const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
      .domain([100, 0])

const zoom = d3.zoom()
      .on("zoom", zoomed);

// test
// https://gist.github.com/mbostock/4707858
const single = countries.features.filter(d => d.id == '364')[0];
var b = pathGenerator.bounds(single),
    s = .95 / Math.max((b[1][0] - b[0][0]) / width, (b[1][1] - b[0][1]) / height),
    t = [(width - s * (b[1][0] + b[0][0])) / 2, (height - s * (b[1][1] + b[0][1])) / 2];

projection
    .scale(s)
    .translate(t);

// ===============


// map section

const svg = d3.select(mapContainer)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .call(zoom)

const countriesG = svg.append('g');
// countriesG
//     .attr('width', width)
//     .attr('height', height)
// // .attr('transform', 'translate(-331, -257) scale(2)')
//     .append('path')
//     .attr("d", pathGenerator({type: 'Sphere'}))
//     .attr('class', 'water');


console.log(single);
console.log(countries.features)
countriesG.selectAll('path')
    .data(countries.features)
    .enter()
    .append('path')
    .attr("d", pathGenerator)
    .attr('class', 'country')
    .attr('fill', '#fff')
    .attr('fill', function(d) {
        const row = rowByNumericCode.get(d.id);
        return row ? colorScale(colorValue(row)) : missingDataColor;
    })

mapContainer.appendChild(legend(
    colorScale, {width:300}
));
