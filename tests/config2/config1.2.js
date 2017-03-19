var sm_array = [0.4, 0.5, 0.6];
var mo_array = [1.4, 1.6, 1.8];
var em_array = [1.5, 2.0, 2.5];
var hi_array = [0.4, 0.8];
var me_array = [0.7, 1.0];
var di_array = [0.2, 0.4];

var arrays = [sm_array, mo_array, em_array, hi_array, me_array, di_array];
var lastNum = 500;
for (var sm=0; sm<sm_array.length; sm++)
for (var mo=0; mo<mo_array.length; mo++)
for (var em=0; em<em_array.length; em++)
for (var hi=0; hi<hi_array.length; hi++)
for (var me=0; me<me_array.length; me++)
for (var di=0; di<di_array.length; di++)  {
	var string = "INSERT INTO configs VALUES ";
	string += "(NULL, "+lastNum+", 'smoothness', "+sm_array[sm]+"), ";
	string += "(NULL, "+lastNum+", 'monotonic', "+mo_array[mo]+"), ";
	string += "(NULL, "+lastNum+", 'emptyPieces', "+em_array[em]+"), ";
	string += "(NULL, "+lastNum+", 'highestValue', "+hi_array[hi]+"), ";
	string += "(NULL, "+lastNum+", 'merges', "+me_array[me]+"), ";
	string += "(NULL, "+lastNum+", 'distance', "+di_array[di]+");";
	console.log(string);
	lastNum++;
}