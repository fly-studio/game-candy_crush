namespace pages {
	export abstract class Page extends layer.ui.Sprite {

		public constructor() {
			super();

			this.getStage().removeChildren();

			this.loading(this.groupList);
		}

		protected abstract get groupList() : string[];

		public abstract nextPage();

		public onRemovedFromStage(event: egret.Event): void {
			this.removeAllEventListeners();
			this.groupList.forEach(v => RES.destroyRes(v));
		}

		public loading(groupList: string[], configList: layer.ui.ResourceConfig[] = []) : void {
			let loadingView: ui.LoadingUI = new ui.LoadingUI();
			loadingView.addToStage();

			loadingView.configList = configList;
			loadingView.groupList = groupList;
			loadingView.load().then(v => {
				loadingView.destroy();
				this.addToStage();
			}).catch(v => {
				alert('无法读取：'+ v);
			});
		}
	}
}
