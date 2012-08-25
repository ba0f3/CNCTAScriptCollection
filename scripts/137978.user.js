// ==UserScript==
// @version       1.6.4
// @name          CnC: MH Tiberium Alliances Available Loot Summary
// @namespace     mhloot
// @description   CROSS SERVERS Loot & troops info.
// @author        MrHIDEn based on Yaeger & Panavia code. Totaly recoded.
// @include       http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @require       http://sizzlemctwizzle.com/updater.php?id=137978
// ==/UserScript==
console.log("MHLoot Loading...");
(function () {
  var MHLootMain = function () {
    var showTroops = false;             // shows overall Hitpoints for Troops
    var showTroopsExtra = false;        // shows Troops Hitpoints for Vehicles/Aircrafts/Infantry
    var showInfo = true;                // shows HP/HC/DF/CY info
    var showColumnCondition = false;    // shows your progress against DF/CY
    var showRepairTime = true;          // shows Repair Times info for Enemy Base/Camp/Outpost
    var showAllyRepairTimeInfo = true; // shows Ally/Your Repair Times info
    var showLevels = true;             // shows Levels of Base/Defence/Offence info
    var showColumnLetter = false;       // shows columns letters for DF/CY pozition Ex A-1 or E-4. If 'false' shows only 1 or 4.
    
    function MHLootCreate() {
      
      var resPaths = [
        "webfrontend/ui/common/icn_res_research_mission.png",
        "webfrontend/ui/common/icn_res_tiberium.png",
        "webfrontend/ui/common/icn_res_chrystal.png",
        "webfrontend/ui/common/icn_res_dollar.png"
      ];
      var resImages = [];
      for(var k in resPaths) {
        resImages.push(new qx.ui.basic.Image(resPaths[k]).set({Scale:true,Width:16,Height:16}));
      }
      
      var troopPaths = [
        "https://eaassets-a.akamaihd.net/cncalliancesgame/cdn/data/d8d4e71d9de051135a7f5baf1f799d77.png",//inf
        "https://eaassets-a.akamaihd.net/cncalliancesgame/cdn/data/af8d7527e441e1721ee8953d73287e9e.png",//veh
        "https://eaassets-a.akamaihd.net/cncalliancesgame/cdn/data/5f889719f06aad76f06d51863f8eb524.png",//stu
        "https://eaassets-a.akamaihd.net/cncalliancesgame/cdn/data/6962b667bd797fc2e9e74267e1b3e7c3.png" //air
      ];
      var troopImages = [];
      if (showTroops) {
        for(var k in troopPaths) {
          troopImages.push(new qx.ui.basic.Image(troopPaths[k]).set({Scale:true,Width:16,Height:16}));
        }
      }
      
      var mhloot = {
        selectedType: -1,
        selectedBaseId: null,
        lastSelectedBaseId: null,
        
        selectedOwnBaseId: null,
        lastSelectedOwnBaseId: null,

        // the widgets for the different screens
        lootWindowPlayer: null,
        lootWindowBase: null,
        lootWindowCamp: null,
        lootWindowOwn: null,
        lootWindowAlly: null,

        lootable: [0, 0, 0, 0, 0, 0, 0, 0],
        troops: [0, 0, 0, 0, 0],
        waiting: [1,'','.','..','...'],
        
        iconArrays: [],
        infoArrays: [],
        twoLineInfoArrays: [],
        
        kMG: function(v) {
          var t = [ '', 'k', 'M', 'G', 'T', 'P' ];
          var i = 0;
          while (v > 1000 && i < t.length) {
            v = (v / 1000).toFixed(1);
            i++;
          }
          return v.toString().replace('.',',') + t[i];
        },
        numberFormat: function(val,fixed) {
          return val.toFixed(fixed).replace('.',',');
        },
        hms: function(s) {
          var h = Math.floor(s/3600); s%=3600;
          var m = Math.floor(s/60); s%=60;
          var r = (h<10?"0"+h.toString():h.toString()) + ":";
          r += (m<10?"0"+m.toString():m.toString()) + ":";
          r += (s<10?"0"+s.toString():s.toString());
          return r;
        },
        hmsRT: function(city, type) {
          var nextLevelFlag = false;
          var s = city.get_CityUnitsData().GetRepairTimeFromEUnitGroup(type, nextLevelFlag);
          var h = Math.floor(s/3600); s%=3600;
          var m = Math.floor(s/60); s%=60;
          //console.log(h,m,s);
          var r = (h<10?"0"+h.toString():h.toString()) + ":";
          r += (m<10?"0"+m.toString():m.toString()) + ":";
          r += (s<10?"0"+s.toString():s.toString());
          return r;
        },
        getKey: function(list, find) {
          for (var k in list) {
            var o = list[k];
            if (o === null) continue;
            if (o[find] === undefined) continue;
            if (find != 'l') {
              //console.info('mhloot.getKey',k); 
              return k; 
            }
            if (o.l.length === 0) continue;
            //console.info('mhloot.getKey',k);
            return k;
          }
          return undefined;
        }, 
        getResKey: function(list,find) {
          for (var k in list) {
            var o = list[k];
            if (o === null) continue;
            if (!Array.isArray(o)) continue;
            if (o.length===0) continue;
            if (o[0][find] === undefined) continue;
            return k;
          }
        },
        getKeyHitpoints: function(l) {
          var unit = l[0];
          //var s = unit.get_HitpointsPercent.toSource();
          var s = unit.get_HitpointsPercent.toString();
          var sa = 'Math.min(1, this.';
          var sb = '() / this.';
          var a = s.indexOf(sa) + sa.length;
          var b = s.indexOf(sb);
          var k = s.substr(a, b - a);
          //console.info('mhloot.getKey',k);
          return k;
        },         
        getKeys: function(list, b) {
          for (var k in list) {
            var o = list[k];
            if (o === null) continue;
            if (o.l === undefined) continue;
            if (o.l.length === 0) continue;
            var m = mhloot.getKey(o.l[0],'mt');//dnuc mt=MoveType
            if(m === undefined) continue;
            if(b.keys.Type === undefined) {
              b.keys.Type = m;
            }
            if(o.l[0].GetUnitGroupType ===  undefined) {
              if(b.keys.Resources === undefined) {
                b.keys.Resources = mhloot.getKey(o.l[0],'rer');//rer
                if(b.keys.Resources === undefined) {
                  b.keys.Resources = mhloot.getResKey(o.l[0],'Count');//Resouces
                }
              }
              // buildings
              b.keys.Buildings = k;
            } else {
              // units
              if(o.l[0].GetUnitGroupType()) {
                //1-attack
                b.keys.Offences = k;
              } else {
                //0-defend
                b.keys.Defences = k;
              }
            }
          }
          return b;
        },
        getBypass: function(city, b) {
          //if(b === undefined) b = {};
          if(b.rdy === undefined) {
            // get keys
            b.keys = {};
            b.dnucKeys = {};
            try {
              b = mhloot.getKeys(city.get_CityUnitsData(), b);
              b = mhloot.getKeys(city.get_CityBuildingsData(), b);
              var o;  
              o = city.get_CityBuildingsData()[b.keys.Buildings].l;
              b.keys.Hitpoints = mhloot.getKeyHitpoints(o);//Buildings   
              b.rdy = true;
            } catch (e) {
              console.warn('getBypass: ', e);
            }
          }
          console.dir(b.keys);
          return b;
        },
        getData: function(city, b) {
          if(b.rdy === undefined) {
            b = mhloot.getBypass(city, b);//b must be obj to pass via reference
          }
          l = {};
          try {
            var o;
            
            l.Buildings = [];
            l.Defences = [];
            l.Offences = [];
            
            if(b.keys.Buildings!==undefined) {
              o = city.get_CityBuildingsData()[b.keys.Buildings];
              if(o!==null) l.Buildings = o.l;
            }
            
            if(b.keys.Defences!==undefined) {
              o = city.get_CityUnitsData()[b.keys.Defences];
              if(o!==null) l.Defences = o.l;
            }
            
            if(b.keys.Offences!==undefined) {
              o = city.get_CityUnitsData()[b.keys.Offences];
              if(o!==null) l.Offences = o.l;
            }
            
            l.rdy = true;              
          } catch (e) {
            console.warn('getData: ', e);
          }            
          return l;
        },
        getImportants: function(list) {
          //var abc = "ABCDEFGHI";//abc[column]
          list.Support = {};
          list.CY = {};
          list.DF = {};
          var o = {};
          o.Condition = '-';
          o.Row = '-';
          o.Column = '-';
          list.CY = o;
          list.DF = o;
          if(!showInfo) return;         
          for (var j in list.Buildings) {
            var building = list.Buildings[j];
            var id = building.get_MdbUnitId();
            if(id >= 200 && id <= 205) {
              // console.log(id,'SU',100*building.get_HitpointsPercent(),8-building.get_CoordY());
              list.Support.Condition = 100*building.get_HitpointsPercent();
              list.Support.Row = 8-building.get_CoordY();
              list.Support.Column = building.get_CoordX();
            } 
            else switch (id) {
                case 112: // CONSTRUCTION YARD
                case 151:
                case 177:
                  // console.log(id,'CY',100*building.get_HitpointsPercent(),building.get_CoordX(),8-building.get_CoordY());
                  list.CY.Condition = 100*building.get_HitpointsPercent();
                  list.CY.Row = 8-building.get_CoordY();
                  list.CY.Column = building.get_CoordX();
                  break;
                case 158: // DEFENSE FACILITY
                case 131:
                case 195:
                  // console.log(id,'DF',100*building.get_HitpointsPercent(),building.get_CoordX(),8-building.get_CoordY());
                  list.DF.Condition = 100*building.get_HitpointsPercent();
                  list.DF.Row = 8-building.get_CoordY();
                  list.DF.Column = building.get_CoordX();
                  break;
            }
          }            
        },
        Bypass: {},//obj to pas by reference

        calcResources: function () {
          try {

            var selectedBaseId = mhloot.selectedBaseId;

            var lootable = [0, 0, 0, 0, 0, 0, 0, 0]; 
            var troops = [0, 0, 0, 0, 0]; 
            
            var cc = ClientLib.Data.MainData.GetInstance().get_Cities();
            var ec = cc.GetCity(selectedBaseId);
            
            if(ec === null) return;
            if(ec.get_CityBuildingsData() === null) return;
            
            var oc = cc.get_CurrentOwnCity();
            
            if(oc === null) return;
            if(oc.get_CityBuildingsData() === null) return;
            
            var ol = mhloot.getData(oc, mhloot.Bypass);
            var el = mhloot.getData(ec, mhloot.Bypass);// Buildings Defence Offence 
              
            if(ol===undefined) return;
            if(el===undefined) return;
            
            if(mhloot.Bypass.rdy===undefined) return;
            
            if(el.Buildings.length === 0) return;
            
            if(window.aaa === undefined) window.aaa = {};
            window.aaa.Bypass = mhloot.Bypass;            
            window.aaa.oc = oc;
            window.aaa.ol = ol; 
            window.aaa.ec = ec;
            window.aaa.el = el;
            
            //console.log(el.Buildings);
            //console.log(el.Buildings[0]);
            //console.log(el.Buildings[0][mhloot.Bypass.keys.Resources]);
            //console.log(el.Buildings[0][mhloot.Bypass.keys.Resources].rer);
            var rer = (el.Buildings[0][mhloot.Bypass.keys.Resources].rer !== undefined);
                        
            mhloot.getImportants(el);
            
            // enemy buildings
            for (var j in el.Buildings) {
              var building = el.Buildings[j];
              var mod = building.get_HitpointsPercent(); // 0-1 , 1 means 100%              
              if(rer) {
                var resourcesList = building[mhloot.Bypass.keys.Resources].rer;// CVGRPK UJFOTE
                for (var i in resourcesList) {
                  lootable[resourcesList[i].t] += mod * resourcesList[i].c;// resourcesList[i].Type resourcesList[i].Count
                }
              } else {
                var resourcesList = building[mhloot.Bypass.keys.Resources]; 
                for (var i in resourcesList) {
                  lootable[resourcesList[i].Type] += mod * resourcesList[i].Count;// resourcesList[i].Type resourcesList[i].Count
                }
              }
            }
            
            // enemy defences
            for (var j in el.Defences) {
              var unit = el.Defences[j];
              var mod = unit.get_HitpointsPercent(); // 0-1 , 1 means 100%
                          
              if(rer) {
                var resourcesList = unit[mhloot.Bypass.keys.Resources].rer;
                for (var i in resourcesList) {
                  lootable[resourcesList[i].t] += mod * resourcesList[i].c;
                }
              } else {
                var resourcesList = unit[mhloot.Bypass.keys.Resources];
                for (var i in resourcesList) {
                  lootable[resourcesList[i].Type] += mod * resourcesList[i].Count;
                }
              }
              
              if (showTroops) {
                var current_hp = unit[mhloot.Bypass.keys.Hitpoints]();
                troops[0] += current_hp;
                if (showTroopsExtra) {
                  switch (unit[mhloot.Bypass.keys.Type].mt) {//keyTroop
                    case ClientLib.Base.EUnitMovementType.Feet:
                      troops[1] += current_hp;
                      break;
                    case ClientLib.Base.EUnitMovementType.Track:
                    case ClientLib.Base.EUnitMovementType.Wheel:
                      troops[2] += current_hp;
                      break;
                    case ClientLib.Base.EUnitMovementType.Structure:
                      troops[3] += current_hp;
                      break;
                    case ClientLib.Base.EUnitMovementType.Air:
                    case ClientLib.Base.EUnitMovementType.Air2:
                      troops[4] += current_hp;
                      break;
                  }
                }
              }
            }
            
            mhloot.lootable = lootable;
            mhloot.troops = troops;
          } catch (e) {
            console.warn("calcResources: ", e);
            console.dir("Bypass:",mhloot.Bypass);
          }
        },
        calcInfo: function () { 
          mhloot.infoArrays = [];
          mhloot.twoLineInfoArrays = [];
          var hp;
          var t;
          
          var cc = ClientLib.Data.MainData.GetInstance().get_Cities();
          var oc = cc.get_CurrentOwnCity();
          var ec = cc.get_CurrentCity();
          var ol = mhloot.getData(oc, mhloot.Bypass);
          var el = mhloot.getData(ec, mhloot.Bypass);
          
          if(ol===undefined) return;
          if(el===undefined) return;
          
          // for testing
          if(window.aaa === undefined) window.aaa = {};
          //window.aaa = {};
          window.aaa.oc = oc;
          window.aaa.ol = ol;
          window.aaa.ec = ec;
          window.aaa.el = el;
          
          if(showInfo) { 
            try {             
              mhloot.selectedOwnBaseId = oc.get_Id();
              if(mhloot.lastSelectedOwnBaseId === undefined) mhloot.lastSelectedOwnBaseId = -1;
              if(mhloot.selectedOwnBaseId === undefined) mhloot.selectedOwnBaseId = -1;
              
              
              var ohp=0, dhp=0, bhp=0;
              for (var k in ol.Offences) ohp += ol.Offences[k].get_Health();//own of units
              for (var k in el.Defences) dhp += el.Defences[k].get_Health();//ene df units
                              
              // find CY & DF row/line
              mhloot.getImportants(el);
              
              hp = {};
              hp.name = '<b>Info</b> (HP,HC - D/O ratio. Row.)';
              hp.lbs = ['HP:','HC:','DF:','CY:'];
              t = [];
              t.push(mhloot.numberFormat(dhp/ohp, 2));
              t.push(mhloot.numberFormat(ec.get_TotalDefenseHeadCount()/oc.get_TotalOffenseHeadCount(), 2));
              var abc = "ABCDEFGHI";//abc[column]
              if(showColumnLetter) {
                if(el.DF !== undefined) {t.push(abc[el.DF.Column]+ '-' + el.DF.Row);} else { t.push('??');}  
                if(el.CY !== undefined) {t.push(abc[el.CY.Column]+ '-' + el.CY.Row);} else { t.push('??');}  
              } else {
                if(el.DF !== undefined) {t.push(el.DF.Row);} else { t.push('??');}  
                if(el.CY !== undefined) {t.push(el.CY.Row);} else { t.push('??');}   
              }                
              hp.val = t;
              mhloot.infoArrays.push(hp);
              
              mhloot.lastSelectedOwnBaseId = mhloot.selectedOwnBaseId;              
            } catch (e) {
              console.log("calcInfo 1: ", e);
            }
          }            
          if(showColumnCondition) { 
            try {   
              if(el===undefined) return;
              var bl = el.Buildings;
              var dl = el.Defences;
              
              for(var k in bl) {
                var b = bl[k];
                if(b.get_TechName() == ClientLib.Base.ETechName.Defense_Facility) df = b;
                if(b.get_TechName() == ClientLib.Base.ETechName.Construction_Yard) cy = b;
              }

              var tb;
              var tbhp;
              var cnt;
              var mi;
              var ma;
              
              // CY
              tb = cy;
              cnt = 0;
              tbhp = 0;
              mi = tb.get_CoordX() - 1;
              ma = tb.get_CoordX() + 1;
              for(var k in bl) {
                var o = bl[k];  
                if(o.get_CoordX() >= mi && o.get_CoordX() <= ma) {
                  if(o.get_CoordY() >= tb.get_CoordY()) {
                    cnt++;
                    tbhp += o.get_HitpointsPercent();
                  }
                }
              }
              for(var k in dl) {
                var o = dl[k];  
                //if(o.get_CoordX() == tb.get_CoordX()) {
                if(o.get_CoordX() >= mi && o.get_CoordX() <= ma) {
                  if(o.get_CoordY() >= tb.get_CoordY()) {
                    cnt++;
                    tbhp += o.get_HitpointsPercent();
                  }
                }
              }
              tbhp = 100 * tbhp / cnt;
              var cyhp = tbhp;

              // DF
              tb = df;
              cnt = 0;
              tbhp = 0;
              mi = tb.get_CoordX() - 1;
              ma = tb.get_CoordX() + 1;
              for(var k in bl) {
                var o = bl[k];  
                if(o.get_CoordX() >= mi && o.get_CoordX() <= ma) {
                  if(o.get_CoordY() >= tb.get_CoordY()) {
                    cnt++;
                    tbhp += o.get_HitpointsPercent();
                  }
                }
              }
              for(var k in dl) {
                var o = dl[k];  
                if(o.get_CoordX() >= mi && o.get_CoordX() <= ma) {
                  if(o.get_CoordY() >= tb.get_CoordY()) {
                    cnt++;
                    tbhp += o.get_HitpointsPercent();
                  }
                }
              }
              tbhp = 100 * tbhp / cnt;
              var dfhp = tbhp;               
              
              hp = {};
              hp.name = '<b>CY & DF column HP [%]</b>';
              hp.lbs = ['CY:','DF:'];
              t = [];
              t.push(mhloot.numberFormat(cyhp, 0));
              t.push(mhloot.numberFormat(dfhp, 0));        
              hp.val = t;
              mhloot.infoArrays.push(hp);
              //mhloot.twoLineInfoArrays.push(hp);
                       
            } catch (e) {
              console.log("calcInfo 2: ", e);
            }
          }
          if(showRepairTime) { 
            try {   
              if(ol===undefined) return;
              
              var a = oc.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false);//false // RT Defense
              var v = oc.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false);//false // RT Defense
              var i = oc.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, false);//false // RT Defense
              var m = Math.max(a,v,i);
              
              var aa = oc.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeAir);
              var av = oc.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeVeh);
              var ai = oc.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeInf);                
              var am = Math.min(aa,av,ai);
              
              var ohp=0;
              for (var k in ol.Offences) ohp += ol.Offences[k].get_HitpointsPercent();//get_Health();//Health - hitpoints
              ohp = 100.0 * ohp / ol.Offences.length;
              
              var ool = mhloot.numberFormat(oc.get_LvlOffense(), 1);
              
              hp = {};
              hp.name = '<b>Repair time (Your offence)</b>';
              hp.lbs = ['Maximum:','Available:','Health:','Level:'];
              t = [];
              t.push(mhloot.hms(m)); 
              t.push(mhloot.hms(am));
              t.push(mhloot.numberFormat(ohp, 0));
              t.push(ool);                 
              hp.val = t;
              //mhloot.infoArrays.push(hp);
              mhloot.twoLineInfoArrays.push(hp);
                       
            } catch (e) {
              console.log("calcInfo 3: ", e);
            }
          }
        },
        baseLoaded: function () {
          if( mhloot.lootable[1] > 0 || mhloot.lootable[2] > 0 || 
              mhloot.lootable[3] > 0 || mhloot.lootable[6] > 0) {
            return true;
          }
          return false;
        },
        clearTables: function () {
          mhloot.lootable = [0, 0, 0, 0, 0, 0, 0, 0]; 
          mhloot.troops = [0, 0, 0, 0, 0];
        },
        friendlyInfo: function(widget) {
          widget.removeAll();
          if(!showLevels && !showAllyRepairTimeInfo) return;
          
          twoLineInfoArrays = [];
            
          try {
            
            var r=0;
            var c=0;
            
            var cc = ClientLib.Data.MainData.GetInstance().get_Cities();
            var oc = cc.get_CurrentOwnCity();
            var ec = cc.get_CurrentCity();
            var ol = mhloot.getData(oc, mhloot.Bypass);
            var el = mhloot.getData(ec, mhloot.Bypass);
            
            if(ol===undefined) return;
            if(el===undefined) return;              
            
            //console.log('ec',ec);
            //console.log('el',el);
            // for testing            
            if(window.aaa === undefined) window.aaa = {};
            //window.aaa = {};
            window.aaa.oc = oc;
            window.aaa.ol = ol; 
            window.aaa.ec = ec;
            window.aaa.el = el;

            var oid = oc.get_Id();
            var eid = ec.get_Id();
            var IsOwn = oid == eid;
            
            if(el.Buildings.length>0) {
            
              if(showLevels) { 
                var sd = ec.get_SupportData();
                var sn;
                var sl;
                if(sd !== null) {
                  sl = sd.get_Level();
                  sn = ec.get_SupportWeapon().dn; 
                }
              
                hp = {};
                hp.name = '<b>Levels</b>';
                hp.lbs = ['Base:','Defence:','Offence:','Support:'];
                t = [];
                if(el.Buildings.length>0) t.push(mhloot.numberFormat(ec.get_LvlBase(), 1)); else t.push('--');  
                if(el.Defences.length>0) t.push(mhloot.numberFormat(ec.get_LvlDefense(), 1)); else t.push('--');  
                if(el.Offences.length>0) t.push(mhloot.numberFormat(ec.get_LvlOffense(), 1)); else t.push('--'); 
                if(sd !== null) t.push(mhloot.numberFormat(sl, 1)); else t.push('--'); 
                hp.val = t;
                twoLineInfoArrays.push(hp);
              }
            
              if(showAllyRepairTimeInfo) {
                
                var a = ec.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Aircraft, false);//false // RT Defense
                var v = ec.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Vehicle, false);//false // RT Defense
                var i = ec.get_CityUnitsData().GetRepairTimeFromEUnitGroup(ClientLib.Data.EUnitGroup.Infantry, false);//false // RT Defense
                var m = Math.max(a,v,i);
                
                var aa = ec.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeAir);
                var av = ec.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeVeh);
                var ai = ec.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeInf);                
                var am = Math.min(aa,av,ai);
                
                var ofl;              
                var ohp=0;
                if(el.Offences.length>0) {
                  for (var k in el.Offences) ohp += el.Offences[k].get_HitpointsPercent();//get_Health();//Health - hitpoints
                  //console.log(
                  ohp = mhloot.numberFormat(100.0 * ohp / el.Offences.length, 0);
                  //ohp = ec.GetOffenseConditionInPercent();//GetOffenseConditionInPercent ()
                  ofl = mhloot.numberFormat(ec.get_LvlOffense(), 1);
                } else {
                  ohp = '---';
                  ofl = '---';
                }
                
                hp = {};
                hp.name = IsOwn?'<b>Repair time (Your offence)</b>':'<b>Repair time (Ally offence)</b>';
                hp.lbs = ['Maximum:','Available:','Health:','Level:'];
                t = [];
                t.push(mhloot.hms(m)); 
                //t.push('---');
                t.push(mhloot.hms(am));
                t.push(ohp); 
                t.push(ofl);       
                hp.val = t;
                twoLineInfoArrays.push(hp);
              }              

              if(twoLineInfoArrays !== undefined) {    
                for(var i in twoLineInfoArrays) {              
                  r++; c=0;
                  widget.add(new qx.ui.basic.Label(twoLineInfoArrays[i].name).set({width: 200, rich: true}), { row: r++, column: c, colSpan: 6});    
                  //console.log('i',i);   
                  c=1;
                  for(var j in twoLineInfoArrays[i].lbs) {
                    //console.log('i',i,'j',j); 
                    widget.add(new qx.ui.basic.Label(twoLineInfoArrays[i].lbs[j]), {row: r, column: c});                     
                    widget.add(new qx.ui.basic.Label(twoLineInfoArrays[i].val[j]), {row: r+1, column: c});
                    // widget.add(new qx.ui.basic.Label(mhloot.infoArrays[i].lbs[j]+' '+mhloot.infoArrays[i].val[j]), {row: r, column: c});
                    c+=2;
                  }
                  r++;                
                }
              }              
            } else {
              var w = mhloot.waiting[mhloot.waiting[0]];
              if(++mhloot.waiting[0] >= mhloot.waiting.length) mhloot.waiting[0]=1;
              widget.add(new qx.ui.basic.Label('<b>Repair time (Offence)</b>').set({rich: true}), {row: r++,column: c, colSpan: 6});
              widget.add(new qx.ui.basic.Label('Waiting for server response ' + w).set({rich: true}), {row: r++,column: c});
            }
          } catch (e) {
            console.warn("mhloot.friendlyInfo: ", e);
          }
        }
      };        
      
      /* Wrap onCitiesChange for RegionCityStatusInfoOwn so we can inject our resource widget */
      //webfrontend.gui.region.RegionCityStatusInfoOwn
      if (!webfrontend.gui.region.RegionCityStatusInfoAlliance.prototype.__mhloot_showLootAllianceBase) {
        webfrontend.gui.region.RegionCityStatusInfoAlliance.prototype.__mhloot_showLootAllianceBase = webfrontend.gui.region.RegionCityStatusInfoAlliance.prototype.onCitiesChange;
      }
      webfrontend.gui.region.RegionCityStatusInfoAlliance.prototype.onCitiesChange = function () {
        try {            
          if (!mhloot.lootWindowAlly) {
            mhloot.lootWindowAlly = new qx.ui.container.Composite(new qx.ui.layout.Grid(5, 5));
            mhloot.lootWindowAlly.setTextColor('yellow');//yellow             

            var w = webfrontend.gui.region.RegionCityStatusInfoAlliance.getInstance();              
            w.add(mhloot.lootWindowAlly);
          }            
          mhloot.friendlyInfo(mhloot.lootWindowAlly);
          
        } catch (e) {
          console.warn("mhloot.webfrontend.gui.region.RegionCityStatusInfoAlliance.prototype.onCitiesChange(): ", e);
        }
      
        this.__mhloot_showLootAllianceBase();
      }
      
      /* Wrap onCitiesChange for RegionCityStatusInfoOwn so we can inject our resource widget */
      //webfrontend.gui.region.RegionCityStatusInfoOwn
      if (!webfrontend.gui.region.RegionCityStatusInfoOwn.prototype.__mhloot_showLootOwnBase) {
        webfrontend.gui.region.RegionCityStatusInfoOwn.prototype.__mhloot_showLootOwnBase = webfrontend.gui.region.RegionCityStatusInfoOwn.prototype.onCitiesChange;
      }
      webfrontend.gui.region.RegionCityStatusInfoOwn.prototype.onCitiesChange = function () {
        try {            
          if (!mhloot.lootWindowOwn) {
            mhloot.lootWindowOwn = new qx.ui.container.Composite(new qx.ui.layout.Grid(5, 5));
            mhloot.lootWindowOwn.setTextColor('yellow');//yellow white            

            var w = webfrontend.gui.region.RegionCityStatusInfoOwn.getInstance();              
            w.add(mhloot.lootWindowOwn);
          }            
          mhloot.friendlyInfo(mhloot.lootWindowOwn);

        } catch (e) {
          console.warn("mhloot.webfrontend.gui.region.RegionCityStatusInfoOwn.prototype.onCitiesChange(): ", e);
        }
      
        this.__mhloot_showLootOwnBase();// ??? what for
      }

      /* Wrap onCitiesChange for RegionNPCCampStatusInfo so we can inject our resource widget */
      if (!webfrontend.gui.region.RegionNPCCampStatusInfo.prototype.__mhloot_showLootNPCCamp) {
        webfrontend.gui.region.RegionNPCCampStatusInfo.prototype.__mhloot_showLootNPCCamp = webfrontend.gui.region.RegionNPCCampStatusInfo.prototype.onCitiesChange;
      }
      webfrontend.gui.region.RegionNPCCampStatusInfo.prototype.onCitiesChange = function () {
        try {
          mhloot.selectedBaseId = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCityId();
          mhloot.selectedOwnBaseId = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCityId();

          if (!mhloot.lootWindowCamp) {
            mhloot.lootWindowCamp = new qx.ui.container.Composite(new qx.ui.layout.Grid(5, 5));
            mhloot.lootWindowCamp.setTextColor('white');

            var widget = webfrontend.gui.region.RegionNPCCampStatusInfo.getInstance();
            widget.add(mhloot.lootWindowCamp);
          }
          
          if(mhloot.lastSelectedBaseId !== mhloot.selectedBaseId) mhloot.clearTables();
          mhloot.lastSelectedBaseId = mhloot.selectedBaseId;
          
          if (mhloot.baseLoaded()) {
            addResourcesLabel(mhloot.lootWindowCamp);
          } else {
            addLoadingLabel(mhloot.lootWindowCamp);
          }
          mhloot.calcResources();
          mhloot.calcInfo();

        } catch (e) {
          console.warn("mhloot.webfrontend.gui.region.RegionNPCCampStatusInfo.prototype.onCitiesChange(): ", e);
        }

        this.__mhloot_showLootNPCCamp();
      }

      /* Wrap onCitiesChange for RegionNPCBaseStatusInfo so we can inject our resource widget */
      if (!webfrontend.gui.region.RegionNPCBaseStatusInfo.prototype.__mhloot_showLootNPCBase) {
        webfrontend.gui.region.RegionNPCBaseStatusInfo.prototype.__mhloot_showLootNPCBase = webfrontend.gui.region.RegionNPCBaseStatusInfo.prototype.onCitiesChange;
      }
      webfrontend.gui.region.RegionNPCBaseStatusInfo.prototype.onCitiesChange = function () {
        try {
          mhloot.selectedBaseId = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCityId();
          mhloot.selectedOwnBaseId = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCityId();

          if (!mhloot.lootWindowBase) {
            mhloot.lootWindowBase = new qx.ui.container.Composite(new qx.ui.layout.Grid(5, 5));
            mhloot.lootWindowBase.setTextColor('white');

            var widget = webfrontend.gui.region.RegionNPCBaseStatusInfo.getInstance();
            widget.add(mhloot.lootWindowBase);
          }
          
          if(mhloot.lastSelectedBaseId !== mhloot.selectedBaseId) mhloot.clearTables();
          mhloot.lastSelectedBaseId = mhloot.selectedBaseId;

          if (mhloot.baseLoaded()) {
            addResourcesLabel(mhloot.lootWindowBase);
          } else {
            addLoadingLabel(mhloot.lootWindowBase);
          }
          mhloot.calcResources();
          mhloot.calcInfo();

        } catch (e) {
          console.warn("mhloot.webfrontend.gui.region.RegionNPCBaseStatusInfo.prototype.onCitiesChange(): ", e);
        }

        this.__mhloot_showLootNPCBase();
      }

      /* Wrap onCitiesChange for RegionCityStatusInfoEnemy so we can inject our resource widget */
      if (!webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.__mhloot_showLootPlayerBase) {
        webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.__mhloot_showLootPlayerBase = webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.onCitiesChange;
      }
      webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.onCitiesChange = function () {
        try {
          mhloot.selectedBaseId = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCityId();
          mhloot.selectedOwnBaseId = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCityId(); 

          if (!mhloot.lootWindowPlayer) {
            mhloot.lootWindowPlayer = new qx.ui.container.Composite(new qx.ui.layout.Grid(5, 5));
            mhloot.lootWindowPlayer.setTextColor('white');

            var widget = webfrontend.gui.region.RegionCityStatusInfoEnemy.getInstance();
            widget.add(mhloot.lootWindowPlayer);
          }

          if(mhloot.lastSelectedBaseId !== mhloot.selectedBaseId) mhloot.clearTables(); 
          mhloot.lastSelectedBaseId = mhloot.selectedBaseId;

          if (mhloot.baseLoaded()) {              
            addResourcesLabel(mhloot.lootWindowPlayer);
          } else {
            mhloot.lastSelectedBaseId = mhloot.selectedBaseId;              
          }
          mhloot.calcResources();
          mhloot.calcInfo();

        } catch (e) {
          console.warn("mhloot.webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.onCitiesChange(): ", e);
        }

        this.__mhloot_showLootPlayerBase();
      }

      function addResourcesLabel(widget) {
        try {
          var r=0;
          var c=0;
          widget.removeAll();
          //qx.ui.basic.Atom("Icon Right", "icon/32/actions/go-next.png"); //how to scale icon in atom?
          //OK widget.add(new qx.ui.basic.Atom("MrHIDE","webfrontend/ui/common/icn_res_chrystal.png"), { row: r++, column: c});
          
          //var iconArrays;
          var hp;
          
          // loot
          hp = {};
          hp.name = '<b>Lootable Resources</b>';
          hp.img = resImages;
          t = [];
          t.push(mhloot.lootable[6]);//imgResearch 6
          t.push(mhloot.lootable[1]);//imgTiberium 1
          t.push(mhloot.lootable[2]);//imgCrystal 2
          t.push(mhloot.lootable[3]);//imgCredits 3
          hp.val = t;
          //iconArrays.push(hp);
          
          // draw icon's info              
          r++; c=0;
          widget.add(new qx.ui.basic.Label(hp.name).set({width: 200, rich: true}), { row: r++, column: c, colSpan: 6});    
          //console.log('A) i',i);   
          for(var j in hp.val) {
            //console.log('B) i',i,'j',j);
            widget.add(hp.img[j], {row: r, column: c++}); 
            widget.add(new qx.ui.basic.Label(mhloot.kMG(hp.val[j])).set({textAlign:'left'}), {row: r, column: c++});
          }  
          
          // troop
          if (showTroops) { //to do     
            hp = {};
            hp.name = '<b>Troop Strength</b>';
            hp.img = troopImages;
            t = [];
            t.push(mhloot.troops[0]);
            if (showTroopsExtra) {
              t.push(mhloot.troops[1]);//inf
              t.push(mhloot.troops[2]);//veh
              t.push(mhloot.troops[3]);//stu
              //t.push(mhloot.troops[4]);//air
            }              
            hp.val = t;
            //iconArrays.push(hp);
            //console.log('iconArrays.push(hp);');
            // draw icon's info                            
            r++; c=0;
            widget.add(new qx.ui.basic.Label(hp.name).set({width: 200, rich: true}), { row: r++, column: c, colSpan: 6});  
            widget.add(new qx.ui.basic.Label(mhloot.kMG(hp.val[0])).set({textAlign:'left'}), {row: r, column: c++});  
            //console.log('A) i',i);
            c=2;
            for(var j=1;j<hp.val.length;j++) {
              //console.log('B) i',i,'j',j);
              widget.add(hp.img[j-1], {row: r,column: c++}); 
              widget.add(new qx.ui.basic.Label(mhloot.kMG(hp.val[j])).set({textAlign:'left'}), {row: r, column: c++});
            }   
          }
          
          // draw text info
          if(mhloot.infoArrays !== undefined) {
            for(var i in mhloot.infoArrays) {              
              r++; c=0;
              widget.add(new qx.ui.basic.Label(mhloot.infoArrays[i].name).set({width: 200, rich: true}), { row: r++, column: c, colSpan: 6});    
              //console.log('i',i);   
              c=1;
              for(var j in mhloot.infoArrays[i].lbs) {
                //console.log('i',i,'j',j); 
                //widget.add(new qx.ui.basic.Label(mhloot.infoArrays[i].lbs[j]), {row: r, column: c++});                     
                //widget.add(new qx.ui.basic.Label(mhloot.infoArrays[i].val[j]), {row: r, column: c++});
                widget.add(new qx.ui.basic.Label(mhloot.infoArrays[i].lbs[j]+' '+mhloot.infoArrays[i].val[j]), {row: r, column: c});
                c+=2;
              }           
            }
          }
          //console.log('twoLineInfoArrays entry', mhloot.twoLineInfoArrays); 
          if(mhloot.twoLineInfoArrays !== undefined) {   
            //console.log('twoLineInfoArrays entry',mhloot.twoLineInfoArrays);   
            for(var i in mhloot.twoLineInfoArrays) {              
              r++; c=0;
              widget.add(new qx.ui.basic.Label(mhloot.twoLineInfoArrays[i].name).set({width: 200, rich: true}), { row: r++, column: c, colSpan: 6});    
              //console.log('i',i);   
              c=1;
              for(var j in mhloot.twoLineInfoArrays[i].lbs) {
                //console.log('i',i,'j',j); 
                widget.add(new qx.ui.basic.Label(mhloot.twoLineInfoArrays[i].lbs[j]), {row: r, column: c});                     
                widget.add(new qx.ui.basic.Label(mhloot.twoLineInfoArrays[i].val[j]), {row: r+1, column: c});
                // widget.add(new qx.ui.basic.Label(mhloot.infoArrays[i].lbs[j]+' '+mhloot.infoArrays[i].val[j]), {row: r, column: c});
                c+=2;
              }
              r++;                
            }
          }
        } catch (e) {
          console.warn("mhloot.addResourcesLabel(): ", e);
        }
      }
      
      function addLoadingLabel(widget) {
        try {
          var r=0,c=0;
          widget.removeAll();
          var w = mhloot.waiting[mhloot.waiting[0]];
          if(++mhloot.waiting[0] >= mhloot.waiting.length) mhloot.waiting[0]=1;
          widget.add(new qx.ui.basic.Label('<b>Lootable Resources</b>').set({rich: true}), {row: r++,column: c, colSpan: 6});
          widget.add(new qx.ui.basic.Label('Waiting for server response ' + w).set({rich: true}), {row: r++,column: c});
        } catch (e) {
          console.warn("mhloot.addLoadingLabel: ", e);
        }
      }
    }//endof function MHLootCreate
  
   
    function MHLootLoadExtension() {
      try {
        if (qx != undefined) {
          if (qx.core.Init.getApplication().getMenuBar() !== null) {
            MHLootCreate();
            return; // done
          } 
        }
        window.setTimeout(MHLootLoadExtension, 1000);
      } catch (e) {
        if (typeof console != 'undefined') console.log(e);
        else if (window.opera) opera.postError(e);
        else GM_log(e);
        window.setTimeout(MHLootLoadExtension, 1000); // force it
      }
    }

    if (/commandandconquer\.com/i.test(document.domain)) window.setTimeout(MHLootLoadExtension, 1000);

  }

  function MHLootInject() {
    var script = document.createElement("script");
    txt = MHLootMain.toString();
    script.innerHTML = "(" + txt + ")();";
    script.type = "text/javascript";
    if (/commandandconquer\.com/i.test(document.domain)) document.getElementsByTagName("head")[0].appendChild(script);
  }
  
  MHLootInject();
})();