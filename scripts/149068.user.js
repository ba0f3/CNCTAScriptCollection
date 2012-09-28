// ==UserScript==
// @name infernal wrapper
// @description does nothing
// @namespace infernal_wrapper
// @include https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @version 0.372567
// @author ppl before me and me
// ==/UserScript==
(function () {
  var CCTAWrapper_main = function () {
    try {
    gni = function(o, idx){
        var i = 0;
        for (k in o){
            if (i == idx){
                return k;
            }
            i++;
        }
        return '';
    }
    gbi = function(n, o, idx){_log(n);_logp(o);var i=0;for(k in o){i++;if(i==idx) return o[k];}}
    sbi = function(n, o, idx, v){_log(n);_logp(o);var i=0;for(k in o){i++;if(i==idx) o[k]=v;}}
    _log = function(){
        if(typeof console != 'undefined') console.log(arguments);
	    else if(window.opera) opera.postError(arguments);
	    else GM_log(arguments);
	}
	hmm = []
	_show = function(o){var ks=[];var i=0; for (k in o)ks[i++]=k;return ks;}
	_logp = function(o){_log(_show(o));}
    _log('have fun :)')
    wrapper = {
       _val_or_def: function(val, def) {
            if(typeof val != 'undefined') return val;
            return def;
        },
        _prop_name: function(prop_map) {return prop_map[this.versions[this.version]];},
        _prop_index: function(prop_map) {return prop_map[this.versions[this.version]+1];},
        versions: {'368132': 0, '372393': 2, '372567': 4},
        version: null,//'368132',
        init_wrap: function(wrap) {
            try {
                var fn = wrap[0]
                var to_name = wrap[1]
                var tp_name = wrap[2]
                var sp_map = wrap[3]
                if(wrap.length == 5) var opt_so_name = wrap[4];
                var so_name = this._val_or_def(opt_so_name, to_name)
                var sp_index = sp_map[this._index]
                //_log('testing'+to_name+'.'+tp_name+'='+sp_name+':'+sp_index+':'+sp_map[this._name])
                switch (fn){
                    case 0:
                        var sp_name = gni(eval(so_name), sp_index)
                        var eval_str = to_name+"."+tp_name+" = "+so_name+"."+sp_name;
                        break;
                    case 1: 
                        var sp_name = gni(eval(so_name+'.prototype'), sp_index)
                        var eval_str = to_name+".prototype."+tp_name+" = "+so_name+".prototype."+sp_name;
                        break;
                    case 2:
                        var sp_name = gni(eval("(new "+so_name+")"), sp_index)
                        var eval_str = to_name+".prototype."+tp_name+" = function(){return this."+sp_name+";}"
                        break;
                    case 3:
                        var sp_name = gni(eval("(new "+so_name+")"), sp_index)
                        var eval_str = to_name+".prototype."+tp_name+" = function(value){this."+sp_name+"=value;}"
                        break;
                }
                //hmm.push([sp_map[this._name], sp_name])
                //_log(eval_str)
                eval(eval_str)
            } catch(e) {
                _log(e)
            }
        },
        wraps: [
            [0, 'System', 'EventHandler', ['UXDRTN', 515, 'NGTHZJ', 529, 'JCSGJY', 529]],
            [1, 'System.EventHandler', '$ctor', ['NKAYQG', 1, 'MIARKA', 1, 'EWWHOL', 1]],
            [1, 'ClientLib.Vis.ViewModeChange', '$ctor', ['NKAYQG', 1, 'MIARKA', 1, 'EWWHOL', 1]],
            [0, 'SharedLib', 'Combat', ['ABMZCA', 479, 'IDXMKY', 489, 'ADKXKR', 489]],
            [0, 'SharedLib.Combat', 'CbtSetup', ['PIZEIS', 511, 'NRUUGI', 523, 'WHLOUM', 523], 'SharedLib'],
            [0, 'SharedLib.Combat', 'CbtSimulation', ['MTNICQ', 514, 'DZXTYL', 526, 'ACBTHR', 526], 'SharedLib'],
            [2, 'ClientLib.Vis.Battleground.Battleground', 'get_Entities', ['VMKWMN', 47, 'XSWELH', 32, 'KMBRZW', 32]],
            [1, 'SharedLib.Combat.CbtSimulation', 'DoStep', ['RVQKEM', 24, 'OWGEVP', 26, 'UZQRCL', 26]],
            [2, 'SharedLib.Combat.CbtSimulation', 'get_iCombatStep', ['XPJFXB', 12, 'VMUZIL', 13, 'DRBCLE', 13]],
            [0, 'SharedLib.Combat', 'CbtEntity', ['RMODUK', 517, 'JTEOOI', 531, 'JCGAHG', 531], 'SharedLib'],
            [2, 'SharedLib.Combat.CbtEntity', 'get_eAlignment', ['VTZLJN', 12, 'DGCHHX', 16, 'FNFYRU', 16]],
            [2, 'SharedLib.Combat.CbtEntity', 'get_iHitpoints', ['FOYNHE', 20, 'WVNYBU', 24, 'KZYUFV', 24]],
            [2, 'SharedLib.Combat.CbtEntity', 'get_iHitpointsCurrent', ['BVCBXJ', 21, 'JRPGGY', 25, 'TQGPMJ', 25]],
            [2, 'SharedLib.Combat.CbtEntity', 'get_MDCTypeId', ['ADPYGJ', 9, 'LWEMLL', 13, 'DOHVCH', 13]],
            [2, 'SharedLib.Combat.CbtEntity', 'get_iLevel', ['XAWKEE', 33, 'BBOCMN', 40, 'VLRZBZ', 40]],
            [0, 'ClientLib.Base.Util', 'GetUnitLevelData', ['MYJUVV', 35, 'NSRLEW', 36, 'LBVSBJ', 36]],
            [0, 'ClientLib.Data', 'World', ['DHZVSV', 225, 'FBIHPA', 222, 'ZNNOJA', 222], 'SharedLib'],
            [2, 'ClientLib.Data.World', 'getSectors', ['EBJZUK', 2, 'USDXCN', 8, 'XKDXDO', 8]],
            [2, 'ClientLib.Data.CityUnits', 'get_FullRawRepairTimeForUnitGroupTypes', ['IKDTVE', 6, 'OTDSKU', 6, 'KJXNLV', 6]],
            [1, 'ClientLib.Data.CityUnits', 'get_OffenseUnits', ['VPNCHY', 68, 'YFPFEA', 68, 'VQTZWZ', 68]],
            [1, 'ClientLib.Data.CityUnits', 'get_DefenseUnits', ['BFENHD', 69, 'BVLEOM', 69, 'KSNJIL', 69]],
            [0, 'ClientLib.Data', 'CityRepair', ['KBVZQX', 295, 'XSCVQY', 302, 'EMJXEK', 302], 'SharedLib'],
            [1, 'ClientLib.Data.CityRepair', 'CanRepair', ['JPPHSL', 51, 'KPJOGJ', 51, 'CJNJHS', 51]],
            [1, 'ClientLib.Data.CityRepair', 'UpdateCachedFullRepairAllCost', ['IMVKOC', 63, 'FPXIRL', 63, 'USKKAR', 63]],
            [1, 'ClientLib.Data.CityRepair', 'ConvertRepairCost', ['SPZDZS', 54, 'KTBNUH', 54, 'SZMDMZ', 54]],
            [1, 'ClientLib.Data.CityPreArmyUnits', 'RefreshData', ['UPLGQX', 20, 'AYSULX', 20, 'GGASDX', 20]],
            [2, 'ClientLib.Data.City', 'getResourceLayout', ['TTZXUV', 50, 'VEVRWH', 51, 'LTUGHT', 51]],
            [2, 'ClientLib.Data.CityBuildings', 'get_Buildings', ['QQXUFW', 2, 'KXNWER', 2, 'MJZVZV', 2]],
            [2, 'ClientLib.Data.CityEntity', 'get_UnitLevelRequirements', ['JSPNOJ', 2, 'ELBALP', 2, 'GPJTIV', 2]],
            [1, 'ClientLib.Data.CityEntity', 'get_UnitLevelRepairCost', ['get_UnitLevelRequirements', 67, 'get_UnitLevelRequirements', 69, 'get_UnitLevelRequirements', 69]],
            [3, 'ClientLib.Data.Combat', 'set_Version', ['QVVMKN', 2, 'JVAKKQ', 1, 'SWINUM', 1]],
            [3, 'ClientLib.Data.Combat', 'set_StartStep', ['ILFZUG', 3, 'FIGZGC', 3, 'XNBJZC', 3]],
            [3, 'ClientLib.Data.Combat', 'set_Attacker', ['OYABQD', 4, 'TRRERK', 4, 'PYFENC', 4]],
            [3, 'ClientLib.Data.Combat', 'set_Defender', ['UQJQSW', 5, 'ZSTKUP', 5, 'MSSCZL', 5]],
            [3, 'ClientLib.Data.Combat', 'set_Blocker', ['ZBVZOD', 6, 'KFQWVW', 6, 'IQSLLP', 6]],
            [3, 'ClientLib.Data.Combat', 'set_Buildings', ['DFGGIB', 7, 'FSVKTA', 7, 'OPLYEK', 7]],
            [3, 'ClientLib.Data.Combat', 'set_Supports', ['DZOZGI', 8, 'PTSGBE', 8, 'PIHBNH', 8]],
            [3, 'ClientLib.Data.Combat', 'set_Debug', ['GNSESK', 36, 'LEEPKR', 38, 'JNJGAB', 38]],
            [1, 'ClientLib.Data.Combat', 'setNPCNames', ['DUVWXR', 44, 'GOAFQJ', 46, 'ZUQXYT', 46]],
            [0, 'ClientLib.Vis.Battleground', 'BattlegroundEntity', ['BLEBFL', 516, 'QGVOPO', 530, 'KOBQGP', 530], 'System'],
            [2, 'ClientLib.Vis.Battleground.BattlegroundEntity', 'get_Entity', ['ILLYJL', 25, 'RVVLCA', 25, 'KZYXTD', 25]],
            [2, 'ClientLib.Vis.Battleground.BattlegroundEntity', 'get_UnitType', ['KPWXBD', 1, 'IQTKIG', 1, 'CIZUDY', 1]],
            [2, 'ClientLib.Vis.Battleground.Battleground', 'get_Simulation', ['YPYRGP', 44, 'QRDUJM', 29, 'WQOTHV', 29]],
            [3, 'ClientLib.Vis.Battleground.Battleground', 'set_CurrentReplay', ['YMADLI', 79, 'OMDYHD', 54, 'FMVUZS', 54]],
            [1, 'ClientLib.Vis.Battleground.Battleground', 'setCombatData', ['ZMQRGW', 182, 'ADMYQP', 159, 'GREBVM', 159]],
            [2, 'ClientLib.Res.ResMain', 'get_Gamedata', ['YMIGZX', 1, 'BQKOXH', 1, 'FEPVKS', 1]]
            //[2, 'SharedLib.Combat.CbtSetup', 'get_Entities', ['VMKWMN', 48, 'XSWELH', 0]],//??
            //[1, 'ClientLib.Data.CityPreArmyUnits', 'UpdateArmyLayout', ['CIVNTG', 0, 'JKGIUG', 0]],// Should not be needed
        ],
        init: function() {
            try{
                this._name = this.versions[this.version]
                this._index = this._name + 1

                System = $I
                SharedLib = $I

                for (var i in this.wraps) this.init_wrap(this.wraps[i]);
            }catch(e){
                _log(e)
            }
        }
    }  
      function createCCTAWrapper() {
        console.log('CCTAWrapper loaded');
        _log('wrapper loading'+PerforceChangelist);
        wrapper.version = '' + PerforceChangelist
        wrapper.init()
        _log('wrapper loaded')
        _log(hmm)
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
