// ==UserScript==
// @name C&C Tiberium Alliances Wrapper
// @description Creating prototypes that EA missed in their API
// @namespace CCTAWrapper
// @include https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @version 0.9.2b372393
// @author mmaelstrom, PythEch, KRS_L, TheStriker
// @require http://sizzlemctwizzle.com/updater.php?id=140988
// ==/UserScript==
(function () {
  var CCTAWrapper_main = function () {
    try {

      function createCCTAWrapper() {
        console.log('CCTAWrapper loaded');
		var idxs = {
		'NGTHZJ': 530
		,'MIARKA':2
		,'IDXMKY':490
		,'NRUUGI':524
		,'DZXTYL':527
		,'OWGEVP':27
		,'JTEOOI':532
		,'NSRLEW':37
		,'FBIHPA':223
		,'YFPFEA':69
		,'BVLEOM':70
		,'XSCVQY':303
		,'KPJOGJ':52
		,'FPXIRL':64
		,'KTBNUH':55
		,'AYSULX':21
		,'GOAFQJ':47
		,'QGVOPO':531
		,'ADMYQP':160
		,'USDXCN':9
		,'OTDSKU':7
		,'VEVRWH':52
		,'KXNWER':3
		,'JVAKKQ':2
		,'FIGZGC':4
		,'TRRERK':5
		,'ZSTKUP':6
		,'KFQWVW':7
		,'FSVKTA':8
		,'PTSGBE':9
		,'LEEPKR':39
		,'RVVLCA':26
		,'IQTKIG':2
		}
		function log_prop_idx(obj, name) {
			var i = 0
			for (key in obj) {
			  i++
			  if (key == name) {
				console.log(",'" + name + "':" + i);
				idxs[name] = i
				return i
			  }
			}
			console.log('prop not found:' + name)
			return null
		}

		function get_prop_by_idx(obj, idx) {
			var i = 0
			for (key in obj) {
				i++
				  if (i == idx) {
				    return obj[key]
				  }
			}
			console.log('index not found:' + i)
			return null
		}

		function get_or_log(obj, name) {
			console.log('get: '+name)
			if((typeof(idxs[name]) == "undefined")||(idxs[name]==null)){
				log_prop_idx(obj, name);
			}
			return get_prop_by_idx(obj, idxs[name]);
		
		}
		function set_or_log(obj, name, value) {
			console.log('set:'+name)
			if((typeof(idxs[name]) == "undefined")||(idxs[name]==null)){
				log_prop_idx(obj, name);
			}
			obj[idxs[name]] = value;
		}
		gol = get_or_log
		sol = set_or_log

		System = $I;
		SharedLib = $I;

		System.EventHandler = gol(System, 'NGTHZJ');
		System.EventHandler.prototype.$ctor = gol(System.EventHandler.prototype, 'MIARKA');
		ClientLib.Vis.ViewModeChange.prototype.$ctor = gol(ClientLib.Vis.ViewModeChange.prototype, 'MIARKA');
		SharedLib.Combat = gol(SharedLib, 'IDXMKY');
		SharedLib.Combat.CbtSetup = gol(SharedLib, 'NRUUGI');
		SharedLib.Combat.CbtSimulation = gol(SharedLib, 'DZXTYL');
		//ClientLib.Vis.Battleground.Battleground.prototype.get_Entities
		SharedLib.Combat.CbtSetup.prototype.get_Entities = function(){return gol(this, 'XSWELH');};
		ClientLib.Vis.Battleground.Battleground.prototype.get_Entities = function(){return gol(this, 'XSWELH');};
		SharedLib.Combat.CbtSimulation.prototype.DoStep = gol(SharedLib.Combat.CbtSimulation.prototype, 'OWGEVP');
		SharedLib.Combat.CbtSimulation.prototype.get_iCombatStep = function(){return gol(this, 'VMUZIL');};
		SharedLib.Combat.CbtEntity = gol(SharedLib, 'JTEOOI');
		SharedLib.Combat.CbtEntity.prototype.get_eAlignment = function(){return gol(this, 'DGCHHX');};
		SharedLib.Combat.CbtEntity.prototype.get_iHitpoints = function(){return gol(this, 'WVNYBU');};
		SharedLib.Combat.CbtEntity.prototype.get_iHitpointsCurrent = function(){return gol(this, 'JRPGGY');};
		SharedLib.Combat.CbtEntity.prototype.get_MDCTypeId = function(){return gol(this, 'LWEMLL');};
		SharedLib.Combat.CbtEntity.prototype.get_iLevel = function(){return gol(this, 'BBOCMN');};
		ClientLib.Base.Util.GetUnitLevelData = gol(ClientLib.Base.Util, 'NSRLEW');
		ClientLib.Data.World = gol(SharedLib, 'FBIHPA');
		ClientLib.Data.World.prototype.getSectors = function(){return gol(this, 'USDXCN');};
		ClientLib.Data.CityUnits.prototype.get_FullRawRepairTimeForUnitGroupTypes = function(){return gol(this, 'OTDSKU');};
		ClientLib.Data.CityUnits.prototype.get_OffenseUnits = gol(ClientLib.Data.CityUnits.prototype, 'YFPFEA');
		ClientLib.Data.CityUnits.prototype.get_DefenseUnits = gol(ClientLib.Data.CityUnits.prototype, 'BVLEOM');
		ClientLib.Data.CityRepair = gol(SharedLib, 'XSCVQY');
		ClientLib.Data.CityRepair.prototype.CanRepair = gol(ClientLib.Data.CityRepair.prototype, 'KPJOGJ');
		ClientLib.Data.CityRepair.prototype.UpdateCachedFullRepairAllCost = gol(ClientLib.Data.CityRepair.prototype, 'FPXIRL');
		ClientLib.Data.CityRepair.prototype.ConvertRepairCost = gol(ClientLib.Data.CityRepair.prototype, 'KTBNUH');
		//ClientLib.Data.CityPreArmyUnits.prototype.UpdateArmyLayout = gol(ClientLib.Data.CityPreArmyUnits.prototype, 'JKGIUG');		// Should not be needed
		ClientLib.Data.CityPreArmyUnits.prototype.RefreshData = gol(ClientLib.Data.CityPreArmyUnits.prototype, 'AYSULX');
		ClientLib.Data.City.prototype.getResourceLayout = function(){return gol(this, 'VEVRWH');};
		ClientLib.Data.CityBuildings.prototype.get_Buildings = function(){return gol(this, 'KXNWER');};
		//get_UnitLevelRepairCost
		ClientLib.Data.CityEntity.prototype.get_UnitLevelRequirements = function(){return gol(this, 'ELBALP');};
		// does not exist in the old way
		ClientLib.Data.CityEntity.prototype.get_UnitLevelRepairCost = ClientLib.Data.CityEntity.prototype.get_UnitLevelRequirements;
		ClientLib.Data.Combat.prototype.set_Version = function(value){sol(this, 'JVAKKQ', value);};
		ClientLib.Data.Combat.prototype.set_StartStep = function(value){sol(this, 'FIGZGC', value);};
		ClientLib.Data.Combat.prototype.set_Attacker = function(value){sol(this, 'TRRERK', value);};
		ClientLib.Data.Combat.prototype.set_Defender = function(value){sol(this, 'ZSTKUP', value);};
		ClientLib.Data.Combat.prototype.set_Blocker = function(value){sol(this, 'KFQWVW', value);};
		ClientLib.Data.Combat.prototype.set_Buildings = function(value){sol(this, 'FSVKTA', value);};
		ClientLib.Data.Combat.prototype.set_Supports = function(value){sol(this, 'PTSGBE', value);};
		ClientLib.Data.Combat.prototype.set_Debug = function(value){sol(this, 'LEEPKR', value);};
		ClientLib.Data.Combat.prototype.setNPCNames = gol(ClientLib.Data.Combat.prototype, 'GOAFQJ');
		ClientLib.Vis.Battleground.BattlegroundEntity = gol(System, 'QGVOPO');
		ClientLib.Vis.Battleground.BattlegroundEntity.prototype.get_Entity = function(){return gol(this, 'RVVLCA');};
		ClientLib.Vis.Battleground.BattlegroundEntity.prototype.get_UnitType = function(){return gol(this, 'IQTKIG');};
		ClientLib.Vis.Battleground.Battleground.prototype.get_Simulation = function(){return gol(this, 'QRDUJM');};
		ClientLib.Vis.Battleground.Battleground.prototype.set_CurrentReplay = function(value){sol(this, 'OMDYHD', value);};
		ClientLib.Vis.Battleground.Battleground.prototype.setCombatData = gol(ClientLib.Vis.Battleground.Battleground.prototype, 'ADMYQP');
		ClientLib.Res.ResMain.prototype.get_Gamedata = function(){return gol(this, 'BQKOXH');};

      }
    } catch (e) {
      console.log("createCCTAWrapper: ", e);
    }

    function CCTAWrapper_checkIfLoaded() {
      try {
        if (typeof qx !== 'undefined') {
          createCCTAWrapper();
        } else {
          window.setTimeout(CCTAWrapper_checkIfLoaded, 1000);
        }
      } catch (e) {
        CCTAWrapper_IsInstalled = false;
        console.log("CCTAWrapper_checkIfLoaded: ", e);
      }
    }

    if (/commandandconquer\.com/i.test(document.domain)) {
      window.setTimeout(CCTAWrapper_checkIfLoaded, 1000);
    }
  }
  console.log("CCTAWrapper trial");
  try {
    var CCTAWrapper = document.createElement("script");
    CCTAWrapper.innerHTML = "var CCTAWrapper_IsInstalled = true; (" + CCTAWrapper_main.toString() + ")();";
    CCTAWrapper.type = "text/javascript";
    if (/commandandconquer\.com/i.test(document.domain)) {
      document.getElementsByTagName("head")[0].appendChild(CCTAWrapper);
    }
  } catch (e) {
    console.log("CCTAWrapper: init error: ", e);
  }
})();
