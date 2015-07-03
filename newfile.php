<?php
$target_dir = "uploads/";

$based64Image=substr($_POST['data'], strpos($_POST['data'], ',')+1);

$image = imagecreatefromstring(base64_decode($based64Image));

$fileName='';
if($image != false)
{
	$fileName=date("YmdHis").'.png';
	if(!imagepng($image, $fileName))
	{
		echo "Sorry, your file was not uploaded.";
	}
	
	$target_file = $target_dir . $fileName;
	if (move_uploaded_file($fileName, $target_file)) {
        echo $fileName;//basename( $_FILES["fileToUpload"]["name"]);
    } else {
        echo "Sorry, there was an error uploading your file.";
    }
}
else
{
	echo "Sorry, your file was not uploaded.";
}
?>