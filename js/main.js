/* global d3, barChart, timeSeriesChart */

var timeLineChart = timeSeriesChart()
	.width( 900 )
	.x( d=> d.key )
	.y( d=> d.value );

var carsBarChart = barChart()
	.width( 300 )
	.x( d=> d.key )
	.y( d=> d.value );

var gatesBarChart = barChart()
	.width( 700 )
	.x( d=> d.key )
	.y( d=> d.value );

var timeFmt = d3.timeParse( "%Y-%m-%d %H:%M:%S" );

d3.csv( "./data/Lekagul_slice.csv", d => {
	d.Timestamp = timeFmt( d.Timestamp );
	return d;
} ).then( data => {
  
  console.log( data );

  var csData = crossfilter( data );

  csData.dimTime = csData.dimension( d => d.Timestamp );
  csData.dimGates = csData.dimension( d => d[ "gate-name" ] );
  csData.dimCars = csData.dimension( d => d[ "car-type" ] );

  csData.timeHours = csData.dimTime.group( d3.timeHour );
  csData.gates = csData.dimGates.group();
  csData.cars = csData.dimCars.group();

  timeLineChart.onBrushed( selected => {
  	csData.dimTime.filter( selected );
  	update();
  } );

  carsBarChart.onMouseOver( d => {
  	csData.dimCars.filter( d.key );
  	update();
  } ).onMouseOut( d => {
  	csData.dimCars.filterAll();
  	update();
  } );

  gatesBarChart.onMouseOver( d => {
  	csData.dimGates.filter( d.key );
  	update();
  } ).onMouseOut( d => {
  	csData.dimGates.filterAll();
  	update();
  } );

  function update(){

	d3.select( "#timeline" )
	  .datum( csData.timeHours.all() )
	  .call( timeLineChart );

	d3.select( "#cartypes" )
	  .datum( csData.cars.all() )
	  .call( carsBarChart );

	d3.select( "#gatenames" )
	  .datum( csData.gates.all() )
	  .call( gatesBarChart )
	  .select( ".x.axis" )
	  .selectAll( ".tick text" )
	  .attr( "transform", "rotate(-45) translate(-6,-1)" );

	}

	update();

} );