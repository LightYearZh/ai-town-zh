import * as CONFIG from './levelconfig.js' 



const mapfile_preamble = '' +
'// Map generated by assettool.js'+new Date()+'\n'+
'\n'+
'export const tilesetpath = "'+CONFIG.tilesetpath +'"\n'+
'export const tiledim = '+CONFIG.tiledim+'\n' +
'export const screenxtiles = '+CONFIG.screenxtiles +'\n'+
'export const screenytiles = '+CONFIG.screenytiles +'\n'+
'export const tilefilew = '+CONFIG.tilefilew+'\n'+ 
'export const tilefileh = '+CONFIG.tilefileh+'\n\n' 

const bgtile_string_start = '' +
'export const bgtiles = [\n'+
'   [\n'


function write_map_file(bg_tiles_0, bg_tiles_1, obj_tiles_1, obj_tiles_2){
    let text = mapfile_preamble; 
    text += bgtile_string_start;

    for(let row = 0; row < bg_tiles_0.length; row++) {
        text += '[ ';
        for(let column = 0; column < bg_tiles_0[row].length; column++) {
            text += bg_tiles_0[row][column];
            if (column != bg_tiles_0.length - 1){
                text += ' , ';
            }
        }
        text += '],\n';
    }
    text += '],\n';
    text += '[\n';
    for(let row = 0; row < bg_tiles_1.length; row++) {
        text += '[ ';
        for(let column = 0; column < bg_tiles_1[row].length; column++) {
            text += bg_tiles_1[row][column];
            if (column != bg_tiles_1.length - 1){
                text += ' , ';
            }
        }
        text += '],\n';
    }
    text += '],];\n\n';

    text += ''+
    'export const objmap = [\n'+
    '[\n';

    for(let row = 0; row < obj_tiles_1.length; row++) {
        text += '[ ';
        for(let column = 0; column < obj_tiles_1[row].length; column++) {
            text += obj_tiles_1[row][column];
            if (column != obj_tiles_1.length - 1){
                text += ' , ';
            }
        }
        text += '],\n';
    }
    text += '],\n';
    text += '[\n';

    for(let row = 0; row < obj_tiles_2.length; row++) {
        text += '[ ';
        for(let column = 0; column < obj_tiles_2[row].length; column++) {
            text += obj_tiles_2[row][column];
            if (column != obj_tiles_2.length - 1){
                text += ' , ';
            }
        }
        text += '],\n';
    }
    text += '],];\n';

    download(text, "map.js", "text/plain");
}


// Function to download data to a file
function download(data, filename, type) {
    var file = new Blob([data], {type: type});
    if (window.navigator.msSaveOrOpenBlob) // IE10+
        window.navigator.msSaveOrOpenBlob(file, filename);
    else { // Others
        var a = document.createElement("a"),
                url = URL.createObjectURL(file);
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function() {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);  
        }, 0); 
    }
}

export function generate_level_file(layers) {
    let layer0 = layers[0];
    let layer1 = layers[1];
    let layer2 = layers[2];
    let layer3 = layers[3];

    // level0 
    var tile_array0 = Array.from(Array(CONFIG.leveltilewidth), () => new Array(CONFIG.leveltileheight));
    for (let x = 0; x < CONFIG.leveltilewidth; x++) {
        for (let y = 0; y < CONFIG.leveltileheight; y++) {
            tile_array0[x][y] = -1;
        }
    }
    for (var i = 0; i < layer0.container.children.length; i++) {
        var child = layer0.container.children[i];
        if (!child.hasOwnProperty('index')) {
            continue;
        }
        let x_coord = child.x / CONFIG.tiledim;
        let y_coord = child.y / CONFIG.tiledim;
        tile_array0[x_coord][y_coord] = child.index;
    }

    // level1 
    var tile_array1 = Array.from(Array(CONFIG.leveltilewidth), () => new Array(CONFIG.leveltileheight));
    for (let x = 0; x < CONFIG.leveltilewidth; x++) {
        for (let y = 0; y < CONFIG.leveltileheight; y++) {
            tile_array1[x][y] = -1;
        }
    }
    for (var i = 0; i < layer1.container.children.length; i++) {
        var child = layer1.container.children[i];
        if (!child.hasOwnProperty('index')) {
            continue;
        }
        let x_coord = child.x / CONFIG.tiledim;
        let y_coord = child.y / CONFIG.tiledim;
        tile_array1[x_coord][y_coord] = child.index;
    }

    //  object level
    var tile_array2 = Array.from(Array(CONFIG.leveltilewidth), () => new Array(CONFIG.leveltileheight));
    for (let x = 0; x < CONFIG.leveltilewidth; x++) {
        for (let y = 0; y < CONFIG.leveltileheight; y++) {
            tile_array2[x][y] = -1;
        }
    }
    for (var i = 0; i < layer2.container.children.length; i++) {
        var child = layer2.container.children[i];
        if (!child.hasOwnProperty('index')) {
            continue;
        }
        let x_coord = child.x / CONFIG.tiledim;
        let y_coord = child.y / CONFIG.tiledim;
        tile_array2[x_coord][y_coord] = child.index;
    }

    //  object level
    var tile_array3 = Array.from(Array(CONFIG.leveltilewidth), () => new Array(CONFIG.leveltileheight));
    for (let x = 0; x < CONFIG.leveltilewidth; x++) {
        for (let y = 0; y < CONFIG.leveltileheight; y++) {
            tile_array3[x][y] = -1;
        }
    }
    for (var i = 0; i < layer3.container.children.length; i++) {
        var child = layer3.container.children[i];
        if (!child.hasOwnProperty('index')) {
            continue;
        }
        let x_coord = child.x / CONFIG.tiledim;
        let y_coord = child.y / CONFIG.tiledim;
        tile_array3[x_coord][y_coord] = child.index;
    }

    write_map_file(tile_array0, tile_array1, tile_array2, tile_array3);
}