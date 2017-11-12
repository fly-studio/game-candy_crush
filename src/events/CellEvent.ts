class CellEvent extends egret.TouchEvent {
	public cellIndex: number = -1;

	public static createFrom(event: egret.TouchEvent) {
		return event as CellEvent;
		//let self = new CellEvent(event.type, event.bubbles, event.cancelable, event.stageX, event.stageY, event.touchPointID);
		
		//_.deepExtends(self, {...event});
		//return self;
	}
}