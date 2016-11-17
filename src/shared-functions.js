function getTilesImage(tiles, colors){
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	canvas.width = 50;
	canvas.height = 50;

	var space = 0.5;
	// ctx.fillStyle = "#000";
	// ctx.fillRect(0, 0, (50 + space), (50 + space));
	ctx.fillStyle = "#f0f0f0";
	colors.push(defaultColor);

	for(var i = 0; i < 25; i++){
		var x = (i % 5)*10 + (space * (i%5)) + space;
		var y = Math.floor(i / 5)*10 + space;
		id = i + 1;
		// var defaultColor = i%2 == 0 ? "#f0f0f0" : "#eee";
		var defaultColor = "#eee";

		if(tiles && tiles.length, tiles.length){
			var tile = tiles[i];
			var fillColor = getTileBg(colors, tile.owner, tile.locked, defaultColor);
		}else{
			// var p1 = [7, 8, 9, 12, 13, 14, 17, 18, 19];
			var p1 = [6, 7, 8, 12, 13];
			var p2 = [9, 14, 18, 19];
			if(p1.indexOf(i + 1) != -1)
				fillColor = colors[0];
			else if(p2.indexOf(i + 1) != -1)
				fillColor = colors[1];
			else
				fillColor = colors[Math.floor(Math.random() * colors.length)];
				// fillColor = defaultColor;
		}

		ctx.fillStyle = fillColor;
		ctx.fillRect(x, y, (10 - space), (10 - space));
	}

	colors.splice(2, 1);

	return canvas.toDataURL();
	// return canvas;
}

function getTileBg(colors, owner, locked, defaultColor){
	if(owner >= 0){
		var color = colors[owner];

		if(!locked)
			return color;
		else{
			return tinycolor(color).darken(20).toHexString();
		}
	}else{
		return defaultColor;
	}
}

function shadeColor(color, percent) {
	percent = percent || -20;
	if(color[0] == "#")
		color = color.substr(1, color.length - 1);


    var num = parseInt(color,16),
        amt = Math.round(2.55 * percent),
        R = (num >> 16) + amt,
        B = (num >> 8 & 0x00FF) + amt,
        G = (num & 0x0000FF) + amt;

    return "#" + (0x1000000 + (R<255?R<1?0:R:255)*0x10000 + (B<255?B<1?0:B:255)*0x100 + (G<255?G<1?0:G:255)).toString(16).slice(1);
}