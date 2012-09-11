// ==UserScript==
// @version       1.7.0
// @name          CnC: MH Tiberium Alliances Available Loot Summary
// @namespace     MHLoot
// @description   CROSS SERVERS Loot & troops info.
// @author        MrHIDEn based on Yaeger & Panavia code. Totaly recoded.
// @include       http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @require       http://sizzlemctwizzle.com/updater.php?id=137978
// ==/UserScript==
(function () {
  var MHLootMain = function () {
    var showLoot = true;                // shows Loot resources info
    var showTroops = false;             // shows overall Hitpoints for Troops
    var showTroopsExtra = false;        // shows Troops Hitpoints for Vehicles/Aircrafts/Infantry
    var showInfo = true;                // shows HP/HC/DF/CY info
    var showColumnCondition = false;    // shows your progress against DF/CY
    var showRepairTime = true;          // shows Repair Times info for Enemy Base/Camp/Outpost
    var showAllyRepairTimeInfo = true;  // shows Ally/Your Repair Times info
    var showLevels = true;              // shows Levels of Base/Defence/Offence info
    var showColumnLetter = false;       // shows columns letters for DF/CY position Ex A-1 or E-4. If 'false' shows only 1 or 4.
    
    function MHLootCreate() {
    
      if(typeof(window.MHTools)=='undefined') window.MHTools = {$n:'MHTools'};
      if(typeof(window.MHTools.Loot)=='undefined') window.MHTools.Loot = {$n:'Loot'};
      var stats = document.createElement('img');
      stats.src = 'http://goo.gl/0Fiza';//1.7.0
      
      var resPaths = [
        "webfrontend/ui/common/icn_res_research_mission.png",
        "webfrontend/ui/common/icn_res_tiberium.png",
        "webfrontend/ui/common/icn_res_chrystal.png",
        "webfrontend/ui/common/icn_res_dollar.png"
      ];
      var resImages = [];
      if (showLoot) {
        for(var k in resPaths) {
          resImages.push(new qx.ui.basic.Image(resPaths[k]).set({Scale:true,Width:16,Height:16}));
        }
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

      // BASES
      var list = [];
      function reload() {
        var S = ClientLib.Base.LocalStorage;
        var l;
        if (S.get_IsSupported()) l = S.GetItem('MHLootList');
        if(l!==null) list = l;
        list.max = 50;
        list.idx = 0;
        for(var i=0;i<list.max;i++) {
          list.idx = i;
          if(typeof(list[i])=='undefined') break;
        }
        console.log('MHLootList reloaded/created');
      }
      reload();
      function getIndex() {
        var l = list;
        var id = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCityId();
        //console.log('getIndex id=',id);
        for(i=0;i<list.max;i++) {
          if(typeof(l[i])=='undefined') continue;
          if(l[i]===null) continue;
          if(l[i].id == id) return i;
        }
        return -1;
      }
      function save(d) {
        try {
          var l = list;
          var id = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCityId();
          var c = {id:id, Data:d};
          var S = ClientLib.Base.LocalStorage;
          for(var i=0;i<l.max;i++) {
            if(typeof(l[i])=='undefined') continue;
            if(l[i]===null) continue;
            if(l[i].id == id) 
            {
              // found
              l[i] = c;
              // JSON
              if (S.get_IsSupported()) S.SetItem('MHLootList', l);
              // done
              return;
            }
          }
          // new
          l[l.idx] = c;
          if(++l.idx >= l.max) l.idx = 0;
          // JSON
          if (S.get_IsSupported()) S.SetItem('MHLootList', l);   
        } catch (e) {
          console.warn("save: ", e);
        }
      }
      function load() {
        try {
          var l = list;
          var id = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCityId();
          for(var i=0;i<l.max;i++) {
            if(typeof(l[i])=='undefined') continue;
            if(l[i]===null) continue;
            if(l[i].id == id) return l[i];
          }
          return {id:id,Data:{}};     
        } catch (e) {
          console.warn("load: ", e);
        }
      }
      function store(k, d) {
        try {
          var mem = load().Data;
          mem[k] = d;
          save(mem);        
        } catch (e) {
          console.warn("store: ", e);
        }
      }
      function restore(k) {
        try {
          var mem = load().Data;
          if(typeof(mem[k])=='undefined') return 'undefined';
          return mem[k];    
        } catch (e) {
          console.warn("restore: ", e);
        }
      }
      
      var MHLoot = {
        selectedType: -1,
        selectedBaseId: null,
        lastSelectedBaseId: null,
        flagBaseLoaded: false,
        
        selectedOwnBaseId: null,
        lastSelectedOwnBaseId: null,
        Data: null,

        // the widgets for the different screens
        lootWindowPlayer: null,
        lootWindowBase: null,
        lootWindowCamp: null,
        lootWindowOwn: null,
        lootWindowAlly: null,

        //lootable: [0, 0, 0, 0, 0, 0, 0, 0],
        //troops: [0, 0, 0, 0, 0],
        waiting: [1,'','.','..','...'],
        
        Display: {
          //loots: [0, 0, 0, 0, 0, 0, 0, 0],
          //troops: [0, 0, 0, 0, 0],
          troopsArray: [],
          lootArray: [],
          iconArrays: [],
          infoArrays: [],
          twoLineInfoArrays: []        
        },
        
        // HELPERS
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
              //console.info('MHLoot.getKey',k); 
              return k; 
            }
            if (o.l.length === 0) continue;
            //console.info('MHLoot.getKey',k);
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
          //console.info('MHLoot.getKey',k);
          return k;
        },         
        getKeys: function(list, b) {
          for (var k in list) {
            var o = list[k];
            if (o === null) continue;
            if (typeof(o.l) == 'undefined') continue;
            if (o.l.length === 0) continue;
            var m = MHLoot.getKey(o.l[0],'mt');//dnuc & mt=MoveType
            if(typeof(m) == 'undefined') continue;
            if(typeof(b.keys.Type) == 'undefined') {
              b.keys.Type = m;//MoveType & dnucKeys aviable in this branch
              //b.keys.dnucKeys = m;
            }
            if(typeof(o.l[0].GetUnitGroupType) ==  'undefined') {
              if(typeof(b.keys.Resources) == 'undefined') {
                b.keys.Resources = MHLoot.getKey(o.l[0],'rer');//rer
                if(typeof(b.keys.Resources) == 'undefined') {
                  b.keys.Resources = MHLoot.getResKey(o.l[0],'Count');//Resouces
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
            //b.dnucKeys = {};
            try {
              b = MHLoot.getKeys(city.get_CityUnitsData(), b);
              b = MHLoot.getKeys(city.get_CityBuildingsData(), b);
              var o;  
              o = city.get_CityBuildingsData()[b.keys.Buildings].l;
              b.keys.Hitpoints = MHLoot.getKeyHitpoints(o);//Buildings   
              b.rdy = true;
            } catch (e) {
              console.warn('getBypass: ', e);
            }
          }
          console.dir(b.keys);
          return b;
        },
        getData: function(city) {
          var b = MHLoot.Data.Bypass;
          if(typeof(b.rdy) == 'undefined') {
            b = MHLoot.getBypass(city, b);//b must be obj to pass via reference
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
          list.Support = {Condition: '-',Row: '-',Column: '-'};
          list.CY = {Condition: '-',Row: '-',Column: '-'};
          list.DF = {Condition: '-',Row: '-',Column: '-'};
          if(!showInfo) return;         
          for (var j in list.Buildings) {
            var building = list.Buildings[j];
            var id = building.get_MdbUnitId();
            if(id >= 200 && id <= 205) {
              //console.log(id,'SU',100*building.get_HitpointsPercent(),'x',building.get_CoordX(),'y',building.get_CoordY(),'8-y',8-parseInt(building.get_CoordY()));
              list.Support.Condition = 100*building.get_HitpointsPercent();
              list.Support.Row = 8-parseInt(building.get_CoordY());
              list.Support.Column = building.get_CoordX();
            } 
            else {
              switch (id) {
                case 112: // CONSTRUCTION YARD
                case 151:
                case 177:
                  //console.log(id,'CY',100*building.get_HitpointsPercent(),'x',building.get_CoordX(),'y',building.get_CoordY(),'8-y',8-parseInt(building.get_CoordY()));
                  list.CY.Condition = 100*building.get_HitpointsPercent();
                  list.CY.Row = 8-parseInt(building.get_CoordY());
                  list.CY.Column = building.get_CoordX();
                  //console.log('list.CY',list.CY);
                  break;
                case 158: // DEFENSE FACILITY
                case 131:
                case 195:
                  //console.log(id,'DF',100*building.get_HitpointsPercent(),'x',building.get_CoordX(),'y',building.get_CoordY(),'8-y',8-parseInt(building.get_CoordY()));
                  list.DF.Condition = 100*building.get_HitpointsPercent();
                  list.DF.Row = 8-parseInt(building.get_CoordY());
                  list.DF.Column = building.get_CoordX();
                  //console.log('list.DF',list.DF);
                  break;
              }
            }
          }
          //console.log('list',list);
        },           
        
        // CORE
        MHTools: function() {
          // for testing
          if(typeof(window.MHTools)=='undefined') window.MHTools = {$n:'MHTools'};
          if(typeof(window.MHTools.Loot)=='undefined') window.MHTools.Loot = {$n:'Loot'};
          window.MHTools.Loot.Data = MHLoot.Data;
          window.MHTools.Loot.List = list;
        },  
        loadBase: function() {
            //console.log('loadBase');
            try {
              if (MHLoot.Data === null) MHLoot.Data = {lastSelectedBaseId: -1, Bypass: {}};
              //if (typeof(MHLoot.Data.Bypass) == 'undefined') MHLoot.Data.Bypass = {};
              
              var r = MHLoot.Data;         
                          
              r.selectedBaseId = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCityId();
              r.selectedOwnBaseId = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCityId();
              
              if (r.lastSelectedBaseId !== r.selectedBaseId) r.loaded = false;
              r.lastSelectedBaseId = r.selectedBaseId;  
              
              r.IsOwnBase = r.selectedBaseId === r.selectedOwnBaseId;
                          
              r.cc = ClientLib.Data.MainData.GetInstance().get_Cities();
              
              r.ec = r.cc.GetCity(r.selectedBaseId);// it is very nice function          
              if(r.ec === null) return false;
              if(r.ec.get_CityBuildingsData() === null) return false;          
              
              r.oc = r.cc.get_CurrentOwnCity();            
              if(r.oc === null) return false;
              if(r.oc.get_CityBuildingsData() === null) return false;
              
              r.ol = MHLoot.getData(r.oc);
              r.el = MHLoot.getData(r.ec);// Buildings Defence Offence               
              if(typeof(r.ol)=='undefined') return false;
              if(typeof(r.el)=='undefined') return false;
              
              if(typeof(MHLoot.Data.Bypass.rdy)=='undefined') return false;
              
              if(r.el.Buildings.length === 0) return false;
                          
              // for testing
              MHLoot.MHTools();
                          
              r.loaded = true;
              MHLoot.flagBaseLoaded = true;
              //MHLoot.Data = r;
              return true;
          } catch (e) {
            console.warn("loadBase: ", e);
            console.dir("MHLoot.Data:",MHLoot.Data);
            return false;
          }
        },
        
        calcResources: function () {
          try {          
            if (!showLoot) return;

            if (!MHLoot.Data.loaded) return;
            
            var el = MHLoot.Data.el;
            
            var loots = [0, 0, 0, 0, 0, 0, 0, 0];
            
            var rerFlag = (typeof(el.Buildings[0][MHLoot.Data.Bypass.keys.Resources].rer) != 'undefined');
            if(rerFlag) {
              if(typeof(MHLoot.Data.rer)=='undefined') {
                console.log('(.rer) exists:', rerFlag);
                var stats = document.createElement('img');
                stats.src = 'http://goo.gl/DbJlh';//rer stats, going to disable rer
              }
            }
            
            // enemy buildings
            for (var j in el.Buildings) {
              var building = el.Buildings[j];
              var mod = building.get_HitpointsPercent(); // 0-1 , 1 means 100%              
              if(rerFlag) {
                var resourcesList = building[MHLoot.Data.Bypass.keys.Resources].rer;// CVGRPK UJFOTE
                for (var i in resourcesList) {
                  loots[resourcesList[i].t] += mod * resourcesList[i].c;// resourcesList[i].Type resourcesList[i].Count
                }
              } else {
                var resourcesList = building[MHLoot.Data.Bypass.keys.Resources]; 
                for (var i in resourcesList) {
                  loots[resourcesList[i].Type] += mod * resourcesList[i].Count;// resourcesList[i].Type resourcesList[i].Count
                }
              }
            }
            
            // enemy defences
            for (var j in el.Defences) {
              var unit = el.Defences[j];
              var mod = unit.get_HitpointsPercent(); // 0-1 , 1 means 100%
                          
              if(rerFlag) {
                var resourcesList = unit[MHLoot.Data.Bypass.keys.Resources].rer;
                for (var i in resourcesList) {
                  loots[resourcesList[i].t] += mod * resourcesList[i].c;
                }
              } else {
                var resourcesList = unit[MHLoot.Data.Bypass.keys.Resources];
                for (var i in resourcesList) {
                  loots[resourcesList[i].Type] += mod * resourcesList[i].Count;
                }
              }
            }
            MHLoot.Display.lootArray = [];
            MHLoot.Display.lootArray[0] = loots[6];//imgResearch 6 
            MHLoot.Display.lootArray[1] = loots[1];//imgTiberium 1
            MHLoot.Display.lootArray[2] = loots[2];//imgCrystal 2
            MHLoot.Display.lootArray[3] = loots[3];//imgCredits 3             
            //MHLoot.Display.loots = loots;
            // store
            store('lootArray',MHLoot.Display.lootArray);
          } catch (e) {
            console.warn("calcResources: ", e);
            console.dir("Bypass:",MHLoot.Data.Bypass);
          }
        },
        calcTroops: function () {
          try {
            if (!showTroops) return;            

            if (!MHLoot.Data.loaded) return;            
            
            var el = MHLoot.Data.el; 
            
            var troops = [0, 0, 0, 0, 0]; 
              
            // enemy defence units
            for (var j in el.Defences) {
              var unit = el.Defences[j];
              var current_hp = unit[MHLoot.Data.Bypass.keys.Hitpoints]();
              troops[0] += current_hp;
              if (showTroopsExtra) {
                switch (unit[MHLoot.Data.Bypass.keys.Type].mt) {//keyTroop // TODO check .mt
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
            MHLoot.Display.troopsArray = troops;
            // store
            store('troopsArray',MHLoot.Display.troopsArray);
          } catch (e) {
            console.warn("calcTroops: ", e);
            console.dir("Bypass:",MHLoot.Data.Bypass);
          }
        },
        calcInfo: function () { 
          MHLoot.Display.infoArrays = [];
          MHLoot.Display.twoLineInfoArrays = [];
          var hp;
          var t;         

          if (!MHLoot.Data.loaded) return;
          
          //var cc = MHLoot.Data.cc;
          var oc = MHLoot.Data.oc;
          var ec = MHLoot.Data.ec; 
          
          var ol = MHLoot.Data.ol;
          var el = MHLoot.Data.el;                
          
          if(showInfo) { 
            try {                   
              var ohp=0, dhp=0, bhp=0;
              for (var k in ol.Offences) ohp += ol.Offences[k].get_Health();//own of units
              for (var k in el.Defences) dhp += el.Defences[k].get_Health();//ene df units
                              
              // find CY & DF row/line
              MHLoot.getImportants(el);
              
              hp = {};
              hp.name = '<b>Info</b> (HP,HC - D/O ratio. Row.)';
              hp.lbs = ['HP:','HC:','DF:','CY:'];
              t = [];
              t.push(MHLoot.numberFormat(dhp/ohp, 2));
              t.push(MHLoot.numberFormat(ec.get_TotalDefenseHeadCount()/oc.get_TotalOffenseHeadCount(), 2));
              var abc = "ABCDEFGHI";//abc[column]
              if(showColumnLetter) {
                if(el.DF !== undefined) {t.push(abc[el.DF.Column]+ '-' + el.DF.Row);} else { t.push('??');}  
                if(el.CY !== undefined) {t.push(abc[el.CY.Column]+ '-' + el.CY.Row);} else { t.push('??');}  
              } else {
                if(el.DF !== undefined) {t.push(el.DF.Row);} else { t.push('??');}  
                if(el.CY !== undefined) {t.push(el.CY.Row);} else { t.push('??');}   
              }                
              hp.val = t;
              MHLoot.Display.infoArrays.push(hp);
              // store
              store('infoArrays',MHLoot.Display.infoArrays);              
              //already done MHLoot.lastSelectedOwnBaseId = MHLoot.selectedOwnBaseId;              
            } catch (e) {
              console.log("calcInfo 1: ", e);
            }
          }            
          if(showColumnCondition) { 
            try {   
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
              var dc;
              
              // CY
              tb = cy;
              cnt = 0;
              tbhp = 0;
              dc = 1;
              mi = tb.get_CoordX() - dc;
              ma = tb.get_CoordX() + dc;
              // scan
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
              dc = 1;
              mi = tb.get_CoordX() - dc;
              ma = tb.get_CoordX() + dc;
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
              t.push(MHLoot.numberFormat(cyhp, 0));
              t.push(MHLoot.numberFormat(dfhp, 0));        
              hp.val = t;
              MHLoot.Display.infoArrays.push(hp);
              //MHLoot.Display.twoLineInfoArrays.push(hp);
              // store
              store('infoArrays',MHLoot.Display.infoArrays);                       
            } catch (e) {
              console.log("calcInfo 2: ", e);
            }
          }
          if(showRepairTime) { 
            try {                 
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
              
              var ool = MHLoot.numberFormat(oc.get_LvlOffense(), 1);
              
              hp = {};
              hp.name = '<b>Repair time (Your offence)</b>';
              hp.lbs = ['Maximum:','Available:','Health:','Level:'];
              t = [];
              t.push(MHLoot.hms(m)); 
              t.push(MHLoot.hms(am));
              t.push(MHLoot.numberFormat(ohp, 0));
              t.push(ool);                 
              hp.val = t;
              //MHLoot.Display.infoArrays.push(hp);
              MHLoot.Display.twoLineInfoArrays.push(hp);
              // store
              store('twoLineInfoArrays',MHLoot.Display.twoLineInfoArrays);                       
            } catch (e) {
              console.log("calcInfo 3: ", e);
            }
          }
        },
        calcFriendlyInfo: function() {
          if(!showLevels && !showAllyRepairTimeInfo) return;
          
          twoLineInfoArrays = [];
            
          try { 
            if (!MHLoot.Data.loaded) return;
            
            //var cc = MHLoot.Data.cc;
            var oc = MHLoot.Data.oc;
            var ec = MHLoot.Data.ec;
            
            var ol = MHLoot.Data.ol;
            var el = MHLoot.Data.el;            
            
            var IsOwn = MHLoot.Data.IsOwnBase;
            
            
            
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
              if(el.Buildings.length>0) t.push(MHLoot.numberFormat(ec.get_LvlBase(), 1)); else t.push('--');  
              if(el.Defences.length>0) t.push(MHLoot.numberFormat(ec.get_LvlDefense(), 1)); else t.push('--');  
              if(el.Offences.length>0) t.push(MHLoot.numberFormat(ec.get_LvlOffense(), 1)); else t.push('--'); 
              if(sd !== null) t.push(MHLoot.numberFormat(sl, 1)); else t.push('--'); 
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
                ohp = MHLoot.numberFormat(100.0 * ohp / el.Offences.length, 0);
                //ohp = ec.GetOffenseConditionInPercent();//GetOffenseConditionInPercent ()
                ofl = MHLoot.numberFormat(ec.get_LvlOffense(), 1);
              } else {
                ohp = '---';
                ofl = '---';
              }
              
              hp = {};
              hp.name = IsOwn?'<b>Repair time (Your offence)</b>':'<b>Repair time (Ally offence)</b>';
              hp.lbs = ['Maximum:','Available:','Health:','Level:'];
              t = [];
              t.push(MHLoot.hms(m)); 
              //t.push('---');
              t.push(MHLoot.hms(am));
              t.push(ohp); 
              t.push(ofl);       
              hp.val = t;
              twoLineInfoArrays.push(hp);
            } 
            // store
            store('twoLineInfoArrays',MHLoot.Display.twoLineInfoArrays); 
          } catch (e) {
            console.warn("MHLoot.calcFriendlyInfo: ", e);
          }
        },
        restoreDisplay: function() {
          var idx = getIndex();  
          if(idx > -1) {
            //console.log('id',ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCityId(),'idx',idx); 
            var d = list[idx].Data;
            MHLoot.Display={};
            for(var k in d) MHLoot.Display[k] = d[k];
            //console.dir(MHLoot.Display);
            return true;
          }
          return false;
        }
      };        
      
      //webfrontend.gui.region.RegionCityStatusInfoOwn
      // BASE - Alliance
      if (!webfrontend.gui.region.RegionCityStatusInfoAlliance.prototype.__mhloot_showLootAllianceBase) {
        webfrontend.gui.region.RegionCityStatusInfoAlliance.prototype.__mhloot_showLootAllianceBase = webfrontend.gui.region.RegionCityStatusInfoAlliance.prototype.onCitiesChange;
      }
      webfrontend.gui.region.RegionCityStatusInfoAlliance.prototype.onCitiesChange = function () {
        try {            
          if (!MHLoot.lootWindowAlly) {
            MHLoot.lootWindowAlly = new qx.ui.container.Composite(new qx.ui.layout.Grid(5, 5));
            MHLoot.lootWindowAlly.setTextColor('yellow');//yellow             

            var w = webfrontend.gui.region.RegionCityStatusInfoAlliance.getInstance();              
            w.add(MHLoot.lootWindowAlly);
          }
          
          if(MHLoot.loadBase()) {           
            MHLoot.calcFriendlyInfo();
            addFriendlyLabel(MHLoot.lootWindowAlly);
          } else {
            //console.log(getIndex());
            addLoadingLabel(MHLoot.lootWindowAlly);
          }
        } catch (e) {
          console.warn("MHLoot.webfrontend.gui.region.RegionCityStatusInfoAlliance.prototype.onCitiesChange(): ", e);
        }
      
        this.__mhloot_showLootAllianceBase();
      }
      
      //webfrontend.gui.region.RegionCityStatusInfoOwn
      // BASE - Own
      if (!webfrontend.gui.region.RegionCityStatusInfoOwn.prototype.__mhloot_showLootOwnBase) {
        webfrontend.gui.region.RegionCityStatusInfoOwn.prototype.__mhloot_showLootOwnBase = webfrontend.gui.region.RegionCityStatusInfoOwn.prototype.onCitiesChange;
      }
      webfrontend.gui.region.RegionCityStatusInfoOwn.prototype.onCitiesChange = function () {
        try {            
          if (!MHLoot.lootWindowOwn) {
            MHLoot.lootWindowOwn = new qx.ui.container.Composite(new qx.ui.layout.Grid(5, 5));
            MHLoot.lootWindowOwn.setTextColor('yellow');//yellow white            

            var w = webfrontend.gui.region.RegionCityStatusInfoOwn.getInstance();              
            w.add(MHLoot.lootWindowOwn);
          }
          
          if(MHLoot.loadBase()) {           
            MHLoot.calcFriendlyInfo();
            addFriendlyLabel(MHLoot.lootWindowOwn);
          } else {
            //console.log(getIndex());
            addLoadingLabel(MHLoot.lootWindowOwn);
          }
        } catch (e) {
          console.warn("MHLoot.webfrontend.gui.region.RegionCityStatusInfoOwn.prototype.onCitiesChange(): ", e);
        }
      
        this.__mhloot_showLootOwnBase();// ??? what for
      }

      // CAMP - Forgotten
      if (!webfrontend.gui.region.RegionNPCCampStatusInfo.prototype.__mhloot_showLootNPCCamp) {
        webfrontend.gui.region.RegionNPCCampStatusInfo.prototype.__mhloot_showLootNPCCamp = webfrontend.gui.region.RegionNPCCampStatusInfo.prototype.onCitiesChange;
      }
      webfrontend.gui.region.RegionNPCCampStatusInfo.prototype.onCitiesChange = function () {
        try {
          if (!MHLoot.lootWindowCamp) {
            MHLoot.lootWindowCamp = new qx.ui.container.Composite(new qx.ui.layout.Grid(5, 5));
            MHLoot.lootWindowCamp.setTextColor('white');

            var widget = webfrontend.gui.region.RegionNPCCampStatusInfo.getInstance();
            widget.add(MHLoot.lootWindowCamp);
          }
          
          if (MHLoot.loadBase()) {
            MHLoot.calcResources();
            MHLoot.calcTroops();
            MHLoot.calcInfo();
            addResourcesLabel(MHLoot.lootWindowCamp);
          } else {          
            if(MHLoot.restoreDisplay()) {
              addResourcesLabel(MHLoot.lootWindowCamp);
            } else {        
              addLoadingLabel(MHLoot.lootWindowCamp);
            }
          }

        } catch (e) {
          console.warn("MHLoot.webfrontend.gui.region.RegionNPCCampStatusInfo.prototype.onCitiesChange(): ", e);
        }

        this.__mhloot_showLootNPCCamp();
      }

      // BASE - Forgotten
      if (!webfrontend.gui.region.RegionNPCBaseStatusInfo.prototype.__mhloot_showLootNPCBase) {
        webfrontend.gui.region.RegionNPCBaseStatusInfo.prototype.__mhloot_showLootNPCBase = webfrontend.gui.region.RegionNPCBaseStatusInfo.prototype.onCitiesChange;
      }
      webfrontend.gui.region.RegionNPCBaseStatusInfo.prototype.onCitiesChange = function () {
        try {
          if (!MHLoot.lootWindowBase) {
            MHLoot.lootWindowBase = new qx.ui.container.Composite(new qx.ui.layout.Grid(5, 5));
            MHLoot.lootWindowBase.setTextColor('white');

            var widget = webfrontend.gui.region.RegionNPCBaseStatusInfo.getInstance();
            widget.add(MHLoot.lootWindowBase);
          }
          
          if (MHLoot.loadBase()) {
            MHLoot.calcResources();
            MHLoot.calcTroops();
            MHLoot.calcInfo();
            addResourcesLabel(MHLoot.lootWindowBase);
          } else {           
            if(MHLoot.restoreDisplay()) {
              addResourcesLabel(MHLoot.lootWindowCamp);
            } else {          
              addLoadingLabel(MHLoot.lootWindowCamp);
            }
          }

        } catch (e) {
          console.warn("MHLoot.webfrontend.gui.region.RegionNPCBaseStatusInfo.prototype.onCitiesChange(): ", e);
        }

        this.__mhloot_showLootNPCBase();
      }

      // BASE - PvP
      if (!webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.__mhloot_showLootPlayerBase) {
        webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.__mhloot_showLootPlayerBase = webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.onCitiesChange;
      }
      webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.onCitiesChange = function () {
        try {
          if (!MHLoot.lootWindowPlayer) {
            MHLoot.lootWindowPlayer = new qx.ui.container.Composite(new qx.ui.layout.Grid(5, 5));
            MHLoot.lootWindowPlayer.setTextColor('white');

            var widget = webfrontend.gui.region.RegionCityStatusInfoEnemy.getInstance();
            widget.add(MHLoot.lootWindowPlayer);
          }

          if (MHLoot.loadBase()) {  
            MHLoot.calcResources();
            MHLoot.calcTroops();
            MHLoot.calcInfo();            
            addResourcesLabel(MHLoot.lootWindowPlayer);
          } else {           
            if(MHLoot.restoreDisplay()) {
              addResourcesLabel(MHLoot.lootWindowCamp);
            } else {          
              addLoadingLabel(MHLoot.lootWindowCamp);
            }      
          }

        } catch (e) {
          console.warn("MHLoot.webfrontend.gui.region.RegionCityStatusInfoEnemy.prototype.onCitiesChange(): ", e);
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
          if (showLoot) {
            hp = {};
            hp.name = '<b>Lootable Resources</b>';
            hp.img = resImages;
            t = [];
            //t.push(MHLoot.Display.loots[6]);//imgResearch 6 lootArray
            //t.push(MHLoot.Display.loots[1]);//imgTiberium 1
            //t.push(MHLoot.Display.loots[2]);//imgCrystal 2
            //t.push(MHLoot.Display.loots[3]);//imgCredits 3   
            t.push(MHLoot.Display.lootArray[0]);//Research 6  
            t.push(MHLoot.Display.lootArray[1]);//Tiberium 1
            t.push(MHLoot.Display.lootArray[2]);//Crystal 2
            t.push(MHLoot.Display.lootArray[3]);//Credits 3           
            hp.val = t;
            //iconArrays.push(hp);  //store !!
            
            // draw icon's info              
            r++; c=0;
            widget.add(new qx.ui.basic.Label(hp.name).set({width: 200, rich: true}), { row: r++, column: c, colSpan: 6});    
            //console.log('A) i',i);   
            for(var j in hp.val) {
              //console.log('B) i',i,'j',j);
              widget.add(hp.img[j], {row: r, column: c++}); 
              widget.add(new qx.ui.basic.Label(MHLoot.kMG(hp.val[j])).set({textAlign:'left'}), {row: r, column: c++});
            } 
          }
          
          // troop
          if (showTroops) { //to do     
            hp = {};
            hp.name = '<b>Troop Strength</b>';
            hp.img = troopImages;
            t = [];
            t.push(MHLoot.Display.troopsArray[0]);
            if (showTroopsExtra) {
              t.push(MHLoot.Display.troopsArray[1]);//inf
              t.push(MHLoot.Display.troopsArray[2]);//veh
              t.push(MHLoot.Display.troopsArray[3]);//stu
              //t.push(MHLoot.Display.troopsArray[4]);//air
            }              
            hp.val = t;
            //iconArrays.push(hp);
            //console.log('iconArrays.push(hp);');
            // draw icon's info                            
            r++; c=0;
            widget.add(new qx.ui.basic.Label(hp.name).set({width: 200, rich: true}), { row: r++, column: c, colSpan: 6});  
            widget.add(new qx.ui.basic.Label(MHLoot.kMG(hp.val[0])).set({textAlign:'left'}), {row: r, column: c++});  
            //console.log('A) i',i);
            c=2;
            for(var j=1;j<hp.val.length;j++) {
              //console.log('B) i',i,'j',j);
              widget.add(hp.img[j-1], {row: r,column: c++}); 
              widget.add(new qx.ui.basic.Label(MHLoot.kMG(hp.val[j])).set({textAlign:'left'}), {row: r, column: c++});
            }   
          }
          
          // draw text info
          if(MHLoot.Display.infoArrays !== undefined) {
            for(var i in MHLoot.Display.infoArrays) {              
              r++; c=0;
              widget.add(new qx.ui.basic.Label(MHLoot.Display.infoArrays[i].name).set({width: 200, rich: true}), { row: r++, column: c, colSpan: 6});    
              //console.log('i',i);   
              c=1;
              for(var j in MHLoot.Display.infoArrays[i].lbs) {
                //console.log('i',i,'j',j); 
                //widget.add(new qx.ui.basic.Label(MHLoot.Display.infoArrays[i].lbs[j]), {row: r, column: c++});                     
                //widget.add(new qx.ui.basic.Label(MHLoot.Display.infoArrays[i].val[j]), {row: r, column: c++});
                widget.add(new qx.ui.basic.Label(MHLoot.Display.infoArrays[i].lbs[j]+' '+MHLoot.Display.infoArrays[i].val[j]), {row: r, column: c});
                c+=2;
              }           
            }
          }
          //console.log('twoLineInfoArrays entry', MHLoot.Display.twoLineInfoArrays); 
          if(MHLoot.Display.twoLineInfoArrays !== undefined) {   
            //console.log('twoLineInfoArrays entry',MHLoot.Display.twoLineInfoArrays);   
            for(var i in MHLoot.Display.twoLineInfoArrays) {              
              r++; c=0;
              widget.add(new qx.ui.basic.Label(MHLoot.Display.twoLineInfoArrays[i].name).set({width: 200, rich: true}), { row: r++, column: c, colSpan: 6});    
              //console.log('i',i);   
              c=1;
              for(var j in MHLoot.Display.twoLineInfoArrays[i].lbs) {
                //console.log('i',i,'j',j); 
                widget.add(new qx.ui.basic.Label(MHLoot.Display.twoLineInfoArrays[i].lbs[j]), {row: r, column: c});                     
                widget.add(new qx.ui.basic.Label(MHLoot.Display.twoLineInfoArrays[i].val[j]), {row: r+1, column: c});
                // widget.add(new qx.ui.basic.Label(MHLoot.Display.infoArrays[i].lbs[j]+' '+MHLoot.Display.infoArrays[i].val[j]), {row: r, column: c});
                c+=2;
              }
              r++;                
            }
          }
        } catch (e) {
          console.warn('MHLoot.addResourcesLabel(): ', e);
        }
      }
      
      function addLoadingLabel(widget) {
        try {
          widget.removeAll();
          var r=0, c=0;
          var w = MHLoot.waiting[MHLoot.waiting[0]];
          if(++MHLoot.waiting[0] >= MHLoot.waiting.length) MHLoot.waiting[0]=1;
          if (showLoot) widget.add(new qx.ui.basic.Label('<b>Lootable Resources</b>').set({rich: true}), {row: r++,column: c, colSpan: 6});
          widget.add(new qx.ui.basic.Label('Waiting for server response ' + w).set({rich: true}), {row: r++,column: c});
        } catch (e) {
          console.warn('MHLoot.addLoadingLabel: ', e);
        }
      }
    
      function addFriendlyLabel(widget) {
        try {              
          widget.removeAll();
          if(typeof(twoLineInfoArrays)!='undefined') {
            var r=0, c=0;
            for(var i in twoLineInfoArrays) {              
              r++; c=0;
              widget.add(new qx.ui.basic.Label(twoLineInfoArrays[i].name).set({width: 200, rich: true}), { row: r++, column: c, colSpan: 6});    
              //console.log('i',i);   
              c=1;
              for(var j in twoLineInfoArrays[i].lbs) {
                //console.log('i',i,'j',j); 
                widget.add(new qx.ui.basic.Label(twoLineInfoArrays[i].lbs[j]), {row: r, column: c});                     
                widget.add(new qx.ui.basic.Label(twoLineInfoArrays[i].val[j]), {row: r+1, column: c});
                // widget.add(new qx.ui.basic.Label(MHLoot.Display.infoArrays[i].lbs[j]+' '+MHLoot.Display.infoArrays[i].val[j]), {row: r, column: c});
                c+=2;
              }
              r++;                
            }
          }
        } catch (e) {
          console.warn('MHLoot.addFriendlyLabel: ', e);
        }
      }
    }//endof function MHLootCreate
   
    function MHLootLoadExtension() {
      try {
        if (typeof(qx) != 'undefined') {
          if (qx.core.Init.getApplication().getMenuBar() !== null) {
            MHLootCreate();
            return; // done
          } 
        }
      } catch (e) {
        if (typeof(console) != 'undefined') console.log(e);
        else if (window.opera) opera.postError(e);
        else GM_log(e);
      }
      window.setTimeout(MHLootLoadExtension, 1000); // force it
    }
    window.setTimeout(MHLootLoadExtension, 1000);
  }

  function MHLootInject() {
    var script = document.createElement('script');
    txt = MHLootMain.toString();
    script.innerHTML = '(' + txt + ')();';
    script.type = 'text/javascript';
    document.getElementsByTagName('head')[0].appendChild(script);
  }
  
  MHLootInject();
})();