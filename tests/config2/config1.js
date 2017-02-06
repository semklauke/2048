var s_array = [0.1, 0.2, 0.3, 0.5, 1.0];
var m_array = [0.5, 1.0, 1.2, 1.3, 1.5, 1.7, 2.0, 2.1, 2.2];
var h_array = [0.5, 0.8, 1.0, 1.2, 1.4, 2.0];
var e_array = [0.5, 0.7, 0.9, 1.0, 1.1, 1.5];

var lastNum = 1;
for (var s=0; s<s_array.length; s++)
for (var m=0; m<m_array.length; m++)
for (var h=0; h<h_array.length; h++)
for (var e=0; e<e_array.length; e++) {
	var string = "INSERT INTO configs VALUES (NULL, "+lastNum+", 'smoothness', "+s_array[s]+"), ";
	string += "(NULL, "+lastNum+", 'monotonic', "+m_array[m]+"), ";
	string += "(NULL, "+lastNum+", 'emptyPieces', "+h_array[h]+"), ";
	string += "(NULL, "+lastNum+", 'highestValue', "+e_array[e]+");";
	console.log(string);
	lastNum++;
}