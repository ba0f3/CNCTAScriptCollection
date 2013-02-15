// ==UserScript==
// @name        Flunik Tools Custom AutoUpgrade
// @namespace   AutoUpgrade
// @description Only uses the AutoUpgrade Feature For C&C Tiberium Alliances
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @author      Flunik dbendure RobertT KRS_L
// @version     0.5.7.01
// ==/UserScript==
(function () {
	var FlunikTools_main = function () {
		try {
			function CCTAWrapperIsInstalled() {
				return (typeof (CCTAWrapper_IsInstalled) != 'undefined' && CCTAWrapper_IsInstalled);
			}
 
			function createFlunikTools() {
				console.log('FLUNIKTOLS createFlunikTools');
 
				qx.Class.define("FlunikTools.Main", {
					type: "singleton",
					extend: qx.core.Object,
					members: {
						AutoUpdateButton: null,
						autoUpdateHandle: null,
 
						initialize: function () {
 
							console.log('FLUNIKTOLS initialize');
							AutoUpdateButton = new qx.ui.form.Button("AutoUpgrade", null).set({
								toolTipText: "Autoupdate",
								width: 100,
								height: 40,
								maxWidth: 100,
								maxHeight: 40,
								appearance: ("button-playarea-mode-frame"), //"button-standard-"+factionText), button-playarea-mode-red-frame
								center: true
							});
							AutoUpdateButton.addListener("click", function (e) {
								if (window.FlunikTools.Main.getInstance().autoUpdateHandle != null) {
									window.FlunikTools.Main.getInstance().stopAutoUpdate();
									AutoUpdateButton.setLabel("Flunik OFF");
									//alert("Stopped auto-update");
								} else {
									//window.FlunikTools.Main.getInstance().startAutoUpdate("Silo,Command Center");
									window.FlunikTools.Main.getInstance().startAutoUpdate("Construction Yard, Command Center, Defense HQ, Defense Facility, Barracks, Factory, Airfield, Accumulator, Silo, Refinery, Power Plant, Harvester");
									AutoUpdateButton.setLabel("Flunik ON");
									//alert("Started auto-update");
								}
							}, this);
 

 
 
							var app = qx.core.Init.getApplication();
 
						   
 
							app.getDesktop().add(AutoUpdateButton, {
								right: 120,
								bottom: 80
							});
															   
 
						},
 

 
						buildingsToUpdate: null,
 
						startAutoUpdate: function (_buildingsToUpdate) {
							if (_buildingsToUpdate == 'undefined' || _buildingsToUpdate != null) {
								_buildingsToUpdate == "Construction Yard, Command Center, Defense HQ, Defense Facility, Barracks, Factory, Airfield, Accumulator, Silo, Refinery, Power Plant, Harvester";
							}
							this.buildingsToUpdate = _buildingsToUpdate;
							this.autoUpgrade();
							this.autoUpdateHandle = window.setInterval(this.autoUpgrade, 5000);
						},
						stopAutoUpdate: function () {
							window.clearInterval(this.autoUpdateHandle);
							this.autoUpdateHandle = null;
						},
 
						autoUpgrade: function () {
							for (var nCity in ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d) {
								var city = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d[nCity];
								//var buildings = city.get_CityBuildingsData().get_Buildings();
								var buildings = city.get_Buildings();
 
								for (var nBuildings in buildings.d) {
									var building = buildings.d[nBuildings];
									if (!building.CanUpgrade()) continue; //KRS_L
									var name = building.get_UnitGameData_Obj().dn;
									var baselvl = city.get_LvlBase();
									var buildinglvl = building.get_CurrentLevel();
									//var powCost = ClientLib.Base.EResourceType.Power; //5
									//var airRT = ClientLib.Base.EModifierType.RepairEfficiencyAir; //39
									//var vehRT = ClientLib.Base.EModifierType.RepairEfficiencyVeh; //43
									//var infRT = ClientLib.Base.EModifierType.RepairEfficiencyInf; //41
									
									var bldpro = ClientLib.Data.CityBuilding.BuildingProduction.prototype(); 
									
									//if (name == "Silo" || name == "Accumulator" || name == "Command Center" || name == "Defence HQ" ) {
									if (window.FlunikTools.Main.getInstance().buildingsToUpdate.indexOf(name) != -1) {
										//if (name == "Silo") {
										var building_obj = {
											cityid: city.get_Id(),
											buildingid: building.get_Id(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											 
											isPaid: true
										};
										console.log(building_obj);
										//Command Center, Defense HQ, Construction Yard, Accumulator, Power Plant, Harvester, Refinery, Airfield, Barracks, Factory, Defense Facility, Silo    
										//if (Math.random() > 0.90) {
										if (
										((name == "Harvester" || name == "Power Plant") && buildinglvl < 23)|| (name == "Refinery" && buildinglvl < 20)) {
											
											console.log(building);
											ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", building_obj, null, null, true);
										}
										if (name == "Accumulator"  || name == "Silo" ) {
										
											console.log(building);
											ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", building_obj, null, null, true);
										}
										if ((name == "Barracks" && buildinglvl < baselvl)|| (name == "Factory" && buildinglvl < baselvl) || (name == "Airfield" && buildinglvl < baselvl) || (name == "Defense Facility" && buildinglvl < baselvl) ) {
										
											console.log(building);
											ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", building_obj, null, null, true);
										}
										if ((name == "Command Center" && buildinglvl < 28)  || (name == "Construction Yard" && buildinglvl < 25) || (name == "Defense HQ" && buildinglvl < 28)) {
 
											console.log(building);
											ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", building_obj, null, null, true);
										}
										if (name == "Falcon Support" || name == "Ion Cannon Support" || name == "Skystrike Support" ) {
 
											console.log(building);
											ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", building_obj, null, null, true);
										}
									}
								}
 
								var units = city.get_CityUnitsData();
								var offenceUnits = units.get_OffenseUnits();
								for (var nUnit in offenceUnits.d) {
									var unit = offenceUnits.d[nUnit];
									if (!unit.CanUpgrade()) continue; //KRS_L
									var baselvl = city.get_LvlBase();
									var unitlvl = unit.get_CurrentLevel();
									var unit_obj = {
										cityid: city.get_Id(),
										unitId: unit.get_Id()
									};
 
									if (baselvl > unitlvl) {
										ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UnitUpgrade", unit_obj, null, null, true);
										console.log(unit);
									}
								}
 
								var defenceUnits = units.get_DefenseUnits();
								for (var nUnit in defenceUnits.d) {
									var unit = defenceUnits.d[nUnit];
									if (!unit.CanUpgrade()) continue; //KRS_L
									var baselvl = city.get_LvlBase();
									var unitlvl = unit.get_CurrentLevel();
									var unit_obj = {
										cityid: city.get_Id(),
										unitId: unit.get_Id()
									};
 
									if (baselvl > unitlvl) {
										ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UnitUpgrade", unit_obj, null, null, true);
										console.log(unit);
									}
								}
							}
						}
					}
				});
			}
		} catch (e) {
			console.log("createFlunikTools: ", e);
		}
 
		function FlunikTools_checkIfLoaded() {
			try {
				if (typeof qx != 'undefined' && qx.core.Init.getApplication() && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION) && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION).isVisible()) {
					createFlunikTools();
 
					for (var key in ClientLib.Data.CityBuilding.prototype) { //KRS_L
						if (ClientLib.Data.CityBuilding.prototype[key] !== null) {
							var strFunction = ClientLib.Data.CityBuilding.prototype[key].toString();
							if (typeof ClientLib.Data.CityBuilding.prototype[key] === 'function' & strFunction.indexOf("true).l.length==0)){return true;}}return false") > -1) {
								ClientLib.Data.CityBuilding.prototype.CanUpgrade = ClientLib.Data.CityBuilding.prototype[key];
								break;
							}
						}
					}
 
					for (var key in ClientLib.Data.CityUnit.prototype) { //KRS_L
						if (ClientLib.Data.CityUnit.prototype[key] !== null) {
							var strFunction = ClientLib.Data.CityUnit.prototype[key].toString();
							if (typeof ClientLib.Data.CityUnit.prototype[key] === 'function' & strFunction.indexOf(".l.length>0)){return false;}") > -1) {
								ClientLib.Data.CityUnit.prototype.CanUpgrade = ClientLib.Data.CityUnit.prototype[key];
								break;
							}
						}
					}
 
					window.FlunikTools.Main.getInstance().initialize();
				} else {
					window.setTimeout(FlunikTools_checkIfLoaded, 1000);
				}
			} catch (e) {
				console.log("FlunikTools_checkIfLoaded: ", e);
			}
		}
		if (/commandandconquer\.com/i.test(document.domain)) {
			window.setTimeout(FlunikTools_checkIfLoaded, 1000);
		}
	};
 
	try {
		var FlunikScript = document.createElement("script");
		FlunikScript.innerHTML = "(" + FlunikTools_main.toString() + ")();";
		FlunikScript.type = "text/javascript";
		if (/commandandconquer\.com/i.test(document.domain)) {
			document.getElementsByTagName("head")[0].appendChild(FlunikScript);
		}
	} catch (e) {
		console.log("FlunikTools: init error: ", e);
	}
})();
