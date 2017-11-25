class Sound {
	public static play(resName: string, loops: number = 1)
	{
		let sound: egret.Sound = RES.getRes(resName);
		if (sound) sound.play(0, loops);
	}
}
