	
function generateSummaryChart(tasksData) {
	function getDataSeriesObject (seriesName, meanVal, meadianVal) {
		return { 
					type: "column",
					name: seriesName,
					showInLegend: true,
					indexLabelPlacement: "inside",
					indexLabelFontSize: "20",
					indexLabelFontStyle: "bold",
					indexLabelFormatter: function(e){ return parseFloat(Math.round(e.dataPoint.y * 100) / 100).toFixed(2);},
					dataPoints: [
					{ label: "mean", y: meanVal },
					{ label:  "median", y: meadianVal },
					]
		}
	}
	fitnessList = tasksData.getFitnessesList()
	chartDataArry = []
	origRMSEArr =  jsonPath(tasksData,"$..originalRMSE")
	avgOrigRMSEVal = mean (origRMSEArr)
	medOrigRMSEVal = median (origRMSEArr)	
	chartDataArry.push (getDataSeriesObject ("Original",avgOrigRMSEVal,medOrigRMSEVal))
	for (fitnessFunc of fitnessList)
	{
		subtasksList = new resultsDataObject(tasksData.getTasksByFitness(fitnessFunc));
		improvedRMSEArr =  jsonPath(subtasksList,"$..improvedRMSE")
		avgImprovedRMSEVal = mean (improvedRMSEArr)
		medImprovedRMSEVal = median (improvedRMSEArr)
		chartDataArry.push (getDataSeriesObject (fitnessFunc,avgImprovedRMSEVal,medImprovedRMSEVal))
	}
	chartDataObj = {
	theme: "light1",
		title:{ text: "Summary"},
		data: chartDataArry
	}
	var chart = new CanvasJS.Chart("summarychartContainer", chartDataObj);
	chart.render();
}

function filenameChart(graph,tasksByfitnessAndFileMode, filename)
{

	function generateColumnFormat(inName,inDataPoints,showLegend,additonalAttrib) {
		columnFormat = {
				type: "column",
				name: inName,
				showInLegend: showLegend,
				dataPoints: inDataPoints 
			};
		for (key in additonalAttrib) columnFormat[key] = additonalAttrib[key]
		return columnFormat;
	}

	let detailedData = []
	let improvedColumnsData = []
	let origColumnsData = []
	
	let chart = new CanvasJS.Chart(graph,{
		theme: "light1",
		height: 100,
		width: 100,	
		animationEnabled: true,
		axisX: {
			labelAngle: -30
		},
		data: detailedData
	});
	if (!tasksByfitnessAndFileMode) { return; }
	origMed = median (resultsDataObj.getOriginalRMSEofTasks (tasksByfitnessAndFileMode))
	improvedMed = median (resultsDataObj.getImprovedRMSEofTasks (tasksByfitnessAndFileMode))
	
	origColumnsData.push ({ label: filename,  y: origMed})
	improvedColumnsData.push ({label: filename  , y: improvedMed})		
	detailedData.push (generateColumnFormat("original",origColumnsData,true))
	detailedData.push (generateColumnFormat("improved",improvedColumnsData,true))		
	chart.render();
}

function DetailedChartTest (tasksData,filesList)
{	
	if (!filesList)
		filesList = tasksData.getAllFilesModes()
	let table = document.createElement("TABLE");
	
	for (filename of filesList) {
		row = table.insertRow(-1);
		let nameCell = document.createElement("TD");
		nameCell.innerHTML = filename;
		row.appendChild(nameCell)
		let graphCell = document.createElement("TD");
		row.appendChild(graphCell)
		let graph = document.createElement("div");
		//graph.setAttribute("style","height: 20px; width: 20px;")
		graphCell.appendChild (graph)
		filenameChart(graph, tasksData.getTasksByFileMode (filename),filename)
	}
	var dvTable = document.getElementById("detailedChartContainer");
	dvTable.innerHTML = "";
	dvTable.appendChild(table);
}

function DetailedChart(tasksData, inFilesList,fitnessFuncName){
	// to do: i need to extract from the data list of all original RMSEs by file mode
	let detailedData = []
	let improvedColumnsData = []
	let origColumnsData = []
	let lines = []
	let padding = []
	let filesList = inFilesList
	let axisXinterval = 4
	let chart = new CanvasJS.Chart("detailedChartContainer",{
			theme: "light1",
			title:{ text: "Detailed Results"},
			animationEnabled: true,
			axisX: {
				labelAngle: -30,
				interval: axisXinterval
			},
			data: detailedData,
		});
		
	function generateLine(idx,y1,y2,inTestID){
		labelStr = "test " + inTestID
		return {
		type: "line",
		name: "res",
		lineColor: "black",
		lineThickness: 0.8,
		dataPoints: [{ x: idx, y: y1, label: labelStr },{ x: idx+1, y: y2 ,label:labelStr}],
		testID : inTestID,
		click : function (e) {console.log (e.dataSeries.testID)
			var elem = document.getElementById(e.dataSeries.testID);  
			elem.scrollIntoView(true); 
			}
		}
	}	
		
	function generateColumnFormat(inName,inDataPoints,showLegend,additonalAttrib) {
		columnFormat = {
				type: "column",
				name: inName,
				showInLegend: showLegend,
				dataPoints: inDataPoints 
			};
		for (key in additonalAttrib) columnFormat[key] = additonalAttrib[key]
		return columnFormat;
	}

	// bar columns
	let idx=0
	for (let fileModeName of inFilesList){
		tasksByfitnessAndFileMode = resultsDataObj.getTasksByFitnessByFileMode (fitnessFuncName, fileModeName)
		if (!tasksByfitnessAndFileMode)
		{
			continue;
		}
		origMed = median (resultsDataObj.getOriginalRMSEofTasks (tasksByfitnessAndFileMode))
		improvedMed = median (resultsDataObj.getImprovedRMSEofTasks (tasksByfitnessAndFileMode))
	
		origColumnsData.push ({ label: fileModeName, x:idx , y: origMed})
		improvedColumnsData.push ({label: fileModeName,  x:idx+1 , y: improvedMed})		
		
		tasksIter = resultsDataObj.tasksIterator (tasksByfitnessAndFileMode)
		while (curTask = tasksIter.next())
		{
			detailedData.push (generateLine(idx,curTask.getOriginalRMSE(), curTask.getImprovedRMSE(), curTask.getUniqTestID()))
		}
		
		idx+=axisXinterval
	}


	detailedData.push (generateColumnFormat("original",origColumnsData,true))
	detailedData.push (generateColumnFormat("improved",improvedColumnsData,true))	
	detailedData.push (generateColumnFormat("",padding))

			
	chart.render();
}
 

function imageDiffCell (taskID) {
	let img = document.createElement("img")
	diffPath = "resultsImages\\"+ taskID + "\\" + taskID + "_afterOptimDiff.jpg"
	img.setAttribute("src", diffPath);
	return img.outerHTML
	
}

function imageDiffCell2 (imgApath, imgBpath) {
	if (this.inc == undefined)
	{
		this.inc = 0
	}
	let div = document.createElement("div")
	let curDivId = "Div" + inc++
	
	div.setAttribute("id", curDivId);
	let imgA = new Image;
	let imgB = new Image;
	
	imgB.otherImg = imgA
	imgA.otherImg = imgB

	onloadFunc = function() {
	if (!this.otherImg.complete  || this.otherImg.drawDiff) {
		return
	}
	this.drawDiff = true
	diffImg = imagediff.diff(this.otherImg, this);

	// Now create a canvas,
	canvas = imagediff.createCanvas(diffImg.width, diffImg.height);
	// get its context
	context = canvas.getContext('2d');
	// and finally draw the ImageData diff.
	context.putImageData(diffImg, 0, 0);
	// Add the canvas element to the container.
	elem = document.getElementById(curDivId);
	elem.appendChild (canvas)
	}
	
	imgB.onload = onloadFunc
	imgA.onload = onloadFunc
	imgA.src = imgApath
	imgB.src = imgBpath
	
	return div.outerHTML
}


function transformationCell(origCh, improvedCh){
	if (!origCh || !improvedCh)
	{
		return;
	}
	let table = document.createElement("TABLE");
	//Add the header row.
	 let row = table.insertRow(-1);
	 transformationHeader = [" ","tx","ty","rot","sx","sy","shx","shy"];
	 for (let i = 0; i < transformationHeader.length; i++) {
			let headerCell = document.createElement("TH");
			headerCell.innerHTML = transformationHeader[i];
			row.appendChild(headerCell)
	}
	row = table.insertRow(-1);
	
	lableCell = document.createElement("TD")
	lableCell.innerHTML = "orig"
	row.appendChild(lableCell)
	for (let i = 0; i < origCh.length; i++) {
			let valCell = document.createElement("TD");
			valCell.innerHTML = origCh[i].toFixed(2);
			row.appendChild(valCell)
	}
	row = table.insertRow(-1);
	lableCell = document.createElement("TD")
	lableCell.innerHTML = "improved"
	row.appendChild(lableCell)
	for (let i = 0; i < improvedCh.length; i++) {
			let valCell = document.createElement("TD");
			valCell.innerHTML = improvedCh[i].toFixed(2);
			row.appendChild(valCell)
	}
	return table.outerHTML;
	
}

// to do: sort array by file modes & task ID
// https://www.c-sharpcorner.com/UploadFile/fc34aa/sort-json-object-array-based-on-a-key-attribute-in-javascrip/

function generateTable(tasksData) {          
	//Create a HTML Table element.
	let table = document.createElement("TABLE");
	table.border = "1";

	let columns = new Array();	
	columns.push({name: "TaskID", getter: "getTaskID"  });
	columns.push({name: "fileMode", getter: "getFileMode"	});
	columns.push({name: "fitnessType", getter: "getFitnessType" });
	columns.push({name: "originalFitness", getter: "getOriginalFitness" , formatter: function(val) {return val.toFixed(3)} });
	columns.push({name: "improvedFitness", getter: "getImprovedFitness", formatter: function(val) {return val.toFixed(3)} });
	columns.push({name: "originalRMSE", getter: "getOriginalRMSE", formatter: function(val) {return val.toFixed(2)} });
	columns.push({name: "improvedRMSE", getter: "getImprovedRMSE", formatter: function(val) {return "<b> <mark>" + val.toFixed(2) + " </mark> </b>"} });
	columns.push({name: "transformation", cellGenerator: function (taskData) {return transformationCell (taskData.getOriginalCh(), taskData.getImprovedCh())}})
	//columns.push({name: "finalImageDiff", cellGenerator: function (taskData) {return imageDiffCell (taskData.getTaskID())}})
	//Add the header row.
	var row = table.insertRow(-1);
	for (var i = 0; i < columns.length; i++) {
		var headerCell = document.createElement("TH");
		headerCell.innerHTML = columns[i]["name"];
		row.appendChild(headerCell);
	}

	tasksIter = resultsDataObj.tasksIterator (tasksData.resultsData)
	while (curTask = tasksIter.next())
	{
		row = table.insertRow(-1);
		row.setAttribute("id", curTask.getUniqTestID())
		for ( col of columns)
		{
			var cell = row.insertCell(-1);
			getter = col["getter"]
			formatter = col ["formatter"]
			if (getter!= undefined)
			{
				val = curTask[getter]()
				if (formatter)
				{
					val = formatter (val)
				}
				cell.innerHTML = val 
			}
			else {
				cell.innerHTML =  (col.cellGenerator (curTask))
			}
		}
	}
	/*
	for (var j = 0; j < scoreColumns.length; j++) {
			var cell = row.insertCell(-1);
			
			curVal = curRes["scoreData"][scoreColumns[j]];
			cell.innerHTML = curVal
			if  (scoreColumns[j]=="improvedRMSE"){
				cell.innerHTML = "<b>" + cell.innerHTML +"</b>";
				improvedRMSEvalues.push (Number(curVal))
				curArry = improvedRMSEbyMethod[curRes["taskData"]["fitnessType"]]
				if (curArry)
					curArry.push(Number(curVal))
					
				resultsByFileMode[curFileMode]["improvedRMSE"].push (Number(curVal))
				
			}
			else if (scoreColumns[j]=="originalRMSE"){
				origRMSEvalues.push(Number(curVal))
				resultsByFileMode[curFileMode]["originalRMSE"].push (Number(curVal))
			}
			else if (scoreColumns[j]=="transformation"){
				cell.innerHTML = "";
				tcell = transformationCell(curRes["scoreData"]["originalCh"],curRes["scoreData"]["improvedCh"])
				if (tcell)
				{
					cell.appendChild (tcell);
				}
			}
			
			curArry = improvedRMSEbyOrigFitness	[curRes["taskData"]["fitnessType"]]
			tmpObj = {x: Number(curRes["scoreData"]["improvedFitness"]), y:Number(curRes["scoreData"]["RMSEdiff"]) }
				if (curArry)
					curArry.push(tmpObj)
			
		}*/
	

	var dvTable = document.getElementById("rawResultsTable");
	dvTable.innerHTML = "";
	dvTable.appendChild(table);
	
	
}

