// ==UserScript==
// @name        Maelstrom ADDON Basescanner
// @namespace   a
// @description Maelstrom ADDON Basescanner
// @include     http*://prodgame*.alliances.commandandconquer.com/*
// @version     0.1
// @author      BlinDManX
// ==/UserScript==
unsafeWindow.__msbs_version = 0.1;
(function () {
	var MaelstromTools_Basescanner = function () {
		try {
			console.log("Maelstrom_Basescanner " + window.__msbs_version + " loaded");
			var MT_Lang = null;
			var MT_Cache = null;
			var MT_Base = null;
			var fileManager = null;
			var rowData = null;
			var lastid = 0;
			var countlastidchecked = 0;

			function createMaelstromTools_Basescanner() {
				console.log("Maelstrom_Basescanner initalisiert");
				fileManager = ClientLib.File.FileManager.GetInstance();
				MT_Lang = window.MaelstromTools.Language.getInstance();
				MT_Cache = window.MaelstromTools.Cache.getInstance();
				MT_Base = window.MaelstromTools.Base.getInstance();
				var l = MT_Lang.Languages.indexOf(qx.locale.Manager.getInstance().getLocale());
				if(l >= 0) { //TODO other Languages
					MT_Lang.Data["Point"] = ["Position", "Position", "Position"][l]; //[eng] = [de,pl,fr]
					MT_Lang.Data["BaseScanner Overview"] = ["Basescanner Übersicht", "Visão geral do scanner de base", "Aperçu du scanner de base"][l]; //[eng] = [de,pt,fr]
					MT_Lang.Data["Scan"] = ["Scannen", "Esquadrinhar", "Balayer"][l]; //[eng] = [de,pl,fr]
					MT_Lang.Data["Location"] = ["Lage", "localização", "Emplacement"][l]; //[eng] = [de,pl,fr]
					MT_Lang.Data["Player"] = ["Spieler", "Jogador", "Joueur"][l]; //[eng] = [de,pl,fr]
					MT_Lang.Data["Bases"] = ["Basen", "Bases", "Bases"][l]; //[eng] = [de,pl,fr]
					MT_Lang.Data["Stock,Outpost"] = ["Lager,Vorposten", "Estoque,posto avançado", "Stock,avant-poste"][l]; //[eng] = [de,pl,fr]
					
					
				}
				MT_Base.createNewImage("BaseScanner", "ui/icons/icon_item.png", fileManager);
				MT_Base.createNewWindow("BaseScanner", "L", 120, 60, 870, 400);
				var openBaseScannerOverview = MT_Base.createDesktopButton(MT_Lang.gt("BaseScanner Overview"), "BaseScanner", false, MT_Base.desktopPosition(2));
				openBaseScannerOverview.addListener("execute", function () {
					window.HuffyTools.BaseScannerGUI.getInstance().openWindow("BaseScanner", MT_Lang.gt("BaseScanner Overview"));
				}, this);
				MT_Base.addToMainMenu("BaseScanner", openBaseScannerOverview);
				// define HuffyTools.BaseScannerGUI
				qx.Class.define("HuffyTools.BaseScannerGUI", {
					type: "singleton",
					extend: MaelstromTools.DefaultObject,
					members: {
						HT_Tables: null,
						HT_Models: null,
						HT_Options: null,
						upgradeInProgress: null,
						scanButton: null,
						runloop: null,
						CitySelect: null,
						HT_ShowBase: null,						
						init: function () {
							try {								
								this.upgradeInProgress = false;
								this.createTable();
								this.createOptions();							
								if(this.rowData == null) {
									this.rowData = [];
								}
								
								this.Window.setPadding(0);
								
								this.Window.set({
									resizable: true
								});
								this.Window.removeAll();
								this.Window.add(this.HT_Options);
								this.Window.add(this.HT_Tables);
								this.Window.addListener("close", window.HuffyTools.BaseScannerGUI.getInstance().closeCallback);
							} catch(e) {
								console.log("HuffyTools.BaseScannerGUI.init: ", e);
							}
						},
						createTable: function () {
							try {
								this.HT_Models = new qx.ui.table.model.Simple();
								this.HT_Models.setColumns(["ID", "LoadState", MT_Lang.gt("City"), MT_Lang.gt("Location"), MT_Lang.gt("Level"), MT_Lang.gt(MaelstromTools.Statics.Tiberium), MT_Lang.gt(MaelstromTools.Statics.Crystal), MT_Lang.gt(MaelstromTools.Statics.Dollar), MT_Lang.gt(MaelstromTools.Statics.Research)]);
								this.HT_Tables = new qx.ui.table.Table(this.HT_Models);
								this.HT_Tables.setColumnVisibilityButtonVisible(false);
								this.HT_Tables.setColumnWidth(0, 0);
								this.HT_Tables.setColumnWidth(1, 0);
								this.HT_Tables.setColumnWidth(2, 120);
								this.HT_Tables.setColumnWidth(3, 70);
								this.HT_Tables.setColumnWidth(4, 50);
								this.HT_Tables.setColumnWidth(5, 70);
								this.HT_Tables.setColumnWidth(6, 70);
								this.HT_Tables.setColumnWidth(7, 70);
								this.HT_Tables.setColumnWidth(8, 70);
								var tcm = this.HT_Tables.getTableColumnModel();
								tcm.setColumnVisible(0, false);
								tcm.setColumnVisible(1, false);
								// tcm.setDataCellRenderer(4, new qx.ui.table.cellrenderer.Number().set({
								// numberFormat: new qx.util.format.NumberFormat().set({
								// maximumFractionDigits: 2,
								// minimumFractionDigits: 2
								// })
								// }));
								tcm.setDataCellRenderer(5, new HuffyTools.ReplaceRender().set({
									ReplaceFunction: this.formatTiberiumAndPower
								}));
								tcm.setDataCellRenderer(6, new HuffyTools.ReplaceRender().set({
									ReplaceFunction: this.formatTiberiumAndPower
								}));
								tcm.setDataCellRenderer(7, new HuffyTools.ReplaceRender().set({
									ReplaceFunction: this.formatTiberiumAndPower
								}));
								tcm.setDataCellRenderer(8, new HuffyTools.ReplaceRender().set({
									ReplaceFunction: this.formatTiberiumAndPower
								}));
								this.HT_Tables.addListener("cellDblclick", function (e) {
									window.HuffyTools.BaseScannerGUI.getInstance().cellDoubleClickCallback(e)
								}, this);
							} catch(e) {
								console.log("HuffyTools.BaseScannerGUI.createTable: ", e)
							}
						},
						cellDoubleClickCallback: function (e) {
							try {
								var cityId = this.rowData[e.getRow()][0];
								var posData = this.rowData[e.getRow()][3];
								/* center screen */
								if(posData != null && posData.split(':').length == 2) {
									var posX = parseInt(posData.split(':')[0]);
									var posY = parseInt(posData.split(':')[1]);
									ClientLib.Vis.VisMain.GetInstance().CenterGridPosition(posX, posY);
								}
								/* and highlight base */
								if(cityId) {
									ClientLib.Data.MainData.GetInstance().get_Cities().set_CurrentCityId(cityId);
									//webfrontend.gui.UtilView.openCityInMainWindow(cityId);
								}
							} catch(ex) {
								console.log("HuffyTools.BaseScannerGUI cellDoubleClickCallback error: ", ex);
							}
						},
						closeCallback: function (e) {
							/* cancel scanning */
							this.runloop = false;
						},
						CBChanged: function (e) {
							this.upgradeInProgress = false;
							this.runloop = false;							
						},
						formatTiberiumAndPower: function (oValue) {
							return webfrontend.gui.Util.formatNumbersCompact(oValue);
						},
						updateCache: function () {
							try {
								//
							} catch(e) {
								console.log("HuffyTools.BaseScannerGUI.updateCache: ", e);
							}
						},
						setWidgetLabels: function () {
							try {
								if(!this.HT_Models) {
									this.init();
								}
								//this.HT_Models.setData([]);							
								this.HT_Models.setData(this.rowData);
							} catch(e) {
								console.log("HuffyTools.BaseScannerGUI.setWidgetLabels: ", e)
							}
						},
						createOptions: function () {
							var oBox = new qx.ui.layout.Flow();
							var oOptions = new qx.ui.container.Composite(oBox);
							oOptions.setMargin(5);
					
							this.CitySelect = new qx.ui.form.SelectBox();						
							for(var cname in MT_Cache.Cities) {
								var item = new qx.ui.form.ListItem( cname , null, MT_Cache.Cities[cname].Object );									
								this.CitySelect.add(item);	
								
								if(MaelstromTools.LocalStorage.get("MS_Basescanner_LastCityID") == MT_Cache.Cities[cname].Object.get_Id() ){
									this.CitySelect.setSelection([item]);			
								}															
							}
							oOptions.add(this.CitySelect);
							
							this.scanButton = new qx.ui.form.Button(MT_Lang.gt("Scan")).set({
								appearance: "button-text-small",
								width: 200,
								minWidth: 200,
								maxWidth: 300
							});
							this.scanButton.addListener("execute", function () {
								this.rowData = [];
								this.scan()
							}, this);
							
							oOptions.add(this.scanButton, {
								left: 10,
								top: 10
							});
							this.HT_ShowBase = new Array();
							this.HT_ShowBase[0] = new qx.ui.form.CheckBox(MT_Lang.gt("Player"));
							this.HT_ShowBase[0].setMargin(5);
							this.HT_ShowBase[0].setTextColor("white");
							this.HT_ShowBase[0].setValue(MaelstromTools.LocalStorage.get("MS_Basescanner_Show0", false));
							oOptions.add(this.HT_ShowBase[0], {
								left: 10, 
								top: 10
							});
							this.HT_ShowBase[1] = new qx.ui.form.CheckBox(MT_Lang.gt("Bases"));
							this.HT_ShowBase[1].setMargin(5);
							this.HT_ShowBase[1].setTextColor("white");
							this.HT_ShowBase[1].setValue(MaelstromTools.LocalStorage.get("MS_Basescanner_Show1", false));
							oOptions.add(this.HT_ShowBase[1], {
								left: 10, 
								top: 10
							});
							this.HT_ShowBase[2] = new qx.ui.form.CheckBox(MT_Lang.gt("Stock,Outpost"));
							this.HT_ShowBase[2].setMargin(5);
							this.HT_ShowBase[2].setTextColor("white");
							this.HT_ShowBase[2].setValue(MaelstromTools.LocalStorage.get("MS_Basescanner_Show2", true));
							oOptions.add(this.HT_ShowBase[2], {
								left: 10, 
								top: 10
							});
							
							
							
							this.HT_Options = oOptions;
						},
						scan: function () {
							try {
								this.upgradeInProgress = true;
								var allCities = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d;
								this.rowData = [];
								var selectedBase = this.CitySelect.getSelection()[0].getModel();
								
								MaelstromTools.LocalStorage.set("MS_Basescanner_LastCityID", selectedBase.get_Id() );
								
								var c1 =this.HT_ShowBase[0].getValue();
								var c2 =this.HT_ShowBase[1].getValue();
								var c3 =this.HT_ShowBase[2].getValue();
								
								MaelstromTools.LocalStorage.set("MS_Basescanner_Show0", c1);
								MaelstromTools.LocalStorage.set("MS_Basescanner_Show1", c2);
								MaelstromTools.LocalStorage.set("MS_Basescanner_Show2", c3);
								
								var posX = selectedBase.get_PosX();
								var posY = selectedBase.get_PosY();
								var scanX = 0;
								var scanY = 0;
								var world = ClientLib.Data.MainData.GetInstance().get_World();
								console.log("Scanning from: " + selectedBase.get_Name());
								var maxAttackDistance = ClientLib.Data.MainData.GetInstance().get_Server().get_MaxAttackDistance();
								for(scanY = posY - Math.floor(maxAttackDistance + 1); scanY <= posY + Math.floor(maxAttackDistance + 1); scanY++) {
									for(scanX = posX - Math.floor(maxAttackDistance + 1); scanX <= posX + Math.floor(maxAttackDistance + 1); scanX++) {
										var distX = Math.abs(posX - scanX);
										var distY = Math.abs(posY - scanY);
										var distance = Math.sqrt((distX * distX) + (distY * distY));
										if(distance <= maxAttackDistance) {
											var object = world.GetObjectFromPosition(scanX, scanY);
											var loot = new Object();
											if(object && !object.isLocked) {
												//console.log(object);
												if(object.Type == 1 && c1) { //User
													this.rowData.push([object.Id, - 1, object.Name, scanX + ":" + scanY, object.Level, 0, 0, 0, 0]);
												}
												if(object.Type == 2 && c2) { //basen
													this.rowData.push([object.KOBHAO, - 1, "Basis", scanX + ":" + scanY, object.UPWSFR, 0, 0, 0, 0]);
												}
												if(object.Type == 3 && c3) { //Lager Vposten													
													this.rowData.push([object.QRDMVJ, - 1, "Lager/Vorposten", scanX + ":" + scanY, object.DDTOJV, 0, 0, 0, 0]);
												}
											}
										}
									}
								}
								this.runloop = true;
								window.setTimeout("window.HuffyTools.BaseScannerGUI.getInstance().getResourcesByID()", 50);
							} catch(ex) {
								console.log("Maelstrom_Basescanner scan error: ", ex);
							}
						},
						getResourcesByID: function () {
							try {
								var retry = false;
								var loops = 0;
								var maxLoops = 10;
								var i = 0;
								var sleeptime = 150;
								
								//console.log("getResourcesByID start ");
								while(!retry) {
									// if (g3_baseScan.cancel)
									// {
									// g3_baseScan.window.setCaption("Scan results (cancelled)");
									// g3_baseScan.cancel = false;
									// g3_baseScan.scanInProgress = false;
									// return;
									// }
									var ncity = null;
									var selectedid = 0;
									var id = 0;
									if(this.rowData == null) {
										console.log("rowData null: ");
										this.runloop = false;
										break;
									}
									
									for(i = 0; i < this.rowData.length; i++) {
										// 1= "LoadState"
										if(this.rowData[i][1] == -1) {
											break;
										}
									}
									
									if(i == this.rowData.length) {
										this.runloop = false;
									}
									if(this.rowData[i] == null) {
										console.log("rowData[i] null: ");
										this.runloop = false;
										break;
									}
									posData = this.rowData[i][3];
									/* make sure coordinates are well-formed enough */
									if(posData != null && posData.split(':').length == 2) {
										posX = parseInt(posData.split(':')[0]);
										posY = parseInt(posData.split(':')[1]);
										/* check if there is any base */
										//var obj = ClientLib.Data.MainData.GetInstance().get_World().GetObjectFromPosition(posX, posY);
										//var obj = ClientLib.Vis.VisMain.GetInstance().get_SelectedObject();
										//console.log("obj", obj);
										id = this.rowData[i][0];
										webfrontend.gui.UtilView.openCityInMainWindow(id);
										ncity = window.MaelstromTools.Wrapper.GetCity(id);
										
										//console.log("ncity", ncity);
										
										if(ncity != null) {
											if(!ncity.get_IsGhostMode() && !ncity.get_IsLocked()) {
												//console.log("ncity.get_Name()", ncity.get_Name());
												var cityBuildings = ncity.get_CityBuildingsData();
												var cityUnits = ncity.get_CityUnitsData();
												if(cityBuildings != null) { // cityUnits !=null können null sein
													var buildings = window.MaelstromTools.Wrapper.GetBuildings(cityBuildings);
													var defenseUnits = window.MaelstromTools.Wrapper.GetDefenseUnits(cityUnits);
													if(buildings != null) //defenseUnits !=null können null sein
													{
														var buildingLoot = window.MaelstromTools.Util.getResourcesPart(buildings);
														var unitLoot = window.MaelstromTools.Util.getResourcesPart(defenseUnits);
														//console.log("buildingLoot", buildingLoot);
														//console.log("unitLoot", unitLoot);
														this.rowData[i][2] = ncity.get_Name();
														this.rowData[i][5] = buildingLoot[ClientLib.Base.EResourceType.Tiberium] + unitLoot[ClientLib.Base.EResourceType.Tiberium];
														this.rowData[i][6] = buildingLoot[ClientLib.Base.EResourceType.Crystal] + unitLoot[ClientLib.Base.EResourceType.Crystal];
														this.rowData[i][7] = buildingLoot[ClientLib.Base.EResourceType.Gold] + unitLoot[ClientLib.Base.EResourceType.Gold];
														this.rowData[i][8] = buildingLoot[ClientLib.Base.EResourceType.ResearchPoints] + unitLoot[ClientLib.Base.EResourceType.ResearchPoints];
														if(this.rowData[i][5] != 0) {
															this.rowData[i][1] = 0;
															retry = true;
															console.log(ncity.get_Name() , " finish");
														}
													}
												}
											} else {
												console.log( this.rowData[i][2] , " on " , posX, posY , " removed (Locked or GhostMode)");
												this.rowData.splice(i, 1); //entfernt element aus array
												break;
											}
										}
										//ClientLib.Vis.VisMain.GetInstance().CenterGridPosition(posX, posY);
										//ClientLib.Data.MainData.GetInstance().get_Cities().set_CurrentCityId(0);
										//ClientLib.Data.MainData.GetInstance().get_Cities().set_CurrentCityId(id);
										//ClientLib.Net.CommunicationManager.GetInstance().UserAction();
										//webfrontend.gui.UtilView.openCityInMainWindow(id);
									}
									loops++;
									if(loops >= maxLoops) {
										retry = true;
										break;
									}
								}
								//console.log("getResourcesByID end ", this.runloop, window.HuffyTools.BaseScannerGUI.getInstance().Window.isVisible());
								if(this.lastid != i) {
									this.lastid = i;
									this.countlastidchecked = 0;
								} else {
									this.countlastidchecked++;
									if(this.countlastidchecked > 5){
										sleeptime = 250;
									}
									else if(this.countlastidchecked > 12){
										sleeptime = 500;
									}									
									else if(this.countlastidchecked > 18) {
										console.log( this.rowData[i][2] , " on " , posX, posY , " removed (found no data)");
										this.rowData.splice(i, 1); //entfernt element aus array
									}
								}
								if(this.runloop && window.HuffyTools.BaseScannerGUI.getInstance().Window.isVisible()) {
									//console.log("loop");
									window.setTimeout("window.HuffyTools.BaseScannerGUI.getInstance().getResourcesByID()", sleeptime);
								}
							} catch(e) {
								console.log("MaelstromTools_Basescanner getResources", e);
							}
						}
					} //member				  
				});
			}

			function MaelstromTools_Basescanner_checkIfLoaded() {
				try {
					if(typeof qx != 'undefined' && typeof MaelstromTools != 'undefined') {
						createMaelstromTools_Basescanner();
					} else {
						window.setTimeout(MaelstromTools_Basescanner_checkIfLoaded, 1000);
					}
				} catch(e) {
					console.log("MaelstromTools_Basescanner_checkIfLoaded: ", e);
				}
			}
			if(/commandandconquer\.com/i.test(document.domain)) {
				window.setTimeout(MaelstromTools_Basescanner_checkIfLoaded, 1000);
			}
		} catch(e) {
			console.log("Maelstrom_Basescanner ERROR A: ", e);
		}
	}
	try {
		var MaelstromScript_Basescanner = document.createElement("script");
		MaelstromScript_Basescanner.innerHTML = "(" + MaelstromTools_Basescanner.toString() + ")();";
		MaelstromScript_Basescanner.type = "text/javascript";
		if(/commandandconquer\.com/i.test(document.domain)) {
			document.getElementsByTagName("head")[0].appendChild(MaelstromScript_Basescanner);
		}
	} catch(e) {
		console.log("MaelstromTools_Basescanner: init error: ", e);
	}
})();