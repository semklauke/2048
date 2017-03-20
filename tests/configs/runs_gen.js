// File um aus configs eine bestimmte anzahl Tests als SQL befehl zu erzeugen 
for (var i=1000; i<1004; i++) { // configID Range
	//console.log("CALL multInsert("+i+", 1, 1, 500);"); // <- dauert zu lage
	console.log("INSERT INTO scheduled_runs VALUES ");
	for (var x=0; x<50; x++) { // veie veiel tests pro Config
		console.log("(NULL, "+i+", 6, 1), ")
	}
	console.log("(NULL, "+i+", 6, 1);");
}