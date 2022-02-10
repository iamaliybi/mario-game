(() => {
	const { ipcRenderer } = require('electron');
	const path = require('path');
	const Player = require('../classes/Player');
	const Platform = require('../classes/Platform');
	const GenericObject = require('../classes/GenericObject');

	const ctx = playground.getContext('2d');

	let animation, width, height, player, platforms, genericObjects, scrollOffset = 0, gravity = 1.5, stillness = true;

	const Keys = {
		top: {
			pressed: false,
		},
		right: {
			pressed: false,
		},
		bottom: {
			pressed: false,
		},
		left: {
			pressed: false,
		},
	};

	const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

	const getRandomNumber = (min, max) => Math.round(Math.random() * (max - min) + min);

	const createImage = url => {
		const img = new Image();
		img.src = path.join(__dirname, '../../assets/' + url);

		return img;
	}

	const loadPlatforms = () => {
		const platformImage = createImage('images/platform.png');
		const platformSmallTallImage = createImage('images/platformSmallTall.png');

		const largeY = height - 125;
		const mediumY = largeY - 276;
		const smallY = height - 276;
		platforms = [
			new Platform({ ctx, image: platformImage, x: -1, y: largeY }),
			new Platform({ ctx, image: platformImage, x: 577, y: largeY }),
			new Platform({ ctx, image: platformImage, x: 1155, y: largeY }),
			new Platform({ ctx, image: platformSmallTallImage, w: 291, h: 277, x: 1445, y: mediumY }),
			new Platform({ ctx, image: platformSmallTallImage, w: 291, h: 277, x: 2200, y: largeY}),
			new Platform({ ctx, image: platformImage, x: 2750, y: largeY}),
			new Platform({ ctx, image: platformImage, x: 3621, y: largeY}),
			new Platform({ ctx, image: platformSmallTallImage, w: 291, h: 277, x: 3911, y: mediumY}),
			new Platform({ ctx, image: platformSmallTallImage, w: 291, h: 277, x: 4781, y: largeY}),
			new Platform({ ctx, image: platformSmallTallImage, w: 291, h: 277, x: 4600, y: largeY}),
		];
	};

	const loadGenericObjects = () => {
		const backgroundImage = createImage('images/background.png');
		const hillsImage = createImage('images/hills.png');

		genericObjects = [
			new GenericObject({ ctx, image: backgroundImage, w: 11643, h: height, x: -1, y: -1 }),
			new GenericObject({ ctx, image: hillsImage, w: 7545, h: 592, x: -1, y: height - 567 })
		];
	};

	const setSizes = (_, [w, h]) => {
		width = w;
		height = h - 48;

		playground.width = width;
		playground.height = height;

		init();
	}

	const init = () => {
		if (animation) cancelAnimationFrame(animation);

		if (player) player.reset();
		else player = player ? player : new Player({ ctx, w: width, h: height, g: gravity });
		player = player ? player : new Player({ ctx, w: width, h: height, g: gravity });
		loadGenericObjects();
		loadPlatforms();
		player.update();
		scrollOffset = 0;

		animate();
	};

	const animate = () => {
		animation = requestAnimationFrame(animate);
		ctx.clearRect(0, 0, width, height);

		genericObjects.forEach(genericObject => {
			genericObject.draw();
		});
		platforms.forEach(platform => {
			platform.draw();
		});
		player.update();

		if (Keys.right.pressed && player.position.x < width / 2) player.velocity.x = player.speed;
		else if ((Keys.left.pressed && player.position.x > width / 10) || (Keys.left.pressed && scrollOffset === 0 && player.position.x > 0)) player.velocity.x = -player.speed;
		else {
			player.velocity.x = 0;

			if (Keys.right.pressed && scrollOffset < 4000) {
				scrollOffset += player.speed;
				platforms.forEach(platform => platform.position.x -= player.speed);
				genericObjects.forEach(genericObject => genericObject.position.x -= player.speed / 2);
			}
			else if (Keys.left.pressed && scrollOffset > 0) {
				scrollOffset -= player.speed;

				platforms.forEach(platform => platform.position.x += player.speed);
				genericObjects.forEach(genericObject => genericObject.position.x += player.speed / 2);
			}
		}

		platforms.forEach(platform => {
			if (
				player.position.y + player.height <= platform.position.y &&
				player.height + player.position.y + player.velocity.y >= platform.position.y &&
				player.position.x + player.width >= platform.position.x &&
				player.position.x <= platform.position.x + platform.width
			) {
				stillness = true;
				player.velocity.y = 0;
			}
		});

		// Win
		if (scrollOffset > 4500) console.log(scrollOffset);

		// Lose
		if (player.position.y > height) init();
	}

	document.addEventListener('keydown', ({ keyCode }) => {
		switch (keyCode) {
			case 32: // top
			case 38:
			case 87:
				if (stillness) player.velocity.y -= 30;
				stillness = false;
				Keys.top.pressed = true;
				break;
			case 39: // right
			case 68:
				player.currentSprite = player.sprites.run.right;
				player.state = 'run';
				Keys.right.pressed = true;
				break;
			case 40: // bottom
			case 83:
				Keys.bottom.pressed = true;
				break;
			case 37: // left
			case 65:
				player.currentSprite = player.sprites.run.left;
				player.state = 'run';
				Keys.left.pressed = true;
				break;
		}
	});

	document.addEventListener('keyup', ({ keyCode }) => {
		switch (keyCode) {
			case 32: // top
			case 38:
			case 87:
				Keys.top.pressed = false;
				break;
			case 39: // right
			case 68:
				player.currentSprite = player.sprites.stand.right;
				player.state = 'stand';
				Keys.right.pressed = false;
				break;
			case 40: // bottom
			case 83:
				Keys.bottom.pressed = false;
				break;
			case 37: // left
			case 65:
				player.currentSprite = player.sprites.stand.left;
				player.state = 'stand';
				Keys.left.pressed = false;
				break;
		}
	});

	ipcRenderer.on('game:ready', setSizes);
})();