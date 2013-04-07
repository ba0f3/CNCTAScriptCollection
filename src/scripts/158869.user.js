// ==UserScript==
// @name        C&C Tiberium Alliances Flunik Tools: Custom AutoUpgrade
// @namespace   AutoUpgrade
// @description Only uses the AutoUpgrade Feature For C&C Tiberium Alliances
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @author      Flunik dbendure RobertT KRS_L Trekker9876 
// @version     0.5.7.08
// ==/UserScript==
(function () {
	var FlunikTools_main = function () {
		try {
			function CCTAWrapperIsInstalled() {
				return (typeof (CCTAWrapper_IsInstalled) != 'undefined' && CCTAWrapper_IsInstalled);
			}
			_log = function () {
                if (typeof console != 'undefined') console.log(arguments);
                else if (window.opera) opera.postError(arguments);
                else GM_log(arguments);
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
							AutoUpdateButton = new qx.ui.form.Button("DB.aUp", null).set({
								toolTipText: "Autoupdate",
								width: 60,
								height: 30,
								maxWidth: 60,
								maxHeight: 30,
								appearance: ("button-text-small"), //"button-standard-"+factionText), button-playarea-mode-red-frame
								center: true
							});
							AutoUpdateButton.addListener("click", function (e) {
								if (window.FlunikTools.Main.getInstance().autoUpdateHandle != null) {
									window.FlunikTools.Main.getInstance().stopAutoUpdate();
									AutoUpdateButton.setLabel("F.OFF");
									//alert("Stopped auto-update");
								} else {
									//window.FlunikTools.Main.getInstance().startAutoUpdate("Construction Yard, Command Center, Defense HQ, Defense Facility, Barracks, Factory, Airfield, Accumulator, Silo, Refinery, Power Plant, Harvester, Blade of Kane, Eye of Kane, Fist of Kane");
									//This is the first list of building names if I still missed something let me know
                                    window.FlunikTools.Main.getInstance().startAutoUpdate("Construction Yard, Command Center, Defense HQ, Defense Facility, Barracks, Factory, Airfield, Accumulator, Silo, Refinery, Power Plant, Harvester, Blade of Kane, Eye of Kane, Fist of Kane, Falcon Support, Ion Cannon Support, Skystrike Support, War Factory, Hand of Nod, Airport");
									//window.FlunikTools.Main.getInstance().startAutoUpdate(this.buildingsToUpdate);
									AutoUpdateButton.setLabel("F.ON");
									//alert("Started auto-update");
								}
							}, this);
 

 
 
							var app = qx.core.Init.getApplication();
 
						   
 
							app.getDesktop().add(AutoUpdateButton, {
								right: 60,
								bottom: 185
							});
															   
 
						},
						
						// Use
						// this.canUpgradeUnit(unit, city)
						// instead of
						// unit.CanUpgrade()
						canUpgradeUnit: function (unit, city) {
							var _this = FlunikTools.Main.getInstance();
							var nextLevel = unit.get_CurrentLevel() + 1;
							var gameDataTech = unit.get_UnitGameData_Obj();
							var hasEnoughResources = city.HasEnoughResources(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj(nextLevel, gameDataTech));
						    if (gameDataTech == null || unit.get_IsDamaged() || city.get_IsLocked() || !hasEnoughResources) {
						        return false;
						    }
						    var id = _this.getMainProductionBuildingMdbId(gameDataTech.pt, gameDataTech.f);
						    var building = city.get_CityBuildingsData().GetBuildingByMDBId(id);
						    if ((building == null) || (building.get_CurrentDamage() > 0)) {
						        return false;
						    }
						    var levelReq = ClientLib.Base.Util.GetUnitLevelRequirements_Obj(nextLevel, gameDataTech);
							var reqTechIndexes = _this.getMissingTechIndexesFromTechLevelRequirement(levelReq, true, city);
						    if ((reqTechIndexes != null) && (reqTechIndexes.length > 0)) {
						        return false;
						    }
						    return true;
						},

						getMainProductionBuildingMdbId: function (placementType, faction) {
							var mdbId = -1;
							var techNameId = -1;
							if (placementType == 2) {
								techNameId = 3;
							} else {
								techNameId = 4;
							}
							if (techNameId > 0) {
								mdbId = ClientLib.Base.Tech.GetTechIdFromTechNameAndFaction(techNameId, faction);
							}
							return mdbId;
						},

						getMissingTechIndexesFromTechLevelRequirement: function (levelRequirements, breakAtFirst, city) {
							var reqTechIndexes = [];
							if (levelRequirements != null && levelRequirements.length > 0) {
								for (var lvlIndex=0; (lvlIndex < levelRequirements.length); lvlIndex++) {
									var lvlReq = levelRequirements[lvlIndex];
									var requirementsMet = false;
									var amountCounter = lvlReq.Amount;
									for (var buildingIndex in city.get_Buildings().d) {
										if (city.get_Buildings().d[buildingIndex].get_MdbBuildingId() == lvlReq.RequiredTechId && city.get_Buildings().d[buildingIndex].get_CurrentLevel() >= lvlReq.Level) {
											amountCounter--;
											if (amountCounter <= 0) {
												requirementsMet=true;
												break;
											}
										}
									}
									if (!requirementsMet) {
										requirementsMet = ClientLib.Data.MainData.GetInstance().get_Player().get_PlayerResearch().IsResearchMinLevelAvailable(lvlReq.RequiredTechId, lvlReq.Level);
									}
									if (!requirementsMet) {
										reqTechIndexes.push(lvlIndex);
										if (breakAtFirst) {
											return reqTechIndexes;
										}
									}
								}
							}
							return reqTechIndexes;
						},
						
						// Add the below function to your code and then use
						// this.canUpgradeBuilding(building, city)
						// instead of
						// building.CanUpgrade()

						canUpgradeBuilding: function (building, city) {
							var nextLevel = (building.get_CurrentLevel() + 1);
							var gameDataTech = building.get_TechGameData_Obj();
							var hasEnoughResources = city.HasEnoughResources(ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj(nextLevel, gameDataTech));
							return (!building.get_IsDamaged() && !city.get_IsLocked() && hasEnoughResources);
						},
						
						get_IsFull: function (city, type) {
							if (city.GetResourceCount(type) < (city.GetResourceMaxStorage(type)*0.80)) {
								return false;
							} else {
								return true;
							}
						},
						CityCount: 0,
						Cities: null,
						updateCityCache: function (city, unit, building, cCount, count) {
						  try {
						  var _this = FlunikTools.Main.getInstance();
							if(city){
							_this.CityCount = cCount;
							var Cities = new Object();

							var cities = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities();
							for (var cindex in cities.d) {
							  _this.CityCount++;
							  var ncity = cities.d[cindex];
							  var ncityName = ncity.get_Name();
							  Cities[ncityName] = new Object();
							  Cities[ncityName]["ID"] = cindex;
							  Cities[ncityName]["Object"] = ncity;
							  Cities[ncityName]["Tiberium"] = ncity.GetResourceCount(ClientLib.Base.EResourceType.Tiberium);
							  Cities[ncityName]["Crystal"] = ncity.GetResourceCount(ClientLib.Base.EResourceType.Crystal);
							  Cities[ncityName]["Power"] = ncity.GetResourceCount(ClientLib.Base.EResourceType.Power);
							  return ("City Updated")
							  
							  if(unit = offenceUnits.d[nUnit]){ 
							  _this.UnitCount = count;
							  var AllUnits = new Object();
							  var units = ncity.get_CityUnitsData();
							  var offenceUnits = units.get_OffenseUnits();
							  for (var uIndex in offenceUnits.d) {
							  _this.UnitCount; 
							  var nunit = offenceUnits.d[uIndex];
							  var nunitName = nunit.get_UnitGameData_Obj().dn;
							  AllUnits[nunitName] = new Object();
							  AllUnits[nunitName]["ID"] = uIndex;
							  AllUnits[nunitName]["Object"] = unit;
							  AllUnits[nunitName]["Current Level"] = unit.get_CurrentLevel();
							  AllUnits[nunitName]["New Level"] = unit.get_CurrentLevel() + 1;
							  //return ("Unit" + nunitName +":"+ AllUnits[nunitName]["Current Level"] + " to " + AllUnits[nunitName]["New Level"]);
							  return("Unit Updated" );

							  }
							  }
							  if(unit = defenceUnits.d[nUnit]){
							  _this.UnitCount = count;
							  var AllUnits = new Object();
							  var units = ncity.get_CityUnitsData();
							  var defenceUnits = units.get_DefenseUnits();
							  for (var nUnit in defenceUnits.d) {
							  _this.UnitCount; 
							  var nunit = defenceUnits.d[uIndex];
							  var nunitName = nunit.get_UnitGameData_Obj().dn;
							  AllUnits[nunitName] = new Object();
							  AllUnits[nunitName]["ID"] = uIndex;
							  AllUnits[nunitName]["Object"] = nunit;
							  AllUnits[nunitName]["Current Level"] = nunit.get_CurrentLevel();
							  AllUnits[nunitName]["New Level"] = nunit.get_CurrentLevel() + 1;
							  //return ("Unit" + nunitName +":"+ AllUnits[nunitName]["Current Level"] + " to " + AllUnits[nunitName]["New Level"]);
							  return("Unit Updated" );

							  }
							  }
							  if(building = buildings.d[nBuildings]){
							  _this.BuildingCount = count;
							  var AllBuildings = new Object();
							  //var units = city.get_CityUnitsData();
							  var buildings = ncity.get_Buildings();
								for (var bIndex in buildings.d) {
							  _this.UnitCount; 
							  var nbuilding = buildings.d[bIndex];
							  var nunitName = nbuilding.get_UnitGameData_Obj().dn;
							  AllBuildings[nunitName] = new Object();
							  AllBuildings[nunitName]["ID"] = bIndex;
							  AllBuildings[nunitName]["Object"] = nbuilding;
							  AllBuildings[nunitName]["Current Level"] = nbuilding.get_CurrentLevel();
							  AllBuildings[nunitName]["New Level"] = nbuilding.get_CurrentLevel() + 1;
							  //return ("Unit" + nunitName +":"+ AllUnits[nunitName]["Current Level"] + " to " + AllUnits[nunitName]["New Level"]);
							  return("building Updated" );

							  }
							  }
							  return("City" + Cities[ncityName]["Tiberium"] +", "+Cities[ncityName]["Crystal"]+", "+Cities[ncityName]["Power"]+", "+" Updated" );
							}
							
							}
						  } catch (e) {
							console.log("FlunikTools.Main.getInstance().updateCityCache: ", e);
						  }
						  
						},
						
						CityCount: 0,
						UnitCount: 0,
						Cities: null,
						/*updateOffUnitCache: function (city, unit, cCount, count) {
						  try {
						  var _this = FlunikTools.Main.getInstance();
							if(city && unit){
							_this.CityCount = cCount;
							var Cities = new Object();

							var cities = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities();
							for (var cindex in cities.d) {
							  _this.CityCount++;
							  var ncity = cities.d[cindex];
							  var ncityName = ncity.get_Name();
							  Cities[ncityName] = new Object();
							  Cities[ncityName]["ID"] = cindex;
							  Cities[ncityName]["Object"] = ncity;
							  Cities[ncityName]["Tiberium"] = ncity.GetResourceCount(ClientLib.Base.EResourceType.Tiberium);
							  Cities[ncityName]["Crystal"] = ncity.GetResourceCount(ClientLib.Base.EResourceType.Crystal);
							  Cities[ncityName]["Power"] = ncity.GetResourceCount(ClientLib.Base.EResourceType.Power);
							  if(unit){
							  _this.UnitCount = count;
							  var AllUnits = new Object();
							  var units = city.get_CityUnitsData();
							  var offenceUnits = units.get_OffenseUnits();
							  for (var uIndex in offenceUnits.d) {
							  _this.UnitCount; 
							  var nunit = offenceUnits.d[uIndex];
							  var nunitName = unit.get_UnitGameData_Obj().dn;
							  AllUnits[nunitName] = new Object();
							  AllUnits[nunitName]["ID"] = uIndex;
							  AllUnits[nunitName]["Object"] = unit;
							  AllUnits[nunitName]["Current Level"] = unit.get_CurrentLevel();
							  AllUnits[nunitName]["New Level"] = unit.get_CurrentLevel() + 1;
							  //return ("Unit" + nunitName +":"+ AllUnits[nunitName]["Current Level"] + " to " + AllUnits[nunitName]["New Level"]);
							  return("Unit Updated" );

							  }
							  
							  if(building){
							  _this.BuildingCount = count;
							  var AllBuildings = new Object();
							  var units = city.get_CityUnitsData();
							  var buildings = city.get_Buildings();
								for (var bIndex in buildings.d) {
							  _this.UnitCount; 
							  var nbuilding = buildings.d[bIndex];
							  var nunitName = building.get_UnitGameData_Obj().dn;
							  AllBuildings[nunitName] = new Object();
							  AllBuildings[nunitName]["ID"] = bIndex;
							  AllBuildings[nunitName]["Object"] = building;
							  AllBuildings[nunitName]["Current Level"] = building.get_CurrentLevel();
							  AllBuildings[nunitName]["New Level"] = building.get_CurrentLevel() + 1;
							  //return ("Unit" + nunitName +":"+ AllUnits[nunitName]["Current Level"] + " to " + AllUnits[nunitName]["New Level"]);
							  return("building Updated" );

							  }
							  
							}
							}
							}
						  } catch (e) {
							console.log("FlunikTools.Main.getInstance().updateOffUnitCache: ", e);
						  }
						},*/
						
						CityCount: 0,
						UnitCount: 0,
						Cities: null,
						updateDefUnitCache: function (city, unit, cCount, count) {
						  try {
						  var _this = FlunikTools.Main.getInstance();
							if(city && unit){
							_this.CityCount = cCount;
							var Cities = new Object();

							var cities = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities();
							for (var cindex in cities.d) {
							  _this.CityCount++;
							  var ncity = cities.d[cindex];
							  var ncityName = ncity.get_Name();
							  Cities[ncityName] = new Object();
							  Cities[ncityName]["ID"] = cindex;
							  Cities[ncityName]["Object"] = ncity;
							  Cities[ncityName]["Tiberium"] = ncity.GetResourceCount(ClientLib.Base.EResourceType.Tiberium);
							  Cities[ncityName]["Crystal"] = ncity.GetResourceCount(ClientLib.Base.EResourceType.Crystal);
							  Cities[ncityName]["Power"] = ncity.GetResourceCount(ClientLib.Base.EResourceType.Power);
							  if(unit){
							  _this.UnitCount = count;
							  var AllUnits = new Object();
							  var units = city.get_CityUnitsData();
							  var defenceUnits = units.get_DefenseUnits();
							  for (var nUnit in defenceUnits.d) {
							  _this.UnitCount; 
							  var nunit = defenceUnits.d[uIndex];
							  var nunitName = unit.get_UnitGameData_Obj().dn;
							  AllUnits[nunitName] = new Object();
							  AllUnits[nunitName]["ID"] = uIndex;
							  AllUnits[nunitName]["Object"] = unit;
							  AllUnits[nunitName]["Current Level"] = unit.get_CurrentLevel();
							  AllUnits[nunitName]["New Level"] = unit.get_CurrentLevel() + 1;
							  //return ("Unit" + nunitName +":"+ AllUnits[nunitName]["Current Level"] + " to " + AllUnits[nunitName]["New Level"]);
							  return("Unit Updated" );

							  }
							}
							}
							}
						  } catch (e) {
							console.log("FlunikTools.Main.getInstance().updateDefUnitCache: ", e);
						  }
						},
						
						CityCount: 0,
						UnitCount: 0,
						Cities: null,
						updateBuildingCache: function (city, building, cCount, count) {
						  try {
						  var _this = FlunikTools.Main.getInstance();
							if(city && building){
							_this.CityCount = cCount;
							var Cities = new Object();

							var cities = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities();
							for (var cindex in cities.d) {
							  _this.CityCount++;
							  var ncity = cities.d[cindex];
							  var ncityName = ncity.get_Name();
							  Cities[ncityName] = new Object();
							  Cities[ncityName]["ID"] = cindex;
							  Cities[ncityName]["Object"] = ncity;
							  Cities[ncityName]["Tiberium"] = ncity.GetResourceCount(ClientLib.Base.EResourceType.Tiberium);
							  Cities[ncityName]["Crystal"] = ncity.GetResourceCount(ClientLib.Base.EResourceType.Crystal);
							  Cities[ncityName]["Power"] = ncity.GetResourceCount(ClientLib.Base.EResourceType.Power);
							  if(building){
							  _this.BuildingCount = count;
							  var AllBuildings = new Object();
							  var units = city.get_CityUnitsData();
							  var buildings = city.get_Buildings();
								for (var bIndex in buildings.d) {
							  _this.UnitCount; 
							  var nbuilding = buildings.d[bIndex];
							  var nunitName = building.get_UnitGameData_Obj().dn;
							  AllBuildings[nunitName] = new Object();
							  AllBuildings[nunitName]["ID"] = bIndex;
							  AllBuildings[nunitName]["Object"] = building;
							  AllBuildings[nunitName]["Current Level"] = building.get_CurrentLevel();
							  AllBuildings[nunitName]["New Level"] = building.get_CurrentLevel() + 1;
							  //return ("Unit" + nunitName +":"+ AllUnits[nunitName]["Current Level"] + " to " + AllUnits[nunitName]["New Level"]);
							  return("building Updated" );

							  }
							}
							}
							}
						  } catch (e) {
							console.log("FlunikTools.Main.getInstance().updateDefUnitCache: ", e);
						  }
						},
						
						totalRepairTime: function (city, airRT, vehRT, infRT) {
						
						
						if ((airRT > 0) && (vehRT > 0) && (infRT > 0)){
						var totalRT = 1/((1/airRT)+(1/vehRT)+(1/infRT));
						
						return (totalRT);
						}
						
						if ((airRT < 1 )&& (vehRT > 0) && (infRT > 0)){
						var totalNoAirRT = 1/((1/vehRT)+(1/infRT));
						return (totalNoAirRT);
						}
						
						if ((airRT > 0) && (vehRT < 1 )&& (infRT > 0)){
							var totalNoVehRT = 1/((1/airRT)+(1/infRT));
						return (totalNoVehRT);
						}
						
						if ((airRT > 0) && (vehRT > 0 )&& (infRT < 1)){
						var totalNoInfRT = 1/((1/airRT)+(1/vehRT));
						return (totalNoInfRT);
						}
						
						
						},
						
						distanceFromCenter: function (city){
							//type this into console log of the page to read this function: var city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity();window.FlunikTools.Main.getInstance().distanceFromCenter(city);
							if(city){
								var cityX = city.get_PosX();
								var cityY = city.get_PosY();
								var x = 500;
								var y = 500;
								var title = "You are here{";
								var NQuad = "North";
								var EQuad = "East";
								var SQuad = "South";
								var WQuad = "West";
								var run;
								var rise;
								var dist = Math.sqrt( ( Math.pow( ( cityX - x ) ,2 ) ) + ( Math.pow( ( cityY - y ) ,2 ) ) );
								
								var totdis = "Total Dist:"+ Math.round(dist);
								
								
								//slope= ( rise / run  );
								//y - y1 = m(x -x1);
								//standard
								//console.log("y = (" + rise + " / " + run + ")*(x - " + x + ") + " + y + ";");
								//console.log("y = (" + rise + " / " + run + ")*(x - " + cityX + ") + " + cityY + ";");
								
								
								//y = North +500 - 500 farthest away is 0
								//x = East 500 + 500 farthest away is 1000
								//-y = South 500 +500 farthest away is 1000
								//-x = West +500 - 500 farthest away is 0
								if (cityX > x && cityY > y){
								var rise = ( cityY - y);
								var run = (cityX - x);
								var distxy = "}Distance coords:(x,y): ("+  run +", "+ rise+")";
								
								var postion =title +" "+ SQuad +" "+ EQuad +" "+ cityX +" "+ cityY +" "+ distxy +" "+ totdis ;
								return (postion);
								}
								
								if (cityX > x && cityY < y){
								var rise = (y - cityY);
								var run = (cityX - x);
								var distxy = "}Distance coords:(x,y): ("+  run +", "+ rise+")";
								
								var postion =title +" "+ NQuad +" "+ EQuad +" "+ cityX +" "+ cityY +" "+ distxy + " " + totdis;
								return (postion);
								}
								
								if (cityX < x && cityY > y){
								var rise = (cityY - y);
								var run = (x - cityX);
								var distxy = "}Distance coords:(x,y): ("+  run +", "+ rise+")";
								
								var postion =title +" "+ SQuad +" "+ WQuad +" "+ cityX +" "+ cityY +" "+ distxy + " " + totdis;
								return (postion);
								}
								
								if (cityX < x && cityY < y){
								var rise = (y - cityY);
								var run = (x - cityX);
								var distxy = "}Distance coords:(x,y): ("+  run +", "+ rise+")";
								
								var postion =title +" "+ NQuad +" "+ WQuad  +" "+ cityX +" "+ cityY  +" "+ distxy + " " + totdis;
								return (postion);
								}
							
							
							}
						},
						
						cityDefUnitInfo: function (unit, city){
							var x = 1;
							if (x = 1){
							var posX = unit.get_CoordX();
							var posY = unit.get_CoordY();
							var nextlvl = unit.get_CurrentLevel() + 1;
							var title = "Upgraded Def ";
							//var cInfo = "City Name: {"+ city.m_SupportDedicatedBaseName + "} City Level: {" + city.m_Level + "}" + _this.distanceFromCenter(city) + "Def.level: {" + city.get_LvlDefense() + ;
							var uInfo =title + " " + city.m_SupportDedicatedBaseName + " " +  unit.get_UnitGameData_Obj().dn +" "+ unit.get_CurrentLevel() + " to: " + nextlvl + " Placement ("+ posX +", "+ posY +")";
							return (uInfo);
							}
						},

						cityOffUnitInfo: function (unit, city){
							var x = 1;
							if(x = 1){
							var posX = unit.get_CoordX();
							var posY = unit.get_CoordY();
							var nextlvl = ( unit.get_CurrentLevel() + 1);
							var title = "Upgraded Off ";
							//var cInfo = "City Name: {" + city.m_SupportDedicatedBaseName + "} City Level: {" + city.m_Level + "}"+ _this.distanceFromCenter(city)"Off.lvl:{" + city.get_LvlOffense() + "}";
							var uInfo =title + " " +city.m_SupportDedicatedBaseName + " " +  unit.get_UnitGameData_Obj().dn +" "+ unit.get_CurrentLevel() + " to: " + nextlvl+ " Placement ("+ posX +", "+ posY +")";
							
							return (uInfo);
							}
						},
						
						cityBuildingInfo: function (building, city){
							var x = 1;
							if(x = 1){
							var posX = building.get_CoordX();
							var posY = building.get_CoordY();
							var nextlvl = ( building.get_CurrentLevel() + 1);
							var title = "Upgraded building ";
							//var cInfo = "City Name: {" + city.m_SupportDedicatedBaseName + "} City Level: {" + city.m_Level + "}"+ _this.distanceFromCenter(city)"Off.lvl:{" + city.get_LvlOffense() + "}";
							var bInfo =title + " " +city.m_SupportDedicatedBaseName + " " +  building.get_UnitGameData_Obj().dn +" "+ building.get_CurrentLevel() + " to: " + nextlvl + " Placement ("+ posX +", "+ posY +")";
							
							return (bInfo);
							}
						},
 

 
						buildingsToUpdate: null,
 
						startAutoUpdate: function (_buildingsToUpdate) {
							if (_buildingsToUpdate == 'undefined' || _buildingsToUpdate != null) {
								//This is the second list of building names 
                                _buildingsToUpdate == "Construction Yard, Command Center, Defense HQ, Defense Facility, Barracks, Factory, Airfield, Accumulator, Silo, Refinery, Power Plant, Harvester, Blade of Kane, Eye of Kane, Fist of Kane, Falcon Support, Ion Cannon Support, Skystrike Support, War Factory, Hand of Nod, Airport";
							}
							this.buildingsToUpdate = _buildingsToUpdate;
							this.autoUpgrade();
							this.autoUpdateHandle = window.setInterval(this.autoUpgrade, 15000);
						},
						stopAutoUpdate: function () {
							window.clearInterval(this.autoUpdateHandle);
							this.autoUpdateHandle = null;
						},
 
						autoUpgrade: function () {
						
						var _this = FlunikTools.Main.getInstance();
							for (var nCity in ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d) {
							
								//console.log(nCity);
								
								//This is the all city loop 
								var city = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d[nCity];
								//var buildings = city.get_CityBuildingsData().get_Buildings();
								var x = 0;
									//for(var x; x < 1 ; x++){
										var cCount = x;
								var baseName = city.m_SupportDedicatedBaseName; 
								
								var deflvl = city.get_LvlDefense();
								var offlvl = city.get_LvlOffense();
								var baselvl = city.get_LvlBase();
								
								var airRT = city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false);
								var vehRT = city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false);
								var infRT = city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, false);
								var defRT = city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Defense, false);
								
								var tib = ClientLib.Base.EResourceType.Tiberium;
								var cry = ClientLib.Base.EResourceType.Crystal;
								var pow = ClientLib.Base.EResourceType.Power;
								//????var currenttibpct = Math.round(100*city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)/city.GetResourceMaxStorage(ClientLib.Base.EResourceType.Tiberium)); right?
								/*var currenttibpct = Math.round(10000*city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium)/city.GetResourceMaxStorage(ClientLib.Base.EResourceType.Tiberium))/100 ;
								var currentcrypct = Math.round(10000*city.GetResourceCount(ClientLib.Base.EResourceType.Crystal)/city.GetResourceMaxStorage(ClientLib.Base.EResourceType.Crystal))/100 ;
								var currentpowpct = Math.round(10000*city.GetResourceCount(ClientLib.Base.EResourceType.Power)/city.GetResourceMaxStorage(ClientLib.Base.EResourceType.Power))/100 ;
								*///????
								var tibCurrentAmount = city.GetResourceCount(tib);
								var cryCurrentAmount = city.GetResourceCount(cry);
								var powCurrentAmount = city.GetResourceCount(pow);
								
								var tibCurrentStorage = city.GetResourceMaxStorage(tib);
								var cryCurrentStorage = city.GetResourceMaxStorage(cry);
								var powCurrentStorage = city.GetResourceMaxStorage(pow);
								
							
							
								
								
								
								
								
								//if (!city.CanRepairAll(ClientLib.Vis.Mode.City))continue;
								//console.log(ClientLib.Vis.World.WorldMapMarker.UpdateCityData(city ,city.get_CoordX() ,city.get_CoordY()));
								
								//console.log(city.get_CityRepairData().UpdateCachedFullRepairAllCost(ClientLib.Vis.Mode.ArmySetup));city.GetResourceCount(city.get_RepairOffenseResources().get_RepairChargeOffense())unit.GetResourceCostForFullRepair().d
								
								//console.log(_this.totalRepairTime(city));
								      
								// if (baseName != "Placeyourbasenamehere"){
								//^^Doing this here will stop the base from upgrading altogether
								//console.log("City Name :"+ baseName + "City Level: " + city.get_CurrentLevel() + "Offense level: {" + city.get_LvlOffense() + "} Defense level: {" + city.get_LvlDefense() + "}");
								//console.log("T: " + tibCurrentAmount + "/ TMax: "+ tibCurrentStorage + " C: " + cryCurrentAmount + "/ CMax: " + cryCurrentStorage + "P: " + powCurrentAmount + "/ PMax:" + powCurrentStorage );
								//console.log("Total Repair Time: " + _this.totalRepairTime);
								//console.log(" ");
								//I haven't done much with the offence or defence but the same role applies, but the names are not being pulled. if you want to turn on or off the Off or D just change the inequality sign.+(_this.totalRepairTime(city)/unit.BOUKAK[1].Count))
								
								var units = city.get_CityUnitsData();
								var offenceUnits = units.get_OffenseUnits();
								//if (city.CanRepairAll(ClientLib.Vis.Mode.ArmySetup) != true)continue;
								for (var nUnit in offenceUnits.d) {
									try{
									var x = 0;
									for(var x; x < 1 ; x++){
										var count = x;
									var unit = offenceUnits.d[nUnit];
									
									//console.log(unit.get_UnitLevelRepairRequirements()[0].Count );
									if (!_this.canUpgradeUnit(unit, city)) continue; //KRS_L
									var name = unit.get_UnitGameData_Obj().dn;
									var baselvl = city.get_LvlBase();
									var unitlvl = unit.get_CurrentLevel();
									var nLevel = unitlvl + 1;
									var unitRepairCost = unit.get_UnitLevelRepairRequirements()[0].Count;
									var unitRepairTime = unit.get_UnitLevelRepairRequirements()[1].Count;
									//var offCurrentRepairCost = city.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeAir);
									var highestUnitLevel = units.get_HighestLVlForUnitGroupTypes().d[0];
									var unitCryCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj(nLevel, unit.get_UnitGameData_Obj())[0].Count;
									//var unitPowCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj(nLevel, unit.get_UnitGameData_Obj())[1].Count;
									
									
									var unitRepairRatio = unitRepairTime/_this.totalRepairTime(city, airRT, vehRT, infRT);
									var unit_obj = {
										cityid: city.get_Id(),
										unitId: unit.get_Id()
									};
									
									//console.log(ClientLib.Base.ResourceCost.ctor());
									//This is the upgrade part, you can change the inequality sign to: <,>,=, !=, <=, >=. 
									//                       current resource is 50% of the max storage                        if you buy 2 of the selected unit 
									
									if(ClientLib.Base.EUnitType.Infantry){
									if (  (( cryCurrentAmount > cryCurrentStorage*0.05 ) && ((  cryCurrentAmount/unitCryCost)> 4 )  && (nLevel <= highestUnitLevel) ) || (( unitRepairRatio>1 ) && ( cryCurrentAmount > cryCurrentStorage*0.05 ) && ((  cryCurrentAmount/unitCryCost)> 2 )) ) {
										ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UnitUpgrade", unit_obj, null, null, true);
										//console.log(unit);
										console.log(_this.cityOffUnitInfo(unit, city)+ " unitRT/TotalRT " + unitRepairRatio.toFixed(3)+" "+ _this.updateCityCache(city, unit, null, cCount, count));
										
										}
										}continue;
								 _this.updateCityCache(city, unit, null, cCount, count)
								if(ClientLib.Base.EUnitType.Tank){
								if (  (( cryCurrentAmount > cryCurrentStorage*0.05 ) && ((  cryCurrentAmount/unitCryCost)> 4 )  && (nLevel <= highestUnitLevel) ) || (( unitRepairRatio>1 ) && ( cryCurrentAmount > cryCurrentStorage*0.05 ) && ((  cryCurrentAmount/unitCryCost)> 2 )) ) {
										ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UnitUpgrade", unit_obj, null, null, true);
										//console.log(unit);
										console.log(_this.cityOffUnitInfo(unit, city)+ " unitRT/TotalRT " + unitRepairRatio.toFixed(3)+" "+ _this.updateCityCache(city, unit, null, cCount, count));
										_this.updateCityCache(city, cCount);
										}
										}continue;
								 _this.updateCityCache(city, unit, null, cCount, count)
								if(ClientLib.Base.EUnitType.Air){
								if (  (( cryCurrentAmount > cryCurrentStorage*0.05 ) && ((  cryCurrentAmount/unitCryCost)> 4 )  && (nLevel <= highestUnitLevel) ) || (( unitRepairRatio>1 ) && ( cryCurrentAmount > cryCurrentStorage*0.05 ) && ((  cryCurrentAmount/unitCryCost)> 2 )) ) {
										ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UnitUpgrade", unit_obj, null, null, true);
										//console.log(unit);
										console.log(_this.cityOffUnitInfo(unit, city)+ " unitRT/TotalRT " + unitRepairRatio.toFixed(3)+" "+ _this.updateCityCache(city, unit, null, cCount, count));
										_this.updateCityCache(city, cCount);
										}
										}continue;	
										_this.updateCityCache(city, unit, null, cCount, count)
												//_this.updateCityCache;continue;
												
									
									
									
									}
								}catch (e) {
										console.log("This crashed FlunikTools Off: ", e);
									}
								}
								if(city){
									_this.updateCityCache(city, cCount);
								}
 
								var defenceUnits = units.get_DefenseUnits();
								//if (city.CanRepairAll(ClientLib.Vis.Mode.DefenseSetup) != true)continue;
								for (var nUnit in defenceUnits.d) {
									try{
									var x = 0;
									for(var x; x < 1 ; x++){
										var count = x;
									var unit = defenceUnits.d[nUnit];
									//console.log(unit.get_UnitGameData_Obj().dn);
									if (!_this.canUpgradeUnit(unit, city)) continue; //KRS_L
									var name = unit.get_UnitGameData_Obj().dn;
									var baselvl = city.get_LvlBase();
									var unitlvl = unit.get_CurrentLevel();
									var nLevel = unitlvl + 1;
									var unitRepairCost = unit.get_UnitLevelRepairRequirements()[0].Count;
									var unitRepairTime = unit.get_UnitLevelRepairRequirements()[1].Count;
									//var offCurrentRepairCost = city.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeAir);
									var highestUnitLevel = units.get_HighestLVlForUnitGroupTypes().d[0];
									var unitCryorTibCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj(nLevel, unit.get_UnitGameData_Obj())[0].Count;
									//var unitPowCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj(nLevel, unit.get_UnitGameData_Obj())[1].Count;
									
									var unit_obj = {
										cityid: city.get_Id(),
										unitId: unit.get_Id()
									};
									
									//ClientLib.Base.EUnitType Structure
									
									var unitRepairRatio = unitRepairTime/_this.totalRepairTime(city, airRT, vehRT, infRT);
									
									
									if(ClientLib.Base.EUnitType.Infantry){
										
									if (  (( cryCurrentAmount > cryCurrentStorage*0.05 ) && ((  tibCurrentAmount/unitCryorTibCost)> 4 )  && (nLevel <= highestUnitLevel) ) || (( unitRepairRatio>1 ) && ( cryCurrentAmount > cryCurrentStorage*0.05 ) && ((  cryCurrentAmount/unitCryCost)> 2 )) ) {
										
										//console.log(unit);
										ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UnitUpgrade", unit_obj, null, null, true);
										
												console.log(_this.cityDefUnitInfo(unit, city)+ " " + _this.updateCityCache(city, unit, null, cCount, count));
										
										}
										}continue;
										_this.updateCityCache(city, unit, null, cCount, count);
									if(ClientLib.Base.EUnitType.Tank){
									


									if (  (( cryCurrentAmount > cryCurrentStorage*0.05 ) && ((  cryCurrentAmount/unitCryorTibCost)> 4 )  && (nLevel <= highestUnitLevel) ) || (( unitRepairRatio>1 ) && ( cryCurrentAmount > cryCurrentStorage*0.05 ) && ((  cryCurrentAmount/unitCryCost)> 2 )) ) {
										ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UnitUpgrade", unit_obj, null, null, true);
										//console.log(unit);
										
										console.log(_this.cityDefUnitInfo(unit, city)+ " " + _this.updateCityCache(city, unit, null, cCount, count));
										
										}
										}continue;
										
										_this.updateCityCache(city, unit, null, cCount, count);
									if(ClientLib.Base.EUnitType.Structure){
									



									if (  (( tibCurrentAmount > tibCurrentStorage*0.05 ) && ((  tibCurrentAmount/unitCryorTibCost)> 4 )  && (nLevel <= highestUnitLevel) ) || (( unitRepairRatio>1 ) && ( tibCurrentAmount > tibCurrentStorage*0.05 ) && ((  tibCurrentAmount/unitCryCost)> 2 )) ) {
										ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UnitUpgrade", unit_obj, null, null, true);
										//console.log(unit);
										
										console.log(_this.cityDefUnitInfo(unit, city)+ " " + _this.updateCityCache(city, unit, null, cCount, count));
									
										}
										}continue;
										_this.updateCityCache(city, unit, null, cCount, count);	
									
										
									}
									}catch (e) {
										console.log("This crashed FlunikTools Def: ", e);
									};
								}
								
								//This is the building loop.
								var buildings = city.get_Buildings();
								for (var nBuildings in buildings.d) {
								try{
								var x = 0;
									for(var x; x < 1 ; x++){
										var count = x;
										
									var building = buildings.d[nBuildings];
									//console.log(building.GetUniqueBuildingByTechName());
									var nLevel = building.get_CurrentLevel()+1;
									//console.log( ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj( nLevel, building.get_TechGameData_Obj() )[1].Count);
									if (!_this.canUpgradeBuilding(building, city)) continue; //KRS_L
									var name = building.get_UnitGameData_Obj().dn; //This is where is grabs the name of the building.
									//var name = building.GetUniqueBuildingByTechName(tech);
									
									
									var buildinglvl = building.get_CurrentLevel();
									var blvlHigh = baselvl + 5.00;
									var blvlLow = baselvl + 3.00;
									var buildingTibCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj( nLevel, building.get_TechGameData_Obj() )[0].Count;
									//var buildingPowCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj( nLevel, building.get_TechGameData_Obj() )[1].Count
									 
									//My idea pool.
									
									//Need to fix the the upgrade bomb need it to do bases indiviually instead of all at once.
									if ((city.GetResourceCount(tib) > (city.GetResourceMaxStorage(tib)*0.75))&&((city.GetResourceCount(tib)/buildingTibCost)>1))continue; 
									//if (name == "Silo" || name == "Accumulator" || name == "Command Center" || name == "Defence HQ" ) {
									if (window.FlunikTools.Main.getInstance().buildingsToUpdate.indexOf(name) != -1) {
										//if (name == "Silo") {
										
										//This is the editable area you can input your own choices by saying if name of building and building level is lower or higher than base level then upgrade.
										//I'm working on other options so bare with me, I work 3 jobs and go to college.
										//you can change the inequality sign to: <,>,=, !=, <=, >=. 
										
										//These are the building names that is pulled from the .get_UnitGameData_Obj().dn:
										//War Factory,Hand of Nod,Airport Construction Yard, Command Center, Defense HQ, Defense Facility, Barracks, Factory, Airfield, Accumulator, Silo, Refinery, Power Plant, Harvester, Blade of Kane, Eye of Kane, Fist of Kane, Falcon Support, Ion Cannon Support, Skystrike Support    
									    
										
										  
										  
										  // for a string of bases do this instead:
										  //if((baseName != "YourFirstBaseName")||(baseName != "YourSecondBaseName")){
										  
										  //This if statement is incase the program crashes and you want to stop a specific baseor string of bases from upgrading, because you have more than five bases the game may crash while running this script. 
										  //you have to put the  actual base name in quotes like I did. with my base name in there it does nothing special to the game. 
										  //***Notice this is the building section just cut it off here and Def and Off will keep upgrading but not the buildings***
										 
										 //if ((city.GetResourceCount(tib) > (city.GetResourceMaxStorage(tib)*0.75))&&((city.GetResourceCount(tib)/buildingTibCost)>1))continue; 
										 //Start of Rt buildings {
										 if(	(name == "War Factory" || name =="Factory")	&& ((vehRT >= infRT) && (vehRT >= airRT)) ){
										  
										  var building_obj = {
											cityid: city.get_Id(),
											buildingid: building.get_Id(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
											};
										  
										  ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", building_obj, null, null, true); 
                                             
												
												console.log(_this.cityBuildingInfo(building, city)+ " "+ _this.updateCityCache(city, null, building, cCount, count));  
												//console.log( "Building Upgraded and Previous upgraded lvl :");
												//console.log("City Name: {"+ city.m_SupportDedicatedBaseName +"} Base level: {"+ baselvl + "}")
												//console.log("Building name: {" + name  + "} Building Current level: [" + building.get_CurrentLevel() + "] New Building Level: [" + newbuildinglvl + "] Coordinates (x,y)= (" + building.get_CoordX() + ", " + building.get_CoordY() + ")"); 
                                                //console.log("Tiberium Cost: {"+tibCost+"}");
												//console.log( "Offense level: {" + city.get_LvlOffense() + "} Defense level: {" + city.get_LvlDefense() + "}");
												//console.log("Air repair time: " + airRT + " in seconds. Vehical repair time: " + vehRT + " in seconds. Infantry repair time: " + infRT + " in seconds.");
												//console.log(" ");
										 
										  }
										  
										  _this.updateCityCache(city, null, building, cCount, count)
										  if(	(name =="Hand of Nod" ||  name =="Barracks") &&	((infRT >= airRT) && (infRT >= vehRT)) ){
										  var building_obj = {
											cityid: city.get_Id(),
											buildingid: building.get_Id(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
											};
										  
										  ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", building_obj, null, null, true); 
                        
												console.log(_this.cityBuildingInfo(building, city)+ " "+ _this.updateCityCache(city, null, building, cCount, count));                        
										  
										  }
        								 
										 _this.updateCityCache(city, null, building, cCount, count)
										 if(	(name =="Airport" || name =="Airfield") && ((airRT >= infRT) && (airRT >= vehRT))	)	{
										 
										 var building_obj = {
											cityid: city.get_Id(),
											buildingid: building.get_Id(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
											};
											
											ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", building_obj, null, null, true); 
                                              
												console.log(_this.cityBuildingInfo(building, city)+ " "+ _this.updateCityCache(city, null, building, cCount, count)); 
											
											}
											// End of Rt Buildings }
											_this.updateCityCache(city, null, building, cCount, count)
											//Start of Unit development buildings
										  if (	(name == "Construction Yard"|| name =="Command Center" || name =="Defense HQ" ||  name =="Defense Facility") && (buildinglvl < blvlLow)	){
										  
										  var building_obj = {
											cityid: city.get_Id(),
											buildingid: building.get_Id(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
											};
										  
										  ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", building_obj, null, null, true); 
                                            
												console.log(_this.cityBuildingInfo(building, city)+ " "+ _this.updateCityCache(city, null, building, cCount, count));  
										  
										  }
										  //End of unit development buildings
										 _this.updateCityCache(city, null, building, cCount, count)
										 //Start of Storage buildings
										  if (	(name =="Accumulator" || name =="Silo") && (buildinglvl <= blvlHigh)&&((city.GetResourceCount(tib)/buildingTibCost)>2)	){
										  
										  var building_obj = {
											cityid: city.get_Id(),
											buildingid: building.get_Id(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
											};
										  
										  ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", building_obj, null, null, true); 
                                              
												console.log(_this.cityBuildingInfo(building, city)+ " "+ _this.updateCityCache(city, null, building, cCount, count));   
										  
										  }
										  //End of storage buildings
										  _this.updateCityCache(city, null, building, cCount, count)
										  //Start of Resouce Buildings
										  if (	(name =="Harvester") && (buildinglvl <= blvlLow)&&((city.GetResourceCount(tib)/buildingTibCost)>4)	){
										  
										  var building_obj = {
											cityid: city.get_Id(),
											buildingid: building.get_Id(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
											};
											
											ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", building_obj, null, null, true); 
                                            
												console.log(_this.cityBuildingInfo(building, city)+ " "+ _this.updateCityCache(city, null, building, cCount, count));  
											
											}
											_this.updateCityCache(city, null, building, cCount, count)
											if (	(name == "PowerPlant" ) && (buildinglvl <= blvlLow)&&((city.GetResourceCount(tib)/buildingTibCost)>3)	){
										  
										  var building_obj = {
											cityid: city.get_Id(),
											buildingid: building.get_Id(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
											};
											
											ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", building_obj, null, null, true); 
                                              
												console.log(_this.cityBuildingInfo(building, city)+ " "+ _this.updateCityCache(city, null, building, cCount, count));   
												
											}
											_this.updateCityCache(city, null, building, cCount, count)
											if (	(name =="Refinery") && (buildinglvl <= blvlLow)&&((city.GetResourceCount(tib)/buildingTibCost)>2)	){
										  
										  var building_obj = {
											cityid: city.get_Id(),
											buildingid: building.get_Id(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
											};
											
											ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", building_obj, null, null, true); 
                                              
												console.log(_this.cityBuildingInfo(building, city)+ " "+ _this.updateCityCache(city, null, building, cCount, count));  
											
											}
											_this.updateCityCache(city, null, building, cCount, count)
											
											//End of Resourse Buildings
											
											//Start of support buildings
										  if (name =="Blade of Kane"|| name =="Eye of Kane"|| name =="Fist of Kane"|| name =="Falcon Support"|| name =="Ion Cannon Support"|| name =="Skystrike Support"){
										  
										  var building_obj = {
											cityid: city.get_Id(),
											buildingid: building.get_Id(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
											};
										  
										  ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", building_obj, null, null, true); 
                                              
												console.log(_this.cityBuildingInfo(building, city)+ " "+ _this.updateCityCache(city, null, building, cCount, count));  
										  
										  }
										  //End of support buildings
_this.updateCityCache(city, null, building, cCount, count)
											//}
									//}
									}
								}
								}catch (e) {
								if(count > 5){
										console.log("This crashed FlunikTools Bld: ", e);
									}
									else{console.log("This crashed FlunikTools Bld: ", e);}
									}
								}
								//}
							//}
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
					console.log(" ");
					console.log("[FlunikTools Wrapper]");
 
					for (var key in ClientLib.Data.CityBuilding.prototype) { //KRS_L
						if (ClientLib.Data.CityBuilding.prototype[key] !== null) {
							var strFunction = ClientLib.Data.CityBuilding.prototype[key].toString();
							//console.log(strFunction);
							//if (typeof ClientLib.Data.CityBuilding.prototype[key] === 'function' & strFunction.indexOf("true).l.length==0)){return true;}}return false") > -1) {
							if (typeof ClientLib.Data.CityBuilding.prototype[key] === 'function' & strFunction.indexOf("true).l.length==0))") > -1){	
								ClientLib.Data.CityBuilding.prototype.CanUpgrade = ClientLib.Data.CityBuilding.prototype[key];
								console.log("ClientLib.Data.CityBuilding.prototype.CanUpgrade = ClientLib.Data.CityBuilding.prototype[" +key+"]");
								break;
							}
						}
					}
 
					for (var key in ClientLib.Data.CityUnit.prototype) { //KRS_L
						if (ClientLib.Data.CityUnit.prototype[key] !== null) {
							var strFunction = ClientLib.Data.CityUnit.prototype[key].toString();
							if (typeof ClientLib.Data.CityUnit.prototype[key] === 'function' & strFunction.indexOf(".l.length>0)){return false;}") > -1) {
								ClientLib.Data.CityUnit.prototype.CanUpgrade = ClientLib.Data.CityUnit.prototype[key];
								console.log("ClientLib.Data.CityUnit.prototype.CanUpgrade = ClientLib.Data.CityUnit.prototype[" +key+"]");
								break;
							}
						}
					}
					console.log("[FlunikTools Wrapper]");
					console.log(" ");
 
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