import * as PIXI from 'pixi.js'
import { g_context }  from './context.js' // global context
import * as CONFIG from './levelconfig.js' 
import * as INTER from './interactive.js'
import * as UNDO from './undo.js'
import * as FILE from './mapfile.js'
import { EventSystem } from '@pixi/events';


function tile_index_from_coords(x, y) {
    return x + (y*CONFIG.NUM32XTILES*g_context.tileDim);
}

function tile_index_from_px(x, y) {
    let coord_x = Math.floor(x / g_context.tileDim);
    let coord_y = Math.floor(y / g_context.tileDim);
    return tile_index_from_coords(coord_x, coord_y); 
}

function DragState() {
    this.square = new PIXI.Graphics();
    this.starx  = 0;
    this.starty = 0;
    this.endx   = 0;
    this.endy   = 0;
}

class LayerContext {
    constructor(app, num) {
        this.num =  num;
        this.app = app;
        this.container = new PIXI.Container();
        this.sprites = {};
        this.dragctx = new DragState();

        app.stage.addChild(this.container);
        this.square = INTER.set_interactive(this.container);

        this.square.on('mousedown',   onLevelMousedown.bind(null,  this));
        this.square.on('mousemove',   onLevelMousemove.bind(null));
        this.square.on('mouseover',    onLevelMouseover);
        this.square.on('pointerdown', onLevelPointerDown.bind(null, this))
         .on('pointerup', onLevelDragEnd.bind(null, this))
         .on('pointerupoutside', onLevelDragEnd.bind(null, this)); 
    }

    addTileLevelCoords(x, y, dim, index) {
        return this.addTileLevelPx(x * dim, y * dim, index);
    }

    addTileLevelPx(x, y, index) {
        let xPx = x;
        let yPx = y;

        const ctile = new PIXI.Sprite(curtiles[index]);  // level map
        ctile.index = index; // stuff index into sprite for generating map.js
        const ctile2 = new PIXI.Sprite(curtiles[index]); // composite map

        // snap to grid
        ctile.x = (xPx >> g_context.dimlog) << g_context.dimlog;
        ctile2.x = (xPx >> g_context.dimlog) << g_context.dimlog;
        ctile.y = (yPx >> g_context.dimlog) << g_context.dimlog;
        ctile2.y = (yPx >> g_context.dimlog) << g_context.dimlog;

        // console.log('ctile.x ', ctile.x, 'ctile.y ', ctile.y);
        let new_index = tile_index_from_px(ctile.x, ctile.y);
        // console.log('Level0 index',new_index);

        if (this.sprites.hasOwnProperty(new_index)) {
            console.log("level: removing old tile", new_index);
            this.container.removeChild(this.sprites[new_index]);
            composite.container.removeChild(composite.sprites[new_index]);
        }
        this.container.addChild(ctile);
        composite.container.addChild(ctile2);
        this.sprites[new_index] = ctile;
        composite.sprites[new_index] = ctile2;
        return new_index;
    }

    drawGrid() {
        if (typeof this.lines == 'undefined') {
            this.toggle = true;
            this.lines = [];
            this.grid_graphics = new PIXI.Graphics();

            let gridsize = g_context.tileDim;
            this.grid_graphics.lineStyle(1, 0xffffff, 1);

            let index = 0;
            for (let i = 0; i < CONFIG.LEVELWIDTH; i += gridsize) {
                this.grid_graphics.moveTo(i, 0);
                this.grid_graphics.lineTo(i, CONFIG.LEVELHEIGHT);
                this.grid_graphics.moveTo(i + gridsize, 0);
                this.grid_graphics.lineTo(i + gridsize, CONFIG.LEVELHEIGHT);

                this.grid_graphics.moveTo(0, i);
                this.grid_graphics.lineTo(CONFIG.LEVELWIDTH, i);
                this.grid_graphics.moveTo(0, i + gridsize);
                this.grid_graphics.lineTo(CONFIG.LEVELWIDTH, i + gridsize);
            }
        }
        if (this.toggle) {
            this.container.addChild(this.grid_graphics);
        } else {
            this.container.removeChild(this.grid_graphics);
        }

        this.toggle = !this.toggle;
    }
} // class  LayerContext

class TilesetContext {
    constructor(app) {
        this.app = app;
        this.container = new PIXI.Container();

        const texture = PIXI.Texture.from(CONFIG.TILESETFILE);
        const bg    = new PIXI.Sprite(texture);
        this.square = new PIXI.Graphics();
        this.square.drawRect(0, 0, CONFIG.TILEFILEW, CONFIG.TILEFILEH);
        this.square.beginFill(0x2980b9);
        this.square.drawRect(0, 0, CONFIG.TILEFILEW, CONFIG.TILEFILEH);
        this.square.interactive = true;
        this.container.addChild(this.square);
        this.container.addChild(bg);
        
        this.app.stage.addChild(this.container);

        this.dragctx = new DragState();

        this.square.on('mousedown', function (e) {
            console.log('Mouse clicked');

            let tilex = Math.floor(e.data.global.x / g_context.tileDim);
            let tiley = Math.floor(e.data.global.y / g_context.tileDim);

            g_context.tile_index = (tiley * CONFIG.NUM32XTILES) + tilex;

            console.log('X', tilex, 'Y', tiley, 'index:  ',g_context.tile_index);
        });

        this.square.on('pointerdown', onTilesetDragStart)
                .on('pointerup', onTilesetDragEnd)
                .on('pointerupoutside', onTilesetDragEnd);
    }
} // class TilesetContext


class CompositeContext {

    constructor(app) {
        this.app = app;
        this.container = new PIXI.Container();
        this.app.stage.addChild(this.container);
        this.sprites = {};
        this.circle = new PIXI.Graphics();
    }

} // class CompositeContext

// -- Editor wide globals --

//  all tiles in tilemap are loaded and stored in these arrays
const tiles32  = []; 
const tiles16  = []; 

// First layer of level
const level_app0 = new PIXI.Application( {backgroundColor: 0x2980b9, width : CONFIG.LEVELWIDTH, height : CONFIG.LEVELHEIGHT, view: document.getElementById('level0')});
const layer0 = new LayerContext(level_app0, 0);

// second layer of level 
const level_app1 = new PIXI.Application( {backgroundColor: 0x2980b9, width : CONFIG.LEVELWIDTH, height : CONFIG.LEVELHEIGHT, view: document.getElementById('level1')});
const layer1 = new LayerContext(level_app1,1);

//  object layer of level
const level_app2    = new PIXI.Application( {backgroundColor: 0x2980b9, width : CONFIG.LEVELWIDTH, height : CONFIG.LEVELHEIGHT, view: document.getElementById('level3')});
const layer2 = new LayerContext(level_app2, 2);

//  object layer of level
const level_app3    = new PIXI.Application( {backgroundColor: 0x2980b9, width : CONFIG.LEVELWIDTH, height : CONFIG.LEVELHEIGHT, view: document.getElementById('level4')});
const layer3 = new LayerContext(level_app3, 3);

// composite view 
const composite_app = new PIXI.Application( {backgroundColor: 0x2980b9, width : CONFIG.LEVELWIDTH, height : CONFIG.LEVELHEIGHT, view: document.getElementById('composite')});
const composite = new CompositeContext(composite_app);

// tileset
const tileset_app = new PIXI.Application( {width :CONFIG.TILEFILEW, height : CONFIG.TILEFILEH, view: document.getElementById('tileset')});
const { renderer } = tileset_app;
// Install the EventSystem
renderer.addSystem(EventSystem, 'tileevents');
let tileset = new TilesetContext(tileset_app);

// these two are currently unused, was using to switch between 16 bit and 32 bit tiles
let curtiles = tiles32; 
let indexswitch = false;


window.create_level_file = () => {
    generate_level_file();
}

function generate_level_file() {
    // level0 
    var tile_array0 = Array.from(Array(CONFIG.LEVELTILEWIDTH), () => new Array(CONFIG.LEVELTILEHEIGHT));
    for (let x = 0; x < CONFIG.LEVELTILEWIDTH; x++) {
        for (let y = 0; y < CONFIG.LEVELTILEHEIGHT; y++) {
            tile_array0[x][y] = -1;
        }
    }
    for (var i = 0; i < layer0.container.children.length; i++) {
        var child = layer0.container.children[i];
        if (!child.hasOwnProperty('index')) {
            continue;
        }
        let x_coord = child.x / CONFIG.TILEDIM;
        let y_coord = child.y / CONFIG.TILEDIM;
        tile_array0[x_coord][y_coord] = child.index;
    }

    // level1 
    var tile_array1 = Array.from(Array(CONFIG.LEVELTILEWIDTH), () => new Array(CONFIG.LEVELTILEHEIGHT));
    for (let x = 0; x < CONFIG.LEVELTILEWIDTH; x++) {
        for (let y = 0; y < CONFIG.LEVELTILEHEIGHT; y++) {
            tile_array1[x][y] = -1;
        }
    }
    for (var i = 0; i < layer1.container.children.length; i++) {
        var child = layer1.container.children[i];
        if (!child.hasOwnProperty('index')) {
            continue;
        }
        let x_coord = child.x / CONFIG.TILEDIM;
        let y_coord = child.y / CONFIG.TILEDIM;
        tile_array1[x_coord][y_coord] = child.index;
    }

    //  object level
    var tile_array2 = Array.from(Array(CONFIG.LEVELTILEWIDTH), () => new Array(CONFIG.LEVELTILEHEIGHT));
    for (let x = 0; x < CONFIG.LEVELTILEWIDTH; x++) {
        for (let y = 0; y < CONFIG.LEVELTILEHEIGHT; y++) {
            tile_array2[x][y] = -1;
        }
    }
    for (var i = 0; i < layer2.container.children.length; i++) {
        var child = layer2.container.children[i];
        if (!child.hasOwnProperty('index')) {
            continue;
        }
        let x_coord = child.x / CONFIG.TILEDIM;
        let y_coord = child.y / CONFIG.TILEDIM;
        tile_array2[x_coord][y_coord] = child.index;
    }

    //  object level
    var tile_array3 = Array.from(Array(CONFIG.LEVELTILEWIDTH), () => new Array(CONFIG.LEVELTILEHEIGHT));
    for (let x = 0; x < CONFIG.LEVELTILEWIDTH; x++) {
        for (let y = 0; y < CONFIG.LEVELTILEHEIGHT; y++) {
            tile_array3[x][y] = -1;
        }
    }
    for (var i = 0; i < layer3.container.children.length; i++) {
        var child = layer3.container.children[i];
        if (!child.hasOwnProperty('index')) {
            continue;
        }
        let x_coord = child.x / CONFIG.TILEDIM;
        let y_coord = child.y / CONFIG.TILEDIM;
        tile_array3[x_coord][y_coord] = child.index;
    }

    FILE.write_map_file(tile_array0, tile_array1, tile_array2, tile_array3);
}

// fill base level with 32x32 tiles of current index
window.fill0 = () => {
    UNDO.undo_mark_task_start(layer0.container, layer0.sprites);
    for(let i = 0; i < CONFIG.LEVELWIDTH / 32; i++){
        for(let j = 0; j < CONFIG.LEVELHEIGHT / 32; j++){
            let ti = layer0.addTileLevelCoords(i,j,32, g_context.tile_index);
            UNDO.undo_add_index_to_task(ti);
        }
    }
    UNDO.undo_mark_task_end();
}

window.addEventListener(
    "keydown", (event) => {
        if (event.code == 'KeyF'){
            window.fill0();
        }
        else if (event.code == 'KeyS'){
            generate_level_file();
        }
        else if (event.code == 'KeyG'){
            layer0.drawGrid();
            layer1.drawGrid();
            layer2.drawGrid();
            layer3.drawGrid();
            drawGrid(); 
        }
        else if (event.ctrlKey && event.code === 'KeyZ'){
            let undome = UNDO.undo_pop();
            if (!undome) {
                return;
            }
            console.log(undome);
            let lcontainer = undome.shift();
            let lsprites   = undome.shift();
            console.log(undome);
            for(let i = 0; i < undome.length; i++) {
                console.log("removing! ",undome[i])
                lcontainer.removeChild(lsprites[undome[i]]);
                composite.container.removeChild(composite.sprites[undome[i]]);
            }
        }
     }
  );

// Size of tiles we're working with
window.setGridDim = (val) => {
    console.log("setGridDim ",val);
    if(val == 16){
        if(g_context.tileDim == 16) {return;}
        CONFIG.NUM32XTILES /= (val/g_context.tileDim);
        CONFIG.NUM32YTILES /= (val/g_context.tileDim);
        g_context.tileDim = 16; 
        g_context.dimlog = Math.log2(g_context.tileDim); 
        curtiles = tiles16;
        console.log("set to curTiles16");
    }else if (val == 32){
        if(g_context.tileDim == 32) {return;}
        CONFIG.NUM32XTILES /= (val/g_context.tileDim);
        CONFIG.NUM32YTILES /= (val/g_context.tileDim);
        g_context.tileDim = 32; 
        g_context.dimlog = Math.log2(g_context.tileDim); 
        curtiles = tiles32;
        console.log("set to curTiles32");
    }else{
        console.debug("Invalid TileDim!");
    }
 }

// Listen to pointermove on stage once handle is pressed.
function onTilesetDragStart(e)
{
    console.log("onDragStartTileset()");
    tileset.app.stage.eventMode = 'static';
    tileset.app.stage.addEventListener('pointermove', onTilesetDrag);
    
    tileset.dragctx.startx = e.data.global.x;
    tileset.dragctx.starty = e.data.global.y;
    tileset.dragctx.endx = e.data.global.x;
    tileset.dragctx.endy = e.data.global.y;

    tileset.app.stage.addChild(tileset.dragctx.square);

    g_context.selected_tiles = [];
}

// Stop dragging feedback once the handle is released.
function onTilesetDragEnd(e)
{
    console.log("onDragEndTileset()");
    tileset.app.stage.eventMode = 'auto';
    tileset.app.stage.removeEventListener('pointermove', onTilesetDrag);
    tileset.app.stage.removeChild(tileset.dragctx.square);

    let starttilex = Math.floor(tileset.dragctx.startx / g_context.tileDim);
    let starttiley = Math.floor(tileset.dragctx.starty / g_context.tileDim);
    let endtilex = Math.floor(tileset.dragctx.endx / g_context.tileDim);
    let endtiley = Math.floor(tileset.dragctx.endy / g_context.tileDim);

    console.log("sx sy ex ey ",starttilex,",",starttiley,",",endtilex,",",endtiley);
    // let mouse clicked handle if there isn't a multiple tile square
    if(starttilex === endtilex && starttiley === endtiley ){
        return;
    }

    g_context.tile_index = (starttiley * CONFIG.NUM32XTILES) + starttilex;

    let origx = starttilex;
    let origy = starttiley;
    for(let y = starttiley; y <= endtiley; y++){
        for(let x = starttilex; x <= endtilex; x++){
            let squareindex = (y * CONFIG.NUM32XTILES) + x;
            console.log("x,y ",x,",",y);
            console.log("index ",squareindex);
            g_context.selected_tiles.push([x - origx,y - origy,squareindex]);
        }
    }
    tileset.dragctx.square.clear();
}

function onTilesetDrag(e)
{
    console.log("onDragTileset()");
    tileset.dragctx.endx = e.data.global.x;
    tileset.dragctx.endy = e.data.global.y;
    
    tileset.dragctx.square.clear();
    tileset.dragctx.square.beginFill(0xFF3300, 0.3);
    tileset.dragctx.square.lineStyle(2, 0xffd900, 1);
    tileset.dragctx.square.moveTo(tileset.dragctx.startx, tileset.dragctx.starty);
    tileset.dragctx.square.lineTo(tileset.dragctx.endx, tileset.dragctx.starty);
    tileset.dragctx.square.lineTo(tileset.dragctx.endx, tileset.dragctx.endy);
    tileset.dragctx.square.lineTo(tileset.dragctx.startx, tileset.dragctx.endy);
    tileset.dragctx.square.closePath();
    tileset.dragctx.square.endFill();
}

//tileset.app.stage.addChild(tileset.container);

function drawGrid() {

    if (typeof drawGrid.lines == 'undefined') {
        drawGrid.toggle = true;
        drawGrid.lines = [];
        drawGrid.graphics = new PIXI.Graphics();

        let gridsize = g_context.tileDim;
        drawGrid.graphics.lineStyle(1, 0xffffff, 1);

        let index = 0;
        for (let i = 0; i < CONFIG.LEVELWIDTH; i += gridsize) {
            drawGrid.graphics.moveTo(i, 0);
            drawGrid.graphics.lineTo(i, CONFIG.LEVELHEIGHT);
            drawGrid.graphics.moveTo(i + gridsize, 0);
            drawGrid.graphics.lineTo(i + gridsize, CONFIG.LEVELHEIGHT);

            drawGrid.graphics.moveTo(0, i);
            drawGrid.graphics.lineTo(CONFIG.LEVELWIDTH, i);
            drawGrid.graphics.moveTo(0, i + gridsize);
            drawGrid.graphics.lineTo(CONFIG.LEVELWIDTH, i + gridsize);
        }
            drawGrid.graphics3 = drawGrid.graphics.clone();
    }

    if (drawGrid.toggle) {
        tileset.container.addChild(drawGrid.graphics);
        composite.container.addChild(drawGrid.graphics3);
    }else{
        tileset.container.removeChild(drawGrid.graphics);
        composite.container.removeChild(drawGrid.graphics3);
    }
    drawGrid.toggle = !drawGrid.toggle;
}


// --
// Variable placement logic Level1
// --

function onLevelMouseover(e) {
    composite.app.stage.removeChild(composite.circle);
    composite.app.stage.addChild(composite.circle);
}
function onLevelMousemove(e) {
    composite.circle.clear();
    composite.circle.beginFill(0xe50000, 0.5);
    composite.circle.drawCircle(e.data.global.x, e.data.global.y, 3);
    composite.circle.endFill();
}

function onLevelMousedown(layer, e) {
    console.log('Level 0: X', e.data.global.x, 'Y', e.data.global.y);

    let xorig = e.data.global.x;
    let yorig = e.data.global.y;

    if (g_context.selected_tiles.length == 0) {
        let ti = layer.addTileLevelPx(e.data.global.x, e.data.global.y, g_context.tile_index);
        UNDO.undo_add_single_index_as_task(layer.container, layer.container, ti);
    } else {
        let undolist = [];
        UNDO.undo_mark_task_start(layer.container, layer.container);
        for (let index of g_context.selected_tiles) {
            let ti = layer.addTileLevelPx(xorig + index[0] * g_context.tileDim, yorig + index[1] * g_context.tileDim, index[2]);
            UNDO.undo_add_index_to_task(ti);
        }
        UNDO.undo_mark_task_end();
    }
}

// Listen to pointermove on stage once handle is pressed.
function onLevelPointerDown(layer, e)
{
    console.log("onLevelPointerDown()");
    layer.app.stage.eventMode = 'static';
    layer.app.stage.addEventListener('pointermove', onLevelDrag.bind(null, layer, e));

    layer.dragctx.startx0 = e.data.global.x;
    layer.dragctx.starty0 = e.data.global.y;
    layer.dragctx.endx0 = e.data.global.x;
    layer.dragctx.endy0 = e.data.global.y;

    layer.app.stage.addChild(layer.dragctx.square);
}

function onLevelDrag(layer, e)
{
    if(layer.dragctx.startx0 == -1){
        return;
    }

    layer.dragctx.endx0 = e.data.global.x;
    layer.dragctx.endy0 = e.data.global.y;

    console.log("onLevelDrag()");
    
    layer.dragctx.square.clear();
    layer.dragctx.square.beginFill(0xFF3300, 0.3);
    layer.dragctx.square.lineStyle(2, 0xffd900, 1);
    layer.dragctx.square.moveTo(layer.dragctx.startx0, layer.dragctx.starty0);
    layer.dragctx.square.lineTo(layer.dragctx.endx0, layer.dragctx.starty0);
    layer.dragctx.square.lineTo(layer.dragctx.endx0, layer.dragctx.endy0);
    layer.dragctx.square.lineTo(layer.dragctx.startx0, layer.dragctx.endy0);
    layer.dragctx.square.closePath();
    layer.dragctx.square.endFill();
}

// Stop dragging feedback once the handle is released.
function onLevelDragEnd(layer, e)
{
    layer.dragctx.endx0 = e.data.global.x;
    layer.dragctx.endy0 = e.data.global.y;
    if(layer.dragctx.startx0 == -1){
        console.log("onLevelDragEnd() start is -1 bailing");
        return;
    }
    console.log("onLevelDragEnd()");
    layer.app.stage.eventMode = 'auto';
    layer.app.stage.removeChild(layer.dragctx.square);

    let starttilex = Math.floor(layer.dragctx.startx0 / g_context.tileDim);
    let starttiley = Math.floor(layer.dragctx.starty0 / g_context.tileDim);
    let endtilex = Math.floor(layer.dragctx.endx0 / g_context.tileDim);
    let endtiley = Math.floor(layer.dragctx.endy0 / g_context.tileDim);

    console.log("sx ",starttilex," ex ",endtilex);
    console.log("sy ",starttiley," ey ",endtiley);

    // let mouse clicked handle if there isn't a multiple tile square
    if(starttilex === endtilex && starttiley == endtiley ){
        return;
    }

    if (g_context.selected_tiles.length == 0) {
        UNDO.undo_mark_task_start(layer.container, layer.sprites);
        for (let i = starttilex; i <= endtilex; i++) {
            for (let j = starttiley; j <= endtiley; j++) {
                let squareindex = (j * CONFIG.NUM32XTILES) + i;
                let ti = layer.addTileLevelPx(i * g_context.tileDim, j * g_context.tileDim, g_context.tile_index);
                UNDO.undo_add_index_to_task(ti);
            }
        }
        UNDO.undo_mark_task_end();
    } else {
        // figure out selected grid
        let selected_grid = Array.from(Array(64), () => new Array(64)); // FIXME ... hope 64x64 is enough
        let row = 0;
        let column = 0;
        let selected_row = g_context.selected_tiles[0][1];
        // selected_grid[0] = [];
        for (let index of g_context.selected_tiles) {
            // console.log("Selected row ", selected_row, index);
            if(index[1] != selected_row){
                selected_row = index[1];
                console.log("NEW ROW");
                row++;
                column = 0;
                //selected_grid[row] = [];
            }
            selected_grid[column++][row]  = index;
            console.log("Adding to grid ",column-1, row, index);
        }
        // at this point should have a 3D array of the selected tiles and the size should be row, column

        UNDO.undo_mark_task_start(layer.container, layer.sprites);

        let ti=0;
        for (let i = starttilex; i <= endtilex; i++) {
            for (let j = starttiley; j <= endtiley; j++) {
                let squareindex = (j * CONFIG.NUM32XTILES) + i;
                if (j === starttiley) { // first row 
                    if (i === starttilex) { // top left corner
                        console.log("Top left!");
                        ti = layer.addTileLevelPx(i * g_context.tileDim, j * g_context.tileDim, selected_grid[0][0][2]);
                    }
                    else if (i == endtilex) { // top right corner
                        console.log("Top right!");
                        ti = layer.addTileLevelPx(i * g_context.tileDim, j * g_context.tileDim, selected_grid[column - 1][0][2]);
                    } else { // top middle
                        ti = layer.addTileLevelPx(i * g_context.tileDim, j * g_context.tileDim, selected_grid[1][0][2]);
                    }
                } else if (j === endtiley) { // last row
                    if (i === starttilex) { // bottom left corner
                        console.log("Bottom left!");
                        ti = layer.addTileLevelPx(i * g_context.tileDim, j * g_context.tileDim, selected_grid[0][row][2]);
                    }
                    else if (i == endtilex) { // bottom right corner
                        console.log("Bottom right!");
                        ti = layer.addTileLevelPx(i * g_context.tileDim, j * g_context.tileDim, selected_grid[column - 1][row][2]);
                    } else { // bottom middle
                        ti = layer.addTileLevelPx(i * g_context.tileDim, j * g_context.tileDim, selected_grid[1][row][2]);
                    }
                } else { // middle row
                    if (i === starttilex) { // middle left 
                        ti = layer.addTileLevelPx(i * g_context.tileDim, j * g_context.tileDim, selected_grid[0][1][2]);
                    }
                    else if (i === endtilex) { // middle end 
                        ti = layer.addTileLevelPx(i * g_context.tileDim, j * g_context.tileDim, selected_grid[column - 1][1][2]);
                    } else { // middle middle
                        ti = layer.addTileLevelPx(i * g_context.tileDim, j * g_context.tileDim, selected_grid[1][1][2]);
                    }
                }
                UNDO.undo_add_index_to_task(ti);
            }
        }
        UNDO.undo_mark_task_end();
    }

    layer.dragctx.square.clear();

    layer.dragctx.startx0 = -1;
    layer.dragctx.starty0 = -1;
}

function init() {
    // load tileset into a global array of textures for blitting onto levels
    const bt = PIXI.BaseTexture.from(CONFIG.TILESETFILE, {
        scaleMode: PIXI.SCALE_MODES.NEAREST,
    });
    for (let x = 0; x < CONFIG.NUM32XTILES; x++) {
        for (let y = 0; y < CONFIG.NUM32YTILES; y++) {
            tiles32[x + y * CONFIG.NUM32XTILES] = new PIXI.Texture(
                bt,
                new PIXI.Rectangle(x * 32, y * 32, 32, 32),
            );
        }
    }
    for (let x = 0; x < CONFIG.NUM32XTILES * 2; x++) {
        for (let y = 0; y < CONFIG.NUM32YTILES * 2; y++) {
            tiles16[x + y * CONFIG.NUM32XTILES * 2] = new PIXI.Texture(
                bt,
                new PIXI.Rectangle(x * 16, y * 16, 16, 16),
            );
        }
    }
}

init();