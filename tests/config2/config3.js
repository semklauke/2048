for (var i=1000; i<1004; i++) {
	//console.log("CALL multInsert("+i+", 1, 1, 500);");
	console.log("INSERT INTO scheduled_runs VALUES ");
	for (var x=0; x<50; x++) {
		console.log("(NULL, "+i+", 6, 1), ")
	}
	console.log("(NULL, "+i+", 6, 1);");
}
//1620