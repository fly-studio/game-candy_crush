class CellUI extends layer.ui.Sprite {
	public cell:Cell;
	public _selected:boolean;
	private selectedSharp: egret.Shape;
	private touchPoint: egret.Point;

	constructor(cell: Cell) {
		super();
		this.cell = cell;
		this.touchPoint = new egret.Point();

		this.touchEnabled = true;
	}

	public set selected(value: boolean) {
		if (this.cell.block) return;
		this.selectedSharp.visible = value;
	}

	private render() : void {
		if (this.width <= 0 || this.height <= 0)
			throw new Error('Set width/height first.');
		if (this.cell.block)
			return;

		this.removeChildren();

		this.graphics.clear();
		this.graphics.beginFill(this.cell.color);
		this.graphics.drawRoundRect(0, 0, this.width, this.height, 5);
		this.graphics.endFill();
		
		let text:egret.TextField = new egret.TextField;
		text.name = 'index';
		text.textColor = 0xffffff;
		text.text = this.cell.index.toString() + "\n" + this.cell.row.toString() + "/" + this.cell.col.toString();
		text.width = this.width;
		text.wordWrap = true;
		text.textAlign = egret.HorizontalAlign.CENTER;
		this.addChild(text);

		this.selectedSharp = new egret.Shape;
		this.selectedSharp.graphics.lineStyle(4, 0x00ffff);
		this.selectedSharp.graphics.drawRoundRect(0, 0, this.width, this.height, 5);
		this.selectedSharp.graphics.endFill();
		this.selectedSharp.visible = false;
		this.addChild(this.selectedSharp);
	}

	public onAddedToStage(event: egret.Event) : void {
		this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
		//this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
		this.addEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEnd, this);
		this.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);

		this.render();
	}

	public onRemovedFromStage(event: egret.Event): void {
		this.removeAllEventListeners();
	}

	public removeAllEventListeners(): void {
		this.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.onTouchBegin, this);
		//this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.onTouchMove, this);
		this.removeEventListener(egret.TouchEvent.TOUCH_RELEASE_OUTSIDE, this.onTouchEnd, this);
		this.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onTouchTap, this);
	}

	public moveTo(duration:number, ...args: egret.Point[]) : Promise<any> {
		//let dfd : DeferredPromise = new DeferredPromise;
		return new Promise<any>((resolve, reject) => {
			let tween: egret.Tween = egret.Tween.get(this, {
				loop: false,
			});
			args.forEach(p => tween = tween.to({x: p.x, y: p.y}, duration));
			tween.call(() => {
				let text: egret.TextField = this.getChildByName('index') as egret.TextField;
					text.text = this.cell.index.toString() + "\n" + this.cell.row.toString() + "/" + this.cell.col.toString();
				resolve();
			}, this)
		});
	}

	public fadeOut(duration: number) : Promise<any> {
		this.removeChildren();
		this.graphics.clear();
		let factory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(RES.getRes('disappear_json'), RES.getRes('disappear_png'));
		let data: egret.MovieClipData = factory.generateMovieClipData('crushing');
		// duration / frameCount = 1000 / frameRate == 每帧时间
		// frameRate * duration = 1000 * frameCount
		data.frameRate = data.frames.length * 1000 / duration; // 重新计算帧率
		let mc: egret.MovieClip = new egret.MovieClip(data);
		mc.x = this.width / 2; mc.y = this.height / 2;
		mc.width = this.width;
		mc.height = this.height;
		this.addChild(mc);
		return new Promise<any>(resolve => {
			mc.once(egret.Event.COMPLETE, () => {
				resolve();
			}, this);
			mc.gotoAndPlay('disappear', 1);
		}).then(() => {
			this.destroy();
		});
	}

	public onTouchBegin(event: egret.TouchEvent) {
		if (this.cell.block) return;
		//console.log('touch-begin:', this.cell.index);

		this.touchPoint.x = event.stageX;
		this.touchPoint.y = event.stageY;
	}

	public onTouchEnd(event: egret.TouchEvent) {
		if (this.cell.block) return;

		console.log('touch-drag:', this.cell.index);

		let position:layer.sharp.POSITION = layer.sharp.position(this.touchPoint, new egret.Point(event.stageX, event.stageY));
		console.log('direction:', position);

		let cellEvent = new CellEvent(CellEvent.CELL_DRAG, true);
		cellEvent.cell = this.cell;
		cellEvent.position = position;
		this.parent.dispatchEvent(cellEvent);
	}

	public onTouchTap(event: egret.TouchEvent) {
		if (this.cell.block) return;

		console.log('touch-tap:', this.cell.index);

		let cellEvent = new CellEvent(CellEvent.CELL_SELECT, true);
		cellEvent.cell = this.cell;
		this.parent.dispatchEvent(cellEvent);
	}
}