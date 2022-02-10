const Platform = class {
	constructor({ ctx, image, w = 580, h = 125, x, y }) {
		this.ctx = ctx;
		this.image = image;

		this.position = { x, y };

		this.width = w;
		this.height = h;
	}

	draw() {
		this.ctx.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
	}
};

module.exports = Platform;