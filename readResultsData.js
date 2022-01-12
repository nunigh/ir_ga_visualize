
resultsDataObject = function (inResultsData){
    this.resultsData= inResultsData
};
resultsDataObject.prototype.getFitnessesList = function() { 
		return uniqueList (jsonPath(this.resultsData, "$..fitnessType"))
	}
	resultsDataObject.prototype.getAllOriginalRMSEArr = function () {
		return jsonPath (this.resultsData,"$..originalRMSE")
	}
	resultsDataObject.prototype.getAllFilesModes = function () {
		return uniqueList(jsonPath (this.resultsData,"$..fileMode"))
	}
	resultsDataObject.prototype.getTasksByFitness = function (fitnessType){
		return jsonPath (this.resultsData,"$..[?(@.fitnessType == '"+fitnessType+ "')]")
	}
	resultsDataObject.prototype.getimprovedRmseByFitnessByFileMode = function (fitnessType,fileMode) {
		return jsonPath (this.resultsData,"$..[?(@.fitnessType == '"+fitnessType+ "' && @.fileMode == '"+fileMode+"')][improvedRMSE]")
	}
	resultsDataObject.prototype.getTasksByFitnessByFileMode = function (fitnessType,fileMode) {
		return jsonPath (this.resultsData,"$..[?(@.fitnessType == '"+fitnessType+ "' && @.fileMode == '"+fileMode+"')]")
	}
resultsDataObject.prototype.getTasksByFileMode = function (fileMode) {
		return jsonPath (this.resultsData,"$..[?(@.fileMode == '"+fileMode+"')]")
	}
	resultsDataObject.prototype.getImprovedRMSEofTasks = function (tasks){
		return jsonPath (tasks, "$..improvedRMSE");
	}
	resultsDataObject.prototype.getOriginalRMSEofTasks = function (tasks){
		return jsonPath (tasks, "$..originalRMSE");
	}
	
	resultsDataObject.prototype.tasksIterator = function (array) {
    let nextIndex = 0;
    
    return {
       next: function() {
		   if (nextIndex < array.length )
		   {
			   obj = array[nextIndex++]
			   return {
				   value: obj,
				   getFileMode : function(){ return obj ["fileMode"]},
				   getFitnessType : function(){ return obj ["fitnessType"]},
				   getTaskID	: function(){ return obj ["TaskID"] },
				   getUniqTestID : function() {return obj ["TaskID"] + "_" + obj ["fitnessType"]},
				   getOriginalRMSE	: function(){ return obj ["originalRMSE"]},
				   getOriginalFitness	: function(){ return obj ["originalFitness"]} ,
				   getOriginalCh	: function(){ return obj ["originalCh"]} ,
				   getImprovedRMSE	: function(){ return obj ["improvedRMSE"]}, 
				   getImprovedFitness	: function(){ return obj ["improvedFitness"]} ,
				   getImprovedCh : function(){ return obj["improvedCh"]},
				   getReferencedImagePath : function() {return obj["referencedPath"]},
				   getimprovedImagePath : function() {return obj["improvedImg"]}
			   }
		   }
           else
			return false
       }
    };
	}

