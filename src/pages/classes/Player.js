const createImage = url => {
	const img = new Image();
	img.src = '../../assets/images/' + url;

	return img;
}

const Player = class {
	constructor({ ctx, w, h, g }) {
		this.ctx = ctx;
		this.gravity = g;
		this.size = [w, h];

		this.position = {
			x: 100,
			y: 100
		};
		this.velocity = {
			x: 0,
			y: 0
		};
		this.speed = 10;
		this.width = 66;
		this.height = 150;
		this.frames = 0;

		this.sprites = {
			stand: {
				right: createImage('spriteStandRight.png'),
				left: createImage('spriteStandLeft.png'),
				cropWidth: 177,
				width: this.width
			},
			run: {
				right: createImage('spriteRunRight.png'),
				left: createImage('spriteRunLeft.png'),
				cropWidth: 340,
				width: 127.875
			}
		};
		this.currentSprite = this.sprites.stand.right;
		this.currentState = 'stand';
	}

	draw() {
		this.ctx.drawImage(
			this.currentSprite, // image
			this.sprites[this.currentState].cropWidth * this.frames, // sx
			0, // sy
			this.sprites[this.currentState].cropWidth, // sWidth
			400, // sHeight
			this.position.x, // dx
			this.position.y, // dy
			this.sprites[this.currentState].width, // dWidth
			this.height // dHeight
		);
	}

	update() {
		this.frames++;
		if (this.frames > 28) this.frames = 0;

		this.draw();
		this.position.y += this.velocity.y;
		this.position.x += this.velocity.x;
		if (this.position.y + this.velocity.y + this.height <= this.size[1]) {
			this.velocity.y += this.gravity;
		}
	}

	reset() {
		this.velocity = { x: 0, y: 0 };
		this.position = { x: 100, y: 100 };
		this.speed = 10;
		this.frames = 0;
	}

	set state(val) {
		this.currentState = val;
		this.width = this.sprites[val].width;
	}
};

module.exports = Player;