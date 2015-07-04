<?php
$target_dir = "uploads/";
$data = explode(",", $_POST['imgData']);

$decodedData = base64_decode($data[1]);
$image = imagecreatefromstring($decodedData);

if ($image != false) {
	$fileName = date("YmdHis").".png";
	$targetFile = $target_dir.$fileName;
	file_put_contents($targetFile, $decodedData);
	echo $fileName;
}
else {
	echo "failed";
}
?>