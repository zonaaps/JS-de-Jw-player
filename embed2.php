<?php
session_start();
function decode($string)
{
    $output = false;
    $encrypt_method = "AES-256-CBC";
    $secret_key = '75221358';
    $secret_iv = '123Body..';
    $key = hash('sha256', $secret_key);
    $iv = substr(hash('sha256', $secret_iv), 0, 16);
    $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key, 0, $iv);
    return $output;
}

// Define las tres URL disponibles
$urls = [
    'https://sp.rmbl.ws/',
    'https://ak2.rmbl.ws/',
    'https://hugh.cdn.rumble.cloud/video/'
];

// Verifica si 'v' está definido y no es nulo
if (isset($_GET['v']) && $_GET['v'] !== null) {
    $url = decode($_GET['v']);
    $url_aaa = str_replace('.aaa.mp4', '.aaa.mp4', $url);
    $url_gaa = str_replace('.aaa.mp4', '.gaa.mp4', $url);
    $url_caa = str_replace('.aaa.mp4', '.caa.mp4', $url);
    $url_baa = str_replace('.aaa.mp4', '.baa.mp4', $url);
    $url_oaa = str_replace('.aaa.mp4', '.oaa.mp4', $url);
} else {
    // Manejo de error si 'v' no está presente
    die("Error: Parameter 'v' not found.");
}

// Verifica si hay un arreglo de índices de URL almacenado en la sesión
if (!isset($_SESSION['url_indexes']) || empty($_SESSION['url_indexes'])) {
    // Si no hay un arreglo de índices, inicializa uno y lo baraja
    $_SESSION['url_indexes'] = range(0, count($urls) - 1);
    shuffle($_SESSION['url_indexes']);
}

// Obtiene el primer índice del arreglo de índices y lo elimina del arreglo
$random_index = array_shift($_SESSION['url_indexes']);
$random_url = $urls[$random_index];

// Verifica si la URL desencriptada es igual a la URL original y comienza con "https://hugh.cdn.rumble.cloud/video/"
if ($url === decode($_GET['v']) && startsWith($url, 'https://hugh.cdn.rumble.cloud/video/')) {
    // No se realiza ningún cambio, se mantiene la URL original
} else {
    // Reemplaza la parte de la URL original con la URL seleccionada aleatoriamente
    // Verifica si la URL desencriptada ya contiene "video/" o si comienza con una de las tres URLs permitidas
    if (strpos($url, 'video/') === false && !startsWith($url, 'https://sp.rmbl.ws/') && !startsWith($url, 'https://ak2.rmbl.ws/') && !startsWith($url, 'https://hugh.cdn.rumble.cloud/video/')) {
        // No se asigna una URL nueva, se mantiene la URL desencriptada por defecto
    } else {
        // Reemplaza la parte de la URL original con la URL seleccionada aleatoriamente
        $url = preg_replace('~https?://[^/]+/~', $random_url, $url);
        $url_aaa = preg_replace('~https?://[^/]+/~', $random_url, $url_aaa);
        $url_gaa = preg_replace('~https?://[^/]+/~', $random_url, $url_gaa);
        $url_caa = preg_replace('~https?://[^/]+/~', $random_url, $url_caa);
        $url_baa = preg_replace('~https?://[^/]+/~', $random_url, $url_baa);
        $url_oaa = preg_replace('~https?://[^/]+/~', $random_url, $url_oaa);
    }
}

// Función para verificar si una cadena comienza con otra cadena
function startsWith($string, $prefix) {
    return strpos($string, $prefix) === 0;
}

if (!empty($_GET['v'])) {
    $url = decode($_GET['v']);
    include("encode.php");
}
if (!empty($_GET['img'])) {
    $urlImagenCodificada = $_GET['img'];
    $urlImagenDesencriptada = decode($urlImagenCodificada);
}

// Decodificar audios si está presente 'audio' en $_GET
$audiosDesencriptados = []; // Inicializa el array de audios desencriptados para evitar problemas
if (!empty($_GET['audio'])) {
    $audiosCodificados = $_GET['audio'];
    foreach ($audiosCodificados as $audioCodificado) {
        $audiosDesencriptados[] = decode($audioCodificado);
    }
}

// Decodificar subtítulos si está presente 'sub' en $_GET
$subsDesencriptados = []; // Inicializa la variable fuera del bloque if

if (!empty($_GET['sub'])) {
    $subsCodificados = $_GET['sub'];
    foreach ($subsCodificados as $subCodificado) {
        $subsDesencriptados[] = decode($subCodificado);
    }
}

// Desencriptar el nombre de la película si está presente 'nombre_pelicula' en $_GET
if (!empty($_GET['nombre_pelicula'])) {
    $nombrePeliculaCodificada = $_GET['nombre_pelicula'];
    $nombrePeliculaDesencriptada = decode($nombrePeliculaCodificada);
}

?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title><?php echo $nombrePeliculaDesencriptada; ?></title>
    <link rel="preload" href="https://zonaaps.com/embed2.php" as="document">
	<link rel="preconnect" href="//api.themoviedb.org">
	<link rel="dns-prefetch" href="https://ak2.rmbl.ws">
    <link rel="dns-prefetch" href="https://sp.rmbl.ws/">
    <link rel="dns-prefetch" href="https://hugh.cdn.rumble.cloud/video/">
    <link rel="preconnect" href="//rumble.com">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
	<meta name="referrer" content="no-referrer">
	<meta name="robots" content="noindex">
    <meta name="googlebot" content="noindex">
    <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">
    <meta name="msapplication-TileColor" content="#ff0b00">
    <meta name="theme-color" content="#ff0b00">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="og:sitename" content="Movie Days">
    <meta name="og:type" content="video.movie">
    <link rel="mask-icon" href="https://zonaaps.com/player/assets/img/maskable_icon.png" color="#ffffff">
    <link rel="shortcut icon" href="https://zonaaps.com/wp-content/uploads/2024/02/lOGO-ANONYRED-SIN-FONDO.png" type="image/ico">
    <link rel="apple-touch-icon-precomposed" href="https://zonaaps.com/wp-content/uploads/2024/02/lOGO-ANONYRED-SIN-FONDO.png">
    <link rel="preconnect" href="//t.dtscdn.com">
    <link rel="preconnect" href="//ak2.rmbl.ws">
    <link rel="preconnect" href="//sp.rmbl.ws">
    <link rel="preconnect" href="//hugh.cdn.rumble.cloud/video/">
    <link rel="preconnect" href="//rumble.com">
    <link rel="preconnect" href="//zonaaps.com">
    <link rel="preconnect" href="//www.google.com">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/zonaaps/JS-de-Jw-player@main/style.css">
    <script type="text/javascript">
        var xStorage;
        var isIE = function() {
            var ua = window.navigator.userAgent,
                msie = ua.indexOf('MSIE '),
                trident = ua.indexOf('Trident/'),
                rv = ua.indexOf('rv:');
            if(msie > 0) return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
            else if(trident > 0 && rv > -1) return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
            return false
        };
        if(isIE()) document.write('<script src="https://cdn.jsdelivr.net/gh/zonaaps/JS-de-Jw-player/polyfill.js"><\/script>');
        try {
            if (typeof window.localStorage !== "undefined") {
                xStorage = window.localStorage;
            } else if (typeof window.xStorage !== "undefined") {
                xStorage = window.sessionStorage;
            } else {
                xStorage = {
                    getItem: function(key) {
                        return null;
                    },
                    setItem: function(key, value) {
                        return null;
                    },
                    removeItem: function(key, val) {
                        return null;
                    },
                    clear: function() {
                        return null;
                    }
                };
            }
        } catch(e) {
            xStorage = {
                getItem: function(key) {
                    return null;
                },
                setItem: function(key, value) {
                    return null;
                },
                removeItem: function(key, val) {
                    return null;
                },
                clear: function() {
                    return null;
                }
            };
        }
    </script>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
</head>

<body class="videoplayer">
    
    <div id="mContainer" class="embed-container">
        <div class="embed-wrapper">
            <div id="loading" class="lds-ellipsis">
                <div></div>
                <div></div>
                <div></div>
            </div>
            <h1 id="message" style="display:none">Por favor espere...</h1>
        </div>
    </div>
    <div id="videoContainer" style="display:none"></div>
    
    <div id="resume" style="display:none">
    <div class="pop-wrap">
        <div class="pop-main">
            <div class="pop-html">
                <div class="pop-block">
                    <div class="myConfirm">
                        <p>¡Bienvenido de nuevo! lo dejaste en <span id="timez"></span> ¿Te gustaría continuar viendo? </p>
                        <p>
                            <button id="resume_no" class="button" onclick="$('#resume').hide()"> No, gracias </button>
                            <button id="resume_yes" class="button" onclick="resumePlayback()"> Sí, por favor </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
    <div id="directAds" style="display:none">
        <button id="closeAds" type="button" onclick="$('#directAds').hide()" title="Cerrar anuncios" aria-label="Cerrar anuncios">&times;</button>
        <iframe id="iframeAds" frameborder="0" width="100%" height="100%"></iframe>
    </div>
    <script src="https://zonaaps.com/player/assets/js/prebid-ads.js"></script>
    <script src="https://zonaaps.com/player/assets/js/detect-adblocker.min.js"></script>
    <script src="https://zonaaps.com/player/assets/js/devtools-detector.js"></script>
	<script src="https://zonaaps.com/player/assets/js/sandblaster.js"></script>
    <script src="https://cdn.jsdelivr.net/gh/zonaaps/JS-de-Jw-player@main/jwplayer.js"></script>
        <?php include "archivos-js/wwx.peliculas-1-embed2.video.js"; ?>
 </body> 
</html>