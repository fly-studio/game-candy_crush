namespace pages {
	export abstract class BasePage extends layer.ui.Sprite {

		public constructor() {
			super();

			this.getStage().removeChildren();

			this.load()
		}

		private load(): Promise<any> {
			return this.loading(this.groupList);
		}

		protected abstract get groupList() : string[];

		public abstract nextPage();

		public onRemovedFromStage(event: egret.Event): void {
			this.removeAllEventListeners();
			this.groupList.forEach(v => RES.destroyRes(v));
		}

		public async loading(groupList: string[], configList: layer.ui.ResourceConfig[] = []) : Promise<any> {
			let loadingView: ui.LoadingUI = new ui.LoadingUI();
            loadingView.addGroupNames(...groupList).addConfigFiles(...configList).addToStage(this.stage)

            try {
                await loadingView.load()
                loadingView.destroy();
                // 等待load结束，将本page加入到stage中
				this.addToStage();
            } catch (error) {
				alert('无法读取：'+ error);
            }
		}
	}
}
