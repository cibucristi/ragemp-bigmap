/**
 * Copyright @ iamCibu (youtube.com/iamCibu)
 * Bigmap - With this resource you can zoom the minimap like in GTA:O and also detect if the bigmap is shown to modify the CEF Position.
 */

let browser = null;

mp.events.add('playerReady', () => {
	mp.game.ui.setRadarZoom(1);

	browser = mp.browsers.new("package://example.html");
});

let playerZoom = 1;

function getMinimapAnchor() {
    let sfX = 1.0 / 20.0;
    let sfY = 1.0 / 20.0;
    let safeZone = mp.game.graphics.getSafeZoneSize();
    let aspectRatio = mp.game.graphics.getScreenAspectRatio(false);
    let resolution = mp.game.graphics.getScreenActiveResolution(0, 0);
    let scaleX = 1.0 / resolution.x;
    let scaleY = 1.0 / resolution.y;

    let minimap = {
        width: scaleX * (resolution.x / (4 * aspectRatio)),
        height: scaleY * (resolution.y / 5.674),
        scaleX: scaleX,
        scaleY: scaleY,
        leftX: scaleX * (resolution.x * (sfX * (Math.abs(safeZone - 1.0) * 10))),
        bottomY: 1.0 - scaleY * (resolution.y * (sfY * (Math.abs(safeZone - 1.0) * 10))),
    };

    minimap.rightX = minimap.leftX + minimap.width;
    minimap.topY = minimap.bottomY - minimap.height;

	if (status_bigmap == true) {
		minimap.width = minimap.width * 1.6;
		minimap.rightX = minimap.rightX * 1.6;
	}
    return minimap;
}

let status_bigmap = false;

setInterval(() => {
	//getMinimapAnchor();
	mp.gui.chat.push(JSON.stringify(getMinimapAnchor()));
	browser.call("SET_MINIMAP_LEFT", getMinimapAnchor().rightX);
	browser.call("SET_MINIMAP_WIDTH", getMinimapAnchor().width);
	browser.call("SET_MINIMAP_BOTTOM", getMinimapAnchor().bottomY);
}, 500);

mp.keys.bind(0x4D, true, function() {
	switch(playerZoom++) {
		case 1: { /* minimap zoom bigger */
			mp.game.ui.setRadarZoom(1000);
			break;
		}
		case 2: { /* bigmap appears */
			mp.game.ui.setRadarBigmapEnabled(true, false);
			browser.execute(`minimapZoom(1)`);
			status_bigmap = true;
			break;
		}
		case 3: { /* reset to normal GTA V Minimap */
			mp.game.ui.setRadarBigmapEnabled(false, false);
			mp.game.ui.setRadarZoom(1);
			browser.execute(`minimapZoom(0)`);
			playerZoom = 1;
			status_bigmap = false;
			break;
		}
	}
});

mp.events.add("consoleCommand", (command) => {
	if (command != 'reloadmap') return;
	browser.destroy();
	browser = mp.browsers.new("package://example.html");
});