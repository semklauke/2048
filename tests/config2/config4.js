for (var i=1; i<1621; i++) {
	//console.log("CALL multInsert("+i+", 1, 1, 500);");
	console.log("DELETE FROM scheduled_runs WHERE configID ="+i+" LIMIT 30;");

}
//1620