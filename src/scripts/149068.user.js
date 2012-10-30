// ==UserScript==
// @name infernal wrapper
// @description Supplies some wrapper functions for public use 
// @namespace infernal_wrapper
// @include https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @version 0.377320
// @author ppl before me and me (KRS update)
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
		versions: {'377320': 0, '376877': 2},
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
                //_log('testing'+to_name+'.'+tp_name+'='+sp_name+':'+sp_index+':'+sp_map[this._name])//
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
                //hmm.push([sp_map[this._name], sp_name])//
                //_log(eval_str)//
                eval(eval_str)
            } catch(e) {
                _log(e)
            }
        },
        wraps: [
            [0, 'System', 'EventHandler', ['CWWMIZ', 543, 'VQAKPD', 543]],
			[1, 'System.EventHandler', '$ctor', ['QNQETI', 1, 'NXJLQC', 1]],
			[1, 'ClientLib.Vis.ViewModeChange', '$ctor', ['QNQETI', 1, 'NXJLQC', 1]],
            [0, 'SharedLib', 'Combat', ['JPBXWF', 503, 'CGBMCM', 503]],
            [0, 'SharedLib.Combat', 'CbtSetup', ['YQVCQF', 537, 'CFNHQI', 537], 'SharedLib'],
            [0, 'SharedLib.Combat', 'CbtSimulation', ['IVRUOI', 540, 'OGJDCU', 540], 'SharedLib'],
			[2, 'ClientLib.Vis.Battleground.Battleground', 'get_Entities', ['IIRVDC', 34, 'HMPBEL', 34]],
			[1, 'SharedLib.Combat.CbtSimulation', 'DoStep', ['HZAQGO', 26, 'OZNGIF', 26]],
			[2, 'SharedLib.Combat.CbtSimulation', 'get_iCombatStep', ['JIDEXI', 13,  'BTMWDJ', 13]],
            [0, 'SharedLib.Combat', 'CbtEntity', ['FGWBKX', 545, 'PBFRTF', 545], 'SharedLib'],
			[2, 'SharedLib.Combat.CbtEntity', 'get_eAlignment', ['IUOUGK', 16, 'KLHRMZ', 16]],
			[2, 'SharedLib.Combat.CbtEntity', 'get_iHitpoints', ['GXZHAC', 24, 'FYHVGA', 24]],
			[2, 'SharedLib.Combat.CbtEntity', 'get_iHitpointsCurrent', ['KDYFYJ', 25, 'ASFZMD', 25]],
			[2, 'SharedLib.Combat.CbtEntity', 'get_MDCTypeId', ['WGNLAL', 13, 'LTBOYU', 13]],
			[2, 'SharedLib.Combat.CbtEntity', 'get_iLevel', ['WJHTRJ', 40, 'HSPNVK', 40]],
			[0, 'ClientLib.Base.Util', 'GetUnitLevelData', ['FQOVNN', 38, 'YGQRGP', 38]],
            [0, 'ClientLib.Data', 'World', ['PJMMYG', 231, 'RDYUYF', 231], 'SharedLib'],
			[2, 'ClientLib.Data.World', 'getSectors', ['HUXQGY', 8, 'ANMXFR', 8]],
			[2, 'ClientLib.Data.CityUnits', 'get_FullRawRepairTimeForUnitGroupTypes', ['FUYJDA', 7, 'LDSYZO', 7]],
			[1, 'ClientLib.Data.CityUnits', 'get_OffenseUnits', ['HACXVD', 69, 'DIZTUT', 69]],
			[1, 'ClientLib.Data.CityUnits', 'get_DefenseUnits', ['MDQQBX', 70, 'EXCSOX', 70]],
            [0, 'ClientLib.Data', 'CityRepair', ['UVZXVI', 312, 'OWAQVX', 312], 'SharedLib'],
			[1, 'ClientLib.Data.CityRepair', 'CanRepair', ['FIZTWE', 53, 'ZPEHWO', 53]],
			[1, 'ClientLib.Data.CityRepair', 'UpdateCachedFullRepairAllCost', ['TMEKYX', 64, 'VSNBNQ', 64]],
			[1, 'ClientLib.Data.CityRepair', 'ConvertRepairCost', ['IVHSGL', 55, 'LZMLXK', 55]],
			[1, 'ClientLib.Data.CityPreArmyUnits', 'RefreshData', ['QEODBO', 20, 'YQZKMQ', 20]],
			[2, 'ClientLib.Data.City', 'getResourceLayout', ['FKRLSH', 52, 'MYESHS', 52]],
			[2, 'ClientLib.Data.CityBuildings', 'get_Buildings', ['PVEESL', 2, 'QNFWFP', 2]],
			[2, 'ClientLib.Data.CityEntity', 'get_UnitLevelRequirements', ['HVVCBL', 2, 'JOEWZW', 2]],
			[1, 'ClientLib.Data.CityEntity', 'get_UnitLevelRepairCost', ['get_UnitLevelRequirements', 72, 'get_UnitLevelRequirements', 72]],
			[3, 'ClientLib.Data.Combat', 'set_Version', ['GCXHTV', 1, 'UTIDZS', 1]],
			[3, 'ClientLib.Data.Combat', 'set_StartStep', ['RFCVNH', 3, 'EFTIQO', 3]],
			[3, 'ClientLib.Data.Combat', 'set_Attacker', ['ZWMNIU', 4, 'ZMZYXH', 4]],
			[3, 'ClientLib.Data.Combat', 'set_Defender', ['PIPZUE', 5, 'CITGBD', 5]],
			[3, 'ClientLib.Data.Combat', 'set_Blocker', ['EVZSNO', 6, 'ECKQRQ', 6]],
			[3, 'ClientLib.Data.Combat', 'set_Buildings', ['GMJGVM', 7, 'HPNAEI', 7]],
			[3, 'ClientLib.Data.Combat', 'set_Supports', ['WUOKDX', 8, 'XOMZBM', 8]],
			[3, 'ClientLib.Data.Combat', 'set_Debug', ['XTUDSK', 38, 'UVVBAQ', 38]],
			[1, 'ClientLib.Data.Combat', 'setNPCNames', ['KNZLQM', 46, 'NPRHMX', 46]],
            [0, 'ClientLib.Vis.Battleground', 'BattlegroundEntity', ['BHLSUB', 544, 'ARYOWZ', 544], 'System'],
			[2, 'ClientLib.Vis.Battleground.BattlegroundEntity', 'get_Entity', ['NWSIVL', 25, 'VBNXCJ', 25]],
			[2, 'ClientLib.Vis.Battleground.BattlegroundEntity', 'get_UnitType', ['DIVHXP', 1, 'UDAXIB', 1]],
			[2, 'ClientLib.Vis.Battleground.Battleground', 'get_Simulation', ['IDOHOC', 31, 'RKDMUM', 31]],
			[3, 'ClientLib.Vis.Battleground.Battleground', 'set_CurrentReplay', ['LMWOQU', 57, 'YMEUVV', 57]],
			[1, 'ClientLib.Vis.Battleground.Battleground', 'setCombatData', ['BUWBBY', 174, 'MWVXYL', 174]],
			[2, 'ClientLib.Res.ResMain', 'get_Gamedata', ['SRRXMI', 1, 'DTVFOZ', 1]]
            //[2, 'SharedLib.Combat.CbtSetup', 'get_Entities', ['IIRVDC', 48, 'HMPBEL', 0]],//??
            //[1, 'ClientLib.Data.CityPreArmyUnits', 'UpdateArmyLayout', ['EWLLDI', 0, 'RIIBPO', 0]],// Should not be needed
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
