let browser = undefined;
let rageWindow = {
	width: 0,
	height: 0
}
let playerZoom = 1;
let browserReady = false;

mp.events.add('playerReady', () => {
	mp.game.ui.setRadarZoom(playerZoom);
	browser = mp.browsers.new("package://bigmap/example.html");
});

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
    return minimap;
}

// M Key
mp.keys.bind(0x4D, true, function() {
	switch(playerZoom++) {
		case 1: { /* minimap zoom bigger */
			mp.game.ui.setRadarZoom(1000);
			break;
		}
		case 2: { /* bigmap appears */
			mp.game.ui.setRadarBigmapEnabled(true, false);
			break;
		}
		case 3: { /* reset to normal GTA V Minimap */
			mp.game.ui.setRadarBigmapEnabled(false, false);
			mp.game.ui.setRadarZoom(1);
			playerZoom = 1;
			break;
		}
	}
});

mp.events.add('BROWSER_READY', () => {
	const minimapData = getMinimapAnchor();
	rageWindow = {
		width: mp.game.graphics.getActiveScreenResolution(0, 0).x,
		height: mp.game.graphics.getActiveScreenResolution(0, 0).y
	}

	browser.call("SET_MINIMAP_WIDTH_AND_LEFT", minimapData.width * rageWindow.width, minimapData.leftX * rageWindow.width);
	browserReady = true;
})

mp.events.add('render', () => {
	if (!browserReady) return;

	if (mp.game.graphics.getScreenActiveResolution(0, 0).x != rageWindow.width || mp.game.graphics.getScreenActiveResolution(0, 0).y != rageWindow.height) {
        rageWindow.width = mp.game.graphics.getScreenActiveResolution(0, 0).x;
        rageWindow.height = mp.game.graphics.getScreenActiveResolution(0, 0).y;

        const minimapData = getMinimapAnchor();
        browser.call('SET_MINIMAP_WIDTH_AND_LEFT', minimapData.width * rageWindow.width, minimapData.leftX * rageWindow.width);
    }
});