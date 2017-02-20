var s_array = [0.1, 0.2, 0.3, 0.5];
var m_array = [0.5, 1.0, 1.2, 1.3, 1.5, 1.7, 2.0];
var e_array = [0.5, 0.8, 1.0, 1.5];
var h_array = [0.5, 0.8, 1.0];


var lastNum = 52;
for (var s=0; s<s_array.length; s++)
for (var m=0; m<m_array.length; m++)
for (var h=0; h<h_array.length; h++)
for (var e=0; e<e_array.length; e++) {
	var string = "INSERT INTO configs VALUES (NULL, "+lastNum+", 'smoothness', "+s_array[s]+"), ";
	string += "(NULL, "+lastNum+", 'monotonic', "+m_array[m]+"), ";
	string += "(NULL, "+lastNum+", 'emptyPieces', "+e_array[e]+"), ";
	string += "(NULL, "+lastNum+", 'highestValue', "+h_array[h]+");";
	console.log(string);
	lastNum++;
}