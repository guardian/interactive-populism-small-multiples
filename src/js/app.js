import * as d3B from 'd3'
import * as d3Select from 'd3-selection'
import textures from 'textures'
import * as d3Swoopydrag from 'd3-swoopy-drag'
import * as d3Jetpack from 'd3-jetpack'
import { desktop, mobile } from '../assets/annotations.js'
import { makeGrid } from '../assets/Grid.js'
import { makeStacked } from '../assets/Stacked.js'
import { makeLines } from '../assets/Lines.js?1234'

const d3 = Object.assign({}, d3B, d3Select, d3Swoopydrag, d3Jetpack);

const dataURL = "<%= path %>/assets/yearbycountry.json";

const isMobile = window.matchMedia('(max-width: 620px)').matches;

const svgCartogram = d3.select(".cartogram-wrapper svg");

let cartogramPadding = 10;
let cartogramWidth = 620 - cartogramPadding;
let cartogramHeight = 700 - cartogramPadding;
svgCartogram.attr("width" , 620)
svgCartogram.attr("height" , 700)

let linesWidth = 120 - cartogramPadding;
let linesHeight = 120 - cartogramPadding;

if(isMobile){
  cartogramWidth = window.innerWidth - 20;
  cartogramHeight = ( window.innerWidth * 850 / 620 );
  svgCartogram.attr("width" , window.innerWidth)
  svgCartogram.attr("height" , window.innerWidth * 850 / 620)

  linesWidth = (window.innerWidth / 2) - 20;
  linesHeight = 120 - cartogramPadding;
}

console.log(linesWidth)

const chartsWrapper = d3.select(".charts-wrapper");

const defs = svgCartogram.append('defs')

let populists = ['rightshare', 'leftshare', 'othershare'];



//CARTOGRAM======================================

let columns = 0;
let rows = 0;
let europe31 =[];
let classNames = [];
let names = [{name:"Austria", iso3:"AUS"},{name:"Belgium", iso3:"BEL"},{name:"Bulgaria", iso3:"BUL"},{name:"Switzerland", iso3:"SWI"},{name:"Cyprus", iso3:"CYP"},{name:"Czech Republic", iso3:"CZE"},{name:"Germany", iso3:"GER"},{name:"Denmark", iso3:"DEN"},{name:"Spain", iso3:"SPA"},{name:"Estonia", iso3:"EST"},{name:"Finland", iso3:"FIN"},{name:"France", iso3:"FRA"},{name:"United Kingdom", iso3:" UK"},{name:"Greece", iso3:"GRE"},{name:"Croatia", iso3:"CRO"},{name:"Hungary", iso3:"HUN"},{name:"Ireland", iso3:"IRE"},{name:"Iceland", iso3:"ICE"},{name:"Italy", iso3:"ITA"},{name:"Lithuania", iso3:"LIT"},{name:"Luxembourg", iso3:"LUX"},{name:"Latvia", iso3:"LAT"},{name:"Malta", iso3:"MAL"},{name:"Netherlands", iso3:"NET"},{name:"Norway", iso3:"NOR"},{name:"Poland", iso3:"POL"},{name:"Portugal", iso3:"POR"},{name:"Romania", iso3:"ROM"},{name:"Slovakia", iso3:"SVK"},{name:"Slovenia", iso3:"SVN"},{name:"Sweden", iso3:"SWE"}]

if(!isMobile)
{
  columns = 8;
  rows = 9;

  europe31[0]="Iceland";  europe31[3]="Norway";  europe31[4]="Sweden";  europe31[5]="Finland";  europe31[13]="Estonia";  europe31[16]="Ireland";  europe31[17]="United Kingdom";  europe31[19]="Denmark";  europe31[21]="Latvia";  europe31[26]="Netherlands";  europe31[27]="Germany";  europe31[28]="Poland";  europe31[29]="Lithuania";  europe31[33]="Belgium";  europe31[34]="Luxembourg";  europe31[35]="Austria";  europe31[36]="Czech Republic";  europe31[37]="Slovakia";  europe31[41]="France";  europe31[42]="Switzerland";  europe31[43]="Slovenia";  europe31[44]="Croatia";  europe31[45]="Hungary";  europe31[46]="Romania";  europe31[48]="Portugal";  europe31[49]="Spain";  europe31[51]="Italy";  europe31[54]="Bulgaria";  europe31[62]="Greece";  europe31[67]="Malta";  europe31[71]="Cyprus";
}
else
{
  columns = 6;
  rows = 9;

  europe31[0]="Iceland";  europe31[2]="Norway";  europe31[3]="Sweden";  europe31[4]="Finland";  europe31[10]="Estonia";  europe31[12]="Ireland";  europe31[13]="United Kingdom";  europe31[15]="Denmark";  europe31[16]="Latvia";  europe31[20]="Netherlands";  europe31[21]="Germany";  europe31[22]="Poland";  europe31[23]="Lithuania";  europe31[25]="Belgium";  europe31[26]="Luxembourg";  europe31[27]="Austria";  europe31[28]="Czech Republic";  europe31[29]="Slovakia";  europe31[30]="France";  europe31[31]="Switzerland";  europe31[32]="Slovenia";  europe31[33]="Croatia";  europe31[34]="Hungary";  europe31[35]="Romania";  europe31[36]="Portugal";  europe31[37]="Spain";  europe31[38]="Italy";  europe31[39]="Bulgaria";  europe31[40]="Greece";  europe31[44]="Malta";  europe31[47]="Cyprus";
}

let grid = makeGrid(columns, rows,cartogramWidth, cartogramHeight);

let europeCartogram = svgCartogram.selectAll('rect')
.data(grid)
.enter()
.filter((d,i) => {if(europe31[i] != undefined){classNames.push(europe31[i].split(" ").join("-"))}; return europe31[i] != undefined})
.append("g")
.attr("class", (d,i) => {return classNames[i]});

europeCartogram
.append("rect")
.attr("class", (d,i) => {let country = names.find(n => n.name.split(" ").join("-") == classNames[i]); return country.border})
.attr("transform" , (d) => {return "translate(" + d.x + "," + d.y + ")"} )
.attr("width" ,cartogramWidth  / columns)
.attr("height" ,cartogramWidth  / columns)

europeCartogram
.append('text')
.attr("transform" , (d) => {return "translate(" + (d.x + 5) + "," + d.y + ")"} )
.attr('text-anchor', 'start')
.attr('dy', '1.5em')
.attr('dx', '.2em')
.text( (d,i) => { let country = names.find(n => n.name.split(" ").join("-") == classNames[i]);  return country.iso3})


//END CARTOGRAM=====================================

Promise.all([
  d3.json(dataURL)
  ])
.then(ready)

function ready(elections){
	
	let nodes = elections[0];

	nodes.forEach((n) => {

    let countryName = n.country;
    if(countryName == "United Kingdom")countryName = "UK";

    let group = d3.select("." + n.country.split(" ").join("-"));
    let rect = group.select("rect");
    let rectWidth = parseInt(rect.attr("width"));
    let rectHeight = parseInt(rect.attr("height"));
    let marginX = parseInt(rect.attr("transform").split("translate(")[1].split(",")[0]);
    let marginY = parseInt(rect.attr("transform").split("translate(")[1].split(",")[1].split(")")[0]);

    let countryDataArea = [];
    
    n.years.forEach(y => {

     let rs = (isNaN(y.totalPopulist)) ? rs = y.totalPopulist.share.rightshare : rs = 0;
     let ls = (isNaN(y.totalPopulist)) ? ls = y.totalPopulist.share.leftshare : ls = 0;
     let os = (isNaN(y.totalPopulist)) ? os = y.totalPopulist.share.othershare : os = 0;

     countryDataArea.push({date:new Date(y.year), rightshare:rs, leftshare:ls, othershare:os});

   })

    makeStacked(rectWidth, rectWidth, [1992,2018], [0,100], countryDataArea, group, populists, defs, marginX, marginY);


    if(n.country != "Malta" && n.country != "Portugal")
    {
      let countryChart = chartsWrapper.append('div').attr("class", "chart-wrapper " + n.country);
      countryChart.append('h3').html(countryName);
      let countryDataLine = [];

      countryDataLine.push({ id:n.country, values: n.years.map(d=>{
      let year = d.year;
      let leftShare=0;
      let rightShare=0;
      let otherShare=0;
      let accum=0;
      

      if(d.totalPopulist == 0){leftShare = null; rightShare = null; otherShare=null}
      else {
        let ls = (d.totalPopulist.share.leftshare == 0) ? leftShare = null : leftShare = d.totalPopulist.share.leftshare;
        let rs = (d.totalPopulist.share.rightshare == 0) ? rightShare = null : rightShare = d.totalPopulist.share.rightshare;
        let os = (d.totalPopulist.share.othershare == 0) ? otherShare = null : otherShare = d.totalPopulist.share.othershare;
        leftShare = ls;
        rightShare = rs;
        otherShare = os;
        accum = ls + rs+ os;
      }

      return {year:year, leftshare:leftShare, rightshare:rightShare, othershare:otherShare, accum:accum}
      })})

      makeLines(countryDataLine, linesWidth, linesHeight, countryChart, [1992,2018], [0,100])
      
    }
})

/*let swoopy = d3.swoopyDrag()
.x(d => d.annWidth)
.y(d => d.annLength)
.draggable(true)
.annotations(desktop)
.on("drag", d => window.annotations = desktop)

let swoopySel = svgCartogram.append('g').attr("class", "annotations-text").call(swoopy)

swoopySel.selectAll('text')
.attr("class", d => d.class)
.each(function(d){
  d3.select(this)
      .text('')                        //clear existing text
      .tspans(d3.wordwrap(d.text, 20), 18) //wrap after 20 char
    })

let markerDefs = svgCartogram.append('svg:defs')
.attr('id', "markerDefs");

markerDefs.append('marker')
.attr('id', 'arrow')
.attr('viewBox', '-10 -10 20 20')
.attr('markerWidth', 20)
.attr('markerHeight', 20)
.attr('orient', 'auto')
.append('path')
.attr('d', 'M-5,-4 L 0,0 L -5,4')

swoopySel.selectAll('path')
.filter(function(t){return t.class == 'arrow'})
.attr('marker-end', 'url(#arrow)');

swoopySel.selectAll('path').attr('stroke','white')

swoopySel.selectAll('path')
.filter(function(t){return t.class != 'arrow'})
.attr('stroke','grey')

swoopySel.selectAll('path').attr('fill','none')*/
}
