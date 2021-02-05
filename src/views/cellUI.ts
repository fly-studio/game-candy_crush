namespace ui {
	export class CellUI extends layer.ui.Sprite {
		public cell:Cell = null;
		public _selected:boolean = false;
		private selectedSharp: egret.Shape = null;
		private touchPoint: egret.Point = null;

		constructor(cell: Cell) {
			super();
			this.cell = cell;
			this.touchPoint = new egret.Point();
		}

		public set selected(value: boolean) {
			if (this.cell.block) return;
			this.selectedSharp.visible = value;
		}

		public set text(value: string) {
			let text: egret.TextField = this.getChildByName('index') as egret.TextField;
			text.text = value;
			if (value == 'DEBUG')
				text.text = DEBUG ? this.cell.index.toString() + "\n" + this.cell.row.toString() + "/" + this.cell.col.toString() : '';
		}

		// 渲染cell的框框和里面的sprite
		private render() : void {
			if (this.width <= 0 || this.height <= 0)
				throw new Error('CellUI Set width/height first.');
			if (this.cell.block)
				return;

			this.removeChildren();
			this.graphics.clear();

			if (!isNaN(this.cell.color)) { //色块
				this.graphics.beginFill(this.cell.color);
				this.graphics.drawRoundRect(0, 0, this.width, this.height, 5);
				this.graphics.endFill();
			} else if (typeof this.cell.color == 'string') { // 位图名称
				let bitmap:layer.ui.BitmapUI = new layer.ui.BitmapUI(this.cell.color);
				bitmap.x = 8;
				bitmap.y = 8;
				bitmap.width = this.width - 16;
				bitmap.height = this.height - 16;
				this.addChild(bitmap);
			} else if (this.cell.color instanceof Function) { // 回调函数，自行制作sprite
				this.cell.color(this, this.cell);
			}

			let text:egret.TextField = new egret.TextField;
			text.y = 10;
			text.name = 'index';
			text.textColor = 0x0;
			text.width = this.width;
			text.wordWrap = true;
			text.textAlign = egret.HorizontalAlign.CENTER;
			this.addChild(text);
			this.text = 'DEBUG';

			this.selectedSharp = new egret.Shape;
			this.selectedSharp.graphics.lineStyle(4, 0x00ffff);
			this.selectedSharp.graphics.drawRoundRect(0, 0, this.width, this.height, 5);
			this.selectedSharp.graphics.endFill();
			this.selectedSharp.visible = false;
			this.addChild(this.selectedSharp);
		}

		public onAddedToStage(event: egret.Event) : void {

			this.render();

			this.addEventListener(CellEvent.CELL_SELECT, this.triggerChildren, this);
			this.addEventListener(CellEvent.CELL_UNSELECT, this.triggerChildren, this);
			this.addEventListener(CellEvent.CELL_CHANGE, this.triggerChildren, this);
		}

		public onRemovedFromStage(event: egret.Event): void {
			this.removeAllEventListeners();
			this.cell = null; //避免内存泄露
		}

		public removeAllEventListeners(): void {
			this.removeEventListener(CellEvent.CELL_SELECT, this.triggerChildren, this);
			this.removeEventListener(CellEvent.CELL_UNSELECT, this.triggerChildren, this);
			this.removeEventListener(CellEvent.CELL_CHANGE, this.triggerChildren, this);
		}

		/**
		 * 上面的cell补充下面的cell, 从上往下掉的动画
		 * 注意: cellindex 在这函数执行前就已经被修改了
		 */
		public moveTo(duration:number, ...args: egret.Point[]) : Promise<any> {
			//let dfd : DeferredPromise = new DeferredPromise;
			return new Promise<any>((resolve, reject) => {
				let tween: egret.Tween = egret.Tween.get(this);
				args.forEach(p => tween = tween.to({x: p.x, y: p.y}, duration));
				tween.call(() => {
					this.text = 'DEBUG';
					resolve(null);
				}, this)
			});
		}

		/**
		 * 被消除动画
		 * @param duration
		 */
		public fadeOut(duration: number) : Promise<any> {
			this.removeChildren();
			this.graphics.clear();
			let factory: egret.MovieClipDataFactory = new egret.MovieClipDataFactory(RES.getRes('disappear_json'), RES.getRes('disappear_png'));
			let data: egret.MovieClipData = factory.generateMovieClipData('crushing');
			// duration / frameCount = 1000 / frameRate == 每帧时间
			data.frameRate = data.frames.length * 1000 / duration; // 重新计算帧率
			let mc: egret.MovieClip = new egret.MovieClip(data);
			mc.x = this.width / 2;
			mc.y = this.height / 2;
			mc.width = this.width;
			mc.height = this.height;
			this.addChild(mc);

			return new Promise<any>((resolve, reject) => {
				mc.once(egret.Event.COMPLETE, () => {
					resolve(null);
				}, this);
				mc.gotoAndPlay('disappear', 1);
			});
		}

		public onTouchBegin(event: egret.TouchEvent) {
			if (!this.cell || this.cell.block) return;
			//console.log('touch-begin:', this.cell.index);

			this.touchPoint.x = event.stageX;
			this.touchPoint.y = event.stageY;
		}

		public onTouchEnd(event: egret.TouchEvent) {
			if (!this.cell || this.cell.block) return;

			let _position: POSITION = position(this.touchPoint, new egret.Point(event.stageX, event.stageY));
			console.log('touch-drag: ', this.cell.index, 'direction: ', _position);

			let cellEvent = new CellEvent(CellEvent.CELL_DRAG, true);
			cellEvent.cell = this.cell;
			cellEvent.position = _position;
			this.parent.dispatchEvent(cellEvent);
		}

		public onTouchTap(event: egret.TouchEvent) {
			if (!this.cell || this.cell.block) return;

			console.log('touch-tap: ', this.cell.index);

			let cellEvent = new CellEvent(CellEvent.CELL_TAP, true);
			cellEvent.cell = this.cell;
			this.parent.dispatchEvent(cellEvent);
		}

		public triggerChildren(event: CellEvent) {
			for(let i = 0; i < this.numChildren; ++i) {
				this.getChildAt(i).dispatchEvent(event)
			}
		}

	}
}
