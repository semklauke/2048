for (var i=3; i<12753; i++) {
	//console.log("CALL multInsert("+i+", 1, 1, 500);");
	console.log("INSERT INTO scheduled_runs VALUES ");
	for (var x=0; x<999; x++) {
		console.log("(NULL, "+i+", 1, 1), ")
	}
	console.log("(NULL, "+i+", 1, 1);");
}
//12752
