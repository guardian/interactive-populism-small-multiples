import * as d3B from 'd3'
import * as d3Select from 'd3-selection'
import * as d3Swoopydrag from 'd3-swoopy-drag'
import * as d3Jetpack from 'd3-jetpack'
import { makeStacked } from '../assets/Stacked.js'

const d3 = Object.assign({}, d3B, d3Select, d3Swoopydrag, d3Jetpack);

const yearByCountry = "<%= path %>/assets/yearbycountry.json";

let isMobile = window.matchMedia('(max-width: 359px)').matches;

let svgWidth
let w = 160;

let svgHeight = 160;
let padding = 15;

if(isMobile)
{
  svgWidth = window.innerWidth - padding;
}
else
{
  svgWidth = w;
}

let areaGroupAnnotations;

const countryGroups = [
{country:"Austria", group:"alps"},
{country:"Belgium", group:"heart"},
{country:"Bulgaria", group:""},
{country:"Switzerland", group:"alps"},
{country:"Cyprus", group:""},
{country:"Czech Republic", group:"visegrad"},
{country:"Germany", group:"heart"},
{country:"Denmark", group:"scandinavia"},
{country:"Spain", group:"south"},
{country:"Estonia", group:""},
{country:"Finland", group:"scandinavia"},
{country:"France", group:"heart"},
{country:"United Kingdom", group:""},
{country:"Greece", group:"south"},
{country:"Croatia", group:""},
{country:"Hungary", group:"visegrad"},
{country:"Ireland", group:""},
{country:"Iceland", group:""},
{country:"Italy", group:"south"},
{country:"Lithuania", group:""},
{country:"Luxembourg", group:""},
{country:"Latvia", group:""},
{country:"Malta", group:""},
{country:"Netherlands", group:"heart"},
{country:"Norway", group:"scandinavia"},
{country:"Poland", group:"visegrad"},
{country:"Portugal", group:"south"},
{country:"Romania", group:""},
{country:"Slovakia", group:""},
{country:"Slovenia", group:""},
{country:"Sweden", group:"scandinavia"}
]

let countriesData = [];


Promise.all([
  d3.json(yearByCountry)
  ])
.then(ready)

function ready(elections){
	
	let countries = elections[0];

  countries.forEach((n) => {

    let countryGroup = countryGroups.find(c => c.country == n.country);

    if(countryGroup.group != "")
    {
      let countriesWrapper = d3.select(".countries-wrapper." + countryGroup.group)

      let countryName = n.country;

      let areaDiv = countriesWrapper.append('div').attr("class", "chart-wrapper " + countryName.replace(' ', "-"));
      areaDiv.append('h3').html(countryName)
      let areaGroup = areaDiv.append('svg').attr("width", svgWidth + padding).attr("height", svgHeight + padding);

      let countryDataArea = [];

      n.years.forEach(y => {

        if(y.year >= 1998)
        {
          let date = new Date(y.year, 0, 1);
          if(y.year == 2018)
          {
            date = new Date(y.year, 11, 30);
          }
          //console.log(date)
          let rs = (isNaN(y.totalPopulist)) ? rs = y.totalPopulist.share.rightshare : rs = 0;
          let ls = (isNaN(y.totalPopulist)) ? ls = y.totalPopulist.share.leftshare : ls = 0;
          let os = (isNaN(y.totalPopulist)) ? os = y.totalPopulist.share.othershare : os = 0;
          countryDataArea.push({date:date, rightshare:rs, leftshare:ls, othershare:os, cabinet:y.cabinet, country:countryName});
        }
     })

      countriesData[countryName] = countryDataArea

      let areaGroupShade = areaGroup.append('g').attr("class", "area-group-shade");
      let areaGroupFill = areaGroup.append('g').attr("class", "area-group-fill");
      let areaGroupLines = areaGroup.append('g').attr("class", "area-group-lines");
      let areaGroupStroke = areaGroup.append('g').attr("class", "area-group-stroke");


      makeStacked(svgWidth - padding, svgHeight, [new Date(1997, 10, 1), new Date(2018, 11, 30)], [0,80], countryDataArea, areaGroupShade);
      makeStacked(svgWidth - padding, svgHeight, [new Date(1997, 10, 1), new Date(2018, 11, 30)], [0,80], countryDataArea, areaGroupFill);
      makeStacked(svgWidth - padding, svgHeight, [new Date(1997, 10, 1), new Date(2018, 11, 30)], [0,80], countryDataArea, areaGroupLines)
      makeStacked(svgWidth - padding, svgHeight, [new Date(1997, 10, 1), new Date(2018, 11, 30)], [0,80], countryDataArea, areaGroupStroke)


      if(countryName == "Austria")
      {

        let annX;

        areaGroupAnnotations = areaGroup.append('g').attr("class", "area-group-annotation");

        areaGroupAnnotations
        .append("path")
        .attr("d","M25.5,0.5c-14,0-25,11-25,25")
        .attr("class", "line")
        .style("transform", "translate(13px, 4px)");

        areaGroupAnnotations
        .append("path")
        .attr("class", "arrow")
        .attr("d","M0,0 3,6.4 7,0.6")
        .style("transform", "translate(10px, 28px)");


        areaGroupAnnotations
        .append("text")
        .attr("class", "text")
        .attr("transform", "translate(40,10)")
        .attr("width", "50px")
        .html("Populists");

        areaGroupAnnotations
        .append("text")
        .attr("class", "text")
        .attr("transform", "translate(40,25)")
        .attr("width", "50px")
        .html("reach");

        areaGroupAnnotations
        .append("text")
        .attr("class", "text")
        .attr("transform", "translate(40,40)")
        .attr("width", "50px")
        .html("gabinet");

        if(isMobile)
        {
          annX = d3.select(".chart-wrapper.Austria .y2005").attr("x");

        }
        else
        {
          annX = d3.select(".chart-wrapper.Austria .y2003").attr("x");

        }

        areaGroupAnnotations.style("transform", "translate("+annX+"px, 4px)");

      }
      
    }

  })

  window.addEventListener("resize", resize, false);
}

function resize()
{

  let annX;

  isMobile = window.matchMedia('(max-width: 359px)').matches;

  d3.map(countryGroups, g => {
    if(countriesData[g.country])
    {
      let country = g.country.replace(' ', "-");

      if(isMobile)
      {

        svgWidth = window.innerWidth - padding;

        d3.select(".chart-wrapper." + country + " svg").attr("width", svgWidth + padding)

        makeStacked(svgWidth - padding, svgHeight, [new Date(1997, 10, 1), new Date(2018, 11, 30)], [0,80], countriesData[g.country], d3.select(".chart-wrapper." + country + " svg .area-group-shade"));
        makeStacked(svgWidth - padding, svgHeight, [new Date(1997, 10, 1), new Date(2018, 11, 30)], [0,80], countriesData[g.country], d3.select(".chart-wrapper." + country + " svg .area-group-fill"));
        makeStacked(svgWidth - padding, svgHeight, [new Date(1997, 10, 1), new Date(2018, 11, 30)], [0,80], countriesData[g.country], d3.select(".chart-wrapper." + country + " svg .area-group-lines"))
        makeStacked(svgWidth - padding, svgHeight, [new Date(1997, 10, 1), new Date(2018, 11, 30)], [0,80], countriesData[g.country], d3.select(".chart-wrapper." + country + " svg .area-group-stroke"))

        annX = d3.select(".chart-wrapper.Austria .y2005").attr("x");

      }
      else
      {
        svgWidth = w;

        d3.select(".chart-wrapper." + country + " svg").attr("width", svgWidth + padding)

        makeStacked(svgWidth - padding, svgHeight, [new Date(1997, 10, 1), new Date(2018, 11, 30)], [0,80], countriesData[g.country], d3.select(".chart-wrapper." + country + " svg .area-group-shade"));
        makeStacked(svgWidth - padding, svgHeight, [new Date(1997, 10, 1), new Date(2018, 11, 30)], [0,80], countriesData[g.country], d3.select(".chart-wrapper." + country + " svg .area-group-fill"));
        makeStacked(svgWidth - padding, svgHeight, [new Date(1997, 10, 1), new Date(2018, 11, 30)], [0,80], countriesData[g.country], d3.select(".chart-wrapper." + country + " svg .area-group-lines"))
        makeStacked(svgWidth - padding, svgHeight, [new Date(1997, 10, 1), new Date(2018, 11, 30)], [0,80], countriesData[g.country], d3.select(".chart-wrapper." + country + " svg .area-group-stroke"))

        annX = d3.select(".chart-wrapper.Austria .y2003").attr("x");
      }

      areaGroupAnnotations.style("transform", "translate("+annX+"px, 4px)");
    }

  })
}
