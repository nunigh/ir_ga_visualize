function median(numbers) {
	let median = 0, numsLen = numbers.length;
	numbers.sort(); 
	if (
		numsLen % 2 === 0 // is even
	) {
		// average of two middle numbers
		median = (numbers[numsLen / 2 - 1] + numbers[numsLen / 2]) / 2;
	} else { // is odd
		// middle number only
		median = numbers[(numsLen - 1) / 2];
	}	 
	return median;
}
function mean(numbers) {
	var total = 0, i;
	for (i = 0; i < numbers.length; i += 1) {
		total += numbers[i];
	}
	return total / numbers.length;
}  

function uniqueList (list)
{
	result = list.filter(function (x, i, a) { 
	return a.indexOf(x) == i; 
	})
	return result;
}