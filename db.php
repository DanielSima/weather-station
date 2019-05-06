<?php
	//I've used resources from:
	//https://stackoverflow.com/
	//https://dev.mysql.com/doc/
	//a lot of other sites because I have never used PHP

   	$servername = "mydbinstance.caikea6db5cp.eu-central-1.rds.amazonaws.com:3306";
    $username = "dan192000";
    $password = "";
    $dbname = "dan192000";

	//try to estabilish connection
    $conn = new mysqli($servername, $username, $password, $dbname);
	
	//if failed
	if ($conn->connect_error) {
		//no idea where is this actually going to print but whatever
	   die("Connection failed: " . $conn->connect_error);
	}

	//three selects for last 24 hours, week, month
	$sql = ["SELECT date, temperature, humidity FROM `weather_dashboard` ORDER BY date DESC LIMIT 24",
		    "SELECT date, temperature, humidity FROM `weather_dashboard` WHERE HOUR(date) IN (0,4,8,12,16,20) ORDER BY date DESC LIMIT 42",
		    "SELECT MIN(date), FORMAT(AVG(temperature), 0), FORMAT(AVG(humidity), 0) FROM `weather_dashboard`  GROUP BY DAY(date) ORDER BY date DESC LIMIT 31"];

	for($i = 0; $i < 3; $i++){
		
		//run them one by one
		$recent = mysqli_query($conn, $sql[$i]);
		
		$j = 0;
		
		//put the results into a 3D array (I have never thought I will actually see one :D)
		while($row = mysqli_fetch_assoc($recent)){
			
									//just a fancy condition
			$test[$i][$j][0] = $row[$i == 2 ? "MIN(date)" : "date"];
			$test[$i][$j][1] = $row[$i == 2 ? "FORMAT(AVG(temperature), 0)" : "temperature"];
			$test[$i][$j][2] = $row[$i == 2 ? "FORMAT(AVG(humidity), 0)" : "humidity"];
			
			$j++;
		}
	}
	
	//send it to the client
	echo json_encode($test);
?>
