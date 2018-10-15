import * as d3B from 'd3'
import * as d3Select from 'd3-selection'
import textures from 'textures'
import * as d3Swoopydrag from 'd3-swoopy-drag'
import * as d3Jetpack from 'd3-jetpack'

const d3 = Object.assign({}, d3B, d3Select, d3Swoopydrag, d3Jetpack);

const dataURL = "<%= path %>/assets/yearbycountry.json";

const svg = d3.select(".map-wrapper svg");

const defs = svg.append('defs')

let svgWidth = document.querySelector(".map-wrapper svg").clientWidth -10;
let svgHeight = document.querySelector(".map-wrapper svg").clientHeight -10;

let width = svgWidth
let height = svgHeight

let squares = 81;
let columns = 9;
let rows = 9;
let grid = makeGrid(squares,columns, rows, width, height);

var annotations =
[
  {
    "annWidth": 100,
    "annLength": 100,
    "path": "M374,467L374,380",
    "class": "arrow",
    "text": "Jobbik, Hungary's far right party, obtained in 2014 XX% of share vote",
    "textOffset": [
      268,
      486
    ]
  },
  {
    "annWidth": 400,
    "annLenght": 400,
    "path": "M 301,121 A 71.201 71.201 0 0 0 365,80",
    "class": "arrow",
    "text": "interactive",
    "textOffset": [
      -114,
      -54
    ]
  }
]

let europe28 =[];
europe28[49]="Austria";
europe28[47]="Belgium";
europe28[61]="Bulgaria";
europe28[57]="Switzerland";
europe28[80]="Cyprus";
europe28[50]="Czech Republic";
europe28[40]="Germany";
europe28[31]="Denmark";
europe28[65]="Spain";
europe28[15]="Estonia";
europe28[6]="Finland";
europe28[56]="France";
europe28[29]="United Kingdom";
europe28[70]="Greece";
europe28[68]="Croatia";
europe28[60]="Hungary";
europe28[27]="Ireland";
europe28[9]="Iceland";
europe28[58]="Italy";
europe28[33]="Lithuania";
europe28[48]="Luxembourg";
europe28[24]="Latvia";
europe28[76]="Malta";
europe28[39]="Netherlands";
europe28[4]="Norway";
europe28[41]="Poland";
europe28[64]="Portugal";
europe28[52]="Romania";
europe28[51]="Slovakia";
europe28[59]="Slovenia";
europe28[5]="Sweden";


let names = [{name:"Austria", iso3:"AUS"},
{name:"Belgium", iso3:"BEL"},
{name:"Bulgaria", iso3:"BUL"},
{name:"Switzerland", iso3:"SWI"},
{name:"Cyprus", iso3:"CYP"},
{name:"Czech Republic", iso3:"CZE"},
{name:"Germany", iso3:"GER"},
{name:"Denmark", iso3:"DEN"},
{name:"Spain", iso3:"SPA"},
{name:"Estonia", iso3:"EST"},
{name:"Finland", iso3:"FIN"},
{name:"France", iso3:"FRA"},
{name:"United Kingdom", iso3:" UK"},
{name:"Greece", iso3:"GRE"},
{name:"Croatia", iso3:"CRO"},
{name:"Hungary", iso3:"HUN"},
{name:"Ireland", iso3:"IRE"},
{name:"Iceland", iso3:"ICE"},
{name:"Italy", iso3:"ITA"},
{name:"Lithuania", iso3:"LIT"},
{name:"Luxembourg", iso3:"LUX"},
{name:"Latvia", iso3:"LAT"},
{name:"Malta", iso3:"MAL"},
{name:"Netherlands", iso3:"NET"},
{name:"Norway", iso3:"NOR"},
{name:"Poland", iso3:"POL"},
{name:"Portugal", iso3:"POR"},
{name:"Romania", iso3:"ROM"},
{name:"Slovakia", iso3:"SVK"},
{name:"Slovenia", iso3:"SVN"},
{name:"Sweden", iso3:"SWE"}]

let classNames = [];

let populists = ['rightshare', 'leftshare', 'othershare'];

let europeCartogram = svg.selectAll('rect')
.data(grid)
.enter()
.filter((d,i) => {if(europe28[i] != undefined){classNames.push(europe28[i].split(" ").join("-"))}; return europe28[i] != undefined})
.append("g")
.attr("class", (d,i) => {return classNames[i]});

europeCartogram
.append("rect")
.attr("class", (d,i) => {let country = names.find(n => n.name.split(" ").join("-") == classNames[i]); return country.border})
.attr("transform" , (d) => {return "translate(" + d.x + "," + d.y + ")"} )
.attr("width" , width  / columns)
.attr("height" , width  / columns)


europeCartogram
.append('text')
.attr("transform" , (d) => {return "translate(" + (d.x + 5) + "," + d.y + ")"} )
.attr('text-anchor', 'start')
.attr('dy', '1.5em')
.attr('dx', '.2em')
.text( (d,i) => { let country = names.find(n => n.name.split(" ").join("-") == classNames[i]);  return country.iso3})


function makeGrid(squares, columns, rows, width, height)
{
  let positions = [];
  let heightAccum = 0,
  widthAccum = 0,
  count = 0,
  squareWidth = parseInt(width / columns),
  squareheight = parseInt(height / rows);

  for (let i = 0; i < squares; i++) {
    positions.push({x:widthAccum , y:heightAccum, center:[widthAccum + (width  / columns) / 2, heightAccum + (width / columns) / 2], width:squareWidth, height:squareheight});

    widthAccum += squareWidth + 2;

    count++
    
    if(count % columns == 0)
    {
      heightAccum += squareWidth + 2;
      widthAccum = 0;
      count = 0;
    }
  }

  return positions;
}

Promise.all([
  d3.json(dataURL)
  ])
.then(ready)


function ready(data){
	

	let nodes = data[0];



	nodes.forEach((n) => {

		let group = d3.select("." + n.country.split(" ").join("-"));
		let rect = group.select("rect");
		let marginX = parseInt(rect.attr("transform").split("translate(")[1].split(",")[0]);
		let marginY = parseInt(rect.attr("transform").split("translate(")[1].split(",")[1].split(")")[0]);

    let countryData = [];

    n.years.forEach(y => {

     let rs = (isNaN(y.totalPopulist)) ? rs = y.totalPopulist.share.rightshare : rs = 0;
     let ls = (isNaN(y.totalPopulist)) ? ls = y.totalPopulist.share.leftshare : ls = 0;
     let os = (isNaN(y.totalPopulist)) ? os = y.totalPopulist.share.othershare : os = 0;

     countryData.push({date:new Date(y.year), rightshare:rs, leftshare:ls, othershare:os})
   })

    let rectWidth = parseInt(rect.attr("width"))
    let rectHeight = parseInt(rect.attr("height"))

    let x = d3.scaleTime()
    .range([0,rectWidth]).domain([1992,2018]);

    let y = d3.scaleLinear()
    .range([rectHeight, 0]).domain([0,100]);

    let area = d3.area()
    .curve(d3.curveStep)
    .x(function(d) { return x(d.data.date)})
    .y0(function(d) { return y(d[0]); })
    .y1(function(d) { return y(d[1]); })
    .defined( d => {return d[1] > 0 })

    
    let stack = d3.stack()
    .keys(populists)
    .offset(d3.stackOffsetNone);

    let wingPattern

    populists.forEach(d => {

      wingPattern = defs
      .append('pattern')
      .attr('id', 'wing-hatch--' + d)
      .attr('class', 'wing-hatch')
      .attr('patternUnits', 'userSpaceOnUse')
      .attr('width', 4)
      .attr('height', 4)

      .append('path')
      .attr('d', 'M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2')
      .attr('class', 'wing-hatch-stroke')
    })


    let wings = group.selectAll(".wing")
    .data(stack(countryData))
    .enter()
    .append('g')
    .attr('class', "wing")


    wings
    .append("path")
    .attr("d", area)
    .attr('class', function(d) { return "area " + d.key; })
    .attr("transform", "translate("+ marginX + "," + marginY + ")")
    .style('fill', d => {return `url('#wing-hatch--${d.key}')`});

    
  })

  var swoopy = d3.swoopyDrag()
  .x(d => d.annWidth)
  .y(d => d.annLength)
  .draggable(false)
  .annotations(annotations)
  .on("drag", d => window.annotations = annotations)

  var swoopySel = svg.append('g').attr("class", "annotations-text").call(swoopy)

  

  

  swoopySel.selectAll('text')
  //.filter(function(t){return t.class == 'annotation' || t.class == 'arrow'})
  .each(function(d){
    d3.select(this)
      .text('')                        //clear existing text
      .tspans(d3.wordwrap(d.text, 20), 25) //wrap after 20 char
  })

  var markerDefs = svg.append('svg:defs')
    .attr('id', "markerDefs");

  markerDefs.append('marker')
    .attr('id', 'arrow')
    .attr('viewBox', '-10 -10 20 20')
    .attr('markerWidth', 20)
    .attr('markerHeight', 20)
    .attr('orient', 'auto')
  .append('path')
    .attr('d', 'M-6.75,-6.75 L 0,0 L -6.75,6.75')

  swoopySel.selectAll('path')
    .filter(function(t){return t.class == 'arrow'})
    .attr('marker-end', 'url(#arrow)');

  swoopySel.selectAll('path').attr('stroke','white')
  swoopySel.selectAll('path').attr('fill','none')
}

