// ==UserScript==
// @name Tiberium Alliances Transfer All Resources
// @description Integrates a transfer all feature into the transfer window.
// @namespace transfer_all
// @include https://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @version 1.2
// @author KRS_L
// ==/UserScript==
(function () {
  var TransferAll_main = function () {
    var chkbxConfirm = null;
    var resTypeToggle = null;

    function createTransferAll() {
      try {
        console.log('TransferAll loaded');
        chkbxConfirm = new qx.ui.form.CheckBox("");
        resTypeToggle = webfrontend.gui.trade.TradeOverlay.getInstance().getLayoutChildren()[13].getLayoutChildren()[1].getLayout()._getLayoutChildren()[1].getLayoutChildren()[2];
        var btnTransferAll=new webfrontend.ui.SoundButton("Transfer All").set({width:80,enabled:false});

        chkbxConfirm.addListener("changeValue", function () {
          btnTransferAll.setEnabled(chkbxConfirm.getValue());
          if (chkbxConfirm.getValue()) performAction('costCalculation');
        }, this);

        resTypeToggle.addListener("changeValue", function () {
          chkbxConfirm.setValue(false);
        }, this);

        btnTransferAll.addListener("click", function () {
          performAction('transfer');
        }, this);

        webfrontend.gui.trade.TradeOverlay.getInstance().getLayoutChildren()[13].getLayoutChildren()[1].getLayout()._getLayoutChildren()[3].add(btnTransferAll,{right:2,top:100});
        webfrontend.gui.trade.TradeOverlay.getInstance().getLayoutChildren()[13].getLayoutChildren()[1].getLayout()._getLayoutChildren()[3].add(chkbxConfirm,{right:68,top:104});
      } catch (e) {
        console.log("createTransferAll: ", e);
      }
    }

    function performAction(action) {
      try {
        var cities = ClientLib.Data.MainData.GetInstance().get_Cities();
        var ownCity = cities.get_CurrentOwnCity();
        var isTiberium = resTypeToggle.getValue();
        var costLabel = webfrontend.gui.trade.TradeOverlay.getInstance().getLayoutChildren()[13].getLayoutChildren()[1].getLayout()._getLayoutChildren()[3].getLayoutChildren()[1].getLayoutChildren()[1].getLayoutChildren()[2];
        var resType = ClientLib.Base.EResourceType.Crystal;
		var transferCost = 0;
        var resAmount;
        if (isTiberium) resType = ClientLib.Base.EResourceType.Tiberium;

        for (var city in cities.get_AllCities().d) {
          if (city == ownCity.get_Id()) continue;
          resAmount = Math.floor(cities.get_AllCities().d[city].GetResourceCount(resType));
          if (action == 'transfer') ownCity.SelfTrade(city, resType, resAmount);
          if (action == 'costCalculation') transferCost += cities.get_AllCities().d[city].CalculateTradeCostToCoord(ownCity.get_PosX(), ownCity.get_PosY(), resAmount);
        }
        if (action == 'transfer') chkbxConfirm.setValue(false);
        if (action == 'costCalculation') costLabel.setValue(webfrontend.gui.Util.formatNumbersCompactAfterMillion(transferCost));
		if (transferCost > ClientLib.Data.MainData.GetInstance().get_Player().GetCreditsCount()) costLabel.setTextColor("red");
      } catch (e) {
        console.log("performAction: ", e);
      }
    }

    function TransferAll_checkIfLoaded() {
      try {
        if (typeof qx !== 'undefined') {
          if (ClientLib.Data.MainData.GetInstance().get_Player().get_Faction() !== null) {
            createTransferAll();
          } else {
            window.setTimeout(TransferAll_checkIfLoaded, 1000);
          }
        } else {
          window.setTimeout(TransferAll_checkIfLoaded, 1000);
        }
      } catch (e) {
        console.log("TransferAll_checkIfLoaded: ", e);
      }
    }

    if (/commandandconquer\.com/i.test(document.domain)) {
      window.setTimeout(TransferAll_checkIfLoaded, 1000);
    }
  }

  try {
    var TransferAll = document.createElement("script");
    TransferAll.innerHTML = "(" + TransferAll_main.toString() + ")();";
    TransferAll.type = "text/javascript";
    if (/commandandconquer\.com/i.test(document.domain)) {
      document.getElementsByTagName("head")[0].appendChild(TransferAll);
    }
  } catch (e) {
    console.log("TransferAll: init error: ", e);
  }
})();