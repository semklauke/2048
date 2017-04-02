<?php  
	//$db = NULL;
	echo '<table>', PHP_EOL;
	echo '<tr> <th>ID</th> <th>-512-</th> <th>-1024-</th> <th>-2048-</th> <th>-4096-</th> <th>-8192-</th> <th>-16384-</th> </tr>', PHP_EOL;
	$values = [];
	try {
		$db = new PDO("mysql:host="."78.47.153.155".";dbname="."2048".";charset=utf8", "2048project", "2017#2048#sqlPassword");
		// {DEBUG}
		$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_WARNING);

		$tests = ["16384", "8192", "4096",  "2048", "1024", "512"];
		foreach ($tests as $col) {
			$data = $db->query("SELECT COUNT(`".$col."`) AS 'count', configID FROM finished_runs WHERE `".$col."` > 0 GROUP BY configID ORDER BY configID ASC");
			while ($configData = $data->fetch(PDO::FETCH_OBJ)) {
				$cID = intval($configData->configID);
				if ($values[$cID] == NULL) {
					$values[$cID] = array(	"id" => $cID,
											"16384" => 0,
											"8192" => 0,
											"4096" => 0,
											"2048" => 0,
											"1024" => 0,
											"512" => 0);

				}
				$values[$cID][$col] = intval($configData->count);

			}
		}

		foreach ($values as $i => $row) {
			echo '<tr>', PHP_EOL;
			echo '<td>', $row["id"], '</td>', PHP_EOL;
			echo '<td>', $row["512"], '</td>', PHP_EOL;
			echo '<td>', $row["1024"], '</td>', PHP_EOL;
			echo '<td>', $row["2048"], '</td>', PHP_EOL;
			echo '<td>', $row["4096"], '</td>', PHP_EOL;
			echo '<td>', $row["8192"], '</td>', PHP_EOL;
			echo '<td>', $row["16384"], '</td>', PHP_EOL;
			echo '</tr>', PHP_EOL;
		}

		foreach ($values as $i => $row) {
			if ($row["2048"] > 0 || $row["4096"] > 0 || $row["8192"] > 0 || $row["16384"] > 0) {
				echo "ID ".$row["id"].":  ";
				$q = $db->query("SELECT COUNT(*) AS count FROM finished_runs WHERE configID = ".$row["id"]);
				$c = intval($q->fetch(PDO::FETCH_OBJ)->count);
				$sum = $row["2048"] + $row["4096"] + $row["8192"] + $row["16384"];
				echo $sum."/".$c."  [".round(($sum/$c)*100)."%]";
				echo '<br />', PHP_EOL;
			}
		}
	} catch (PDOException $e) {
		echo $e->getMessage();
	}


?>