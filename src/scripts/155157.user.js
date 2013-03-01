// ==UserScript==
// @name       Tiberium Alliances Info Sticker
// @namespace  TAInfoSticker
// @version    1.7.1
// @description  Based on Maelstrom Dev Tools. Modified MCV timer, repair time label, resource labels.
// @include     http*://prodgame*.alliances.commandandconquer.com/*/index.aspx*
// @author unicode
// ==/UserScript==
(function () {
    var InfoSticker_main = function () {
        try {
            function CCTAWrapperIsInstalled() {
                return (typeof (CCTAWrapper_IsInstalled) != 'undefined' && CCTAWrapper_IsInstalled);
            }

            function createInfoSticker() {
                console.log('InfoSticker loaded');
                // define Base
                qx.Class.define("InfoSticker.Base", {
                    type: "singleton",
                    extend: qx.core.Object,
                    members: {
                        /* Desktop */
                        masterTimerInterval: 1000,
                        positionInterval: 500,
                        tibIcon: null,
                        cryIcon: null,
                        powIcon: null,
                        creditIcon: null,
                        hasStorage: false,

                        initialize: function () {
                            try {
                                this.hasStorage = 'localStorage' in window && window['localStorage'] !== null;
                            } catch (se) {}
                            try {
                                var fileManager = ClientLib.File.FileManager.GetInstance();
                                this.tibIcon = fileManager.GetPhysicalPath("ui/common/icn_res_tiberium.png");
                                this.cryIcon = fileManager.GetPhysicalPath("ui/common/icn_res_chrystal.png");
                                this.powIcon = fileManager.GetPhysicalPath("ui/common/icn_res_power.png");
                                this.creditIcon = fileManager.GetPhysicalPath("ui/common/icn_res_dollar.png");


                                this.runMainTimer();
                            } catch (e) {
                                console.log("InfoSticker.initialize: ", e);
                            }
                        },
                        runMainTimer: function () {
                            try {
                                var self = this;
                                this.calculateCostsForNextMCV();
                                window.setTimeout(function () {
                                    self.runMainTimer();
                                }, this.masterTimerInterval);
                            } catch (e) {
                                console.log("InfoSticker.runMainTimer: ", e);
                            }
                        },
                        runPositionTimer: function () {
                            try {
                                var self = this;
                                this.repositionSticker();
                                window.setTimeout(function () {
                                    self.runPositionTimer();
                                }, this.positionInterval);
                            } catch (e) {
                                console.log("InfoSticker.runPositionTimer: ", e);
                            }
                        },
                        infoSticker: null,
                        mcvPopup: null,
                        mcvTimerLabel: null,
                        mcvInfoLabel: null,

                        repairPopup: null,
                        repairTimerLabel: null,

                        resourcePane: null,
                        resourceHidden: false,
                        resourceTitleLabel: null,
                        resourceHideButton: null,
                        resourceLabel1: null,
                        resourceLabel2: null,
                        resourceLabel3: null,

                        resourceLabel1per: null,
                        resourceLabel2per: null,
                        resourceLabel3per: null,

                        productionTitleLabel: null,
                        productionLabelPower: null,
                        productionLabelCredit: null,

                        repairInfoLabel: null,

                        lastButton: null,

                        top_image: null,
                        bot_image: null,

                        toFlipH: [],

                        pinButton: null,
                        pinned: false,

                        pinTop: 130,
                        pinButtonDecoration: null,
                        pinPane: null,

                        pinIconFix: false,
                        
                        mcvHide: false,
                        repairHide: false,
                        resourceHide: false,
                        productionHide: false,

                        repositionSticker: function () {
                            var i;
                            try {
                                if (this.infoSticker) {
                                    var dele;
                                    try {
                                        if (!this.pinIconFix) {
                                            dele = this.pinButton.getContentElement().getDomElement();
                                            if (dele != null) {
                                                //console.log("dele "+dele.innerHTML);
                                                //dele.firstChild.style["background-size"] = "20px 20px";
                                                dele.firstChild.style.backgroundSize = "contain";
                                                dele.firstChild.style.overflow = "show";
                                                //console.log("dele "+dele.firstChild.innerHTML);
                                                this.pinIconFix = true;
                                            }
                                        }
                                    } catch (e1) {
                                        console.log("Error fixing pin icon size.");
                                    }

                                    try {
                                        if (this.top_image != null) {
                                            dele = this.top_image.getContentElement().getDomElement();
                                            if (dele != null) {
                                                dele.style["-moz-transform"] = "scaleY(-1)";
                                                dele.style["-o-transform"] = "scaleY(-1)";
                                                dele.style["-webkit-transform"] = "scaleY(-1)";
                                                dele.style.transform = "scaleY(-1)";
                                                dele.style.filter = "FlipV";
                                                dele.style["-ms-filter"] = "FlipV";
                                                this.top_image = null;
                                            }
                                        }
                                        for (i = this.toFlipH.length - 1; i >= 0; i--) {
                                            var e = this.toFlipH[i];
                                            dele = e.getDecoratorElement().getDomElement();
                                            if (dele != null) {
                                                dele.style["-moz-transform"] = "scaleX(-1)";
                                                dele.style["-o-transform"] = "scaleX(-1)";
                                                dele.style["-webkit-transform"] = "scaleX(-1)";
                                                dele.style.transform = "scaleX(-1)";
                                                dele.style.filter = "FlipH";
                                                dele.style["-ms-filter"] = "FlipH";
                                                this.toFlipH.splice(i, 1);
                                            }
                                        }
                                    } catch (e2) {
                                        console.log("Error flipping images.");
                                    }
                                    try {
                                        var baseCont = qx.core.Init.getApplication().getBaseNavigationBar().getChildren()[0].getChildren()[0].getChildren();
                                        for (i = 0; i < baseCont.length; i++) {
                                            var baseButton = baseCont[i];
                                            if (baseButton.getDecorator() == null) continue;
                                            if (baseButton.getDecorator().indexOf("focused") >= 0 || baseButton.getDecorator().indexOf("pressed") >= 0) {
                                                if (!this.pinned) {
                                                    var top = baseButton.getBounds().top;
                                                    var infoTop;
                                                    try {
                                                        var stickerHeight = this.infoSticker.getContentElement().getDomElement().style.height;
                                                        stickerHeight = stickerHeight.substring(0, stickerHeight.indexOf("px"));
                                                        infoTop = Math.min(130 + top, Math.max(660, window.innerHeight) - parseInt(stickerHeight, 10) - 130);
                                                    } catch (heighterror) {
                                                        infoTop = 130 + top;
                                                    }
                                                    this.infoSticker.setDomTop(infoTop);

                                                    this.pinTop = infoTop;
                                                }
                                                break;
                                            }
                                        }
                                    } catch (typeError) {
                                        //baseButton.getBounds().top sometimes doesn't exist
                                        if (!(typeError instanceof TypeError)) throw typeError;
                                    }
                                }
                            } catch (ex) {
                                console.log("InfoSticker.repositionSticker: ", ex);
                            }
                        },
                        toPin: function (e) {
                            this.pinned = !this.pinned;
                            this.pinButton.setIcon(this.pinned ? "FactionUI/icons/icn_thread_pin_active.png" : "FactionUI/icons/icn_thread_pin_inactive.png");
                            this.updatePinButtonDecoration();
                            if (this.hasStorage) {
                                if (this.pinned) {
                                    localStorage["infoSticker-pinned"] = "true";
                                    localStorage["infoSticker-top"] = this.pinTop.toString();
                                } else {
                                    localStorage["infoSticker-pinned"] = "false";
                                }
                            }
                        },
                        updatePinButtonDecoration: function () {
                            var light = "#CDD9DF";
                            var mid = "#9CA4A8";
                            var dark = "#8C9499";
                            this.pinPane.setDecorator(null);
                            this.pinButtonDecoration = new qx.ui.decoration.Beveled().set({
                                innerOpacity: 0.5
                            });
                            this.pinButtonDecoration.setInnerColor(this.pinned ? mid : light);
                            this.pinButtonDecoration.setOuterColor(this.pinned ? light : mid);
                            this.pinButtonDecoration.setBackgroundColor(this.pinned ? dark : light);
                            this.pinPane.setDecorator(this.pinButtonDecoration);
                        },
                        hideResource: function () {
                            //if(this.resourceHidden) 
                            if (this.resourcePane.isVisible()) {
                                //this.resourcePane.hide();
                                this.resourcePane.exclude();
                                this.resourceHideButton.setLabel("+");
                            } else {
                                this.resourcePane.show();
                                this.resourceHideButton.setLabel("-");
                            }
                        },
                        createSection: function (parent, titleLabel, visible, visibilityStorageName) {
							try {
								var pane = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
									padding: [5, 0, 5, 5],
									width: 124,
									decorator: new qx.ui.decoration.Background().set({
										backgroundImage: "decoration/pane_messaging_item/messaging_items_pane.png",
										backgroundRepeat: "scale",
									}),
									alignX: "right"
								});
								
								var labelStyle = {
									font: qx.bom.Font.fromString('bold').set({
										size: 12
									}),
									textColor: '#595969'
								};
								titleLabel.set(labelStyle);
								
								var hidePane = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
									width: 124,
                                    alignX: "right"
								});
								
								var hideButton = new qx.ui.form.Button("-").set({
									//decorator: new qx.ui.decoration.Single(1, "solid", "black"),
									maxWidth: 15,
									maxHeight: 10,
									//textColor: "black"
								});
                                var self = this;
								//resourceHideButton.addListener("execute", this.hideResource, this);
								hideButton.addListener("execute", function () {
									if (hidePane.isVisible()) {
										hidePane.exclude();
										hideButton.setLabel("+");
									} else {
										hidePane.show();
										hideButton.setLabel("-");
									}
									if(self.hasStorage)
										localStorage["infoSticker-"+visibilityStorageName] = !hidePane.isVisible();
								});

								var titleBar = new qx.ui.container.Composite(new qx.ui.layout.HBox(0));
								titleBar.add(hideButton);
								titleBar.add(titleLabel);
								pane.add(titleBar);
								pane.add(hidePane);
								
                                if(!visible) hidePane.exclude();
                                
								this.toFlipH.push(pane);

								parent.add(pane);
								
								return hidePane;
							} catch(e) {
								console.log("InfoSticker.createSection: ", e);
								throw e;
							}
                        },
						createHBox: function (ele1, ele2, ele3) {
							var cnt;
							cnt = new qx.ui.container.Composite();
							cnt.setLayout(new qx.ui.layout.HBox(0));
							if (ele1 != null) {
								cnt.add(ele1);
								ele1.setAlignY("middle");
							}
							if (ele2 != null) {
								cnt.add(ele2);
								ele2.setAlignY("bottom");
							}
							if (ele3 != null) {
								cnt.add(ele3);
								ele3.setAlignY("bottom");
							}

							return cnt;
						},

                        calculateCostsForNextMCV: function () {
                            try {
                                var self = this;
                                var player = ClientLib.Data.MainData.GetInstance().get_Player();
                                var cw = player.get_Faction();
                                var cj = ClientLib.Base.Tech.GetTechIdFromTechNameAndFaction(ClientLib.Base.ETechName.Research_BaseFound, cw);
                                var cr = player.get_PlayerResearch();
                                var cd = cr.GetResearchItemFomMdbId(cj);
                                if (!this.infoSticker) {
                                    this.infoSticker = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({
                                        alignX: "right"
                                    })).set({
                                        width: 124,
                                    });
                                    var app = qx.core.Init.getApplication();

                                    var top = 130;
                                    if (this.hasStorage) {
                                        var p = localStorage["infoSticker-pinned"];
                                        var t = localStorage["infoSticker-top"];
                                        if (p != null && t != null) {
                                            var tn;
                                            try {
                                                this.pinned = p == "true";
                                                if (this.pinned) {
                                                    tn = parseInt(t, 10);
                                                    top = tn;
                                                }
                                            } catch (etn) {}
                                        }
                                        this.mcvHide = localStorage["infoSticker-mcvHide"] == "true";
                                        this.repairHide = localStorage["infoSticker-repairHide"] == "true";
                                        this.resourceHide = localStorage["infoSticker-resourceHide"] == "true";
                                        this.productionHide = localStorage["infoSticker-productionHide"] == "true";
                                    }
                                    app.getDesktop().add(this.infoSticker, {
                                        right: 124,
                                        top: top
                                    });

                                    this.mcvPopup = new qx.ui.container.Composite(new qx.ui.layout.VBox().set({
                                        spacing: 3
                                    })).set({
                                        paddingLeft: 5,
                                        width: 120,
                                        decorator: new qx.ui.decoration.Background().set({
                                            backgroundImage: "webfrontend/ui/common/bgr_region_world_select_scaler.png",
                                            backgroundRepeat: "scale",
                                        })
                                    });

                                    var font = qx.bom.Font.fromString('bold').set({
                                        size: 18
                                    });
                                    var font2 = qx.bom.Font.fromString('bold').set({
                                        size: 14
                                    });
                                    var font3 = qx.bom.Font.fromString('bold').set({
                                        size: 11
                                    });
////////////////////////////----------------------------------------------------------
                                    this.pinButton = new webfrontend.ui.SoundButton().set({
                                        decorator: "button-forum-light",
                                        icon: this.pinned ? "FactionUI/icons/icn_thread_pin_active.png" : "FactionUI/icons/icn_thread_pin_inactive.png",
                                        iconPosition: "top",
                                        show: "icon",
                                        cursor: "pointer",
                                        height: 30,
                                        maxHeight: 25,
                                    });
                                    this.pinButton.addListener("execute", this.toPin, this);
									
                                    this.pinPane = new qx.ui.container.Composite(new qx.ui.layout.VBox()).set({
                                        width: 100,
                                    });
									
                                    this.updatePinButtonDecoration();

                                    this.pinPane.setDecorator(this.pinButtonDecoration);
                                    this.pinPane.add(this.pinButton);
                                    this.mcvPopup.add(this.pinPane);
                                    this.toFlipH.push(this.pinPane);
////////////////////////////----------------------------------------------------------

                                    this.mcvInfoLabel = new qx.ui.basic.Label();
                                    this.mcvTimerLabel = new qx.ui.basic.Label().set({
                                        font: font,
                                        textColor: '#282828',
                                        height: 20,
                                        width: 114,
                                        textAlign: 'center'
                                    });
                                    this.mcvTimerCreditProdLabel = new qx.ui.basic.Label().set({
                                        font: qx.bom.Font.fromString('normal').set({
                                            size: 12
                                        }),
                                        textColor: '#282828',
                                        height: 20,
                                        width: 114,
                                        textAlign: 'center',
                                        marginTop: 4,
                                        marginBottom: -4
                                    });
									var pane = this.createSection(this.mcvPopup, this.mcvInfoLabel, !this.mcvHide, "mcvHide");
                                    pane.add(this.mcvTimerLabel);
                                    pane.add(this.mcvTimerCreditProdLabel);
////////////////////////////----------------------------------------------------------

                                    this.repairInfoLabel = new qx.ui.basic.Label();
                                    this.repairInfoLabel.setValue("Repair time");
                                    this.repairTimerLabel = new qx.ui.basic.Label().set({
                                        font: font,
                                        textColor: '#282828',
                                        height: 20,
                                        width: 114,
                                        textAlign: 'center'
                                    });
									var pane2 = this.createSection(this.mcvPopup, this.repairInfoLabel, !this.repairHide, "repairHide");
                                    pane2.add(this.repairTimerLabel);
////////////////////////////----------------------------------------------------------

                                    this.resourceTitleLabel = new qx.ui.basic.Label();
                                    this.resourceTitleLabel.setValue("Resources");
                                    var resStyle = {
                                        font: font2,
                                        textColor: '#282828',
                                        height: 20,
                                        width: 55,
                                        textAlign: 'right'
                                    };

                                    this.resourceLabel1 = new qx.ui.basic.Label().set(resStyle);
                                    this.resourceLabel2 = new qx.ui.basic.Label().set(resStyle);
                                    this.resourceLabel3 = new qx.ui.basic.Label().set(resStyle);

                                    var perStyle = {
                                        font: font3,
                                        textColor: '#282828',
                                        height: 18,
                                        width: 35,
                                        textAlign: 'right'
                                    };
                                    this.resourceLabel1per = new qx.ui.basic.Label().set(perStyle);
                                    this.resourceLabel2per = new qx.ui.basic.Label().set(perStyle);
                                    this.resourceLabel3per = new qx.ui.basic.Label().set(perStyle);

                                    function createImage(icon) {
                                        var image = new qx.ui.basic.Image(icon);
                                        image.setScale(true);
                                        image.setWidth(20);
                                        image.setHeight(20);
                                        return image;
                                    }

                                    var pane3 = this.createSection(this.mcvPopup, this.resourceTitleLabel, !this.resourceHide, "resourceHide");

                                    pane3.add(this.createHBox(createImage(this.tibIcon), this.resourceLabel1, this.resourceLabel1per));
                                    pane3.add(this.createHBox(createImage(this.cryIcon), this.resourceLabel2, this.resourceLabel2per));
                                    pane3.add(this.createHBox(createImage(this.powIcon), this.resourceLabel3, this.resourceLabel3per));
////////////////////////////----------------------------------------------------------

                                    this.productionTitleLabel = new qx.ui.basic.Label();
                                    this.productionTitleLabel.setValue("Productions");

                                    var productionStyle = {
                                        font: qx.bom.Font.fromString('bold').set({
                                            size: 13
                                        }),
                                        textColor: '#282828',
                                        height: 20,
                                        width: 70,
                                        textAlign: 'right',
                                        marginTop: 2,
                                        marginBottom: -2
                                    };
                                    this.productionLabelPower = new qx.ui.basic.Label().set(productionStyle);
                                    this.productionLabelCredit = new qx.ui.basic.Label().set(productionStyle);

                                    var pane4 = this.createSection(this.mcvPopup, this.productionTitleLabel, !this.productionHide, "productionHide");
                                    pane4.add(this.createHBox(createImage(this.powIcon), this.productionLabelPower));
                                    pane4.add(this.createHBox(createImage(this.creditIcon), this.productionLabelCredit));
////////////////////////////----------------------------------------------------------

                                    this.top_image = new qx.ui.basic.Image("webfrontend/ui/common/bgr_region_world_select_end.png");
                                    this.infoSticker.add(this.top_image);

                                    this.infoSticker.add(this.mcvPopup);

                                    this.bot_image = new qx.ui.basic.Image("webfrontend/ui/common/bgr_region_world_select_end.png");
                                    this.infoSticker.add(this.bot_image);

                                    this.runPositionTimer();
                                }
                                if (cd == null) {
                                    if (this.mcvPopup) {
                                        this.mcvInfoLabel.setValue("MCV ($???)");
                                        this.mcvTimerLabel.setValue("Loading");
                                    }
                                } else {
                                    var nextLevelInfo = cd.get_NextLevelInfo_Obj();
                                    var resourcesNeeded = [];
                                    for (var i in nextLevelInfo.rr) {
                                        if (nextLevelInfo.rr[i].t > 0) {
                                            resourcesNeeded[nextLevelInfo.rr[i].t] = nextLevelInfo.rr[i].c;
                                        }
                                    }
                                    //var researchNeeded = resourcesNeeded[ClientLib.Base.EResourceType.ResearchPoints];
                                    //var currentResearchPoints = player.get_ResearchPoints();
                                    var creditsNeeded = resourcesNeeded[ClientLib.Base.EResourceType.Gold];
                                    var creditsResourceData = player.get_Credits();
                                    var creditGrowthPerHour = (creditsResourceData.Delta + creditsResourceData.ExtraBonusDelta) * ClientLib.Data.MainData.GetInstance().get_Time().get_StepsPerHour();
                                    var creditTimeLeftInHours = (creditsNeeded - player.GetCreditsCount()) / creditGrowthPerHour;

                                    this.mcvInfoLabel.setValue("MCV ($ " + this.formatNumbersCompact(creditsNeeded) + ")");
                                    this.mcvTimerCreditProdLabel.setValue("at " + this.formatNumbersCompact(creditGrowthPerHour) + "/h");
                                    if (creditTimeLeftInHours <= 0) {
                                        this.mcvTimerLabel.setValue("Ready");
                                    } else if (creditGrowthPerHour == 0) {
                                        this.mcvTimerLabel.setValue("Never");
                                    } else {
                                        this.mcvTimerLabel.setValue(this.FormatTimespan(creditTimeLeftInHours * 60 * 60));
                                    }
                                }

                                var ncity = ClientLib.Data.MainData.GetInstance().get_Cities().get_CurrentOwnCity();
                                if (ncity == null) {
                                    if (this.mcvPopup) {
                                        this.repairTimerLabel.setValue("Select a base");

                                        this.resourceLabel1.setValue("N/A");
                                        this.resourceLabel2.setValue("N/A");
                                        this.resourceLabel3.setValue("N/A");
                                    }
                                } else {

                                    var rt = Math.min(ncity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeInf),
                                    ncity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeVeh),
                                    ncity.GetResourceCount(ClientLib.Base.EResourceType.RepairChargeAir));
                                    if (ncity.get_CityUnitsData().get_UnitLimitOffense() == 0) {
                                        this.repairTimerLabel.setValue("No army");
                                    } else {
                                        this.repairTimerLabel.setValue(this.FormatTimespan(rt));
                                    }

                                    var tib = ncity.GetResourceCount(ClientLib.Base.EResourceType.Tiberium);
                                    var tibMax = ncity.GetResourceMaxStorage(ClientLib.Base.EResourceType.Tiberium);
                                    var tibRatio = tib / tibMax;
                                    this.resourceLabel1.setTextColor(this.formatNumberColor(tib, tibMax));
                                    this.resourceLabel1.setValue(this.formatNumbersCompact(tib));
                                    this.resourceLabel1per.setValue(this.formatPercent(tibRatio));

                                    var cry = ncity.GetResourceCount(ClientLib.Base.EResourceType.Crystal);
                                    var cryMax = ncity.GetResourceMaxStorage(ClientLib.Base.EResourceType.Crystal);
                                    var cryRatio = cry / cryMax;
                                    this.resourceLabel2.setTextColor(this.formatNumberColor(cry, cryMax));
                                    this.resourceLabel2.setValue(this.formatNumbersCompact(cry));
                                    this.resourceLabel2per.setValue(this.formatPercent(cryRatio));

                                    var power = ncity.GetResourceCount(ClientLib.Base.EResourceType.Power);
                                    var powerMax = ncity.GetResourceMaxStorage(ClientLib.Base.EResourceType.Power);
                                    var powerRatio = power / powerMax;
                                    this.resourceLabel3.setTextColor(this.formatNumberColor(power, powerMax));
                                    this.resourceLabel3.setValue(this.formatNumbersCompact(power));
                                    this.resourceLabel3per.setValue(this.formatPercent(powerRatio));

                                    var powerCont = ncity.GetResourceGrowPerHour(ClientLib.Base.EResourceType.Power, false, false);
                                    var powerBonus = ncity.GetResourceBonusGrowPerHour(ClientLib.Base.EResourceType.Power);
                                    var alliance = ClientLib.Data.MainData.GetInstance().get_Alliance();
                                    var powerAlly = alliance.GetPOIBonusFromResourceType(ClientLib.Base.EResourceType.Power);
                                    var powerProd = powerCont + powerBonus + powerAlly;

                                    var creditCont = ClientLib.Base.Resource.GetResourceGrowPerHour(ncity.get_CityCreditsProduction(), false);
                                    var creditBonus = ClientLib.Base.Resource.GetResourceBonusGrowPerHour(ncity.get_CityCreditsProduction(), false);
                                    var creditProd = creditCont + creditBonus;

                                    this.productionLabelPower.setValue(this.formatNumbersCompact(powerProd) + "/h");
                                    this.productionLabelCredit.setValue(this.formatNumbersCompact(creditProd) + "/h");
                                }
                            } catch (e) {
                                console.log("calculateCostsForNextMCV", e);
                            }
                        },
                        formatPercent: function (value) {
                            return value > 999 / 100 ? ">999%" : this.formatNumbersCompact(value * 100, 0) + "%";
                            //return this.formatNumbersCompact(value*100, 0) + "%";
                        },
                        formatNumberColor: function (value, max) {
                            var ratio = value / max;

                            var color;
                            var black = [40, 180, 40];
                            var yellow = [181, 181, 0];
                            var red = [187, 43, 43];

                            if (ratio < 0.5) color = black;
                            else if (ratio < 0.75) color = this.interpolateColor(black, yellow, (ratio - 0.5) / 0.25);
                            else if (ratio < 1) color = this.interpolateColor(yellow, red, (ratio - 0.75) / 0.25);
                            else color = red;

                            //console.log(qx.util.ColorUtil.rgbToHexString(color));
                            return qx.util.ColorUtil.rgbToHexString(color);
                        },
                        interpolateColor: function (color1, color2, s) {
                            //console.log("interp "+s+ " " + color1[1]+" " +color2[1]+" " +(color1[1]+s*(color2[1]-color1[1])));
                            return [Math.floor(color1[0] + s * (color2[0] - color1[0])),
                            Math.floor(color1[1] + s * (color2[1] - color1[1])),
                            Math.floor(color1[2] + s * (color2[2] - color1[2]))];
                        },
                        formatNumbersCompact: function (value, decimals) {
                            if (decimals == undefined) decimals = 2;
                            var valueStr;
                            var unit = "";
                            if (value < 1000) valueStr = value.toString();
                            else if (value < 1000 * 1000) {
                                valueStr = (value / 1000).toString();
                                unit = "k";
                            } else if (value < 1000 * 1000 * 1000) {
                                valueStr = (value / 1000000).toString();
                                unit = "M";
                            } else {
                                valueStr = (value / 1000000000).toString();
                                unit = "G";
                            }
                            if (valueStr.indexOf(".") >= 0) {
                                var whole = valueStr.substring(0, valueStr.indexOf("."));
                                if (decimals === 0) {
                                    valueStr = whole;
                                } else {
                                    var fraction = valueStr.substring(valueStr.indexOf(".") + 1);
                                    if (fraction.length > decimals) fraction = fraction.substring(0, decimals);
                                    valueStr = whole + "." + fraction;
                                }
                            }

                            valueStr = valueStr + unit;
                            return valueStr;
                        },
                        FormatTimespan: function (value) {
                            var i;
                            var t = ClientLib.Vis.VisMain.FormatTimespan(value);
                            var colonCount = 0;
                            for (i = 0; i < t.length; i++) {
                                if (t.charAt(i) == ':') colonCount++;
                            }
                            var r = "";
                            for (i = 0; i < t.length; i++) {
                                if (t.charAt(i) == ':') {
                                    if (colonCount > 2) {
                                        r += "d ";
                                    } else {
                                        r += t.charAt(i);
                                    }
                                    colonCount--;
                                } else {
                                    r += t.charAt(i);
                                }
                            }
                            return r;
                        }
                    }
                });
            }
        } catch (e) {
            console.log("createInfoSticker: ", e);
        }

        function InfoSticker_checkIfLoaded() {
            try {
                if (typeof qx != 'undefined' && qx.core.Init.getApplication() && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION) && qx.core.Init.getApplication().getUIItem(ClientLib.Data.Missions.PATH.BAR_NAVIGATION).isVisible()) {
                    createInfoSticker();
                    window.InfoSticker.Base.getInstance().initialize();
                } else {
                    window.setTimeout(InfoSticker_checkIfLoaded, 1000);
                }
            } catch (e) {
                console.log("InfoSticker_checkIfLoaded: ", e);
            }
        }
        if (/commandandconquer\.com/i.test(document.domain)) {
            window.setTimeout(InfoSticker_checkIfLoaded, 1000);
        }
    }
    try {
        var InfoStickerScript = document.createElement("script");
        InfoStickerScript.innerHTML = "(" + InfoSticker_main.toString() + ")();";
        InfoStickerScript.type = "text/javascript";
        if (/commandandconquer\.com/i.test(document.domain)) {
            document.getElementsByTagName("head")[0].appendChild(InfoStickerScript);
        }
    } catch (e) {
        console.log("InfoSticker: init error: ", e);
    }
})();