// ==UserScript==
// @name        C&C Tiberium Alliances Flunik Tools: Custom AutoUpgrade
// @namespace   AutoUpgrade
// @description Only uses the AutoUpgrade Feature For C&C Tiberium Alliances
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @author      Flunik dbendure RobertT KRS_L Trekker9876 
// @version     0.5.7.09
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
						//Only an Updater;
						 Update : function(city,building,unit) {
					
					var _this = FlunikTools.Main.getInstance();
						
						city;building;unit;
						if((city&&building)||(city&&unit)||(city != null)||(building != null)||(unit != null)){
							for (var nCity in ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d)
							{
							if((city&&building)||(city&&unit)||(city)){
							
								//var city = ClientLib.Data.MainData.GetInstance().get_Cities().get_AllCities().d[nCity];
								var buildings = city.get_Buildings();
                                var bids = city.get_CityBuildingsData();
                                var baseName = city.m_SupportDedicatedBaseName;
                                if(city.m_SupportDedicatedBaseName = baseName){
                                    
                                    var cis = new Array();
									cis[baseName] = new Object();
									cis[baseName]["City ID"] = city.get_Id();
                                    cis[baseName]["City Name"] = city.m_SupportDedicatedBaseName;
                                    cis[baseName]["City Level"] = city.get_LvlBase();
                                    cis[baseName]["Offense Level"] = city.get_LvlOffense();
                                    cis[baseName]["Defense Level"] = city.get_LvlDefense();
                                    cis[baseName]["TibMake"] = city.GetResourceCount(ClientLib.Base.EResourceType.Tiberium);
                                    cis[baseName]["TibMax"] = city.GetResourceMaxStorage(ClientLib.Base.EResourceType.Tiberium);
                                    cis[baseName]["CryMake"] = city.GetResourceCount(ClientLib.Base.EResourceType.Crystal);
                                    cis[baseName]["CryMax"] = city.GetResourceMaxStorage(ClientLib.Base.EResourceType.Crystal);
                                    cis[baseName]["PowMake"] = city.GetResourceCount(ClientLib.Base.EResourceType.Power);
                                    cis[baseName]["PowMax"] = city.GetResourceMaxStorage(ClientLib.Base.EResourceType.Power);
                                    cis[baseName]["Coords"] = "["+city.get_PosX()+", "+city.get_PosY()+"]"; 
                                    cis[baseName]["Building"] = new Object();
                                    cis[baseName]["Offense Unit"] = new Object();
                                    cis[baseName]["Defense Unit"] = new Object();
                                    
                                
 var x = 0;
								for (var nBuildings in buildings.d) {
                                   if(building&&city){
									//for(var x; x <= 1 ; x++){
										var count = x++;
                                    //var building = buildings.d[nBuildings];
									var name = building.get_UnitGameData_Obj().dn;
                                    var tech = building.get_TechName();
                                    //var nLevel =  building.get_CurrentLevel() + 1;
									//if (name == "Silo" || name == "Accumulator" || name == "Command Center" || name == "Defence HQ" ) {
									//if (buildingsToUpdate.indexOf(name) != -1 ) {
                                    
									if (tech == ClientLib.Base.ETechName.Construction_Yard ||
                                        tech == ClientLib.Base.ETechName.Refinery ||
                                        tech == ClientLib.Base.ETechName.PowerPlant ||
                                        tech == ClientLib.Base.ETechName.Command_Center ||
                                        tech == ClientLib.Base.ETechName.Defense_HQ ||
                                        tech == ClientLib.Base.ETechName.Barracks ||
                                        tech == ClientLib.Base.ETechName.Factory ||
                                        tech == ClientLib.Base.ETechName.Airport||
                                        tech == ClientLib.Base.ETechName.Defense_Facility ||
                                        tech == ClientLib.Base.ETechName.Research_BaseFound ||
                                        tech == ClientLib.Base.ETechName.Harvester_Crystal ||
                                        tech == ClientLib.Base.ETechName.Harvester ||
                                        tech == ClientLib.Base.ETechName.Support_Air ||
                                        tech == ClientLib.Base.ETechName.Support_Ion ||
                                        tech == ClientLib.Base.ETechName.Support_Art ||
                                        tech == ClientLib.Base.ETechName.Silo ||
                                        tech == ClientLib.Base.ETechName.Accumulator){
                                        
                                        //console.log(name, tech);
                                         
                                 var bild = building.get_TechGameData_Obj().dn;  
								 cis[baseName]["Building"][bild] = new Array();
                                cis[baseName]["Building"][bild][count] = new Object();
								cis[baseName]["Building"][bild][count]["Count"] = count;
                                cis[baseName]["Building"][bild][count]["ID"] = building.get_Id();
                                //cis[baseName]["Building"][bild][count]["City Name"] = city.m_SupportDedicatedBaseName;
                                cis[baseName]["Building"][bild][count]["Name"] = building.get_TechGameData_Obj().dn;
								cis[baseName]["Building"][bild][count]["preLevel"] = building.get_CurrentLevel();
                                cis[baseName]["Building"][bild][count]["Level"] = building.get_CurrentLevel() + 1;
								cis[baseName]["Building"][bild][count]["NxtLevel"] = building.get_CurrentLevel() + 2;
                                cis[baseName]["Building"][bild][count]["NxtTibCost"] = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj(cis[baseName]["Building"][bild][count]["NxtLevel"], building.get_TechGameData_Obj() )[0].Count;
                                cis[baseName]["Building"][bild][count]["NxtPowCost"] = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj(cis[baseName]["Building"][bild][count]["NxtLevel"], building.get_TechGameData_Obj() )[1].Count;
                                cis[baseName]["Building"][bild][count]["Coords"] = "[" + building.get_CoordX() +", "+ building.get_CoordY() + "]";
                                cis[baseName]["Building"][bild][count]["IsBuildingDamaged"] = bids.get_HasDamagedBuilding();
                                        
                                        }
                                    
										
                                        if(tech == ClientLib.Base.ETechName.Silo){
										
                                       
                                          //cis[baseName]["Building"][bild][count][count]= new Array();  
                                        cis[baseName]["Building"][bild][count]["TibNxtLvlProd"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[1].NewLvlDelta;
                                        cis[baseName]["Building"][bild][count]["TibProduction"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[1].TotalValue;
                                        cis[baseName]["Building"][bild][count]["CryNxtLvlProd"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[4].NewLvlDelta;
                                        cis[baseName]["Building"][bild][count]["CryProduction"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[4].TotalValue;    
										
											}
                                        //console.log(name, tech,cis[baseName]["Building"][bild][count] );
                                            
                                       
                                    	 if(tech == ClientLib.Base.ETechName.Accumulator){
                                        cis[baseName]["Building"][bild][count]["PowNxtLvlProd"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[6].NewLvlDelta;
                                        cis[baseName]["Building"][bild][count]["PowProduction"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[6].TotalValue;
                                           
                                        //console.log(name, tech,cis[baseName]["Building"][bild][count] );
                                             }
                                    	if(tech == ClientLib.Base.ETechName.Refinery){
                                        cis[baseName]["Building"][bild][count]["CredNxtLvlProd"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[30].NewLvlDelta;
                                        cis[baseName]["Building"][bild][count]["CredProductionPerHour"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[30].TotalValue;
                                        cis[baseName]["Building"][bild][count]["CredNxtLvlPackage"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[32].NewLvlDelta;
                                        cis[baseName]["Building"][bild][count]["CredPackage"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[32].TotalValue;
                                        cis[baseName]["Building"][bild][count]["PackagePerHour"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[36].TotalValue/3600;
                                        //console.log(name, tech,cis[baseName]["Building"][bild][count] );
                                            }
                                    	
                                    	if(tech == ClientLib.Base.ETechName.Harvester){
                                            
                                            
                                            if(city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[1]&&city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[25]&&city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[33]){
                                        //console.log(building.get_UnitGameData_Obj().dn, city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d);
                                        cis[baseName]["Building"][bild][count]["TibNxtLvlProd"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[1].NewLvlDelta;
                                        cis[baseName]["Building"][bild][count]["TibProdPerHour"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[1].TotalValue;
                                        cis[baseName]["Building"][bild][count]["TibNxtLvlPackage"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[25].NewLvlDelta;
                                        cis[baseName]["Building"][bild][count]["TibPackage"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[25].TotalValue;
                                        cis[baseName]["Building"][bild][count]["PackagePerHour"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[33].TotalValue/3600;
                                        }
                                        
                                        if(city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[4]&&city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[26]&&city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[34]){
                                        //console.log(building.get_UnitGameData_Obj().dn, city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d);
                                                 
                                        cis[baseName]["Building"][bild][count]["CryNxtLvlProd"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[4].NewLvlDelta;
                                        cis[baseName]["Building"][bild][count]["CryProdPerHour"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[4].TotalValue;
                                        cis[baseName]["Building"][bild][count]["CryNxtLvlPackage"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[26].NewLvlDelta;
                                        cis[baseName]["Building"][bild][count]["CryPackage"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[26].TotalValue;
                                        cis[baseName]["Building"][bild][count]["PackagePerHour"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[34].TotalValue/3600;
                                        
                                            }
                                       // console.log(name, tech,cis[baseName]["Building"][bild][count] );;}
                                    	}
                                    	/*if(tech == ClientLib.Base.ETechName.Harvester_Crystal){
                                        
                                        if(city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[4]&&city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[26]&&city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d[34]){
                                        console.log(building.get_UnitGameData_Obj().dn, city.GetBuildingCache(building.get_Id()).DetailViewInfo.OwnProdModifiers.d);
                                                 
                                        cis[baseName]["Building"][bild][count] ["CryNxtLvlProd"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[4].NewLvlDelta;
                                        cis[baseName]["Building"][bild][count] ["CryProdPerHour"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[4].TotalValue;
                                        cis[baseName]["Building"][bild][count] ["CryNxtLvlPackage"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[26].NewLvlDelta;
                                        cis[baseName]["Building"][bild][count] ["CryPackage"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[26].TotalValue;
                                        cis[baseName]["Building"][bild][count] ["PackagePerHour"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[34].TotalValue/3600;
                                        }
                                        console.log(name, tech,cis[baseName]["Building"][bild][count] );;}*/
                                    
                                    	if(tech == ClientLib.Base.ETechName.PowerPlant){
                                        cis[baseName]["Building"][bild][count]["PowNxtLvlProd"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[6].NewLvlDelta;
                                        cis[baseName]["Building"][bild][count]["PowProductionPerHour"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[6].TotalValue;
                                        cis[baseName]["Building"][bild][count]["PowNxtLvlPackage"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[28].NewLvlDelta;
                                        cis[baseName]["Building"][bild][count]["PowPackage"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[28].TotalValue;
                                        cis[baseName]["Building"][bild][count]["CredNxtLvlProd"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[30].NewLvlDelta;
                                        cis[baseName]["Building"][bild][count]["CredProductionPerHour"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[30].TotalValue;
                                        cis[baseName]["Building"][bild][count]["PackagePerHour"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[35].TotalValue/3600;
                                        //console.log(name, tech,cis[baseName]["Building"][bild][count] );
                                        }
                                    	
                                    	if(tech == ClientLib.Base.ETechName.Factory){
                                        cis[baseName]["Building"][bild][count]["RtNxtLvlProd"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[43].NewLvlDelta;
                                        cis[baseName]["Building"][bild][count]["RtProductionPerHour"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[43].TotalValue;
                                        cis[baseName]["Building"][bild][count]["TotalRT"] = city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false);
                                       	//console.log(name, tech,cis[baseName]["Building"][bild][count] );
                                        }
                                    	if(tech == ClientLib.Base.ETechName.Airport){
                                        cis[baseName]["Building"][bild][count]["RtNxtLvlProd"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[39].NewLvlDelta;
                                        cis[baseName]["Building"][bild][count]["RtProductionPerHour"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[39].TotalValue;
                                        cis[baseName]["Building"][bild][count]["TotalRT"] = city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false);
                                       //	console.log(name, tech,cis[baseName]["Building"][bild][count] );
                                        }
                                    	if(tech == ClientLib.Base.ETechName.Barracks){
                                        cis[baseName]["Building"][bild][count]["RtNxtLvlProd"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[41].NewLvlDelta;
                                        cis[baseName]["Building"][bild][count]["RtProductionPerHour"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[41].TotalValue;
                                        cis[baseName]["Building"][bild][count]["TotalRT"] = city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, false);
                                       	//console.log(name, tech,cis[baseName]["Building"][bild][count] );
                                        }
                                    	
                                    	if(tech == ClientLib.Base.ETechName.Command_Center){
                                        cis[baseName]["Building"][bild][count]["CCNxtLvlProd"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[22].NewLvlDelta;
                                        cis[baseName]["Building"][bild][count]["CCLimit"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[22].TotalValue;
                                        cis[baseName]["Building"][bild][count]["MaxRT"] = city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[47].TotalValue;
                                       	//console.log(name, tech,cis[baseName]["Building"][bild][count] );
                                        }
                                    
                                    	if(tech == ClientLib.Base.ETechName.Defense_HQ){
                                        cis[baseName]["Building"][bild][count]["DHNxtLvlProd"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[31].NewLvlDelta;
                                        cis[baseName]["Building"][bild][count]["DHLimit"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[31].TotalValue;
                                        //console.log(name, tech,cis[baseName]["Building"][bild][count] );
                                        }
                                    
                                    	if(tech == ClientLib.Base.ETechName.Construction_Yard){
                                        cis[baseName]["Building"][bild][count]["TibStorage"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[2].TotalValue;
                                        cis[baseName]["Building"][bild][count]["TibStNxtLvlProd"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[2].NewLvlDelta;
                                        cis[baseName]["Building"][bild][count]["CryStorage"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[5].TotalValue;
                                        cis[baseName]["Building"][bild][count]["CryStNxtLvlProd"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[5].NewLvlDelta;
                                        cis[baseName]["Building"][bild][count]["PowStorage"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[29].TotalValue;
                                        cis[baseName]["Building"][bild][count]["PowStNxtLvlProd"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[29].NewLvlDelta;
                                        cis[baseName]["Building"][bild][count]["RtEff"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[29].TotalValue;
                                        cis[baseName]["Building"][bild][count]["RtEffNxtLvl"] =city.GetBuildingCache(cis[baseName]["Building"][bild][count] ["ID"]).DetailViewInfo.OwnProdModifiers.d[29].NewLvlDelta;
                                        cis[baseName]["Building"][bild][count]["TotalCityRt"] =city.get_CityBuildingsData().GetFullRepairTime();
                                        
                                        //console.log(name, tech,cis[baseName]["Building"][bild][count] );
                                        }
                                    
                                    	 if(tech == ClientLib.Base.ETechName.Defense_Facility){
                                       
                                           
                                        //console.log(name, tech,cis[baseName]["Building"][bild][count] );;
                                         }
                                    	if(tech == ClientLib.Base.ETechName.Support_Air ||
                                           tech == ClientLib.Base.ETechName.Support_Ion ||
                                           tech == ClientLib.Base.ETechName.Support_Art){
                                       
                                           
                                       // console.log(name, tech,cis[baseName]["Building"][bild][count] );
                                         }
										 
										if (Math.random() > 0.90) {
                                            var building_obj = {
											cityid: city.get_Id(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
										}
											//console.log(building);
											//ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", building_obj, null, null, true);
										}
									//}
								
										 //console.log(name, tech,cis[baseName]["Building"][bild][count] );
										 return(cis[baseName]["Building"][bild][count] );
										}
								}
								
                                
								var units = city.get_CityUnitsData();
								var offenceUnits = units.get_OffenseUnits();
								for (var nUnit in offenceUnits.d) 
								{var count = x++;
									if(unit&&city){
									//var unit = offenceUnits.d[nUnit];
                                    //var nLevel = unit.get_CurrentLevel() + 1;
                                    //var unitInfType = units.GetEUnitGroupByEModifierType(ClientLib.Base.EModifierType.RepairEfficiencyInf);
                                    //var unitVehType = units.GetEUnitGroupByEModifierType(ClientLib.Base.EModifierType.RepairEfficiencyVeh);
                                     //units.GetEUnitGroupByEModifierType(ClientLib.Base.EModifierType.RepairEfficiencyAir);
                                    /*if(ClientLib.Base.EUnitType.Infantry||
  									   ClientLib.Base.EUnitType.Tank||
 									   ClientLib.Base.EUnitType.Air){*/
								  //city.GetUnitRecruitedInfoByCoord(ClientLib.Base.EUnitType.Infantry ,unit.get_CoordX() ,unit.get_CoordY()).CanUpgrade();
									var ofit = unit.get_UnitGameData_Obj().dn;
                                    cis[baseName]["Offense Unit"][ofit]= new Array();
									cis[baseName]["Offense Unit"][ofit][count]= new Object();
									cis[baseName]["Offense Unit"][ofit][count]["Name"] = unit.get_UnitGameData_Obj().dn;
                                    cis[baseName]["Offense Unit"][ofit][count]["ID"] = unit.get_Id();
									cis[baseName]["Offense Unit"][ofit][count]["preLevel"] = unit.get_CurrentLevel();
                                    cis[baseName]["Offense Unit"][ofit][count]["Level"] = unit.get_CurrentLevel() + 1;
									cis[baseName]["Offense Unit"][ofit][count]["NxtLevel"] = unit.get_CurrentLevel() + 2;
                                    cis[baseName]["Offense Unit"][ofit][count]["NxtLvlCryCost"] = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj(cis[baseName]["Offense Unit"][ofit][count]["NxtLevel"] , unit.get_UnitGameData_Obj())[0].Count;
                                    cis[baseName]["Offense Unit"][ofit][count]["NxtLvlPowCost"] = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj(cis[baseName]["Offense Unit"][ofit][count]["NxtLevel"] , unit.get_UnitGameData_Obj())[1].Count;
                                    cis[baseName]["Offense Unit"][ofit][count]["unitRepairTime"] = unit.get_UnitLevelRepairRequirements()[1].Count;
                                    cis[baseName]["Offense Unit"][ofit][count]["unitRepairCost"] = unit.get_UnitLevelRepairRequirements()[0].Count;
                                    //cis[baseName]["Offense Unit"][ofit][count]["highestUnitLevel"] = units.get_HighestLVlForUnitGroupTypes().d[0];
                                    cis[baseName]["Offense Unit"][ofit][count]["Coords"] = "["+unit.get_CoordX()+", "+unit.get_CoordY()+"]";
                                    //cis[baseName]["Offense Unit"][ofit][count]["CanUpgrade"] = unit.CanUpgrade();
                                    //console.log("Offense",ofit,cis[baseName]["Offense Unit"][ofit][count]);
                                    
                                    //}
                                        
                                   
                                    /*if(ClientLib.Base.EUnitType.Infantry ){
                                        //cis[baseName]["Offense Unit"][ofit][count]["CryCost"] = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj(nLevel, unit.get_UnitGameData_Obj())[0].Count;
                                       
                                        // cis[baseName]["Offense Unit"][ofit][count]["CanUpgrade"] = city.GetUnitRecruitedInfoByCoord(ClientLib.Base.EUnitType.Infantry ,unit.get_CoordX() ,unit.get_CoordY()).CanUpgrade();
                                       // console.log( cis[baseName]["Offense Unit"][ofit][count]);
                                    }
                                    
                                    if(ClientLib.Base.EUnitType.Tank){
                                        cis[baseName]["Offense Unit"][ofit][count]["CryCost"] = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj(nLevel, unit.get_UnitGameData_Obj())[0].Count;
                                      //  cis[baseName]["Offense Unit"][ofit][count]["CanUpgrade"] = city.GetUnitRecruitedInfoByCoord(ClientLib.Base.EUnitType.Tank ,unit.get_CoordX() ,unit.get_CoordY()).CanUpgrade();
                                        console.log(cis[baseName]["Offense Unit"][ofit][count]);
                                    }
                                    
                                     if(ClientLib.Base.EUnitType.Air){
                                         cis[baseName]["Offense Unit"][ofit][count]["CryCost"] = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj(nLevel, unit.get_UnitGameData_Obj())[0].Count;
                                      //  cis[baseName]["Offense Unit"][ofit][count]["CanUpgrade"] = city.GetUnitRecruitedInfoByCoord(ClientLib.Base.EUnitType.Air ,unit.get_CoordX() ,unit.get_CoordY()).CanUpgrade();
                                         console.log(cis[baseName]["Offense Unit"][ofit][count]);
                                    }*/
                                    
                                    if (Math.random() > 0.95) {
                                        var unit_obj = {
										cityid: city.get_Id(),
										unitId: unit.get_Id()
									}
										//ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UnitUpgrade", unit_obj, null, null, true);
										//console.log(unit);
									}
									//if(unit){
										 //console.log(name, tech,cis[baseName]["Building"][bild][count] );
										 return(cis[baseName]["Offense Unit"][ofit][count] );
										}
										
								}

								var defenceUnits = units.get_DefenseUnits();
								for (var nUnit in defenceUnits.d) 
								{var count = x++;
									if(unit&&city){
									//var unit = defenceUnits.d[nUnit];
									//var nLevel = unit.get_CurrentLevel() + 1;
                                    /*if(ClientLib.Base.EUnitType.Infantry||
  									   ClientLib.Base.EUnitType.Tank||
 									   ClientLib.Base.EUnitType.Structure){*/
								  //city.GetUnitRecruitedInfoByCoord(ClientLib.Base.EUnitType.Infantry ,unit.get_CoordX() ,unit.get_CoordY()).CanUpgrade();
									var dfit = unit.get_UnitGameData_Obj().dn;
                                    cis[baseName]["Defense Unit"][dfit]= new Array();
									cis[baseName]["Defense Unit"][dfit][count]= new Object();
                                    cis[baseName]["Defense Unit"][dfit][count]["ID"] = unit.get_Id();
                                    cis[baseName]["Defense Unit"][dfit][count]["Name"] = unit.get_UnitGameData_Obj().dn;
									cis[baseName]["Defense Unit"][dfit][count]["preLevel"] = unit.get_CurrentLevel();
                                    cis[baseName]["Defense Unit"][dfit][count]["Level"] = unit.get_CurrentLevel() + 1;
									cis[baseName]["Defense Unit"][dfit][count]["NxtLevel"] = unit.get_CurrentLevel() + 2;
                                    cis[baseName]["Defense Unit"][dfit][count]["NxtTiborCryCost"] = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj(cis[baseName]["Defense Unit"][dfit][count]["NxtLevel"], unit.get_UnitGameData_Obj())[0].Count;
                                    cis[baseName]["Defense Unit"][dfit][count]["NxtPowCost"] = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj(cis[baseName]["Defense Unit"][dfit][count]["NxtLevel"], unit.get_UnitGameData_Obj())[1].Count;
                                    cis[baseName]["Defense Unit"][dfit][count]["unitRepairTime"] = unit.get_UnitLevelRepairRequirements()[1].Count;
                                    cis[baseName]["Defense Unit"][dfit][count]["unitRepairCost"] = unit.get_UnitLevelRepairRequirements()[0].Count;
                                    //cis[baseName]["Defense Unit"][dfit][count]["highestUnitLevel"] = units.get_HighestLVlForUnitGroupTypes().d[0];
                                    cis[baseName]["Defense Unit"][dfit][count]["Coords"] = "["+unit.get_CoordX()+", "+unit.get_CoordY()+"]";
                                   // cis[baseName]["Defense Unit"][dfit][count]["CanUpgrade"] = unit.CanUpgrade();
                                     //console.log("Defense", dfit, cis[baseName]["Defense Unit"][dfit][count]);
                                    //}
                                   
                                   
                                    /*if(dfit ){
                                        cis[baseName]["Defense Unit"][dfit][count]["CryCost"] = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj(nLevel, unit.get_UnitGameData_Obj())[0].Count;
                                        //cis[baseName]["Defense Unit"][dfit][count]["CanUpgrade"] = city.GetUnitRecruitedInfoByCoord(ClientLib.Base.EUnitType.Infantry ,unit.get_CoordX() ,unit.get_CoordY()).CanUpgrade();
                                        console.log(cis[baseName]["Defense Unit"][dfit][count]);
                                    }
                                    
                                    if(dfit){
                                        cis[baseName]["Defense Unit"][dfit][count]["CryCost"] = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj(nLevel, unit.get_UnitGameData_Obj())[0].Count;
                                       // cis[baseName]["Defense Unit"][dfit][count]["CanUpgrade"] = city.GetUnitRecruitedInfoByCoord(ClientLib.Base.EUnitType.Tank ,unit.get_CoordX() ,unit.get_CoordY()).CanUpgrade();
                                         console.log(cis[baseName]["Defense Unit"][dfit][count]);
                                    }
                                    
                                     if(dfit){
                                         cis[baseName]["Defense Unit"][dfit][count]["TibCost"] = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj(nLevel, unit.get_UnitGameData_Obj())[0].Count;
                                        //cis[baseName]["Defense Unit"][dfit][count]["CanUpgrade"] = city.GetUnitRecruitedInfoByCoord(ClientLib.Base.EUnitType.Air ,unit.get_CoordX() ,unit.get_CoordY()).CanUpgrade();
                                          console.log(cis[baseName]["Defense Unit"][dfit][count]);
                                    }*/
								  
									if (Math.random() > 0.95) {
                                        var unit_obj = {
										cityid: city.get_Id(),
										unitId: unit.get_Id()
									}
										//ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UnitUpgrade", unit_obj, null, null, true);
										//console.log(unit);
									
									}
									 return(cis[baseName]["Defense Unit"][dfit][count]);
										}
								}
								
                               
							}/*<---close my city if*/
							return(cis[baseName]);
							   }
                        }
					}else{console.log("oops!")};
				},
						//End
						
						
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
							this.autoUpdateHandle = window.setInterval(this.autoUpgrade, 60000);
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
								//console.log(_this.Update(city,building,unit));
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
									//console.log(_this.Update(city,null,unit));
									
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
										console.log("Upgraded:",_this.Update(city,null,null),_this.Update(city,null,unit));
										//console.log(_this.cityOffUnitInfo(unit, city)+ " unitRT/TotalRT " + unitRepairRatio.toFixed(3)+" "+ _this.updateCityCache(city, unit, null, cCount, count));
										
										}
										}continue;
								 _this.updateCityCache(city, unit, null, cCount, count)
								if(ClientLib.Base.EUnitType.Tank){
								if (  (( cryCurrentAmount > cryCurrentStorage*0.05 ) && ((  cryCurrentAmount/unitCryCost)> 4 )  && (nLevel <= highestUnitLevel) ) || (( unitRepairRatio>1 ) && ( cryCurrentAmount > cryCurrentStorage*0.05 ) && ((  cryCurrentAmount/unitCryCost)> 2 )) ) {
										ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UnitUpgrade", unit_obj, null, null, true);
										//console.log(unit);
										console.log("Upgraded:",_this.Update(city,null,null),_this.Update(city,null,unit));
										//console.log(_this.cityOffUnitInfo(unit, city)+ " unitRT/TotalRT " + unitRepairRatio.toFixed(3)+" "+ _this.updateCityCache(city, unit, null, cCount, count));
										//_this.updateCityCache(city, cCount);
										}
										}continue;
								 _this.updateCityCache(city, unit, null, cCount, count)
								if(ClientLib.Base.EUnitType.Air){
								if (  (( cryCurrentAmount > cryCurrentStorage*0.05 ) && ((  cryCurrentAmount/unitCryCost)> 4 )  && (nLevel <= highestUnitLevel) ) || (( unitRepairRatio>1 ) && ( cryCurrentAmount > cryCurrentStorage*0.05 ) && ((  cryCurrentAmount/unitCryCost)> 2 )) ) {
										ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UnitUpgrade", unit_obj, null, null, true);
										//console.log(unit);
										console.log("Upgraded:",_this.Update(city,null,null),_this.Update(city,null,unit));
										//console.log(_this.cityOffUnitInfo(unit, city)+ " unitRT/TotalRT " + unitRepairRatio.toFixed(3)+" "+ _this.updateCityCache(city, unit, null, cCount, count));
										//_this.updateCityCache(city, cCount);
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
 //console.log(_this.Update(city,building,unit));
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
									var nLevel =unit.get_CurrentLevel() + 1;
									var unitRepairCost = unit.get_UnitLevelRepairRequirements()[0].Count;
									var unitRepairTime = unit.get_UnitLevelRepairRequirements()[1].Count;
									//var offCurrentRepairCost = city.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeAir);
									//var highestUnitLevel = units.get_HighestLVlForUnitGroupTypes().d[0];
									var unitCryorTibCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj(nLevel, unit.get_UnitGameData_Obj())[0].Count;
									//var unitPowCost = ClientLib.Base.Util.GetUnitLevelResourceRequirements_Obj(nLevel, unit.get_UnitGameData_Obj())[1].Count;
									//console.log(_this.Update(city,null,unit));
									var unit_obj = {
										cityid: city.get_Id(),
										unitId: unit.get_Id()
									};
									
									//ClientLib.Base.EUnitType Structure
									
									//var unitRepairRatio = unitRepairTime/_this.totalRepairTime(city, airRT, vehRT, infRT);
									
									
									/*if(ClientLib.Base.EUnitType.Infantry){*/
										
									if (  (( cryCurrentAmount > cryCurrentStorage*0.05 ) && ((  tibCurrentAmount/unitCryorTibCost)> 4 ))  || ( ( cryCurrentAmount > cryCurrentStorage*0.05 ) && ((  cryCurrentAmount/unitCryCost)> 2 )) ) {
										
										//console.log(unit);
										ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UnitUpgrade", unit_obj, null, null, true);
										console.log("Upgraded:",_this.Update(city,null,null),_this.Update(city,null,unit));
												//console.log(_this.cityDefUnitInfo(unit, city)+ " " + _this.updateCityCache(city, unit, null, cCount, count));
										
										}
										//}continue;
										//_this.updateCityCache(city, unit, null, cCount, count);
									/*if(ClientLib.Base.EUnitType.Tank){
									


									if (  (( cryCurrentAmount > cryCurrentStorage*0.05 ) && ((  cryCurrentAmount/unitCryorTibCost)> 4 )  && (nLevel <= highestUnitLevel) ) || (( unitRepairRatio>1 ) && ( cryCurrentAmount > cryCurrentStorage*0.05 ) && ((  cryCurrentAmount/unitCryCost)> 2 )) ) {
										ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UnitUpgrade", unit_obj, null, null, true);
										//console.log(unit);
										console.log("Upgraded:",_this.Update(city,null,null),_this.Update(city,null,unit));
										//console.log(_this.cityDefUnitInfo(unit, city)+ " " + _this.updateCityCache(city, unit, null, cCount, count));
										
										}
										}continue;
										
										_this.updateCityCache(city, unit, null, cCount, count);
									if(ClientLib.Base.EUnitType.Structure){
									



									if (  (( tibCurrentAmount > tibCurrentStorage*0.05 ) && ((  tibCurrentAmount/unitCryorTibCost)> 4 )  && (nLevel <= highestUnitLevel) ) || (( unitRepairRatio>1 ) && ( tibCurrentAmount > tibCurrentStorage*0.05 ) && ((  tibCurrentAmount/unitCryCost)> 2 )) ) {
										ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UnitUpgrade", unit_obj, null, null, true);
										//console.log(unit);
										console.log("Upgraded:",_this.Update(city,null,null),_this.Update(city,null,unit));
										//console.log(_this.cityDefUnitInfo(unit, city)+ " " + _this.updateCityCache(city, unit, null, cCount, count));
									
										}
										}continue;
										//_this.updateCityCache(city, unit, null, cCount, count);	
									*/
										
									}
									}catch (e) {
										console.log("This crashed FlunikTools Def: ", e);
									};
								}
								//console.log(_this.Update(city,building,unit));
								//This is the building loop.
								var buildings = city.get_Buildings();
								for (var nBuildings in buildings.d) {
								try{
								var x = 0;
									for(var x; x < 1 ; x++){
										var count = x;
																	
									var building = buildings.d[nBuildings];
									var name = building.get_UnitGameData_Obj().dn;
									/*if(name == "Silo"){
	console.log(_this.Update(city,null,null)["City Name"],_this.Update(city,building,null));
	}*/		
									//console.log(building.GetUniqueBuildingByTechName());
									var nLevel = building.get_CurrentLevel()+1;
									//console.log( ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj( nLevel, building.get_TechGameData_Obj() )[1].Count);
									if (!_this.canUpgradeBuilding(building, city)) continue; //KRS_L
									 //This is where is grabs the name of the building.
									//var name = building.GetUniqueBuildingByTechName(tech);
									
																		
									var buildinglvl = building.get_CurrentLevel();
									var blvlHigh = baselvl + 5.00;
									var blvlLow = baselvl + 3.00;
									var buildingTibCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj( nLevel, building.get_TechGameData_Obj() )[0].Count;
									//var buildingPowCost = ClientLib.Base.Util.GetTechLevelResourceRequirements_Obj( nLevel, building.get_TechGameData_Obj() )[1].Count
									 //ClientLib.Base.Tech.GetModifierValueFromLvl1Tech (System.Int32 techNameId ,System.Int32 modifierTypeId ,System.Int32 factionId)
									//My idea pool.
									
									//Need to fix the the upgrade bomb need it to do bases indiviually instead of all at once.
									//if ((city.GetResourceCount(tib) > (city.GetResourceMaxStorage(tib)*0.75))&&((city.GetResourceCount(tib)/buildingTibCost)>1))continue; 
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
                                             
												console.log("Upgraded:",_this.Update(city,null,null),_this.Update(city,building,null));
												//console.log(_this.cityBuildingInfo(building, city)+ " "+ _this.updateCityCache(city, null, building, cCount, count));  
												//console.log( "Building Upgraded and Previous upgraded lvl :");
												//console.log("City Name: {"+ city.m_SupportDedicatedBaseName +"} Base level: {"+ baselvl + "}")
												//console.log("Building name: {" + name  + "} Building Current level: [" + building.get_CurrentLevel() + "] New Building Level: [" + newbuildinglvl + "] Coordinates (x,y)= (" + building.get_CoordX() + ", " + building.get_CoordY() + ")"); 
                                                //console.log("Tiberium Cost: {"+tibCost+"}");
												//console.log( "Offense level: {" + city.get_LvlOffense() + "} Defense level: {" + city.get_LvlDefense() + "}");
												//console.log("Air repair time: " + airRT + " in seconds. Vehical repair time: " + vehRT + " in seconds. Infantry repair time: " + infRT + " in seconds.");
												//console.log(" ");
										 
										  }
										  
										  //_this.updateCityCache(city, null, building, cCount, count)
										  if(	(name =="Hand of Nod" ||  name =="Barracks") &&	((infRT >= airRT) && (infRT >= vehRT)) ){
										  var building_obj = {
											cityid: city.get_Id(),
											buildingid: building.get_Id(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
											};
										  
										  ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", building_obj, null, null, true); 
										  console.log("Upgraded:",_this.Update(city,null,null),_this.Update(city,building,null));
                        
												//console.log(_this.cityBuildingInfo(building, city)+ " "+ _this.updateCityCache(city, null, building, cCount, count));                        
										  
										  }
        								 
										 //_this.updateCityCache(city, null, building, cCount, count)
										 if(	(name =="Airport" || name =="Airfield") && ((airRT >= infRT) && (airRT >= vehRT))	)	{
										 
										 var building_obj = {
											cityid: city.get_Id(),
											buildingid: building.get_Id(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
											};
											
											ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", building_obj, null, null, true); 
                                             console.log("Upgraded:",_this.Update(city,null,null),_this.Update(city,building,null)); 
												//console.log(_this.cityBuildingInfo(building, city)+ " "+ _this.updateCityCache(city, null, building, cCount, count)); 
											
											}
											// End of Rt Buildings }
											//_this.updateCityCache(city, null, building, cCount, count)
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
                                            console.log("Upgraded:",_this.Update(city,null,null),_this.Update(city,building,null));
												//console.log(_this.cityBuildingInfo(building, city)+ " "+ _this.updateCityCache(city, null, building, cCount, count));  
										  
										  }
										  //End of unit development buildings
										 //_this.updateCityCache(city, null, building, cCount, count)
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
                                              console.log("Upgraded:",_this.Update(city,null,null),_this.Update(city,building,null));
												//console.log(_this.cityBuildingInfo(building, city)+ " "+ _this.updateCityCache(city, null, building, cCount, count));   
										  
										  }
										  //End of storage buildings
										  //_this.updateCityCache(city, null, building, cCount, count)
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
                                            console.log("Upgraded:",_this.Update(city,null,null),_this.Update(city,building,null));
												//console.log(_this.cityBuildingInfo(building, city)+ " "+ _this.updateCityCache(city, null, building, cCount, count));  
											
											}
											//_this.updateCityCache(city, null, building, cCount, count)
											if (	(name == "Power Plant" ) && (buildinglvl <= blvlLow)&&((city.GetResourceCount(tib)/buildingTibCost)>3)	){
										  
										  var building_obj = {
											cityid: city.get_Id(),
											buildingid: building.get_Id(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
											};
											
											ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", building_obj, null, null, true); 
                                              console.log("Upgraded:",_this.Update(city,null,null),_this.Update(city,building,null));
												//console.log(_this.cityBuildingInfo(building, city)+ " "+ _this.updateCityCache(city, null, building, cCount, count));   
												
											}
											//_this.updateCityCache(city, null, building, cCount, count)
											if (	(name =="Refinery") && (buildinglvl <= blvlLow)&&((city.GetResourceCount(tib)/buildingTibCost)>2)	){
										  
										  var building_obj = {
											cityid: city.get_Id(),
											buildingid: building.get_Id(),
											posX: building.get_CoordX(),
											posY: building.get_CoordY(),
											isPaid: true
											};
											
											ClientLib.Net.CommunicationManager.GetInstance().SendCommand("UpgradeBuilding", building_obj, null, null, true); 
                                              console.log("Upgraded:",_this.Update(city,null,null),_this.Update(city,building,null));
												//console.log(_this.cityBuildingInfo(building, city)+ " "+ _this.updateCityCache(city, null, building, cCount, count));  
											
											}
											//_this.updateCityCache(city, null, building, cCount, count)
											
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
                                              console.log("Upgraded:",_this.Update(city,null,null),_this.Update(city,building,null));
												//console.log(_this.cityBuildingInfo(building, city)+ " "+ _this.updateCityCache(city, null, building, cCount, count));  
										  
										  }
										  //End of support buildings
//_this.Update(city, building, null);

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
							console.log("Update:",_this.Update(city,null,null));
						}
						//console.log(_this.Update(city,building,unit));
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
					  //var city = null;
					  //var building = null;
					  //var unit = null;
					  
				
					//console.log(Update, Update(null,null,null));
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