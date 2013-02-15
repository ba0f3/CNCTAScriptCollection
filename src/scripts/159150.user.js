// ==UserScript==
// @name Tiberium Alliances PvP/PvE Player Info Mod
// @description Separates the number of bases destroyed into PvP and PvE in the Player Info window.
// @namespace player_info_mod
// @include https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @version 1.1
// @author KRS_L
// ==/UserScript==
(function () {
  var PlayerInfoMod_main = function () {
    var playerInfoWindow = null;
    var general = null;
    var pvpScoreLabel = null;
    var pveScoreLabel = null;
    var playerName = null;

    function createPlayerInfoMod() {
      try {
        console.log('PvP/PvE Bases Destroyed Mod loaded');
		playerInfoWindow = webfrontend.gui.info.PlayerInfoWindow.getInstance();
        general = playerInfoWindow.getChildren()[0].getChildren()[0].getChildren()[0].getChildren()[0].getChildren()[0].getChildren()[1].getChildren()[0];
        playerName = general.getChildren()[1];
		
        var pvpLabel = new qx.ui.basic.Label("- PvP:");
        pvpScoreLabel = new qx.ui.basic.Label("").set({
          textColor: "text-value",
          font: "font_size_13_bold"
        });
        general.add(pvpLabel, {
          row: 3,
          column: 3
        });
        general.add(pvpScoreLabel, {
          row: 3,
          column: 4
        });

        var pveLabel = new qx.ui.basic.Label("- PvE:");
        pveScoreLabel = new qx.ui.basic.Label("").set({
          textColor: "text-value",
          font: "font_size_13_bold"
        });
        general.add(pveLabel, {
          row: 4,
          column: 3
        });
        general.add(pveScoreLabel, {
          row: 4,
          column: 4
        });

        playerInfoWindow.addListener("close", onPlayerInfoWindowClose, this);
        playerName.addListener("changeValue", onPlayerChanged, this);

      } catch (e) {
        console.log("createPlayerInfoMod: ", e);
      }
    }

    function onPlayerInfo(context, data) {
      try {
        pvpScoreLabel.setValue((data.bd-data.bde).toString());
        pveScoreLabel.setValue(data.bde.toString());
      } catch (e) {
        console.log("onPlayerInfo: ", e);
      }
    }

    function onPlayerChanged() {
      try {
        if (playerName.getValue().length > 0) {
          ClientLib.Net.CommunicationManager.GetInstance().SendSimpleCommand("GetPublicPlayerInfoByName", {
            name: playerName.getValue()
          }, phe.cnc.Util.createEventDelegate(ClientLib.Net.CommandResult, this, onPlayerInfo), null);        
        }
      } catch (e) {
        console.log("onPlayerChanged: ", e);
      }
    }

    function onPlayerInfoWindowClose() {
      try {
        pvpScoreLabel.setValue("");
        pveScoreLabel.setValue("");
      } catch (e) {
        console.log("onPlayerInfoWindowClose: ", e);
      }
    }

    function PlayerInfoMod_checkIfLoaded() {
      try {
        if (typeof qx !== 'undefined' && typeof qx.locale !== 'undefined' && typeof qx.locale.Manager !== 'undefined') {
          if (ClientLib.Data.MainData.GetInstance().get_Alliance().get_FirstLeaders() !== null && ClientLib.Data.MainData.GetInstance().get_Alliance().get_FirstLeaders().l.length != 0) {
            createPlayerInfoMod();
          } else {
            window.setTimeout(PlayerInfoMod_checkIfLoaded, 1000);
          }
        } else {
          window.setTimeout(PlayerInfoMod_checkIfLoaded, 1000);
        }
      } catch (e) {
        console.log("PlayerInfoMod_checkIfLoaded: ", e);
      }
    }

    if (/commandandconquer\.com/i.test(document.domain)) {
      window.setTimeout(PlayerInfoMod_checkIfLoaded, 1000);
    }
  }

  try {
    var PlayerInfoMod = document.createElement("script");
    PlayerInfoMod.innerHTML = "(" + PlayerInfoMod_main.toString() + ")();";
    PlayerInfoMod.type = "text/javascript";
    if (/commandandconquer\.com/i.test(document.domain)) {
      document.getElementsByTagName("head")[0].appendChild(PlayerInfoMod);
    }
  } catch (e) {
    console.log("PlayerInfoMod: init error: ", e);
  }
})();