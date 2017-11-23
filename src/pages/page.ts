abstract class Page extends layer.ui.Sprite {

	public constructor() {
		super();

		this.getStage().removeChildren();
	}

	public abstract nextPage();

	public loading(groupList: string[], configList: layer.ui.ResourceConfig[] = []) : void {
		let loadingView:layer.ui.LoadingUI = new layer.ui.LoadingUI();
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
