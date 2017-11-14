//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

	public constructor() {
		super();
		this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
	}

	private onAddToStage(event: egret.Event) {

		egret.lifecycle.addLifecycleListener((context) => {
			// custom lifecycle plugin

			context.onUpdate = () => {
				//console.log('hello,world')
			}
		})

		egret.lifecycle.onPause = () => {
			egret.ticker.pause();
		}

		egret.lifecycle.onResume = () => {
			egret.ticker.resume();
		}


		//设置加载进度界面
		//Config to load process interface
		let loadingView:layer.ui.LoadingUI = new layer.ui.LoadingUI();
		loadingView.addToStage(this.stage);
		loadingView.configList.push({
			resourceFile: "resource/default.res.json",
			path: "resource/"
		});

		loadingView.groupList = ["preload", "crush"];
		loadingView.load().then(v => {
			loadingView.destroy();
			this.createGameScene();
		}).catch(v => {
			alert('无法读取：'+ v);
		});

	}

	/**
	 * 创建游戏场景
	 * Create a game scene
	 */
	private createGameScene() {
		let sky = new layer.ui.BitmapUI("bg_jpg");
		this.addChild(sky);
		let stageW = this.stage.stageWidth;
		let stageH = this.stage.stageHeight;
		sky.width = stageW;
		sky.height = stageH;

		let topMask = new egret.Shape();
		topMask.graphics.beginFill(0x000000, 0.5);
		topMask.graphics.drawRect(0, 0, stageW, 172);
		topMask.graphics.endFill();
		topMask.y = 33;
		this.addChild(topMask);

		let game = new meshUI();
		game.width = this.stage.stageWidth * .95;
		game.height = this.stage.stageHeight * .5;
		game.x = this.stage.stageWidth * .025;
		game.y = this.stage.stageHeight * 0.2;
		this.addChild(game);

		game.start();

	}

}


