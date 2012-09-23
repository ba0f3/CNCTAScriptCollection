// ==UserScript==
// @name        C&C - Tiberium Alliances Combat Simulator
// @namespace   Deyhak
// @description C&C Tiberium Alliances Basic Combat Simulator
// @include     https://prodgame*.alliances.commandandconquer.com/*/index.aspx
// @version     0.1.6
// @author      Deyhak
// @grant MetaData
// ==/UserScript==


var unsafeWindow=window;
function initSimulateBattle(){
    
	qx = unsafeWindow["qx"];
	ClientLib = unsafeWindow["ClientLib"];
	
    var lock = false;
	var application = qx.core.Init.getApplication();
	var bas = application.getUIItem(ClientLib.Data.Missions.PATH.BAR_ATTACKSETUP);
	var btn = new qx.ui.form.Button("Simulate");
	
	btn.set({ width: 68, height: 30});
	btn.addListener("click", function(){
		if (lock)                 
            return;
		
		qx = unsafeWindow["qx"];
		ClientLib = unsafeWindow["ClientLib"];
		webfrontend = unsafeWindow["webfrontend"];

		var city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity();
		var ownCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
		var app = qx.core.Init.getApplication();		
		ownCity.get_CityArmyFormationsManager().set_CurrentTargetBaseId(city.get_Id());
		ClientLib.Vis.VisMain.GetInstance().get_Battleground().SimulateBattle();
		
		app.getPlayArea().setView(webfrontend.gui.PlayArea.PlayArea.modes.EMode_CombatReplay, city.get_Id(), 0, 0);

		lock = true;
        var cooldown = new qx.ui.form.Button("Wait...");
        cooldown.set({ width: 68, height: 30});
        bas.add(cooldown, { right: 66, bottom: 4 });
		setTimeout(function(){
			lock = false;
            bas.remove(cooldown);
		}, 10000)
	}, this)
        bas.add(btn, { right: 66, bottom: 4 });
}


function initReturnSetup(){
    

        var buttonReturnSetup = new qx.ui.form.Button("Setup");
                     buttonReturnSetup.set({
                        width: 80,
                        appearance: "button-text-small",
                        toolTipText: "Return to Combat Setup"
                     });
                     buttonReturnSetup.addListener("click", function() {
                     // Set the scene again, just in case it didn't work the first time
                     var app = qx.core.Init.getApplication();
                     var player_cities = ClientLib.Data.MainData.GetInstance().get_Cities();
                     var current_city = player_cities.get_CurrentCity();
                     try {
                        app.getPlayArea().setView(webfrontend.gui.PlayArea.PlayArea.modes.EMode_CombatSetupDefense, current_city.get_Id(), 0, 0);
                     } catch (e) {
                        app.getPlayArea().setView(webfrontend.gui.PlayArea.modes.EMode_CombatSetupDefense, current_city.get_Id(), 0, 0);
                     }
                  } , this);
    
        var replayBar = qx.core.Init.getApplication().getReportReplayOverlay();
            replayBar.add(buttonReturnSetup, {
                        top: 10,
                        left: 0
                     });
}

function initUnlockCombat()
{
             var armyBar = qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_ATTACKSETUP);

                     var buttonUnlockAttack = new qx.ui.form.Button("X");
                     buttonUnlockAttack.set({
                        width: 44,
                        height: 45,
                        appearance: "button-text-small",
                        toolTipText: "Unlocks Combat"
                     });
                     buttonUnlockAttack.setThemedFont("bold");
                     buttonUnlockAttack.addListener("click",function() {
                     var armyBar = qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_ATTACKSETUP);
                     armyBar.remove(buttonUnlockAttack);
                     setTimeout(function() {
                        armyBar.add(buttonUnlockAttack);}, 2000);
                  } , this);
                     armyBar.add(buttonUnlockAttack, {
                        bottom: 7,
                        right: 10
                     });
      
}

function initTools(){
     var buttonTools = new qx.ui.form.Button("Tools");
     buttonTools.set({
        width: 68, height: 30,
        appearance: "button-text-small",
        toolTipText: "Open Simulator Tools"
     });
     var battleResultsBox = new qx.ui.window.Window("Tools");
     buttonTools.addListener("click", function() {

                     battleResultsBox.setPadding(1);
                     battleResultsBox.setLayout(new qx.ui.layout.VBox(1));
                     battleResultsBox.setShowMaximize(false);
                     battleResultsBox.setShowMinimize(false);
                     battleResultsBox.moveTo(125, 125);
                     battleResultsBox.setHeight(300);
                     battleResultsBox.setWidth(300);
                     if (battleResultsBox.isVisible()) {
                        battleResultsBox.close();
                     }
                     else battleResultsBox.open();
                     }, this);
    var armyBar = qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_ATTACKSETUP);
    
     var tabView = new qx.ui.tabview.TabView();
     tabView.setPadding(5);
     battleResultsBox.add(tabView);

     ////////////////// Stats ////////////////////
     var statsPage = new qx.ui.tabview.Page("Stats");
     statsPage.setLayout(new qx.ui.layout.VBox(5));
     statsPage.setPadding(1);
     tabView.add(statsPage);
        // The Enemy Vertical Box
     var eVBox = new qx.ui.container.Composite()
     eVBox.setLayout(new qx.ui.layout.VBox(5));
     eVBox.setThemedFont("bold");
     eVBox.setThemedPadding(2);
     eVBox.setThemedBackgroundColor("#eef");
     statsPage.add(eVBox);
    // The Enemy Troop Strength Label
     var eHBox1 = new qx.ui.container.Composite();
     eHBox1.setLayout(new qx.ui.layout.HBox(5));
     eHBox1.add(new qx.ui.basic.Label("Enemy Base: "));
     var enemyTroopStrengthLabel = new qx.ui.basic.Label("100");
     eHBox1.add(enemyTroopStrengthLabel);
     enemyTroopStrengthLabel.setTextColor("red");
     eVBox.add(eHBox1);
     // Units
     var eHBox4 = new qx.ui.container.Composite();
     eHBox4.setLayout(new qx.ui.layout.HBox(5));
     eHBox4.add(new qx.ui.basic.Label("Defences: "));
     var enemyUnitsStrengthLabel = new qx.ui.basic.Label("100");
     eHBox4.add(enemyUnitsStrengthLabel);
     enemyUnitsStrengthLabel.setTextColor("green");
     eVBox.add(eHBox4);
     // Buildings
     var eHBox5 = new qx.ui.container.Composite();
     eHBox5.setLayout(new qx.ui.layout.HBox(5));
     eHBox5.add(new qx.ui.basic.Label("Buildings: "));
     var enemyBuildingsStrengthLabel = new qx.ui.basic.Label("100");
     eHBox5.add(enemyBuildingsStrengthLabel);
     enemyBuildingsStrengthLabel.setTextColor("green");
     eVBox.add(eHBox5);
     // Command Center
     var eHBox2 = new qx.ui.container.Composite();
     eHBox2.setLayout(new qx.ui.layout.HBox(5));
     eHBox2.add(new qx.ui.basic.Label("Construction Yard: "));
     var CYTroopStrengthLabel = new qx.ui.basic.Label("100");
     eHBox2.add(CYTroopStrengthLabel);
     CYTroopStrengthLabel.setTextColor("red");
     eVBox.add(eHBox2);
     // Defense Facility
     var eHBox3 = new qx.ui.container.Composite();
     eHBox3.setLayout(new qx.ui.layout.HBox(5));
     eHBox3.add(new qx.ui.basic.Label("Defense Facility: "));
     var DFTroopStrengthLabel = new qx.ui.basic.Label("100");
     eHBox3.add(DFTroopStrengthLabel);
     DFTroopStrengthLabel.setTextColor("red");
     eVBox.add(eHBox3);
    
     var hboxSupportContainer = new qx.ui.container.Composite();
     hboxSupportContainer.setLayout(new qx.ui.layout.HBox(5));
     var enemySupportLevelLabel = new qx.ui.basic.Label("Support lvl ");
     hboxSupportContainer.add(enemySupportLevelLabel);
     var enemySupportStrengthLabel = new qx.ui.basic.Label("--: 100");
     hboxSupportContainer.add(enemySupportStrengthLabel);
     enemySupportStrengthLabel.setTextColor("red");
     eVBox.add(hboxSupportContainer);
     // The Troops Vertical Box
     var tVBox = new qx.ui.container.Composite()
     tVBox.setLayout(new qx.ui.layout.VBox(5));
     tVBox.setThemedFont("bold");
     tVBox.setThemedPadding(2);
     tVBox.setThemedBackgroundColor("#eef");
     statsPage.add(tVBox);
     // The Repair Time Label
     var tHBox1 = new qx.ui.container.Composite();
     tHBox1.setLayout(new qx.ui.layout.HBox(5));
     tHBox1.add(new qx.ui.basic.Label("Repair Time: "));
     var simRepairTimeLabel = new qx.ui.basic.Label("0:00:00");
     tHBox1.add(simRepairTimeLabel);
     simRepairTimeLabel.setTextColor("blue");
     tVBox.add(tHBox1);
     // The Troop Strength Label
     var tHBox5 = new qx.ui.container.Composite();
     tHBox5.setLayout(new qx.ui.layout.HBox(5));
     tHBox5.add(new qx.ui.basic.Label("Overall: "));
     var simTroopDamageLabel = new qx.ui.basic.Label("100");
     tHBox5.add(simTroopDamageLabel);
     simTroopDamageLabel.setTextColor("blue");
     tVBox.add(tHBox5);
     // The Infantry Troop Strength Label
     var tHBox2 = new qx.ui.container.Composite();
     tHBox2.setLayout(new qx.ui.layout.HBox(5));
     tHBox2.add(new qx.ui.basic.Label("Infantry: "));
     var infantryTroopStrengthLabel = new qx.ui.basic.Label("100");
     tHBox2.add(infantryTroopStrengthLabel);
     infantryTroopStrengthLabel.setTextColor("green");
     tVBox.add(tHBox2);
     // The Vehicle Troop Strength Label
     var tHBox3 = new qx.ui.container.Composite();
     tHBox3.setLayout(new qx.ui.layout.HBox(5));
     tHBox3.add(new qx.ui.basic.Label("Vehicle: "));
     var vehicleTroopStrengthLabel = new qx.ui.basic.Label("100");
     tHBox3.add(vehicleTroopStrengthLabel);
     vehicleTroopStrengthLabel.setTextColor("green");
     tVBox.add(tHBox3);
     // The Air Troop Strength Label
     var tHBox4 = new qx.ui.container.Composite();
     tHBox4.setLayout(new qx.ui.layout.HBox(5));
     tHBox4.add(new qx.ui.basic.Label("Aircraft: "));
     var airTroopStrengthLabel = new qx.ui.basic.Label("100");
     tHBox4.add(airTroopStrengthLabel);
     airTroopStrengthLabel.setTextColor("green");
     tVBox.add(tHBox4);

     // The inner Vertical Box
     var vBox = new qx.ui.container.Composite()
     vBox.setLayout(new qx.ui.layout.VBox(5));
     vBox.setThemedFont("bold");
     vBox.setThemedPadding(2);
     vBox.setThemedBackgroundColor("#eef");
     // The Victory Label
     var hBox2 = new qx.ui.container.Composite()
     hBox2.setLayout(new qx.ui.layout.HBox(5));
     hBox2.add(new qx.ui.basic.Label("Outcome: "));
     var simVictoryLabel = new qx.ui.basic.Label("Unknown");
     hBox2.add(simVictoryLabel);
     simVictoryLabel.setTextColor("green");
     vBox.add(hBox2);
     // The Battle Time Label
     var hBox1 = new qx.ui.container.Composite()
     hBox1.setLayout(new qx.ui.layout.HBox(5));
     hBox1.add(new qx.ui.basic.Label("Battle Time: "));
     var simTimeLabel = new qx.ui.basic.Label("120");
     hBox1.add(simTimeLabel);
     simTimeLabel.setTextColor("black");
     vBox.add(hBox1);

     statsPage.add(vBox);
    
    
         ////////////////// Layouts ////////////////////
     var layoutPage = new qx.ui.tabview.Page("Layouts");
     layoutPage.setLayout(new qx.ui.layout.VBox());
     tabView.add(layoutPage);
    
     var layoutsList = new qx.ui.form.List();
     layoutsList.set({
        height: 200,
        width: 180,
        selectionMode: "one"
     });
     layoutPage.add(layoutsList);
    
     // Add the two buttons for save and load
     var layHBox = new qx.ui.container.Composite();
     layHBox.setLayout(new qx.ui.layout.HBox(5));
     // Load button
     var buttonLayoutLoad = new qx.ui.form.Button("Load");
     buttonLayoutLoad.set({
        width: 80,
        appearance: "button-text-small",
        toolTipText: "Load this saved layout."
     });
     buttonLayoutLoad.addListener("click", function() {
                   /*  try {
                        var city_layouts = this.loadCityLayouts();
                        var lid = this.layoutsList.getSelection()[0].getModel();
                        if (city_layouts && typeof city_layouts[lid] != 'undefined') {
                           // Load the selected city layout
                           var saved_units = city_layouts[lid].layout;
                           this.restoreFormation(saved_units);
                        }
                     } catch (e) {
                        console.log(e);
                     }
               */   }, this);
     layHBox.add(buttonLayoutLoad);
     // Delete button
     var buttonLayoutDelete = new qx.ui.form.Button("Delete");
     buttonLayoutDelete.set({
        width: 80,
        appearance: "button-text-small",
        toolTipText: "Delete this saved layout."
     });
     buttonLayoutDelete.addListener("click", function() {
                  /*   try {
                        var layouts = this.loadLayouts();
                        var current_city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity().get_Id();
                        var own_city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity().get_Id();
                        var lid = this.layoutsList.getSelection()[0].getModel();
                        if (layouts && typeof layouts[current_city] != 'undefined' && typeof layouts[current_city][own_city] != 'undefined' && typeof layouts[current_city][own_city][lid] != 'undefined') {
                           delete layouts[current_city][own_city][lid];
                           this.saveLayouts(layouts);
                           this.updateLayoutsList();
                        }
                     } catch (e) {
                        console.log(e);
                     }
                */  }, this);
     layHBox.add(buttonLayoutDelete);
     layoutPage.add(layHBox);
    
     var layVBox = new qx.ui.container.Composite()
     layVBox.setLayout(new qx.ui.layout.VBox(5));
     layVBox.setThemedFont("bold");
     layVBox.setThemedPadding(2);
     layVBox.setThemedBackgroundColor("#eef");
     // The Label Textbox
     var layHBox2 = new qx.ui.container.Composite()
     layHBox2.setLayout(new qx.ui.layout.HBox(5));
     layHBox2.add(new qx.ui.basic.Label("Name: "));
     var layoutsLabelText = new qx.ui.form.TextField();
     layHBox2.add(layoutsLabelText);
     layVBox.add(layHBox2);
    
     var buttonLayoutSave = new qx.ui.form.Button("Save");
     buttonLayoutSave.set({
        width: 80,
        appearance: "button-text-small",
        toolTipText: "Save this layout."
     });
     buttonLayoutSave.addListener("click", function() {
                    /* try {
                        // Save the current layout for this city
                        var current_city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentCity().get_Id();
                        var own_city = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity().get_Id();
                        var layouts = this.loadLayouts();
                        this.saveFormation();
                        var lid = new Date().getTime().toString();
                        var title = this.layoutsLabelText.getValue();
                        if (!title) {
                           return;
                        }
                        title += " (TS: " + this.lastPercentage.toFixed(2).toString() + ")";
                        var city_layouts = this.loadCityLayouts();
                        if (!layouts.hasOwnProperty(current_city)) {
                           layouts[current_city] = {};
                        }
                        if (!layouts[current_city].hasOwnProperty(own_city)) {
                           layouts[current_city][own_city] = city_layouts;
                        }
                        layouts[current_city][own_city][lid] = {
                           id: lid,
                           label: title,
                           layout: this.saved_units,
                        };
                        this.saveLayouts(layouts);
                        this.updateLayoutsList();
                        this.layoutsLabelText.setValue("");
                     } catch (e) {
                        console.log(e);
                     }
                  */}, this);
     layVBox.add(buttonLayoutSave);
     layoutPage.add(layVBox);
    
    
     ////////////////// Info ////////////////////
     var infoPage = new qx.ui.tabview.Page("Info");
     infoPage.setLayout(new qx.ui.layout.VBox(5));
     tabView.add(infoPage);

     // The Help Vertical Box
     var pVBox = new qx.ui.container.Composite()
     pVBox.setLayout(new qx.ui.layout.VBox(5));
     pVBox.setThemedFont("bold");
     pVBox.setThemedPadding(2);
     pVBox.setThemedBackgroundColor("#eef");
     infoPage.add(pVBox);
     var proHelpBar = new qx.ui.basic.Label().set({
        value: "<a target='_blank' href='http://userscripts.org/scripts/discuss/147335'>Forums</a>",
        rich: true
     });
     pVBox.add(proHelpBar);
     // The Spoils
     var psVBox = new qx.ui.container.Composite()
     psVBox.setLayout(new qx.ui.layout.VBox(5));
     psVBox.setThemedFont("bold");
     psVBox.setThemedPadding(2);
     psVBox.setThemedBackgroundColor("#eef");
     infoPage.add(psVBox);
     psVBox.add(new qx.ui.basic.Label("Spoils"));
     // Tiberium
     var tiberiumSpoils = new qx.ui.basic.Atom("0", "webfrontend/ui/common/icn_res_tiberium.png");
     psVBox.add(tiberiumSpoils);
     // Crystal
     var crystalSpoils = new qx.ui.basic.Atom("0", "webfrontend/ui/common/icn_res_chrystal.png");
     psVBox.add(crystalSpoils);
     // Credits
     var creditSpoils = new qx.ui.basic.Atom("0", "webfrontend/ui/common/icn_res_dollar.png");
     psVBox.add(creditSpoils);
     // Research
     var researchSpoils = new qx.ui.basic.Atom("0", "webfrontend/ui/common/icn_res_research_mission.png");
     psVBox.add(researchSpoils);

     battleResultsBox.add(tabView);
    
     ////////////////// Shift Formation Arrows By Quor ////////////////////
	 var shiftTab = new qx.ui.tabview.Page("Shift");
     shiftTab.setLayout(new qx.ui.layout.VBox(5));
     tabView.add(shiftTab);
    
	var arrows = {};
	arrows.ShiftFormationLeft = new qx.ui.form.Button("←");
	arrows.ShiftFormationLeft.set(
	{
		width: 30,
		appearance: "button-text-small",
		toolTipText: "Shift units Left"
	});
	arrows.ShiftFormationLeft.addListener("click", function(){shiftFormation('l');}, this);
	
	arrows.ShiftFormationRight = new qx.ui.form.Button("→");
	arrows.ShiftFormationRight.set(
	{
		width: 30,
		appearance: "button-text-small",
		toolTipText: "Shift units RIGHT"
	});
	arrows.ShiftFormationRight.addListener("click", function(){shiftFormation('r');}, this);
	
	arrows.ShiftFormationUp = new qx.ui.form.Button("↑");
	arrows.ShiftFormationUp.set(
	{
		width: 30,
		appearance: "button-text-small",
		toolTipText: "Shift units UP"
	});
	arrows.ShiftFormationUp.addListener("click", function(){shiftFormation('u');}, this);
	
	arrows.ShiftFormationDown = new qx.ui.form.Button("↓");
	arrows.ShiftFormationDown.set(
	{
		width: 30,
		appearance: "button-text-small",
		toolTipText: "Shift units DOWN"
	});
	arrows.ShiftFormationDown.addListener("click", function(){shiftFormation('d');}, this);
	
	shiftTab.add(arrows.ShiftFormationUp,
	{
		top: 93,
		left: 29
	});
	shiftTab.add(arrows.ShiftFormationLeft,
	{
		top: 110,
		left: 12
	});
	shiftTab.add(arrows.ShiftFormationRight,
	{
		top: 110,
		left: 46
	});
	shiftTab.add(arrows.ShiftFormationDown,
	{
		top: 127,
		left: 29
	});
    //End of Shift Keys
    
    armyBar.add(buttonTools, {
    bottom: 42,
    right: 66
    });
    
    
}

function getCityPreArmyUnits() {
	ClientLib = unsafeWindow["ClientLib"];
	var ownCity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
	var formationManager = ownCity.get_CityArmyFormationsManager();
	return formationManager.GetFormationByTargetBaseId(formationManager.get_CurrentTargetBaseId());
}

function restoreFormation(saved_units) {
	var sUnits = saved_units;
	var units = getCityPreArmyUnits();
	var units_list = units.get_ArmyUnits().l;
	for (var idx = 0; idx < sUnits.length; idx++) {
		var saved_unit = sUnits[idx];
		var uid = saved_unit.id;
		for (var i = 0;
		(i < units_list.length); i++) {
			if (units_list[i].get_Id() === uid) {
				units_list[i].MoveBattleUnit(saved_unit.x, saved_unit.y);
				if (saved_unit.enabled === undefined) units_list[i].set_Enabled(true);
				else units_list[i].set_Enabled(saved_unit.enabled);
			}
		}
	}
	units.UpdateFormation(true); //this works and USES the API so works for both servers
}

function shiftFormation(direction) { //left right up down
	
	if (!direction) var direction = window.prompt("indicate a direction to shift units: up(u), down(d), left(l) or right(r)");
	
	if (direction == "up" || direction == "u") var v_shift = -1;
	if (direction == "down" || direction == "d") var v_shift = 1;
	if (direction == "left" || direction == "l") var h_shift = -1;
	if (direction == "right" || direction == "r") var h_shift = 1;
	
	if (!v_shift) var v_shift = 0;
	if (!h_shift) var h_shift = 0;
	
	units = getCityPreArmyUnits().get_ArmyUnits().l;
	var Army = [];
	//read army, consider use saveFormation(?)
	for (var i = 0;	(i < this.units.length); i++) {
		var unit = this.units[i];
		var armyUnit = {};
		var x = unit.get_CoordX() + h_shift;
		switch (x) {
			case 9:
			x = 0;
			break;
			case -1:
			x = 8;
			break;
		}
		var y = unit.get_CoordY() + v_shift;
		switch (y) {
			case 4:
			y = 0;
			break;
			case -1:
			y = 3;
			break;
		}
		armyUnit.x = x;
		armyUnit.y = y;
		armyUnit.id = unit.get_Id();
		armyUnit.enabled = unit.get_Enabled();
		Army.push(armyUnit);
	}
	restoreFormation(Army);
}



function waitForClientLib(){
    
		ClientLib = unsafeWindow["ClientLib"];
		qx = unsafeWindow["qx"];
	
		if ((typeof ClientLib == 'undefined') || (typeof qx == 'undefined') || (qx.core.Init.getApplication().initDone == false))
		{
			setTimeout(waitForClientLib, 1000);
			return;
		}
		initSimulateBattle();
        initReturnSetup();
        initUnlockCombat();
        initTools();
};

function startup(){
    
	setTimeout(waitForClientLib, 1000);
};

startup();