import {json2js} from '../lib/core/utils.js'

function loadSpinner(json){
    const spinners = json2js(json);
    for (var s = 0; s < spinners.frames.length; ++s) {
        var spinner = spinners.frames[s];
        var i = 0;
        setInterval(function() {
           /*  el.innerHTML = spinner[i];
            i = (i + 1) % spinner.length; */
            console.log(spinner)
        }, 300);
    }
}

loadSpinner('./frame_loading.json');

/* for (var s = 0; s < spinners.length; ++s) {
    var spinner = spinners[s];
    var div = document.createElement('div');
    var el = document.createElement('pre');
    div.appendChild(el);
    document.body.appendChild(div);

        (function(spinner, el) {
            var i = 0;
            setInterval(function() {
            el.innerHTML = spinner[i];
            i = (i + 1) % spinner.length;
            }, 300);
        })(spinner, el);
    }
} */