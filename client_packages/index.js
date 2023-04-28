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

mp.keys.bind(0x4D, true, function() {
	switch(playerZoom++) {
		case 1: { /* minimap zoom bigger */
			mp.game.ui.setRadarZoom(1000);
			break;
		}
		case 2: { /* bigmap appears */
			mp.game.ui.setRadarBigmapEnabled(true, false);
			browser.execute(`minimapZoom(1)`);
			break;
		}
		case 3: { /* reset to normal GTA V Minimap */
			mp.game.ui.setRadarBigmapEnabled(false, false);
			mp.game.ui.setRadarZoom(1);
			browser.execute(`minimapZoom(0)`);
			playerZoom = 1;
			break;
		}
	}
});