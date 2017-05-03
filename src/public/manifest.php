<?php
// 应用程序缓存文件
header('Content-Type: text/cache-manifest');

$VERSION = 'mw_1.9.5';                              //此处版本号 跟 JS config.js 版本号 对应

setcookie('VERSION',$VERSION);
$filesToCache = array(
    './lib/angular/angular.min.js?'.$VERSION,
    './lib/angular/angular-ui-router.min.js?'.$VERSION,
    './lib/require/require.min.js',
    './lib/require/require.css.min.js?'.$VERSION,
    './lib/angular/angular-sanitize.min.js?'.$VERSION,
    './lib/angular/angular-async-loader.min.js?'.$VERSION,
    './lib/sm/sm.min.css',
    './lib/sm/sm.min.js',
    './lib/sm/zepto.min.js',
    './config.js?'.$VERSION,
    './routes.js?'.$VERSION,
    './js/controllers/mainCtrl.js?'.$VERSION,
    './app.js?'.$VERSION,
    './style/h5.css?'.$VERSION,
    './img/favicon.ico',
    './img/icon/imglading.png'
);
/*if(isset($_GET['file'])){
	$filesToCache[] = './'.$_GET['file'].'.html';
}*/
?>
CACHE MANIFEST

CACHE:
<?php
$hashes = '';
foreach($filesToCache as $file) {
    echo $file."\n";
    $hashes.=md5_file(strstr($file,'?', TRUE)?:$file);
};
?>

NETWORK:
*

# Hash Version: <?=md5($hashes)?>