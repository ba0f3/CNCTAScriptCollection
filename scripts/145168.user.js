// ==UserScript==
// @name        Maelstrom ADDON Basescanner
// @namespace   http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @description Maelstrom ADDON Basescanner
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @version     0.4
// @author      BlinDManX
// @grant       none
// ==/UserScript==
__msbs_version = 0.4;
(function () {
	var MaelstromTools_Basescanner = function () {
		try {
			console.log("Maelstrom_Basescanner " + window.__msbs_version + " loaded");

			function createMaelstromTools_Basescanner() {
				console.log("Maelstrom_Basescanner initalisiert");
				var MT_Lang = null;
				var MT_Cache = null;
				var MT_Base = null;
				var fileManager = null;
				var lastid = 0;
				var countlastidchecked = 0;
				fileManager = ClientLib.File.FileManager.GetInstance();
				MT_Lang = window.MaelstromTools.Language.getInstance();
				MT_Cache = window.MaelstromTools.Cache.getInstance();
				MT_Base = window.MaelstromTools.Base.getInstance();
				var l = MT_Lang.Languages.indexOf(qx.locale.Manager.getInstance().getLocale());
				if(l >= 0) { //TODO other Languages
					MT_Lang.Data["Point"] = ["Position", "Position", "Position"][l]; //[eng] = [de,pt,fr]
					MT_Lang.Data["BaseScanner Overview"] = ["Basescanner Übersicht", "Visão geral do scanner de base", "Aperçu du scanner de base"][l]; //[eng] = [de,pt,fr]
					MT_Lang.Data["Scan"] = ["Scannen", "Esquadrinhar", "Balayer"][l]; //[eng] = [de,pt,fr]
					MT_Lang.Data["Location"] = ["Lage", "localização", "Emplacement"][l]; //[eng] = [de,pt,fr]
					MT_Lang.Data["Player"] = ["Spieler", "Jogador", "Joueur"][l]; //[eng] = [de,pt,fr]
					MT_Lang.Data["Bases"] = ["Basen", "Bases", "Bases"][l]; //[eng] = [de,pt,fr]
					MT_Lang.Data["Camp,Outpost"] = ["Lager,Vorposten", "Camp,posto avançado", "Camp,avant-poste"][l]; //[eng] = [de,pt,fr]
					MT_Lang.Data["BaseScanner Layout"] = ["BaseScanner Layout", "Layout da Base de Dados de Scanner", "Mise scanner de base"][l]; //[eng] = [de,pt,fr]
					MT_Lang.Data["Show Layouts"] = ["Layouts anzeigen", "Mostrar Layouts", "Voir Layouts"][l]; //[eng] = [de,pt,fr]
					MT_Lang.Data["Building state"] = ["Gebäudezustand", "construção do Estado", "construction de l'État"][l]; //[eng] = [de,pt,fr]
					MT_Lang.Data["Defense state"] = ["Verteidigungszustand", "de Defesa do Estado", "défense de l'Etat"][l]; //[eng] = [de,pt,fr]
					MT_Lang.Data["CP"] = ["KP", "CP", "CP"][l]; //[eng] = [de,pt,fr]
					
				}
				MT_Base.createNewImage("BaseScanner", "ui/icons/icon_item.png", fileManager);
				MT_Base.createNewImage("Emptypixels", "ui/menues/main_menu/misc_empty_pixel.png", fileManager);
				MT_Base.createNewWindow("BaseScanner", "L", 120, 60, 820, 400);
				MT_Base.createNewWindow("BaseScannerLayout", "L", 120, 460, 820, 350);
				var openBaseScannerOverview = MT_Base.createDesktopButton(MT_Lang.gt("BaseScanner Overview"), "BaseScanner", false, MT_Base.desktopPosition(2));
				openBaseScannerOverview.addListener("execute", function () {
					if(window.HuffyTools.BaseScannerGUI.getInstance().Window != null) {
						//window.HuffyTools.BaseScannerGUI.getInstance().createOptions();
					}
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
						resmap: null,
						resmapViewOptions: null,
						resmapViewButton: null,
						rowData: null,
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
								
								var stats = document.createElement('img');
								stats.src = 'http://goo.gl/RTscG';//0.4
								
							} catch(e) {
								console.log("HuffyTools.BaseScannerGUI.init: ", e);
							}
						},
						createTable: function () {
							try {
								this.HT_Models = new qx.ui.table.model.Simple();
								this.HT_Models.setColumns(["ID", "LoadState", MT_Lang.gt("City"), MT_Lang.gt("Location"), MT_Lang.gt("Level"), MT_Lang.gt(MaelstromTools.Statics.Tiberium), MT_Lang.gt(MaelstromTools.Statics.Crystal), MT_Lang.gt(MaelstromTools.Statics.Dollar), MT_Lang.gt(MaelstromTools.Statics.Research), "", "", MT_Lang.gt("Building state"), MT_Lang.gt("Defense state"),MT_Lang.gt("CP"),"Def.HP/Off.HP"]);
								this.HT_Tables = new qx.ui.table.Table(this.HT_Models);
								this.HT_Tables.setColumnVisibilityButtonVisible(true);
								this.HT_Tables.setColumnWidth(0, 0);
								this.HT_Tables.setColumnWidth(1, 0);
								this.HT_Tables.setColumnWidth(2, 120);
								this.HT_Tables.setColumnWidth(3, 60);
								this.HT_Tables.setColumnWidth(4, 50);
								this.HT_Tables.setColumnWidth(5, 60);
								this.HT_Tables.setColumnWidth(6, 60);
								this.HT_Tables.setColumnWidth(7, 60);
								this.HT_Tables.setColumnWidth(8, 60);
								this.HT_Tables.setColumnWidth(9, 30);
								this.HT_Tables.setColumnWidth(10, 30);
								this.HT_Tables.setColumnWidth(11, 50);
								this.HT_Tables.setColumnWidth(12, 50);
								this.HT_Tables.setColumnWidth(13, 50);
								this.HT_Tables.setColumnWidth(14, 90);
								var tcm = this.HT_Tables.getTableColumnModel();
								tcm.setColumnVisible(0, false);
								tcm.setColumnVisible(1, false);
								tcm.setHeaderCellRenderer(9, new qx.ui.table.headerrenderer.Icon(MT_Base.images[MaelstromTools.Statics.Crystal]));
								tcm.setHeaderCellRenderer(10, new qx.ui.table.headerrenderer.Icon(MT_Base.images[MaelstromTools.Statics.Tiberium]));
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
									window.HuffyTools.BaseScannerGUI.getInstance().cellDoubleClickCallback(e);
								}, this);
							} catch(e) {
								console.log("HuffyTools.BaseScannerGUI.createTable: ", e);
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
									//ClientLib.Data.MainData.GetInstance().get_Cities().set_CurrentCityId(cityId);
									//webfrontend.gui.UtilView.openCityInMainWindow(cityId);
									//webfrontend.gui.UtilView.openVisModeInMainWindow(1, cityId, false);
									var bk=qx.core.Init.getApplication();
									bk.getBackgroundArea().closeCityInfo();
									bk.getPlayArea().setView(webfrontend.gui.PlayArea.PlayArea.modes.EMode_CombatSetupDefense,cityId,0,0);
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
								console.log("HuffyTools.BaseScannerGUI.setWidgetLabels: ", e);
							}
						},
						createOptions: function () {
							var oBox = new qx.ui.layout.Flow();
							var oOptions = new qx.ui.container.Composite(oBox);
							oOptions.setMargin(5);
							this.CitySelect = new qx.ui.form.SelectBox();
							MT_Cache.updateCityCache();
							MT_Cache = window.MaelstromTools.Cache.getInstance();
							for(var cname in MT_Cache.Cities) {
								var item = new qx.ui.form.ListItem(cname, null, MT_Cache.Cities[cname].Object);
								this.CitySelect.add(item);
								if(MaelstromTools.LocalStorage.get("MS_Basescanner_LastCityID") == MT_Cache.Cities[cname].Object.get_Id()) {
									this.CitySelect.setSelection([item]);
								}
							}
							oOptions.add(this.CitySelect);
							this.scanButton = new qx.ui.form.Button(MT_Lang.gt("Scan")).set({
								appearance: "button-text-small",
								width: 100,
								minWidth: 100,
								maxWidth: 100
							});
							this.scanButton.addListener("execute", function () {								
								this.scan();
							}, this);
							oOptions.add(this.scanButton, {
								left: 10,
								top: 10
							});
							this.HT_ShowBase = [];
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
							this.HT_ShowBase[2] = new qx.ui.form.CheckBox(MT_Lang.gt("Camp,Outpost"));
							this.HT_ShowBase[2].setMargin(5);
							this.HT_ShowBase[2].setTextColor("white");
							this.HT_ShowBase[2].setValue(MaelstromTools.LocalStorage.get("MS_Basescanner_Show2", true));
							oOptions.add(this.HT_ShowBase[2], {
								left: 10,
								top: 10
							});
							this.resmapViewOptions = new qx.ui.form.SelectBox();
							this.resmapViewOptions.setWidth(150);
							var item = new qx.ui.form.ListItem("7 " + MT_Lang.gt(MaelstromTools.Statics.Tiberium) + " 5 " + MT_Lang.gt(MaelstromTools.Statics.Crystal), null, 7);
							this.resmapViewOptions.add(item);
							item = new qx.ui.form.ListItem("6 " + MT_Lang.gt(MaelstromTools.Statics.Tiberium) + " 6 " + MT_Lang.gt(MaelstromTools.Statics.Crystal), null, 6);
							this.resmapViewOptions.add(item);
							item = new qx.ui.form.ListItem("5 " + MT_Lang.gt(MaelstromTools.Statics.Tiberium) + " 7 " + MT_Lang.gt(MaelstromTools.Statics.Crystal), null, 5);
							this.resmapViewOptions.add(item);
							oOptions.add(this.resmapViewOptions, {
								left: 10,
								top: 10
							});
							this.resmapViewButton = new qx.ui.form.Button(MT_Lang.gt("Get Layouts")).set({
								appearance: "button-text-small",
								width: 120,
								minWidth: 120,
								maxWidth: 120
							});
							this.resmapViewButton.addListener("execute", function () {
								var layout = window.HuffyTools.BaseScannerLayout.getInstance();								
								if(layout.Window != null) { //after first run
									layout.Window.close();
									layout.createmap();
								}								
								layout.openWindow("BaseScannerLayout", MT_Lang.gt("BaseScanner Layout"));
							}, this);
							this.resmapViewButton.setEnabled(false);
							oOptions.add(this.resmapViewButton, {
								left: 10,
								top: 10
							});
							this.HT_Options = oOptions;
						},
						scan: function () {
							try {
								this.upgradeInProgress = true;								
								this.rowData = [];
								var selectedBase = this.CitySelect.getSelection()[0].getModel();
								MaelstromTools.LocalStorage.set("MS_Basescanner_LastCityID", selectedBase.get_Id());
								var c1 = this.HT_ShowBase[0].getValue();
								var c2 = this.HT_ShowBase[1].getValue();
								var c3 = this.HT_ShowBase[2].getValue();
								console.log("Select", c1 ,c2 ,c3);
								MaelstromTools.LocalStorage.set("MS_Basescanner_Show0", c1);
								MaelstromTools.LocalStorage.set("MS_Basescanner_Show1", c2);
								MaelstromTools.LocalStorage.set("MS_Basescanner_Show2", c3);
								var posX = selectedBase.get_PosX();
								var posY = selectedBase.get_PosY();
								var scanX = 0;
								var scanY = 0;
								var world = ClientLib.Data.MainData.GetInstance().get_World();
								console.log("Scanning from: " + selectedBase.get_Name());
								ClientLib.Vis.VisMain.GetInstance().CenterGridPosition(posX, posY); //Load data of region
								ClientLib.Data.MainData.GetInstance().get_Cities().set_CurrentCityId(selectedBase.get_Id());
								
								var maxAttackDistance = ClientLib.Data.MainData.GetInstance().get_Server().get_MaxAttackDistance();
								for(scanY = posY - Math.floor(maxAttackDistance + 1); scanY <= posY + Math.floor(maxAttackDistance + 1); scanY++) {
									for(scanX = posX - Math.floor(maxAttackDistance + 1); scanX <= posX + Math.floor(maxAttackDistance + 1); scanX++) {
										var distX = Math.abs(posX - scanX);
										var distY = Math.abs(posY - scanY);
										var distance = Math.sqrt((distX * distX) + (distY * distY));
										if(distance <= maxAttackDistance) {
											var object = world.GetObjectFromPosition(scanX, scanY);
											var loot = {};
											if(object) {
												//console.log(object);
												if(object.ConditionBuildings>0){
													var needcp = selectedBase.CalculateAttackCommandPointCostToCoord(scanX, scanY);														
													// 0:ID , 1:Scanned, 2:Name, 3:Location, 4:Level, 5:Tib, 6:Kristal, 7:Credits, 8:Forschung, 9:Kristalfelder, 10:Tiberiumfelder, 11:ConditionBuildings,12:ConditionDefense,13: CP pro Angriff
													if(object.ConditionBuildings != 100 || object.ConditionDefense != 100) {
														//console.log("------------------", object.ConditionBuildings, object.ConditionDefense);
													}
													if(object.Type == 1 && c1) { //User
														this.rowData.push([object.Id, - 1, object.Name, scanX + ":" + scanY, object.Level, 0, 0, 0, 0, 0, 0, object.ConditionBuildings, object.ConditionDefense,needcp]    );
													}
													if(object.Type == 2 && c2) { //basen
														this.rowData.push([object.KOBHAO, - 1, "Basis", scanX + ":" + scanY, object.UPWSFR, 0, 0, 0, 0, 0, 0, object.ConditionBuildings, object.ConditionDefense,needcp]    );
													}
													if(object.Type == 3 && c3) { //Lager Vposten													
														this.rowData.push([object.QRDMVJ, - 1, "Lager/Vorposten", scanX + ":" + scanY, object.DDTOJV, 0, 0, 0, 0, 0, 0, object.ConditionBuildings, object.ConditionDefense,needcp]   );
													}
												}
											}
										}
									}
								}
								this.runloop = true;
								this.resmap = {};
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
										this.resmapViewButton.setEnabled(true);
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
										//webfrontend.gui.UtilView.openCityInMainWindow(id);
										webfrontend.gui.UtilView.openVisModeInMainWindow(1, id, false);
										ncity = window.MaelstromTools.Wrapper.GetCity(id);
										console.log("ncity", ncity);
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
														//console.log(ncity);
														if(this.rowData[i][5] != 0) {
															var c = 0;
															var t = 0;
															this.resmap[id] = new Array(9);
															for(var m = 0; m < 9; m++) {
																this.resmap[id][m] = new Array(8);
															}
															for(var k = 0; k < 9; k++) {
																for(var l = 0; l < 8; l++) {
																	//console.log( ncity.GetResourceType(k,l) );
																	switch(ncity.GetResourceType(k, l)) {
																	case 1:
																		/* Crystal */
																		this.resmap[id][k][l] = 1;
																		c++;
																		break;
																	case 2:
																		/* Tiberium */
																		this.resmap[id][k][l] = 2;
																		t++;
																		break;
																	default:
																		//none
																		break;
																	}
																}
															}
															//console.log( c,t );
															
																										
															
															this.rowData[i][9] = c;
															this.rowData[i][10] = t;
															this.rowData[i][11] = ncity.GetBuildingsConditionInPercent();
															this.rowData[i][12] = ncity.GetDefenseConditionInPercent();
															
															try {
																var selectedBase = this.CitySelect.getSelection()[0].getModel();
																var u = selectedBase.get_CityUnitsData().get_OffenseUnits().l;
																console.log("OffenseUnits",u);
																var offhp = 0;
																var defhp =0;
																for (var g = 0; g < u.length; g++) {
																	offhp += u[g].get_Health();														
																}
																
																u = ncity.get_CityUnitsData().get_DefenseUnits().l
																console.log("DefUnits",u);
																for (g = 0; g < u.length; g++) {
																	defhp += u[g].get_Health();		
																}
																
																console.log("HPs",offhp,defhp, (defhp/offhp) );
															} catch (x) {
																console.log("HPRecord",x);
															}
															this.rowData[i][14] =(defhp/offhp);
															this.rowData[i][1] = 0;
															retry = true;
															console.log(ncity.get_Name(), " finish");
														}
													}
												}
											} else {
												console.log(this.rowData[i][2], " on ", posX, posY, " removed (Locked or GhostMode)");
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
									if(this.countlastidchecked > 5) {
										sleeptime = 250;
									} else if(this.countlastidchecked > 12) {
										sleeptime = 500;
									} else if(this.countlastidchecked > 18) {
										console.log(this.rowData[i][2], " on ", posX, posY, " removed (found no data)");
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
				qx.Class.define("HuffyTools.BaseScannerLayout", {
					type: "singleton",
					extend: MaelstromTools.DefaultObject,
					members: {
						labels: null,
						scrollpane: null,
						comp: null,
						idcache: null,
						init: function () {
							try {
								console.log("BaseScannerLayout.init: ");
								this.labels = [];
								this.Window.setPadding(0);
								this.Window.set({
									resizable: false
								});
								this.Window.removeAll();
								this.Window.setLayout(new qx.ui.layout.Flow().set({
									spacingX: 3,
									spacingY: 3
								}));
								this.scrollpane = new qx.ui.container.Scroll().set(
								{
									width: 800,
									height: 350
								});
								this.comp = new qx.ui.container.Composite();
								this.comp.setLayout(new qx.ui.layout.Flow().set({
									spacingX: 3,
									spacingY: 3
								}));
								this.Window.add(this.scrollpane);
								this.scrollpane.add(this.comp);
								
								this.createmap();
							} catch(e) {
								console.log("HuffyTools.BaseScannerLayout.init: ", e);
							}
						},
						updateCache: function () {
							try {
								//
							} catch(e) {
								console.log("HuffyTools.BaseScannerLayout.updateCache: ", e);
							}
						},
						setWidgetLabels: function () {
							try {
								if(this.labels == null) {
									this.init();
								}
							} catch(e) {
								console.log("HuffyTools.BaseScannerLayout.setWidgetLabels: ", e)
							}
						},
						createmap: function () {
							var resmap = window.HuffyTools.BaseScannerGUI.getInstance().resmap;
							var rowData = window.HuffyTools.BaseScannerGUI.getInstance().rowData;
							this.idcache = [];
							var selectedtype = window.HuffyTools.BaseScannerGUI.getInstance().resmapViewOptions.getSelection()[0].getModel();
							
							var rowDataLine = null;
							if(rowData == null) {
								console.log("rowData null: ");
								return;
							}
							//console.log("createmap: " , resmap);
							this.labels = [];
							for(var id in resmap) {
								for(i = 0; i < rowData.length; i++) {
									if(rowData[i][0] == id) {
										rowDataLine = rowData[i];
									}
								}
								
								if(rowDataLine == null){
									continue;
								}
								
								if( selectedtype >4 && selectedtype<8){
									if( selectedtype != rowDataLine[10] ){
										continue;
									}
								} else {
									continue;
								}
								
								
								posData = rowDataLine[3];
								if(posData != null && posData.split(':').length == 2) {
									posX = parseInt(posData.split(':')[0]);
									posY = parseInt(posData.split(':')[1]);
								}
								var st = '<table border="2" cellspacing="0" cellpadding="0">';
								var link = rowDataLine[2] + " - " + rowDataLine[3];
								st = st + '<tr><td colspan="9"><font color="#FFF">' + link + '</font></td></tr>';
								for(y = 0; y < 8; y++) {
									st = st + "<tr>";
									for(x = 0; x < 9; x++) {
										var img = "";
										var res = resmap[id][x][y];
										//console.log("Res ",res);
										switch(res == undefined ? 0 : res) {
										case 2:
											//console.log("Tiberium " , MT_Base.images[MaelstromTools.Statics.Tiberium] );
											img = '<img width="14" height="14" src="' + MT_Base.images[MaelstromTools.Statics.Tiberium] + '">';
											break;
										case 1:
											//console.log("Crystal ");
											img = '<img width="14" height="14" src="' + MT_Base.images[MaelstromTools.Statics.Crystal] + '">';
											break;
										default:
											img = '<img width="14" height="14" src="' + MT_Base.images["Emptypixels"] + '">';
											break;
										}
										st = st + "<td>" + img + "</td>";
									}
									st = st + "</tr>";
								}
								st = st + "</table>";
								//console.log("setWidgetLabels ", st);
								var l = new qx.ui.basic.Label().set({
									backgroundColor: "#303030",
									value: st,
									rich: true
								});
								l.cid = id;
								this.idcache.push(id);
								l.addListener("click", function (e) {
									
									console.log("clickid ", this.cid  );
									//webfrontend.gui.UtilView.openCityInMainWindow(this.cid);
									var bk=qx.core.Init.getApplication();
									bk.getBackgroundArea().closeCityInfo();
									bk.getPlayArea().setView(webfrontend.gui.PlayArea.PlayArea.modes.EMode_CombatSetupBase,this.cid,0,0);
									
								});
								l.setReturnValue = id;
								this.labels.push(l);
								this.comp.removeAll();
								for(a = 0; a < this.labels.length; a++) {
									this.comp.add(this.labels[a]);
								}
							}
						},
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
	};
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