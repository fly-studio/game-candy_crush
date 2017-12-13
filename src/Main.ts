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

class Main extends eui.UILayer  {

	public constructor() {
		super();
	}

	protected createChildren() {
		super.createChildren();

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

		//inject the custom material parser
		layer.adapter.registerEUI();

		//设置加载进度界面
		//Config to load process interface
		let loadingView: layer.ui.LoadingUI = new layer.ui.LoadingUI();
		loadingView.configList.push({
			resourceFile: "resource/default.res.json",
			path: "resource/"
		});
		loadingView.groupList = ["preload"];
		loadingView.addToStage(this.stage);
		loadingView.load().then(v => {
			let loadingView1 = new ui.LoadingUI();
			loadingView1.addToStage(this.stage);
			
			loadingView1.themeList = ['resource/default.thm.json'];
			loadingView1.groupList = ["eui", "game", "fonts", "metro", "sound", "crush", "countdown"];
			loadingView1.load().then(v => {
				this.createGameScene();
			}).catch(v => {
				alert('无法读取：'+ v);
			});
		});
	}

	/**
	 * 创建游戏场景
	 * Create a game scene
	 */
	private createGameScene() {
		if (window.location.hash == '#rank')
			new pages.RankPage();
		else
			new pages.LoginPage();
	}

}


