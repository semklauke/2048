var fs = require('fs');

var files = ["c1.js", "c2.js", "c3.js", "c4.js", "c5.js", "c6.js", "c7.js", "c8.js", "c9.js", "c10.js", "c11.js", "c12.js", "c13.js", "c14.js", "c15.js", "c16.js", "c20.js", "c21.js", "c22.js", "c23.js", "c24.js", "c25.js", "c26.js", "c.27js", "c28.js", "c29.js", "c30.js", "c31.js", "c32.js", "c33.js", "c34.js", "c35.js", "c36.js", "c37.js", "c40.js", "c41.js", "c42.js", "c43.js", "c44.js", "c45.js", "c46.js", "c47.js", "c48.js", "c49.js", "c50.js", "c51.js", "c52.js", "c53.js", "c54.js", "c55.js"];

var lFiles = files.length;

var lastNum = 2;

for (var x=0; x<lFiles; x++) {
	var data = JSON.parse(fs.readFileSync('c1.js', 'utf8'));
	var l = data.length;
	for (var i=0; i<l; i++) {
		lastNum++;
		var s = "INSERT INTO configs VALUES (NULL, "+lastNum+", 'smoothness', "+data[i].smoothness+"), ";
		s += "(NULL, "+lastNum+", 'monotonic', "+data[i].monotonic+"), ";
		s += "(NULL, "+lastNum+", 'emptyPieces', "+data[i].emptyPieces+"), ";
		s += "(NULL, "+lastNum+", 'highestValue', "+data[i].highestValue+");";
	
		console.log(s);
	}
}


