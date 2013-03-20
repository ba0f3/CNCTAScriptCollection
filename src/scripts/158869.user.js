// ==UserScript==
// @name        C&C Tiberium Alliances Flunik Tools: Custom AutoUpgrade
// @namespace   AutoUpgrade
// @description Only uses the AutoUpgrade Feature For C&C Tiberium Alliances
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @author      Flunik dbendure RobertT KRS_L Trekker9876 
// @version     0.5.7.03
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
									//window.FlunikTools.Main.getInstance().startAutoUpdate("Construction Yard, Command Center, Defense HQ, Defense Facility, Barracks, Factory, Airfield, Accumulator, Silo, Refinery, Power Plant, Harvester, Blade of Kane, Eye of Kane, Fist of Kane");
									//This is the first list of building names if I still missed something let me know
                                    window.FlunikTools.Main.getInstance().startAutoUpdate("Construction Yard, Command Center, Defense HQ, Defense Facility, Barracks, Factory, Airfield, Accumulator, Silo, Refinery, Power Plant, Harvester, Blade of Kane, Eye of Kane, Fist of Kane, Falcon Support, Ion Cannon Support, Skystrike Support, War Factory, Hand of Nod, Airport");
									//window.FlunikTools.Main.getInstance().startAutoUpdate(this.buildingsToUpdate);
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
							for (var nCity in ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d) {
								var x = 0;
									for(var x; x < 1 ; x++){
										var count = x;
								//This is the all city loop 
								var city = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d[nCity];
								//var buildings = city.get_CityBuildingsData().get_Buildings();
								var buildings = city.get_Buildings();
								var baseName = city.m_SupportDedicatedBaseName; 
								
								var deflvl = city.get_LvlDefense();
								var offlvl = city.get_LvlOffense();
								var baselvl = city.get_LvlBase();
								
								var airRT = city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false);
								var vehRT = city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false);
								var infRT = city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, false);
								
								      
								// if (baseName != "Placeyourbasenamehere"){
								//^^Doing this here will stop the base from upgrading altogether
								
								//I haven't done much with the offence or defence but the same role applies, but the names are not being pulled. if you want to turn on or off the Off or D just change the inequality sign.
								var units = city.get_CityUnitsData();
								var offenceUnits = units.get_OffenseUnits();
								for (var nUnit in offenceUnits.d) {
									var x = 0;
									for(var x; x < 1 ; x++){
										var count = x;
									var unit = offenceUnits.d[nUnit];
									if (!unit.CanUpgrade()) continue; //KRS_L
									var nameOne = unit.get_UnitGameData_Obj().dn;
									var baselvl = city.get_LvlBase();
									var unitlvl = unit.get_CurrentLevel();
									var unit_obj = {
										cityid: city.get_Id(),
										unitId: unit.get_Id()
									};
									//This is the upgrade part, you can change the inequality sign to: <,>,=, !=, <=, >=. 
									if (offlvl>baselvl||offlvl<baselvl) {
										ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UnitUpgrade", unit_obj, null, null, true);
										//console.log(unit);
										var newoffunitlvl = unit.get_CurrentLevel() + 1;
										console.log( "Offence Upgraded and Previous upgraded lvl :"); 
												console.log("City Name: {"+ city.m_SupportDedicatedBaseName + "} Offense unit name: {" + nameOne + "} Offence unit level: {" + unit.get_CurrentLevel()  +"} Offence unit new level: {" + newoffunitlvl  + "} Coordinates (x,y)= (" + unit.get_CoordX() + ", " + unit.get_CoordY() + ")"); 
                                                console.log( "Offense level: {" + city.get_LvlOffense() + "} Defense level: {" + city.get_LvlDefense() + "}") 
												console.log("Air repair time: " + airRT + " in seconds. Vehical repair time: " + vehRT + " in seconds. Infantry repair time: " + infRT + " in seconds.");
												console.log(" ");break;
												
									}
									}
								}
 
								var defenceUnits = units.get_DefenseUnits();
								for (var nUnit in defenceUnits.d) {
									var x = 0;
									for(var x; x < 1 ; x++){
										var count = x;
									var unit = defenceUnits.d[nUnit];
									if (!unit.CanUpgrade()) continue; //KRS_L
									var nameTwo = unit.get_UnitGameData_Obj().dn;
									var baselvl = city.get_LvlBase();
									var unitlvl = unit.get_CurrentLevel();
									var unit_obj = {
										cityid: city.get_Id(),
										unitId: unit.get_Id()
									};
									
									if (deflvl < baselvl||deflvl>baselvl) {
										ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UnitUpgrade", unit_obj, null, null, true);
										//console.log(unit);
										var newdefunitlvl = unit.get_CurrentLevel() + 1;
										console.log( "Defence Upgraded and Previous upgraded lvl :");
												console.log("City Name: {"+ city.m_SupportDedicatedBaseName + "} Defence unit name: {" + nameTwo  + "} Defence unit level: [" + unit.get_CurrentLevel()+ "} Defence unit new level: [" + newdefunitlvl+ "] Coordinates (x,y)= (" + unit.get_CoordX() + ", " + unit.get_CoordY() + ")"); 
                                                console.log( "Offense level: {" + city.get_LvlOffense() + "} Defense level: {" + city.get_LvlDefense() + "}")
												console.log("Air repair time: " +  airRT + " in seconds. Vehical repair time: " + vehRT + " in seconds. Infantry repair time: " + infRT + " in seconds.");
												console.log(" ");break;
										
										}
									}
								}
								
								//This is the building loop.
								for (var nBuildings in buildings.d) {
								var x = 0;
									for(var x; x < 1 ; x++){
										var count = x;
									var building = buildings.d[nBuildings];
									if (!building.CanUpgrade()) continue; //KRS_L
									var name = building.get_UnitGameData_Obj().dn; //This is where is grabs the name of the building.
									
									
									var buildinglvl = building.get_CurrentLevel();
									var blvlHigh = baselvl + 5.00;
									var blvlLow = baselvl - 5.00;
									//var tibCost = building.GetResourceData(ClientLib.Base.EResourceType.Tiberium);
									 
									//My idea pool.
									
									//Need to fix the the upgrade bomb need it to do bases indiviually instead of all at once.
									
									//if (name == "Silo" || name == "Accumulator" || name == "Command Center" || name == "Defence HQ" ) {
									if (window.FlunikTools.Main.getInstance().buildingsToUpdate.indexOf(name) != -1) {
										//if (name == "Silo") {
										
										//This is the editable area you can input your own choices by saying if name of building and building level is lower or higher than base level then upgrade.
										//I'm working on other options so bare with me, I work 3 jobs and go to college.
										//you can change the inequality sign to: <,>,=, !=, <=, >=. 
										
										//These are the building names that is pulled from the .get_UnitGameData_Obj().dn:
										//War Factory,Hand of Nod,Airport Construction Yard, Command Center, Defense HQ, Defense Facility, Barracks, Factory, Airfield, Accumulator, Silo, Refinery, Power Plant, Harvester, Blade of Kane, Eye of Kane, Fist of Kane, Falcon Support, Ion Cannon Support, Skystrike Support    
									    
										
										  
										  //if (baseName != "Placeyourbasenamehere"){
										  // for a string of bases do this instead:
										  //if((baseName != "YourFirstBaseName")||(baseName != "YourSecondBaseName")){
										  
										  //This if statement is incase the program crashes and you want to stop a specific baseor string of bases from upgrading, because you have more than five bases the game may crash while running this script. 
										  //you have to put the  actual base name in quotes like I did. with my base name in there it does nothing special to the game. 
										  //***Notice this is the building section just cut it off here and Def and Off will keep upgrading but not the buildings***
										 
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
                                              var newbuildinglvl = building.get_CurrentLevel() + 1;
												console.log( "Building Upgraded and Previous upgraded lvl :");
												console.log("City Name: {"+ city.m_SupportDedicatedBaseName +"} Base level: {"+ baselvl + "}")
												console.log("Building name: {" + name  + "} Building Current level: [" + building.get_CurrentLevel() + "] New Building Level: [" + newbuildinglvl + "] Coordinates (x,y)= (" + building.get_CoordX() + ", " + building.get_CoordY() + ")"); 
                                                //console.log("Tiberium Cost: {"+tibCost+"}");
												console.log( "Offense level: {" + city.get_LvlOffense() + "} Defense level: {" + city.get_LvlDefense() + "}")
												console.log("Air repair time: " + airRT + " in seconds. Vehical repair time: " + vehRT + " in seconds. Infantry repair time: " + infRT + " in seconds.");
												console.log(" ");
										  
										  }
										  if(	(name =="Hand of Nod" ||  name =="Barracks") &&	((infRT >= airRT) && (infRT >= vehRT)) ){
										  var building_obj = {
											cityid: city.get_Id(),
											buildingid: building.get_Id(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
											};
										  
										  ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", building_obj, null, null, true); 
                                              var newbuildinglvl = building.get_CurrentLevel() + 1;
												console.log( "Building Upgraded and Previous upgraded lvl :");
												console.log("City Name: {"+ city.m_SupportDedicatedBaseName +"} Base level: {"+ baselvl + "}");
												console.log("Building name: {" + name  + "} Building Current level: [" + building.get_CurrentLevel() + "] New Building Level: [" + newbuildinglvl + "] Coordinates (x,y)= (" + building.get_CoordX() + ", " + building.get_CoordY() + ")"); 
                                                //console.log("Tiberium Cost: {"+tibCost+"}");
												console.log( "Offense level: {" + city.get_LvlOffense() + "} Defense level: {" + city.get_LvlDefense() + "}");
												console.log("Air repair time: " + airRT + " in seconds. Vehical repair time: " + vehRT + " in seconds. Infantry repair time: " + infRT + " in seconds.");
												console.log(" ");
										  
										  }
        								 
										 
										 if(	(name =="Airport" || name =="Airfield") && ((airRT >= infRT) && (airRT >= vehRT))	)	{
										 
										 var building_obj = {
											cityid: city.get_Id(),
											buildingid: building.get_Id(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
											};
											
											ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", building_obj, null, null, true); 
                                              var newbuildinglvl = building.get_CurrentLevel() + 1;
												console.log( "Building Upgraded and Previous upgraded lvl :");
												console.log("City Name: {"+ city.m_SupportDedicatedBaseName +"} Base level: {"+ baselvl + "}")
												console.log("Building name: {" + name  + "} Building Current level: [" + building.get_CurrentLevel() + "] New Building Level: [" + newbuildinglvl + "] Coordinates (x,y)= (" + building.get_CoordX() + ", " + building.get_CoordY() + ")"); 
                                                //console.log("Tiberium Cost: {"+tibCost+"}");
												console.log( "Offense level: {" + city.get_LvlOffense() + "} Defense level: {" + city.get_LvlDefense() + "}")
												console.log("Air repair time: " + airRT + " in seconds. Vehical repair time: " + vehRT + " in seconds. Infantry repair time: " + infRT + " in seconds.");
												console.log(" ");
											
											}
											// End of Rt Buildings }
											
											//Start of Unit development buildings
										  if (	(name == "Construction Yard"|| name =="Command Center" || name =="Defense HQ" ||  name =="Defense Facility") && (buildinglvl < 28)	){
										  
										  var building_obj = {
											cityid: city.get_Id(),
											buildingid: building.get_Id(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
											};
										  
										  ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", building_obj, null, null, true); 
                                              var newbuildinglvl = building.get_CurrentLevel() + 1;
												console.log( "Building Upgraded and Previous upgraded lvl :");
												console.log("City Name: {"+ city.m_SupportDedicatedBaseName +"} Base level: {"+ baselvl + "}")
												console.log("Building name: {" + name  + "} Building Current level: [" + building.get_CurrentLevel() + "] New Building Level: [" + newbuildinglvl + "] Coordinates (x,y)= (" + building.get_CoordX() + ", " + building.get_CoordY() + ")"); 
                                                //console.log("Tiberium Cost: {"+tibCost+"}");
												console.log( "Offense level: {" + city.get_LvlOffense() + "} Defense level: {" + city.get_LvlDefense() + "}")
												console.log("Air repair time: " + airRT + " in seconds. Vehical repair time: " + vehRT + " in seconds. Infantry repair time: " + infRT + " in seconds.");
												console.log(" ");
										  
										  }
										  //End of unit development buildings
										 
										 //Start of Storage buildings
										  if (	(name =="Accumulator" || name =="Silo") && (buildinglvl <= blvlHigh)	){
										  
										  var building_obj = {
											cityid: city.get_Id(),
											buildingid: building.get_Id(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
											};
										  
										  ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", building_obj, null, null, true); 
                                              var newbuildinglvl = building.get_CurrentLevel() + 1;
												console.log( "Building Upgraded and Previous upgraded lvl :");
												console.log("City Name: {"+ city.m_SupportDedicatedBaseName +"} Base level: {"+ baselvl + "}")
												console.log("Building name: {" + name  + "} Building Current level: [" + building.get_CurrentLevel() + "] New Building Level: [" + newbuildinglvl + "] Coordinates (x,y)= (" + building.get_CoordX() + ", " + building.get_CoordY() + ")"); 
                                                //console.log("Tiberium Cost: {"+tibCost+"}");
												console.log( "Offense level: {" + city.get_LvlOffense() + "} Defense level: {" + city.get_LvlDefense() + "}")
												console.log("Air repair time: " + airRT + " in seconds. Vehical repair time: " + vehRT + " in seconds. Infantry repair time: " + infRT + " in seconds.");
												console.log(" ");
										  
										  }
										  //End of storage buildings
										  
										  //Start of Resouce Buildings
										  if (	(name =="Refinery" || name =="Power Plant" || name =="Harvester") && (buildinglvl <= blvlLow)	){
										  
										  var building_obj = {
											cityid: city.get_Id(),
											buildingid: building.get_Id(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
											};
											
											ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", building_obj, null, null, true); 
                                              var newbuildinglvl = building.get_CurrentLevel() + 1;
												console.log( "Building Upgraded and Previous upgraded lvl :");
												console.log("City Name: {"+ city.m_SupportDedicatedBaseName +"} Base level: {"+ baselvl + "}")
												console.log("Building name: {" + name  + "} Building Current level: [" + building.get_CurrentLevel() + "] New Building Level: [" + newbuildinglvl + "] Coordinates (x,y)= (" + building.get_CoordX() + ", " + building.get_CoordY() + ")"); 
                                                //console.log("Tiberium Cost: {"+tibCost+"}");
												console.log( "Offense level: {" + city.get_LvlOffense() + "} Defense level: {" + city.get_LvlDefense() + "}")
												console.log("Air repair time: " + airRT + " in seconds. Vehical repair time: " + vehRT + " in seconds. Infantry repair time: " + infRT + " in seconds.");
												console.log(" ");
											
											}
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
                                              var newbuildinglvl = building.get_CurrentLevel() + 1;
												console.log( "Building Upgraded and Previous upgraded lvl :");
												console.log("City Name: {"+ city.m_SupportDedicatedBaseName +"} Base level: {"+ baselvl + "}")
												console.log("Building name: {" + name  + "} Building Current level: [" + building.get_CurrentLevel() + "] New Building Level: [" + newbuildinglvl + "] Coordinates (x,y)= (" + building.get_CoordX() + ", " + building.get_CoordY() + ")"); 
                                                //console.log("Tiberium Cost: {"+tibCost+"}");
												console.log( "Offense level: {" + city.get_LvlOffense() + "} Defense level: {" + city.get_LvlDefense() + "}")
												console.log("Air repair time: " + airRT + " in seconds. Vehical repair time: " + vehRT + " in seconds. Infantry repair time: " + infRT + " in seconds.");
												console.log(" ");
										  
										  }
										  //End of support buildings

											//}
									}
									
								}
								}
								
								//}
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