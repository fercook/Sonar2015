define("shared/ad/models/ad", ["backbone/nyt"], function (e) {
    "use strict";
    var t = e.Model.extend({});
    return t
}), define("shared/ad/collections/ads", ["backbone/nyt", "underscore/nyt", "foundation/collections/base-collection", "foundation/hosts", "shared/ad/models/ad"], function (e, t, i, n, s) {
    "use strict";
    var a = i.extend({
        deliveryProofParams: ["adxforce", "debug"],
        adForceLookup: {
            leaderboard: "728x90testnyt5",
            billboard: "970x90horiztest",
            pushdown: "testnyt5pushdown",
            halfpage: "mediamindhalfexptest",
            xxl: "nyt5xxltestpickletag",
            bigad: "middlerighttest"
        },
        initialize: function (e, i) {
            return i ? (this.options = i, t.isUndefined(this.pageManager.getMeta("adxPage")) ? this.host = this.pageManager.getUrlParam("adx_campaign") || i.adx_campaign || "www.nytimes.com" : (this.host = "", this.options.page = this.pageManager.getMeta("adxPage")), this.interstitial = i.interstitial ? 1 : 0, void this.setPageParameter()) : !1
        },
        setPageParameter: function () {
            var e;
            this.options.page || (e = location.pathname, e = e.replace(/\d{4}/, "yr").replace(/\d{2}/, "mo").replace(/\d{2}/, "day"), this.options.page = this.host + e)
        },
        model: s,
        url: n.adx + "/adx/bin/adxrun.html",
        sync: function (i, n, s) {
            var a = this,
                o = ["nyt5"];
            return s.dataType = "jsonp", s.jsonp = "jsonp", s.data = {
                page: a.options.page,
                positions: a.options.positions.join(","),
                autoconfirm: a.options.autoconfirm || 0,
                v: 3,
                cpp: 1,
                attributes: "nyt5",
                interstitials: this.interstitial
            }, this.options.cpp === !1 && (delete s.data.interstitials, delete s.data.cpp), s.data = a.assignDeliveryProofParams(s.data), "undefined" != typeof this.pageManager.getUrlParam("hp") && o.push("hp"), "undefined" != typeof this.pageManager.getUrlParam("src") && o.push("src-" + this.pageManager.getUrlParam("src")), "undefined" != typeof a.options.keywords && (o = t.union(o, a.chainKeywords(a.options.keywords))), s.data.keywords = t.filter(o, function (e) {
                return !("undefined" == typeof e || "" === e)
            }).join(","), e.sync(i, n, s)
        },
        assignDeliveryProofParams: function (e) {
            var i, n, s = {};
            for (i = this.deliveryProofParams.length - 1; i >= 0; i -= 1) n = this.pageManager.getUrlParam(this.deliveryProofParams[i]), "undefined" != typeof n && (s[this.deliveryProofParams[i]] = n || "1");
            return t.extend(e, s)
        },
        chainKeywords: function (e) {
            var t, i, n = e.length,
                s = [],
                a = this;
            for (t = 0; n > t; t += 1) i = a.adForceLookup[e[t]], s.push(i || e[t]);
            return "1" === this.pageManager.getUrlParam("rico") && s.push(this.pageManager.getUrlParam("keywords")), s
        },
        parse: function (e) {
            var i = e.ads;
            return i = t.map(i, function (e, t) {
                var i = e.isInlineSafe;
                return e.name = t, e.isInlineSafe = "Y" === i || "true" === i, e
            }), "undefined" != typeof this.pageManager.getUrlParam("debug") && (window.adx_debug_output = e, console.log("adx debug page: ", this.options.page), console.log("adx debug positions: ", this.options.positions.join(",")), console.log("adx debug output: ", e), console.log("adx debug keywords: ", this.chainKeywords(this.options.keywords).join(","))), i
        },
        getConfirmPixel: function () {
            return this.confirmPixel ? this.confirmPixel.creative : void 0
        }
    });
    return a
}), define("shared/ad/templates", ["underscore/nyt"], function (_) {
    var templates = {};
    return templates.iFrameStyleSheet = function (obj) {
        {
            var __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<style type="text/css">\nbody {\nmargin: 0;\noverflow: hidden;\n}a img {\nborder: none;\n}\n</style>';
        return __p
    }, templates.interstitialModal = function (obj) {
        {
            var __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<div id="Interstitial" class="ad interstitial-ad"></div><p class="user-action dismiss-button">Continue &raquo;</p>';
        return __p
    }, templates.ribbonInterstitial = function (obj) {
        {
            var __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<div class="ribbon-interstitial-ad-overlay">\n<h4 class="ad-heading"> Advertisement </h4>\n<div id="RibbonInterstitial" class="ad ribbon-interstitial-ad"> </div>\n</div>';
        return __p
    }, templates
}), define("shared/modal/templates", ["underscore/nyt"], function (_) {
    var templates = {};
    return templates.modal = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<div class="overlay"></div>\n<div class="modal ' + (null == (__t = id) ? "" : __t) + " " + (null == (__t = addlClasses) ? "" : __t) + '" style="' + (null == (__t = modalStyles) ? "" : __t) + '" role="dialog" aria-labelledby="' + (null == (__t = id) ? "" : __t) + '-modal-heading" tabindex="-1">\n<div class="modal-header">\n<h3 class="modal-heading" id="' + (null == (__t = id) ? "" : __t) + '-modal-heading">' + (null == (__t = modalTitle) ? "" : __t) + "</h3>\n" + (null == (__t = headerContent) ? "" : __t) + '\n</div>\n<div class="modal-content">\n' + (null == (__t = modalContent) ? "" : __t) + '\n</div>\n<div class="modal-footer">\n' + (null == (__t = modalFooter) ? "" : __t) + '\n</div>\n<button type="button" class="modal-close ' + (null == (__t = closeClass) ? "" : __t) + '" aria-disabled="false"><i class="icon"></i><span class="visually-hidden">Close this modal window</span></button>\n<div class="modal-pointer ' + (null == (__t = "modal-pointer-" + tailDirection) ? "" : __t) + '"><div class="modal-pointer-conceal"></div></div>\n</div>';
        return __p
    }, templates
}), define("shared/modal/views/modal", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "shared/modal/templates"], function (e, t, i, n) {
    "use strict";
    var s = i.registerView("modal").extend({
        template: n.modal,
        className: "modal-container",
        events: {
            "click .modal-close, .modal-pointer, .dismiss-button": "close",
            "mouseenter .modal": "handleMouseOutClose"
        },
        defaultSettings: {
            id: "default-modal",
            modalTitle: "",
            headerContent: "",
            modalContent: "",
            modalFooter: "",
            addlClasses: "",
            binding: "",
            disableBindings: !1,
            tailDirection: "down",
            tailTopOffset: 0,
            tailLeftOffset: 0,
            fixedOverride: !1,
            hasOverlay: !1,
            hasCloseButton: !1,
            canOpenOnHover: !1,
            closeOnMouseOut: !1,
            mouseOutDelay: 0,
            mouseEnterDelay: 0,
            closeOnClick: !0,
            autoPosition: !1,
            positionTailSide: !1,
            toggleSpeed: 300,
            focusOnShow: !0
        },
        initialize: function (e) {
            t.bindAll(this, "close", "open", "mouseEnterOpen", "mouseOutClose", "handleClickClose", "removeFromPage"), this.settings = t.extend({}, this.defaultSettings, e), this.settings.modalStyles = "width: " + e.width + ";", this.render()
        },
        render: function () {
            var e = this.settings.id + "-container";
            return this.settings.closeClass = this.settings.hasCloseButton ? "" : "hidden", this.$el.hide().addClass(e).html(this.template(this.settings)), this.$modal = this.$el.find(".modal"), this.$el.find(".overlay").toggle(this.settings.hasOverlay), this
        },
        addToPage: function (e, t) {
            var i = "string" == typeof e ? this.$body.find(e) : this.$body;
            return t = "function" == typeof i[t] ? t : "append", i[t](this.$el), "" === this.settings.binding || this.settings.disableBindings || (this.$body.on("click", this.settings.binding, this.open), this.settings.canOpenOnHover && (this.$body.on("mouseenter", this.settings.binding, this.mouseEnterOpen), this.$body.on("mouseleave", this.settings.binding, this.mouseOutClose))), this
        },
        removeFromPage: function () {
            return this.close(), this.$el.remove(), "" === this.settings.binding || this.settings.disableBindings || (this.$body.off("click", this.settings.binding, this.open), this.settings.canOpenOnHover && (this.$body.off("mouseenter", this.settings.binding, this.mouseEnterOpen), this.$body.off("mouseleave", this.settings.binding, this.mouseOutClose))), this.remove()
        },
        updateTemplate: function (e) {
            return this.$modal.find(".modal-content").html(e), this.positionDialog(!1), this
        },
        open: function (t) {
            var i = this;
            return t ? (t.returnValue = !1, t.preventDefault(), this.$target = e(t.currentTarget)) : this.$target = e(this.settings.binding).eq(0), this.$el.fadeIn(this.settings.toggleSpeed, function () {
                i.broadcast("nyt:modal-show"), i.broadcast("nyt:modal-show-" + i.settings.id)
            }), this.settings.autoPosition ? this.autoPosition() : this.positionDialog(!0), (this.settings.openCallback || e.noop).call(this), this.subscribe("nyt:page-resize", this.positionDialog), this.subscribeOnce("nyt:page-key-esc", this.close), this.$body.on("click", this.handleClickClose), this.pageManager.isMobile() && this.$body.css("cursor", "pointer"), this.settings.focusOnShow && this.$modal.focus(), this
        },
        mouseEnterOpen: function (e) {
            window.clearTimeout(this.mouseLeaveTimeout), this.mouseEnterTimeout = t.delay(this.open, this.settings.mouseEnterDelay, e)
        },
        close: function (t) {
            var i = this;
            return t && t.currentTarget && this.settings.disableBindings && e(t.currentTarget).hasClass("modal-pointer") ? this : (this.$el.fadeOut(this.settings.toggleSpeed, function () {
                (i.settings.closeCallback || e.noop).call(i), i.broadcast("nyt:modal-hide"), i.broadcast("nyt:modal-hide-" + i.settings.id)
            }), this.stopSubscribing("nyt:page-resize", this.positionDialog), this.$body.off("click", this.handleClickClose), window.clearTimeout(this.mouseEnterTimeout), this.pageManager.isMobile() && this.$body.css("cursor", ""), this)
        },
        mouseOutClose: function (t) {
            var i = e(t.relatedTarget);
            i.is(this.$.target) || this.$modal.has(i).length > 0 || (window.clearTimeout(this.mouseEnterTimeout), this.$modal.is(":visible") && (this.mouseLeaveTimeout = window.setTimeout(this.close, this.settings.mouseOutDelay)))
        },
        handleMouseOutClose: function () {
            this.settings.closeOnMouseOut && this.$modal.on("mouseleave", this.close)
        },
        handleClickClose: function (e) {
            this.settings.closeOnClick && 0 === this.$modal.has(e.target).length && this.$modal[0] !== e.target && this.close()
        },
        positionDialog: function (t) {
            var i, n, s, a, o, r = this.pageManager.getViewport(),
                l = this.$target,
                d = this.$modal,
                c = "absolute",
                h = d.outerHeight(),
                u = d.outerWidth(),
                m = {
                    marginLeft: "0",
                    marginTop: "0",
                    top: "",
                    left: ""
                };
            switch (l && l.length > 0 && (a = l.outerHeight(), o = l.outerWidth(), n = l.offset().top + this.settings.tailTopOffset, s = l.offset().left + this.settings.tailLeftOffset), this.settings.tailDirection) {
            case "up":
                m.top = n + a + 14, m.left = s + Math.floor(.5 * o) - Math.floor(.5 * u) - 9;
                break;
            case "up-right":
                m.top = n + a + 14, m.left = s + Math.floor(.5 * o) - (u - 25);
                break;
            case "up-left":
                m.top = n + a + 14, m.left = s + Math.floor(.5 * o) - 25;
                break;
            case "down":
                m.top = n - h - 15, m.left = s + Math.floor(.5 * o) - Math.floor(.5 * u) - 8;
                break;
            case "down-right":
                m.top = n - h - 15, m.left = s + Math.floor(.5 * o) - (u - 25);
                break;
            case "down-left":
                m.top = n - h - 15, m.left = s + Math.floor(.5 * o) - 25;
                break;
            case "left":
                m.top = n + Math.floor(.5 * a) - Math.floor(.5 * h) + 5, m.left = this.pageManager.isMobile() && this.$html.hasClass("navigation-active") ? s + o : s + o + 15;
                break;
            case "left-bottom":
                m.top = n + Math.floor(.5 * a) - (h - 25), m.left = s + o + 15;
                break;
            case "left-top":
                m.top = n + Math.floor(.5 * a) - 25, m.left = s + o + 15;
                break;
            case "right":
                m.top = n + Math.floor(.5 * a) - Math.floor(.5 * h) + 5, m.left = s - u - 16;
                break;
            case "right-bottom":
                m.top = n + Math.floor(.5 * a) - (h - 25), m.left = s - u - 16;
                break;
            case "right-top":
                m.top = n + Math.floor(.5 * a) - 25, m.left = s - u - 16;
                break;
            case "centered":
                i = r.height, m.top = h > i ? r.top + 5 : Math.floor(.5 * (i - h)) + r.top, m.left = Math.floor(.5 * r.width - .5 * u);
                break;
            case "fixed":
            default:
                c = "fixed", u = this.settings.width || d.width(), h = this.settings.height || d.height(), m.top = "50%", m.left = "50%", m.marginLeft = -Math.floor(.5 * u) + this.settings.tailLeftOffset + "px", m.marginTop = -Math.floor(.5 * h) + this.settings.tailTopOffset + "px"
            }
            return l && "fixed" === l.css("position") || this.settings.fixedOverride ? (c = "fixed", m.top -= r.top, this.$el.css("position", "fixed")) : this.$el.css("position", ""), m.top += e.isNumeric(m.top) ? "px" : "", m.left += e.isNumeric(m.left) ? "px" : "", d.css("position", c), t === !0 ? d.css(m) : d.stop().animate(m, "fast"), this
        },
        autoPosition: function () {
            var e, t, i, n = this.pageManager.getViewport(),
                s = this.$modal.outerHeight(),
                a = this.$modal.outerWidth();
            return this.settings.positionTailSide && (i = this.$target.offset().left > n.width / 2, this.settings.tailDirection = i ? "right" : "left"), this.positionDialog(!0), e = this.$target.offset(), this.settings.positionTailSide ? (t = this.settings.tailDirection, e.top - n.top - .5 * s < 0 ? t += "-top" : e.top - n.top + .5 * s > n.height && s - 40 < e.top - n.top && (t += "-bottom")) : (t = e.top - s < 0 ? "up" : "down", e.left + a > n.width ? t += "-right" : e.left < 0 && (t += "-left")), this.$modal.find(".modal-pointer").attr("class", "modal-pointer modal-pointer-" + t), this.settings.tailDirection = t, this.positionDialog(!0), this
        }
    });
    return s
}), define("shared/ad/views/ads", ["underscore/nyt", "jquery/nyt", "foundation/views/base-view", "foundation/views/ad-view-manager", "shared/ad/collections/ads", "shared/ad/templates", "shared/modal/views/modal"], function (e, t, i, n, s, a, o) {
    "use strict";
    var r = i.registerView("ads").extend({
        el: ".ad",
        template: a,
        pushdownWidth: "970",
        billboardHeight: "90",
        navBreakPoint: 10040,
        positions: null,
        blocking: !1,
        adShown: {},
        initialize: function (t) {
            e.bindAll(this, "completeInterstitial", "renderAd"), this.options = t || this.options || {}, this.positions = [], this.preInitialize(), this.local(this, "nyt:ads-pre-initialize"), this.detectTragedy(), this.setAdParametersOnOptions(), this.scope = this.options.scope || this.scope, this.confirm = !0, this.ads = new s([], this.options), this.subscribe(this.ads, "sync", this.receiveAds), this.secondaryIframeClass = "frame-for-" + this.scope, this.listenTo(this.pageManager, "nyt:page-breakpoint", this.responsive), this.postInitialize(), this.local(this, "nyt:ads-post-initialize"), this.subscribe("nyt:ads-new-placement", this.handleRemoteAdRequest), this.subscribe("nyt:ads-fire-ribbon-interstitial", this.fireRibbonInterstitial), this.subscribe("nyt:slideshow-ad", this.fireSlideShowAd), this.addAmazonKeywords ? this.getAmazonAds() : this.requestAds()
        },
        getAmazonAds: function () {
            window.amznads = {
                updateAds: function (t) {
                    window.amazonAdData = t.ads, window.amazonAdSlots = e.keys(window.amazonAdData)
                },
                renderAd: function (e, t) {
                    var i, n;
                    window.amazonAdData && window.amazonAdData[t] ? (e.write(window.amazonAdData[t]), e.close()) : (i = {
                        c: "dtb",
                        src: "3030",
                        kvmismatch: 1,
                        pubReturnedKey: t,
                        aaxReturnedKeys: window.amazonAdSlots,
                        cb: Math.round(1e7 * Math.random()),
                        u: window.encodeURIComponent(window.location.host + window.location.pathname),
                        ua: encodeURIComponent(window.navigator.userAgent)
                    }, n = window.encodeURIComponent(JSON.stringify(i)), e.write('<img src="//aax.amazon-adsystem.com/x/px/p/0/' + n + '"/>'), e.close())
                }
            }, this.getAmazonKeywordsAndRequestAds()
        },
        getAmazonKeywordsAndRequestAds: function () {
            var e = this,
                i = "3030",
                n = encodeURIComponent(document.location);
            try {
                n = encodeURIComponent("" + window.top.location)
            } catch (s) {}
            t.ajax({
                url: "//aax.amazon-adsystem.com/e/dtb/bid?src=" + i + "&u=" + n + "&cb=" + Math.round(1e7 * Math.random()),
                dataType: "script"
            }).done(function () {
                e.addAmazonKeywords()
            }).always(function () {
                e.requestAds()
            })
        },
        preInitialize: t.noop,
        postInitialize: t.noop,
        responsive: t.noop,
        setHtmlClasses: t.noop,
        requestAds: function () {
            this.options.response ? (this.ads.reset(this.ads.parse(this.options.response)), this.ads.trigger("sync")) : this.ads.fetch()
        },
        receiveAds: function () {
            this.hasInterstitial() || this.checkAds()
        },
        resizeTopAd: e.debounce(function () {
            var e, i = this.ads.findWhere({
                name: "TopAd"
            });
            i && (e = i.get("height"), e && 90 > e && t("#TopAd").css("min-height", parseInt(e, 10)))
        }, 1e3),
        checkAds: function () {
            var i, n, s, a, o, r = this;
            for (this.removeAds(), i = this.getReturnedAdNames(this.pageManager.isDomReady()), this.pageManager.isDomReady() || this.subscribe("nyt:page-ready", function () {
                r.getReturnedAdNames(!0)
            }), i && i.length > 0 && (this.pageManager.getMeta("ads_adNames") || this.pageManager.setMeta("ads_adNames", this.returnAdNames())), e.indexOf(i, "TopAd") < 0 ? (o = t("#TopAd"), 0 === o.length && o.addClass("hidden")) : r.resizeTopAd(), a = this.getPositions(), n = 0, s = a.length; s > n; n += 1) t("#" + a[n]).toggleClass("hidden", r.isAdUnavailable(i, a[n]));
            e.indexOf(this.options.positions, "Middle1C") >= 0 && !this.ads.findWhere({
                name: "Middle1C"
            }) && t("#TopNavAd, .search-flyout-panel .ad").addClass("hidden"), e.defer(function () {
                r.broadcast("nyt:ads-rendered", r)
            }), r.setHtmlClasses(), e.delay(function () {
                r.loadGoogleAdScript()
            }, 1200)
        },
        loadGoogleAdScript: function () {
            var e, i, n;
            0 === t("#SponLink, #SponLinkA, #HPSponLink, #TopAd1, #MiddleRightN").length || this.pageManager.getMeta("googleAdScriptInjected") || (e = "script", i = document.createElement(e), n = document.getElementsByTagName(e)[0], i.src = "http://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js", n.parentNode.insertBefore(i, n), this.pageManager.setMeta("googleAdScriptInjected", "true"))
        },
        renderAd: function (e) {
            e.page = e.page || this.ads.options.page, e.frameStyle = e.frameStyle || this.template.iFrameStyleSheet(), e.secondaryIframeClass = e.secondaryIframeClass || this.secondaryIframeClass, n.render(e)
        },
        renderAdByPositionName: function (i, n) {
            var s = t("#" + i);
            return n || (n = this.ads.where({
                name: i
            })[0]), s.length && n || "ADX_CLIENTSIDE" === i ? (this.isCreativeBlank(n) || s.removeClass("hidden"), e.defer(this.renderAd, {
                model: n,
                el: s
            }), !0) : !1
        },
        handleRemoteAdRequest: function (e) {
            this.ads.length > 0 && this.renderAdByPositionName(e)
        },
        getPositions: function () {
            return this.options.positions
        },
        detectTragedy: function () {
            var e = this.pageManager.getMeta("ad_sensitivity");
            e && (this.options.page = "www.nytimes.com/" + e)
        },
        returnAdNames: function () {
            return this.ads.pluck("name")
        },
        cleanHtmlClasses: function () {
            this.htmlClasses && this.$html.removeClass(e.values(this.htmlClasses).join(" "))
        },
        isDirectlySold: function (e) {
            var t = this.ads.where({
                name: e
            })[0].attributes.isDirectlySold;
            return "true" === t
        },
        returnAdParametersObject: function () {
            var t = this.pageManager.getUrlParam("ad-keywords"),
                i = this.pageManager.getUrlParam("ad-positions");
            return {
                keywords: e.isString(t) ? [t] : t,
                positions: e.isString(i) ? [i] : i
            }
        },
        setAdParametersOnOptions: function () {
            var t = this.returnAdParametersObject();
            this.options.keywords = e.union(this.options.keywords, t.keywords), t.positions && (this.options.positions = t.positions)
        },
        isPlaceholderInViewport: function (e) {
            var i;
            return !e || e && 0 === e.length ? !1 : (i = e.get(0).getBoundingClientRect(), i.top + e.height() >= 0 && i.left + e.width() >= 0 && i.bottom - e.height() <= t(window).height() && i.right - e.width() <= t(window).width())
        },
        isCreativeBlank: function (e) {
            var t = e.get("classification");
            return "blank" === t || "blank-but-count-imps" === t
        },
        handleApplicationAd: function (e) {
            var t, i;
            return t = e.get("name"), i = this.renderAdByPositionName(t, e)
        },
        getReturnedAdNames: function (e) {
            var t = this,
                i = [];
            return e = "undefined" != typeof e ? e : !1, this.ads.length > 0 && this.ads.each(function (n) {
                e ? t.handleApplicationAd(n) ? i.push(n.get("name")) : t.confirm = !1 : i.push(n.get("name"))
            }), i
        },
        isAdUnavailable: function (t, i) {
            return e.indexOf(t, i) < 0 || this.isCreativeBlank(this.ads.where({
                name: i
            })[0])
        },
        removeAds: function () {
            t("." + this.secondaryIframeClass).remove()
        },
        isHalfPage: function (e, t) {
            return 300 === parseInt(e, 10) && 600 === parseInt(t, 10)
        },
        isPushdown: function (e, t) {
            return e === this.pushdownWidth && t !== this.billboardHeight
        },
        handleTopNav: function (i) {
            var n, s, a, o, r = t("#SponsorAd"),
                l = r.find("iframe"),
                d = t("#TopNavAd"),
                c = d.find("iframe");
            return n = this.ads.findWhere({
                name: "Middle1C"
            }), a = i < this.navBreakPoint && 0 === l.length, o = i >= this.navBreakPoint && 0 === c.length, n && (a || o) ? (a ? (s = r, c.remove()) : (s = d, l.remove()), e.defer(this.renderAd, {
                el: s,
                model: n
            }), !0) : !1
        },
        fireSlideShowAd: function (e) {
            var i = this.ads.findWhere({
                    name: e.position
                }),
                n = t('<div class="ad-wrapper"></div>');
            this.adShown[e.position] || "object" != typeof i || (this.adShown[e.position] = !0, e.el.html(n), this.renderAd({
                el: n,
                model: i
            }), this.broadcast("nyt:slideshow-ad-render", i))
        },
        hasInterstitial: function () {
            var e, t = this.ads.findWhere({
                name: "Interstitial"
            });
            return t ? (e = t.get("timeout") ? 1e3 * parseInt(t.get("timeout"), 10) : 15e3, this.createInterstitial(t, this.completeInterstitial, e), !0) : !1
        },
        fireRibbonInterstitial: function () {
            var e = this.pageManager.getViewport();
            this.$shell.prepend(a.ribbonInterstitial()), this.renderAdByPositionName("RibbonInterstitial"), this.$shell.find("#main").addClass("visually-hidden").end().find(".ribbon-interstitial-ad-overlay").css("height", e.height - 150).find("iframe").css("width", "")
        },
        createInterstitial: function (e, t, i) {
            var n = this;
            this.interstitialModal = new o({
                id: "interstitial-ad-modal",
                modalTitle: "advertisement",
                tailDirection: "fixed",
                hasOverlay: !0,
                hasCloseButton: !0,
                width: e.get("width"),
                height: e.get("height"),
                modalContent: a.interstitialModal(),
                closeCallback: t,
                openCallback: function () {
                    n.renderAdByPositionName(e.get("name"))
                }
            }).addToPage().open(), i && (n.closeTimeout = window.setTimeout(this.interstitialModal.close, i))
        },
        completeInterstitial: function (e) {
            window.clearTimeout(this.closeTimeout), this.interstitialModal.removeFromPage(), this.ads.remove(e), this.checkAds()
        }
    });
    return r
}), define("interactive/views/ads/ads", ["jquery/nyt", "underscore/nyt", "shared/ad/views/ads"], function (e, t, i) {
    "use strict";
    var n = i.extend({
        scope: "interactive",
        deferredAds: [],
        options: {
            adx_campaign: "www.nytimes.com",
            positions: ["Middle1C", "Bar1", "Spon2", "Anchor", "Inv1", "ab1", "ab2", "ab3", "prop1", "prop2"],
            autoconfirm: 0,
            keywords: []
        },
        preInitialize: function () {
            var e = this.pageManager.getCurrentBreakpoint();
            this.options.positions.push(120 >= e ? "mobilebanner" : "TopAd"), this.subscribeOnce("nyt:ads-rendered", this.handleAdsRendered)
        },
        handleApplicationAd: function (e) {
            var t, i = e.get("name");
            return t = "Middle1C" === i ? this.handleTopNav(this.pageManager.getCurrentBreakpoint()) : this.renderAdByPositionName(i, e)
        },
        responsive: function (e) {
            this.handleTopNav(e)
        },
        handleAdsRendered: function () {
            var e = this.ads.findWhere({
                name: "mobilebanner"
            });
            e && this.renderAd({
                el: "#TopAd",
                model: e
            })
        }
    });
    return n
}), define("interactive/instances/ad-manager", ["interactive/views/ads/ads"], function (e) {
    "use strict";
    new e
}), define("shared/masthead/templates", ["underscore/nyt"], function (_) {
    var templates = {};
    return templates.profileIcon = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<span class="avatar" role="presentation">\n<a href="http://timespeople.nytimes.com/view/user/' + (null == (__t = userData.getUserId()) ? "" : __t) + '/settings.html"><img src="' + (null == (__t = userData.getImageUrl()) ? "" : __t) + '" alt="" /></a>\n</span>';
        return __p
    }, templates.userName = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<button class="button user-name-button">\n<span class="button-text">' + (null == (__t = getTruncatedUserName(15)) ? "" : __t) + '</span>\n<i class="icon sprite-icon user-icon"></i>\n<i class="icon caret-icon"></i>\n</button>';
        return __p
    }, templates.userNameModalContent = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<ul>\n<li><a href="http://timespeople.nytimes.com/view/user/' + (null == (__t = userData.getUserId()) ? "" : __t) + '/settings.html">My Profile</a></li>\n<li><a href="' + (null == (__t = hosts.myaccount) ? "" : __t) + '/membercenter/myaccount.html">My Account</a></li>\n<li><a href="' + (null == (__t = hosts.myaccount) ? "" : __t) + '/mem/manage_billing.html">My Billing Information</a></li>\n<li><a href="' + (null == (__t = "http:" + hosts.www) ? "" : __t) + '/saved">My Saved Items</a></li>\n<li><button class="button log-out-button">Log Out</button></li>\n</ul>';
        return __p
    }, templates.userNameModalTitle = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += "", "" != userData.getImageUrl() && (__p += '<span class="avatar">\n<a href="http://timespeople.nytimes.com/view/user/' + (null == (__t = userData.getUserId()) ? "" : __t) + '/settings.html"><img src="' + (null == (__t = userData.getImageUrl()) ? "" : __t) + '" /></a>\n</span>'), __p += '\n<span class="user-name-subscription">\n<span class="user-name">' + (null == (__t = userData.getUserName()) ? "" : __t) + '</span>\n<span class="user-subscription"><a href="https://myaccount.nytimes.com/membercenter/myaccount.html">' + (null == (__t = subscription.label) ? "" : __t) + "</a></span>\n</span>";
        return __p
    }, templates.userSettingsModal = function (obj) {
        {
            var __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<div class="menu edition-menu">\n<h5 class="modal-heading">Edition</h5>\n<ul>\n<li><a href="http://www.nytimes.com" data-edition="us">U.S.</a></li>\n<li><a href="http://global.nytimes.com" data-edition="global">International</a></li>\n<li><a href="http://cn.nytimes.com" data-edition="chinese">中文 (Chinese)</a></li>\n</ul>\n</div>\n<div class="menu help-menu">\n<h5 class="modal-heading">Help</h5>\n<ul>\n<li><a href="http://www.nytimes.com/content/help/front.html">FAQ</a></li>\n<li><a href="http://www.nytimes.com/content/help/contact/directory.html">Contact Us</a></li>\n</ul>\n</div>\n', showTypeSizer && (__p += '\n<div class="menu type-sizer-menu">\n<h5 class="modal-heading">Type Size</h5>\n<ul>\n<li data-size="small" class="type-sizer-small"><a href="javascript:;">A <span class="visually-hidden">Type size small</span></a></li>\n<li data-size="medium" class="type-sizer-medium"><a href="javascript:;">A <span class="visually-hidden">Type size medium</span></a></li>\n<li data-size="large" class="type-sizer-large"><a href="javascript:;">A <span class="visually-hidden">Type size large</span></a></li>\n</ul>\n</div>\n'), __p += "";
        return __p
    }, templates
}), define("shared/masthead/views/masthead", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "foundation/hosts", "foundation/models/user-data", "shared/masthead/templates"], function (e, t, i, n, s, a) {
    "use strict";
    var o = i.registerView("masthead").extend({
        el: "#masthead",
        events: {
            "click .home-button": "handleHomeClick",
            "click .search-button": "handleSearchClick",
            "click .sections-button": "handleSectionsClick",
            "click .branding a": "handleLogoClick",
            "click .story-meta .nyt-logo": "handleLeftLogoClick",
            "click .editions-menu a": "handleEditionClick",
            "click .login-button": "handleLogInClick"
        },
        nytEvents: {
            "nyt:ribbon-visiblility": "accomodateRibbon",
            "nyt:masthead-search-toggle": "handleSearchToggle",
            "nyt:messaging-critical-alerts-move-furniture": "handlePageAlerts",
            "nyt:messaging-suggestions-move-furniture": "handlePageAlerts",
            "nyt:messaging-notification-count-update": "handleMessagingCountChange",
            "nyt:masthead-edition-change": "handleEditionClick"
        },
        initialize: function () {
            this.trackingBaseData = {
                action: "click",
                contentCollection: this.pageManager.getMeta("article:section"),
                region: "TopBar"
            }
        },
        handleUserReady: function () {
            var e = this.$el.find(".user-tools-button-group");
            s.isLoggedIn() ? e.prepend(a.userName(s)) : e.find(".login-button").removeClass("hidden")
        },
        accomodateRibbon: function (e) {
            e ? (this.$el.addClass("ribbon-visible"), this.$el.find(".update-text").css("display", "inline-block")) : (this.$el.find(".update-text").css("display", "none"), this.$el.removeClass("ribbon-visible"))
        },
        handlePageAlerts: function (e) {
            e(this.$el)
        },
        handleHomeClick: function (t) {
            var i, n;
            i = e(t.currentTarget).closest(".home-button"), n = this.trackingAppendParams(i.data("href"), {
                module: "HomePage-Button"
            }), window.location = n
        },
        handleSearchClick: function (e) {
            this.broadcast("nyt:masthead-search-click", e), this.trackingTrigger("masthead-search-click", {
                module: "SearchOpen",
                eventName: "OpenSearchBar"
            })
        },
        handleSectionsClick: function (e) {
            this.broadcast("nyt:masthead-section-click", e)
        },
        handleLogoClick: function (t) {
            var i, n;
            i = e(t.currentTarget), n = this.trackingAppendParams(i.attr("href"), {
                module: "HomePage-Title"
            }), i.attr("href", n)
        },
        handleLeftLogoClick: function (t) {
            var i, n;
            i = e(t.currentTarget).parent("a"), n = this.trackingAppendParams(i.attr("href"), {
                module: "HomePage-Left-Title"
            }), i.attr("href", n)
        },
        handleSearchToggle: function (e) {
            this.$el.find(".search-button")[e ? "addClass" : "removeClass"]("active")
        },
        handleMessagingCountChange: function (e) {
            var t = this.$el.find(".notifications-button"),
                i = e.count > 99 ? "99+" : e.count;
            t.find(".button-text").html(i), e.delta > 0 ? (t.addClass("has-notifications animate-notifications"), setTimeout(function () {
                t.removeClass("animate-notifications")
            }, 2e3)) : 0 === e.count && t.removeClass("has-notifications")
        },
        handleEditionClick: function (t) {
            var i = e(t.target),
                n = i.data("edition"),
                s = i.attr("href"),
                a = "";
            switch (this.pageManager.setEdition(n), n) {
            case "us":
                a = "EditionToggleToUS";
                break;
            case "global":
                a = "EditionToggleToGlobal";
                break;
            case "chinese":
                a = "EditionToggleToCHNS"
            }
            s = this.trackingAppendParams(s, {
                module: a
            }), i.attr("href", s)
        },
        handleLogInClick: function () {
            this.trackingTrigger("masthead-login-click", {
                module: "LogIn",
                "WT.nav": "shell"
            })
        }
    });
    return o
}), define("shared/masthead/views/in-story-theme", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "foundation/views/page-manager"], function (e, t, i, n) {
    "use strict";
    var s = i.extend({
        el: "#masthead",
        events: {
            "click .kicker": "scrollToTop",
            "click .kicker-label a": "handleSectionClick"
        },
        nytEvents: {
            "nyt:page-scroll": "toggleTheme",
            "nyt:page-scroll-after": "setSwitchPosition",
            "nyt:page-resize": "handleResize",
            "nyt:page-breakpoint": "handleBreakPoint",
            "nyt:masthead-switch-change": "handleSwitchChange",
            "nyt:masthead-position-change": "handlePositionChange"
        },
        defaultSettings: {
            themeClass: "in-content",
            switchPosition: 0,
            shouldScrollAway: !1,
            currentBreakPoint: n.getCurrentBreakpoint(),
            metaContainer: ".story-meta",
            contentSelector: "#story",
            contentSwitchPointSelector: ".story-meta .kicker"
        },
        initialize: function (e) {
            this.settings = t.extend({}, this.defaultSettings, e)
        },
        handleDomReady: function () {
            this.isTransparent() ? this.setSwitchOverrides("#story .story-body-text", !0) : this.$switchSelector = e("#story").find(".story-meta .kicker"), this.$pageContainer = this.$el.find(".container"), this.$mastheadKicker = this.$el.find(".kicker"), this.setSwitchPosition(), this.toggleTheme()
        },
        handleSwitchChange: function (e, t) {
            this.setSwitchOverrides(e, t)
        },
        handlePositionChange: function (e) {
            this.settings.shouldScrollAway = e || !1, e || this.$el.css("position", "fixed"), this.toggleTheme()
        },
        handleResize: function () {
            n.isDomReady() && (this.isTransparent() ? this.setSwitchOverrides("#story .story-body-text", !0) : this.$switchSelector = e("#story").find(".story-meta .kicker"), this.moveMastheadKicker(), this.settings.currentBreakPoint < 1010 ? this.removeStoryTheme() : this.toggleTheme())
        },
        setSwitchOverrides: function (t, i) {
            this.settings.shouldScrollAway = i || !1, this.$switchSelector = e(t), this.setSwitchPosition(!0), this.toggleTheme()
        },
        setSwitchPosition: function (e) {
            this.$switchSelector.length > 0 && (this.settings.switchPosition = this.$switchSelector.offset().top - this.$el.height()), e === !0 && (this.settings.overridePosition = this.settings.switchPosition)
        },
        toggleTheme: function () {
            var e, t, i, s, a, o = this.settings.overridePosition || 100;
            this.settings.switchPosition < o && (this.settings.switchPosition = o), e = n.getViewport().top, t = e > this.settings.switchPosition, i = e > o, s = this.$el.hasClass(this.settings.themeClass), a = "nyt:masthead-storytheme", t && !s && this.settings.currentBreakPoint >= 1010 ? (this.settings.shouldScrollAway === !0 && this.$el.css("position", "fixed"), this.addStoryTheme(), this.broadcast(a, !0)) : !i && s ? (this.settings.shouldScrollAway === !0 && this.$el.css("position", "absolute"), this.removeStoryTheme(), this.broadcast(a, !1)) : s || this.settings.shouldScrollAway !== !0 || this.$el.css("position", "absolute")
        },
        addStoryTheme: function () {
            this.isTransparent() || this.$el.find(".branding").fadeOut(300).end().addClass(this.settings.themeClass), this.$el.find(this.settings.metaContainer).fadeIn(300).end().addClass(this.settings.themeClass), this.moveMastheadKicker()
        },
        removeStoryTheme: function () {
            this.isTransparent() || this.$el.find(".branding").stop(!1, !0).show().end().removeClass(this.settings.themeClass), this.$el.find(this.settings.metaContainer).stop().hide().end().removeClass(this.settings.themeClass)
        },
        moveMastheadKicker: function () {
            var e;
            this.$mastheadKicker && "collection" !== this.pageManager.getApplicationName() && (this.settings.currentBreakPoint >= 10050 && this.settings.currentBreakPoint < 10070 ? (e = this.$pageContainer.width() - 1389, this.$mastheadKicker.css({
                "margin-left": Math.floor(e / 2) + "px"
            })) : 10070 === this.settings.currentBreakPoint ? this.$mastheadKicker.css("margin-left", "138px") : this.settings.currentBreakPoint < 10050 && this.$mastheadKicker.css("margin-left", "0px"))
        },
        scrollToTop: function (t) {
            var i = e(t.target);
            i.is("a") || i.parent().is("a") || e("html, body").animate({
                scrollTop: 0
            }, 400)
        },
        handleBreakPoint: function (e) {
            this.settings.currentBreakPoint = e
        },
        isTransparent: function () {
            return this.$el.hasClass("masthead-theme-transparent") || this.$el.hasClass("masthead-theme-transparent-ffffff") ? !0 : void 0
        },
        handleSectionClick: function (t) {
            var i = e(t.currentTarget),
                n = this.trackingAppendParams(i.attr("href"), {
                    module: "SF-FixedNav",
                    action: "click",
                    contentCollection: this.pageManager.getMeta("article:section"),
                    region: "TopBar"
                });
            i.attr("href", n)
        }
    });
    return s
}), define("shared/searchform/models/search-suggest", ["foundation/models/base-model"], function (e) {
    "use strict";
    var t = e.extend({
        defaults: {
            query: "",
            results: []
        }
    });
    return t
}), define("shared/searchform/collections/search-suggest", ["backbone/nyt", "foundation/collections/base-collection", "foundation/views/page-manager", "shared/searchform/models/search-suggest", "foundation/hosts"], function (e, t, i, n, s) {
    "use strict";
    var a = t.extend({
        model: n,
        mobileBaseUrl: s.mobileWeb,
        desktopBaseUrl: s.www,
        settings: {
            numOfSuggestions: 7
        },
        query: "",
        sync: function (t, i, n) {
            var s = "/svc/suggest/v1/homepage?query=" + this.query;
            return n.url = this.pageManager.getCurrentBreakpoint() < 120 ? this.mobileBaseUrl + s : this.desktopBaseUrl + s, e.sync(t, i, n)
        },
        parse: function (e) {
            return {
                query: e[0],
                results: e[1].slice(0, this.settings.numOfSuggestions)
            }
        },
        newQuery: function (e) {
            this.query = e, this.fetch()
        }
    });
    return a
}), define("shared/searchform/templates", ["underscore/nyt"], function (_) {
    var templates = {};
    return templates.autoSuggest = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<li><a href="' + (null == (__t = queryUrl) ? "" : __t) + '">\n' + (null == (__t = suggest.replace(queryRegExp, "<strong>" + query + "</strong>")) ? "" : __t) + "\n</a></li>";
        return __p
    }, templates
}), define("shared/searchform/helpers/search-form-mixin", ["jquery/nyt", "underscore/nyt", "foundation/lib/polyfills/placeholder", "shared/searchform/collections/search-suggest", "shared/searchform/templates", "foundation/hosts"], function (e, t, i, n, s, a) {
    "use strict";
    var o = t.extend({}, {
        collection: new n,
        searchBaseUrl: a.search + "/search/sitesearch/#/",
        searchMobileUrl: a.mobileWeb + "/search?query=",
        KEYS: {
            ENTER: 13,
            ESC: 27,
            UP_ARROW: 38,
            DOWN_ARROW: 40,
            LEFT_ARROW: 37,
            RIGHT_ARROW: 39
        },
        initialize: function () {
            var e = this.pageManager.getMeta("article:section") || "";
            t.bindAll(this, "handlePageClicks"), this.trackingBaseData = {
                action: "click",
                contentCollection: e,
                region: "TopBar"
            }
        },
        handleDomReady: function () {
            this.$list = this.$el.find(".auto-suggest"), this.$clearButton = this.$el.find(".clear-button"), this.$overlay = this.$shell.find(".search-overlay"), this.$input = this.$el.find(".search-input"), this.$submitButton = this.$el.find(".submit-button"), this.disableSubmitButton(), this.listenTo(this.collection, "sync change", this.render), this.throttledSuggestions = t.debounce(this.getAutoSuggestions, 250), this.afterInitialize()
        },
        afterInitialize: e.noop,
        render: function () {
            var e, t = "",
                i = this.collection.toJSON()[0],
                n = new RegExp(i.query, "ig"),
                a = s.autoSuggest,
                o = i.results.length;
            if (o > 0 && this.getSearchValue().length > 0) {
                for (e = 0; o > e; e += 1) t += a({
                    query: i.query,
                    queryUrl: this.getSearchUrl(i.results[e]),
                    suggest: i.results[e],
                    queryRegExp: n
                });
                this.$list.show().find("ol").html(t)
            } else this.$list.hide()
        },
        handleKeyDown: function (e) {
            var t = e.which;
            t === this.KEYS.ENTER && e.preventDefault()
        },
        handleKeyUp: function (e) {
            var t = e.which;
            e.preventDefault(), t === this.KEYS.UP_ARROW || t === this.KEYS.DOWN_ARROW ? this.navigateAutoSuggestions(t) : t === this.KEYS.ENTER ? this.handleEnterKey(e) : t === this.KEYS.RIGHT_ARROW || t === this.KEYS.LEFT_ARROW ? this.handleRightLeftKey(e) : (this.$clearButton[this.getSearchValue().length > 0 ? "fadeIn" : "fadeOut"](200), this.getSearchValue().length ? this.$submitButton.hasClass("disabled") && this.$submitButton.removeClass("disabled") : this.disableSubmitButton(), this.throttledSuggestions())
        },
        handleEnterKey: function () {
            this.submitSearch()
        },
        handleRightLeftKey: e.noop,
        handleClearButton: function (e) {
            e.preventDefault(), this.setSearchValue(""), this.$clearButton.fadeOut(200), this.disableSubmitButton(), this.$input.focus(), i()
        },
        setSearchValue: function (e) {
            this.$input.val(e)
        },
        getSearchValue: function () {
            return e.trim(this.$input.val())
        },
        hideAutoSuggest: function () {
            this.$list.hide()
        },
        getAutoSuggestions: function () {
            var e = this.getSearchValue();
            e.length > 1 ? this.collection.newQuery(e) : this.hideAutoSuggest()
        },
        getSearchUrl: function (e) {
            return this.pageManager.getCurrentBreakpoint() < 120 ? this.searchMobileUrl + e + "&sort=rel" : this.searchBaseUrl + e
        },
        navigateAutoSuggestions: function (e) {
            var t, i;
            i = this.$list.find(".active"), t = i.parent().index() || 0, t += e === this.KEYS.UP_ARROW ? -1 : 1, this.$list.find("a").removeClass("active").eq(t).addClass("active"), this.setSearchValue(this.$list.find("a").eq(t).text())
        },
        submitSearch: function (e) {
            var t, i = this.getSearchValue();
            e && e.preventDefault(), i && (t = this.trackingAppendParams(this.getSearchUrl(i), {
                module: "SearchSubmit"
            }), this.$el.is(":visible") && (window.location = t))
        },
        handlePageClicks: function () {
            this.hideAutoSuggest()
        },
        disableSubmitButton: function () {
            this.$submitButton.addClass("disabled")
        }
    });
    return o
}), define("shared/masthead/views/search", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "shared/searchform/helpers/search-form-mixin"], function (e, t, i, n) {
    "use strict";
    var s = i.extend(t.extend({}, n, {
        el: e("#masthead").find(".search-flyout-panel"),
        events: {
            "click .close-button": "close",
            "keyup .search-input": "handleKeyUp",
            "keydown .search-input": "handleKeyDown",
            "click .submit-button": "submitSearch",
            "click .clear-button": "handleClearButton"
        },
        nytEvents: {
            "nyt:masthead-search-click": "toggle",
            "nyt:masthead-search-toggle": "handleSearchToggle",
            "nyt:navigation-search-click": "toggle",
            "nyt:search-close-ready": "close"
        },
        slideTiming: 100,
        afterInitialize: function () {
            this.trackingBaseData["WT.nav"] = "searchWidget", this.$input.removeAttr("placeholder")
        },
        open: function () {
            var e = this;
            this.$el.slideDown(this.slideTiming, function () {
                e.$el.find(".control").fadeIn(e.slideTiming).end().find(".search-input").val("").focus()
            }), this.broadcast("nyt:masthead-search-toggle", !0), this.$shell.on("click", this.handlePageClicks), this.subscribeOnce("nyt:page-key-esc", this.close), this.$overlay.fadeIn(200), this.$html.addClass("search-active")
        },
        close: function () {
            var e = this;
            this.$html.hasClass("search-active") && (this.$el.find(".control").fadeOut(this.slideTiming, function () {
                e.$el.slideUp(e.slideTiming, function () {
                    e.$html.removeClass("search-active")
                })
            }), this.broadcast("nyt:masthead-search-toggle", !1), this.$shell.off("click", this.handlePageClicks), this.setSearchValue(""), this.$overlay.fadeOut(200))
        },
        toggle: function () {
            this[this.$el.is(":visible") ? "close" : "open"]()
        },
        isSearchButton: function (t) {
            var i = e(t).hasClass("search-button"),
                n = 1 === e(t).parents(".search-button").length;
            return i || n
        },
        isSearchFlyout: function (t) {
            var i = e(t).hasClass("search-flyout-panel"),
                n = 1 === e(t).parents(".search-flyout-panel").length;
            return i || n
        },
        handlePageClicks: function (e) {
            this.isSearchButton(e.target) || this.isSearchFlyout(e.target) || this.close(), this.hideAutoSuggest()
        },
        handleSearchToggle: function (e) {
            e === !1 && (this.$el.find(".submit-button").addClass("disabled"), this.$el.find(".clear-button").hide())
        }
    }));
    return s
}), define("shared/masthead/views/user-settings-modal", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "shared/modal/views/modal", "shared/masthead/templates"], function (e, t, i, n, s) {
    "use strict";
    var a = i.extend({
        events: {
            "click .edition-menu a": "handleEditionClick",
            "click .type-sizer-menu li": "handleFontSizeClick",
            "click .help-menu a": "handleHelpMenuClick"
        },
        nytEvents: {
            "nyt:fontsizer-initialize": "handleFontSizeChange",
            "nyt:fontsizer-change": "handleFontSizeChange"
        },
        defaultSettings: {
            id: "user-settings-modal",
            binding: ".user-settings-button",
            tailDirection: "up-right",
            tailTopOffset: -8,
            tailLeftOffset: -1,
            width: "260px",
            toggleSpeed: 1,
            showTypeSizer: !0,
            openCallback: function () {
                this.$target.addClass("active"), this.subscribeOnce("nyt:page-scroll", this.close)
            },
            closeCallback: function () {
                this.$target.removeClass("active")
            }
        },
        webTrendsNav: "user-settings-modalContainer",
        initialize: function (e) {
            var i = this.pageManager.getMeta("article:section") || "";
            this.settings = t.extend({}, this.defaultSettings, e), this.settings.modalContent = s.userSettingsModal({
                showTypeSizer: this.settings.showTypeSizer
            }), this.trackingBaseData = {
                action: "click",
                region: "TopBar",
                "WT.nav": this.webTrendsNav,
                contentCollection: i
            }
        },
        handleDomReady: function () {
            this.render()
        },
        render: function () {
            var e = new n(this.settings);
            this.setElement(e.$modal), e.$modal.find("a[data-edition=" + this.pageManager.getEdition() + "]").addClass("selected"), e.addToPage(), this.handleFontSizeChange()
        },
        handleEditionClick: function (e) {
            this.broadcast("nyt:masthead-edition-change", e, {
                "WT.nav": this.webTrendsNav
            })
        },
        handleHelpMenuClick: function (t) {
            var i = e(t.target),
                n = i.attr("href");
            n && (n = this.trackingAppendParams(n, {}), i.attr("href", n))
        },
        handleFontSizeClick: function (t) {
            var i = e(t.currentTarget).data("size");
            this.broadcast("nyt:fontsizer-change", i)
        },
        handleFontSizeChange: function (e) {
            var t = "type-size-selected";
            e = e || this.pageManager.getMeta("fontsizer_typeSize"), this.$el.find(".type-sizer-menu li").removeClass(t), this.$el.find(".type-sizer-" + e).addClass(t)
        }
    });
    return a
}), define("shared/masthead/views/user-name-modal", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "shared/modal/views/modal", "shared/masthead/templates", "foundation/models/user-data", "foundation/hosts"], function (e, t, i, n, s, a, o) {
    "use strict";
    var r = i.extend({
        events: {
            "click .premier-subscriber a": "handleUserSubscriptionClick",
            "click li a": "handleUserOptionClick"
        },
        defaultSettings: {
            id: "user-name-modal",
            modalTitle: "",
            modalContent: "",
            binding: ".user-name-button",
            tailDirection: "up-right",
            tailTopOffset: -8,
            tailLeftOffset: -1,
            width: "260px",
            toggleSpeed: 1,
            openCallback: function () {
                this.$target.addClass("active"), this.listenToOnce(this.pageManager, "nyt:page-scroll", this.close)
            },
            closeCallback: function () {
                this.$target.removeClass("active")
            }
        },
        initialize: function (e) {
            t.bindAll(this, "handleLogOut"), this.settings = t.extend({}, this.defaultSettings, e), this.trackingBaseData = {
                module: "ProfileDropdown",
                action: "click",
                region: "Masthead",
                "WT.nav": "shell"
            }
        },
        handleUserReady: function () {
            var e, t = this.getSubscriptionLabel(a);
            this.settings.modalTitle = s.userNameModalTitle({
                userData: a,
                subscription: t
            }), this.settings.modalContent = s.userNameModalContent({
                userData: a,
                hosts: o
            }), this.render(), e = this.$el.find(".user-subscription"), "" === t.label && e.remove(), "" !== t.className && e.addClass(t.className), "" !== t.link && e.find("a").attr("href", t.link), "NYT Now Subscriber" === t.label && e.find("a").after('<i class="icon dot-logo-icon"></i>'), this.listenToOnce(a, "nyt:user-image-loaded", this.handleProfileImage), this.$el.on("click", ".log-out-button", this.handleLogOut)
        },
        getSubscriptionLabel: function (e) {
            var t = {
                label: "",
                className: "",
                link: ""
            };
            return e.isPremierSubscriber() ? (t.label = "Times Premier Subscriber", t.className = "premier-subscriber", t.link = "http://www.nytimes.com/times-insider") : e.isWebSubscriber() && e.isMobileSubscriber() ? t.label = "All Digital Access Subscriber" : e.isTabletSubscriber() && e.isWebSubscriber() ? t.label = "Tablet and Web Subscriber" : e.isSmartphoneSubscriber() && e.isWebSubscriber() ? t.label = "Smartphone and Web Subscriber" : e.isWebSubscriber() ? t.label = "Web Subscriber" : e.isNytNowSubscriber() && e.isCookingSubscriber() ? (t.label = "NYT Now & Cooking Subscriber", t.link = "http://www.nytnow.com") : e.isNytNowSubscriber() && e.isOpinionSubscriber() ? (t.label = "NYT Now & NYT Opinion Subscriber", t.link = "http://www.nytimes.com/content/help/mobile/mobile.html") : e.isNytNowSubscriber() ? (t.label = "NYT Now Subscriber", t.link = "http://www.nytimes.com/content/help/mobile/nyt-now/nyt-now.html") : e.isOpinionSubscriber() && e.isCookingSubscriber() ? t.label = "NYT Opinion & Cooking Subscriber" : e.isCookingSubscriber() ? t.label = "Cooking Subscriber" : e.isOpinionSubscriber() ? (t.label = "NYT Opinion Subscriber", t.link = "http://www.nytimes.com/content/help/mobile/nyt-opinion/nyt-opinion.html") : e.isCrosswordsSubscriber() && (t.label = "Crosswords Subscriber"), t
        },
        render: function () {
            var e = new n(this.settings);
            this.setElement(e.$modal), e.addToPage()
        },
        handleProfileImage: function () {
            var e = s.profileIcon({
                userData: a
            });
            this.$el.find(".modal-heading").prepend(e)
        },
        handleUserSubscriptionClick: function (t) {
            var i = e(t.currentTarget),
                n = this.trackingAppendParams(i.attr("href"), {
                    contentCollection: "TimesPremier-InsideStory"
                });
            i.attr("href", n)
        },
        handleUserOptionClick: function (t) {
            var i = e(t.target),
                n = i.text(),
                s = i.attr("href"),
                a = {
                    action: "Click",
                    region: "TopBar",
                    "WT.nav": "shell"
                };
            s && (n && (a.module = n.replace(/\s/g, "")), s = this.trackingAppendParams(s, a), i.attr("href", s))
        },
        handleLogOut: function () {
            var e = "http:" + o.www + "/logout";
            e = this.trackingAppendParams(e, {
                module: "LogOut",
                action: "Click",
                region: "TopBar",
                "WT.nav": "shell"
            }), window.location = e
        }
    });
    return r
}), define("shared/masthead/instances/masthead", ["jquery/nyt", "shared/masthead/views/masthead", "shared/masthead/views/in-story-theme", "shared/masthead/views/search", "shared/masthead/views/user-settings-modal", "shared/masthead/views/user-name-modal"], function (e, t, i, n, s, a) {
    "use strict";
    new t, new n, new s({
        fixedOverride: !0,
        openCallback: function () {
            this.$target.addClass("active"), this.listenToOnce(this.pageManager, "nyt:masthead-storytheme", this.close)
        }
    }), new a({
        fixedOverride: !0,
        openCallback: function () {
            this.$target.addClass("active"), this.listenToOnce(this.pageManager, "nyt:masthead-storytheme", this.close)
        }
    }), e("#masthead .kicker").text().length > 1 && new i
}), define("shared/searchform/views/search-form", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "shared/searchform/helpers/search-form-mixin"], function (e, t, i, n) {
    "use strict";
    var s = i.extend(t.extend({}, n, {
        events: {
            "keyup .search-input": "handleKeyUp",
            "keydown .search-input": "handleKeyDown",
            "click .submit-button": "submitSearch",
            "click .clear-button": "handleClearButton"
        },
        afterInitialize: function () {
            this.$shell.on("click", this.handlePageClicks)
        }
    }));
    return s
}), define("shared/searchform/instances/search-form", ["jquery/nyt", "foundation/views/page-manager", "shared/searchform/views/search-form"], function (e, t, i) {
    "use strict";
    t.getMeta("errorpage") && new i({
        el: e(".error-page .search-form-control")
    })
}), define("shared/account/templates", ["underscore/nyt"], function (_) {
    var templates = {};
    return templates.accountModalHeader = function (obj) {
        {
            var __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<h4 class="modal-subheading">To save articles or get newsletters, alerts or recommendations &ndash; all free.</h4>';
        return __p
    }, templates.logInModalContent = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<div class="buttons">\n' + (null == (__t = oauthButtons) ? "" : __t) + '\n</div><!-- close buttons -->\n<div class="separator">\n<span class="separator-text">OR</span>\n</div>\n<div class="login-form-control form-control">\n<form id="login-form" class="login-form" role="form" method="post" action="' + (null == (__t = loginUrl) ? "" : __t) + '">\n<div class="control">\n<div class="label-container visually-hidden">\n<label for="login-email" id="login-email-label">Email address</label>\n</div>\n<div class="field-container">\n<input type="text" id="login-email" name="userid" class="text login-email" placeholder="Email address" aria-labelledby="login-email-label" aria-required="true">\n<button type="button" class="button clear-button" tabindex="-1" aria-describedby="clear-email-description"><i class="icon"></i><span class="visually-hidden" id="clear-email-description">Clear this text input</span></button>\n</div>\n</div>\n<div class="control">\n<div class="label-container visually-hidden">\n<label for="login-password" id="login-password-label">Password</label>\n</div>\n<div class="field-container">\n<input type="password" id="login-password" name="password" class="text login-password" placeholder="Password" data-type="password" aria-labelledby="login-password-label" aria-required="true">\n<button type="button" class="button clear-button" tabindex="-1" aria-describedby="clear-password-description"><i class="icon"></i><span class="visually-hidden" id="clear-password-description">Clear this text input</span></button>\n</div>\n</div>\n<div class="control user-action-control layout-horizontal">\n<div class="control checkbox-control">\n<div class="field-container">\n<input type="checkbox" id="login-remember-checkbox" name="login-remember" class="checkbox login-remember" checked="checked" aria-labelledby="login-remember-label" aria-checked="true" value="">\n</div>\n<div class="label-container">\n<label for="login-remember" class="checkbox-label" id="login-remember-label">Remember me</label>\n</div>\n</div>\n<p class="form-hint password-hint"><a href="//www.nytimes.com/forgot">Forgot password?</a></p>\n</div>\n<div class="control">\n<p class="disclaimer"><a href="http://www.nytimes.com/content/help/rights/terms/terms-of-service.html">Terms of Service</a> <a href="http://www.nytimes.com/content/help/rights/privacy/policy/privacy-policy.html">Privacy Policy</a></p>\n</div>\n<div class="control button-control">\n<button id="login-send-button" class="button login-button">Log in</button>\n</div>\n<input name="is_continue" value="1" type="hidden">\n<input id="account-form-token" name="token" value="" type="hidden">\n<input id="account-form-expiration" name="expires" value="" type="hidden">\n<input id="login-remember" name="remember" value="1" type="hidden">\n</form>\n</div><!-- close login-form-control -->';
        return __p
    }, templates.loginModalFooter = function (obj) {
        {
            var __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<p class="user-action registration-modal-trigger">Don&#8217;t have an account? <a href="javascript:;">Sign Up</a></p>';
        return __p
    }, templates.oauthButtons = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<button id="' + (null == (__t = facebookId) ? "" : __t) + '" data-provider-name="facebook" class="button oauth-button facebook-oauth-button">\n<i class="icon sprite-icon"></i>\n<span class="button-text">' + (null == (__t = prefix) ? "" : __t) + ' with Facebook</span>\n</button>\n<button id="' + (null == (__t = googleId) ? "" : __t) + '" data-provider-name="google" class="button oauth-button google-oauth-button">\n<i class="icon sprite-icon"></i>\n<span class="button-text">' + (null == (__t = prefix) ? "" : __t) + " with Google</span>\n</button>";
        return __p
    }, templates.registrationModalContent = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<div class="buttons">\n' + (null == (__t = oauthButtons) ? "" : __t) + '\n</div><!-- close buttons -->\n<div class="separator">\n<span class="separator-text">OR</span>\n</div>\n<div class="registration-form-control form-control">\n<form id="registration-form" class="registration-form" role="form" method="post" action="' + (null == (__t = regiUrl) ? "" : __t) + '">\n<div class="control">\n<div class="label-container visually-hidden">\n<label for="register-email" id="register-email-label">Email address</label>\n</div>\n<div class="field-container">\n<input type="email" id="register-email" name="email_address" class="text register-email" placeholder="Email address" aria-labelledby="register-email-label" aria-required="true" />\n<button type="button" class="button clear-button" tabindex="-1" aria-describedby="clear-email-description"><i class="icon"></i><span class="visually-hidden" id="clear-email-description">Clear this text input</span></button>\n</div>\n</div><!-- close control -->\n<div class="control">\n<div class="label-container visually-hidden">\n<label for="register-password" id="register-password-label">Password</label>\n</div>\n<div class="field-container">\n<input type="password" id="register-password" name="password1" class="text register-password" placeholder="Password" data-type="password" aria-labelledby="register-password-label" aria-required="true" />\n<button type="button" class="button clear-button" tabindex="-1" aria-describedby="clear-password-description"><i class="icon"></i><span class="visually-hidden" id="clear-password-description">Clear this text input</span></button>\n</div>\n</div><!-- close control -->\n<div class="control">\n<div class="label-container visually-hidden">\n<label for="retype-password" id="retype-password-label">Retype password</label>\n</div>\n<div class="field-container">\n<input type="password" id="retype-password" name="password2" class="text retype-password" placeholder="Retype password" data-type="password" aria-labelledby="retype-password-label" aria-required="true" />\n<button type="button" class="button clear-button" tabindex="-1" aria-describedby="clear-retyped-password-description"><i class="icon"></i><span class="visually-hidden" id="clear-retyped-password-description">Clear this text input</span></button>\n</div>\n</div><!-- close control -->\n<div class="control layout-horizontal">\n<p class="form-hint">\nBy signing up, you agree to receive updates and special offers for The New York Times’s products and services. You may unsubscribe at any time.\n</p>\n</div>\n<div class="control">\n<p class="disclaimer"><a href="http://www.nytimes.com/content/help/rights/terms/terms-of-service.html">Terms of Service</a> <a href="http://www.nytimes.com/content/help/rights/privacy/policy/privacy-policy.html">Privacy Policy</a></p>\n</div>\n<div class="control button-control">\n<button id="register-send-button" class="button register-button">Create Account</button>\n</div>\n<input name="is_continue" value="1" type="hidden">\n<input id="account-form-token" name="token" value="" type="hidden">\n<input id="account-form-expiration" name="expires" value="" type="hidden">\n<input id="account-form-subscribe" name="subscribe[]" type="hidden" value="MM">\n</form>\n</div><!-- close registration-form-control -->';
        return __p
    }, templates.registrationModalFooter = function (obj) {
        {
            var __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<p class="user-action login-modal-trigger">Already have an account? <a href="javascript:;">Log In</a></p>';
        return __p
    }, templates
}), define("shared/account/helpers/account-modal-mixin", ["jquery/nyt", "underscore/nyt", "foundation/lib/polyfills/placeholder", "shared/account/templates", "foundation/models/token", "foundation/hosts"], function (e, t, i, n, s, a) {
    "use strict";
    var o = {
        oauthProviders: ["google", "facebook"],
        handleFormSubmit: function (e) {
            s.getToken() ? (this.$el.find("#account-form-token").val(s.getToken()), this.$el.find("#account-form-expiration").val(s.getTokenExpiration()), this.$el.find("#login-remember").val(this.$el.find("#login-remember-checkbox").is(":checked") ? 1 : 0)) : e.preventDefault()
        },
        handleFormButton: function () {
            s.getToken() ? this.$el.find("form").submit() : (this.subscribeOnce("nyt:myaccount-token", this.handleFormButton), s.loadData())
        },
        handleKeyUp: function (t) {
            var i = e(t.target);
            i.parent().find(".clear-button").toggle("" !== i.val())
        },
        handleClearButton: function (t) {
            var n = e(t.currentTarget),
                s = n.parent().find("input");
            n.toggle(!1), s.val(""), i()
        },
        executeOauthLogin: function (t) {
            t.preventDefault(), this.oauthPopup(e(t.currentTarget).data("providerName"))
        },
        addEvent: function (e, t, i) {
            e.addEventListener ? e.addEventListener(t, i, !1) : e.attachEvent("on" + t, i)
        },
        getPageUrlParams: function () {
            var t, i = window.location,
                n = {
                    URI: i.protocol + "//" + i.hostname + "/" + i.pathname.replace(/^\//, "")
                };
            return i.search.length > 1 && (t = i.search.substr(1), t = t.replace(/(\?|&)?gwh=([^&]+)/g, ""), t = t.replace(/(\?|&)?gwt=([^&]+)/g, ""), t = t.replace(/%/g, "Q"), n.OQ = t), e.param(n)
        },
        getSocialLinkUrl: function (e, t, i) {
            return a.myaccount + "/oauth/" + t + "-link?type=login&URI=" + e + (i ? "&view=popup" : "") + "&flow=HPLI"
        },
        oauthPopup: function (e) {
            var i, n, s = "oauthPopup",
                a = 450,
                o = 600; - 1 !== t.indexOf(this.oauthProviders, e) && (n = ["height=" + o, "width=" + a, "left=" + (window.screen.availLeft + window.screen.width / 2 - a / 2), "top=" + Math.max(window.screen.height / 2 - o / 2 - 20, 0), "scrollbars=1"], i = window.open("about:blank", s, n.join(",")), i ? (i = window.open(this.getSocialLinkUrl(document.URL, e, !0), s, n.join(",")), i.focus()) : window.location.href = this.getSocialLinkUrl(document.URL, e))
        },
        renderOauthButtons: function () {
            return n.oauthButtons({
                facebookId: this.getFacebookButtonId(this.modalSettings.id),
                googleId: this.getGoogleButtonId(this.modalSettings.id),
                prefix: this.modalSettings.oauthButtonText
            })
        },
        addOauthEvents: function (e) {
            this.$el.find("#" + this.getGoogleButtonId(e) + ", #" + this.getFacebookButtonId(e)).on("click", t.bind(this.executeOauthLogin, this))
        },
        getFacebookButtonId: function (e) {
            return "facebook-oauth-button-" + e
        },
        getGoogleButtonId: function (e) {
            return "google-oauth-button-" + e
        }
    };
    return o
}), define("shared/account/views/login-modal", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "foundation/models/user-data", "shared/modal/views/modal", "shared/account/templates", "foundation/hosts", "shared/account/helpers/account-modal-mixin", "foundation/lib/polyfills/placeholder"], function (e, t, i, n, s, a, o, r, l) {
    "use strict";
    var d = i.extend(t.extend({}, r, {
        events: {
            "click .registration-modal-trigger": "handleRegisterClick",
            "click #login-send-button": "handleFormButton",
            "submit #login-form": "handleFormSubmit",
            "click .clear-button": "handleClearButton",
            "keyup .text": "handleKeyUp"
        },
        nytEvents: {
            "nyt:loginmodal-open": "handleOpen"
        },
        defaultSettings: {
            id: "login-modal",
            addlClasses: "account-modal",
            headerContent: a.accountModalHeader(),
            modalContent: "",
            modalFooter: a.loginModalFooter(),
            modalTitle: "Log in",
            oauthButtonText: "Log in",
            binding: ".login-modal-trigger",
            tailDirection: "fixed",
            hasCloseButton: !0,
            hasOverlay: !0,
            tailLeftOffset: -40,
            tailTopOffset: -40
        },
        initialize: function (e) {
            var i = this;
            this.modalSettings = t.extend({}, this.defaultSettings, e), this.modalSettings.modalContent = a.logInModalContent({
                oauthButtons: this.renderOauthButtons(),
                loginUrl: o.myaccount + "/auth/login?" + this.getPageUrlParams()
            }), this.modalSettings.openCallback = function () {
                var e = i.modalTitle || this.$target.data("modal-title") || "Log in";
                i.hasPlaceholderSupport && this.$modal.find(".login-email").focus(), this.$modal.find("#login-modal-modal-heading").text(e), this.$modal.find(".modal-subheading").toggleClass("hidden", "Log in" !== e), this.$modal.find(".field-container input").val(""), i.modalTitle = null
            }, this.subscribe("nyt:modal-show-login-modal", l)
        },
        handleDomReady: function () {
            this.render()
        },
        render: function () {
            this.logInModal = new s(this.modalSettings).addToPage(), this.setElement(this.logInModal.$modal), this.local(this, "nyt:modal-login-modal-rendered"), this.addOauthEvents(this.modalSettings.id)
        },
        handleOpen: function (e) {
            e && e.modalTitle && (this.modalTitle = e.modalTitle), this.logInModal && this.logInModal.open()
        },
        handleUserReady: function () {
            n.isLoggedIn() && (this.logInModal ? (this.logInModal.removeFromPage(), this.remove()) : this.subscribeOnce(this, "nyt:modal-login-modal-rendered", this.handleUserReady))
        },
        handleRegisterClick: function () {
            this.logInModal.close(), this.trackingTrigger("loginmodal-register-click", {
                module: "Registration",
                action: "Click",
                "WT.z_ract": "Regnow"
            })
        }
    }));
    return d
}), define("shared/account/views/registration-modal", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "shared/modal/views/modal", "shared/account/templates", "foundation/hosts", "shared/account/helpers/account-modal-mixin", "foundation/lib/polyfills/placeholder"], function (e, t, i, n, s, a, o, r) {
    "use strict";
    var l = i.extend(t.extend({}, o, {
        events: {
            "click .login-modal-trigger": "handleLoginClick",
            "click #register-send-button": "handleFormButton",
            "submit #registration-form": "handleFormSubmit",
            "click .clear-button": "handleClearButton",
            "keyup .text": "handleKeyUp"
        },
        defaultSettings: {
            id: "registration-modal",
            addlClasses: "account-modal",
            headerContent: s.accountModalHeader(),
            modalContent: "",
            modalFooter: s.registrationModalFooter(),
            modalTitle: "Sign up",
            oauthButtonText: "Sign up",
            binding: ".registration-modal-trigger",
            tailDirection: "fixed",
            hasCloseButton: !0,
            hasOverlay: !0,
            tailLeftOffset: -40,
            tailTopOffset: -40
        },
        initialize: function (e) {
            var i = this;
            this.modalSettings = t.extend({}, this.defaultSettings, e), this.modalSettings.modalContent = s.registrationModalContent({
                oauthButtons: this.renderOauthButtons(),
                regiUrl: a.myaccount + "/register?" + this.getPageUrlParams()
            }), this.modalSettings.openCallback = function () {
                i.hasPlaceholderSupport && this.$modal.find(".register-email").focus(), this.$modal.find(".field-container input").val("")
            }, this.subscribe("nyt:modal-show-registration-modal", r)
        },
        handleDomReady: function () {
            this.render()
        },
        render: function () {
            this.registrationModal = new n(this.modalSettings).addToPage(), this.setElement(this.registrationModal.$modal), this.addOauthEvents(this.modalSettings.id)
        },
        handleLoginClick: function () {
            this.registrationModal.close()
        }
    }));
    return l
}), define("shared/account/instances/account", ["shared/account/views/login-modal", "shared/account/views/registration-modal", "foundation/models/user-data"], function (e, t, i) {
    "use strict";
    i.isLoggedIn() || (new e, new t)
}), define("shared/navigation/templates", ["underscore/nyt"], function (_) {
    var templates = {};
    return templates.mainPanel = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) {
            __p += '<div class="sections">\n';
            var count = 1;
            __p += "\n", _.each(level1, function (e) {
                __p += '\n<div class="section ' + (null == (__t = isVisible(e[0], count) === !1 ? "hidden" : "") ? "" : __t) + '">\n<ul class="menu" role="menubar">\n', _.each(e, function (e) {
                    __p += "\n" + (null == (__t = liTemplate({
                        model: e,
                        isVisible: isVisible(e, count)
                    })) ? "" : __t) + "\n", count += iterateTemplateCount(e), __p += "\n"
                }), __p += "\n", count += 1, __p += "\n</ul>\n</div>\n"
            }), __p += "\n</div>"
        }
        return __p
    }, templates.menuItem = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<li role="presentation" class="' + (null == (__t = isVisible === !1 ? "hidden" : "menuitem-visible") ? "" : __t) + '">\n<a id="navId-' + (null == (__t = model.getTaxonomyId()) ? "" : __t) + '"\nclass="' + (null == (__t = model.getEdition()) ? "" : __t) + " " + (null == (__t = model.hasChildren() ? "expandable" : "") ? "" : __t) + '"\nrole="menuitem" ' + (null == (__t = model.getPath() ? ' href="' + model.getPath() + '"' : ' tabindex="0"') ? "" : __t) + "\n" + (null == (__t = model.hasChildren() ? ' aria-haspopup="true" aria-expanded="false"' : "") ? "" : __t) + ">\n" + (null == (__t = model.get("name")) ? "" : __t) + "\n", model.hasChildren() && (__p += '\n<div class="arrow arrow-right">\n<div class="arrow-conceal"></div>\n</div>\n', model.getLevel() > 1 && (__p += '\n<div class="arrow arrow-left">\n<div class="arrow-conceal"></div>\n</div>\n'), __p += "\n"), __p += "\n</a>\n</li>";
        return __p
    }, templates.miniNavStarterCollection = function (obj) {
        {
            var __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<nav id="mini-navigation" class="mini-navigation">\n<ul class="mini-navigation-menu">\n<li class="shortcuts-9A43D8FC-F4CF-44D9-9B34-138D30468F8F ">\n<a href="http://www.nytimes.com/pages/world/index.html">World</a>\n</li>\n<li class="shortcuts-23FD6C8B-62D5-4CEA-A331-6C2A9A1223BE ">\n<a href="http://www.nytimes.com/pages/national/index.html">U.S.</a>\n</li>\n<li class="shortcuts-80E6DEE6-87E4-4AD0-9152-14FA6B07E5AB ">\n<a href="http://www.nytimes.com/pages/politics/index.html">Politics</a>\n</li>\n<li class="shortcuts-C4DC8C0C-E148-4201-BF10-82F1C903DBFB ">\n<a href="http://www.nytimes.com/pages/nyregion/index.html">New York</a>\n</li>\n<li class="shortcuts-104D1E63-9701-497B-8CF4-A4D120C9014E domestic">\n<a href="http://www.nytimes.com/pages/business/index.html">Business</a>\n</li>\n<li class="shortcuts-A257D89A-0D3C-40AF-9C34-1A25A7947D94 international">\n<a href="http://www.nytimes.com/pages/business/international/index.html">Business</a>\n</li>\n<li class="shortcuts-AD8090D7-4137-4D71-84C8-70DA3BD89778 domestic">\n<a href="http://www.nytimes.com/pages/opinion/index.html">Opinion</a>\n</li>\n<li class="shortcuts-09736473-CB3F-4B2F-9772-3AF128ABE12D international">\n<a href="http://www.nytimes.com/pages/opinion/international/index.html">Opinion</a>\n</li>\n<li class="shortcuts-78FBAD45-31A9-4EC7-B172-7D62A2B9955E ">\n<a href="http://www.nytimes.com/pages/technology/index.html">Technology</a>\n</li>\n<li class="shortcuts-A4B35924-DB6C-4EA3-997D-450810F4FEE6 ">\n<a href="http://www.nytimes.com/pages/science/index.html">Science</a>\n</li>\n<li class="shortcuts-7D6BE1AF-8CD8-430B-8B2A-17CD0EAA99AC ">\n<a href="http://www.nytimes.com/pages/health/index.html">Health</a>\n</li>\n<li class="shortcuts-DE2B278B-2783-4506-AAD5-C15A5BB6DA1A domestic">\n<a href="http://www.nytimes.com/pages/sports/index.html">Sports</a>\n</li>\n<li class="shortcuts-BE66F420-C51B-461D-B487-CACF62E94AAE international">\n<a href="http://www.nytimes.com/pages/sports/international/index.html">Sports</a>\n</li>\n<li class="shortcuts-C5BFA7D5-359C-427B-90E6-6B7245A6CDD8 domestic">\n<a href="http://www.nytimes.com/pages/arts/index.html">Arts</a>\n</li>\n<li class="shortcuts-0202D0E4-C59B-479A-BD42-6F1766459781 international">\n<a href="http://www.nytimes.com/pages/arts/international/index.html">Arts</a>\n</li>\n<li class="shortcuts-B3DFBD82-F298-43B3-9458-219B4F6AA2A5 domestic">\n<a href="http://www.nytimes.com/pages/fashion/index.html">Style</a>\n</li>\n<li class="shortcuts-CC9E2674-F6C4-4A39-813B-F5AB0C515CEA international">\n<a href="http://www.nytimes.com/pages/style/international/index.html">Style</a>\n</li>\n<li class="shortcuts-D9C94A2B-0364-4D25-8383-592CC66F82D4 domestic">\n<a href="http://www.nytimes.com/pages/dining/index.html">Food</a>\n</li>\n<li class="shortcuts-FDEFB811-B483-4C3D-A25A-FD07BE5EAD96 international">\n<a href="http://www.nytimes.com/pages/dining/international/index.html">Food</a>\n</li>\n<li class="shortcuts-C0F299AE-E387-4216-9614-0087FC98DC40">\n<a href="http://www.nytimes.com/pages/garden/index.html">Home</a>\n</li>\n<li class="shortcuts-FDA10AC4-4738-4099-91E8-15584765C8D7">\n<a href="http://www.nytimes.com/pages/travel/index.html">Travel</a>\n</li>\n<li class="shortcuts-E57A148E-0CB9-4C02-966D-28B119710151">\n<a href="http://www.nytimes.com/pages/magazine/index.html">Magazine</a>\n</li>\n<li class="shortcuts-92720057-BCB6-4BDB-9351-12F29393259F">\n<a href="http://www.nytimes.com/pages/realestate/index.html">Real Estate</a>\n</li>\n<li>\n<button class="button all-sections-button">all</button>\n</li>\n</ul>\n</nav>';
        return __p
    }, templates.mobileNav = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<section class="edition-navigation">\n<h2 class="section-heading visually-hidden">Navigation Section</h2>\n<ul class="menu">\n<li class="' + (null == (__t = "global" !== pageManager.getEdition() ? "active" : "") ? "" : __t) + '"><a href="http://mobile.nytimes.com/"><span>U.S. Edition</span></a></li>\n</ul>\n<ul class="menu">\n<li class="' + (null == (__t = "global" === pageManager.getEdition() ? "active" : "") ? "" : __t) + '"><a href="http://mobile.nytimes.com/international/"><span>International Edition</span></a></li>\n</ul>\n</section>\n<section class="primary-navigation">\n<h2 class="section-heading visually-hidden">Navigation Section</h2>\n<ul class="menu">\n<li><a href="http://mobile.nytimes.com/"><span>Home</span></a></li>\n<li><a href="http://mobile.nytimes.com/world/"><span>World</span></a></li>\n<li><a href="http://mobile.nytimes.com/national/"><span>U.S.</span></a></li>\n<li><a href="http://mobile.nytimes.com/politics/"><span>Politics</span></a></li>\n<li><a href="http://mobile.nytimes.com/nyregion/"><span>N.Y. / Region</span></a></li>\n<li><a href="http://mobile.nytimes.com/business/"><span>Business Day</span></a></li>\n<li><a href="http://mobile.nytimes.com/technology/"><span>Technology</span></a></li>\n<li><a href="http://mobile.nytimes.com/sports/"><span>Sports</span></a></li>\n</ul>\n<ul class="menu">\n<li><a href="http://mobile.nytimes.com/opinion/"><span>Opinion</span></a></li>\n<li><a href="http://mobile.nytimes.com/science/"><span>Science</span></a></li>\n<li><a href="http://mobile.nytimes.com/health/"><span>Health</span></a></li>\n<li><a href="http://mobile.nytimes.com/arts/"><span>Arts</span></a></li>\n<li><a href="http://mobile.nytimes.com/style/"><span>Style</span></a></li>\n<li><a href="http://mobile.nytimes.com/photos/"><span>Photos</span></a></li>\n<li><a href="http://mobile.nytimes.com/video/"><span>Video</span></a></li>\n<li><a href="http://mobile.nytimes.com/most-emailed/"><span>Most Emailed</span></a></li>\n</ul>\n</section>\n<section class="secondary-navigation">\n<h2 class="section-heading visually-hidden">Navigation Section</h2>\n<ul class="menu">\n<li><a href="http://mobile.nytimes.com/automobiles/"><span>Automobiles</span></a></li>\n<li><a href="http://mobile.nytimes.com/blogs/"><span>Blogs</span></a></li>\n<li><a href="http://mobile.nytimes.com/books/"><span>Books</span></a></li>\n<li><a href="http://mobile.nytimes.com/dining/"><span>Dining &amp; Wine</span></a></li>\n<li><a href="http://mobile.nytimes.com/education/"><span>Education</span></a></li>\n<li><a href="http://mobile.nytimes.com/garden/"><span>Home &amp; Garden</span></a></li>\n<li><a href="http://mobile.nytimes.com/magazine/"><span>Magazine</span></a></li>\n<li><a href="http://mobile.nytimes.com/movies/"><span>Movies</span></a></li>\n<li><a href="http://mobile.nytimes.com/music/"><span>Music</span></a></li>\n<li><a href="http://mobile.nytimes.com/business/media/"><span>Media &amp; Advertising</span></a></li>\n<li><a href="http://mobile.nytimes.com/obituaries/"><span>Obituaries</span></a></li>\n</ul>\n<ul class="menu">\n<li><a href="http://mobile.nytimes.com/publiceditor/"><span>Public Editor</span></a></li>\n<li><a href="http://mobile.nytimes.com/realestate/"><span>Real Estate</span></a></li>\n<li><a href="http://mobile.nytimes.com/opinion/sundayreview/"><span>Sunday Review</span></a></li>\n<li><a href="http://mobile.nytimes.com/tmagazine/"><span>T Magazine</span></a></li>\n<li><a href="http://mobile.nytimes.com/television/"><span>Television</span></a></li>\n<li><a href="http://mobile.nytimes.com/theater/"><span>Theater</span></a></li>\n<li><a href="http://mobile.nytimes.com/timeswire/"><span>Times Wire</span></a></li>\n<li><a href="http://mobile.nytimes.com/travel/"><span>Travel</span></a></li>\n<li><a href="http://mobile.nytimes.com/weddings/"><span>Weddings / Celebrations</span></a></li>\n<li><a href="http://mobile.nytimes.com/corrections/"><span>Corrections</span></a></li>\n</ul>\n</section>\n<section class="tertiary-navigation">\n<h2 class="section-heading visually-hidden">Navigation Section</h2>\n<ul class="menu">\n<li><a href="http://mobile.nytimes.com/recommendations/"><span>Recommendations</span></a></li>\n</ul>\n<ul class="menu">\n<li><a href="http://mobile.nytimes.com/saved/"><span>Saved</span></a></li>\n</ul>\n</section>\n<section class="settings ' + (null == (__t = userData.isLoggedIn() ? "" : "hidden") ? "" : __t) + '">\n<h2 class="section-heading visually-hidden">Navigation Section</h2>\n<ul class="menu">\n<li><span class="label">Account:</span> ' + (null == (__t = userData.getUserName()) ? "" : __t) + '</li>\n</ul>\n</section>\n<section class="logout ' + (null == (__t = userData.isLoggedIn() ? "" : "hidden") ? "" : __t) + '">\n<h2 class="section-heading visually-hidden">Navigation Section</h2>\n<ul class="menu">\n<li><a href="http://mobile.nytimes.com/logout"><span>Log out</span></a></li>\n</ul>\n</section>\n<section class="account ' + (null == (__t = userData.isLoggedIn() ? "hidden" : "") ? "" : __t) + '">\n<h2 class="section-heading visually-hidden">Navigation Section</h2>\n<ul class="menu">\n<li><a href="http://www.nytimes.com/mowweb/ftnotlog"><span>Subscribe</span></a></li>\n</ul>\n<ul class="menu">\n<li><a href="https://myaccount.nytimes.com/mobile/login/smart/index.html?EXIT_URI=' + (null == (__t = encodeURIComponent(window.location)) ? "" : __t) + '"><span>Log In</span></a></li>\n</ul>\n</section>';
        return __p
    }, templates.navigationModalContent = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<div class="secondary-container">\n' + (null == (__t = secondary) ? "" : __t) + '\n</div>\n<div class="tertiary-container">\n' + (null == (__t = tertiary) ? "" : __t) + "\n</div>";
        return __p
    }, templates.secondaryPanel = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) {
            __p += '<div class="secondary-container">\n<div class="header">\n<h5 class="section-heading"><a href="" role="menuitem"></a></h5>\n</div>\n';
            var count = 1;
            __p += "", _.each(level2, function (e) {
                __p += '\n<div class="section" data-parent="navId-' + (null == (__t = e[0].getParentId()) ? "" : __t) + '">\n<ul class="secondary" role="menu">\n', _.each(e, function (e) {
                    __p += "\n" + (null == (__t = liTemplate({
                        model: e,
                        isVisible: !0
                    })) ? "" : __t) + "\n"
                }), __p += "\n</ul>\n</div><!-- close secondary " + (null == (__t = e[0].getParentId()) ? "" : __t) + " sections -->\n"
            }), __p += "", _.each(level1, function (e) {
                __p += '\n<div class="section section-more ' + (null == (__t = isVisible(e[0], count, !0) === !1 ? "hidden" : "") ? "" : __t) + '"  data-parent="navId-more-section">\n<ul class="secondary" role="menu">\n', _.each(e, function (e) {
                    __p += "\n" + (null == (__t = liTemplate({
                        model: e,
                        isVisible: isVisible(e, count, !0)
                    })) ? "" : __t) + "\n", count += iterateTemplateCount(e), __p += "\n"
                }), __p += "\n", count += 1, __p += "\n</ul>\n</div>\n"
            }), __p += "</div><!-- close secondary modal -->"
        }
        return __p
    }, templates.tertiaryPanel = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<div class="header">\n<h5 class="section-heading"><a href="" role="menuitem"></a></h5>\n</div>\n', _.each(level3, function (e) {
            __p += '\n<ul class="tertiary" data-parent="navId-' + (null == (__t = e[0].getParentId()) ? "" : __t) + '" role="menu">\n', _.each(e, function (e) {
                __p += "\n" + (null == (__t = liTemplate({
                    model: e,
                    isVisible: !0
                })) ? "" : __t) + "\n"
            }), __p += "\n</ul>\n"
        }), __p += "";
        return __p
    }, templates
}), define("shared/data/models/section", ["backbone/nyt"], function (e) {
    "use strict";
    var t = e.Model.extend({
        defaults: {
            name: "",
            edition: "",
            className: "",
            path: "",
            show_in_nav: !0,
            hasSubsections: !1,
            level: 1,
            taxonomyId: ""
        },
        getTaxonomyId: function () {
            return this.get("taxonomyId")
        },
        getParentId: function () {
            return this.get("parent")
        },
        getEdition: function () {
            var e = this.get("edition");
            return "global" === e ? "international" : e
        },
        hasChildren: function () {
            return this.get("hasSubsections")
        },
        getPath: function () {
            return this.get("path")
        },
        getLevel: function () {
            return this.get("level")
        }
    });
    return t
}), define("shared/data/collections/taxonomy", ["backbone/nyt", "underscore/nyt", "foundation/collections/base-collection", "shared/data/models/section", "foundation/hosts", "foundation/models/user-data"], function (e, t, i, n, s) {
    "use strict";
    var a = i.extend({
        url: s.json + "/services/json/taxonomy/v2/flat.jsonp",
        model: n,
        sectionMarkers: ["C5BFA7D5-359C-427B-90E6-6B7245A6CDD8", "5C13EEDD-D905-4D8C-A284-6859EA434563", "8FB1308A-FFE4-4BED-ADF6-659A680D0884", "6101A43A-8BDE-45FF-AAD5-EF7396F83AC9", "FED853D9-D192-46F6-8D18-447803EB4A7B"],
        initialize: function () {
            this.editionString = "us" === this.pageManager.getEdition() ? "domestic" : "global", this.level1 = [], this.level2 = [], this.level3 = [], this.fetch()
        },
        sync: function (t, i, n) {
            return n.dataType = "jsonp", n.jsonpCallback = "jsonTaxonomyCallback", n.cache = !0, e.sync(t, i, n)
        },
        parse: function (i) {
            var s, a, o, r = 0,
                l = new e.Collection,
                d = t.map(i.elements, function (e) {
                    return e.taxonomyId = e.id, e.id = r++, e
                });
            for (l.model = n, l.reset(d), s = l.where({
                parent: null
            }), a = 0, r = 0, o = s.length; o > r; r += 1) t.indexOf(this.sectionMarkers, s[r].get("taxonomyId")) >= 0 && (this.levelData(l, s.slice(a, r), 0), a = r);
            return this.levelData(l, s.slice(a, s.length), 0), this.level1.push([new n({
                name: "More",
                taxonomyId: "more-section",
                hasSubsections: !0
            })]), l.toJSON()
        },
        levelData: function (e, i, n) {
            var s, a, o, r, l, d, c;
            if (t.isArray(i))
                for (this["level" + (n + 1)].push(i), s = 0, a = i.length; a > s; s += 1) this.levelData(e, i[s], n + 1);
            else 3 > n && (c = e.where({
                taxonomyId: i.get("taxonomyId")
            }).length > 1, o = e.where({
                parent: i.get("taxonomyId"),
                show_in_nav: !0
            }), c && (o = t.uniq(o, function (e) {
                return e.get("taxonomyId")
            }))), r = o && o.length > 0, i.set("className", i.get("name").replace(/[^a-zA-Z0-9]/g, "").toLowerCase()), i.set("hasSubsections", r), i.set("level", n), l = i.get("alternate_editions"), l && l[this.editionString] && (d = e.findWhere({
                taxonomyId: l[this.editionString]
            }), i.set("editionName", d.get("name")), i.set("editionPath", d.get("path"))), r && this.levelData(e, o, n)
        },
        getPrimarySections: function () {
            return this.level1
        },
        getSecondarySections: function () {
            return this.level2
        },
        getTertiarySections: function () {
            return this.level3
        },
        getSectionByKeyword: function (e) {
            return this.find(function (t) {
                var i = t.get("path") || "";
                return i.indexOf("/" + e + "/index.html") > 0
            })
        }
    });
    return a
}), define("shared/data/instances/taxonomy", ["shared/data/collections/taxonomy"], function (e) {
    "use strict";
    return new e
}), define("shared/navigation/views/navigation", ["module", "jquery/nyt", "underscore/nyt", "foundation/views/base-view", "foundation/views/page-manager", "foundation/hosts", "foundation/models/user-data", "shared/modal/views/modal", "shared/navigation/templates", "shared/data/instances/taxonomy"], function (e, t, i, n, s, a, o, r, l, d) {
    "use strict";
    var c = n.registerView("navigation").extend({
        module: e,
        el: "#navigation",
        navTemplate: l.navigation,
        modalTemplate: l.navigationModalContent,
        events: {
            mouseleave: "delayedClose",
            mouseenter: "cancelDelayedClose",
            "mouseenter li a": "tryPrimaryHover",
            "mouseleave li a.expandable": "delayedModalClose",
            "click li a": "activatePrimaryItem",
            "click .menu a[href]": "handlePrimaryNavigationClick"
        },
        nytEvents: {
            "nyt:masthead-section-click": "toggle",
            "nyt:navigation-toggle-ready": "toggle",
            "nyt:navigation-edge-click": "open",
            "nyt:navigation-edge-mouse-enter": "delayedOpen",
            "nyt:navigation-edge-mouse-leave": "cancelDelayedOpen",
            "nyt:messaging-critical-alerts-move-furniture": "moveNav",
            "nyt:messaging-suggestions-move-furniture": "moveNav",
            "nyt:a11y-enabled": "enableA11Nav",
            "nyt:a11y-disabled": "disableA11yNav"
        },
        defaultSettings: {
            panelwidth: 210,
            navTimeout: 500,
            navAnimation: 150,
            hoverTimeout: 500,
            intentRangeLower: 10,
            intentRangeUpper: 170,
            maxMouseLocs: 2,
            a11yEnabled: !1
        },
        modalSettings: {
            id: "navigation-modal",
            modalTitle: "",
            modalContent: "",
            tailDirection: "left-top",
            closeOnClick: !1,
            fixedOverride: !0,
            autoPosition: !0,
            positionTailSide: !0,
            toggleSpeed: 1
        },
        mouseLocs: [],
        navIds: {
            REAL_ESTATE: "navId-92720057-BCB6-4BDB-9351-12F29393259F",
            OPINION_DOMESTIC: "navId-09736473-CB3F-4B2F-9772-3AF128ABE12D",
            OPINION_INTERNATIONAL: "navId-AD8090D7-4137-4D71-84C8-70DA3BD89778",
            MORE: "navId-more-section"
        },
        navLevels: {
            PRIMARY: 1,
            SECONDARY: 2,
            TERTIARY: 3
        },
        initialize: function (e) {
            i.bindAll(this, "tryPrimaryHover", "trySecondaryHover", "open", "close", "render", "saveMousePosition", "delayedOpen", "delayedClose", "cancelDelayedOpen", "cancelDelayedClose", "delayedModalOpen", "delayedModalClose", "cancelDelayedModalOpen", "cancelDelayedModalClose", "delayedPrimaryHover", "cancelDelayedPrimaryHover", "delayedSecondaryHover", "cancelDelayedSecondaryHover", "handleClickClose", "handleTapClose", "detectFalsePositive", "isNavItemVisible", "iterateTemplateCount"), this.settings = i.extend({}, this.defaultSettings, e), this.singlePanelWidth = this.settings.panelwidth + "px", this.singlePanelPartlyShut = this.settings.panelwidth - 20 + "px", this.isNavAnimating = !1, this.timer = {}, d.length > 0 ? this.render() : this.subscribeOnce(d, "sync", this.render), this.$document.on("click", "#navigation-modal a[href]", i.bind(this.handleModalClick, this)), this.trackingBaseData = {
                module: "SectionsNav",
                action: "click",
                version: "BrowseTree",
                region: "TopBar"
            }
        },
        handleUserReady: function () {
            this.updateCrosswordSubscriptionLink()
        },
        updateCrosswordSubscriptionLink: function () {
            var e = o.isTabletSubscriber(),
                i = o.isSmartphoneSubscriber(),
                n = o.isHomeDeliverySubscriber(),
                s = o.isPremierSubscriber(),
                r = o.isOpinionSubscriber(),
                l = o.isNytNowSubscriber(),
                d = o.isCrosswordsSubscriber(),
                c = a.www + "/subscriptions/games/lp8J6KQ.html?campaignId=49W96",
                h = a.www + "/subscriptions/games/lp897H9.html?campaignId=49W8Y";
            (e || i || n || s || r || l) && !d ? t("#nyt-crossword").attr("href", c) : d || t("#nyt-crossword").attr("href", h)
        },
        handlePrimaryNavigationClick: function (e) {
            var i = t(e.currentTarget),
                n = this.trackingAppendParams(i.attr("href"), {
                    contentCollection: t.trim(i.text())
                });
            i.attr("href", n)
        },
        handleModalClick: function (e) {
            var i = t(e.currentTarget),
                n = t.trim(t("#navigation-modal").find(".secondary-container .header").text()),
                s = this.trackingAppendParams(i.attr("href"), {
                    contentCollection: n + "/" + t.trim(i.text()),
                    contentPlacement: i.closest("ul").hasClass("secondary") ? 2 : 3
                });
            i.attr("href", s)
        },
        moveNav: function (e) {
            e(this.$el)
        },
        render: function () {
            var e, t, n, s = this,
                a = this.$body.find(".navigation-modal");
            this.navItemsInView = 23, this.$el.html(l.mainPanel({
                level1: d.getPrimarySections(),
                liTemplate: l.menuItem,
                isVisible: this.isNavItemVisible,
                iterateTemplateCount: this.iterateTemplateCount
            })), e = l.secondaryPanel({
                level1: i.initial(d.getPrimarySections()),
                level2: d.getSecondarySections(),
                liTemplate: l.menuItem,
                isVisible: this.isNavItemVisible,
                iterateTemplateCount: this.iterateTemplateCount
            }), t = l.tertiaryPanel({
                level3: d.getTertiarySections(),
                liTemplate: l.menuItem
            }), a.eq(0).remove(), this.modalSettings.modalContent = l.navigationModalContent({
                secondary: e,
                tertiary: t
            }), this.navigationModal = new r(this.modalSettings), this.navigationModal.addToPage(), this.navigationModal.$modal.on("mouseover", ".secondary li a", s.trySecondaryHover).on("click", ".secondary li a.expandable", s.activateSecondaryItem).on("mouseenter", ".tertiary-container", s.cancelDelayedSecondaryHover).on("mouseenter", function () {
                s.cancelDelayedClose(), s.cancelDelayedModalClose(), s.cancelDelayedPrimaryHover()
            }).on("mouseleave", function () {
                s.delayedClose(), s.delayedModalClose()
            }), this.navigationModal.$modal.find(".secondary-container .hidden .menuitem-visible").eq(0).closest(".section").removeClass("hidden"), n = this.navigationModal.$modal.find(".section-more"), this.moreInModalHeight = 25 * n.find(".menuitem-visible").length + 30 * n.not(".hidden").length + 45
        },
        isNavItemVisible: function (e, t, i) {
            return i ? t > this.navItemsInView && "more-section" !== e.getTaxonomyId() : t <= this.navItemsInView || "more-section" === e.getTaxonomyId()
        },
        iterateTemplateCount: function (e) {
            var t = "global" === this.pageManager.getEdition() ? "international" : "domestic";
            return e.getEdition() && t !== e.getEdition() ? 0 : 1
        },
        toggle: function () {
            this.$el.hasClass("active") ? this.close() : this.open()
        },
        open: function () {
            var e = this,
                t = {
                    width: e.singlePanelPartlyShut,
                    display: "block",
                    opacity: "0"
                },
                i = {
                    width: e.singlePanelWidth,
                    opacity: "1"
                };
            this.isNavAnimating || this.$el.hasClass("active") !== !1 || (this.$el.css(t), this.$el.toggleClass("active"), this.$html.toggleClass("navigation-active"), this.isNavAnimating = !0, this.$el.animate(i, this.settings.navAnimation, function () {
                e.isNavAnimating = !1, e.$body.on("click", e.handleTapClose)
            }), this.pageManager.isMobile() && this.$body.css("cursor", "pointer"), this.settings.a11yEnabled && this.toggleFocusEvents(!0), this.broadcast("nyt:navigation-opened", this), this.$document.on("mousemove", this.saveMousePosition))
        },
        close: function () {
            var e, t, i;
            this.isNavAnimating || this.$el.hasClass("active") !== !0 || (e = this, t = this.$el.css("marginTop"), i = {
                width: this.singlePanelPartlyShut,
                opacity: "0"
            }, this.navigationModal.close(), this.resetNav(this.navLevels.SECONDARY), this.isNavAnimating = !0, this.$el.animate(i, this.settings.navAnimation, function () {
                e.$el.toggleClass("active"), e.$html.toggleClass("navigation-active"), e.$body.off("click", e.handleClickClose), e.$body.off("click", e.handleTapClose), e.$el.removeAttr("style"), e.$el.css("marginTop", t), e.$el.find("a").removeClass("active"), e.isNavAnimating = !1
            }), this.pageManager.isMobile() && this.$body.css("cursor", ""), this.settings.a11yEnabled && this.toggleFocusEvents(!1), this.broadcast("nyt:navigation-closed", this), this.$document.off("mousemove", this.saveMousePosition))
        },
        resetNav: function (e) {
            var t = this.navigationModal.$modal;
            e === this.navLevels.SECONDARY && t.find(".section").removeClass("active"), t.find(".secondary a").removeClass("active"), t.find(".tertiary").removeClass("active"), t.find(".modal-content").removeClass("expanded"), t.find(".section-heading a").removeClass("active")
        },
        activatePrimaryItem: function (e) {
            var i, n, s, a, o, r, l = t(e.target).closest("a");
            e.stopPropagation(), l.hasClass("active") || this.isNavAnimating !== !1 || (l.hasClass("expandable") ? (i = this.navigationModal, n = i.$modal.find('[data-parent="' + l.attr("id") + '"]').find("li").length, s = 55, a = 29 * n, o = a + s, l.attr("id") === this.navIds.REAL_ESTATE ? o = 200 : l.attr("id") === this.navIds.MORE ? o = this.moreInModalHeight || 553 : (l.attr("id") === this.navIds.OPINION_DOMESTIC || l.attr("id") === this.navIds.OPINION_INTERNATIONAL) && (o = 357), this.cancelDelayedModalClose(), this.resetNav(this.navLevels.SECONDARY), i.$modal.height(o), e.currentTarget = e.target, i.open(e), this.moveModalArrow(), this.$el.find("a").removeClass("active").attr("aria-expanded", "false"), l.addClass("active").attr("aria-expanded", "true"), i.$modal.find(".secondary").removeClass("active"), r = i.$modal.find(".secondary-container .section-heading"), this.setHeadingText(l, r), i.$modal.find('[data-parent="' + l.attr("id") + '"]').addClass("active"), this.broadcast("nyt:navigation-level-one-open", i.$modal)) : this.modalClose())
        },
        setHeadingText: function (e, t) {
            t.html(e.attr("href") ? '<a href="' + e.attr("href") + '" tabinxdex="0" role="menuitem" class="active">' + e.text() + "</a>" : e.text())
        },
        moveModalArrow: function () {
            var e, i, n, s = this.navigationModal.$modal,
                a = 12,
                o = 18,
                r = 39,
                l = this.settings.panelwidth - 10;
            t("html").hasClass("viewport-large-70") && (l += t("#navigation-edge").width()), s.css("left", l + "px"), e = s.find(".modal-pointer"), e.hasClass("modal-pointer-left") ? (i = Math.floor(s.outerHeight() / 2) - o, e.css("top", i + "px")) : e.hasClass("modal-pointer-left-top") ? e.css("top", a, "px") : e.hasClass("modal-pointer-left-bottom") && (n = s.outerHeight() - r, e.css("top", n + "px"))
        },
        activateSecondaryItem: function (e) {
            var i, n, s = t(e.target).closest("a");
            s.hasClass("active") || this.isNavAnimating !== !1 || (e.preventDefault(), i = this.navigationModal.$modal, s.hasClass("expandable") ? (this.resetNav(this.navLevels.TERTIARY), i.find(".modal-content").addClass("expanded"), n = i.find(".tertiary-container .section-heading"), this.setHeadingText(s, n), i.find('[data-parent="' + s.attr("id") + '"]').eq(0).addClass("active"), s.addClass("active").attr("aria-expanded", "true"), this.broadcast("nyt:navigation-level-two-open", i.find(".tertiary-container"))) : (this.resetNav(this.navLevels.TERTIARY), s.addClass("active")))
        },
        tryPrimaryHover: function (e) {
            var i, n = t(e.target).closest("a"),
                s = n.hasClass("expandable");
            this.cancelDelayedClose(), s && this.cancelDelayedModalClose(), this.cancelDelayedPrimaryHover(), this.$el.find("li a.active").length > 0 ? (i = this.getAngle(this.mouseLocs[0], this.mouseLocs[1]), i > this.defaultSettings.intentRangeLower && i < this.defaultSettings.intentRangeUpper ? this.delayedPrimaryHover(e) : this.activatePrimaryItem(e)) : this.activatePrimaryItem(e)
        },
        trySecondaryHover: function (e) {
            var t;
            this.cancelDelayedClose(), this.cancelDelayedModalClose(), this.cancelDelayedSecondaryHover(), this.navigationModal.$modal.find(".modal-content").hasClass("expanded") ? (t = this.getAngle(this.mouseLocs[0], this.mouseLocs[1]), t > this.defaultSettings.intentRangeLower && t < this.defaultSettings.intentRangeUpper ? this.delayedSecondaryHover(e) : this.activateSecondaryItem(e)) : this.activateSecondaryItem(e)
        },
        getAngle: function (e, t) {
            var i, n, s, a, o, r, l;
            return e && t ? (i = e.x, n = e.y, s = t.x, a = t.y, o = s - i, r = a - n, l = Math.round(180 * Math.atan2(o, r) / Math.PI * 10) / 10) : null
        },
        delayedOpen: function () {
            this.timer.navOpen = window.setTimeout(this.open, this.defaultSettings.navTimeout)
        },
        delayedClose: function () {
            this.timer.navClose = window.setTimeout(this.close, this.defaultSettings.navTimeout)
        },
        cancelDelayedOpen: function () {
            window.clearTimeout(this.timer.navOpen)
        },
        cancelDelayedClose: function () {
            window.clearTimeout(this.timer.navClose)
        },
        delayedModalOpen: function () {
            this.timer.modalOpen = window.setTimeout(this.navigationModal.open, this.defaultSettings.navTimeout)
        },
        delayedModalClose: function () {
            var e = this;
            this.cancelDelayedPrimaryHover(), this.cancelDelayedSecondaryHover(), this.timer.modalClose = window.setTimeout(function () {
                e.modalClose()
            }, this.defaultSettings.navTimeout)
        },
        modalClose: function () {
            this.$el.find("a").removeClass("active"), this.navigationModal.close()
        },
        cancelDelayedModalOpen: function () {
            window.clearTimeout(this.timer.modalOpen)
        },
        cancelDelayedModalClose: function () {
            window.clearTimeout(this.timer.modalClose)
        },
        delayedPrimaryHover: function (e) {
            var t = this;
            t.timer.primaryHoverIntent = window.setTimeout(function () {
                t.activatePrimaryItem(e)
            }, this.defaultSettings.hoverTimeout)
        },
        cancelDelayedPrimaryHover: function () {
            window.clearTimeout(this.timer.primaryHoverIntent)
        },
        delayedSecondaryHover: function (e) {
            var t = this;
            t.timer.secondaryHoverIntent = window.setTimeout(function () {
                t.activateSecondaryItem(e)
            }, this.defaultSettings.hoverTimeout)
        },
        cancelDelayedSecondaryHover: function () {
            window.clearTimeout(this.timer.secondaryHoverIntent)
        },
        handleClickClose: function (e) {
            0 === t(e.target).closest("#navigation, #navigation-modal").length && this.close()
        },
        handleTapClose: function (e) {
            0 === t(e.target).closest("#navigation, #navigation-modal").length && this.close()
        },
        saveMousePosition: function (e) {
            this.mouseLocs.length > 1 ? (this.mouseLocs[1].x !== e.pageX || this.mouseLocs[1].y !== e.pageY) && (this.mouseLocs.push({
                x: e.pageX,
                y: e.pageY
            }), this.mouseLocs.length > this.defaultSettings.maxMouseLocs && this.mouseLocs.shift()) : this.mouseLocs.push({
                x: e.pageX,
                y: e.pageY
            })
        },
        toggleFocusEvents: function (e) {
            var t = e ? "subscribe" : "stopSubscribing";
            this[t]("nyt:page-key-tab nyt:page-key-up-a11y nyt:page-key-down-a11y", this.handleFocusKey), this[t]("nyt:page-key-esc-a11y nyt:page-key-left-a11y", this.handleCollapseKey), this[t]("nyt:page-key-enter nyt:page-key-right-a11y", this.handleExpandKey), this[t]("nyt:navigation-level-one-open nyt:navigation-level-two-open", this.addFocusableElements), e ? (this.focusableElements = [], this.addFocusableElements(), this.$document.on("mousemove", this.detectFalsePositive)) : delete this.focusableElements
        },
        addFocusableElements: function (e) {
            var t, n;
            this.settings.a11yEnabled && (e && e.length > 0 ? n = ".active a[role=menuitem]:visible, .section-heading a.active[role=menuitem]:visible" : (e = this.$el, n = "a[role=menuitem]:visible, .section-heading a.active[role=menuitem]:visible"), t = e.find(n).toArray(), this.focusableElements.push({
                first: t[0],
                all: t,
                last: i.last(t)
            }), t[0].focus())
        },
        handleFocusKey: function (e) {
            var t = i.last(this.focusableElements),
                n = this.getKeyDirection(e),
                s = document.activeElement;
            if (s === t.last && "forward" === n) t.first.focus();
            else if (s === t.first && "backward" === n) t.last.focus();
            else if ("forward" === n) t.all[i.indexOf(t.all, s) + 1].focus();
            else {
                if ("backward" !== n) return;
                t.all[i.indexOf(t.all, s) - 1].focus()
            }
            e.preventDefault()
        },
        handleCollapseKey: function () {
            var e;
            this.focusableElements.pop(), e = i.last(this.focusableElements), this.focusableElements.length > 1 ? (this.resetNav(this.navLevels.TERTIARY), e.active.focus()) : this.focusableElements.length > 0 ? (this.modalClose(), e.active.focus()) : this.close()
        },
        handleExpandKey: function (e) {
            var n = t(document.activeElement),
                s = i.last(this.focusableElements);
            s.active = n, n.hasClass("expandable") && (e.preventDefault(), n.closest(".secondary").length > 0 ? this.activateSecondaryItem(e) : this.activatePrimaryItem(e))
        },
        detectFalsePositive: i.throttle(function (e) {
            t(e.target).is('a[role="menuitem"], li[role="presentation"') && this.disableA11yNav()
        }, 1e3),
        getKeyDirection: function (e) {
            var t = "",
                i = this.pageManager.KEYS,
                n = e && e.keyCode ? e.keyCode : null;
            switch (n) {
            case i.UP:
            case i.LEFT:
                t = "backward";
                break;
            case i.DOWN:
            case i.RIGHT:
            case i.TAB:
                t = "forward"
            }
            return t
        },
        enableA11Nav: function () {
            this.settings.a11yEnabled = !0
        },
        disableA11yNav: function () {
            this.settings.a11yEnabled = !1, this.toggleFocusEvents(!1), this.$document.off("mousemove", this.detectFalsePositive)
        }
    });
    return c
}), define("shared/navigation/views/navigation-edge-adjust", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view"], function (e, t, i) {
    "use strict";
    var n = i.registerView("navigation").extend({
        el: "#navigation-edge",
        events: {
            mouseenter: "handleMouseOver",
            mouseleave: "handleMouseOut",
            click: "handleClick"
        },
        nytEvents: {
            "nyt:page-breakpoint": "handleBreakPoint"
        },
        initialize: function () {
            this.pageManager.isDomReady() ? this.render() : this.subscribe("nyt:page-ready", this.render)
        },
        render: function () {
            this.$shell = e("#shell"), this.pageManager.getCurrentBreakpoint() >= 10070 && (this.setNavWidth(), this.subscribe("nyt:page-resize", this.setNavWidth))
        },
        setNavWidth: function () {
            var e = this.$shell.offset();
            this.$shell.offset() && (this.broadcast("nyt:navigation-edge-size-change", e.left), this.$el.css("width", e.left))
        },
        handleBreakPoint: function (e) {
            e >= 10070 ? this.subscribe("nyt:page-resize", this.setNavWidth) : (this.stopSubscribing("nyt:page-resize", this.setNavWidth), this.$el.css("width", ""))
        },
        handleMouseOver: function (e) {
            (0 !== e.clientX || 0 !== e.clientY) && this.broadcast("nyt:navigation-edge-mouse-enter", e)
        },
        handleMouseOut: function (e) {
            this.broadcast("nyt:navigation-edge-mouse-leave", e)
        },
        handleClick: function () {
            this.broadcast("nyt:navigation-edge-click")
        }
    });
    return n
}), define("shared/navigation/views/mobile-navigation", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "shared/navigation/views/navigation", "shared/navigation/views/navigation-edge-adjust", "shared/navigation/templates", "foundation/models/user-data"], function (e, t, i, n, s, a, o) {
    "use strict";
    var r = i.registerView("mobile-navigation").extend({
        el: "#mobile-navigation",
        hiddenEl: "#main, #ribbon, #site-index",
        nytEvents: {
            "nyt:masthead-section-click": "handleSectionClick",
            "nyt:page-breakpoint": "handleBreakPoint"
        },
        handleUserReady: function () {
            this.$masthead = e("#masthead").find(".sections-button"), this.render()
        },
        render: function () {
            this.$el.html(a.mobileNav({
                userData: o,
                pageManager: this.pageManager
            }))
        },
        open: function () {
            this.$el.removeClass("hidden"), this.$masthead.addClass("mobile-navigation-active"), this.$el.focus(), e(this.hiddenEl).addClass("hidden"), window.scrollTo(0, 0)
        },
        close: function () {
            this.$el.addClass("hidden"), this.$masthead.removeClass("mobile-navigation-active"), e(this.hiddenEl).removeClass("hidden")
        },
        handleSectionClick: function () {
            this[this.$el.is(":visible") ? "close" : "open"]()
        },
        handleBreakPoint: function (e) {
            e >= 120 && (new n, new s, this.close(), this.remove())
        }
    });
    return r
}), define("shared/navigation/views/site-index-responsive", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view"], function (e, t, i) {
    "use strict";
    var n = i.registerView("navigation").extend({
        events: {
            "click a": "handleSiteIndexClick",
            "click .menu-heading": "handleClick",
            "click .menu-label": "handleClick",
            "keyup .menu-heading": "handleKeyboard"
        },
        nytEvents: {
            "nyt:page-breakpoint": "handleBreakPoint"
        },
        initialize: function () {
            var e = this.$el.find(".column");
            this.$columnHeader = e.find("h3"), this.$columnContents = e.find("ul")
        },
        handleDomReady: function () {
            this.render()
        },
        render: function () {
            this.subscribe("nyt:page-resize", this.setNavWidth), this.handleBreakPoint()
        },
        handleBreakPoint: function () {
            var t, i, n, s;
            this.pageManager.getCurrentBreakpoint() >= 1e3 ? (this.isSmallSiteIndex = !1, t = "removeClass", i = "removeAttr", this.$columnContents[t]("expanded")[t]("collapsed")[i]("aria-expanded", "true")[i]("aria-expanded", "false")) : (this.isSmallSiteIndex = !0, t = "addClass", i = "attr", this.$columnContents[t]("collapsed")[i]("aria-expanded", "true")[i]("aria-expanded", "false")), this.$columnHeader[t]("toggle")[i]("role", "button")[i]("tabindex", "0")[i]("aria-pressed", "true")[i]("aria-pressed", "false"), e.each(this.$columnHeader, function (t, a) {
                s = e(a), n = s.text(), n = n.substr(0, n.indexOf(" ")).toLowerCase(), s[i]("id", n + "-menu-heading")[i]("aria-controls", n + "-menu"), s.siblings("ul")[i]("id", n + "-menu")[i]("aria-labelled-by", n + "-menu-heading")
            })
        },
        handleKeyboard: function (e) {
            (13 === e.keyCode || 32 === e.keyCode) && this.handleClick(e)
        },
        handleClick: function (t) {
            var i, n, s;
            this.isSmallSiteIndex && (n = e(t.target), i = n.nextAll("ul"), s = i.find("a"), i.toggleClass("collapsed"), i.toggleClass("expanded"), "false" === n.attr("aria-pressed") ? (n.attr("aria-pressed", "true"), i.attr("aria-expanded", "true"), s.removeAttr("tabindex", "-1")) : (n.attr("aria-pressed", "false"), i.attr("aria-expanded", "false"), s.attr("tabindex", "-1")))
        },
        handleSiteIndexClick: function (t) {
            var i = e(t.currentTarget),
                n = this.trackingAppendParams(i.attr("href"), {
                    module: "SiteIndex",
                    region: "Footer"
                });
            i.attr("href", n)
        }
    });
    return n
}), define("shared/navigation/instances/navigation", ["jquery/nyt", "foundation/views/page-manager", "shared/navigation/views/navigation", "shared/navigation/views/mobile-navigation", "shared/navigation/views/navigation-edge-adjust", "shared/navigation/views/site-index-responsive"], function (e, t, i, n, s, a) {
    "use strict";
    t.getCurrentBreakpoint() >= 120 ? (new i, new s) : new n, new a({
        el: e("#site-index")
    })
}), define("shared/mediaviewer/templates", ["underscore/nyt"], function (_) {
    var templates = {};
    return templates.bigAd3 = function (obj) {
        {
            var __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<div id="BigAd3" class="ad big-ad3" style="display:none;"></div>';
        return __p
    }, templates.continueButton = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<div class="media-viewer-continue" style="display:none;">\n<span class="continue-text"> ' + (null == (__t = message) ? "" : __t) + ' </span>\n<div class="continue-arrow arrow-right">\n<div class="arrow-conceal"></div>\n</div>\n</div>';
        return __p
    }, templates.image = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<figure class="media-viewer-asset" style="visibility:hidden;">\n<img src="' + (null == (__t = src) ? "" : __t) + '" data-caption="" style="opacity:0;" />\n<nav class="image-navigation previous">\n<span class="visually-hidden">Go to previous slide</span>\n</nav>\n<nav class="image-navigation next">\n<span class="visually-hidden">Go to next slide</span>\n</nav>\n<figcaption class="caption" style="display:none;">\n<span class="caption-text">\n' + (null == (__t = caption) ? "" : __t) + '\n</span>\n<span class="credit">\n' + (null == (__t = credit) ? "" : __t) + "\n</span>\n</figcaption>\n</figure>";
        return __p
    }, templates.mediaViewer = function (obj) {
        {
            var __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<aside id="media-viewer" class="media-viewer" style="display:none;">\n<button class="button close-button"><i class="icon"></i><span class="visually-hidden">Close this overlay</span></button>\n<h2 class="media-viewer-headline"></h2>\n<div class="media-viewer-wrapper"></div>\n<nav class="media-viewer-nav">\n<div class="media-viewer-counter"></div>\n<div class="media-viewer-previous">\n<span class="visually-hidden">Go to previous</span>\n<div class="arrow arrow-left">\n<div class="arrow-conceal"></div>\n</div>\n</div>\n<div class="media-viewer-next">\n<span class="visually-hidden">Go to next</span>\n<div class="arrow arrow-right">\n<div class="arrow-conceal"></div>\n</div>\n</div></nav>\n<div class="loader-container" style="display:none;">\n<div class="loader loader-t-logo-32x32-ecedeb-ffffff"><span class="visually-hidden">Loading...</span></div>\n</div>\n</aside>';
        return __p
    }, templates.mediaViewerIcon = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<div class="' + (null == (__t = classes) ? "" : __t) + '">\n<i class="icon sprite-icon"></i>\n</div>';
        return __p
    }, templates.video = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<figure class="media-viewer-asset media-viewer-video media video" data-videoId="' + (null == (__t = videoId) ? "" : __t) + '" style="visibility:hidden;">\n<figcaption class="caption">\n<span class="credit">\n' + (null == (__t = credit) ? "" : __t) + "\n</span>\n</figcaption>\n</figure>";
        return __p
    }, templates
}), define("shared/mediaviewer/views/media-viewer", ["jquery/nyt", "underscore/nyt", "backbone/nyt", "foundation/collections/base-collection", "foundation/views/base-view", "shared/mediaviewer/templates", "shared/ad/views/ads"], function (e, t, i, n, s, a, o) {
    "use strict";
    var r = s.registerView("media-viewer").extend({
        templates: a,
        collection: new n,
        speed: 400,
        assetIndex: 0,
        stepsTaken: 0,
        marginForImage: 160,
        clickableElements: ["img", "nav div", ".caption", ".credit", ".media-viewer-video", ".video-share span", ".video-share i.icon", ".video-share a", ".image-navigation"],
        candidateClass: "media-viewer-candidate",
        overlayClass: "media-action-overlay",
        slideshowClass: "slideshow.promo",
        isVideo: !1,
        videoId: 0,
        contentType: "",
        $prevArrow: e(),
        $nextArrow: e(),
        settings: {
            minWidth: 700,
            minHeight: 550,
            topMargin: 60,
            basicMargin: 30,
            captionGutter: 15,
            navGutter: 45,
            captionRatio: .8,
            imageAspectRatio: 1.3
        },
        events: {
            "click .media-viewer-previous": "prevAsset",
            "click .media-viewer-next": "nextAsset",
            "click .image-navigation.previous": "prevAsset",
            "click .image-navigation.next": "nextAsset",
            "click .media-viewer-asset img": "nextAsset",
            click: "decideClose",
            "mouseenter .image-navigation.previous": "lightPrevArrow",
            "mouseleave .image-navigation.previous": "unLightPrevArrow",
            "mouseenter .image-navigation.next": "lightNextArrow",
            "mouseleave .image-navigation.next": "unLightNextArrow"
        },
        nytEvents: {
            "nyt:page-key-esc": "forceClose",
            "nyt:page-resize-after": "renderFromResize",
            "nyt:mediaviewer-left": "prevAsset",
            "nyt:mediaviewer-right": "nextAsset",
            "nyt:open-media-viewer": "renderForEmbeddedSlideshow",
            "nyt:route:slideshow": "initFromDeepLink"
        },
        initialize: function () {
            t.bindAll(this, "renderForSlideshow", "renderFromSymbol", "renderFromClick", "writeVideoTemplateToViewer", "nextAsset", "prevAsset", "pinchClose"), this.pageManager.addRoute("slideshow/:slideshowId(/:imageId)", "slideshow"), this.setElement(this.templates.mediaViewer()), this.subscribe("nyt:slideshow-ad-render", this.renderSlideshowAd)
        },
        handleDomReady: function () {
            this.$body.on("click", "." + this.slideshowClass, this.renderForSlideshow).on("click", "." + this.overlayClass, this.renderFromSymbol).on("click", "." + this.candidateClass, this.renderFromClick), this.hammer && (this.hammer(this.el).on("swiperight", this.prevAsset), this.hammer(this.el).on("swipeleft", this.nextAsset), this.hammer(this.el).on("pinch", this.pinchClose)), this.$candidates = e("." + this.candidateClass), this.$headline = this.$(".media-viewer-headline"), this.$wrapper = this.$(".media-viewer-wrapper"), this.$counter = this.$(".media-viewer-counter"), this.$nav = this.$(".media-viewer-nav"), this.$body.find("#main").append(this.$el), this.$prevArrow = this.$el.find(".media-viewer-previous"), this.$nextArrow = this.$el.find(".media-viewer-next"), this.addViewerIcon(), this.trackingBaseData = {
                action: "click",
                contentCollection: this.pageManager.getMeta("article:section"),
                region: "Body"
            }, this.pageManager.checkRoute()
        },
        initFromDeepLink: function (t) {
            var i, n = t[0],
                s = t.length > 1 ? parseInt(t[1], 10) : null,
                a = e("#slideshow-" + n);
            return a.size() > 0 ? (this.getAssetsFromJSON(a), s && (i = this.collection.findWhere({
                id: s
            })), "undefined" == typeof i && (i = this.collection.at(0)), this.$el.addClass("theme-dark"), this.changeLoader("dark"), this.contentType = "slideshow", this.assetIndex = this.collection.indexOf(i), void this.render(i)) : void 0
        },
        addViewerIcon: function () {
            var t = this.templates.mediaViewerIcon({
                classes: this.overlayClass
            });
            this.$candidates.each(function () {
                e(this).after(t)
            })
        },
        changeLoader: function (e) {
            var t = this.$el.find(".loader"),
                i = "loader-t-logo-32x32-ecedeb-ffffff",
                n = "loader-t-logo-32x32-333333-121212";
            "dark" === e ? t.removeClass(i).addClass(n) : "light" === e && t.removeClass(n).addClass(i)
        },
        getDimension: function (e, t, i, n) {
            var s = this.pageManager.getViewport(),
                a = s.width - i,
                o = s.height - n;
            return e > a && (t *= a / e, e = a), t > o && (e *= o / t, t = o), {
                width: Math.round(e),
                height: Math.round(t)
            }
        },
        getAssetsFromJSON: function (i) {
            var n = i.find("script").get(0).innerHTML,
                s = e.parseJSON(n),
                a = s.id;
            this.headline = s.headline, s = t.map(s.imageslideshow.slides, function (e) {
                var t, i = "",
                    n = "";
                return e && e.image_crops && (t = e.image_crops, t.superJumbo ? i = t.superJumbo.url : t.jumbo ? i = t.jumbo.url : t.articleLarge ? i = t.articleLarge.url : t.slide ? i = t.slide.url : t.popup && (i = t.popup.url)), e && e.caption && (e.caption.full ? n = e.caption.full : e.caption["short"] && (n = e.caption["short"])), {
                    id: e.data_id,
                    src: i,
                    caption: n,
                    credit: e.credit
                }
            }), this.collection.reset(s), this.collection.slideshowId = a
        },
        getAssetsFromDOM: function () {
            var i, n = [];
            this.$candidates.each(function () {
                i = {
                    src: e(this).data("mediaviewer-src"),
                    caption: e(this).data("mediaviewer-caption"),
                    credit: e(this).data("mediaviewer-credit")
                }, n.push(i)
            }), this.collection.reset(t.uniq(n, function (e) {
                return e.src
            }))
        },
        broadcastAd: function () {
            var e = "",
                t = 0 === this.assetIndex,
                i = this.collection.length,
                n = this.end();
            if (t && !n) e = "Slideshow_int";
            else {
                if (!(i > 3 && n)) return !1;
                e = "Slideshow_end"
            }
            return this.broadcast("nyt:slideshow-ad", {
                el: this.$wrapper,
                position: e
            }), this.adRendered
        },
        renderSlideshowAd: function (t) {
            var i, n, s, a, o, r, l;
            "slideshow" === this.contentType && (i = this, n = this.pageManager.getCurrentBreakpoint(), s = this.$wrapper.find(".ad-wrapper"), a = 2 * parseInt(s.css("padding-left"), 10), o = parseInt(t.get("width"), 10), r = parseInt(t.get("height"), 10), l = e(this.templates.continueButton({
                message: this.end() ? "RETURN TO ARTICLE" : "CONTINUE SLIDE SHOW"
            })), this.$adBtn = l, s.append(l).css({
                width: o,
                height: r,
                "margin-left": -(o + a) / 2,
                "margin-top": -(r + a) / 2
            }), this.$nav.find(".media-viewer-previous").hide(), this.$counter.hide(), this.$headline.text(this.headline || ""), this.adRendered = !0, this.toggleLoader(!1), this.start(), this.active(!0), l.show().on("click", function (e) {
                e.stopPropagation(), e.preventDefault(), i.renderAfterAd()
            }), n >= 1e3 && 1030 > n && l.hide())
        },
        renderAfterAd: function () {
            this.dismissAd(), this.render()
        },
        dismissAd: function () {
            this.$adBtn.off("click").hide(), this.$wrapper.html(""), this.$counter.show(), this.$nav.find(".media-viewer-previous").show(), this.adRendered = !1
        },
        renderForSlideshow: function (t) {
            var i;
            e(t.target).hasClass("skip-to-text-link") || (i = e(t.currentTarget), "modal" === i.data("media-action") && (this.assetIndex = 0, this.$el.addClass("theme-dark"), this.changeLoader("dark"), this.getAssetsFromJSON(i), this.contentType = "slideshow", this.render()))
        },
        renderForEmbeddedSlideshow: function (e, t) {
            this.assetIndex = t, this.$el.addClass("theme-dark"), this.changeLoader("dark"), this.getAssetsFromJSON(e), this.contentType = "embedded-slideshow", this.render()
        },
        renderFromSymbol: function (t) {
            e(t.currentTarget).siblings("." + this.candidateClass).trigger("click")
        },
        renderFromResize: function () {
            var t;
            this.adRendered || (this.isActive && this.isVideo ? (t = e("figure.media-viewer-video"), this.handleVideo(t)) : this.isActive && this.render())
        },
        renderFromClick: function (t) {
            var i;
            this.getAssetsFromDOM(), i = this.collection.findWhere({
                src: e(t.target).data("mediaviewer-src")
            }), this.assetIndex = this.collection.indexOf(i), this.contentType = "images", this.render(i)
        },
        renderForVideo: function (e, t) {
            this.videoModel = e, this.videoCallback = t, this.$el.addClass("theme-dark"), this.changeLoader("dark"), this.isVideo = !0, this.render(e)
        },
        writeVideoTemplateToViewer: function () {
            var t = this.videoModel ? this.videoModel.get("videoId") : this.videoId,
                i = this.$body.find("figure[data-videoid=" + t + "] .video-credit"),
                n = e(this.templates.video({
                    videoId: t,
                    credit: i.html()
                }));
            this.handleVideo(n), this.$wrapper.html(n), this.pageManager.isMobile() ? "function" == typeof this.videoCallback && this.videoCallback() : this.broadcast("nyt:mediaviewer-open")
        },
        render: function (e) {
            var t = this;
            if (t.toggleLoader(!0), !this.broadcastAd()) {
                if (this.isVideo) this.renderVideo();
                else {
                    if (this.end()) return t.toggleLoader(!1), void this.close(!0);
                    this.renderImage(e)
                }
                this.active(!0), this.$body.css("overflow", "hidden"), this.$document.on("touchmove", function (e) {
                    e.preventDefault()
                }), this.setCounter(), this.toggleNav()
            }
        },
        renderVideo: function () {
            var e, t = this;
            this.pageManager.isMobile() ? (this.start(), this.writeVideoTemplateToViewer()) : this.start(this.writeVideoTemplateToViewer), t.toggleLoader(!1), e = {
                module: "Video",
                version: "MediaViewer",
                eventName: "PlayVideo"
            }, this.trackingTrigger("media-viewer-play-video", e), this.trackingComscorePVC(e)
        },
        renderImage: function (t) {
            var i, n, s, a, o, r = this,
                l = this.collection.slideshowId;
            t = t || this.collection.at(this.assetIndex), i = t.get("id"), this.isActive || (this.start(), this.$headline.text(this.headline || ""), this.broadcast("nyt:mediaviewer-open"), a = {
                module: this.getTrackingModule(),
                version: this.getTrackingVersion(),
                eventName: this.getTrackingOpenEventName(),
                mdata: {
                    currentSlide: this.assetIndex + 1,
                    totalSlides: this.collection.length
                }
            }, this.trackingTrigger("media-viewer-opened", a), this.trackingComscorePVC(a)), n = e(this.templates.image({
                src: t.get("src"),
                caption: t.get("caption"),
                credit: t.get("credit")
            })), s = e(this.templates.bigAd3()), n.find("img").load(function () {
                r.handleImg(n, s), r.toggleLoader(!1)
            }), l && i && (o = "slideshow/" + l + "/" + i, this.pageManager.navigateRoute(o, {
                trigger: !1,
                replace: !0
            })), this.$wrapper.html(n), this.$wrapper.append(s)
        },
        start: function (e) {
            e = e || function () {}, this.$el.fadeIn(this.speed, e)
        },
        toggleNav: function () {
            var e = this.$("nav");
            1 === this.collection.length || this.isVideo ? e.hide() : e.show()
        },
        toggleLoader: function (e) {
            var t = this.$el.find(".loader-container");
            e ? t.show() : t.hide()
        },
        handleImg: function (i, n) {
            var s, a, o, r, l, d, c, h, u = this.settings,
                m = i.find("img"),
                g = i.find(".caption"),
                p = e("nav.media-viewer-nav"),
                f = {},
                v = this.getElementDimensions(p),
                b = this.getElementDimensions(m),
                y = t.extend({}, this.pageManager.getViewport()),
                w = y.width,
                _ = this.$html.hasClass("tone-feature"),
                C = b.width / b.height,
                k = y.width / (y.height - v.height - u.topMargin - u.basicMargin),
                T = C > k ? "below" : "right";
            y.height = y.height < 150 ? 150 : y.height, y.width = y.width < 100 ? 100 : y.width, this.$headline.css({
                "margin-right": 0
            }), w >= 1280 && _ && "slideshow" === this.contentType && (y.width = w - 330, this.$headline.css({
                "margin-right": 330
            }), this.loadBigAd(), n.show(), C > u.imageAspectRatio && (T = "below")), "right" === T ? (c = this.getImageSizeAvailable(g, v, T, y), h = this.getCaptionSize(g, v, T), f = this.getScaledImage(b, c), a = c.width / c.height, a > C ? (i.css({
                height: c.height,
                width: f.width
            }), g.css({
                left: f.width + u.captionGutter,
                width: h.width,
                height: h.height
            }), (y.width - 2 * u.basicMargin - f.width) / 2 > h.width ? (r = Math.round((y.width - f.width) / 2), i.css({
                left: r,
                top: u.topMargin
            }), n.css({
                "margin-top": u.topMargin
            }), o = r < 2 * (v.width + u.basicMargin), d = u.topMargin + c.height + u.navGutter + v.height + u.basicMargin > y.height, s = o && d ? v.height + u.navGutter + u.basicMargin : u.basicMargin, g.css({
                bottom: s,
                width: h.width
            })) : (r = Math.round((y.width - (f.width + h.width)) / 2), i.css({
                left: r,
                top: u.topMargin
            }), n.css({
                "margin-top": u.topMargin
            }), g.css({
                bottom: u.basicMargin,
                width: h.width,
                height: h.height
            }))) : (l = Math.round((y.height - f.height - u.topMargin) / 2), l = Math.max(l, u.topMargin), r = Math.round((y.width - (c.width + h.width + u.captionGutter)) / 2), i.css({
                width: c.width,
                height: f.height,
                left: r,
                top: l
            }), n.css({
                "margin-top": l
            }), g.css({
                width: h.width,
                bottom: u.basicMargin,
                left: c.width + u.captionGutter
            }), h.height > f.height && g.css({
                height: f.height
            }))) : (h = this.getCaptionSize(g, v, T), c = this.getImageSizeAvailable(g, v, T, y), f = this.getScaledImage(b, c), a = c.width / c.height, a > C ? (r = Math.round((y.width - f.width) / 2), i.css({
                height: c.height,
                width: f.width,
                left: r,
                top: u.topMargin
            }), n.css({
                "margin-top": u.topMargin
            }), g.css({
                "max-width": 550,
                width: c.width - v.width,
                "margin-settings.topMargin-top": u.captionGutter
            })) : (r = Math.round((y.width - c.width) / 2), l = Math.round((y.height - (f.height + h.height + u.captionGutter) - u.topMargin) / 2), l = Math.max(l, u.topMargin), i.css({
                height: f.height,
                width: c.width,
                left: r,
                top: l
            }), n.css({
                "margin-top": l
            }), g.css({
                width: c.width,
                "margin-topmargin-top": u.captionGutter
            }))), i.css({
                visibility: "visible"
            }), n.css({
                width: 300,
                height: 250,
                "margin-left": 30,
                "margin-right": 30,
                "float": "right"
            }), g.css({
                display: "block",
                opacity: 0
            }).animate({
                opacity: 1
            }, this.speed), m.animate({
                opacity: 1
            }, this.speed)
        },
        loadBigAd: t.debounce(function () {
            new o({
                positions: ["BigAd3"],
                scope: "slideshow"
            })
        }, 100),
        getElementDimensions: function (e) {
            return {
                width: e.width(),
                height: e.height()
            }
        },
        getScaledImage: function (e, t) {
            return {
                width: Math.round(e.width / e.height * t.height),
                height: Math.round(e.height / e.width * t.width)
            }
        },
        getImageSizeAvailable: function (e, t, i, n) {
            var s = this.getCaptionSize(e, t),
                a = this.settings,
                o = n.height - a.topMargin - a.basicMargin,
                r = n.width - 2 * a.basicMargin;
            return "right" === i ? r -= s.width + a.captionGutter : "below" === i && (o -= s.height + a.captionGutter), {
                width: r,
                height: o
            }
        },
        getCaptionSize: function (e, t, i) {
            var n = this.getElementDimensions(e),
                s = this.settings;
            return n.width = Math.floor(Math.sqrt(n.width * n.height)), n.height = n.width, n.width = Math.max(n.width, t.width), "right" === i ? (n.height = Math.round(n.height * (1 / s.captionRatio)), n.width = Math.max(Math.round(n.width * s.captionRatio), t.width)) : "below" === i && (n.height = e.height(), n.width = Math.round(n.width * (1 / s.captionRatio))), n
        },
        handleVideo: function (e) {
            var t = this.pageManager.getViewport(),
                i = Math.round(t.width),
                n = Math.round(t.width * (9 / 16)),
                s = this.getDimension(i, n, 0, 70);
            e.css({
                visibility: "visible",
                width: s.width,
                height: s.height,
                "margin-left": -s.width / 2,
                "margin-top": -(s.height / 2 - 30),
                opacity: 1
            })
        },
        lightPrevArrow: function () {
            this.unLightNextArrow(), this.$prevArrow.addClass("hover")
        },
        unLightPrevArrow: function () {
            this.$prevArrow.removeClass("hover")
        },
        lightNextArrow: function () {
            this.unLightPrevArrow(), this.$nextArrow.addClass("hover")
        },
        unLightNextArrow: function () {
            this.$nextArrow.removeClass("hover")
        },
        nextAsset: function (e) {
            var t, i;
            return e && (this.doClose = "swipeleft" !== e.type), this.adRendered ? void this.renderAfterAd() : (this.moveIndex(1), this.render(), t = this.assetIndex + 1, i = {
                module: this.getTrackingModule(),
                version: this.getTrackingVersion(),
                eventName: "NextAsset-" + t + (t === this.collection.length ? "-Finish" : ""),
                mdata: {
                    currentSlide: t,
                    totalSlides: this.collection.length
                }
            }, this.trackingTrigger("media-viewer-next-image", i), void this.trackingComscorePVC(i))
        },
        prevAsset: function (e) {
            var t, i;
            e && (this.doClose = "swiperight" !== e.type), this.moveIndex(-1), this.render(), t = this.assetIndex + 1, i = {
                module: this.getTrackingModule(),
                version: this.getTrackingVersion(),
                eventName: "PrevAsset-" + t + (t === this.collection.length ? "-Finish" : ""),
                mdata: {
                    currentSlide: t,
                    totalSlides: this.collection.length
                }
            }, this.trackingTrigger("media-viewer-prev-image", i), this.trackingComscorePVC(i)
        },
        moveIndex: function (e) {
            var t = this.assetIndex,
                i = this.collection.length;
            t += e, this.stepsTaken += e, t === i ? t = 0 : -1 === t && (t = i - 1), this.assetIndex = t
        },
        setCounter: function (e, t) {
            e = e || this.assetIndex, t = t || this.collection.length, this.$counter.html(e + 1 + " of " + t)
        },
        pinchClose: function () {
            this.close(!0)
        },
        decideClose: function (t) {
            var i = this.clickableElements.join(", "),
                n = e(t.target).is(i);
            n || this.close(!0)
        },
        forceClose: function () {
            this.close(!0)
        },
        close: function (e) {
            var t = this.$el,
                i = this;
            return this.isVideo && (this.videoId = 0, this.isVideo = !1), e && (this.doClose = !0), this.doClose ? (this.adRendered && this.dismissAd(), this.active(!1), this.stepsTaken = 0, this.assetIndex = 0, this.destroyHeadline(), this.$body.css("overflow", ""), this.$document.off("touchmove"), this.pageManager.clearRoute(), void this.$el.fadeOut(this.speed, function () {
                t.removeClass("theme-dark"), i.changeLoader("light")
            })) : void(this.doClose = !0)
        },
        destroyHeadline: function () {
            this.$headline.empty(), this.headline = null
        },
        end: function () {
            return Math.abs(this.stepsTaken) === this.collection.length
        },
        active: function (e) {
            this.broadcast("nyt:mediaviewer-visibility", e), this.pageManager.setMeta("mediaviewer_isVisible", e), this.isActive = e
        },
        getTrackingModule: function () {
            var e = "";
            return "images" === this.contentType ? e = "ImageViewer" : ("embedded-slideshow" === this.contentType || "slideshow" === this.contentType) && (e = "Slideshow"), e
        },
        getTrackingVersion: function () {
            var e = "";
            return "slideshow" === this.contentType ? e = "MediaViewer-Promo" : "embedded-slideshow" === this.contentType ? e = "MediaViewer-NonPromo" : "images" === this.contentType && (e = "MediaViewer"), e
        },
        getTrackingOpenEventName: function () {
            return "images" === this.contentType ? "OpenImageViewer" : "OpenSlideshow"
        }
    });
    return r
}), define("shared/mediaviewer/instances/media-viewer", ["shared/mediaviewer/views/media-viewer"], function (e) {
    "use strict";
    return new e
}), define("shared/sharetools/models/share-data", ["foundation/models/base-model"], function (e) {
    "use strict";
    var t = e.extend({
        dataAttributes: {
            URL: "data-url",
            TITLE: "data-title",
            MEDIA: "data-media",
            DESCRIPTION: "data-description",
            PUBLICATION_DATE: "data-publish-date",
            CONTENT_TYPE: "data-content-type",
            VIA: "data-via"
        },
        initialize: function (e) {
            this.$container = e
        },
        getUrl: function () {
            var e = this.$container.attr(this.dataAttributes.URL);
            return e ? e : this.pageManager.getCanonical()
        },
        setUrl: function (e) {
            this.$container.attr(this.dataAttributes.URL, e)
        },
        getTitle: function () {
            var e = this.$container.attr(this.dataAttributes.TITLE);
            return e ? e : this.pageManager.getMeta("og:title")
        },
        setTitle: function (e) {
            this.$container.attr(this.dataAttributes.TITLE, e)
        },
        getMedia: function () {
            var e = this.$container.attr(this.dataAttributes.MEDIA);
            return e ? e : this.pageManager.getMeta("og:image")
        },
        setMedia: function (e) {
            this.$container.attr(this.dataAttributes.MEDIA, e)
        },
        getDescription: function () {
            var e = this.$container.attr(this.dataAttributes.DESCRIPTION);
            return e ? e : this.pageManager.getMeta("description")
        },
        setDescription: function (e) {
            this.$container.attr(this.dataAttributes.DESCRIPTION, e)
        },
        getPublicationDate: function () {
            var e = this.$container.attr(this.dataAttributes.PUBLICATION_DATE);
            return e ? e : this.pageManager.getMeta("DISPLAYDATE")
        },
        setPublicationDate: function (e) {
            this.$container.attr(this.dataAttributes.PUBLICATION_DATE, e)
        },
        getVia: function () {
            var e = this.$container.attr(this.dataAttributes.VIA),
                t = this.pageManager.getMeta("twitter:site");
            return e ? e : "upshot" === this.pageManager.getMeta("CG") ? "UpshotNYT" : t && "@nytimes" !== t ? t.replace("@", "") : ""
        },
        setVia: function (e) {
            this.$container.attr(this.dataAttributes.VIA, e)
        },
        getContentType: function () {
            var e = this.$container.attr(this.dataAttributes.CONTENT_TYPE);
            return e ? e : "Content"
        },
        setContentType: function (e) {
            this.$container.attr(this.dataAttributes.CONTENT_TYPE, e)
        }
    });
    return t
}), define("shared/sharetools/templates", ["underscore/nyt"], function (_) {
    var templates = {};
    return templates.emailModal = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<iframe src="' + (null == (__t = emailThisUrl) ? "" : __t) + (null == (__t = dataUrl) ? "" : __t) + '" title="Email This" id="emailthis" scrolling="' + (null == (__t = scrolling) ? "" : __t) + '" marginheight="0" marginwidth="0" frameborder="0"></iframe>';
        return __p
    }, templates.savemodal = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<ul class="instructions">\n<li>This item has been saved to read later from any device. </li>\n<li>Access saved items through your user name at the top of the page.</li>\n</ul>\n<p><a href="' + (null == (__t = link) ? "" : __t) + '">View Saved Items</a><p>\n<button class="button dismiss-button">OK</button>';
        return __p
    }, templates.shareTool = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<a href="javascript:;" data-share="' + (null == (__t = id) ? "" : __t) + '" data-modal-title="' + (null == (__t = loginModalTitle) ? "" : __t) + '"><i class="icon sprite-icon"></i><span class="sharetool-text ' + (null == (__t = isLabelHidden === !0 ? "visually-hidden" : "") ? "" : __t) + '">' + (null == (__t = label) ? "" : __t) + "</span></a>";
        return __p
    }, templates.shareTools = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += "<ul>\n", _.each(shares, function (e) {
            __p += '\n<li class="sharetool ' + (null == (__t = e.type) ? "" : __t) + "-sharetool " + (null == (__t = config[e.type].loginRequired ? "login-modal-trigger" : "") ? "" : __t) + '" data-modal-title="' + (null == (__t = config[e.type].loginModalText || "") ? "" : __t) + '">\n<a href="javascript:;" data-share="' + (null == (__t = e.type) ? "" : __t) + '"><i class="icon sprite-icon"></i><span class="sharetool-text">' + (null == (__t = e.label) ? "" : __t) + "</span></a>\n</li>\n"
        }), __p += "\n</ul>";
        return __p
    }, templates.shareToolsModal = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<div class="section share ', isCompact && (__p += "compact-share-tools"), __p += '">\n<ul class="sharetools-menu">\n' + (null == (__t = standardToolsList) ? "" : __t) + '\n</ul>\n<form class="short-url-form">\n<div class="control">\n<div class="label-container"><label for="short-url-input">Permalink</label></div>\n<div class="field-container">\n<input id="short-url-input" class="short-url-input text" type="text" name="short-url-input" value="' + (null == (__t = shortUrl) ? "" : __t) + '" readonly="readonly" />\n</div>\n</div>\n</form>\n', isCompact && (__p += '\n<form class="embed-url-form">\n<div class="control">\n<div class="label-container"><label for="embed-input">Embed</label></div>\n<div class="field-container">\n<input id="embed-input" class="embed-input text" type="text" name="embed-input" readonly="readonly" />\n</div>\n</div>\n</form>\n'), __p += "\n</div><!--close section -->\n", isCompact || (__p += '\n<div class="section tools">\n<h4 class="modal-heading">Tools</h4>\n<ul class="sharetools-menu">\n' + (null == (__t = articleToolsList) ? "" : __t) + "\n</ul>\n</div><!--close section -->\n"), __p += "";
        return __p
    }, templates.shareToolsModalFooter = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<div class="ad show-all-sharetool-modal-ad hidden">\n<small class="ad-sponsor">' + (null == (__t = toolTypeSponsor) ? "" : __t) + " Tools Sponsored By</small>\n</div>";
        return __p
    }, templates.showAllSharetoolCompactModal = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<div class="section share">\n<ul class="sharetools-menu">\n' + (null == (__t = showAllLinkList) ? "" : __t) + '\n</ul>\n</div> <!--close section -->\n<div class="section tools">\n<ul class="sharetools-menu">\n' + (null == (__t = showAllToolList) ? "" : __t) + '\n</ul>\n<div class="control permalink-control">\n<div class="label-container">\n<label for="permalink-input" class="sharetools-label">Permalink</label>\n</div>\n<div class="field-container">\n<input id="permalink-input" type="text" class="text short-url-input" placeholder="" readonly="readonly" />\n<span class="textbox-fade"></span>\n</div>\n</div><!-- close control -->\n<div class="control embed-control">\n<div class="label-container">\n<label for="embed-input" class="sharetools-label">Embed</label>\n</div>\n<div class="field-container">\n<input id="embed-input" type="text" class="text embed-input" placeholder="" readonly="readonly" />\n<span class="textbox-fade"></span>\n</div>\n</div><!-- close control -->\n</div><!--close section -->';
        return __p
    }, templates.showAllSharetoolModal = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<div class="section share">\n<ul class="sharetools-menu">\n' + (null == (__t = showAllLinkList) ? "" : __t) + '\n</ul>\n<form class="short-url-form">\n<div class="control">\n<div class="label-container"><label for="short-url-input">Permalink</label></div>\n<div class="field-container">\n<input id="short-url-input" class="short-url-input text" type="text" name="short-url-input" value="' + (null == (__t = shortUrl) ? "" : __t) + '" readonly="readonly" />\n</div>\n</div>\n</form>\n</div> <!--close section -->\n<div class="section tools">\n<h5 class="modal-heading">Tools</h5>\n<ul class="sharetools-menu">\n' + (null == (__t = showAllToolList) ? "" : __t) + "\n</ul>\n</div><!--close section -->";
        return __p
    }, templates.showallLinks = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<li class="sharetool ' + (null == (__t = shareObj.type) ? "" : __t) + "-sharetool " + (null == (__t = config.loginRequired ? "login-modal-trigger" : "") ? "" : __t) + '" data-modal-title="' + (null == (__t = config.loginModalText || "") ? "" : __t) + '">\n<a href="javascript:;" data-share="' + (null == (__t = shareObj.type) ? "" : __t) + '"><i class="icon sprite-icon"></i>' + (null == (__t = shareObj.label) ? "" : __t) + "</a>\n</li>";
        return __p
    }, templates
}), define("shared/sharetools/views/email", ["jquery/nyt", "underscore/nyt", "foundation/hosts", "foundation/views/base-view", "shared/modal/views/modal", "shared/sharetools/templates"], function (e, t, i, n, s, a) {
    "use strict";
    var o = n.extend({
        template: a.emailModal,
        className: "email-view-container",
        frameSize: {
            small: 507,
            full: 867,
            ad: 285
        },
        defaultSettings: {
            emailThisUrl: "https:" + i.www + "/mem/email-this.html?url=",
            scrolling: window.Modernizr.postmessage ? "no" : "yes"
        },
        defaultModalSettings: {
            id: "email-share-modal",
            modalTitle: "Email This Article",
            binding: ".email-sharetool",
            tailDirection: "centered",
            hasOverlay: !0,
            hasCloseButton: !0,
            modalContent: ""
        },
        initialize: function (e) {
            var i = this;
            t.bindAll(this, "handlePostMessage", "responsive"), this.settings = t.extend({}, this.defaultSettings, e), this.frameState = "full", this.modalSettings = t.extend({}, this.defaultModalSettings, {
                openCallback: function () {
                    window.Modernizr.postmessage && (window.addEventListener ? window.addEventListener("message", i.handlePostMessage, !1) : window.attachEvent("onmessage", i.handlePostMessage)), i.listenTo(i.pageManager, "nyt:page-breakpoint", i.responsive)
                },
                closeCallback: function () {
                    this.removeFromPage(), window.addEventListener ? window.removeEventListener("message", i.handlePostMessage, !1) : window.detachEvent("onmessage", i.handlePostMessage), i.stopListening(i.pageManager, "nyt:page-breakpoint", i.responsive)
                }
            }), this.prepareUrls(), this.render()
        },
        render: function () {
            this.modalSettings.modalContent = this.template(this.settings), this.emailModal = new s(this.modalSettings), this.emailModal.addToPage(), t.defer(this.responsive, this.pageManager.getCurrentBreakpoint())
        },
        responsive: function (e) {
            var t = this.emailModal.$modal.find("iframe");
            1010 >= e && "full" === this.frameState && (t.css("height", t.height() + this.frameSize.ad + "px").width(this.frameSize.small), this.frameSize.state = "small", this.emailModal.positionDialog()), e > 1010 && "small" === this.frameState && (t.css("height", t.height() - this.frameSize.ad + "px").width(this.frameSize.full), this.frameState = "full", this.emailModal.positionDialog())
        },
        handlePostMessage: function (e) {
            var t;
            /\.nytimes\.com$/.test(e.origin) && (t = e.data.match(/(.+)\:(.+)/), t && "frameheight" === t[1] ? this.$el.css("height", t[2]) : t && "closewindow" === t[1] ? this.emailModal.close() : t && "loginredirect" === t[1] && (window.location = i.myaccount + "/auth/login?URI=" + encodeURIComponent(window.location.href)))
        },
        prepareUrls: function () {
            "string" == typeof this.settings.dataUrl && -1 === this.settings.dataUrl.indexOf("http") && (this.settings.dataUrl = "http:" + i.www + this.settings.dataUrl)
        }
    });
    return o
}), define("shared/sharetools/helpers/share-tools-config", ["underscore/nyt"], function (e) {
    "use strict";
    var t = {
            width: 600,
            height: 450,
            adPosition: "Frame4A",
            overlayAdPosition: "Frame6A",
            isModalMember: !0,
            isArticleTool: !1,
            isInDefaultSet: !1,
            isPopup: !0,
            usesShortUrl: !1,
            shareDataParameters: {},
            shareServiceParameters: {}
        },
        i = function (i) {
            var n = e.extend({}, t, i);
            return Object.freeze ? Object.freeze(n) : n
        },
        n = {
            EMAIL: i({
                label: "Email",
                isInDefaultSet: !0,
                requiresLogin: !0,
                loginModalTitle: "Log in to email",
                modalDisplayOrder: 1
            }),
            FACEBOOK: i({
                label: "Share",
                isInDefaultSet: !0,
                url: "http://www.facebook.com/sharer.php",
                smid: "fb-share",
                modalDisplayOrder: 3,
                shareDataParameters: {
                    url: "u"
                }
            }),
            GOOGLE: i({
                label: "Google+",
                url: "https://plus.google.com/share",
                smid: "go-share",
                height: 600,
                modalDisplayOrder: 4,
                shareDataParameters: {
                    url: "url"
                },
                shareServiceParameters: {
                    hl: "en-US"
                }
            }),
            REDDIT: i({
                label: "Reddit",
                url: "http://www.reddit.com/submit",
                smid: "re-share",
                width: 854,
                height: 550,
                modalDisplayOrder: 6,
                shareDataParameters: {
                    url: "url",
                    title: "title"
                }
            }),
            PINTEREST: i({
                label: "Pin",
                url: "https://www.pinterest.com/pin/create/button/",
                smid: "pin-share",
                width: 750,
                height: 330,
                modalDisplayOrder: 7,
                shareDataParameters: {
                    url: "url",
                    media: "media",
                    description: "description"
                }
            }),
            TWITTER: i({
                label: "Tweet",
                isInDefaultSet: !0,
                url: "https://twitter.com/share",
                smid: "tw-share",
                usesShortUrl: !0,
                modalDisplayOrder: 5,
                shareDataParameters: {
                    url: "url",
                    title: "text"
                }
            }),
            LINKEDIN: i({
                label: "Linkedin",
                url: "http://www.linkedin.com/shareArticle",
                smid: "li-share",
                width: 750,
                modalDisplayOrder: 2,
                shareDataParameters: {
                    url: "url",
                    title: "title",
                    description: "summary"
                },
                shareServiceParameters: {
                    mini: "true",
                    source: "The New York Times"
                }
            }),
            SAVE: i({
                label: "Save",
                isInDefaultSet: !0,
                isArticleTool: !0,
                loginModalTitle: "Log in to save",
                modalDisplayOrder: 1
            }),
            PRINT: i({
                label: "Print",
                isArticleTool: !0,
                modalDisplayOrder: 3,
                shareServiceParameters: {
                    pagewanted: "print"
                }
            }),
            REPRINTS: i({
                label: "Reprints",
                isArticleTool: !0,
                isModalMember: !0,
                url: "https://s100.copyright.com/AppDispatchServlet",
                modalDisplayOrder: 2,
                shareDataParameters: {
                    url: "contentID"
                },
                shareServiceParameters: {
                    publisherName: "The New York Times",
                    publication: "nytimes.com",
                    token: "",
                    orderBeanReset: "true",
                    postType: "",
                    wordCount: "",
                    title: document.title,
                    publicationDate: "",
                    author: ""
                }
            }),
            EMBED: i({
                label: "Embed",
                isArticleTool: !1,
                isInDefaultSet: !1,
                isModalMember: !1
            }),
            "SHOW-ALL": i({
                label: "More",
                isInDefaultSet: !0,
                isModalMember: !1,
                isModalTrigger: !0
            }),
            AD: i({
                label: "Advertisement",
                isInDefaultSet: !0,
                isModalMember: !1
            })
        };
    return Object.freeze ? Object.freeze(n) : n
}), define("shared/sharetools/collections/cross-platform-save", ["jquery/nyt", "underscore/nyt", "backbone/nyt", "foundation/collections/base-collection", "foundation/hosts", "foundation/lib/auth/userauth"], function (e, t, i, n, s, a) {
    "use strict";
    var o = n.extend({
        COMMAND: {
            save: "add",
            check: "list"
        },
        url: s.du + "/svc/profile/reading-list/v1/",
        save: function (e) {
            var t = this;
            this.sync(this.COMMAND.save, e).done(function (i) {
                t.add(i), t.trigger("nyt:xps-saved", e, i)
            }).fail(function () {
                t.trigger("nyt:xps-failed", e)
            })
        },
        sync: function (t, i) {
            var n = new e.Deferred,
                s = setTimeout(function () {
                    n.reject()
                }, 5e3),
                o = {
                    url: i
                },
                r = {
                    type: "GET",
                    jsonp: "callback",
                    jsonpCallback: "xpsCallback",
                    dataType: "jsonp",
                    cache: !0,
                    url: this.url + t + ".jsonp",
                    data: "",
                    success: function (e) {
                        clearTimeout(s), e && e.assets ? n.resolve(e.assets) : n.reject()
                    }
                };
            return a.getToken().done(function (t, i, n) {
                t && i && "undefined" != typeof n && (r.data += "&token=" + t), r.data += "&data=" + JSON.stringify(o), e.ajax(r)
            }), n.promise()
        }
    });
    return o
}), define("shared/sharetools/instances/cross-platform-save", ["shared/sharetools/collections/cross-platform-save"], function (e) {
    "use strict";
    return new e
}), define("shared/sharetools/collections/short-url", ["jquery/nyt", "backbone/nyt", "foundation/collections/base-collection"], function (e, t, i) {
    "use strict";
    var n = i.extend({
        url: "http://www.nytimes.com/svc/bitly/shorten.jsonp",
        initialize: function () {
            this.currentUrlRequest = "", this.addCurrentPage()
        },
        sync: function (e, i, n) {
            return n.dataType = "jsonp", n.jsonpCallback = "shortUrlCallback", n.jsonp = "callback", n.cache = !0, n.data = {
                url: this.currentUrlRequest
            }, t.sync(e, i, n)
        },
        parse: function (e) {
            return {
                url: this.currentUrlRequest,
                shortUrl: e.payload ? e.payload.short_url : ""
            }
        },
        addCurrentPage: function () {
            var t, i = this.pageManager.getCanonical();
            t = "1" === this.pageManager.getUrlParam("rico") && "undefined" != typeof this.pageManager.getUrlParam("share_url") ? this.pageManager.getUrlParam("share_url") : e("#masthead").find(".story-short-url").text(), i && t && this.add({
                url: i,
                shortUrl: t
            })
        },
        getRicoUrl: function (e) {
            var t = this.pageManager.getUrlParam("share_url"),
                i = document.createElement("a");
            return i.href = e, i.pathname === location.pathname && t && 7 === t.indexOf("r-i.co/") ? t : void 0
        },
        requestUrl: function (e) {
            var t, i = this.findWhere({
                url: e
            });
            return i ? i.get("shortUrl") : (t = this.getRicoUrl(e)) ? t : (this.currentUrlRequest = e, void this.fetch())
        }
    });
    return n
}), define("shared/sharetools/instances/short-url", ["shared/sharetools/collections/short-url"], function (e) {
    "use strict";
    return new e
}), define("shared/sharetools/views/common-mixin", ["jquery/nyt", "underscore/nyt", "foundation/hosts", "foundation/models/user-data", "foundation/models/page-storage", "foundation/tracking/tracking-mixin", "shared/modal/views/modal", "shared/sharetools/templates", "shared/sharetools/views/email", "shared/sharetools/helpers/share-tools-config", "shared/sharetools/instances/cross-platform-save", "shared/sharetools/instances/short-url"], function (e, t, i, n, s, a, o, r, l, d, c, h) {
    "use strict";
    var u = {
        handleShareAction: function (t, i) {
            var s = e(t.target),
                a = s.attr("data-share") || s.parent().attr("data-share"),
                o = a && d[a.toUpperCase()];
            return o ? (i && this.modal && this.modal.close(), this.trackShareData(a, o, i), o === d.EMBED ? void this.triggerEmbedLoginModal(t) : void(o.isModalTrigger ? this.broadcast("nyt:open-share-modal", {
                instanceContainer: this.$instanceContainer
            }) : o === d.EMAIL ? this.isMobileShareTools() ? this.openMailToLink() : n.isLoggedIn() ? new l({
                dataUrl: this.shareData.getUrl()
            }) : this.triggerLoginModal(t, "Log in to email") : o === d.PRINT ? window.print() : o === d.SAVE ? n.isLoggedIn() ? this.saveItem() : this.triggerLoginModal(t, "Log in to save") : o.isPopup && this.popupShareWindow(o))) : void 0
        },
        handleModalShareAction: function (e) {
            this.handleShareAction(e, !0)
        },
        triggerLoginModal: function (e, t) {
            e.preventDefault(), e.stopPropagation(), this.broadcast("nyt:loginmodal-open", {
                modalTitle: t
            })
        },
        triggerEmbedLoginModal: function (t) {
            t.stopPropagation(), e(".show-all-sharetool a").trigger("click"), this.$body.find(".show-all-sharetool-modal #embed-input").select()
        },
        popupShareWindow: function (e) {
            e.usesShortUrl ? this.handleShortUrlShareAction(e) : window.open(this.buildShareServiceUrl(e), "_blank", this.getPopupWindowFeatures(e))
        },
        getPopupWindowFeatures: function (e) {
            return "toolbar=0,status=0,height=" + e.height + ",width=" + e.width + ",scrollbars=yes,resizable=yes"
        },
        buildShareServiceUrl: function (e) {
            var t, i = [],
                n = e.smid,
                s = e.shareDataParameters,
                a = e.shareServiceParameters,
                o = {
                    url: this.shareData.getUrl(),
                    title: this.shareData.getTitle(),
                    description: this.shareData.getDescription(),
                    media: this.shareData.getMedia()
                };
            if (n && (o.url += this.getQuerystringDelimiter(o.url), o.url += "smid=" + n), s)
                for (t in s) s.hasOwnProperty(t) && o.hasOwnProperty(t) && i.push(s[t] + "=" + encodeURIComponent(o[t]));
            if (a) {
                a.hasOwnProperty("publicationDate") && (a.publicationDate = this.shareData.getPublicationDate());
                for (t in a) a.hasOwnProperty(t) && i.push(t + "=" + encodeURIComponent(a[t]))
            }
            return e.url + "?" + i.join("&")
        },
        handleShortUrlShareAction: function (e) {
            var t, i, n, s = this,
                a = this.shareData.getUrl(),
                o = e.smid;
            i = window.open("", "_blank", this.getPopupWindowFeatures(e)), n = function (t) {
                var n = s.shareData.getVia();
                t = e.url + "?url=" + encodeURIComponent(t) + "&text=" + encodeURIComponent(s.shareData.getTitle()), n && (t += "&via=" + encodeURIComponent(n)), i.location.href = t
            }, o && !this.pageManager.isMobile() && (a += this.getQuerystringDelimiter(a), a += "smid=" + o), t = h.requestUrl(a) || "", t ? n(t) : this.listenToOnce(h, "add", function () {
                var e = h.findWhere({
                    url: a
                });
                e && n(e.get("shortUrl"))
            })
        },
        getQuerystringDelimiter: function (e) {
            return -1 === e.indexOf("?") ? "?" : "&"
        },
        saveItem: function () {
            var e, t, n, a, o = this,
                l = this.shareData.getUrl();
            t = function () {
                var e = "sharetools_hasSaves";
                s.get(e) !== !0 ? (a(), s.set(e, !0)) : n()
            }, n = function () {
                o.showModal({
                    id: "save-item-growl-modal",
                    modalTitle: '<i class="icon"></i>Saved',
                    tailDirection: "centered",
                    openCallback: function () {
                        window.setTimeout(this.removeFromPage, 2e3)
                    }
                })
            }, a = function () {
                o.showModal({
                    id: "save-item-modal",
                    modalTitle: '<i class="icon"></i>Saved',
                    modalContent: r.savemodal({
                        link: i.www + "/saved"
                    }),
                    hasOverlay: !0,
                    hasCloseButton: !0,
                    tailDirection: "centered",
                    closeCallback: function () {
                        this.removeFromPage()
                    }
                })
            }, e = c.where({
                url: l
            }), e.length ? n() : (this.subscribeOnce(c, "nyt:xps-saved", t), c.save(l))
        },
        trackShareData: function (e, t, i) {
            var n = {};
            this.trackingBaseData = {
                module: "ShareTools",
                action: "click",
                version: this.shareData.getContentType(),
                contentCollection: this.pageManager.getMeta("article:section")
            }, i ? (n.region = "ToolsMenu", n.version = "Content") : n.region = this.trackingRegion, t.isArticleTool ? (n.module = "ArticleTools", n.eventName = "ArticleTool-" + e) : n.eventName = "show-all" === e ? "Share-ShowAll" : "Share-" + e, this.trackingTrigger("share-tools-click", n)
        },
        showModal: function (e) {
            var i = new o(e);
            i.addToPage(), t.defer(i.open)
        },
        isMobileShareTools: function () {
            return this.pageManager.getCurrentBreakpoint() < 1e3
        },
        openMailToLink: function () {
            var e = "%0A%0A",
                t = encodeURIComponent(this.shareData.getTitle()),
                i = encodeURIComponent(this.shareData.getDescription()),
                n = encodeURIComponent(this.shareData.getUrl()),
                s = "NYTimes.com: " + t,
                a = "From The New York Times:" + e + t + e + i + e + n;
            window.location = "mailto:?subject=" + s + "&body=" + a
        }
    };
    return u
}), define("shared/sharetools/views/share-tool", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "shared/sharetools/views/common-mixin", "shared/sharetools/templates"], function (e, t, i, n, s) {
    "use strict";
    var a = i.extend(t.extend({}, n, {
        tagName: "li",
        events: {
            click: "handleShareAction"
        },
        initialize: function (e) {
            this.toolId = e.toolId, this.toolConfig = e.toolConfig, this.label = e.customLabel || this.toolConfig.label, this.loginModalTitle = this.toolConfig.loginModalTitle || "", this.$instanceContainer = e.instanceContainer, this.shareData = e.shareData, this.trackingRegion = e.trackingRegion, "" === e.customLabel && (this.isLabelHidden = !0)
        },
        render: function () {
            var e, t, i = this.toolId.toLowerCase();
            return this.isAdView() ? (e = this.pageManager.getCurrentBreakpoint() <= 1020 ? "Position1" : "Frame4A", this.$instanceContainer.find(".sharetools-inline-article-ad").attr("id", e), this.pageManager.flag("dfpAds") && this.pageManager.$html.hasClass("dfp-enabled") ? this.broadcast("nyt:ad-library:dfp:request-placement", e) : this.broadcast("nyt:ads-new-placement", e)) : (t = s.shareTool({
                id: i,
                label: this.label,
                loginModalTitle: this.loginModalTitle,
                isLabelHidden: this.isLabelHidden
            }), this.$el.addClass("sharetool " + i + "-sharetool"), this.$el.append(t)), this
        },
        isAdView: function () {
            return "AD" === this.toolId
        }
    }));
    return a
}), define("shared/sharetools/views/containers-mixin", ["jquery/nyt", "underscore/nyt", "shared/sharetools/models/share-data", "shared/sharetools/views/share-tool", "shared/sharetools/helpers/share-tools-config"], function (e, t, i, n, s) {
    "use strict";
    var a = {
        getToolIdsAndCustomLabels: function (e) {
            var t, i, n, a;
            if (this.toolIds = [], this.customLabels = {}, e)
                for (e = e.split(","), t = 0, n = e.length; n > t; t++) i = e[t].toUpperCase(), a = i.indexOf("|"), -1 !== a && (i = i.substring(0, a), this.customLabels[i] = e[t].substr(a + 1)), this.toolIds.push(i);
            else
                for (i in s) s.hasOwnProperty(i) && s[i].isInDefaultSet === !0 && this.toolIds.push(i)
        },
        instantiateViews: function (e) {
            var i, a, o, r, l, d = [];
            for (i = 0, a = e.length; a > i; i++) o = e[i], r = this.customLabels && this.customLabels[o], s.hasOwnProperty(o) && (l = {
                toolId: o,
                toolConfig: s[o],
                instanceContainer: this.$instanceContainer,
                shareData: this.shareData,
                trackingRegion: this.trackingRegion
            }, t.isString(r) && (l.customLabel = r), d.push(new n(l)));
            return d
        },
        renderToolViews: function () {
            var e, t, i;
            for (t = this.instantiateViews(this.toolIds), e = 0, i = t.length; i > e; e++) t[e].isAdView() ? t[e].render() : this.$el.append(t[e].render().el)
        },
        getToolViewsMarkup: function (t) {
            var i, n = document.createElement("div"),
                s = this.instantiateViews(t),
                a = s.length;
            for (i = 0; a > i; i++) n.appendChild(s[i].render().el);
            return e(n).html()
        }
    };
    return a
}), define("shared/sharetools/views/share-tools-modal-container", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "shared/modal/views/modal", "shared/ad/views/ads", "shared/sharetools/helpers/share-tools-config", "shared/sharetools/views/share-tool", "shared/sharetools/views/common-mixin", "shared/sharetools/views/containers-mixin", "shared/sharetools/instances/short-url", "shared/sharetools/templates"], function (e, t, i, n, s, a, o, r, l, d, c) {
    "use strict";
    var h = i.extend(t.extend({}, r, l, {
        events: {
            click: "handleModalShareAction"
        },
        defaultModalSettings: {
            id: "show-all-sharetool-modal",
            modalTitle: "share",
            binding: ".show-all-sharetool",
            tailDirection: "up",
            hasOverlay: !1,
            hasCloseButton: !1,
            positionTailSide: !1,
            autoPosition: !1,
            modalContent: "",
            toolTypeSponsor: "Share",
            tailLeftOffset: 0,
            tailTopOffset: 0,
            openCallback: function () {
                this.$target.addClass("active")
            },
            closeCallback: function () {
                this.$target.removeClass("active"), this.removeFromPage()
            }
        },
        initialize: function (i) {
            this.$instanceContainer = i.instanceContainer, this.trackingRegion = i.trackingRegion, this.shareData = i.shareData, this.configIds = i.modalSettings.shares, this.modalSettings = t.extend({}, this.defaultModalSettings, i.modalSettings), this.modalSettings.modalFooter = c.shareToolsModalFooter({
                toolTypeSponsor: this.modalSettings.toolTypeSponsor
            }), this.isMobileShareTools() && (this.modalSettings = t.extend({}, this.modalSettings, {
                tailDirection: "centered",
                hasCloseButton: !0,
                hasOverlay: !0,
                positionTailSide: !1,
                autoPosition: !1
            })), this.el = document.createElement("ul"), this.el.className = "sharetools-menu", this.$el = e(this.el), this.urlWithSmid = this.shareData.getUrl(), this.urlWithSmid += -1 === this.urlWithSmid.indexOf("?") ? "?" : "&", this.urlWithSmid += "smid=pl-share", this.permalink = d.requestUrl(this.urlWithSmid) || "", this.permalink || this.listenToOnce(d, "add", this.handleShortUrl), this.render()
        },
        render: function () {
            var e = "Frame6A";
            this.modalSettings.modalContent = c.shareToolsModal(this.buildMarkup()), this.modal = new n(this.modalSettings), this.setElement(this.modal.$modal), this.modalSettings.embedCode && this.modal.$modal.find(".embed-input").val(this.modalSettings.embedCode), this.modal.$modal.find(".show-all-sharetool-modal-ad").attr("id", e), this.modal.addToPage(), this.isMobileShareTools() || (this.pageManager.flag("dfpAds") && this.pageManager.$html.hasClass("dfp-enabled") ? this.broadcast("nyt:ad-library:dfp:request-placement", e) : new s({
                positions: [e],
                scope: "modal",
                autoconfirm: 0
            }))
        },
        buildMarkup: function () {
            var e, i, n, s = this,
                o = [],
                r = [],
                l = function (e) {
                    var i;
                    a.hasOwnProperty(e) && (i = t.extend({}, a[e], {
                        id: e
                    }), a[e].isArticleTool ? "REPRINTS" === e ? "article" !== s.pageManager.getMeta("PT") || /\/(?:aponline|reuters|t-magazine|magazine)\//.test(s.shareData.getUrl()) || r.push(i) : a[e].isArticleTool && r.push(i) : o.push(i))
                };
            if (this.configIds)
                for (this.getToolIdsAndCustomLabels(this.configIds), e = 0, n = this.toolIds.length; n > e; e++) l(this.toolIds[e]);
            else {
                for (i in a) a[i].isModalMember && l(i);
                o = t.sortBy(o, function (e) {
                    return e.modalDisplayOrder
                }), r = t.sortBy(r, function (e) {
                    return e.modalDisplayOrder
                })
            }
            return {
                shortUrl: this.permalink,
                isCompact: "homepage" === s.pageManager.getApplicationName(),
                standardToolsList: this.getToolViewsMarkup(t.pluck(o, "id")),
                articleToolsList: this.getToolViewsMarkup(t.pluck(r, "id"))
            }
        },
        handleShortUrl: function () {
            var e = d.findWhere({
                url: this.urlWithSmid
            });
            e && this.modal.$modal.find(".short-url-input").val(e.get("shortUrl"))
        }
    }));
    return h
}), define("shared/sharetools/views/share-tools-container", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "shared/sharetools/models/share-data", "shared/sharetools/views/containers-mixin", "shared/sharetools/views/share-tools-modal-container"], function (e, t, i, n, s, a) {
    "use strict";
    var o = i.extend(t.extend({}, s, {
        initializedAttribute: "data-share-tools-initialized",
        initialize: function (t) {
            var i, s;
            this.$instanceContainer = t.el, this.trackingRegion = t.trackingRegion || "", this.$instanceContainer && !this.$instanceContainer.attr(this.initializedAttribute) && (this.pageManager.flag("referrerBasedShareTools") && "1" === this.isUserVariant("referrerBasedShareTools") ? "article" === this.pageManager.getMeta("applicationName") && (i = this.pageManager.getUrlParam("smid"), s = "fb-share" === i ? "facebook,email,show-all|More" : "tw-share" === i ? "twitter,facebook,email,show-all|More" : "li-share" === i ? "linkedin,facebook,email,show-all|More" : "go-share" === i ? "google,facebook,email,show-all|More" : "pin-share" === i ? "pinterest,facebook,email,show-all|More" : "re-share" === i ? "reddit,facebook,email,show-all|More" : this.$instanceContainer.data("shares"), this.getToolIdsAndCustomLabels(s), this.trackingTrigger("referrer-based-share-tools-loaded")) : this.getToolIdsAndCustomLabels(this.$instanceContainer.data("shares")), this.shareData = new n(this.$instanceContainer), this.el = document.createElement("ul"), this.$el = e(this.el), t.modalSettings && this.subscribe("nyt:open-share-modal", function (e) {
                e.instanceContainer && this.$instanceContainer.get(0) === e.instanceContainer.get(0) && new a({
                    instanceContainer: e.instanceContainer,
                    modalSettings: t.modalSettings,
                    trackingRegion: this.trackingRegion,
                    shareData: this.shareData
                })
            }), this.render())
        },
        render: function () {
            var i, n = void 0 !== t.find(this.toolIds, function (e) {
                    return "AD" === e
                }),
                s = this.$instanceContainer.find(".sharetools-inline-article-ad");
            this.renderToolViews(), this.$instanceContainer.attr(this.initializedAttribute, "1"), n && s.length ? this.$el.insertBefore(s) : this.$instanceContainer.append(this.el), i = this.$el.closest(".sharetools").attr("id"), "sharetools-masthead" === i && this.isTemplateMinimal() && e("#sharetools-masthead .show-all-sharetool .sharetool-text").text("Share")
        },
        isTemplateMinimal: function () {
            return this.$html.hasClass("template-minimal") ? !0 : void 0
        }
    }));
    return o
}), define("shared/sharetools/instances/masthead", ["jquery/nyt", "shared/sharetools/views/share-tools-container"], function (e, t) {
    "use strict";
    new t({
        el: e("#sharetools-masthead"),
        trackingRegion: "Masthead",
        modalSettings: {
            tailDirection: "up-right",
            tailLeftOffset: 0,
            tailTopOffset: -10,
            fixedOverride: !0,
            positionTailSide: !1,
            toggleSpeed: 1,
            toolTypeSponsor: "Article",
            openCallback: function () {
                this.listenToOnce(this.pageManager, "nyt:masthead-storytheme", function () {
                    this.close()
                })
            }
        }
    })
}), define("interactive/instances/sharetools", ["jquery/nyt", "shared/sharetools/views/share-tools-container", "shared/sharetools/instances/masthead"], function (e, t) {
    "use strict";
    var i, n = "Article";
    new t({
        el: e("#sharetools-interactive"),
        trackingRegion: "Body",
        modalSettings: {
            tailDirection: "up-right",
            tailLeftOffset: 10,
            tailTopOffset: 0,
            toolTypeSponsor: n,
            openCallback: function () {
                var e = this,
                    t = this.pageManager.getViewport().top;
                i = function () {
                    Math.abs(t - this.pageManager.getViewport().top) > 300 && e.close()
                }, this.listenTo(this.pageManager, "nyt:page-scroll", i), this.$target.addClass("active")
            },
            closeCallback: function () {
                this.stopListening(this.pageManager, "nyt:page-scroll", i), this.$target.removeClass("active"), this.removeFromPage()
            }
        }
    }), new t({
        el: e("#sharetools-interactive-mobile"),
        trackingRegion: "Body",
        modalSettings: {
            tailDirection: "up-left",
            tailLeftOffset: 10,
            tailTopOffset: 0,
            toolTypeSponsor: n,
            openCallback: function () {
                var e = this,
                    t = this.pageManager.getViewport().top;
                i = function () {
                    Math.abs(t - this.pageManager.getViewport().top) > 300 && e.close()
                }, this.listenTo(this.pageManager, "nyt:page-scroll", i), this.$target.addClass("active")
            },
            closeCallback: function () {
                this.stopListening(this.pageManager, "nyt:page-scroll", i), this.$target.removeClass("active"), this.removeFromPage()
            }
        }
    }), new t({
        el: e("#sharetools-footer, #upshot-sharetools"),
        trackingRegion: "Body",
        modalSettings: {
            tailDirection: "down-left",
            tailLeftOffset: 0,
            tailTopOffset: -10,
            fixedOverride: !0,
            positionTailSide: !1,
            toggleSpeed: 1,
            toolTypeSponsor: n
        }
    })
}), define("shared/ribbon/templates", ["underscore/nyt"], function (_) {
    var templates = {};
    return templates.ad = function (obj) {
        {
            var __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<li class="collection-item ribbon-ad-container">\n<div id="Ribbon" class="ad ribbon-ad">\n</div>\n</li>';
        return __p
    }, templates.article = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) {
            __p += '<li class="collection-item ' + (null == (__t = classString) ? "" : __t) + ' " >\n<a class="story-link" href="' + (null == (__t = newLink) ? "" : __t) + '">\n<div class="story-container">\n<article class="story theme-summary">\n';
            var image = article.getCrop("thumbStandard");
            __p += "\n", _.isEmpty(image) || (__p += '\n<div class="thumb">\n<img src="' + (null == (__t = image.url) ? "" : __t) + '" alt="" />\n', "image" !== image.type && (__p += '\n<div class="media-action-overlay">\n<i class="icon sprite-icon ' + (null == (__t = image.type) ? "" : __t) + '-icon"></i>\n<span class="overlay-text visually-hidden">' + (null == (__t = image.typeName) ? "" : __t) + "</span>\n</div>\n"), __p += "\n</div>\n"), __p += "", "" !== article.get("kicker") && (__p += '\n<h3 class="kicker">' + (null == (__t = article.get("kicker")) ? "" : __t) + "</h3>\n"), __p += '<h2 class="story-heading" title="' + (null == (__t = article.get("headline")) ? "" : __t) + '">' + (null == (__t = article.get("headline")) ? "" : __t) + "</h2>\n</article>\n</div>\n</a>\n</li>"
        }
        return __p
    }, templates.ribbonPageNavTip = function (obj) {
        {
            var __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<div class="placeholder-button-group">\n<div class="placeholder-button"><div class="previous"></div></div>\n<div class="placeholder-button"><div class="next"></div></div>\n</div>\n<h4>New!</h4>\n<p>Use your left and right arrow keys to browse articles.</p>';
        return __p
    }, templates.ribbonPageNavigation = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<nav data-href="' + (null == (__t = link) ? "" : __t) + '" data-queue-ad="' + (null == (__t = shouldQueueAd) ? "" : __t) + '" class="ribbon-page-navigation ' + (null == (__t = direction) ? "" : __t) + '" style="display:' + (null == (__t = display) ? "" : __t) + '; overflow:hidden;">\n<a href="' + (null == (__t = link) ? "" : __t) + '" >\n<article class="story theme-summary ', _.isEmpty(image) && (__p += " no-thumb "), __p += '" style="display:none;">\n', _.isEmpty(image) || (__p += '\n<div class="thumb">\n<img src="' + (null == (__t = image.url) ? "" : __t) + '" />\n</div>\n'), __p += '\n<div class="summary">\n', kicker && (__p += '\n<h3 class="kicker">' + (null == (__t = kicker) ? "" : __t) + "</h3>\n"), __p += '\n<h2 title="' + (null == (__t = title) ? "" : __t) + '" class="story-heading">' + (null == (__t = title) ? "" : __t) + '</h2>\n</div>\n</article>\n<div class="arrow arrow-', __p += "next" === direction ? "right" : "left", __p += '">\n<span class="visually-hidden">Go to the ' + (null == (__t = direction) ? "" : __t) + ' story</span>\n<div class="arrow-conceal"></div>\n</div>\n</a>\n</nav>';
        return __p
    }, templates.storyCollection = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<li class="collection ' + (null == (__t = collectionLabel.type) ? "" : __t) + '-collection">\n', collectionLabel.title && (__p += '\n<div class="collection-marker">\n<h2 class="label"><a href="' + (null == (__t = collectionLabel.url) ? "" : __t) + '">' + (null == (__t = collectionLabel.title) ? "" : __t) + "</a></h2>\n</div>\n"), __p += '\n<ol class="collection-menu">\n' + (null == (__t = storyCollection) ? "" : __t) + "\n</ol>\n</li>";
        return __p
    }, templates
}), define("shared/data/models/article", ["underscore/nyt", "backbone/nyt"], function (e, t) {
    "use strict";
    var i = t.Model.extend({
        defaults: {
            title: "",
            kicker: "",
            pubdate: "",
            link: "",
            media: [{
                caption: "",
                "media-metadata": [{
                    url: ""
                }]
            }],
            promotional_media: [{
                image: {
                    image_crops: {}
                }
            }],
            processed: !1
        },
        initialize: function () {
            this.adjustKicker()
        },
        adjustKicker: function () {
            this.isOpinion() && this.get("authors") && this.set("kicker", this.get("authors")[0])
        },
        isOpinion: function () {
            return "Op-Ed Columnist" === this.get("kicker") || "Opinionator" === this.get("kicker")
        },
        getCrop: function (e) {
            var t = this.get("promotional_media"),
                i = "",
                n = "image";
            try {
                if (t.type && "image" !== t.type) {
                    switch (n = t.type) {
                    case "video":
                        i = "Play Video";
                        break;
                    case "slideshow":
                        i = "View Slideshow";
                        break;
                    case "interactive":
                        i = "View Interactive";
                        break;
                    default:
                        i = "View Media"
                    }
                    t = t.promotional_media
                }
                return t.image.image_crops[e].type = n, t.image.image_crops[e].typeName = i, t.image.image_crops[e]
            } catch (s) {
                return {}
            }
        },
        getLink: function () {
            return this.get("link")
        },
        getType: function () {
            var e = "";
            return this.get("type") ? e = this.get("type") : this.get("item_type") && (e = this.get("item_type")), e.toLowerCase()
        },
        isVideo: function () {
            return "video" === this.getType()
        },
        getVideoKicker: function () {
            return this.get(this.get("kicker") ? "kicker" : "section")
        },
        createDateObject: function (e) {
            var t, i, n = new Date(e);
            return n.getDate() || e.search(/\d+T\d+/) >= 0 && (t = e.split("T")[0], i = t.split("-"), n = new Date(i[0], i[1] - 1, i[2])), n
        },
        getFormattedDate: function (e) {
            var t, i = ["Jan.", "Feb.", "March", "April", "May", "June", "July", "Aug.", "Sept.", "Oct.", "Nov.", "Dec."];
            return e = e || this.get("pubDate"), t = this.createDateObject(e), i[t.getMonth()] + " " + t.getDate() + ", " + t.getFullYear()
        },
        getDatetime: function (e) {
            var t;
            return e = e || this.get("pubDate"), t = this.createDateObject(e), t.getFullYear() + "-" + (t.getMonth() + 1) + "-" + t.getDate()
        }
    });
    return i
}), define("shared/data/models/most-popular", ["underscore/nyt", "backbone/nyt", "shared/data/models/article"], function (e, t, i) {
    "use strict";
    var n = i.extend({
        getVideoKicker: function () {
            return this.get("section")
        }
    });
    return n
}), define("shared/data/helpers/collection-mixin", [], function () {
    "use strict";
    var e = {
        hasFetched: !1,
        getNext: function (e, t) {
            var i = e.indexOf(t),
                n = i === e.length ? 0 : i + 1;
            return e.at(n)
        },
        loadData: function () {
            var e = this;
            return 0 !== this.length || this.hasFetched || (this.hasFetched = !0, this.fetch({
                success: function () {
                    e.trigger("fetchSuccess")
                },
                error: function () {
                    e.trigger("fetchError")
                }
            })), this
        },
        getIdentifier: function () {
            return "rref=" + this.sectionId
        },
        getName: function () {
            return this.sectionName
        },
        getUrl: function () {
            return this.sectionUrl
        }
    };
    return e
}), define("shared/data/collections/most-popular", ["backbone/nyt", "foundation/collections/base-collection", "shared/data/models/most-popular", "foundation/hosts", "underscore/nyt", "shared/data/helpers/collection-mixin"], function (e, t, i, n, s, a) {
    "use strict";
    var o = t.extend(s.extend({}, a, {
        model: i,
        apis: {
            mostviewed: {
                url: n.s1 + "/du/mostpopular/viewed/all_1.jsonp?v1",
                callback: "jsonCallbackViewed"
            },
            mostemailed: {
                url: n.s1 + "/du/mostpopular/emailed/all_1.jsonp?v1",
                callback: "jsonCallbackEmailed"
            },
            mostviewed7days: {
                url: n.du + "/svc/mostpopular/v2/viewed/7.jsonp",
                callback: "jsonCallbackMostEmailed7"
            },
            mosttweeted: {
                url: n.du + "/svc/mostpopular/v2/shared/1/twitter.jsonp",
                callback: "jsonCallbackTweeted"
            },
            mostsharedonfacebook: {
                url: n.du + "/svc/mostpopular/v2/shared/1/facebook.jsonp",
                callback: "jsonCallbackFacebook"
            }
        },
        initialize: function (e, t) {
            this.url = this.apis[t.type].url, this.callback = this.apis[t.type].callback
        },
        sync: function (t, i, n) {
            return n.dataType = "jsonp", n.jsonpCallback = this.callback, n.jsonp = "callback", n.cache = !0, e.sync(t, i, n)
        },
        parse: function (e) {
            var t = this,
                i = s.map(e.results, function (e) {
                    var i = [];
                    return e.id && (e.data_id = e.id, delete e.id), e.asset_id && delete e.asset_id, "" === e.media ? delete e.media : i = e.media[0]["media-metadata"] || [], e.promotional_media = {
                        image: {
                            image_crops: {
                                thumbStandard: t.getCrop(i, "Standard Thumbnail"),
                                mediumThreeByTwo210: t.getCrop(i, "mediumThreeByTwo210"),
                                superJumbo: t.getCrop(i, "superJumbo")
                            }
                        }
                    }, e.description = e["abstract"], e.link = e.url, e.kicker = e.column, e.headline = e.title, e.authors = [e.byline.replace("By ", "").replace(/\w\S*/g, function (e) {
                        return e.charAt(0).toUpperCase() + e.substr(1).toLowerCase()
                    })], e.pubDate = e.published_date, e
                });
            return i
        },
        getCrop: function (e, t) {
            var i, n;
            for (i = 0, n = e.length; n > i; i += 1)
                if (e[i].format === t) return e[i]
        },
        getIdentifier: function () {
            return "src=me"
        }
    }));
    return o
}), define("shared/data/instances/most-emailed", ["foundation/views/page-manager", "shared/data/collections/most-popular"], function (e, t) {
    "use strict";
    if (!e.flag("mostEmailedAbTest")) return new t([], {
        type: "mostemailed"
    });
    switch (window.NYTABTEST.engine.isUserVariant("mostEmailed")) {
    case "1":
        return new t([], {
            type: "mostsharedonfacebook"
        });
    case "2":
        return new t([], {
            type: "mosttweeted"
        });
    case "3":
        return new t([], {
            type: "mostemailed"
        });
    case "4":
        return new t([], {
            type: "mostsharedonfacebook"
        });
    case "5":
        return new t([], {
            type: "mosttweeted"
        });
    default:
        return new t([], {
            type: "mostemailed"
        })
    }
}), define("shared/data/collections/recommendations", ["backbone/nyt", "foundation/collections/base-collection", "shared/data/models/article", "foundation/hosts", "underscore/nyt", "shared/data/helpers/collection-mixin"], function (e, t, i, n, s, a) {
    "use strict";
    var o = t.extend(s.extend({}, a, {
        model: i,
        url: n.du + "/svc/recommendations/v3/personalized.jsonp",
        sync: function (t, i, n) {
            return n.dataType = "jsonp", n.jsonpCallback = "jsonRecommended", n.jsonp = "callback", n.cache = !0, n.data = {
                access_key: "776ACB1E-6C7F-4702-9E18-CF329376F5A3"
            }, e.sync(t, i, n)
        },
        parse: function (e) {
            var t = this,
                i = s.map(e.suggestions, function (e) {
                    var i = e.thumbs || {};
                    return e.promotional_media = {
                        image: {
                            image_crops: {
                                thumbStandard: e.thumbnail,
                                mediumThreeByTwo210: t.getCrop(i, "mediumThreeByTwo210")
                            }
                        }
                    }, e.kicker && "Video" === e.item_type && (e.kicker = "Video | " + e.kicker), e.authors = e.byline ? [e.byline.replace("By ", "").replace(/\w\S*/g, function (e) {
                        return e.charAt(0).toUpperCase() + e.substr(1).toLowerCase()
                    })] : "", e.description = e["abstract"], e.link = e.url, e.headline = e.title, e.pubDate = e.published_date, e
                });
            return this.num_articles = e.num_articles, this.uid = e.uid, this.user_displayname = e.user_displayname, this.user_pic_url = e.user_pic_url, i
        },
        getCount: function () {
            return this.num_articles || 0
        },
        getUserId: function () {
            return this.uid || 0
        },
        getUserDisplayName: function () {
            return this.user_displayname || null
        },
        getUserPictureUrl: function () {
            return this.user_pic_url || null
        },
        getCrop: function (e, t) {
            var i, n;
            for (i = 0, n = e.length; n > i; i += 1)
                if (e[i].type === t) return e[i].url = e[i].content, e[i]
        },
        getIdentifier: function () {
            return "src=recg"
        }
    }));
    return o
}), define("shared/data/instances/recommendations", ["jquery/nyt", "foundation/views/page-manager", "shared/data/collections/recommendations"], function (e, t, i) {
    "use strict";
    return new i
}), define("shared/data/collections/context", ["backbone/nyt", "foundation/collections/base-collection", "shared/data/models/article", "foundation/hosts", "underscore/nyt", "shared/data/helpers/collection-mixin"], function (e, t, i, n, s, a) {
    "use strict";
    var o = t.extend(s.extend({}, a, {
        model: i,
        sync: function (t, i, n) {
            var s, a = this.pageManager.getMeta("article:collection");
            return a ? (n.url = a, n.dataType = "jsonp", s = n.url.match(/sectionfronts\/(.+)\/index/) || ["", "homepage"], n.jsonpCallback = "jsonFeedCallback_" + s[1].replace(/\/|\-/g, "_"), this.sectionId = s[1], e.sync(t, i, n)) : null
        },
        parse: function (e) {
            return this.sectionName = e.title.replace("NYT > ", ""), this.sectionUrl = e.link, e.items
        }
    }));
    return o
}), define("shared/data/instances/context", ["jquery/nyt", "foundation/views/page-manager", "shared/data/collections/context"], function (e, t, i) {
    "use strict";
    return new i
}), define("shared/data/collections/top-news", ["underscore/nyt", "backbone/nyt", "foundation/collections/base-collection", "shared/data/models/article", "foundation/hosts", "shared/data/helpers/collection-mixin"], function (e, t, i, n, s, a) {
    "use strict";
    var o = i.extend(e.extend({}, a, {
        model: n,
        initialize: function () {
            this.url = s.json + ("us" === this.pageManager.getEdition() ? "/services/json/sectionfronts/index.jsonp" : "/services/json/sectionfronts/international/index.jsonp")
        },
        sync: function (e, i, n) {
            return n.dataType = "jsonp", n.jsonpCallback = "us" === this.pageManager.getEdition() ? "jsonFeedCallback_homepage" : "jsonFeedCallback_international", t.sync(e, i, n)
        },
        parse: function (e) {
            return e.items
        },
        getIdentifier: function () {
            return "rref=homepage"
        }
    }));
    return o
}), define("shared/data/instances/top-news", ["jquery/nyt", "foundation/views/page-manager", "shared/data/collections/top-news"], function (e, t, i) {
    "use strict";
    return new i
}), define("shared/data/collections/section-origin", ["underscore/nyt", "backbone/nyt", "foundation/collections/base-collection", "shared/data/models/article", "foundation/hosts", "shared/data/helpers/collection-mixin"], function (e, t, i, n, s, a) {
    "use strict";
    var o = i.extend(e.extend({}, a, {
        model: n,
        sync: function (e, i, n) {
            var a, o, r = this.pageManager.getUrlParam("rref");
            return r ? a = r : (o = this.createAnchor(document.referrer), a = o.pathname.match(/pages\/(.+)\//)[1]), n.url = s.json + "/services/json/sectionfronts/" + a + "/index.jsonp", n.dataType = "jsonp", n.jsonpCallback = "jsonFeedCallback_" + a.replace(/\/|\-/g, "_"), this.sectionId = a, t.sync(e, i, n)
        },
        parse: function (e) {
            return this.sectionName = e.title.replace("NYT > ", ""), this.sectionUrl = e.link, e.items
        }
    }));
    return o
}), define("shared/data/instances/section-origin", ["jquery/nyt", "foundation/views/page-manager", "shared/data/collections/section-origin"], function (e, t, i) {
    "use strict";
    return new i
}), define("shared/data/collections/nyt-collection", ["jquery/nyt", "underscore/nyt", "backbone/nyt", "foundation/collections/base-collection", "foundation/hosts", "shared/data/helpers/collection-mixin", "shared/data/models/article"], function (e, t, i, n, s, a, o) {
    "use strict";
    var r = n.extend(t.extend({}, a, {
        model: o,
        url: s.addNew,
        IDQuery: "",
        typeQuery: "",
        meta: "",
        type: "",
        initialize: function (e, i) {
            t.bindAll(this, "getName", "getURL"), this.IDQuery = i.IDQuery ? i.IDQuery : "", this.typeQuery = i.typeQuery ? i.typeQuery : "", this.url = this.url + i.typeQuery + "/" + this.IDQuery
        },
        sync: function (e, t, n) {
            var a = s.www.replace(/^\/\//, "");
            return n.dataType = "json", n.cache = !0, n.data = {
                dom: a
            }, i.sync(e, t, n)
        },
        parse: function (e) {
            var i, n, s;
            return i = t.map(e.members.items, function (e) {
                return s = e.promotional_media, s && s.image && s.image.image_crops && (n = s.image.image_crops, e.thumbnail = n.mediumThreeByTwo210 && n.mediumThreeByTwo210.length > 0 ? n.mediumThreeByTwo210 : n.thumbWide || ""), "video" === e.data_type && (e.kicker = "Video"), e.link = e.url, e
            }), this.meta = e.papi.result, this.type = this.meta.data_type, i
        },
        getIdentifier: function () {
            var e = ["collection"];
            return e[1] = this.type, e[2] = this.getID(), "rref=" + e.join("/")
        },
        getName: function () {
            return this.meta[this.type].display_name
        },
        getDescription: function () {
            return this.meta[this.type].long_description
        },
        getTagLine: function () {
            return this.meta[this.type].tagline
        },
        getURL: function () {
            var e = this.type,
                t = this.meta[e].url ? this.meta[e].url : this.meta[e].landing_page_url;
            return t
        },
        getTone: function () {
            var e = this.type,
                t = this.meta[e].tone ? this.meta[e].tone.toLowerCase() : "";
            return t
        },
        getID: function () {
            return this.meta[this.type].name
        },
        getType: function () {
            return this.meta.data_type
        }
    }));
    return r
}), define("shared/data/instances/nyt-collection", ["jquery/nyt", "foundation/views/page-manager", "shared/data/collections/nyt-collection"], function (e, t, i) {
    "use strict";
    return new i([], {
        typeQuery: t.getMeta("nyt-collection:type"),
        IDQuery: t.getMeta("nyt-collection:identifier")
    })
}), define("shared/data/models/lda-article", ["underscore/nyt", "backbone/nyt", "shared/data/models/article"], function (e, t, i) {
    "use strict";
    var n = i.extend({
        getCrop: function (e) {
            var t, i, n = this.get("thumbs") ? this.get("thumbs") : [];
            for (i = 0; i < n.length; i += 1)
                if (t = n[i], t.type === e) return t;
            return null
        },
        getLink: function () {
            return this.get("id")
        },
        isVideo: function () {
            return "video" === this.get("type")
        },
        getVideoKicker: function () {
            return this.get("section")
        }
    });
    return n
}), define("shared/data/collections/lda-recommendations", ["jquery/nyt", "backbone/nyt", "foundation/views/page-manager", "foundation/collections/base-collection", "shared/data/models/lda-article", "foundation/hosts", "underscore/nyt", "shared/data/helpers/collection-mixin"], function (e, t, i, n, s, a, o, r) {
    "use strict";
    var l = n.extend(o.extend({}, r, {
        model: s,
        url: a.du + "/svc/recommendations/v3/related.jsonp",
        sync: function (e, n, s) {
            return s.dataType = "jsonp", s.jsonpCallback = "jsonLDA", s.jsonp = "callback", s.cache = !0, s.data = {
                access_key: "776ACB1E-6C7F-4702-9E18-CF329376F5A3",
                url: i.canonical
            }, t.sync(e, n, s)
        },
        parse: function (e) {
            return e && e.payload && e.payload.kw ? e.payload.kw : null
        }
    }));
    return l
}), define("shared/data/instances/lda-recommendations", ["jquery/nyt", "foundation/views/page-manager", "shared/data/collections/lda-recommendations"], function (e, t, i) {
    "use strict";
    return new i
}), define("shared/data/collections/trending-pages", ["underscore/nyt", "backbone/nyt", "foundation/collections/base-collection", "shared/data/models/article", "shared/data/helpers/collection-mixin"], function (e, t, i, n, s) {
    "use strict";
    var a = i.extend(e.extend({}, s, {
        model: n,
        url: "http://s1.nyt.com/du/trending/top_pages.jsonp",
        sync: function (e, i, n) {
            return n.dataType = "jsonp", n.jsonpCallback = "top_pages_callback", n.jsonp = "callback", n.cache = !0, t.sync(e, i, n)
        },
        parse: function (t) {
            var i = t.top_pages;
            return this.last_updated = t.updated_ts, e.map(i, function (e) {
                e.link = e.url
            }), i
        }
    }));
    return a
}), define("shared/data/instances/trending-pages", ["shared/data/collections/trending-pages"], function (e) {
    "use strict";
    return new e
}), define("shared/data/instances/facebook", ["shared/data/collections/most-popular"], function (e) {
    "use strict";
    return new e([], {
        type: "mostsharedonfacebook"
    })
}), define("shared/ribbon/collections/ribbon", ["backbone/nyt", "underscore/nyt", "foundation/collections/base-collection", "shared/data/models/article", "foundation/hosts", "foundation/models/user-data", "shared/data/instances/most-emailed", "shared/data/instances/recommendations", "shared/data/instances/context", "shared/data/instances/top-news", "shared/data/instances/section-origin", "shared/data/instances/nyt-collection", "shared/data/instances/lda-recommendations", "shared/data/instances/trending-pages", "shared/data/instances/facebook"], function (e, t, i, n, s, a, o, r, l, d, c, h, u, m, g) {
    "use strict";
    var p = i.extend({
        url: function () {
            return t.isFunction(this.feedUrl) && this.handleFeedAsFunction(this.feedUrl), this.feedUrl || ""
        },
        model: n,
        initialize: function (e) {
            t.bindAll(this, "getMostEmailed", "getContext", "getTopNews", "getRecommendations", "getOrigin", "getNytCollection", "getLdaRecommendations", "getMostPopular", "getMostShared"), this.collectionLabels = [], this.feedSource = [{
                nytCollection: this.getNytCollection
            }, {
                origin: this.getOrigin
            }, {
                context: this.getContext
            }, {
                mostEmailed: this.getMostEmailed
            }, {
                homepage: this.getTopNews
            }, {
                recommendations: this.getRecommendations
            }, {
                world: s.json + "/services/json/sectionfronts/world/index.jsonp"
            }, {
                us: s.json + "/services/json/sectionfronts/national/index.jsonp"
            }, {
                business: s.json + "/services/json/sectionfronts/business/index.jsonp"
            }, {
                opinion: s.json + "/services/json/sectionfronts/opinion/index.jsonp"
            }, {
                technology: s.json + "/services/json/sectionfronts/technology/index.jsonp"
            }, {
                politics: s.json + "/services/json/sectionfronts/politics/index.jsonp"
            }, {
                sports: s.json + "/services/json/sectionfronts/sports/index.jsonp"
            }, {
                science: s.json + "/services/json/sectionfronts/science/index.jsonp"
            }, {
                health: s.json + "/services/json/sectionfronts/health/index.jsonp"
            }, {
                arts: s.json + "/services/json/sectionfronts/arts/index.jsonp"
            }, {
                style: s.json + "/services/json/sectionfronts/style/index.jsonp"
            }, {
                nyregion: s.json + "/services/json/sectionfronts/nyregion/index.jsonp"
            }], this.currentArticleUrl = e.currentArticleUrl, this.originalLoadType = "context", this.feedUrl = this.setFeedUrl(e.sectionFeedUrl), this.subscribe(this, "sync", this.setCurrentArticle)
        },
        loadData: function () {
            t.isFunction(this.feedUrl) ? this.handleFeedAsFunction(this.feedUrl) : this.fetch()
        },
        sync: function (t, i, n) {
            var s = this.url().match(/sectionfronts\/(.+)\/index/) || ["", "homepage"];
            return n.dataType = "jsonp", n.jsonpCallback = "jsonFeedCallback_" + s[1].replace("/", "_"), this.sectionId = "rref=" + s[1], e.sync(t, i, n)
        },
        setCurrentArticle: function () {
            var e = this;
            this.currentArticle = this.find(function (t) {
                return t.get("link") === e.currentArticleUrl
            })
        },
        parse: function (e) {
            return this.prepCollection(e.items, e.title.replace("NYT > ", ""), e.link, "news")
        },
        getFeedSourceValue: function (e) {
            var t, i;
            for (t = 0, i = this.feedSource.length; i > t; t++)
                if (this.feedSource[t].hasOwnProperty(e)) return this.feedSource[t][e]
        },
        removeFeedByKey: function (e) {
            var i, n;
            for (i = 0, n = this.feedSource.length; n > i; i++)
                if (t.keys(this.feedSource[i])[0] === e) return void this.feedSource.splice(i, 1)
        },
        removeFeedByUrl: function (e) {
            var i, n, s, a = this.createAnchor(e).pathname;
            for (i = 0, n = this.feedSource.length; n > i; i++)
                if (s = t.values(this.feedSource[i])[0], !t.isFunction(s) && s.indexOf(a) > -1) return void this.feedSource.splice(i, 1)
        },
        createAnchor: function (e) {
            var t = document.createElement("a");
            return t.href = e, t
        },
        isUrlForSection: function (e, t) {
            var i = this.createAnchor(e).pathname,
                n = this.createAnchor(this.getFeedSourceValue(t)).pathname;
            return i === n
        },
        setFeedUrl: function () {
            var e, t, i, n, s = this,
                o = this.pageManager.getUrlParam("src") || "",
                r = this.pageManager.getUrlParam("rref"),
                l = h.IDQuery,
                d = "origin";
            return r && (n = decodeURIComponent(r).split("/")), n && 3 === n.length && n[2] === l ? t = "nytCollection" : r && "homepage" !== r ? (this.removeFeedByKey(r), t = "origin") : "" === this.pageManager.getUrlParam("hp") || "homepage" === r ? t = "homepage" : this.pageManager.getUrlParam("ref") ? (e = this.createAnchor(document.referrer), /.nytimes.com$/.test(e.host) && /^\/pages/.test(e.pathname) ? t = "origin" : (t = "context", d = "context")) : "me" === o ? t = "mostEmailed" : 0 === o.indexOf("rec") ? t = "recommendations" : (t = "context", d = "context"), i = this.getFeedSourceValue(t), this.originalLoadType = d, l || this.removeFeedByKey("nytCollection"), this.removeFeedByKey("context"), this.removeFeedByKey("origin"), this.removeFeedByKey(t), a.ready(function () {
                a.isLoggedIn() || s.removeFeedByKey("recommendations")
            }), i = this.handleRibbonContentOverrides() || i
        },
        handleFeedAsFunction: function (e) {
            var i = e();
            t.isArray(i) ? (this[1 === this.length ? "reset" : "add"](i), this.local(this, "sync"), this.local(this, "nyt:ribbon-custom-collection-loaded")) : i()
        },
        loadFeed: function () {
            var e;
            return this.feedSource.length > 0 ? (e = t.values(this.feedSource.shift())[0], t.isFunction(e) ? this.handleFeedAsFunction(e) : (this.feedUrl = e, this.fetch({
                remove: !1
            })), !0) : !1
        },
        getAdModel: function () {
            return new n({
                processed: !1,
                isAd: !0
            })
        },
        prepCollection: function (e, t, i, n) {
            var s, a, o = this.collectionLabels.length;
            for (s = 0, a = e.length; a > s; s += 1) e[s].collectionId = o;
            return this.collectionLabels.push({
                title: t,
                url: i,
                type: n
            }), e
        },
        next: function (e) {
            var t, i = this.indexOf(e);
            return t = i === this.length ? 0 : i + 1, this.local(this, "nyt:ribbon-collection-next", this.models[t]), this.models[t]
        },
        previous: function (e) {
            var t, i = this.indexOf(e);
            return t = 0 === i ? this.models.length : i - 1, this.local(this, "nyt:ribbon-collection-previous", this.models[t]), this.models[t]
        },
        importCollection: function (e) {
            var i, n = this,
                s = e.collection.toJSON();
            return s.length > 0 ? (e.name = t.isFunction(e.name) ? e.name() : e.name, e.url = t.isFunction(e.url) ? e.url() : e.url, this.sectionId = e.collection.getIdentifier(), this.prepCollection(s, e.name, e.url, e.type)) : (this.feedSource.unshift(e.callback), function () {
                var t = function () {
                    window.clearTimeout(i), n.loadFeed()
                };
                i = window.setTimeout(function () {
                    n.stopSubscribing(e.collection, "sync", t), n.feedSource.shift(), n.pageManager.flag("ribbonStarterCollection") && n.isUserVariant("ribbonStarterCollection") && (n.feedSource = [{
                        homepage: n.getTopNews
                    }]), n.loadFeed()
                }, 1500), n.subscribeOnce(e.collection, "sync", t)
            })
        },
        getIdentifier: function () {
            return this.sectionId
        },
        getMostEmailed: function () {
            return this.importCollection({
                collection: o.loadData(),
                name: "Most Emailed",
                url: s.www + "/most-popular-emailed",
                type: "most-emailed",
                callback: {
                    mostEmailed: this.getMostEmailed
                }
            })
        },
        getNytCollection: function () {
            return this.importCollection({
                collection: h.loadData(),
                name: h.getName,
                url: h.getURL,
                type: "nytCollection",
                callback: {
                    nytCollection: this.getNytCollection
                }
            })
        },
        getRecommendations: function () {
            return this.importCollection({
                collection: r.loadData(),
                name: "Recommended",
                url: s.www + "/recommendations",
                type: "news",
                callback: {
                    recommendations: this.getRecommendations
                }
            })
        },
        getTopNews: function () {
            return this.importCollection({
                collection: d.loadData(),
                name: "Home Page",
                url: s.www,
                type: "news",
                callback: {
                    homepage: this.getTopNews
                }
            })
        },
        getContext: function () {
            var e = this.pageManager.getMeta("article:collection") || "";
            return this.removeFeedByUrl(e), this.importCollection({
                collection: l.loadData(),
                name: l.getName(),
                url: l.getUrl(),
                type: "news",
                callback: {
                    context: this.getContext
                }
            })
        },
        getOrigin: function () {
            return this.removeFeedByKey(this.pageManager.getUrlParam("ref")), this.importCollection({
                collection: c.loadData(),
                name: c.getName(),
                url: c.getUrl(),
                type: "news",
                callback: {
                    origin: this.getOrigin
                }
            })
        },
        getLdaRecommendations: function () {
            var e = this.pageManager.getMeta("article:section"),
                t = this.pageManager.getMeta("article:section_url");
            return this.importCollection({
                collection: u.loadData(),
                name: e,
                url: t,
                type: "news",
                callback: {
                    ldaRecommendations: this.getLdaRecommendations
                }
            })
        },
        getMostPopular: function () {
            return this.importCollection({
                collection: m.loadData(),
                name: "Most Popular",
                url: s.www + "/most-popular",
                type: "news",
                callback: {
                    mostPopular: this.getMostPopular
                }
            })
        },
        getMostShared: function () {
            return this.importCollection({
                collection: g.loadData(),
                name: "Most Shared on Facebook",
                url: s.www + "/most-popular-facebook",
                type: "news",
                callback: {
                    mostShared: this.getMostShared
                }
            })
        },
        handleRibbonContentOverrides: function () {
            var e = this.isUserVariant("ribbonStarterCollection"),
                t = {
                    1: {
                        name: "ldaRecommendations",
                        callback: this.getLdaRecommendations
                    },
                    2: {
                        name: "mostPopular",
                        callback: this.getMostPopular
                    },
                    3: {
                        name: "mostShared",
                        callback: this.getMostShared
                    },
                    4: {
                        name: "topNews",
                        callback: this.getTopNews
                    }
                };
            return this.pageManager.flag("ribbonStarterCollection") && t[e] ? (this.loadType = t[e].name, this.originalLoadType = this.loadType, this.feedSource = [], t[e].callback) : !1
        }
    });
    return p
}), define("shared/ribbon/instances/ribbon-data", ["jquery/nyt", "foundation/views/page-manager", "shared/ribbon/collections/ribbon"], function (e, t, i) {
    "use strict";
    var n = e('head link[rel="canonical"]').attr("href"),
        s = t.getMeta("article:collection");
    return new i({
        sectionFeedUrl: s,
        currentArticleUrl: n
    })
}), define("shared/ribbon/views/helpers/mixin", ["underscore/nyt", "jquery/nyt"], function (e, t) {
    "use strict";
    var i = {
        collectionStoryWidth: 249,
        getActiveModel: function (t) {
            var i = this;
            return e.find(t, function (e) {
                return e.get("link") === i.canonical
            })
        },
        getStoryIndex: function (t, i) {
            var n;
            return i || (i = this.getActiveModel(t)), n = e.indexOf(t, i), n >= 0 ? n : 0
        },
        getAdIndex: function (e) {
            var i, n, s = t("#ribbon"),
                a = this.pageManager.getUrlParam("ribbon-ad-idx");
            return a ? i = a : this.pageManager.getCurrentBreakpoint() <= 1e4 ? (0 === e ? i = n = this.storyUnitsInView() : (n = Math.floor((s.width() - .25 * this.collectionStoryWidth) / this.collectionStoryWidth), i = e + n), n > 1 && (i -= 1)) : i = this.getLargeScreenAdPosition(e), i
        },
        getLargeScreenAdPosition: function (e) {
            var i, n, s, a = "ribbon" === this.$el.attr("id") ? this.$el : t("#ribbon"),
                o = this.storyUnitsInView(a);
            return i = 0 === e ? a.width() : a.width() - .25 * this.collectionStoryWidth, n = i % this.collectionStoryWidth > .25 * this.collectionStoryWidth, s = n ? o - 1 : o - 2, s += e
        },
        storyUnitsInView: function (e) {
            return e || (e = this.$el), Math.floor(e.width() / this.collectionStoryWidth)
        },
        createAdsDeferral: function (e) {
            this.pageManager.getMeta("ads_adNames") ? e() : (this.adxTimeout = window.setTimeout(e, 500), this.subscribeOnce("nyt:ads-rendered", e))
        }
    };
    return i
}), define("shared/ribbon/views/ribbon-page-navigation", ["jquery/nyt", "underscore/nyt", "foundation/hosts", "foundation/views/base-view", "foundation/views/page-manager", "shared/ribbon/instances/ribbon-data", "shared/ribbon/templates", "shared/modal/views/modal", "foundation/models/page-storage", "shared/ribbon/views/helpers/mixin"], function (e, t, i, n, s, a, o, r, l, d) {
    "use strict";
    var c = n.registerView("arrows").extend(t.extend({}, d, {
        el: "body",
        delay: 200,
        speed: 250,
        expandWidth: 275,
        expanded: !1,
        events: {
            "click .ribbon-page-navigation": "changeArticle",
            "mouseenter .ribbon-page-navigation": "showArticle",
            "mouseleave .ribbon-page-navigation": "hideArticle",
            "mouseleave #ribbon-page-navigation-modal .modal": "hideArticle"
        },
        nytEvents: {
            "nyt:comments-panel-opened": "hideRightArrow",
            "nyt:comments-panel-closed": "showRightArrow",
            "nyt:page-drag": "handlePageDrag"
        },
        initialize: function () {
            t.bindAll(this, "preventScroll", "checkForFeed"), this.feed = a, this.subscribe("nyt:ads-fire-ribbon-interstitial", this.ribbonInterstitialFired), this.pageManager.isDomReady() ? this.handlePageReady() : this.subscribe("nyt:page-ready", this.handlePageReady), this.trackingBaseData = {
                module: "ArrowsNav",
                contentCollection: this.pageManager.getMeta("article:section")
            }
        },
        handlePageReady: function () {
            this.restrict = this.pageManager.isComponentVisible(e("#ribbon")), this.createAdsDeferral(this.checkForFeed)
        },
        checkForFeed: function () {
            var e = this;
            this.feed.length > 1 && this.render(), this.subscribeOnce(a, "sync", this.render), l.ready(function () {
                l.get("ribbon_hasViewedTooltip") !== !0 && e.addToolTip()
            })
        },
        render: function () {
            var t = this.feed.currentArticle,
                i = this.feed.previous(t),
                n = this.feed.next(t);
            this.activeStoryIndex = this.getStoryIndex(this.feed.models, this.feed.currentArticle), this.$arrows = e(this.createTemplate("previous", i) + this.createTemplate("next", n)), this.$shell.append(this.$arrows), this.adjustArrows(), this.adjustText(), this.subscribe("nyt:page-resize", this.adjustArrows), this.subscribe("nyt:ribbon-visiblility", this.restrictArrow), this.subscribe("nyt:ribbon-left", this.handleKeyboardLeftArrow), this.subscribe("nyt:ribbon-right", this.handleKeyboardRightArrow), this.pageManager.isMobile() && this.$arrows.hide()
        },
        adjustArrows: function () {
            var e, t, i = this.pageManager.getCurrentBreakpoint(),
                n = this.$arrows.filter(".previous"),
                s = this.$arrows.filter(".next");
            if (i >= 10070) e = this.$window.width(), t = this.$shell.width(), n.css("left", (e - t) / 2), s.css("right", (e - t) / 2), this.cssControl = !1;
            else {
                if (this.cssControl) return;
                n.css("left", ""), s.css("right", ""), this.cssControl = !0
            }
        },
        adjustText: function () {
            var t, i, n, s;
            this.$arrows.each(function (a, o) {
                n = e(o), i = n.find(".story"), t = n.find(".story .summary"), s = parseInt(i.css("padding-top"), 10), i.css({
                    display: "block",
                    opacity: 0
                }), t.css("margin-top", n.height() / 2 - t.height() / 2 - s), i.css({
                    display: "none",
                    opacity: 1
                })
            })
        },
        restrictArrow: function (e) {
            this.restrict = e
        },
        previousPage: function () {
            var e = this.$arrows.filter(".previous"),
                t = e.data("href");
            t && (window.location = t)
        },
        nextPage: function () {
            var e = this.$arrows.filter(".next"),
                t = e.data("href");
            t && (window.location = t)
        },
        createTemplate: function (e, i) {
            var n, s, a, r = {
                direction: e,
                display: "none",
                title: "",
                image: "",
                link: "",
                kicker: "",
                shouldQueueAd: !1
            };
            return i && (t.indexOf(this.pageManager.getMeta("ads_adNames"), "Ribbon") >= 0 && (a = this.getAdIndex(this.activeStoryIndex), n = a - t.indexOf(this.feed.models, i), s = "previous" === e && 1 === n || "next" === e && 0 === n), r = {
                direction: e,
                display: "block",
                title: i.get("headline") || i.get("title"),
                image: i.getCrop("thumbStandard"),
                link: this.processLink(i.get("link"), a),
                kicker: i.get("kicker"),
                shouldQueueAd: s
            }), o.ribbonPageNavigation(r)
        },
        processLink: function (e, t) {
            var n = document.createElement("a");
            return n.href = e, 0 === n.hostname.indexOf("www") && 0 === window.location.hostname.indexOf("www") && (e = 0 === n.pathname.indexOf("/") ? i.www + n.pathname : i.www + "/" + n.pathname), t && (e += "?ribbon-ad-idx=" + t), e += /\?/.test(e) ? "&" : "?", e += this.feed.getIdentifier(), n.search.length > 0 && (e += n.search.replace("?", "&")), e
        },
        changeArticle: function (t) {
            var i, n;
            t.preventDefault(), i = e(t.currentTarget), n = this.trackingAppendParams(i.data("href"), {
                action: "click",
                region: i.is(".next") ? "FixedRight" : "FixedLeft"
            }), this.fireQueuedAd(i) !== !0 && (window.location = n)
        },
        fireQueuedAd: function (t) {
            var i = t.data("queue-ad"),
                n = e(".ribbon-ad");
            return e("#ribbon").find(".collection-item").removeClass("active"), i !== !0 ? !1 : (n.find("> iframe").length > 0 ? (this.broadcast(this.pageManager.flag("dfpAds") && this.pageManager.$html.hasClass("dfp-enabled") ? "nyt:ad-library:dfp:ribbon-interstitial" : "nyt:ads-fire-ribbon-interstitial"), t.data("queue-ad", !1)) : window.location = n.find("#ribbonAdBodytxt").attr("href"), !0)
        },
        ribbonInterstitialFired: function () {
            this.pageManager.isMobile() && this.$arrows.show()
        },
        preventScroll: function (e) {
            this.scrollLock = !0, e.preventDefault()
        },
        handlePageDrag: function (e, t) {
            var i, n, s, a, o = this.expandWidth,
                r = 0,
                l = this.pageManager.getMeta("mediaviewer_isVisible") || !1;
            return !l && e.gesture ? (a = 1.5 * e.gesture.distance - 20, this.scrollLock || this.$document.on("touchmove", this.preventScroll), "left" === e.gesture.direction ? n = this.$arrows.filter(".next") : "right" === e.gesture.direction && (n = this.$arrows.filter(".previous")), !n || !n.data("href") || e.gesture.distance < 20 ? (this.$arrows.hide(), this.$document.off("touchmove", this.preventScroll), void(this.scrollLock = !1)) : void("right" === t || "left" === t ? (a = o > a ? a : o, a = a > r ? a : r, i = 100 > a ? "hide" : "show", n.show().css("width", a + "px").find(".story")[i](), this.truncateArticleSummary(n)) : n && "end" === t ? (n.width() < o - 5 ? n.hide() : (s = this.trackingAppendParams(n.data("href"), {
                action: "swipe",
                region: "left" === e.gesture.direction ? "FixedRight" : "FixedLeft"
            }), window.location = s), this.$document.off("touchmove", this.preventScroll), this.scrollLock = !1) : "start" !== t && (this.$arrows.hide(), this.$document.off("touchmove", this.preventScroll), this.scrollLock = !1))) : void 0
        },
        handleKeyboardLeftArrow: function () {
            var e = this.$arrows.filter(".previous"),
                t = this.trackingAppendParams(e.data("href"), {
                    action: "keypress",
                    region: "FixedLeft"
                });
            this.fireQueuedAd(e) !== !0 && (e.data("href", t), this.previousPage())
        },
        handleKeyboardRightArrow: function () {
            var e = this.$arrows.filter(".next"),
                t = this.trackingAppendParams(e.data("href"), {
                    action: "keypress",
                    region: "FixedRight"
                });
            this.fireQueuedAd(e) !== !0 && (e.data("href", t), this.nextPage())
        },
        showArticle: function (t) {
            var i = this,
                n = e(t.currentTarget);
            this.restrict || this.expanded || "undefined" == typeof this.$arrows || (this.origWidth = this.$arrows.width(), this.timeout = window.setTimeout(function () {
                n.animate({
                    width: i.expandWidth
                }, {
                    duration: i.speed,
                    complete: function () {
                        return i.expanded ? (n.find(".story").fadeIn(i.speed), void i.truncateArticleSummary(n)) : !1
                    }
                }), i.expanded = !0
            }, this.delay))
        },
        truncateArticleSummary: function (e) {
            var t = 48,
                i = e.find(".story .summary");
            e.find(".story-heading").height() > t && (this.truncateText(e.find(".story-heading"), t), i.css("margin-top", e.find(".story-heading").height() / 2 - t / 2))
        },
        hideArticle: function (t) {
            var i = this,
                n = e("#ribbon-page-navigation-modal").find(".modal"),
                s = e(n.is(t.currentTarget) ? ".ribbon-page-navigation.next" : t.currentTarget);
            clearTimeout(this.timeout), !this.expanded || n.has(t.relatedTarget).length > 0 || (s.animate({
                width: i.origWidth
            }, {
                duration: this.speed,
                complete: function () {
                    s.css("width", "")
                }
            }).find(".story").hide(), this.expanded = !1)
        },
        showRightArrow: function () {
            this.$arrows && this.$arrows.filter(".next").show()
        },
        hideRightArrow: function () {
            this.$arrows && this.$arrows.filter(".next").hide()
        },
        addToolTip: function () {
            var e, t = this,
                i = new r({
                    id: "ribbon-page-navigation-modal",
                    modalContent: o.ribbonPageNavTip(),
                    binding: ".ribbon-page-navigation.next",
                    tailDirection: "right",
                    canOpenOnHover: !0,
                    width: "322px",
                    mouseEnterDelay: 500,
                    tailTopOffset: -5,
                    tailLeftOffset: 9,
                    closeOnMouseOut: !0,
                    openCallback: function () {
                        l.set("ribbon_hasViewedTooltip", !0), e = window.setTimeout(i.close, 2e4), t.subscribeOnce("nyt:page-scroll", i.close)
                    },
                    closeCallback: function () {
                        i.removeFromPage(), window.clearTimeout(e)
                    }
                });
            i.addToPage()
        }
    }));
    return c
}), define("shared/ribbon/views/ribbon", ["jquery/nyt", "underscore/nyt", "foundation/hosts", "foundation/views/base-view", "shared/ribbon/templates", "shared/ribbon/views/ribbon-page-navigation", "shared/ribbon/instances/ribbon-data", "shared/ribbon/views/helpers/mixin"], function (e, t, i, n, s, a, o, r) {
    "use strict";
    var l = n.registerView("ribbon").extend(t.extend({}, r, {
        el: "#ribbon",
        collection: o,
        template: s.storyCollection,
        articleTemplate: s.article,
        adTemplate: s.ad,
        isRibbonVisible: !1,
        firstLoad: !0,
        toggleDisabled: 0,
        oldScrollTop: 0,
        animationDistance: 100,
        minDownDistance: 100,
        minUpDistance: 300,
        speed: 200,
        hammerSettings: {
            drag_block_vertical: !0,
            swipe_velocity: .7,
            drag_min_distance: 3
        },
        events: {
            "click .collection-menu li a": "handleArticleClick",
            "click .ribbon-navigation-container .next": "handleNextArrow",
            "click .ribbon-navigation-container .previous": "handlePreviousArrow",
            mouseenter: "handleRibbonMouseEnter",
            mouseleave: "handleRibbonMouseOut",
            touch: "handleTouch",
            tap: "handleArticleClick",
            hold: "handleTouchHold",
            dragstart: "handleTouchDragStart",
            drag: "handleRibbonDrag",
            swipe: "handleRibbonSwipe"
        },
        nytEvents: {
            "nyt:page-resize": "resizeRibbon",
            "nyt:messaging-critical-alerts-move-furniture": "moveRibbonForAlerts",
            "nyt:messaging-suggestions-move-furniture": "moveRibbonForAlerts",
            "nyt:messaging-message-critical-alerts-closed": "enableRibbonToggle",
            "nyt:messaging-message-suggestions-closed": "enableRibbonToggle",
            "nyt:comments-panel-opened": "disableRibbonToggle",
            "nyt:comments-panel-closed": "enableRibbonToggle",
            "nyt:masthead-absolute": "disableRibbonToggle",
            "nyt:masthead-fixed": "enableRibbonToggle"
        },
        initialize: function () {
            t.bindAll(this, "handleMouseMove", "handleArticleClick", "handleRibbonAdClick", "hideCollectionMarkers", "pollHiddenCollections", "pollShowingTabs", "revertRibbon", "handleRibbonSwipe", "handleRibbonDrag", "handleTouch", "handleTouchHold", "handleTouchDragStart", "applyTranslateToRibbon", "assignListenersAndLoad"), this.isDesktop = this.pageManager.isDesktop(), this.canonical = this.pageManager.getCanonical(), this.trackingBaseData = {
                module: "Ribbon",
                version: this.collection.originalLoadType,
                region: "Header"
            }, this.listenToOnce(this.collection, "sync", t.bind(function () {
                this.trackingTriggerImpression("ribbon-first-load", {
                    eventName: "impression",
                    action: "impression",
                    contentCollection: this.collection.collectionLabels[0].title
                })
            }, this))
        },
        handleDomReady: function () {
            this.$loader = this.$(".ribbon-loader"), this.$html.addClass("has-ribbon"), this.ribbonMarginTop = parseInt(this.$el.css("margin-top"), 10), this.ribbonMarginBottom = parseInt(this.$el.css("margin-bottom"), 10), this.ribbonHeight = this.$el.height(), this.mastheadHeight = e("#masthead").height() - 1, this.toggleDisabled = !1, this.$ribbonMenu = this.$el.find(".ribbon-menu"), this.$ribbonNavigation = this.$el.find(".ribbon-navigation-container"), this.$previousArrow = this.$ribbonNavigation.find(".previous"), this.$nextArrow = this.$ribbonNavigation.find(".next"), this.isRibbonVisible = this.pageManager.isComponentVisible(this.$el), this.listenTo(this.pageManager, "nyt:page-scroll", this.handleScroll), this.createAdsDeferral(this.assignListenersAndLoad)
        },
        assignListenersAndLoad: function () {
            window.clearTimeout(this.adxTimeout), this.stopSubscribing("nyt:ads-rendered", this.assignListenersAndLoad), this.listenTo(this.collection, "sync", this.render), this.listenToOnce(this.collection, "sync", this.renderFurniture), this.listenTo(this.collection, "nyt:ribbon-custom-collection-loaded", this.render), this.collection.loadData(), new a
        },
        render: function () {
            var i, n, s, a, o, r, l, d, c = this,
                h = this.collectionStoryWidth + this.animationDistance,
                u = t.indexOf(this.pageManager.getMeta("ads_adNames"), "Ribbon") >= 0;
            i = this.collection.where({
                processed: !1
            }), 0 !== i.length && ((u || this.pageManager.getUrlParam("ribbon-ad-idx")) && this.firstLoad === !0 && (r = this.returnRibbonAdData(i, u), o = r.index, r.model && i.splice(r.index, 0, r.model)), n = this.collection.collectionLabels[i[0].get("collectionId")], n && (s = e(this.template({
                storyCollection: this.createStoryCollection(i, o),
                collectionLabel: n
            })), a = this.collection.length * h + this.$loader.width() + this.collection.collectionLabels.length, this.$ribbonMenu.css("width", a), this.$loader.before(s), (this.firstLoad && !this.referredFromArticle() || !this.firstLoad) && this.animateRibbonStories(s), l = this.$el.find("#Ribbon"), l.length > 0 && this.firstLoad === !0 && (this.pageManager.flag("dfpAds") && this.pageManager.$html.hasClass("dfp-enabled") ? this.subscribe("nyt:ad-library:dfp:ribbon-ad-visible", function (e) {
                d = e.find("> a"), d.length && d.attr("href", d.attr("href") + "?" + this.collection.getIdentifier()), 0 === e.find(".ribbonAdPaid").length && c.assignHandlerToIframeClick(e.find("iframe"), c.handleRibbonAdClick)
            }) : (this.broadcast("nyt:ads-new-placement", "Ribbon"), d = l.find("> a"), d.length && d.attr("href", d.attr("href") + "?" + this.collection.getIdentifier()), t.defer(function () {
                c.assignHandlerToIframeClick(l.find("iframe"), c.handleRibbonAdClick)
            }))), this.assignSyncedHtmlToView(), this.updateCollectionValues(), this.firstLoad = !1, this.broadcast("nyt:ribbon-rendered")))
        },
        createStoryCollection: function (e, i) {
            var n = this,
                s = "";
            return t.each(e, function (e, a, o) {
                var r, l = [],
                    d = e.get("link"),
                    c = n.processLink(d, i),
                    h = e.get("kicker");
                t.isObject(h) && e.set("kicker", h.name), -1 !== d.indexOf(n.canonical) && n.firstLoad && l.push("active"), a === o.length - 1 && l.push("last-collection-item"), r = l.join(" "), s += e.get("isAd") !== !0 ? n.articleTemplate({
                    article: e,
                    classString: r,
                    newLink: c
                }) : n.adTemplate(), e.set("processed", !0)
            }), s
        },
        processLink: function (e, t) {
            var n = document.createElement("a"),
                s = this.collection.getIdentifier();
            return n.href = e, 0 === n.hostname.indexOf("www") && 0 === window.location.hostname.indexOf("www") && (e = 0 === n.pathname.indexOf("/") ? i.www + n.pathname : i.www + "/" + n.pathname), t && (e += "?ribbon-ad-idx=" + t), e += /\?/.test(e) ? "&" : "?", e += s, n.search.length > 0 && (e += n.search.replace("?", "&")), e
        },
        assignHandlerToIframeClick: function (e, t) {
            var i, n;
            e.length && (i = e.get(0), n = i.contentDocument || i.contentWindow.document, "undefined" != typeof n.addEventListener ? n.addEventListener("click", t, !1) : "undefined" != typeof n.attachEvent && n.attachEvent("onclick", t))
        },
        returnRibbonAdData: function (e, t) {
            var i, n, s;
            return s = this.getStoryIndex(e), i = this.getAdIndex(s), t && (n = this.collection.getAdModel()), {
                index: i,
                model: n
            }
        },
        referredFromArticle: function () {
            var e, t = document.createElement("a");
            return document.referrer ? (t.href = document.referrer, e = t.pathname, t.hostname.indexOf("nytimes.com") > -1 && /^(\/\w+)?\/\d+/.test(e)) : !1
        },
        renderFurniture: function () {
            var e = -this.$el.find(".active").index();
            this.ribbonAnimation(e, !0), this.testForCollectionEnd() && this.collection.loadFeed(), Modernizr.touch ? this.assignCustomEasing() : this.collectionMarkerTimeout = setTimeout(this.hideCollectionMarkers, 2e3)
        },
        assignCustomEasing: function () {
            return e.easing.easeOutCirc = function (e, t, i, n, s) {
                return n * Math.sqrt(1 - (t = t / s - 1) * t) + i
            }, this
        },
        matrixToArray: function (e) {
            return e.substr(7, e.length - 8).split(", ")
        },
        returnXForTransform: function () {
            var e = this.$ribbonMenu.css("-webkit-transform");
            return "none" === e ? this.$ribbonMenu.position().left : parseInt(this.matrixToArray(e)[4], 10)
        },
        applyTranslateToRibbon: function (e) {
            var t;
            return isNaN(e) ? void 0 : (t = "translate3d(" + e + "px, 0, 0)", this.$ribbonMenu.css({
                transform: t,
                "-webkit-transform": t,
                msTransform: t
            }))
        },
        handleRibbonDrag: function (e) {
            var t, i, n, s, a = this.returnXForTransform();
            e.gesture && (e.gesture.preventDefault(), t = this.startDragLocation - a, i = 0 === t ? e.gesture.deltaX : e.gesture.deltaX + t, s = this.handleRibbonEdges(a + i), n = this.testForCollectionEnd(this.startDragLocation), this.applyTranslateToRibbon(s), this.testForCollectionEnd() && !n && this.collection.loadFeed(), e.gesture.deltaX < 0 ? this.pollShowingTabs() : this.pollHiddenCollections())
        },
        returnStartingXForTransform: function () {
            var e = this.$ribbonMenu.css("transform");
            return "none" === e ? this.$ribbonMenu.position().left : parseInt(this.matrixToArray(e)[4], 10)
        },
        handleRibbonSwipe: function (e) {
            var i, n, s, a, o, r, l = this,
                d = 2e3;
            e.gesture.preventDefault(), n = 1 + e.gesture.distance / l.$el.width(), s = e.gesture.deltaX * n, o = d / e.gesture.velocityX, a = l.handleRibbonEdges(l.returnXForTransform() + s), r = t.throttle(function () {
                "left" === e.gesture.direction ? l.pollShowingTabs() : l.pollHiddenCollections()
            }), i = {
                duration: o,
                easing: "easeOutCirc",
                step: l.applyTranslateToRibbon,
                progress: r,
                always: function () {
                    l.testForCollectionEnd(a) && l.collection.loadFeed(), r()
                }
            }, this.animateSwipe(a, i)
        },
        handleTouch: function (e) {
            e.gesture.preventDefault()
        },
        handleTouchHold: function () {
            this.stopSwipeAnimation()
        },
        handleTouchDragStart: function () {
            this.stopSwipeAnimation(), this.startDragLocation = this.returnXForTransform()
        },
        stopSwipeAnimation: function () {
            this.$swipeAnimationElement && this.$swipeAnimationElement.stop()
        },
        handleRibbonMouseEnter: function () {
            Modernizr.touch || "undefined" == typeof this.$ribbonMenu || (this.$el.on("mousemove", this.handleMouseMove), clearTimeout(this.collectionMarkerTimeout), this.$collectionMarkers && this.$collectionMarkers.fadeIn(150), this.$firstCollectionMarker && this.$firstCollectionMarker.fadeIn(150))
        },
        handleMouseMove: t.throttle(function (e) {
            this.checkForActiveNavigation(e.clientX, e.clientY)
        }),
        handleRibbonMouseOut: function () {
            Modernizr.touch || (this.$el.off("mousemove", this.handleMouseMove), this.hideRibbonArrows(), this.hideCollectionMarkers())
        },
        handleNextArrow: function (t) {
            e(t.currentTarget).hasClass("inactive") || (this.trackingTrigger("ribbon-page-right", {
                eventName: "ScrollRight",
                contentCollection: this.getSectionInView(),
                action: "click"
            }), this.$previousArrow.removeClass("inactive"), this.shiftRibbonLeft())
        },
        handlePreviousArrow: function (t) {
            e(t.currentTarget).hasClass("inactive") || (this.trackingTrigger("ribbon-page-left", {
                eventName: "ScrollLeft",
                contentCollection: this.getSectionInView(),
                action: "click"
            }), this.$nextArrow.removeClass("inactive"), this.shiftRibbonRight())
        },
        handleRibbonAdClick: function (e) {
            var t;
            if (t = this.$el.find(".ribbon-ad-container"), this.animateRibbon(t), this.pageManager.flag("dfpAds") && this.pageManager.$html.hasClass("dfp-enabled")) this.broadcast("nyt:ad-library:dfp:ribbon-interstitial", e);
            else {
                if (this.broadcast("nyt:ads-fire-ribbon-interstitial"), !e.preventDefault) return !1;
                e.preventDefault()
            }
        },
        animateRibbon: function (e) {
            var t, i, n;
            return i = Modernizr.touch ? -1 * this.returnXForTransform() : e.offset().left, t = -1 * Math.floor(i / this.collectionStoryWidth), n = this.ribbonAnimation(t)
        },
        handleArticleClick: function (t) {
            var i, n, s, a, o, r, l, d = e(t.target),
                c = d.parents("li.collection-item");
            c.length > 0 ? (s = c.find("> a, #Ribbon > a"), a = s.attr("href"), a = this.trackingAppendParams(a, {
                action: "click",
                contentCollection: this.getCollectionByArticleElement(c)
            }), t.metaKey !== !0 ? (t.preventDefault(), this.$el.find(".collection-item").removeClass("active"), c.addClass("active"), "tap" === t.type ? (r = .25 * this.collectionStoryWidth - c.offset().left, l = this.returnXForTransform() + r, n = this.animateSwipe(l)) : (o = c.offset().left, i = Math.floor(o / this.collectionStoryWidth), n = this.ribbonAnimation(-i)), n.done(function () {
                window.location.href = a
            })) : s.attr("href", a)) : d.parents(".collection-marker").length > 0 && (window.location.href = t.target.href)
        },
        handleScroll: function () {
            var e = this.pageManager.getViewport().top;
            this.toggleRibbon(e), this.checkRibbonVisibility()
        },
        hideCollectionMarkers: function () {
            this.$collectionMarkers && this.$collectionMarkers.fadeOut(200), this.$firstCollectionMarker && this.$firstCollectionMarker.fadeOut(200)
        },
        slideCollectionMarkers: function () {
            var e = this.$firstCollectionMarker.outerWidth(),
                t = this.$el.find(".first-collection-marker");
            return t.eq(0).animate({
                marginLeft: -e
            }, 100).promise()
        },
        pollHiddenCollections: function () {
            var t, i, n, s = this,
                a = this.$collectionMarkers.filter(".past-left-border");
            a.each(function (a, o) {
                i = e(o), t = i.offset().left, t - (s.$el.offset().left + 1) > .25 * s.collectionStoryWidth && (i.removeClass("past-left-border"), n = i.closest(".collection").prev().find(".collection-marker"), s.createFirstCollectionMarker(n, !0), s.$firstCollectionMarker.last().remove(), s.$firstCollectionMarker = s.$el.find(".first-collection-marker"))
            })
        },
        pollShowingTabs: function () {
            var t = this,
                i = this.$collectionMarkers.not(".past-left-border");
            i.each(function (i, n) {
                t.testForNewMarker(e(n))
            })
        },
        testForNewMarker: function (e) {
            var t, i = this,
                n = this.$firstCollectionMarker;
            e.offset().left - (i.$el.offset().left + 1) <= .25 * this.collectionStoryWidth && (this.createFirstCollectionMarker(e), t = this.slideCollectionMarkers(), t.done(function () {
                n.remove(), i.$firstCollectionMarker = i.$el.find(".first-collection-marker")
            }))
        },
        createFirstCollectionMarker: function (e, t) {
            var i = e.clone().addClass("first-collection-marker");
            return t === !0 ? (i.removeClass("past-left-border"), this.$firstCollectionMarker.before(i)) : (e.addClass("past-left-border"), i.appendTo(this.$el)), e
        },
        ribbonAnimation: function (e, i) {
            var n, s, a = this,
                o = this.$ribbonMenu.position().left;
            return 0 === o && (o = .25 * this.collectionStoryWidth), n = o + e * this.collectionStoryWidth, n = this.handleRibbonEdges(n), this.checkArrowsAgainstRibbonBoundaries(n), i ? Modernizr.touch ? this.applyTranslateToRibbon(n) : this.$ribbonMenu.css({
                left: n
            }) : Modernizr.touch ? this.animateSwipe(n) : (s = t.throttle(function () {
                0 > e ? a.pollShowingTabs() : a.pollHiddenCollections()
            }, 75), this.$ribbonMenu.stop().animate({
                left: n
            }, {
                step: s
            }).promise())
        },
        animateSwipe: function (t, i) {
            var n = this;
            return i || (i = {
                step: this.applyTranslateToRibbon
            }), this.stopSwipeAnimation(), this.$swipeAnimationElement = e({
                animateDummyProperty: n.returnXForTransform()
            }), this.$swipeAnimationElement.animate({
                animateDummyProperty: t
            }, i).promise()
        },
        checkArrowsAgainstRibbonBoundaries: function (e) {
            e === this.$el.width() - this.getCollectionsWidth() ? this.$nextArrow.addClass("inactive") : 0 === e && this.$previousArrow.addClass("inactive")
        },
        testForCollectionEnd: function (e) {
            return "undefined" == typeof e && (e = this.$ribbonMenu.position().left), e + this.getCollectionsWidth() < this.$el.width()
        },
        handleRibbonEdges: function (e) {
            return e > 0 && (e = 0), this.testForCollectionEnd(e) && 0 === this.collection.feedSource.length && (e = this.$el.width() - this.getCollectionsWidth()), this.$el.toggleClass("ribbon-start", 0 === e), e
        },
        shiftRibbonRight: function () {
            var e = this,
                t = this.storyUnitsInView(),
                i = e.ribbonAnimation(t);
            i.done(function () {
                e.pollHiddenCollections(), e.broadcast("nyt:ribbon-animation-finished")
            })
        },
        shiftRibbonLeft: function () {
            var e = this,
                t = this.storyUnitsInView(),
                i = this.ribbonAnimation(-t);
            i.done(function () {
                e.testForCollectionEnd() && e.collection.loadFeed(), e.pollShowingTabs(), e.broadcast("nyt:ribbon-animation-finished")
            })
        },
        assignSyncedHtmlToView: function () {
            this.$collectionMarkers = this.$ribbonMenu.find(".collection-marker"), 0 === this.$el.find(".first-collection-marker").length && this.createFirstCollectionMarker(this.$collectionMarkers.eq(0)), this.$firstCollectionMarker = this.$el.find(".first-collection-marker").eq(0)
        },
        updateCollectionValues: function () {
            var t = this;
            this.$ribbonMenu.find(".story").each(function () {
                var i = e(this),
                    n = i.find(".story-heading");
                t.truncateText(n, i.find(".kicker").length ? 48 : 64), n.toggleClass("long-story-heading", n.height() > 48)
            })
        },
        checkForActiveNavigation: function (e) {
            var t, i = this.$el.width(),
                n = Math.ceil(.4 * i),
                s = Math.ceil(.6 * i),
                a = n >= e,
                o = e >= s;
            a ? t = {
                left: "10px",
                right: "auto"
            } : o && (t = {
                left: "auto",
                right: "10px"
            }), a || o ? (this.$ribbonNavigation.css(t), this.showRibbonArrows()) : this.hideRibbonArrows()
        },
        resizeRibbon: function () {
            this.$el.css("width", this.getWidth())
        },
        getWidth: function () {
            var e = parseInt(this.$el.css("margin-left"), 10);
            return this.$shell.width() - e
        },
        showRibbonArrows: function () {
            this.$ribbonNavigation.fadeIn(300)
        },
        hideRibbonArrows: function () {
            this.$ribbonNavigation && this.$ribbonNavigation.fadeOut(300)
        },
        getCollectionsWidth: function () {
            return this.collection.length * this.collectionStoryWidth
        },
        moveRibbonForAlerts: function (e) {
            this.disableRibbonToggle(), e(this.$el)
        },
        disableRibbonToggle: function () {
            this.toggleDisabled += 1, this.revertRibbon()
        },
        enableRibbonToggle: function () {
            this.toggleDisabled -= 1
        },
        animateRibbonStories: function (t) {
            var i = 200,
                n = t.find(".active").index();
            n = 0 > n ? 0 : n, t.find(".collection-item").slice(n).css({
                opacity: 0,
                "margin-left": this.animationDistance
            }).each(function () {
                i += 200, e(this).animate({
                    opacity: 1,
                    "margin-left": 0
                }, i)
            })
        },
        checkRibbonVisibility: function () {
            var e = this.pageManager.isComponentVisible(this.$el);
            e !== this.isRibbonVisible && (this.isRibbonVisible = e, this.broadcast("nyt:ribbon-visiblility", e))
        },
        revertRibbon: function () {
            this.ribbonFixed && (this.ribbonFixed = !1, this.$shell.css("padding-top", ""), this.$el.stop(!0).css({
                position: "",
                "margin-top": "",
                width: "",
                top: ""
            }))
        },
        slideRibbonDown: function () {
            var e, t = this.ribbonHeight + this.ribbonMarginTop + this.ribbonMarginBottom;
            e = this.mastheadHeight, this.ribbonFixed = !0, this.$shell.css("padding-top", t), this.$el.stop(!0).css({
                position: "fixed",
                "margin-top": 0,
                width: this.getWidth(),
                top: -this.ribbonHeight
            }).animate({
                top: e
            }, this.speed)
        },
        slideRibbonUp: function () {
            this.$el.stop(!0).animate({
                top: -this.ribbonHeight
            }, this.speed, this.revertRibbon)
        },
        toggleRibbon: function (e) {
            var t = 0 >= e,
                i = e > this.oldScrollTop,
                n = e < this.oldScrollTop,
                s = Math.abs(e - this.oldScrollTop);
            if (!(this.toggleDisabled > 0)) {
                if (t) return this.oldScrollTop = e, void this.revertRibbon();
                if (i && this.ribbonFixed) {
                    if (s < this.minDownDistance) return;
                    this.slideRibbonUp(), this.broadcast("nyt:ribbon-visiblility", !1)
                } else if (n && !this.ribbonFixed) {
                    if (s < this.minUpDistance) return void(this.oldScrollTop = e);
                    this.slideRibbonDown(), this.broadcast("nyt:ribbon-visiblility", !0)
                }
                this.oldScrollTop = e
            }
        },
        getSectionInView: function () {
            return e.trim(this.$el.find(".first-collection-marker").text())
        },
        getCollectionByArticleElement: function (t) {
            return e.trim(t.parents(".collection-menu").prev(".collection-marker").text())
        }
    }));
    return l
}), define("shared/ribbon/instances/ribbon", ["jquery/nyt", "shared/ribbon/views/ribbon", "foundation/views/base-view", "shared/navigation/templates"], function (e, t, i, n) {
    "use strict";
    var s = new i;
    s.flag("removeTheRibbon") && "1" === s.isUserVariant("removeTheRibbon") ? e("#ribbon").css({
        display: "none"
    }) : s.flag("ribbonStarterCollection") && "5" === s.isUserVariant("ribbonStarterCollection") ? (e("#ribbon").css({
        display: "none"
    }), e("html").addClass("has-ribbon"), e("#TopAd").before(n.miniNavStarterCollection()), e("#mini-navigation .all-sections-button").on("click", function () {
        return s.broadcast("nyt:navigation-toggle-ready"), !1
    })) : e("#ribbon").length > 0 && new t
}), define("shared/whatsnext/templates", ["underscore/nyt"], function (_) {
    var templates = {};
    return templates.relatedCoverage = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += "", _.each(collection, function (e) {
            __p += '\n<li>\n<article class="story theme-summary ' + (null == (__t = _.isEmpty(e.getCrop("mediumThreeByTwo210")) ? "no-thumb" : "") ? "" : __t) + '">\n<a href="' + (null == (__t = e.getLink()) ? "" : __t) + '">\n', _.isEmpty(e.getCrop("mediumThreeByTwo210")) ? (__p += "\n", e.get("kicker") && (__p += '\n<h3 class="kicker">' + (null == (__t = e.get("kicker")) ? "" : __t) + "</h3>\n"), __p += '<h2 class="story-heading">' + (null == (__t = e.get("headline")) ? "" : __t) + '</h2>\n<time class="dateline" datetime="' + (null == (__t = e.get("datetime")) ? "" : __t) + '">' + (null == (__t = e.get("pubdate")) ? "" : __t) + "</time>", (e.get("description") || e.get("summary")) && (__p += '\n<p class="summary">' + (null == (__t = e.get("description") || e.get("summary")) ? "" : __t) + "</p>\n"), __p += "") : (__p += '\n<div class="wide-thumb">\n<img src="' + (null == (__t = e.getCrop("mediumThreeByTwo210").url || e.getCrop("mediumThreeByTwo210").content) ? "" : __t) + '" />\n</div>\n', e.get("kicker") && (__p += '\n<h3 class="kicker">' + (null == (__t = e.get("kicker")) ? "" : __t) + "</h3>\n"), __p += '<h2 class="story-heading">' + (null == (__t = e.get("headline")) ? "" : __t) + '</h2>\n<time class="dateline" datetime="' + (null == (__t = e.get("pubdate")) ? "" : __t) + '">' + (null == (__t = e.get("pubdate")) ? "" : __t) + "</time>\n"), __p += "\n</a>\n</article>\n</li>\n"
        }), __p += "";
        return __p
    }, templates.whatsNextSection = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<section class="' + (null == (__t = className) ? "" : __t) + '" data-module="' + (null == (__t = trackingModule) ? "" : __t) + '" data-src="' + (null == (__t = trackingSrc) ? "" : __t) + '">\n<header>\n<h2 class="section-heading"><a href="' + (null == (__t = sectionUrl) ? "" : __t) + '" data="' + (null == (__t = className) ? "" : __t) + '-heading">' + (null == (__t = headingLabel) ? "" : __t) + '</a></h2>\n<p class="user-action"><a href="' + (null == (__t = sectionUrl) ? "" : __t) + '" data="' + (null == (__t = className) ? "" : __t) + '-action">' + (null == (__t = sectionLinkLabel) ? "" : __t) + ' &raquo;</a></p>\n</header><ul class="menu layout-horizontal theme-story">', _.each(collection, function (e, t) {
            __p += "\n<li>\n", __p += whatsNextVideoIconFeatureFlag ? '\n<a href="' + (null == (__t = e.getLink()) ? "" : __t) + '" class="story-link" data="' + (null == (__t = className) ? "" : __t) + "-" + (null == (__t = t) ? "" : __t) + '" ' + (null == (__t = e.get("promotional_media").type) ? "" : __t) + ">\n" : '\n<a href="' + (null == (__t = e.getLink()) ? "" : __t) + '" class="story-link" data="' + (null == (__t = className) ? "" : __t) + "-" + (null == (__t = t) ? "" : __t) + '">\n', __p += "\n", _.isEmpty(e.getCrop("mediumThreeByTwo210")) ? (__p += '\n<article class="story theme-summary no-thumb">\n', e.get("kicker") && (__p += '\n<h3 class="kicker">' + (null == (__t = e.get("kicker")) ? "" : __t) + "</h3>\n"), __p += '<h2 class="story-heading">' + (null == (__t = e.get("headline")) ? "" : __t) + "</h2>", (e.get("description") || e.get("summary")) && (__p += '\n<p class="summary">' + (null == (__t = e.get("description") || e.get("summary")) ? "" : __t) + "</p>\n"), __p += "\n</article>\n") : (__p += '\n<article class="story theme-summary">\n<div class="wide-thumb">\n<img src="' + (null == (__t = e.getCrop("mediumThreeByTwo210").url || e.getCrop("mediumThreeByTwo210").content) ? "" : __t) + '" />\n', whatsNextVideoIconFeatureFlag && contentTypeHasVideo && e.isVideo() && (__p += '\n<div class="media-action-overlay">\n<i class="icon sprite-icon icon-media-video-18x12-ffffff"></i>\n<span class="visually-hidden">Go to video</span>\n</div>\n'), __p += "\n</div>\n", whatsNextVideoIconFeatureFlag && contentTypeHasVideo && e.isVideo() && e.getVideoKicker() ? __p += '\n<h3 class="kicker">' + (null == (__t = e.getVideoKicker()) ? "" : __t) + "</h3>\n" : (__p += "\n", e.get("kicker") && (__p += '\n<h3 class="kicker">' + (null == (__t = e.get("kicker")) ? "" : __t) + "</h3>\n"), __p += "\n"), __p += '\n<h2 class="story-heading">' + (null == (__t = e.get("headline")) ? "" : __t) + "</h2>\n</article>\n"), __p += "\n</a>\n</li>\n"
        }), __p += "\n</ul>\n</section>";
        return __p
    }, templates
}), define("shared/whatsnext/views/whats-next-factory", ["foundation/views/page-manager", "foundation/hosts", "shared/data/instances/most-emailed", "shared/data/instances/recommendations", "shared/data/instances/context", "shared/data/instances/top-news", "shared/data/instances/lda-recommendations"], function (e, t, i, n, s, a, o) {
    "use strict";
    var r = e.getMeta("article:section"),
        l = e.getMeta("CG"),
        d = r && 0 === r.indexOf("The "),
        c = t.www,
        h = {
            "context-6": {
                el: ".section-news",
                headingLabel: "More in " + r,
                sectionLinkLabel: "Go to " + (d ? "" : "the ") + r + " Section",
                collection: s,
                items: 6,
                template: "whatsNextSection",
                trackingModule: "MoreInSection",
                hasVideo: !0
            },
            "top-news-3": {
                el: ".top-news",
                headingLabel: "Top News",
                sectionLinkLabel: "Go to the Home Page",
                sectionUrl: c,
                collection: a,
                items: 3,
                template: "whatsNextSection",
                trackingModule: "TopNews",
                hasVideo: !0
            },
            "top-news-6": {
                el: ".top-news",
                headingLabel: "Top News",
                sectionLinkLabel: "Go to the Home Page",
                sectionUrl: c,
                collection: a,
                items: 6,
                template: "whatsNextSection",
                trackingModule: "TopNews",
                hasVideo: !0
            },
            "top-news-5": {
                el: ".top-news",
                headingLabel: "More on NYTimes.com",
                sectionUrl: c,
                collection: a,
                items: 5,
                template: "relatedCoverage",
                tracking: "TopNews",
                hasPubDate: !0
            },
            "most-emailed-6": {
                el: ".most-emailed",
                headingLabel: "Most Emailed",
                sectionLinkLabel: "Go to the Most Emailed Section",
                sectionUrl: c + "/most-popular-emailed",
                collection: i,
                items: 6,
                template: "whatsNextSection",
                hasVideo: !0
            },
            "recommendations-3": {
                el: ".recommendations",
                headingLabel: "Recommended for You",
                sectionLinkLabel: "Go to All Recommendations",
                sectionUrl: c + "/recommendations",
                collection: n,
                items: 3,
                template: "whatsNextSection",
                trackingModule: "Recommendation",
                trackingSrc: "recg",
                hasVideo: !0
            },
            "lda-3": {
                el: ".lda-context",
                headingLabel: "More in " + r,
                sectionLinkLabel: "Go to " + (d ? "" : "the ") + r + " Section",
                collection: o,
                sectionUrl: c + "/pages/" + l,
                items: 3,
                template: "whatsNextSection",
                trackingModule: "MoreInSection",
                hasVideo: !0
            }
        },
        u = {
            createTemplate: function (e) {
                return h[e]
            }
        };
    return u
}), define("shared/whatsnext/views/whats-next", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "shared/whatsnext/templates", "foundation/models/user-data", "shared/whatsnext/views/whats-next-factory"], function (e, t, i, n, s, a) {
    "use strict";
    var o = i.registerView("whats-next").extend({
        el: "#whats-next",
        events: {
            "click a": "handleLinkClick",
            "mouseenter .wide-thumb": "handleHoverThumb",
            "mouseleave .wide-thumb": "handleUnHoverThumb"
        },
        defaultSettings: {
            fetchCount: 0,
            hasRendered: !1,
            whatsNextFactory: a,
            renderMethod: "html",
            fadeInEl: "#whats-next"
        },
        templates: n,
        initialize: function (e) {
            t.bindAll(this, "loadData", "fetchSuccess", "render"), this.settings = t.extend(this.defaultSettings, this.getConfiguration(e), e), e && e.el && this.setElement(e.el), t.extend(this.templates, this.settings.templates), this.trackingBaseData = {
                action: "click",
                contentCollection: this.pageManager.getMeta("article:section"),
                region: "Footer"
            }
        },
        getConfiguration: function (e) {
            var t, i = ["top-news-6", "recommendations-3"],
                n = ["top-news-6"],
                a = !1;
            return this.pageManager.getMeta("errorpage") ? (i = ["most-emailed-6", "top-news-3"], n = ["most-emailed-6", "top-news-3"]) : this.pageManager.getMeta("article:section") && ("1" === this.isUserVariant("anonRecommendations") && this.pageManager.flag("anonymousRecommendations") ? (i = ["context-6", "recommendations-3"], n = ["context-6", "recommendations-3"], a = ["context-6", "top-news-3"]) : (i = ["context-6", "recommendations-3"], n = ["context-6", "top-news-3"])), t = s.isLoggedIn() ? i : n, e = e ? e : {}, {
                sections: e.sections || t,
                fallback: e.fallback || a,
                sectionsCollections: e.sectionsCollections || [],
                fallbackCollections: e.fallbackCollections || []
            }
        },
        handleDomReady: function () {
            this.shouldLoadWhatsNext() ? s.ready(this.loadData) : this.subscribe("nyt:page-scroll", this.handleScrollCheck)
        },
        handleScrollCheck: function () {
            this.shouldLoadWhatsNext() && s.ready(this.loadData)
        },
        shouldLoadWhatsNext: function () {
            return this.pageManager.isComponentVisible(this.$el) || this.$el.length > 0 && window.pageYOffset > this.$el.position().top - 100 ? !0 : !1
        },
        handleLinkClick: function (t) {
            var i, n, s, a = e(t.currentTarget),
                o = this.trackingAppendParams(a.attr("href"), {
                    moduleDetail: a.attr("data")
                });
            s = a.closest("section"), i = s.attr("data-module"), i && (o = this.trackingAppendParams(o, {
                module: i
            })), n = s.attr("data-src"), n && (o = this.trackingAppendParams(o, {
                src: n
            })), a.attr("href", o)
        },
        loadData: function () {
            var e, i, n, s, a = this.settings,
                o = this;
            for (this.stopSubscribing("nyt:page-scroll", this.handleScrollCheck), e = 0, i = a.sections.length; i > e; e += 1) n = this.settings.whatsNextFactory.createTemplate(a.sections[e]), a.sectionsCollections.push(n), n.collection.loadData(), this.subscribeOnce(n.collection, "sync", this.fetchSuccess), a.fallback && this.settings.fallback[e] ? (s = this.settings.whatsNextFactory.createTemplate(a.fallback[e]), s.collection.loadData()) : s = null, a.fallbackCollections.push(s);
            t.delay(function () {
                o.settings.hasRendered || o.render()
            }, 2e3)
        },
        fetchSuccess: function () {
            this.settings.fetchCount++, this.settings.fetchCount === this.settings.sections.length && this.render()
        },
        render: function () {
            var i, n, s, a, o, r = "",
                l = "",
                d = 80,
                c = 72,
                h = this,
                u = function (e) {
                    e.set("pubdate", h.formatPubDate(e.get("pubdate"), !0))
                },
                m = function (e) {
                    e.set("datetime", h.formatPubDate(e.get("pubdate"), !1))
                };
            for (this.settings.hasRendered = !0, i = 0, s = this.settings.sections.length; s > i; i += 1) {
                if (a = this.settings.sectionsCollections[i], o = this.settings.fallbackCollections[i], this.settings.sectionsCollections[i].hasPubDate === !0)
                    for (n = 0; n < a.collection.models.length; n++) u(a.collection.models[n]), m(a.collection.models[n]);
                a.collection.length >= a.items ? r += this.getSectionEl(a) : o && o.collection.length >= o.items && (r += this.getSectionEl(o), l += o.el.replace(".", ""), this.trackingBaseData = t.extend({}, this.trackingBaseData, {
                    fallbackSection: l
                }))
            }
            this.$el[this.settings.renderMethod](r), e(this.settings.fadeInEl).css("opacity", 0), e(this.settings.fadeInEl).animate({
                opacity: 1
            }, 400), this.$el.find("h2").each(function (t, i) {
                var n = e(i).height();
                n >= d + 1 && h.truncateText(e(i), d, !1)
            }), this.$el.find(".summary").each(function (t, i) {
                h.truncateText(e(i), c, !1)
            })
        },
        getSectionEl: function (e) {
            var i, n = this.pageManager.flag("whatsNextVideoIcon");
            return this.pageManager.flag("shuffleRecommendations") && "Recommendation" === e.trackingModule && (e.collection.models = t.shuffle(e.collection.models), e.trackingModule = e.trackingModule + "-shuffled"), i = this.templates[e.template]({
                headingLabel: e.headingLabel,
                sectionLinkLabel: e.sectionLinkLabel,
                sectionUrl: e.sectionUrl || e.collection.getUrl(),
                collection: this.dedupeSection(e),
                className: e.el.replace(".", ""),
                trackingModule: e.trackingModule,
                trackingSrc: e.trackingSrc,
                contentTypeHasVideo: e.hasVideo,
                whatsNextVideoIconFeatureFlag: n
            })
        },
        dedupeSection: function (e) {
            var t = this.pageManager.getMeta("articleid"),
                i = this.pageManager.getCanonical(),
                n = e.items;
            return void 0 !== this.settings.overrideDisplayCount && (n = this.settings.overrideDisplayCount), e.collection.chain().uniq(!1, function (e) {
                var t = e.attributes,
                    i = t.data_id ? t.data_id : t.id;
                return i ? i : t.link
            }).reject(function (e) {
                var n = e.attributes,
                    s = n.data_id ? n.data_id : n.id;
                return s && s === t ? !0 : -1 !== n.link.indexOf(i) ? !0 : !1
            }).first(n).value()
        },
        formatPubDate: function (e, t) {
            var i, n = new Date(e),
                s = n.getDate(),
                a = n.getMonth(),
                o = n.getFullYear(),
                r = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"];
            return i = t === !0 ? r[a] + ". " + s + ", " + o : o + "-" + a + "-" + s
        },
        handleHoverThumb: function (t) {
            var i = e(t.currentTarget).find(".media-action-overlay");
            i.addClass("hover")
        },
        handleUnHoverThumb: function (t) {
            var i = e(t.currentTarget).find(".media-action-overlay");
            i.removeClass("hover")
        }
    });
    return o
}), define("interactive/instances/related-coverage", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "shared/whatsnext/views/whats-next"], function (e, t, i, n) {
    "use strict";
    var s = i.extend({
        numExistingEl: e("#related-coverage").find("li").length,
        totalAssetsAllowed: 5,
        initialize: function () {
            var e = this.totalAssetsAllowed - this.numExistingEl;
            new n({
                el: "#related-coverage .menu",
                sections: ["top-news-5"],
                fallback: !1,
                overrideDisplayCount: e,
                renderMethod: "append",
                fadeInEl: "#related-coverage"
            })
        }
    });
    return new s
}), define("shared/community/api-mixin", ["jquery/nyt", "underscore/nyt", "foundation/hosts"], function (e, t, i) {
    "use strict";
    var n = {
        apiPath: i.community + "/svc/community/V3/requestHandler",
        COMMANDS: {
            all: "GetCommentsAll",
            reader: "GetCommentsReadersPicks",
            nytpicks: "GetCommentsNYTPicks",
            nytreplies: "GetCommentsNYTReplies",
            replies: "GetRepliesBySequence",
            permalink: "GetCommentByPermid",
            recommend: "PostRecommend",
            userinfo: "GetBasicInfo",
            comment: "PostComment",
            notify: "CommentNotify",
            summary: "GetCommentSummary",
            content: "GetUserContentSummary",
            reply: "PostComment",
            flag: "FlagComment",
            review: "",
            rate: "",
            avgRating: "",
            usrRating: ""
        },
        QUERIES: {
            asset: "url",
            filter: "cmd",
            command: "cmd",
            context: "commentSequence"
        },
        apiPost: function (e) {
            return this.makeRequest(e, "post")
        },
        apiGet: function (e) {
            return this.makeRequest(e, "get")
        },
        hasErrors: function (e, t) {
            var i = !0;
            return e && ("undefined" != typeof e.status ? (i = !1, this.wantsComments(t) ? i = !(e.results && e.results.comments) : "OK" !== e.status && (i = !0)) : i = !1), i
        },
        wantsComments: function (e) {
            if (!e) return !1;
            switch (e.filter) {
            case "all":
            case "nytreplies":
            case "nytpicks":
            case "reader":
            case "replies":
                return !0;
            default:
                return !1
            }
        },
        sanitize: function (e, t) {
            var i = [];
            return e && (i = e.comments), t && i && i[0] && ("replies" === t.filter ? (i[0].replies.context = i[0].commentSequence, i = i[0].replies) : "permalink" === t.filter && (i.context = i[0].commentSequence)), i
        },
        formatRequest: function (e, i) {
            var n, s = {};
            switch (t.each(e, function (e, t) {
                t = this.QUERIES[t] || t, "cmd" === t || "commentSequence" === t && 0 === e || (s[t] = e)
            }, this), e.command) {
            case "comment":
                s.commentType = "comment";
                break;
            case "notify":
                i = s.commentNotify ? "post" : "delete", delete s.commentNotify;
                break;
            case "reply":
                s.commentType = "userReply";
                break;
            case "review":
            }
            return "post" === i ? s = {
                postdata: encodeURIComponent(JSON.stringify(s))
            } : s.url = s.url ? encodeURIComponent(s.url) : void 0, s.cmd = this.COMMANDS[e.filter || e.command], s.method = i, n = {
                url: this.apiPath,
                dataType: "jsonp",
                data: s,
                contentType: "post" === i ? "application/json; charset=utf-8" : "application/x-www-form-urlencoded; charset=utf-8",
                jsonp: "callback",
                cache: !1
            }
        },
        makeRequest: function (t, i) {
            var n = this,
                s = new e.Deferred,
                a = this.formatRequest(t, i),
                o = !0;
            return a.success = function (e) {
                n.hasErrors(e, t) ? a.error(e) : s.resolve(e.results || e)
            }, a.error = function (t) {
                o ? (e.ajax(a), o = !1) : s.reject({
                    status: "ERROR",
                    message: "The request failed",
                    response: t
                })
            }, e.ajax(a), s.promise()
        }
    };
    return n
}), define("shared/community/models/community-user", ["underscore/nyt", "foundation/models/base-model", "shared/community/api-mixin"], function (e, t, i) {
    "use strict";
    var n = t.extend(e.extend({}, i, {
        defaults: {
            userID: null,
            picURL: "",
            location: "",
            displayName: "",
            userEmail: "",
            myaccounturl: "",
            wwwhost: "",
            tphost: "",
            commentNotify: 0
        },
        initialize: function () {
            this.getUserId() || this.fetch()
        },
        fetch: function () {
            var e = this,
                t = {
                    command: "userinfo"
                };
            return this.apiGet(t).done(function (t) {
                e.set(t)
            }).promise()
        },
        setCarefully: function (t) {
            var i = {
                userID: "UserId",
                picURL: "Avatar",
                location: "Location",
                displayName: "Name",
                userEmail: "Email"
            };
            e.isObject(t) && e.each(t, function (e, t) {
                i[t] && !this["has" + i[t]]() && e && this["set" + i[t]](e)
            }, this)
        },
        getUserId: function () {
            return this.get("userID")
        },
        getAvatar: function () {
            return this.get("picURL")
        },
        getLocation: function () {
            return this.get("location")
        },
        getName: function () {
            return this.get("displayName")
        },
        getEmail: function () {
            return this.get("userEmail")
        },
        getAccountUrl: function () {
            return this.get("myaccounturl")
        },
        getNotify: function () {
            return this.get("comment_notify")
        },
        hasUserId: function () {
            return null !== this.get("userID") && this.get("userID") > 0
        },
        hasAvatar: function () {
            return this.getAvatar().length > 0 ? -1 === this.getAvatar().indexOf("none.png") : !1
        },
        hasLocation: function () {
            return "string" == typeof this.get("location") && this.get("location").length > 0
        },
        hasName: function () {
            return "string" == typeof this.get("displayName") && this.get("displayName").length > 0
        },
        hasEmail: function () {
            return "string" == typeof this.get("userEmail") && this.get("userEmail").length > 0
        },
        setUserId: function (e) {
            this.set("userID", e)
        },
        setLocation: function (e) {
            this.set("location", e)
        },
        setName: function (e) {
            return this.set("displayName", e)
        },
        setEmail: function (e) {
            return this.set("userEmail", e)
        },
        setNotify: function (e) {
            return this.set("comment_notify", e)
        },
        setAvatar: function (e) {
            return this.set("picURL", e)
        }
    }));
    return n
}), define("shared/community/instances/community-user", ["shared/community/models/community-user"], function (e) {
    "use strict";
    return new e
}), define("shared/community/models/post", ["underscore/nyt", "foundation/models/base-model", "shared/community/api-mixin", "shared/community/instances/community-user"], function (e, t, i, n) {
    "use strict";
    var s = t.extend(e.extend({}, i, {
        defaults: {
            commentID: 0,
            replies: []
        },
        initialize: function () {
            this.getReplies().length > 2 && (this.getReplies().length = 2), this.convertUnixTimeStamp()
        },
        recommend: function (e, t, i) {
            var s = this,
                a = arguments.length > 3 ? Array.prototype.slice.call(arguments, 3) : [];
            return "undefined" == typeof e && (e = this.isRecommended() ? 0 : 1), this.apiPost({
                command: "recommend",
                userID: n.getUserId(),
                userEmail: n.getEmail(),
                asset: t,
                commentSequence: this.getSequence(),
                parentID: this.getParentId(),
                recommend: e
            }).done(function (e) {
                s.set({
                    recommendedFlag: e.recommended,
                    recommendations: e.recommendations
                }), i.local.apply(this, [i, "nyt:community-post-recommended", s].concat(a))
            })
        },
        convertUnixTimeStamp: function () {
            e.each(["approveDate", "createDate", "updateDate"], function (e) {
                this.set(e, 1e3 * parseInt(this.get(e), 10))
            }, this)
        },
        isTrusted: function () {
            return this.get("trusted") > 0
        },
        isPicked: function () {
            return this.get("editorsSelection")
        },
        isNyt: function () {
            return "reporterReply" === this.get("commentType")
        },
        isRecommended: function () {
            return 1 === this.get("recommendedFlag")
        },
        isReported: function () {
            return 1 === this.get("reportAbuseFlag")
        },
        hasReplies: function () {
            return this.getReplyCount() > 0
        },
        hasAvatar: function () {
            return this.getAvatar().length > 0 ? -1 === this.getAvatar().indexOf("none.png") : !1
        },
        hasAdditionalReplies: function () {
            return this.getReplyCount() > this.getReplies().length
        },
        getDate: function () {
            return this.get("approveDate")
        },
        getBody: function () {
            return this.get("commentBody")
        },
        getAuthor: function () {
            return this.get("userDisplayName") || this.get("display_name")
        },
        getAvatar: function () {
            return this.get("picURL") || ""
        },
        getLocation: function () {
            return this.get("userLocation") || this.get("location")
        },
        getReplies: function () {
            return this.get("replies")
        },
        getReplyCount: function () {
            return this.get("replyCount")
        },
        getId: function () {
            return this.get("commentID")
        },
        getPermId: function () {
            return this.get("permID")
        },
        getSequence: function () {
            return this.get("commentSequence")
        },
        getParentId: function () {
            return this.get("parentID") || 0
        },
        getRecommendations: function () {
            return this.get("recommendations")
        },
        getUserTitle: function () {
            return this.get("userTitle")
        },
        getParentAuthor: function () {
            return this.get("parentUserDisplayName")
        },
        getParentPermId: function () {
            return this.get("parentPermID")
        }
    }));
    return s
}), define("shared/community/collections/stream", ["underscore/nyt", "foundation/collections/base-collection", "shared/community/models/post"], function (e, t, i) {
    "use strict";
    var n = t.extend({
        model: i,
        sortMethods: {
            newest: function (e) {
                return -parseInt(e.getDate(), 10)
            },
            oldest: function (e) {
                return parseInt(e.getDate(), 10)
            },
            reader: function (e) {
                return -parseInt(e.getRecommendations(), 10)
            }
        },
        order: function (e) {
            this.comparator = this.sortMethods[e || "newest"]
        },
        has: function (e) {
            return this.where({
                commentID: e.getId()
            }).length > 0
        },
        convertPosts: function (t, n) {
            return e.each(t, function (e, s) {
                var a = new i(e);
                n && (n.getReplies()[s] = a), a.hasReplies() && this.convertPosts(a.getReplies(), a), t[s] = a
            }, this), this
        },
        stripDupes: function (t) {
            var i = [],
                n = [];
            return e.each(t, function (t) {
                -1 === e.indexOf(n, t.getId()) && (i.push(t), n.push(t.getId()))
            }, this), i
        },
        populate: function (t) {
            var i = [],
                n = t.context;
            return t = this.convertPosts(t).stripDupes(t), e.each(t, function (t) {
                this.has(t) || (i.push(t), this.ensurePermId(t, n), t.hasReplies() && (t.set("replies", this.stripDupes(t.getReplies())), e.each(t.getReplies(), function (e) {
                    this.ensurePermId(e, t.getSequence())
                }, this)))
            }, this), this.add(i), i
        },
        ensurePermId: function (e, t) {
            e.getPermId() || e.set("permID", (t ? t + ":" : "") + e.getSequence()), e.set("parentPermID", e.getPermId().split(":")[0])
        }
    });
    return n
}), define("shared/community/models/thread", ["underscore/nyt", "foundation/models/base-model", "shared/community/collections/stream"], function (e, t, i) {
    "use strict";
    var n = t.extend({
        defaults: {
            context: "0",
            filter: "all",
            sort: "newest",
            offset: 0,
            permID: null,
            stream: null,
            requested: 25
        },
        initialize: function () {
            var e = this.getStream();
            e && "function" != typeof e.slice || (e = new i(e), this.set("stream", e)), e.order(this.get("sort"))
        },
        toQuery: function (t) {
            return e.extend({
                context: this.get("context"),
                filter: this.get("filter"),
                sort: this.get("sort"),
                offset: this.get("offset")
            }, {
                permID: this.get("permID") || void 0
            }, t)
        },
        getStream: function () {
            return this.get("stream")
        },
        getCount: function () {
            return this.get("count")
        },
        getRequested: function () {
            return this.get("requested")
        },
        isEmpty: function () {
            return !this.isLoading() && 0 === this.getStream().length
        },
        isLoading: function () {
            return this.get("loading")
        },
        setLoading: function (e) {
            this.set("loading", e)
        },
        setCount: function (e) {
            this.set("count", e)
        },
        trackRequested: function (e) {
            this.set("requested", e + (this.getRequested() || 0))
        },
        hasAdditionalPosts: function () {
            return this.getRequested() < this.get("count")
        }
    });
    return n
}), define("shared/community/models/discussion", ["underscore/nyt", "foundation/models/base-model", "foundation/collections/base-collection", "shared/community/api-mixin", "shared/community/models/thread"], function (e, t, i, n, s) {
    "use strict";
    var a = t.extend(e.extend({}, n, {
        defaults: {
            views: [],
            isOpen: !0,
            totalPosts: 0,
            nytPicks: 0,
            nytReplies: 0,
            userPicks: 0,
            averageRating: 0,
            userRating: 0,
            prompt: "Share your thoughts."
        },
        initialize: function (e) {
            var t = new i([], {
                model: s
            });
            e.asset && !e.taxonomy && this.listenToOnce(t, "add", this.buildTaxonomy), this.listenToOnce(t, "add", this.getUserContent), this.listenToOnce(this, "nyt:community-summary", this.load), this.set("threads", t), this.getSummary()
        },
        buildValidQuery: function (t) {
            var i, n = ["context", "filter", "sort", "permID", "taxonomy"],
                s = {};
            for (i in t) e.indexOf(n, i) > -1 && "undefined" != typeof t[i] && (s[i] = t[i]);
            return s
        },
        getSummary: function () {
            var e = this,
                t = {
                    "comment-list-sort-approvedate": {
                        sort: "oldest",
                        filter: "all"
                    },
                    "comment-list-sort-approvedate-desc": {
                        sort: "newest",
                        filter: "all"
                    },
                    "comment-list-sort-recommended": {
                        filter: "reader"
                    },
                    "comment-list-sort-editors": {
                        filter: "nytpicks"
                    },
                    "comment-list-sort-replies": {
                        filter: "nytreplies"
                    }
                };
            this.apiGet({
                asset: this.getAsset(),
                command: "summary"
            }).done(function (i) {
                var n = t[i.sortBy || "comment-list-sort-approvedate-desc"];
                e.setDefaultQuery(n), e.setMetaData(i), e.local(e, "nyt:community-summary", n, e)
            }).fail(function () {
                e.local(e, "nyt:community-summary", t["comment-list-sort-approvedate-desc"], e)
            })
        },
        load: function (e, t) {
            var i = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : [],
                n = this.getThreads(),
                s = this.buildValidQuery(e),
                a = n.findWhere(s);
            this.local(t || this, "nyt:community-request", e), a || (n.add(s), a = n.findWhere(s)), a.isLoading() ? this.addThreadWatcher.apply(this, [t, a].concat(i)) : e.limit ? this.fetchMorePosts(e, a, t, i) : a.isEmpty() || "replies" === e.filter ? this.fetchPosts(e, a, t, i) : (this.local.apply(this, [t || this, "nyt:community-thread-loaded", [], a.getStream().models].concat(i)), this.addReplies.apply(this, [a.getStream().models, t].concat(i)))
        },
        addThreadWatcher: function (e, t) {
            var i = this;
            this.listenTo(t, "nyt:community-thread-loaded", function () {
                i.local.apply(i, [e, "nyt:community-thread-loaded"].concat(Array.prototype.slice.call(arguments, 0)))
            })
        },
        fetchPosts: function (e, t, i, n) {
            var s, a, o = this,
                r = this.toQuery(e || {}, t);
            t.setLoading(!0), this.addThreadWatcher.apply(this, [i || this, t].concat(n)), a = this.apiGet(r).done(function (i) {
                s = t.getStream().populate(o.sanitize(i, r)), "replies" === e.filter && o.updateParentPost(t), o.setMetaData(i, t, e), t.setLoading(!1), o.local.apply(o, [t, "nyt:community-thread-loaded", s, t.getStream().models].concat(n)), o.addReplies.apply(o, [s, t].concat(n)), o.stopListening(t, "nyt:community-thread-loaded")
            }).fail(function () {
                t.setLoading(!1), o.local.apply(o, [t, "nyt:community-thread-loaded", [], t.getStream().models].concat(n))
            }), this.local(i || this, "nyt:community-thread-requested", this, a)
        },
        toQuery: function (t, i, n) {
            return e.extend(i.toQuery(), {
                offset: t && t.offset ? t.offset : i.get("offset"),
                limit: t ? t.limit : void 0,
                asset: this.getAsset()
            }, n)
        },
        addReplies: function (t, i, n) {
            var a, o = this.getThreads();
            n = n || {}, a = arguments.length > 2 ? Array.prototype.slice.call(arguments, 2) : [n], e.each(t, function (t) {
                var r = t.getReplies(),
                    l = o.findWhere({
                        context: t.getSequence(),
                        permID: t.getPermId()
                    });
                r.length > 0 && (l || (l = new s({
                    context: t.getSequence(),
                    filter: "replies",
                    permID: t.getPermId(),
                    stream: r
                }), o.add(l)), n.parent = t.getId(), this.local.apply(this, [i || this, "nyt:community-thread-loaded", r, l.getStream().models].concat(a)), this.addReplies(l.getStream().models, i, e.clone(n)))
            }, this)
        },
        updateParentPost: function (e) {
            var t = this.getThreads().findWhere({
                    context: "0"
                }),
                i = t.getStream().findWhere({
                    commentSequence: e.get("context")
                });
            i && i.set("replies", e.getStream().models)
        },
        buildTaxonomy: function () {
            var e, t, i, n, s, a = this.pageManager.getMeta("SCG");
            this.isValidTaxonomy(this.getTaxonomy()) || (s = this.pageManager.getMeta("communityAssetTaxonomy"), t = this.pageManager.getMeta("CG"), i = this.pageManager.getMeta("hdl"), n = this.pageManager.getMeta("slug"), s || (e = [], "string" == typeof t && "" !== t && e.push(t), "string" == typeof i && "" !== i && (i = i.replace(/\&\%\?/g, ""), e.push(i)), s = e.join("/"), "string" == typeof n && "" !== n && (s += " (" + n + ")")), "roomfordebate" === a && s.indexOf("(undefined)") > -1 && (e = [], "string" == typeof t && "" !== t && e.push(t.toLowerCase()), e.push(a), "string" == typeof n && "" !== n && "undefined" !== n && e.push(n), s = e.join("/")), this.setTaxonomy(s))
        },
        fetchMorePosts: function (t, i, n) {
            this.fetchPosts(e.extend({
                limit: 25
            }, t, {
                offset: i.getStream().length
            }), i, n)
        },
        fetchLatestPosts: function (e) {
            this.fetchPosts({}, e)
        },
        post: function (e, t, i) {
            var n, s, a = this,
                o = this.getUser();
            return i.ancestorId > 0 || i.parentId > 0 ? (n = "reply", s = i.ancestorId > 0 ? i.ancestorId : i.parentId) : (n = "comment", s = 0), this.apiPost({
                command: n,
                userID: o.getUserId(),
                userEmail: o.getEmail(),
                userDisplayName: o.getName(),
                userLocation: o.getLocation(),
                asset: this.getAsset(),
                parentID: s,
                commentBody: t.commentBody,
                commentTitle: t.commentTitle,
                assetTaxonomy: this.getTaxonomy()
            }).done(function () {
                e.local(e, "nyt:community-comment-posted", t, i), a.apiPost({
                    command: "notify",
                    commentNotify: t.commentNotify
                })
            })
        },
        setMetaData: function (t, i, n) {
            var s = ["all"];
            i && "permalink" !== i.get("filter") && (this.setCount(t, i, n), this.setUserData(t.userData)), "string" == typeof t.commentQuestion && t.commentQuestion.length > 0 && this.setPrompt(t.commentQuestion), "undefined" != typeof t.userRating && this.setRating(t), e.isObject(t.asset) && this.isValidTaxonomy(t.asset.taxonomy) && this.setTaxonomy(t.asset.taxonomy), "undefined" != typeof t.canSubmit && this.setOpen(t.canSubmit), t.totalRecommendationsFound && s.push("reader"), t.totalEditorsSelectionFound && s.push("nytpicks"), t.totalReporterReplyCommentsFound && s.push("nytreplies"), this.setFilters(s)
        },
        findPost: function (e) {
            var t = !1;
            return this.getThreads().each(function (i) {
                var n;
                return t ? !1 : (n = i.getStream().findWhere(e), n ? (t = n, !1) : void 0)
            }, this), t
        },
        setUserData: function (e) {
            var t = this.getUser();
            t && t.setCarefully(e)
        },
        setRating: function (e) {
            this.set("userRating", e.userRating), this.set("avgRating", e.averageRating)
        },
        setCount: function (e, t, i) {
            if ("replies" !== t.get("filter")) {
                switch (this.set("total-all", e.totalCommentsFound), this.set("total-parent", e.totalParentCommentsFound), this.set("total-reader", e.totalRecommendationsFound), this.set("total-nytpicks", e.totalEditorsSelectionFound), this.set("total-nytreplies", e.totalReporterReplyCommentsFound), t.get("filter")) {
                case "all":
                    t.set("count", e.totalParentCommentsFound);
                    break;
                case "reader":
                    t.set("count", e.totalRecommendationsFound);
                    break;
                case "nytpicks":
                    t.set("count", e.totalEditorsSelectionFound);
                    break;
                case "nytreplies":
                    t.set("count", e.totalReporterReplyCommentsFound)
                }
                i.limit && t.trackRequested(i.limit)
            }
        },
        getUserContent: function () {
            var e = this,
                t = e.getThreads();
            ("undefined" == typeof this.getExcerpt() || 0 === this.getExcerpt().length) && this.apiGet({
                path: this.getAsset(),
                command: "content"
            }).done(function (i) {
                var n;
                i.hasOwnProperty("excerpts") && (n = new s({
                    context: 0,
                    filter: "excerpt",
                    stream: i.excerpts
                }), t.add(n), e.setExcerpt(n.getStream().models[0]))
            })
        },
        getNumberOfPosts: function (e) {
            return this.get("total-" + ("string" == typeof e ? e : "all"))
        },
        hasAdditionalPosts: function (e) {
            var t = this.getThreads(),
                i = this.buildValidQuery(e),
                n = t.findWhere(i);
            return n ? n.hasAdditionalPosts() : !1
        },
        isValidTaxonomy: function (e) {
            return "string" == typeof e && e.length > 0 && -1 === e.indexOf("undefined")
        },
        getAverageRating: function () {
            return this.get("averageRating")
        },
        getViews: function () {
            return this.get("views")
        },
        getAsset: function () {
            return this.get("asset")
        },
        getThreads: function () {
            return this.get("threads")
        },
        getTaxonomy: function () {
            return this.get("taxonomy")
        },
        getExcerpt: function () {
            return this.get("excerpt") || ""
        },
        getUser: function () {
            return this.get("user")
        },
        isOpen: function () {
            return this.get("isOpen")
        },
        getPrompt: function () {
            return this.get("prompt")
        },
        getFilters: function () {
            return this.get("filters")
        },
        getDefaultQuery: function () {
            return this.get("defaultQuery")
        },
        setTaxonomy: function (e) {
            this.set("taxonomy", e)
        },
        setExcerpt: function (e) {
            this.set("excerpt", e)
        },
        setOpen: function (e) {
            this.set("isOpen", e)
        },
        setPrompt: function (e) {
            this.set("prompt", e)
        },
        setFilters: function (e) {
            this.set("filters", e)
        },
        setUser: function (e) {
            this.set("user", e)
        },
        setDefaultQuery: function (e) {
            this.set("defaultQuery", e)
        }
    }));
    return a
}), define("shared/community/collections/community-loader", ["underscore/nyt", "foundation/hosts", "foundation/collections/base-collection", "shared/community/models/discussion", "shared/community/instances/community-user"], function (e, t, i, n, s) {
    "use strict";
    var a = i.extend({
        model: n,
        StatusCode: {
            ENABLED: "enabled",
            DISABLED: "disabled",
            WAITING: "waiting"
        },
        enabledQueue: [],
        disabledQueue: [],
        initialize: function () {
            this.subscribe("nyt:community-request", this.loadDiscussion), this.subscribe(this, "add", this.notify), this.subscribe(this, "add", this.setUserModel), this.status = this.StatusCode.WAITING, this.pageManager.isDomReady() ? this.ready() : this.subscribe("nyt:page-ready", this.ready)
        },
        enabled: function (e) {
            "function" == typeof e && this.enabledQueue.push(e)
        },
        disabled: function (e) {
            "function" == typeof e && this.disabledQueue.push(e)
        },
        ready: function () {
            this.setStatus(this.pageManager.$html.hasClass("has-comments") ? this.StatusCode.ENABLED : this.StatusCode.DISABLED), this.runQueue()
        },
        setStatus: function (e) {
            this.status = e
        },
        isEnabled: function () {
            return this.status === this.StatusCode.ENABLED
        },
        runQueue: function () {
            e.each(this[this.status + "Queue"], function (e) {
                e.call(this)
            }, this), this[this.status] = function (e) {
                "function" == typeof e && e.call(this)
            }
        },
        loadDiscussion: function (t, i, n) {
            var s;
            t = t || ((location.origin || location.protocol + "//" + location.hostname) + location.pathname).replace(/www\.dev|www\.sbx/i, "www.stg"), s = this.findWhere({
                asset: t
            }), this.local(i, "nyt:community-loading", t), s ? (s.getViews().push(i), this.notify(s, this, {}, i)) : this.add(e.extend({}, n || {}, {
                asset: t,
                views: [i],
                permID: location.hash.substr(location.hash.indexOf("=") + 1) || void 0
            }))
        },
        notify: function (e, t, i, n) {
            this.local(n || e.getViews()[0], "nyt:community-loaded", e)
        },
        setUserModel: function (e) {
            e.setUser(s)
        }
    });
    return a
}), define("shared/community/templates", ["underscore/nyt"], function (_) {
    var templates = {};
    return templates.button = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += "", skipToContentId && (__p += '\n<a class="visually-hidden" href="#' + (null == (__t = skipToContentId) ? "" : __t) + '">Continue reading the main story</a>\n'), __p += '\n<i class="icon"></i>\n', __p += count > 0 ? '\n<span class="button-text">\n' : '\n<span class="button-text no-comments">\n', __p += "\n", count > 0 ? (__p += '\n<span class="count">' + (null == (__t = count) ? "" : __t) + "</span>\n", showUnits && (__p += '\n<span class="units">' + (null == (__t = units) ? "" : __t) + "</span>\n"), __p += "\n") : defaultText && (__p += '\n<span class="default">' + (null == (__t = defaultText) ? "" : __t) + "</span>\n"), __p += "\n</span>";
        return __p
    }, templates.comments = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<section id="comments" class="comments" tabindex="1">\n<div class="comment-permalink-view">\n</div>\n<div class="comments-header-container">\n<header class="comments-header">\n<div id="Spon2" class="ad comments-tile-ad"></div>\n<h2 class="section-heading" tabindex="1"><i class="icon comments-icon"></i>' + (null == (__t = header) ? "" : __t) + "</h2>\n", commentPromptVisibility && (__p += '\n<p class="comment-prompt">' + (null == (__t = commentPrompt) ? "" : __t) + "</p>\n"), __p += "\n", isOpen || (__p += '\n<p class="comments-status">The comments section is closed. To send a letter to the editor, write to <a href="mailto:letters@nytimes.com">letters@nytimes.com</a>. </p>\n'), __p += '\n</header>\n<div class="comment-form-control form-control thread-form active"></div>\n<div class="comments-view-navigation">\n<div class="tabs-container">\n<ul class="tabs">\n', _.each(filters, function (e, t) {
            __p += '\n<li class="tab ' + (null == (__t = t) ? "" : __t) + '" data-filter="' + (null == (__t = t) ? "" : __t) + '" tabindex="5">' + (null == (__t = e) ? "" : __t) + '<span class="count" data-filter="' + (null == (__t = t) ? "" : __t) + '">&nbsp;' + (null == (__t = view.model.getNumberOfPosts(t)) ? "" : __t) + "</span></li>\n"
        }), __p += '\n</ul>\n</div>\n<div class= "comments-sort-container">\n<div class="comments-sort" tabindex="5">' + (null == (__t = sort) ? "" : __t) + '</div><i class="icon"></i>\n</div>\n</div>\n</div>\n<div class="comments-view tab-content" tabindex="50">\n<footer class="comments-footer">\n<div class="comments-expand comments-thread-expand" data-action="read-more" tabindex="55">Read More <i class="icon"></i></div>\n</footer>\n<div class="loader-container">\n<div class="loader loader-t-logo-32x32-ecedeb-ffffff"><span class="visually-hidden">Loading...</span></div>\n</div>\n</div><!-- close comments-view -->\n', view.model.getNumberOfPosts("all") > 1 && (__p += '\n<div class="view-all" data-filter="all">View all ' + (null == (__t = view.model.getNumberOfPosts("all")) ? "" : __t) + " comments</div>\n"), __p += "\n</section><!-- close comments -->";
        return __p
    }, templates.commentsPanel = function (obj) {
        {
            var __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<div class="panel-controls">\n<button class="button close-panel-button">\n<i class="icon"></i><span class="visually-hidden">Close this panel</span>\n</button>\n</div>\n<div class="panel-content">\n</div>';
        return __p
    }, templates.flag = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) {
            __p += '<form class="flag-form">\n';
            var i = 0;
            _.each(reasons, function (e, t) {
                i += 1, __p += '\n<div class="control checkbox-control control-' + (null == (__t = i % 2 === 1 ? "odd" : "even") ? "" : __t) + '">\n<div class="field-container">\n<input type="checkbox" value="' + (null == (__t = t) ? "" : __t) + '" id="flag-checkbox-' + (null == (__t = e) ? "" : __t) + '" name="flag-checkbox-' + (null == (__t = e) ? "" : __t) + '" class="flag-input checkbox" tabindex="' + (null == (__t = i) ? "" : __t) + '" />\n</div>\n<div class="label-container">\n<label for="flag-checkbox-' + (null == (__t = e) ? "" : __t) + '" class="checkbox-label">' + (null == (__t = t) ? "" : __t) + "</label>\n</div>\n</div><!-- close control -->\n"
            }), __p += '\n<div class="control last-control">\n<button id="flag-send-button" class="button flag-button" tabindex="' + (null == (__t = i += 1) ? "" : __t) + '" >Flag</button>\n<button id="flag-cancel-button" class="button cancel-button" tabindex="' + (null == (__t = i += 2) ? "" : __t) + '">Cancel</button>\n</div>\n</form>'
        }
        return __p
    }, templates.form = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<form class="comment-form" role="form">\n', "0" !== user.getUserId() && (__p += '<div class="control header-control layout-horizontal secondary-control">', user.getName() && user.getLocation() ? (__p += "<!-- registered/logged in commenter -->\n", user.hasAvatar() && (__p += '\n<div class="avatar"><img src="' + (null == (__t = user.getAvatar()) ? "" : __t) + '"/></div>\n'), __p += '\n<div class="commenter-meta">\n<h2 class="commenter">' + (null == (__t = user.getName()) ? "" : __t) + '</h2>\n<div class="form-hint-container">\n<p class="form-hint">Not You? <a href="' + (null == (__t = user.get("wwwhost") + "/logout") ? "" : __t) + '">Log Out</a></p>\n</div>\n<p class="commenter-location">' + (null == (__t = user.getLocation()) ? "" : __t) + "</p>\n</div>") : (__p += "\n<!-- first time commenter -->", user.hasAvatar() && (__p += '\n<div class="avatar"><img src="' + (null == (__t = user.getAvatar()) ? "" : __t) + '"/></div>\n'), __p += '<div class="control">\n<div class="label-container visually-hidden">\n<label for="commenter-input" id="commenter-input-label">Full Name</label>\n</div>\n<div class="field-container">\n<input type="text" id="commenter-input" name="commenter-input" class="commenter-input text" placeholder="Full Name" tabindex="3" autocomplete="off" aria-labelledby="commenter-input-label" aria-required="true"/>\n<button type="button" class="button clear-button" tabindex="-1" aria-describedby="clear-name-description"><i class="icon"></i><span class="visually-hidden" id="clear-name-description">Clear this text input</span></button>\n</div>\n</div><!-- close control --><div class="control">\n<div class="label-container visually-hidden">\n<label for="commenter-location-input" id="commenter-location-input-label">Location</label>\n</div>\n<div class="field-container">\n<input type="text" id="commenter-location-input" name="commenter-location-input" class="commenter-location-input text" placeholder="Location" tabindex="3" autocomplete="off" aria-labelledby="commenter-location-input-label" aria-required="true"/>\n<button type="button" class="button clear-button" tabindex="-1" aria-describedby="clear-location-description"><i class="icon"></i><span class="visually-hidden" id="clear-location-description">Clear this text input</span></button>\n</div>\n</div><!-- close control -->'), __p += "\n</div><!-- close control -->"), __p += '<div class="control input-control primary-control">\n<div class="label-container visually-hidden">\n<label class="commenter-gateway-input-label" for="commenter-gateway-input" id="commenter-gateway-input-label">' + (null == (__t = gatewayLabel) ? "" : __t) + '</label>\n</div>\n<div class="field-container">\n<input type="text" id="commenter-gateway-input" name="commenter-gateway-input" class="commenter-gateway-input comment-primary" placeholder="' + (null == (__t = gatewayPlaceholder) ? "" : __t) + '" tabindex="3" aria-labelledby="commenter-gateway-input-label" aria-required="false" />\n</div>\n</div><!-- close control -->', parseInt(user.getUserId(), 10) > 0 && (__p += '\n<div class="control textarea-control secondary-control">\n<p id="comment-character-count" class="comment-character-count">1500</p>\n<div class="field-container">\n<textarea id="comment-textarea" class="comment-textarea textarea" tabindex="3" aria-required="true"></textarea>\n<div class="error-container">\n<div id="comment-form-error" class="comment-form-error">\n<p class="character-error hidden">Please ensure that your comment is under 1500 characters, and then click Submit.</p>\n<p class="user-info-error hidden">Please enter your location and name.</p>\n<p class="server-error hidden">An error has occurred, please try again later.</p>\n</div>\n</div>\n</div>\n</div><!-- close control --><div class="control footer-control layout-horizontal secondary-control">\n<div class="control checkbox-control">\n<div class="field-container">\n<input type="checkbox" id="comment-notify" class="comment-notify" name="comment-notify" class="checkbox" tabindex="3"\n' + (null == (__t = user.getNotify() > 0 ? 'checked="checked"' : "") ? "" : __t) + ' aria-labelledby="comment-notify-label" aria-required="false" />\n</div><!-- close field-container -->\n<div class="label-container">\n<label class="checkbox-label" for="comment-notify" id="comment-notify-label">Email me when my comment is published.</label>\n<p class="form-description">Comments are moderated. <a href="http://www.nytimes.com/content/help/site/usercontent/usercontent.html">FAQ &raquo;</a></p>\n</div>\n</div><!-- close control -->\n<div class="control button-control">\n<span id="comment-submit-loader" class="comment-submit-loader hidden"><img src=""></span><!-- this may end up a data uri in the less -->\n<button type="submit" id="comment-submit-button" class="button comment-submit-button disabled" disabled="disabled" tabindex="3">Submit</button>\n</div><!-- close control -->\n</div><!-- close control -->'), __p += "\n</form>", confirmPost && (__p += '\n<div class="comment-confirmation">\n<p class="confirmation">', __p += message.commentNotify ? " Thank you for your submission. We'll notify you at " + (null == (__t = user.getEmail()) ? "" : __t) + " when your comment has been approved.\n" : "\nThank you for your submission. Your comment will appear once it has been approved.\n", __p += '</p>\n<article class="comment">\n', showAvatar && user.hasAvatar() && (__p += '\n<div class="avatar"><img src="' + (null == (__t = user.getAvatar()) ? "" : __t) + '"/></div>\n'), __p += '\n<header>\n<h2 class="commenter">' + (null == (__t = user.getName()) ? "" : __t) + "</h2>\n", showLocation && (__p += '\n<span class="commenter-location">' + (null == (__t = user.getLocation()) ? "" : __t) + "</span>\n"), __p += '\n<time class="comment-time" datetime="">Pending Approval</time>\n</header>\n<p class="comment-text">' + (null == (__t = message.commentBody) ? "" : __t) + "</p>\n</article>\n</div>\n"), __p += "";
        return __p
    }, templates.peek = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += "", skipToContentId && (__p += '\n<a class="visually-hidden" href="#' + (null == (__t = skipToContentId) ? "" : __t) + '">Continue reading the main story</a>\n'), __p += "\n", header && (__p += '\n<header>\n<h2 class="module-heading"><i class="icon"></i>' + (null == (__t = header) ? "" : __t) + "</h2>\n</header>\n"), __p += '\n<div class="comments-view">\n', _.each(posts, function (e, t) {
            isPrompt ? __p += '\n<h3 class="comment-prompt">' + (null == (__t = e) ? "" : __t) + '</h3>\n<p class="user-action"><a href="javascript:">Share your thoughts &raquo;</a></p>\n' : t < maxPosts && (__p += '\n<article class="comment" data-permid="' + (null == (__t = e.getPermId()) ? "" : __t) + '">\n<header>\n<h2 class="commenter">' + (null == (__t = e.getAuthor()) ? "" : __t) + "</h2>\n", showDate && (__p += '\n<time class="comment-time" datetime="">' + (null == (__t = e.get(dateFormat + "Date")) ? "" : __t) + "</time>\n"), __p += "\n", showLocation && (__p += '\n<span class="commenter-location">' + (null == (__t = e.getLocation()) ? "" : __t) + "</span>\n"), __p += '\n</header>\n<p class="comment-text">' + (null == (__t = e.get(isExcerpt ? "commentExcerpt" : "commentBody" + (maxChars || ""))) ? "" : __t) + "</p>\n</article>\n")
        }), __p += "\n</div><!-- close comments-view -->\n", showFooter && (__p += '\n<footer>\n<ul class="comment-actions">\n<li class="comment-count">\n', __p += showCount ? "\n" + (null == (__t = count) ? "" : __t) + " Comment" + (null == (__t = 1 === count ? "" : "s") ? "" : __t) + "\n" : "\nSee All Comments\n", __p += "\n</li>\n", isOpen && (__p += '\n<li class="comment-reply">Write a comment</li>\n'), __p += "\n</ul>\n</footer>\n"), __p += "";
        return __p
    }, templates.post = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<article class="comment ' + (null == (__t = isSubThread ? "threaded-comment" : "") ? "" : __t) + " " + (null == (__t = post.isPicked() ? "picked-comment" : "") ? "" : __t) + " " + (null == (__t = post.isNyt() ? "reporter-comment" : "") ? "" : __t) + '" data-id="' + (null == (__t = post.getId()) ? "" : __t) + '" data-parentid="' + (null == (__t = post.getParentId()) ? "" : __t) + '" data-sequence="' + (null == (__t = post.getSequence()) ? "" : __t) + '"  data-permID="' + (null == (__t = post.getPermId()) ? "" : __t) + '" tabindex="30">\n', post.isPicked() && (__p += '\n<i class="icon sprite-icon nyt-pick-icon"><span class="visually-hidden">NYT Pick</span></i>\n'), __p += "\n", showAvatar && post.hasAvatar() && (__p += '\n<div class="avatar"><img src="' + (null == (__t = post.getAvatar()) ? "" : __t) + '"/></div>\n'), __p += '\n<header>\n<h3 class="commenter">' + (null == (__t = post.getAuthor()) ? "" : __t) + "</h3>\n", (post.isTrusted() || post.isNyt()) && (__p += '\n<span class="commenter-credentials"><i class="icon sprite-icon ' + (null == (__t = post.isTrusted() ? "trusted-icon" : "t-icon") ? "" : __t) + '"><span class="visually-hidden">' + (null == (__t = post.isTrusted() ? "is a trusted commenter" : "is an NYTimes reporter") ? "" : __t) + "</span></i></span>\n"), __p += "\n", post.isNyt() ? __p += '\n<span class="commenter-title">' + (null == (__t = post.getUserTitle()) ? "" : __t) + "</span>\n" : showLocation && (__p += '\n<span class="commenter-location">' + (null == (__t = post.getLocation()) ? "" : __t) + "</span>\n"), __p += '\n<a href="' + (null == (__t = view.model.getAsset() + "#permid=" + post.getPermId()) ? "" : __t) + '"class="comment-time" datetime="">' + (null == (__t = post.get(dateFormat + "Date")) ? "" : __t) + '</a>\n</header>\n<p class="comment-text">' + (null == (__t = post.get("commentBody")) ? "" : __t) + '</p>\n<footer>\n<ul class="comment-actions">\n<li class="comment-flag login-modal-trigger ' + (null == (__t = post.isReported() ? "comment-reported" : "") ? "" : __t) + '"><i class="icon sprite-icon"></i>' + (null == (__t = post.isReported() ? "Reported" : "Flag") ? "" : __t) + "</li>\n", "all" !== filter && !isPermalink && post.getParentId() > 0 && (__p += '\n<li class="comment-parent" data-permid="' + (null == (__t = post.getParentPermId()) ? "" : __t) + '">In Reply to ' + (null == (__t = post.getParentAuthor()) ? "" : __t) + "</li>\n"), __p += "\n", isOpen && (__p += '\n<li class="comment-reply login-modal-trigger">Reply</li>\n'), __p += '\n<li class="comment-recommend login-modal-trigger ' + (null == (__t = post.isRecommended() ? "recommended" : "") ? "" : __t) + '">', post.getRecommendations() > 0 && (__p += "<span class='recommend-count'><i class=\"icon sprite-icon\"></i>" + (null == (__t = post.getRecommendations()) ? "" : __t) + "</span>"), __p += "" + (null == (__t = post.isRecommended() ? "Recommended" : "Recommend") ? "" : __t) + '</li>\n<li class="sharetools"><span class="facebook-share" data-share="facebook"><i class="icon sprite-icon"></i><span class="visually-hidden">Share this comment on Facebook</span></span><span class="twitter-share" data-share="twitter"><i class="icon sprite-icon"></i><span class="visually-hidden">Share this comment on Twitter</span></span></li>\n</ul>\n</footer>\n<div class="comment-form-control form-control reply-form-control active"></div>\n', post.hasReplies() && (__p += '\n<div class="thread"></div>\n', post.hasAdditionalReplies() && !isPermalink && "all" === filter && (__p += '\n<div class="comments-expand comments-subthread-expand">See All Replies <i class="icon"></i></div>\n'), __p += "\n"), __p += "\n</article>";
        return __p
    }, templates.verified = function (obj) {
        {
            var __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<a class="faq-link" href="http://www.nytimes.com/content/help/site/usercontent/verified/verified-commenters.html">\nVerified Commenters\n</a>\ncan leave comments on NYTimes.com without initial moderation. Verified status is earned based on a history of quality comments.';
        return __p
    }, templates
}), define("shared/community/views/comments-panel", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "shared/community/templates"], function (e, t, i, n) {
    "use strict";
    var s = i.extend({
        className: "comments-panel",
        template: n.commentsPanel,
        events: {
            "click .close-panel-button": "close",
            "mousewheel #comments": "handleMouseScroll",
            "DOMMouseScroll #comments": "handleMouseScroll"
        },
        nytEvents: {
            "nyt:community-commentspanel-open": "open",
            "nyt:community-commentspanel-close": "close",
            "nyt:messaging-critical-alerts-move-furniture": "movePanelForAlerts",
            "nyt:messaging-suggestions-move-furniture": "movePanelForAlerts"
        },
        defaultSettings: {},
        initialize: function (i) {
            this.settings = t.extend({}, this.defaultSettings, i), this.$main = e("#main"), this.$story = e("#story"), this.$commentsButton = e(".comments-button"), this.expandIsExplicit = !1, this.pageManager.isDomReady() ? this.render() : this.subscribe("nyt:page-ready", this.render)
        },
        render: function () {
            var t = this;
            return this.$el.hide().addClass(this.settings.className).html(this.template(this.settings)), this.$story.append(this.$el), this.$body.on("click", function (i) {
                e(i.target).hasClass("comments-panel-trigger") && t.open()
            }), this
        },
        open: function () {
            this.$commentsButton.each(function (t, i) {
                e(i).hasClass("button-masthead") ? e(i).addClass("active") : e(i).hide()
            }), this.$html.addClass("comments-panel-opened"), this.$el.show().animate({
                opacity: 1,
                right: this.handleRightOffset()
            }, 250), this.handlePanelSettings(), this.subscribe("nyt:page-breakpoint", this.handlePanelSettings), this.broadcast("nyt:comments-panel-opened")
        },
        close: function () {
            var t = this.pageManager.getMeta("isCommentsOpen");
            this.$el.animate({
                opacity: 0,
                right: "-40px"
            }, 250, function () {
                e(this).hide()
            }), this.$commentsButton.each(function (i, n) {
                var s = e(n);
                s.hasClass("button-masthead") ? s.removeClass("active") : s.hasClass("theme-speech-bubble") && !t ? s.hide() : s.show()
            }), this.$html.removeClass("comments-panel-opened"), this.stopSubscribing("nyt:page-breakpoint", this.handlePanelSettings), this.stopSubscribing("nyt:page-resize", this.adjustRightOffset), this.broadcast("nyt:comments-panel-closed")
        },
        scrollToTarget: function (e, t) {
            this.$body.animate({
                scrollTop: e.offset().top - t
            }, 500)
        },
        adjustRightOffset: function () {
            this.$el.css("right", this.$shell.offset().left + 1)
        },
        handleRightOffset: function () {
            var e, t = this.pageManager.getCurrentBreakpoint();
            return t >= 10070 ? (e = this.$shell.offset().left + 1, this.subscribe("nyt:page-resize", this.adjustRightOffset)) : (e = "0", this.stopSubscribing("nyt:page-resize", this.adjustRightOffset)), e
        },
        handlePanelSettings: function () {
            this.$el.css("right", this.handleRightOffset()), this.broadcast("nyt:community-panel-positioned")
        },
        movePanelForAlerts: function (e) {
            e(this.$el)
        },
        handleMouseScroll: function (e) {
            var t = e.originalEvent,
                i = e.currentTarget,
                n = t.wheelDelta || -t.detail,
                s = i.scrollHeight - i.scrollTop === i.clientHeight,
                a = 0 === i.scrollTop;
            return s && 0 > n || a && n > 0 ? (e.preventDefault(), !1) : !0
        }
    });
    return s
}), define("shared/community/views/utils-mixin", ["jquery/nyt", "underscore/nyt"], function (e, t) {
    "use strict";
    var i = {
        request: function () {
            this.broadcast("nyt:community-request", this.settings.asset, this, this.settings)
        },
        getPosts: function (e) {
            this.model = e, this.model.load(this.settings, this)
        },
        toQuery: function (e) {
            return e = e || {}, t.extend({}, this.settings, e)
        },
        openPanel: function (e) {
            var i;
            this.broadcast("nyt:community-commentspanel-open", e), i = t.extend({
                module: "Comments",
                action: "Click",
                eventName: "OpenCommentsPanel"
            }, this.getTrackingParams()), this.trackingTrigger("comments-open-panel", i), this.trackingComscorePVC(i)
        },
        truncate: function (e) {
            var i = this,
                n = function (e, t) {
                    return e.length <= t ? e : " " !== e.charAt(t) && "." !== e.charAt(t) ? n(e, t - 1) : e.substr(0, t) + "..."
                };
            "undefined" != typeof e && (e = e.slice ? e : [e], t.each(e, function (e) {
                e.set("commentBody" + i.settings.maxChars, n(i.stripHtml(e.getBody()), i.settings.maxChars))
            }))
        },
        stripHtml: function (t) {
            return "string" == typeof t ? e("<p>" + t + "</p>").text() : "" + t
        },
        formatDefaultDate: function (e) {
            return e
        },
        formatDate: function (e) {
            "undefined" != typeof e && (e = e.slice ? e : [e]), t.each(e, function (e) {
                var t = e.getDate();
                t = "interval" === this.settings.dateFormat ? this.prettyDate(t) : this.formatDefaultDate(t), e.set(this.settings.dateFormat + "Date", t), e.hasReplies() && this.formatDate(e.getReplies())
            }, this)
        },
        getTrackingParams: function () {
            var e = {},
                i = {
                    "theme-kicker": {
                        region: "Header",
                        version: "CommentsHeader"
                    },
                    "button-masthead": {
                        region: "TopBar",
                        version: "CommentsTopBar"
                    },
                    "selected-comment-marginalia": {
                        region: "Marginalia",
                        version: "RecentComments"
                    },
                    "featured-comment-marginalia": {
                        region: "Body",
                        version: "FeaturedComments"
                    },
                    "comment-prompt-marginalia": {
                        region: "Body",
                        version: "CommentsPrompt"
                    },
                    "theme-speech-bubble": {
                        region: "Body",
                        version: "CommentsBubble"
                    },
                    "comments-panel": {
                        region: "Body",
                        version: "CommentsPanel"
                    }
                },
                n = this.$el.attr("class").split(" ");
            return t.each(n, function (t) {
                i.hasOwnProperty(t) && (e = i[t])
            }), this.trackingBaseData.contentCollection = this.trackingBaseData.contentCollection || this.pageManager.getMeta("article:section"), e
        }
    };
    return i
}), define("shared/community/views/comments-button", ["underscore/nyt", "foundation/views/base-view", "shared/community/views/utils-mixin", "shared/community/templates"], function (e, t, i, n) {
    "use strict";
    var s = t.extend(e.extend({}, i, {
        template: n.button,
        events: {
            click: "openPanel"
        },
        defaultSettings: {
            units: "Comments",
            showUnits: !0,
            defaultText: null,
            hideWhenClosed: !1
        },
        initialize: function (t) {
            this.settings = e.extend({}, this.defaultSettings, t), this.subscribeOnce(this, "nyt:community-loaded", this.render), this.request()
        },
        render: function (t) {
            var i, n = t.getNumberOfPosts(),
                s = this.$el.attr("data-skip-to-para-id");
            return 1 === n && (this.settings.units = "Comment"), i = e.extend({}, this.settings, {
                count: n,
                skipToContentId: s
            }), this.model || (this.model = t, this.listenTo(t, "change:total-all", this.render)), !this.model.isOpen() && this.settings.hideWhenClosed ? this.$el.hide() : (this.$el.html(this.template(i)), this)
        }
    }));
    return s
}), define("shared/sharetools/helpers/sharetools-config", [], function () {
    "use strict";
    var e = {};
    return e.common = {
        mainClassName: "shareTools",
        itemClassName: "shareToolsItem",
        defaultActiveShares: "email,facebook,twitter,save,show-all|more,ad",
        defaultShowAllShares: "facebook|Share,email|Email,twitter|Tweet,linkedin|LinkedIn,google|Google+,reddit|Reddit,save|Save,reprints|Reprints,print|Print,ad",
        defaultUrl: window.location.href.replace(/#.*/, ""),
        defaultTitle: document.title,
        defaultDescription: "",
        defaultAdPosition: "Frame4A",
        defaultOverlayAdPosition: "Frame6A",
        defaultWidth: 600,
        defaultHeight: 450,
        defaultTransition: "fade",
        labelSpecialChar: "|",
        hasAd: !1,
        loadedAdPositions: [],
        shortUrlApi: "http://www.nytimes.com/svc/bitly/shorten.jsonp",
        emailThisUrl: "https://www.nytimes.com/mem/email-this.html?url=",
        count: 0
    }, e.tools = {
        facebook: {
            active: !0,
            onShowAll: !0,
            label: "Facebook",
            postUrl: "http://www.facebook.com/sharer.php",
            postType: "popup",
            shareParameters: {
                url: "u"
            },
            smid: "fb-share",
            width: 655,
            height: 430
        },
        twitter: {
            active: !0,
            onShowAll: !0,
            label: "Twitter",
            postUrl: "https://twitter.com/share",
            postType: "popup",
            shareParameters: {
                url: "url",
                title: "text",
                via: "via"
            },
            smid: "tw-share",
            width: 600,
            height: 450
        },
        google: {
            active: !0,
            onShowAll: !0,
            label: "Google+",
            postUrl: "https://plus.google.com/share",
            postType: "popup",
            shareParameters: {
                url: "url"
            },
            urlParameters: {
                hl: "en-US"
            },
            smid: "go-share",
            width: 600,
            height: 600
        },
        tumblr: {
            active: !0,
            onShowAll: !0,
            label: "Tumblr",
            postUrl: "http://www.tumblr.com/share/link",
            postType: "popup",
            shareParameters: {
                url: "url",
                title: "name",
                description: "description"
            },
            smid: "tu-share",
            width: 560
        },
        linkedin: {
            active: !0,
            onShowAll: !0,
            label: "Linkedin",
            postUrl: "http://www.linkedin.com/shareArticle",
            postType: "popup",
            shareParameters: {
                url: "url",
                title: "title",
                description: "summary"
            },
            urlParameters: {
                mini: "true",
                source: "The New York Times"
            },
            smid: "li-share",
            width: 750,
            height: 450
        },
        reddit: {
            active: !0,
            onShowAll: !0,
            label: "Reddit",
            postUrl: "http://www.reddit.com/submit",
            postType: "popup",
            shareParameters: {
                url: "url",
                title: "title"
            },
            smid: "re-share",
            width: 854,
            height: 550
        },
        email: {
            loginModalText: "Log in to email",
            active: !0,
            onShowAll: !0,
            label: "Email",
            loginRequired: !0
        },
        permalink: {
            active: !0,
            onShowAll: !0,
            label: "Permalink",
            postUrl: "http://www.nytimes.com/export_html/common/new_article_post.html",
            postType: "popup",
            shareParameters: {
                url: "url",
                title: "title",
                description: "summary"
            },
            smid: "pl-share",
            width: 460,
            height: 380,
            loginRequired: !1
        },
        "show-all": {
            active: !0,
            onShowAll: !1,
            label: "Show All"
        },
        reprints: {
            active: !0,
            onShowAll: !1,
            label: "Reprints",
            postUrl: "https://s100.copyright.com/AppDispatchServlet",
            postType: "popup",
            shareParameters: {
                url: "contentID"
            },
            urlParameters: {
                publisherName: "The New York Times",
                publication: "nytimes.com",
                token: "",
                orderBeanReset: "true",
                postType: "",
                wordCount: "",
                title: document.title,
                publicationDate: "",
                author: ""
            }
        },
        save: {
            loginModalText: "Log in to save",
            active: !0,
            onShowAll: !1,
            label: "Save",
            postUrl: e.common.defaultUrl.replace(/\?.*/, ""),
            loginRequired: !0
        },
        print: {
            active: !0,
            onShowAll: !1,
            label: "Print",
            postUrl: e.common.defaultUrl,
            postType: "link",
            urlParameters: {
                pagewanted: "print"
            }
        },
        ad: {
            active: !0,
            onShowAll: !1,
            label: "Advertisement"
        },
        embed: {
            active: !0,
            onShowAll: !0,
            label: "Embed",
            loginRequired: !1
        },
        pinterest: {
            active: !0,
            onShowAll: !0,
            label: "Pinterest",
            postUrl: "https://www.pinterest.com/pin/create/button/",
            postType: "popup",
            shareParameters: {
                url: "url",
                media: "media",
                description: "description"
            },
            smid: "pin-share",
            width: 600,
            height: 450,
            loginRequired: !1
        }
    }, e
}), define("shared/sharetools/helpers/sharetools-mixin", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "shared/sharetools/templates", "shared/ad/views/ads", "shared/sharetools/views/email", "shared/modal/views/modal", "shared/sharetools/instances/cross-platform-save", "foundation/models/page-storage", "foundation/hosts", "foundation/models/user-data", "shared/sharetools/helpers/sharetools-config", "shared/sharetools/instances/short-url"], function (e, t, i, n, s, a, o, r, l, d, c, h, u) {
    "use strict";
    var m = {
        getDataAttrs: function (e, i) {
            var n, s, a, o = i || this.$el.data(),
                r = (o.shares || h.common[e ? "defaultShowAllShares" : "defaultActiveShares"]).split(","),
                l = [],
                d = h.common.hasAd;
            for (e && (h.common.defaultUrl.indexOf("aponline") > -1 || h.common.defaultUrl.indexOf("reuters") > -1 || h.common.defaultUrl.indexOf("magazine") > -1 || h.common.defaultUrl.indexOf("t-magazine") > -1) && (r = t.without(r, "reprints|Reprints")), s = 0, a = r.length; a > s; s += 1) r[s].indexOf("|") > 0 ? (n = r[s].split("|"), l.push({
                type: n[0],
                label: n[1]
            })) : "ad" === r[s] ? d = !0 : l.push({
                type: r[s],
                label: r[s]
            });
            return h.tools.reprints.urlParameters.publicationDate = o.publishDate, t.extend({}, {
                inlineTools: l,
                ad: d,
                url: h.common.defaultUrl,
                title: h.common.defaultTitle,
                description: h.common.defaultDescription
            }, o)
        },
        setUpConfigOptions: function () {
            h.common.defaultTitle = this.pageManager.getMeta("og:title") || document.title, h.common.defaultDescription = this.pageManager.getMeta("description") || ""
        },
        isMobileSharetools: function () {
            return this.pageManager.getCurrentBreakpoint() < 1e3
        },
        openMailToLink: function () {
            var e = "%0A%0A",
                t = encodeURIComponent(this.settings.title),
                i = encodeURIComponent(this.settings.description),
                n = encodeURIComponent(this.settings.url),
                s = "NYTimes.com: " + t,
                a = "From The New York Times:" + e + t + e + i + e + n;
            window.location = "mailto:?subject=" + s + "&body=" + a
        },
        handleShortUrlShareAction: function (t, i) {
            var n, s = this,
                a = window.open("", t.label + "Share", "toolbar=0,status=0,height=" + t.height + ",width=" + t.width + ",scrollbars=yes,resizable=yes"),
                o = i || this.settings.url,
                r = this.createAnchor(o);
            t.smid && !this.pageManager.isMobile() && (r.search += 0 === r.search.indexOf("?") ? "&" : "?", r.search += "smid=" + t.smid, o = r.href), n = u.requestUrl(o) || "", n ? this.shortUrlRedirect(n, t, a) : this.listenToOnce(u, "add", function () {
                var e = u.findWhere({
                    url: o
                });
                e && s.shortUrlRedirect(e.get("shortUrl"), t, a)
            }), navigator.userAgent.match(/iPad/i) && navigator.userAgent.match(/Safari/i) && this.shortUrlRedirect(e("#masthead").find(".story-short-url").text(), t, a)
        },
        shortUrlRedirect: function (i, n, s) {
            var a, o, r, l = [],
                d = t.extend({}, this.settings);
            n.shareParameters && d && (r = this.getTrackingParam(), r && (n.shareParameters.smv = r, d.smv = null), e.each(n.shareParameters, function (e, t) {
                a = "url" === e ? i : d[e], a ? l.push(t + "=" + encodeURIComponent(a)) : null === a && l.push(t)
            })), l = l.join("&"), o = n.postUrl + this.paramChar(n.postUrl) + l, this.shoveUrlToNewWindow(o, s)
        },
        shoveUrlToNewWindow: function (e, t) {
            t.document.location = e, t.document.close()
        },
        itemSaved: function () {
            l.get("sharetools_hasSaves") !== !0 ? (this.firstTimeSaveModal(), l.set("sharetools_hasSaves", !0)) : this.growlSaveModal()
        },
        growlSaveModal: function () {
            var e = new o({
                id: "save-item-growl-modal",
                modalTitle: '<i class="icon"></i>Saved',
                tailDirection: "centered",
                openCallback: function () {
                    window.setTimeout(this.removeFromPage, 2e3)
                }
            }).addToPage();
            t.defer(e.open)
        },
        firstTimeSaveModal: function () {
            var e = new o({
                id: "save-item-modal",
                modalTitle: '<i class="icon"></i>Saved',
                modalContent: n.savemodal({
                    link: d.www + "/saved"
                }),
                hasOverlay: !0,
                hasCloseButton: !0,
                tailDirection: "centered",
                closeCallback: function () {
                    this.removeFromPage()
                }
            }).addToPage();
            t.defer(e.open)
        },
        saveAction: function () {
            var e = r.where({
                url: this.settings.url
            });
            return c.isLoggedIn() ? void(0 === e.length ? (this.subscribeOnce(r, "nyt:xps-saved", this.itemSaved), r.save(this.settings.url)) : this.growlSaveModal()) : !0
        },
        paramChar: function (e) {
            return -1 !== e.indexOf("?") ? "&" : "?"
        },
        buildUrl: function (i, n) {
            var s, a, o, r = h.tools[i],
                l = [],
                d = r.postUrl,
                c = t.extend({}, n || this.settings),
                m = this.getTrackingParam();
            return m && (r.urlParameters = r.urlParameters || {}, r.urlParameters[m] = null), a = u.getRicoUrl(c.url), a && "email" !== i && (c.url = a), o = this.createAnchor(c.url), r.smid && (o.search += 0 === o.search.indexOf("?") ? "&" : "?", o.search += "smid=" + r.smid, c.url = o.href), r.shareParameters && c && e.each(r.shareParameters, function (e, t) {
                s = c[e], l.push(t + "=" + encodeURIComponent(s))
            }), r.urlParameters && e.each(r.urlParameters, function (e, t) {
                l.push(null !== t ? e + "=" + encodeURIComponent(t) : e)
            }), l = l.join("&"), d = d + this.paramChar(d) + l
        },
        popupShareAction: function (e, t) {
            var i = h.tools[e],
                n = i.width ? i.width : h.common.defaultWidth,
                s = i.height ? i.height : h.common.defaultHeight,
                a = this.buildUrl(e, t);
            window.open(a, e + "Share", "toolbar=0,status=0,height=" + s + ",width=" + n + ",scrollbars=yes,resizable=yes")
        },
        getTrackingParam: function () {
            var e = this.isUserVariant("articleSharetools"),
                t = "smv" + e;
            return "string" == typeof e ? t : void 0
        }
    };
    return m
}), define("shared/sharetools/views/showall", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "shared/modal/views/modal", "shared/ad/views/ads", "shared/sharetools/templates", "shared/sharetools/helpers/sharetools-config", "shared/sharetools/helpers/sharetools-mixin", "shared/sharetools/views/email", "foundation/models/user-data", "shared/sharetools/instances/short-url"], function (e, t, i, n, s, a, o, r, l, d, c) {
    "use strict";
    var h = i.extend(t.extend({}, r, {
        events: {
            "click .sharetool": "handleLinkClick",
            "click .short-url-input, .text": "handleInputSelect"
        },
        className: "show-all-view-container",
        defaultModalSettings: {
            id: "show-all-sharetool-modal",
            modalTitle: "share this video",
            binding: ".show-all-sharetool",
            tailDirection: "up",
            hasOverlay: !1,
            hasCloseButton: !1,
            positionTailSide: !1,
            autoPosition: !1,
            modalContent: "",
            tailLeftOffset: 0,
            tailTopOffset: 0,
            template: "showAllSharetoolModal",
            openCallback: function () {
                this.$target.addClass("active")
            },
            closeCallback: function () {
                this.$target.removeClass("active"), this.removeFromPage()
            }
        },
        articleTools: ["save", "print", "reprints"],
        initialize: function (e, i) {
            var n;
            t.bindAll(this, "handleShortUrl"), this.settings = t.extend({}, this.getDataAttrs(!0, i)), this.modalSettings = t.extend({}, this.defaultModalSettings, e), this.isMobileSharetools() && (this.modalSettings = t.extend({}, this.modalSettings, {
                tailDirection: "centered",
                hasCloseButton: !0,
                hasOverlay: !0,
                positionTailSide: !1,
                autoPosition: !1
            })), n = this.createAnchor(this.settings.url), n.search += 0 === n.search.indexOf("?") ? "&" : "?", n.search += "smid=pl-share", this.settings.permalinkUrlWithSmid = n.href, this.settings.shortUrl = c.requestUrl(this.settings.permalinkUrlWithSmid) || "", this.settings.shortUrl || this.listenToOnce(c, "add", this.handleShortUrl), this.render(), this.trackingBaseData = {
                module: "ShareTools",
                action: "click",
                contentCollection: this.pageManager.getMeta("article:section")
            }
        },
        render: function () {
            var e = this.settings.ad ? "Frame6A" : "";
            this.modalSettings.modalContent = a[this.modalSettings.template](this.buildShareHTML()), this.modalSettings.modalFooter = a.shareToolsModalFooter({
                toolTypeSponsor: "Share"
            }), this.showAllModal = new n(this.modalSettings), this.setElement(this.showAllModal.$modal), this.showAllModal.$modal.find(".show-all-sharetool-modal-ad").attr("id", e), this.showAllModal.addToPage(), this.settings.ad && this.pageManager.getCurrentBreakpoint() >= 1e3 && new s({
                positions: [e],
                scope: "modal",
                autoconfirm: 0
            }), this.settings.embedCode && this.handleEmbedCode(), this.settings.shortUrl && this.handleShortUrl()
        },
        buildShareHTML: function () {
            var e, i, n, s = this.settings.inlineTools,
                r = "",
                l = "";
            for (e = 0, i = s.length; i > e; e += 1) n = a.showallLinks({
                shareObj: s[e],
                config: o.tools[s[e].type]
            }), t.indexOf(this.articleTools, s[e].type) >= 0 ? l += n : r += n;
            return {
                shortUrl: this.settings.shortUrl,
                showAllLinkList: r,
                showAllToolList: l
            }
        },
        handleShortUrl: function () {
            var e = c.findWhere({
                url: this.settings.permalinkUrlWithSmid
            });
            e && (this.settings.shortUrl = e.get("shortUrl"), this.showAllModal.$modal.find(".short-url-input").val(this.settings.shortUrl))
        },
        handleEmbedCode: function () {
            this.settings.embedCode && this.showAllModal.$modal.find(".embed-input").val(this.settings.embedCode)
        },
        handleInputSelect: function (e) {
            e.target.select()
        },
        handleLinkClick: function (t) {
            var i = e(t.target),
                n = i.data("share") || i.parent().data("share"),
                s = "popup" === o.tools[n].postType ? "popup" : n,
                a = {
                    version: this.settings.contentType || "Content",
                    region: "ToolsMenu"
                };
            switch (this.showAllModal.close(), "save" === n || "reprints" === n || "print" === n ? (a.module = "ArticleTools", a.eventName = "ArticleTool-" + n) : a.eventName = "Share-" + n, this.trackingTrigger("share-tools-click", a), s) {
            case "email":
                this.isMobileSharetools() ? this.openMailToLink() : d.isLoggedIn() && new l({
                    dataUrl: this.settings.url
                });
                break;
            case "popup":
                "twitter" === n ? this.handleShortUrlShareAction(o.tools[n]) : this.popupShareAction(n);
                break;
            case "save":
                this.saveAction();
                break;
            case "reprints":
                this.popupShareAction(n);
                break;
            case "print":
                window.print()
            }
        }
    }));
    return h
}), define("shared/sharetools/views/sharetools", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "shared/sharetools/templates", "shared/sharetools/views/email", "shared/sharetools/views/showall", "shared/sharetools/instances/cross-platform-save", "foundation/models/user-data", "shared/sharetools/helpers/sharetools-config", "shared/sharetools/helpers/sharetools-mixin"], function (e, t, i, n, s, a, o, r, l, d) {
    "use strict";
    var c = i.registerView("sharetools").extend(t.extend({}, d, {
        events: {
            "click .sharetool": "handleShareAction"
        },
        defaultModalData: {
            shares: "facebook|Share,email|Email,twitter|Tweet,linkedin|LinkedIn,google|Google+,reddit|Reddit,save|Save,reprints|Reprints,print|Print,ad"
        },
        initialize: function (e) {
            0 === this.$el.length || this.$el.hasClass("sharetools-init") || (this.settings = t.extend({}, this.getDataAttrs(), e), this.modalSettings = t.extend({}, e.showAllModalSettings), this.modalData = t.extend({}, this.$el.data(), this.defaultModalData, e.showAllModalData), this.$el.addClass("sharetools"), this.setUpConfigOptions(), this.render(), this.trackingBaseData = {
                module: "ShareTools",
                version: this.$el.data("content-type") || "Content",
                action: "click",
                contentCollection: this.pageManager.getMeta("article:section"),
                pgtype: this.pageManager.getMeta("PT")
            })
        },
        render: function () {
            var t, i = this.$el.find(".sharetools-inline-article-ad"),
                s = n.shareTools({
                    shares: this.settings.inlineTools,
                    config: l.tools
                });
            return this.$el.addClass("sharetools-init"), i.length > 0 ? e(s).insertBefore(this.$el.find(".sharetools-inline-article-ad")) : this.$el.append(s), this.settings.ad && (t = this.pageManager.getCurrentBreakpoint() <= 1020 ? "Position1" : "Frame4A", this.$el.find(".sharetools-inline-article-ad").attr("id", t), this.broadcast("nyt:ads-new-placement", t)), this
        },
        handleShareAction: function (t) {
            var i = e(t.target),
                n = i.data("share") || i.parent().data("share"),
                o = "popup" === l.tools[n].postType ? "popup" : n,
                d = this.trackingBaseData;
            switch (i.parents(".video-player-region").size() > 0 ? d.region = "video-player-region" : i.parents("#main").size() > 0 ? d.region = "Body" : i.parents("#masthead").size() > 0 && (d.region = "TopBar"), "show-all" === n ? d.eventName = "Share-ShowAll" : "save" === n || "reprints" === n || "print" === n ? (d.module = "ArticleTools", d.eventName = "ArticleTool-" + n) : d.eventName = "Share-" + n, this.trackingTrigger("share-tools-click", d), o) {
            case "email":
                this.isMobileSharetools() ? this.openMailToLink() : r.isLoggedIn() && new s({
                    dataUrl: this.settings.url
                });
                break;
            case "save":
                this.saveAction();
                break;
            case "popup":
                "twitter" === n ? this.handleShortUrlShareAction(l.tools[n]) : this.popupShareAction(n);
                break;
            case "embed":
                t.stopPropagation(), this.$(".show-all-sharetool a").trigger("click"), this.$body.find(".show-all-sharetool-modal #embed-input").select();
                break;
            case "show-all":
                new a(this.modalSettings, this.modalData)
            }
        },
        changeActiveState: function () {
            this.$(".show-all-sharetool").hasClass("active") ? this.$(".show-all-sharetool").removeClass("active") : this.$(".show-all-sharetool").addClass("active")
        }
    }));
    return c
}), define("shared/community/views/flag-modal", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "shared/community/api-mixin", "shared/modal/views/modal", "shared/community/templates"], function (e, t, i, n, s, a) {
    "use strict";
    var o = i.extend(t.extend({}, n, {
        defaultSettings: {
            id: "flag-modal",
            addlClasses: "flag-modal",
            modalContent: "",
            binding: ".comment-flag:not(.comment-reported)",
            tailDirection: "down-right",
            hasOverlay: !1,
            reasons: {
                Vulgar: "Vulgar",
                Spam: "Spam",
                Inflammatory: "Inflammatory",
                "Off Topic": "Off-topic",
                "Personal Attack": "Personal-attack"
            },
            openCallback: function () {
                this.flaggedComment = this.$target.parents(".comment").data("id"), this.$target.addClass("active"), this.subscribeOnce("nyt:page-scroll", this.close), this.subscribeOnce(this.comments, "nyt:community-scroll", this.close)
            }
        },
        events: {
            "click .flag-button": "submitFlag",
            "click .cancel-button": "handleClose"
        },
        initialize: function (e) {
            var i = this;
            this.defaultSettings.closeCallback = function () {
                i.resetReasons(), this.flaggedComment = 0, this.$target.removeClass("active")
            }, this.modalSettings = t.extend({}, this.defaultSettings, e), this.modalSettings.modalContent = a.flag(this.modalSettings), this.render(), this.model = e.model, this.flagModal.comments = e.view
        },
        render: function () {
            this.flagModal = new s(this.modalSettings).addToPage(), this.setElement(this.flagModal.$modal)
        },
        getReasons: function () {
            var e = 0,
                i = "";
            return t.each(this.modalSettings.reasons, function (t) {
                this.$("#flag-checkbox-" + t).is(":checked") && (i += e > 0 ? "," + t : t, e += 1)
            }, this), i
        },
        resetReasons: function () {
            t.each(this.modalSettings.reasons, function (e) {
                this.$("#flag-checkbox-" + e).attr("checked", !1)
            }, this)
        },
        submitFlag: function () {
            var e = this;
            return this.apiPost({
                command: "flag",
                userID: this.model.getUser().getUserId(),
                commentID: this.flagModal.flaggedComment,
                asset: this.model.getAsset(),
                commentLabels: this.getReasons()
            }).always(function () {
                e.local(e.flagModal.comments, "nyt:community-comment-flagged", e.flagModal.flaggedComment), e.flagModal.close()
            }), !1
        },
        removeLinkFromReported: function () {
            e(".comment-reported").click(function (e) {
                e.preventDefault()
            })
        },
        handleClose: function () {
            return this.flagModal.close(), !1
        }
    }));
    return o
}), define("shared/community/views/verified-modal", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "shared/modal/views/modal", "shared/community/templates"], function (e, t, i, n, s) {
    "use strict";
    var a = i.extend({
        defaultSettings: {
            id: "verified-modal",
            addlClasses: "verified-modal",
            modalContent: "",
            binding: ".trusted-icon",
            tailDirection: "down",
            tailLeftOffset: 7,
            canOpenOnHover: !0,
            hasOverlay: !1,
            closeOnMouseOut: !0,
            closeOnClick: !1,
            openCallback: function () {
                this.subscribeOnce("nyt:page-scroll", this.close), this.subscribeOnce("nyt:community-scroll", this.close)
            }
        },
        initialize: function (e) {
            this.modalSettings = t.extend({}, this.defaultSettings, e), this.modalSettings.modalContent = s.verified(this.modalSettings), this.render()
        },
        render: function () {
            this.verifiedModal = new n(this.modalSettings).addToPage(), this.setElement(this.verifiedModal.$modal)
        }
    });
    return a
}), define("shared/community/views/comments", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "foundation/models/user-data", "shared/community/views/utils-mixin", "shared/sharetools/views/sharetools", "shared/sharetools/helpers/sharetools-config", "shared/community/views/flag-modal", "shared/community/views/verified-modal", "shared/community/templates", "foundation/lib/polyfills/placeholder"], function (e, t, i, n, s, a, o, r, l, d, c) {
    "use strict";
    var h = i.extend(t.extend({}, s, {
        template: d.comments,
        postTemplate: d.post,
        formTemplate: d.form,
        shareTools: null,
        events: {
            click: "toggleForm",
            "click .comments-thread-expand": "loadMore",
            "click .comments-subthread-expand": "loadReplies",
            "click .comments-view-navigation li": "loadFilter",
            "click .comments-sort-container": "loadSort",
            "click .comments-view .comment .comment-time": "handlePermalinkClick",
            "click .comments-view .comment .comment-parent": "handlePermalinkClick",
            "click .comment-recommend": "recommend",
            "click .sharetools span": "handleShare",
            "click .comment-submit-button": "submitForm",
            "click .comment-reply": "toggleReplyForm",
            "click .view-all": "loadFilter",
            "keypress .commenter-gateway-input": "toggleForm",
            "focus .commenter-gateway-input": "toggleForm"
        },
        active: {
            0: {},
            permalink: {}
        },
        defaultSettings: {
            header: "Comments",
            maxPosts: 25,
            filter: "all",
            sort: "newest",
            showDate: !0,
            dateFormat: "interval",
            showLocation: !0,
            showAvatar: !0,
            maxCharCount: 1500,
            adPlacement: "Spon2",
            defaultPrompt: "Share your thoughts.",
            animateSpeed: 250
        },
        initialize: function (i) {
            this.settings = t.extend({}, this.defaultSettings, i), this.shareTools = new a({
                el: e("<div>")
            }), this.subscribe(this, "nyt:community-loaded", this.getPosts), this.subscribe(this, "nyt:community-post-recommended", this.updateRecCount), this.subscribe(this, "nyt:community-comment-posted", this.confirmPost), this.subscribe("nyt:comments-panel-opened nyt:page-breakpoint nyt:page-resize", this.resizeHeaderContainer), this.subscribeOnce(this, "nyt:community-thread-loaded", this.render), this.subscribe("nyt:community-commentspanel-open", function (e) {
                (t.isString(e) || t.isNumber(e)) && this.loadPermalink("" + e), this.$el.focus(), this.panelActive(!0)
            }), this.subscribe("nyt:comments-panel-closed", function () {
                this.resetForms(), this.panelActive(!1)
            }), this.request()
        },
        request: function () {
            this.broadcast("nyt:community-request", this.settings.asset, this, this.settings)
        },
        getPosts: function (e) {
            var t;
            this.model = this.model || e, this.model.getDefaultQuery() ? (t = this.model.getDefaultQuery(), this.settings.filter = t.filter || this.settings.filter, this.settings.sort = t.sort || this.settings.sort, this.model.load(this.settings, this)) : this.subscribeOnce(this.model, "nyt:community-summary", this.getPosts)
        },
        render: function (e) {
            var i = this,
                n = this.model.getPrompt(),
                s = {
                    all: "All",
                    reader: "Readers&#8217; Picks",
                    nytpicks: "NYT Picks",
                    nytreplies: "NYT Replies"
                },
                a = t.extend({}, this.settings, {
                    filters: {},
                    header: "Comment",
                    view: this,
                    isOpen: this.model.isOpen(),
                    commentPrompt: n,
                    commentPromptVisibility: n.toLowerCase() !== this.settings.defaultPrompt.toLowerCase()
                }),
                o = t.throttle(function () {
                    i.toggleHeader(), i.broadcast(i.comments, "nyt:community-scroll")
                }, 500);
            return this.subscribe(this, "nyt:community-request", function (e) {
                e.limit || "replies" === e.filter || i.toggleLoader(!0)
            }), this.subscribe(this, "nyt:community-thread-loaded", function () {
                i.toggleLoader(!1)
            }), this.subscribe(this, "nyt:community-comment-flagged", this.confirmFlagged), this.model.getNumberOfPosts() > 0 && (a.header = this.model.getNumberOfPosts() + " " + a.header + (this.model.getNumberOfPosts() > 1 ? "s" : "")), this.settings.showDate && this.formatDate(a.posts), t.each(this.model.getFilters(), function (e) {
                a.filters[e] = s[e]
            }, this), this.subscribe(this, "nyt:community-thread-loaded", this.updateView), this.$el.html(this.template(a)).show(), this.renderAd(), this.cacheElements(), this.updateView(e), this.updateNavigation(), this.toggleSortButtons(), this.toggleLoadButtons(), this.renderForm(), this.renderFlagModal(), this.renderVerifiedModal(), this.toggleEmpty(0 === e.length), this.cloneHeader(), this.$comments.on("drag scroll touchend touchstart touchmove swipe", o), this.$clonedHeader.find(".section-heading").on("touchend click", function () {
                i.updateScrollPosition()
            }), this.broadcast("nyt:community-rendered", this.settings.asset, this), t.defer(function () {
                i.readHash()
            }), this.pageManager.setMeta("isCommentsOpen", this.model.isOpen()), this
        },
        cacheElements: function () {
            this.$comments = this.$(".comments"), this.$loader = this.$comments.find(".loader-container").hide(), this.$panelBody = this.$comments.find(".comments-view"), this.$loadMore = this.$comments.find(".comments-footer"), this.$permalink = this.$(".comment-permalink-view"), this.$viewAll = this.$(".view-all"), this.$header = this.$(".comments-header-container"), 0 === this.$loadMore.length && this.subscribeOnce(this, "nyt:community-thread-loaded", this.cacheElements)
        },
        setActive: function (e, i, n) {
            e = e || [], i && (n ? this.active.permalink = {} : this.active = {
                0: {},
                permalink: {}
            }), t.each(e, function (e) {
                var t = n ? "permalink" : e.getParentId();
                this.active[t] || (this.active[t] = {}), this.active[t][e.getId()] = e
            }, this)
        },
        isActive: function (e, i) {
            var n = !1;
            return i ? n = e && e.getId ? this.active.permalink[e.getId()] : this.active.permalink[e] : "number" == typeof e ? t.each(this.active, function (i) {
                t.has(i, e) && (n = i[e])
            }) : n = e && e.getParentId && this.active[e.getParentId()] ? this.active[e.getParentId()][e.getId()] : !1, n
        },
        configureProperties: function (e) {
            return e = e || {}, "undefined" == typeof e.isPermalink && (e.isPermalink = !1), e.isPermalink ? (e.container = this.$permalink, e.isSubThread = !1, "number" == typeof e.parent && (e.container = this.$permalink.find("[data-id=" + e.parent + "]").find(".thread"), e.isSubThread = !0)) : "number" == typeof e.parent ? (e.container = this.$panelBody.find("[data-id=" + e.parent + "]").find(".thread"), e.isSubThread = !0) : e.container && e.container.attr ? (e.container = e.container.find(".thread"), e.isSubThread = !0) : (e.container = this.$panelBody, e.isSubThread = !1), e.isSubThread && (e.clearView = !1), e.view = this, e
        },
        updateView: function (e, t, i) {
            t = t || e, i = this.configureProperties(i), this.settings.showDate && this.formatDate(t), i.clearView && this.unload(), this.addPostsToView(t, i), this.setActive(t, i.clearView, i.isPermalink), i.isSubThread || (this.togglePermalink(i.isPermalink), this.toggleLoadButtons(), this.orderElements(), this.toggleSortButtons(), this.updateNavigation()), 0 === e && this.updateNavigation(), this.toggleEmpty(0 === t.length)
        },
        updateScrollPosition: function () {
            this.slideHeaderUp(), this.$comments.scrollTop(0), this.$(".thread-form").show()
        },
        resizeHeaderContainer: function () {
            var e;
            this.$comments && (e = this.$comments.width() - 15, this.$header.css({
                width: e
            }), this.$clonedHeader.css({
                width: e
            }))
        },
        orderElements: function () {
            this.$loader.appendTo(this.$panelBody), this.$loadMore.appendTo(this.$panelBody)
        },
        addPostsToView: function (e, i) {
            var n = i.container.children("article"),
                s = this.model.isOpen(),
                a = this;
            t.each(e, function (e, o) {
                var r;
                this.isActive(e, i.isPermalink) || (r = this.postTemplate(t.extend({}, this.settings, i, {
                    post: e,
                    view: a,
                    isOpen: s,
                    index: o
                })), n[o] ? this.$(n[o]).before(r) : i.container.append(r))
            }, this)
        },
        togglePermalink: function (e) {
            this.$permalink[e ? "show" : "hide"]()
        },
        toQuery: function (e) {
            return e = e || {}, t.extend({}, this.settings, e)
        },
        loadMore: function () {
            this.model.load(this.toQuery({
                limit: this.settings.maxPosts
            }), this), this.track("load-more-comments", {
                eventName: "More-coms-in-panel",
                module: "Comments",
                action: "Click",
                region: "Comments"
            })
        },
        loadReplies: function (e, i) {
            var n;
            t.isObject(i) || (i = {}), t.isObject(e) ? (n = this.$(e.target).parents(".comment"), this.$(e.target).remove(), e = parseInt(n.data("sequence"), 10)) : n = this.$("[data-sequence=" + e + "]"), this.model.load(this.toQuery({
                context: e,
                filter: "replies",
                sort: "oldest"
            }), this, t.extend({
                container: n
            }, i)), this.track("load-replies", {
                eventName: "All-replies",
                module: "Comments",
                action: "Click",
                region: "Comments"
            })
        },
        loadFilter: function (e) {
            var t = this.$(e.target).data("filter");
            this.settings.filter = t, this.settings.sort = "reader" === t ? t : "newest", this.toggleLoadButtons(), this.model.load(this.toQuery(), this, {
                clearView: !0
            }), this.updateScrollPosition()
        },
        loadSort: function () {
            this.settings.sort = this.$(".comments-sort").data("sort"), this.model.load(this.toQuery({
                sort: this.$(".comments-sort").data("sort")
            }), this, {
                clearView: !0
            }), this.updateScrollPosition()
        },
        handlePermalinkClick: function (t) {
            var i, n;
            i = e(t.target), i.data("permid") || (i = i.parents(".comment")), n = i.data("permid"), this.loadPermalink(n), t.preventDefault()
        },
        loadPermalink: function (e) {
            var t;
            e += "", t = e.split(":")[0], this.$permalink.empty(), this.setActive([], !0, !0), this.subscribeOnce(this, "nyt:community-thread-loaded", function (e) {
                e[0] && this.loadReplies(t, {
                    isPermalink: !0,
                    parent: e[0].getId()
                })
            }), this.model.load(this.toQuery({
                filter: "permalink",
                permID: t
            }), this, {
                isPermalink: !0
            }), this.updateScrollPosition(), this.pageManager.setUrlHash("permid=" + e)
        },
        unload: function () {
            this.setActive([], !0), this.$loadMore.detach(), this.$loader.detach(), this.$panelBody.empty().append(this.$loadMore).append(this.$loader)
        },
        panelActive: function (e) {
            this.pageManager.setMeta("commentspanel_isOpen", e)
        },
        toggleLoadButtons: function () {
            this.model.hasAdditionalPosts(this.settings) ? this.$loadMore.find(".comments-expand").show() : this.$loadMore.find(".comments-expand").hide(), "all" !== this.settings.filter ? this.model.hasAdditionalPosts(this.settings) ? this.$viewAll.hide() : this.$viewAll.show() : this.$viewAll.hide()
        },
        toggleSortButtons: function () {
            var e = this.$(".comments-sort-container"),
                t = this.$(".comments-sort");
            "all" === this.settings.filter ? (this.settings.sort = this.settings.sort || "newest", "newest" === this.settings.sort ? t.text("Newest").data("sort", "oldest") : t.text("Oldest").data("sort", "newest"), e.show()) : e.hide()
        },
        updateNavigation: function () {
            this.$(".tab").removeClass("selected").filter("[data-filter=" + this.settings.filter + "]").addClass("selected")
        },
        recommend: function (e) {
            var t, i = this.$(e.target).hasClass("comment-recommend") ? this.$(e.target) : this.$(e.target).parents(".comment-recommend:first"),
                n = i.parents(".comment:first"),
                s = this.isActive(parseInt(n.data("id"), 10));
            s.recommend(t, this.model.getAsset(), this, i)
        },
        updateRecCount: function (e, t) {
            var i, n = "";
            e.getRecommendations() > 0 && (n = '<span class="recommend-count"><i class="icon"></i>' + e.getRecommendations() + "</span>"), e.isRecommended() ? (t.html(n + "Recommended").addClass("recommended"), i = "Rec") : (t.html(n + "Recommend").removeClass("recommended"), i = "Un-Rec"), this.track("recommend-comment", {
                eventName: i,
                module: "Comments",
                action: "Click",
                region: "Comments"
            })
        },
        handleShare: function (e) {
            var t = this.$(e.target).data("share") || this.$(e.target).parent().data("share"),
                i = this.$(e.target).parents(".comment:first").data("permid"),
                n = o.tools[t];
            "facebook" === t ? this.shareTools.popupShareAction(t, {
                url: this.model.getAsset() + "#permid=" + i
            }) : this.shareTools.handleShortUrlShareAction(n, this.model.getAsset() + "#permid=" + i), this.track("comments-share", {
                module: "ShareTools",
                action: "Click",
                version: "CommentsPanel",
                region: "Comments",
                eventName: "Share-" + (n.label || "").toLowerCase()
            })
        },
        renderAd: function () {
            this.settings.adPlacement && this.broadcast("nyt:ads-new-placement", this.settings.adPlacement)
        },
        renderForm: function () {
            var e = this;
            this.model.isOpen() && (this.$(".thread-form").html(this.formTemplate({
                user: this.model.getUser(),
                confirmPost: !1,
                gatewayLabel: this.model.getPrompt(),
                gatewayPlaceholder: this.settings.defaultPrompt
            })).on("change keyup cut paste", function () {
                e.updateCount(e.$(".thread-form")), e.toggleSubmitButton(e.$(".thread-form"))
            }), this.toggleForm(), c())
        },
        toggleForm: function (e) {
            var t;
            e ? (t = this.$(e.target), 0 === t.parents(".thread-form").length ? this.toggleForm() : n.isLoggedIn() ? (this.$(".thread-form .primary-control").hide(), this.$(".thread-form .secondary-control").show(), t.hasClass(".thread-form") && t.find("textarea").focus()) : (t.blur(), e.preventDefault(), e.stopPropagation(), this.broadcast("nyt:loginmodal-open", {
                modalTitle: "Log in to comment"
            }))) : (this.$(".thread-form .secondary-control").hide(), this.$(".thread-form .primary-control").show())
        },
        confirmPost: function (e, t) {
            var i = t.$formControl || this.$(".thread-form");
            this.toggleSubmitButton(i, !1), this.toggleTextBox(i, !1), i.html(this.formTemplate({
                user: this.model.getUser(),
                confirmPost: !0,
                message: e,
                showAvatar: this.settings.showAvatar,
                showLocation: this.settings.showLocation,
                gatewayLabel: this.model.getPrompt(),
                gatewayPlaceholder: this.settings.defaultPrompt
            })), i.find("form").hide().parent().find(".comment-confirmation").show()
        },
        updateCount: function (e) {
            var t = this.settings.maxCharCount - e.find(".comment-textarea").val().length;
            e.find(".comment-character-count").text(t)
        },
        checkUserInfo: function (e) {
            var t = e.find(".commenter-input").length > 0 ? e.find(".commenter-input").val() : null,
                i = e.find(".commenter-location-input").length > 0 ? e.find(".commenter-location-input").val() : null,
                n = !1,
                s = new RegExp(/^([a-zA-Z0-9])+([a-zA-Z0-9\._\-])*@([a-zA-Z0-9_\-])+([a-zA-Z0-9\._\-]+)+$/);
            return null === t || 0 !== t.length && !s.test(t) ? null === i || 0 !== i.length && !s.test(i) || (n = !0) : n = !0, this.toggleFormError(e, n, "user-info"), !n
        },
        toggleFormError: function (e, t, i) {
            var n, s;
            t ? (n = "removeClass", s = "attr") : (n = "addClass", s = "removeAttr"), e.find("." + i + "-error")[n]("hidden")[s]("aria-live", "assertive")[s]("role", "alert")
        },
        checkCommentForm: function (e) {
            var t = parseInt(e.find(".comment-character-count").text(), 10),
                i = !1,
                n = !1;
            return 0 > t ? (i = !0, n = !0) : t === this.settings.maxCharCount && (n = !0), this.toggleFormError(e, i, "character"), !n
        },
        toggleSubmitButton: function (e, t) {
            var i, n, s;
            "undefined" == typeof t ? (i = !this.checkUserInfo(e), n = !this.checkCommentForm(e), s = i || n) : s = t, s ? e.find(".comment-submit-button").attr("disabled", "disabled").addClass("disabled") : e.find(".comment-submit-button").removeAttr("disabled").removeClass("disabled")
        },
        toggleEmpty: function (e) {
            n.isLoggedIn() && ("undefined" == typeof e && 0 === this.model.totalPosts() ? (this.$(".thread-form .primary-control").hide(), this.$(".thread-form .secondary-control").show()) : e && (this.$(".thread-form .primary-control").hide(), this.$(".thread-form .secondary-control").show()))
        },
        submitForm: function (e) {
            var t = this.$(e.target),
                i = t.closest(".comment"),
                n = i.data("id"),
                s = i.data("parentid"),
                a = t.closest(".form-control"),
                o = {
                    $formControl: a,
                    parentId: n,
                    ancestorId: s
                };
            a.find(".commenter-input").length && (this.model.getUser().setName(this.stripHtml(a.find(".commenter-input").val())), this.model.getUser().setLocation(this.stripHtml(a.find(".commenter-location-input").val()))), this.toggleSubmitButton(a, !0), this.toggleTextBox(a, !0), this.model.post(this, {
                commentBody: this.stripHtml(a.find(".comment-textarea").val()),
                commentNotify: a.find(".comment-notify").is(":checked")
            }, o), e.preventDefault(), this.track("post-comment", {
                eventName: "Post",
                module: "Comments",
                action: "Click",
                region: "Comments"
            })
        },
        toggleTextBox: function (e, t) {
            t ? e.find("textarea").attr("disabled", "disabled").addClass("disabled") : e.find("textarea").removeAttr("disabled").removeClass("disabled")
        },
        toggleReplyForm: function (e) {
            var t = this.$(".thread-form"),
                i = this.$(e.target).closest(".comment"),
                n = i.find(".reply-form-control").first(),
                s = i.closest(".comments-view, .comment-permalink-view"),
                a = this;
            0 === n.find(".secondary-control").length && (n = n.append('<form class="comment-form comment-reply-form">').find("form"), s.find(".secondary-control").parents(".reply-form-control").empty(), t.find(".secondary-control").each(function (e, i) {
                t.find(i).clone().show().appendTo(n.show().focus())
            }), n.on("change keyup cut paste", function () {
                a.updateCount(a.$(".reply-form-control")), a.toggleSubmitButton(a.$(".reply-form-control"))
            }), n.find(".comment-character-count").html(this.settings.maxCharCount), n.find(".comment-submit-button").attr("disabled", "disabled").addClass("disabled"))
        },
        renderFlagModal: function () {
            n.isLoggedIn() && (this.$flagModal = new r({
                model: this.model,
                view: this
            }))
        },
        renderVerifiedModal: function () {
            this.$verifiedModal = new l
        },
        cloneHeader: function () {
            this.$clonedHeader = this.$header.clone().find(".form-control").remove().end().hide(), this.$el.append(this.$clonedHeader)
        },
        toggleHeader: function () {
            this.$panelBody.position().top < 0 ? this.$clonedHeader.isDown || this.slideHeaderDown() : this.$clonedHeader.isDown && this.slideHeaderUp()
        },
        toggleLoader: function (e) {
            this.$loader[e ? "show" : "fadeOut"]()
        },
        confirmFlagged: function (e) {
            this.$("[data-id=" + e + "]").find(".comment-flag:first").addClass("comment-reported").html("Reported")
        },
        readHash: function () {
            var e = this.pageManager.getUrlHash(),
                t = !1;
            "commentsContainer" === e ? (this.broadcast("nyt:community-commentspanel-open"), t = !0) : e.indexOf("permid") > -1 && (this.broadcast("nyt:community-commentspanel-open", e.substr(7)), t = !0), t && this.track("auto-open-comments-panel", {
                module: "Comments",
                version: "AutoOpen",
                action: "click",
                region: "FixedRight",
                eventName: "OpenCommentsPanel"
            })
        },
        resetForms: function () {
            this.$(".thread-form .comment-textarea").length > 0 && (this.updateCount(this.$(".thread-form").find("textarea").val("").end()), this.toggleSubmitButton(this.$(".thread-form"))), this.$(".reply-form-control .comment-textarea").length > 0 && (this.updateCount(this.$(".reply-form-control").find("textarea").val("").end()), this.toggleSubmitButton(this.$(".reply-form-control")))
        },
        track: function (e, i) {
            this.trackingTrigger(e, t.extend(this.getTrackingParams(), i))
        },
        slideHeaderDown: function () {
            this.$header.addClass("invisible"), this.$clonedHeader.isDown = !0, this.$clonedHeader.stop(!0).show().css({
                position: "absolute",
                top: "-" + this.$clonedHeader.height() + "px"
            }).removeClass("hidden").animate({
                top: 0,
                opacity: 1
            }, this.settings.animateSpeed)
        },
        slideHeaderUp: function () {
            this.$clonedHeader.isDown = !1, this.$clonedHeader.stop(!0).addClass("hidden"), this.$header.removeClass("invisible")
        }
    }));
    return h
}), define("interactive/instances/community", ["shared/community/collections/community-loader", "shared/community/views/comments-panel", "shared/community/views/comments-button", "shared/community/views/comments"], function (e, t, i, n) {
    "use strict";
    (new e).enabled(function () {
        new t, new n({
            el: ".panel-content"
        }), new i({
            el: ".comments-button.theme-kicker",
            defaultText: "Comment"
        }), new i({
            el: ".button-masthead",
            showUnits: !1
        }), new i({
            el: ".comments-button.theme-upshot",
            defaultText: "Comment"
        })
    })
}), define("interactive/instances/whats-next", ["foundation/views/page-manager", "shared/whatsnext/views/whats-next"], function (e, t) {
    "use strict";
    e.getMeta("errorpage") && new t({
        registered: "most-emailed,top-news",
        anonymous: "most-emailed,top-news"
    })
}), define("shared/masthead/views/masthead-api", ["jquery/nyt", "foundation/views/base-view"], function (e, t) {
    "use strict";
    var i = t.extend({
        el: "#masthead",
        position: "fixed",
        inStory: !1,
        initialize: function () {
            this.$container = e(".container"), this.$ribbon = e(".ribbon"), this.inStoryHeight = this.$el.height()
        },
        hide: function () {
            this.$el.hide(), this.$ribbon.addClass("no-masthead")
        },
        show: function () {
            this.$el.show(), this.$ribbon.removeClass("no-masthead")
        },
        getElement: function () {
            return this.$el
        },
        swap: function (e) {
            this.$el.find(".container").hide(), e && (this.$emptyMasthead || (this.$el.append('<div class="empty-masthead"></div>'), this.$emptyMasthead = this.$el.find(".empty-masthead")), this.$emptyMasthead.html(e))
        },
        restore: function () {
            this.$el.find(".container").show(), this.$el.find(".empty-masthead").remove(), this.$emptyMasthead = !1, this.$el.removeAttr("style"), this.$ribbon.css("margin-top", "").removeClass("no-masthead"), this.$container.css("min-height", ""), this.inStoryHeight = this.$el.height()
        },
        setHeight: function (e) {
            if (!e || "number" != typeof e) throw new Error("Masthead API - setHeight requires a number as an argument");
            this.inStoryHeight = e, this.$el.css("height", e), this.$container.css("min-height", e), this.$ribbon.css("margin-top", e), "absolute" === this.$el.css("position") && this.$el.css("margin-top", -e)
        },
        setPosition: function (e) {
            if ("fixed" === e) this.$el.css({
                position: "fixed",
                "margin-top": "0"
            }), this.broadcast("nyt:masthead-fixed");
            else {
                if ("absolute" !== e) throw new Error('Masthead API - setPosition only accepts "absolute" or "fixed" as arguments');
                this.$el.css({
                    position: "absolute",
                    "margin-top": -this.inStoryHeight + 1,
                    right: 0,
                    width: "auto"
                }), this.$ribbon.addClass("no-masthead"), this.broadcast("nyt:masthead-absolute")
            }
        },
        set: function (e) {
            if (!e || "object" != typeof e) throw new Error("Masthead API - set method requires an object as an argument");
            e.height && this.setHeight(e.height), e.position && this.setPosition(e.position), e.content && this.swap(e.content), e.change && this.change(e.change)
        },
        change: function (e) {
            var t = this;
            if (!e || "function" != typeof e) throw new Error("Masthead API - change method requires a function as an argument");
            this.subscribe("nyt:masthead-storytheme", function (i) {
                t.inStory = i, e(i)
            })
        },
        isInStory: function () {
            return this.inStory
        }
    });
    return i
}), define("shared/masthead/instances/masthead-api", ["shared/masthead/views/masthead-api"], function (e) {
    "use strict";
    return new e
}), define("shared/messaging/templates", ["underscore/nyt"], function (_) {
    var templates = {};
    return templates.followButton = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<button class="button follow-button ' + (null == (__t = classes) ? "" : __t) + '">\n<i class="icon sprite-icon"></i>\n<span class="button-text">' + (null == (__t = buttonText) ? "" : __t) + "</span>\n</button>";
        return __p
    }, templates.followConfirmation = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<div class="message message-unfollow-confirmation" data-timestamp="' + (null == (__t = timestamp) ? "" : __t) + '">\n', thumb && (__p += '\n<div class="thumb">\n<img src="' + (null == (__t = thumb) ? "" : __t) + '" />\n</div>\n'), __p += '\n<div class="message-content">\n<p class="message-title">Unfollow <span class="collection-name">' + (null == (__t = following) ? "" : __t) + '</span>?</p>\n<div class="button-container">\n<button class="button unfollow-button"><i class="icon sprite-icon"></i>Unfollow</button>\n<button class="button keep-following-button">Keep Following</button>\n</div>\n</div>\n</div>';
        return __p
    }, templates.followInfo = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<div class="follow-info ' + (null == (__t = followClass) ? "" : __t) + '">\n<div class="thumb ' + (null == (__t = type) ? "" : __t) + '">\n<img src="' + (null == (__t = thumb) ? "" : __t) + '" alt="" role="presentation"/>\n</div>\n<h4 class="collection-name">' + (null == (__t = following) ? "" : __t) + '</h4>\n<p class="description">' + (null == (__t = description) ? "" : __t) + "</p>\n</div>";
        return __p
    }, templates.followUnfollowed = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<div class="message message-unfollow-confirmed" data-timestamp="' + (null == (__t = timestamp) ? "" : __t) + "\">\n<div class=\"message-content\">\n<p class='message-title'>You are no longer following <span class='collection-name'>" + (null == (__t = following) ? "" : __t) + "</span>. <button class='button undo-action-button'>Undo</button></p>\n</div>\n</div>";
        return __p
    }, templates.message = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) {
            if (__p += "", closeButton && (__p += '\n<button class="button close-message">\n<i class="icon"></i>\n<span class="visually-hidden">Close alert</span>\n</button>\n'), __p += "", sub_type && (sub_type = sub_type.replace(/([A-Z])/g, "-$1").toLowerCase(), "-" === sub_type.charAt(0) && (sub_type = sub_type.substr(1))), __p += '<div class="message ' + (null == (__t = sub_type) ? "" : __t) + '" data-messageId="' + (null == (__t = id) ? "" : __t) + '"><i class="icon sprite-icon"></i>', label && (__p += '\n<span class="label">' + (null == (__t = label) ? "" : __t) + "</span>\n"), __p += '<span class="message-content">\n<span class="message-title">' + (null == (__t = title) ? "" : __t) + "</span>\n", buttons.length > 0) {
                __p += "\n";
                for (var i = 0; i < buttons.length; i++) buttons[i].url && (__p += '\n<a href="' + (null == (__t = buttons[i].url) ? "" : __t) + '" class="button message-button action-button">' + (null == (__t = buttons[i].text) ? "" : __t) + "</a>\n");
                __p += "\n"
            }
            if (__p += "\n", 1 === display_type_id && start_time) {
                var minutes, hours, formatted, date = new Date(1e3 * start_time);
                hours = date.getHours(), minutes = date.getMinutes(), minutes = 9 >= minutes ? "0" + minutes : minutes, ampm = hours >= 12 ? "PM" : "AM", hours = hours > 12 ? hours - 12 : hours, formatted = "" + hours + ":" + minutes + " " + ampm, __p += '\n<span class="timestamp">\n' + (null == (__t = formatted) ? "" : __t) + "\n</span>\n"
            }
            __p += "\n", 4 === display_type_id && (__p += "\n<a href='#' class=\"close-message\">" + (null == (__t = payload.dsm_cpy) ? "" : __t) + "</a>\n"), __p += "\n</span></div>"
        }
        return __p
    }, templates.messenger = function (obj) {
        {
            var __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<div class="message-bed"></div>';
        return __p
    }, templates.notificationModals = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += "", __p += message_type ? '\n<div class="message comment-' + (null == (__t = message_type) ? "" : __t) + '-message">\n' : '\n<div class="message">\n', __p += "\n", __p += link ? '\n<a href="' + (null == (__t = link) ? "" : __t) + '">\n' : "\n<a class='link-to-panel' href=\"#\">\n", __p += "\n" + (null == (__t = emphasize(title, emphasis)) ? "" : __t) + '\n</a>\n<span class="message-metadata">\n', timestamp && (__p += '\n<time class="timestamp" datetime="' + (null == (__t = timestamp) ? "" : __t) + '">' + (null == (__t = this.prettyDate(1e3 * timestamp) || "Just now") ? "" : __t) + "</time>\n"), __p += "\n</span>\n</div>";
        return __p
    }, templates.notificationsModal = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += "", "default" === show ? __p += '\n<div class="message-container">\n<div class="message message-default">\n<div class="message-content">\n<p class="message-title">You have no new notifications.</p>\n<p>Follow columns and be notified when new articles are published.</p>\n</div>\n<div class="follow-suggestions"></div>\n</div>\n</div>\n' : (__p += "\n", __p += message_type ? '\n<div class="message message-comment-' + (null == (__t = message_type) ? "" : __t) + '" data-timestamp="' + (null == (__t = timestamp) ? "" : __t) + '">\n' : '\n<div class="message" data-timestamp="' + (null == (__t = timestamp) ? "" : __t) + '">\n', __p += "\n", 6 === display_type_id && (__p += '\n<button class="button unsubscribe-button" title="Unfollow ' + (null == (__t = following) ? "" : __t) + '"><i class="icon sprite-icon"></i></button>\n'), __p += "\n", link && (__p += '\n<a class="message-link" href="' + (null == (__t = link) ? "" : __t) + '">\n'), __p += "\n", thumb && 5 !== display_type_id && (__p += '\n<div class="thumb"><img src="' + (null == (__t = thumb) ? "" : __t) + '" /></div>\n'), __p += '<div class="message-content">\n<p class="message-title">' + (null == (__t = emphasize(title, emphasis)) ? "" : __t) + "</p>\n", 5 === display_type_id && comment_body && (__p += '\n<div class="comment-excerpt">\n', display_name && "replied" === message_type && (__p += '\n<div class="commenter">\n<p class="commenter-name">' + (null == (__t = display_name) ? "" : __t) + "</p>\n", location && (__p += '\n<p class="commenter-location">' + (null == (__t = location) ? "" : __t) + "</p>\n"), __p += "\n</div>\n"), __p += '\n<p class="comment-text" data-truncate="true">' + (null == (__t = comment_body) ? "" : __t) + "</p>\n</div>\n"), __p += "\n", 5 === display_type_id && (__p += '\n<i class="icon sprite-icon"></i>\n'), __p += "\n", timestamp && (__p += '\n<time class="timestamp" datetime="' + (null == (__t = timestamp) ? "" : __t) + '">' + (null == (__t = this.prettyDate(1e3 * timestamp) || "Just now") ? "" : __t) + "</time>\n"), __p += "\n</div>\n", link && (__p += "</a>"), __p += "\n</div>\n"), __p += "";
        return __p
    }, templates.onboardingFirstFollow = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<p class="prompt"><strong>You are following ' + (null == (__t = collectionName) ? "" : __t) + ".</strong> Every time a new " + (null == (__t = collectionName) ? "" : __t) + " article is published, you will receive an alert in your notifications panel in the top right corner of your screen.</p>";
        return __p
    }, templates.onboardingIntroducingNotifications = function (obj) {
        {
            var __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<p class="prompt"><strong>Introducing the notifications panel.</strong> Follow columns and receive an alert when new articles are published.</p>';
        return __p
    }, templates.onboardingSuggestFollow = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<p class="prompt"><strong>Follow ' + (null == (__t = collectionName) ? "" : __t) + "</strong> and receive an alert when a new article is published.</p>";
        return __p
    }, templates
}), define("shared/messaging/views/messenger-format-mixin", ["underscore/nyt"], function (e) {
    "use strict";
    var t = {
        emphasizeTitle: function (t, i) {
            var n, s, a, o, r, l, d, c = [],
                h = [],
                u = 0,
                m = t.length;
            if (!i || 0 === i.length) return t;
            for (s = e.sortBy(i, function (e) {
                return e.offset
            }); s.length > 0;) {
                if (o = s.shift(), r = o.offset + o.count, l = o.offset, u > l || r > m) return t;
                l === u && c.length > 0 ? (a = c.pop(), a += t.slice(l, r), c.push(a), u = r) : (l > u && c.push(t.slice(u, l)), c.push(t.slice(l, r)), d = {
                    index: c.length - 1,
                    treatment: o.treatment
                }, h.push(d), u = r), 0 === s.length && u !== m && c.push(t.slice(r))
            }
            return e.each(h, function (e) {
                var t = e.index,
                    i = e.treatment;
                c[t] = e.url ? '<a class="link action-link' + i + ' href="' + e.url + '"">' + c[t] + "</a>" : '<span class="' + i + '">' + c[t] + "</span>"
            }), n = c.join("")
        }
    };
    return t
}), define("shared/messaging/views/message", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "shared/messaging/templates", "shared/messaging/views/messenger-format-mixin"], function (e, t, i, n, s) {
    "use strict";
    var a = i.registerView("messaging").extend({
        className: "message-container hidden",
        events: {
            "click .close-message": "dismissed",
            "mousedown .action-button": "acknowledged",
            "mousedown .action-link": "acknowledged"
        },
        defaults: {
            closeButton: !0,
            dismissAcknowledged: !0,
            hiddenClass: "hidden",
            revealClass: "",
            show: function () {
                this.$el.removeClass(this.settings.hiddenClass).addClass(this.settings.revealClass)
            },
            hide: function () {
                this.$el.removeClass(this.settings.revealClass).addClass(this.settings.hiddenClass)
            }
        },
        initialize: function (e) {
            this.settings = t.extend({}, this.defaults, e), this.template = n[this.settings.template], this.subscribe("nyt:messaging-modal-" + this.model.id + "-dismissed", this.popupDismissed), this.subscribe("nyt:messaging-modal-" + this.model.id + "-acknowledged", this.popupAcknowledged), this.subscribe(this, "nyt:messaging-message-expired", this.expired)
        },
        render: function () {
            var e = this;
            return this.$el.html(e.template(t.extend(e.model.toJSON(), e.settings, {
                link: e.model.getPrimaryLink(),
                emphasize: s.emphasizeTitle,
                emphasis: e.model.getCombinedEmphasis()
            }))).addClass(this.settings.hiddenClass).data("id", e.model.get("id")), e.model.get("display_type_id") < 5 && this.model.get("links") && this.insertLinks(), e.$el.find(".message").addClass(e.model.get("unread") ? "is-unread" : "is-read no-transition"), this
        },
        replaceBetween: function (e, t, i, n) {
            return n.substring(0, e) + i + n.substring(t)
        },
        insertLinks: function () {
            var e, t, i, n, s, a, o, r = this.$el.find(".message-title"),
                l = r.html(),
                d = this.model.get("links");
            for (d.length > 1 && d.sort(function (e, t) {
                return t.start - e.start
            }), o = 0; o < d.length; o++)
                if (e = d[o].offset, i = d[o].count, n = decodeURI(d[o].url), e + i && (t = e + i), n && "null" !== n)
                    if ("undefined" != typeof e && "undefined" != typeof t) {
                        if (d[o - 1] && t > d[o - 1].start) break;
                        s = l.substring(e, t), a = '<a class="action-link" href="' + n + '">' + s + "</a>", l = this.replaceBetween(e, t, a, l)
                    } else l = '<a class="action-link" href="' + n + '">' + l + "</a>";
            r.html(l)
        },
        reveal: function (e) {
            e ? this.settings.show.call(this) : this.settings.hide.call(this)
        },
        dimensions: function () {
            return {
                width: this.$el.outerWidth(),
                height: this.$el.outerHeight()
            }
        },
        displayed: function (e) {
            e = e || 0, this.markRead(e), this.model.displayed()
        },
        markRead: function (e) {
            var t = this.$el.find(".message"),
                i = this;
            e = void 0 !== e ? e : 1500, t.hasClass("is-unread") && window.setTimeout(function () {
                i.model.get("display_type_id") >= 5 && i.broadcast("nyt:messaging-count-received", -1), t.removeClass("is-unread").addClass("is-read")
            }, e)
        },
        showOnce: function () {
            this.model.showOnce()
        },
        acknowledged: function () {
            this.settings.dismissAcknowledged && this.model.acknowledged(), this.local(this, "nyt:messaging-message-view-acknowledged", this)
        },
        expired: function () {
            this.model.expired(), this.local(this, "nyt:messaging-message-view-expired", this)
        },
        dismissed: function (e) {
            this.model.dismissed(), this.local(this, "nyt:messaging-message-view-dismissed", this), e.preventDefault()
        },
        popupDismissed: function () {
            this.model.setRead(), this.markRead(0)
        },
        popupAcknowledged: function () {
            this.model.setRead(), this.markRead()
        }
    });
    return a
}), define("shared/messaging/models/message", ["backbone/nyt", "underscore/nyt", "foundation/models/base-model", "foundation/models/page-storage"], function (e, t, i, n) {
    "use strict";
    var s = i.extend({
        defaults: {
            display_type_id: 1,
            id: "",
            title: "",
            status: "new",
            sub_type: "",
            label: "",
            pub_date: "",
            start_time: "",
            end_time: "",
            links: [],
            buttons: [],
            payload: {},
            message_type: "",
            thumb: !1,
            comment_body: !1,
            timestamp: !1,
            location: "",
            unread: !0,
            version: 1
        },
        initialize: function () {
            var e, t = this.get("display_type_id"),
                i = this.get("start_time"),
                n = this.get("version");
            5 === t && n > 1 ? (e = this.get("last_modified"), this.set("timestamp", e)) : this.set("timestamp", i), t >= 5 && void 0 === this.get("popup_unread") && this.set("popup_unread", !0)
        },
        showOnce: function () {
            this.setRead(), this.saveToLocalStorage()
        },
        setStatus: function (e) {
            this.set("status", e)
        },
        displayed: function () {
            this.set("unread", !1), this.set("status", "displayed")
        },
        acknowledged: function () {
            this.set("unread", !1), this.set("status", "acknowledged"), this.saveToLocalStorage()
        },
        expired: function () {
            this.set("unread", !1), this.set("status", "expired"), this.saveToLocalStorage()
        },
        dismissed: function () {
            this.set("unread", !1), this.set("status", "dismissed"), this.saveToLocalStorage()
        },
        getPrimaryLink: function () {
            var e = this.get("links");
            return e && e[0] && e[0].url ? e[0].url : !1
        },
        applyMetadata: function (e) {
            var t, i, n;
            e && (i = e[0], n = e[2], this.set("version", i), this.set("unread", n), e.length > 3 && (t = e[3], this.set("popup_unread", t)))
        },
        updateProperties: function (e) {
            var t, i, n, s, a = ["byline", "comment_body", "display_name", "display_location", "emphasis", "end_time", "following", "headline", "last_modified", "links", "sub_type", "tag", "thumb", "timestamp", "title"];
            if (e)
                for (t = 0; t < a.length; t += 1) s = a[t], i = this.get(s), n = e.get(s), i !== n && this.set(s, n)
        },
        getCombinedEmphasis: function () {
            var e, i, n, s, a, o = [],
                r = {},
                l = this.get("emphasis"),
                d = this.get("links");
            if (l && l.length > 0 && void 0 !== l[0].offset && (r.emphasize = l), d && d.length > 0 && d[0].offset && (r["link-text"] = d), t.isEmpty(r)) return !1;
            for (e in r)
                if (n = r[e], n && n.length > 0)
                    for (i = 0; i < n.length; i += 1) a = this.get("display_type_id") < 5 ? n[i] : t.omit(n[i], "url"), s = t.extend({
                        treatment: e
                    }, a), o.push(s);
            return o
        },
        setRead: function () {
            this.set("unread", !1), this.broadcast("nyt:messaging-message-state-update", this)
        },
        setPopupRead: function () {
            this.set("popup_unread", !1), this.broadcast("nyt:messaging-message-state-update", this)
        },
        saveToLocalStorage: function () {
            var e, t, i, s, a, o = this.get("display_type_id");
            5 >= o && (e = this.get("id"), t = this.get("version"), i = (new Date).getTime(), s = n.get("messaging"), a = s ? s + "," + e : e, t && (a = a + "-" + t + "-" + i), n.set("messaging", a))
        }
    });
    return s
}), define("shared/messaging/collections/messages", ["jquery/nyt", "underscore/nyt", "backbone/nyt", "foundation/collections/base-collection", "foundation/views/websockets-transport", "shared/messaging/models/message", "foundation/hosts", "foundation/cookies", "foundation/models/page-storage"], function (e, t, i, n, s, a, o, r, l) {
    "use strict";
    var d = n.extend({
        model: a,
        url: o.msg + "/svc/message/v1/list/global.json",
        pageStorageKey: "messaging",
        defaultSettings: {
            webSockets: !0,
            longPoll: !1,
            fauxLongPoll: !1,
            interval: 10,
            cachePullDelay: 5
        },
        initialize: function (e) {
            this.cleanLocalStorage(), this.settings = t.extend({}, this.defaultSettings, e), t.bindAll(this, "fetch", "fetchSuccess", "handleSave", "stopSaving"), this.received = {}, this.serverSaveQueue = [], this.statusFragments = {}, this.beingProcessed = !1, this.followStarts = {}, this.lastReceived = !1, this.cachePullOver = !1, this.pageManager.isDomReady() ? this.prepareToConnect() : this.subscribe(this.pageManager, "nyt:page-ready", this.prepareToConnect), this.subscribe(this, "change:status", this.saveMessageEverywhere), this.subscribe("nyt:messaging-message-state-update", this.saveMessageEverywhere)
        },
        prepareToConnect: function () {
            this.initWebSockets()
        },
        initWebSockets: function () {
            var t = r.readCookie("NYT-S") || "";
            s.registerClient({
                name: "messaging",
                collection: this,
                fabrikApp: "hermes.push",
                cookies: {
                    "nyt-s": t
                },
                handleMessage: this.handleMessage,
                notifyOnError: e.noop,
                handleFailover: this.switchToHTTP
            })
        },
        makeHTTPRequest: function () {
            var e = this;
            this.url = o.msg + "/svc/message/v1/list/global.json", this.fetch({
                success: function (t, i) {
                    e.fetchSuccess(t, i)
                },
                error: function () {}
            })
        },
        switchToHTTP: function (e) {
            e.settings.fauxLongPoll = !0, e.settings.webSockets = !1, e.stopSaving(), e.makeHTTPRequest()
        },
        sync: function (e, t, n) {
            return this.settings.longPoll ? (n.timeout = 2e3, i.sync(e, t, n)) : (n.cache = !1, i.sync(e, t, n))
        },
        parse: function (e) {
            return e && e.results ? e.results.messages : void 0
        },
        handleMessage: function (e, t) {
            var i;
            t.websocketConnected || t.handleSave(), e.body && (i = JSON.parse(e.body), t.fetchSuccess(t, i))
        },
        fetchSuccess: function (e, i) {
            var n, s, a, o, r, l, d = {},
                c = e || this;
            if (i && !t.isArray(i) && (i = [i]), i)
                for (n = 0, s = i.length; s > n; n += 1) l = this.preprocessMessage(i[n]), l && (a = l.get("id"), o = l.get("title"), c.add(l), r = this.categorizeMessage(l), d[r] = d[r] || [], this.received[a] = o, d[r].push(l));
            if (t.isEmpty(d)) return !1;
            for (r in d) c.trigger(r, d[r]);
            this.settings.fauxLongPoll && window.setTimeout(function () {
                c.makeHTTPRequest()
            }, 1e3 * c.settings.interval)
        },
        preprocessMessage: function (e) {
            var t;
            return this.cachePullOver || this.checkCachePullEnd(), this.interceptFollows(e) && this.ensureMessageID(e) && this.interceptFragments(e) && this.ensureUniqueTitles(e) && (t = this.handleUpdateableData(e)) ? this.ensureActive(t) : !1
        },
        interceptFollows: function (e) {
            return e.follows ? (t.isEmpty(this.followStarts) && (this.followStarts = e.follows), this.broadcast("nyt:messaging-follow-data-received", e.follows), !1) : e
        },
        ensureMessageID: function (e) {
            return e.id || e.messageId ? e : !1
        },
        interceptFragments: function (e) {
            return e.title ? e : (this.isExpired(e) || this.updateMessageData(e.messageId, this.extractMessageMetadata(e)), !1)
        },
        ensureUniqueTitles: function (e) {
            return 5 !== e.display_type_id && this.titleExists(e.title) ? !1 : e
        },
        handleUpdateableData: function (e) {
            var t, i, n;
            if (this.statusFragments[e.id] ? (t = this.statusFragments[e.id], delete this.statusFragments[e.id]) : this.get(e.id) && (t = this.extractMessageMetadata(this.get(e.id))), t) {
                if (i = this.extractMessageMetadata(e), n = this.unionOfState(t, i), n.toString() === t.toString() && this.get(e.id)) return !1;
                if (e = new a(e), this.get(e.id)) return this.updateMessageData(e.id, n, e), !1;
                e.applyMetadata(n)
            }
            return e = e.get ? e : new a(e)
        },
        ensureActive: function (e) {
            return this.isExpired(e) || this.isInactive(e) || this.isInLocalStorage(e) || this.isBeforeSubscribed(e) ? !1 : e
        },
        categorizeMessage: function (e) {
            var t, i = e.get("display_type_id");
            switch (i) {
            case 1:
                e.get("label") || e.set("label", "Breaking News"), t = "nyt:messaging-breaking-news-received";
                break;
            case 2:
                e.get("label") || e.set("label", "Account Alert"), t = "nyt:messaging-account-alert-received";
                break;
            case 3:
                e.get("label") || e.set("label", "Live Video"), t = "nyt:messaging-video-received";
                break;
            case 4:
                t = "nyt:messaging-velcro-received";
                break;
            case 5:
                t = "nyt:messaging-notification-received";
                break;
            case 6:
                t = "nyt:messaging-follow-notice-received";
                break;
            default:
                t = "nyt:messaging-message-received"
            }
            return t
        },
        isExpired: function (e) {
            var t, i = e.get ? e.get("end_time") : e.end_time,
                n = (new Date).getTime();
            return i ? (t = new Date(1e3 * i).getTime(), n > t) : void 0
        },
        titleExists: function (i) {
            var n = t.values(this.received);
            return e.inArray(i, n) > -1
        },
        isInactive: function (e) {
            var t = e.get("unread"),
                i = e.get("display_type_id");
            return !t && 5 > i
        },
        isBeforeSubscribed: function (e) {
            var t, i = e.get("tag"),
                n = e.get("display_type_id");
            return 6 !== n ? !1 : (i && (t = this.followStarts[i]), t && t.start ? t.start > e.get("start_time") : !0)
        },
        handleSave: function () {
            var e;
            for (this.websocketConnected = !0; this.serverSaveQueue.length > 0;) e = this.serverSaveQueue.shift(), this.saveMessageToFabrik(e)
        },
        stopSaving: function () {
            this.websocketConnected = !1
        },
        unionOfState: function (e, t) {
            var i, n, s = e[1],
                a = e[0] > t[0] ? e[0] : t[0],
                o = e[2] && t[2];
            return e.length > 3 && (n = e[3] && t[3]), e[0] !== t[0] && 5 === s && (o = !0), i = [a, s, o], void 0 !== n && i.push(n), i
        },
        updateMessageData: function (e, t, i) {
            var n, s, a = this.get(e) ? this.extractMessageMetadata(this.get(e)) : this.statusFragments[e];
            return a ? (s = this.unionOfState(t, a), void(s.toString() !== a.toString() && (this.get(e) ? (n = {
                id: e,
                update: s,
                message: i
            }, this.broadcast("nyt:messaging-existing-message-update", n)) : this.statusFragments[e] = s))) : void(this.statusFragments[e] = t)
        },
        isInLocalStorage: function (i) {
            var n = [],
                s = [],
                a = l.get(this.pageStorageKey),
                o = i.get("id").toString();
            return a ? (n = a.split(","), s = t.map(n, function (e) {
                return e.split("-")[0]
            }), e.inArray(o, s) > -1) : !1
        },
        cleanLocalStorage: function () {
            var e, t, i, n, s, a, o, r = l.get(this.pageStorageKey);
            if (r)
                for (e = r.split(","), i = 0; i < e.length; i++) t = e[i], n = t.split("-")[2], s = (new Date).getTime(), n && (a = (s - n) / 1e3, o = Math.floor(a / 86400), o > 7 && this.deleteInLocalStorage(t))
        },
        deleteInLocalStorage: function (e) {
            var t = l.get(this.pageStorageKey),
                i = new RegExp(e + ",?"),
                n = t.replace(i, "");
            l.set(this.pageStorageKey, n)
        },
        saveMessageEverywhere: function (e) {
            e && (this.websocketConnected ? this.saveMessageToFabrik(e) : this.serverSaveQueue.push(e))
        },
        saveMessageToFabrik: function (e) {
            var t, i = e.get("popup_unread"),
                n = e.get("tag");
            (this.allowedToSend(e) || !this.pageManager.flag("limitFabrikSave")) && (t = {
                status: e.get("status"),
                messageId: e.get("id"),
                version: e.get("version") || 1,
                date: (new Date).getTime(),
                start_time: e.get("start_time"),
                end_time: e.get("end_time"),
                display_type_id: e.get("display_type_id"),
                unread: e.get("unread")
            }, void 0 !== n && (t.tag = n), void 0 !== i && (t.popup_unread = i), this.settings.webSockets && s.publish({
                action: "send",
                client_app: "hermes.push",
                message: t
            }))
        },
        extractMessageMetadata: function (e) {
            var t, i = e.version || e.get("version") || 1,
                n = e.display_type_id || e.get("display_type_id"),
                s = e.get ? e.get("unread") : e.unread,
                a = e.get ? e.get("popup_unread") : e.popup_unread;
            return void 0 === s && (s = !0), t = [i, n, s], void 0 !== a && t.push(a), t
        },
        allowedToSend: function (e) {
            var t = e.get("display_type_id");
            return 4 === t || 5 === t || 6 === t ? !0 : !1
        },
        checkCachePullEnd: function () {
            var e = (new Date).getTime();
            this.lastReceived || (this.lastReceived = e), e - this.lastReceived > 1e3 * this.settings.cachePullDelay ? (this.cachePullOver = !0, this.broadcast("nyt:messaging-cache-pull-over", e)) : this.lastReceived = e
        }
    });
    return d
}), define("shared/messaging/instances/messages", ["shared/messaging/collections/messages"], function (e) {
    "use strict";
    return new e
}), define("shared/messaging/views/messenger-mixin", ["jquery/nyt", "underscore/nyt", "shared/messaging/views/message", "shared/messaging/instances/messages", "shared/messaging/templates"], function (e, t, i, n, s) {
    "use strict";
    var a = {
        template: s.messenger,
        mixinSettings: {
            id: null,
            notifyWhen: null,
            messageType: null,
            parent: null,
            template: "message",
            newestFirst: !0,
            closeButton: !0,
            expiration: !1,
            animationSpeed: 200,
            expirationAfterPause: null,
            fadeOutDelay: 1500,
            dismissAcknowledged: !0,
            trackingVersion: ""
        },
        events: {
            "click .action-link": "trackLinkClicks",
            "click .action-button": "trackLinkClicks"
        },
        initialize: function (e) {
            this.options = t.extend({}, this.mixinSettings, this.defaultSettings, e), this.subscribe(this, "nyt:messaging-message-rendered", this.afterMessageReceived), this.subscribe(this, "nyt:messaging-message-removed", this.afterMessageRemoved), this.subscribe(this, "nyt:messaging-message-" + this.options.id + "-displayed nyt:messaging-message-cleared", this.addLastMessageClass), this.subscribe(this, "nyt:messaging-message-" + this.options.id + "-displayed", this.trackImpressions), this.delegateEvents(), this.collection = n, this.active = {
                messages: {}
            }, this.notActive = {
                messages: {}
            }, this.received = {
                messages: {}
            }, this.newestTime = 0, this.oldestTime = 1 / 0, this.pageManager.isDomReady() ? this.render() : this.subscribe(this.pageManager, "nyt:page-ready", this.render), this.trackingBaseData = {
                module: "Notification",
                version: this.options.trackingVersion,
                region: "FixedTop"
            }, this.local(this, "nyt:messaging-messenger-initialized")
        },
        render: function () {
            return this.$parent = this.options.parent ? this.options.parent() : this.$body, this.rendered || (this.$el.hide().addClass(this.options.id).append(this.template(this.options)), this.$parent.prepend(this.$el), this.rendered = !0, this.local(this, "nyt:messaging-messenger-rendered"), this.prepareView(), this.subscribe(this.collection, this.options.notifyWhen, this.notify)), this
        },
        notify: function (i) {
            var n, s, a = this,
                o = [];
            t.each(i || [], function (e) {
                s = e.get("id"), s && o.push(e)
            }), n = o.length > 0 ? function () {
                a.createMessageViews(o)
            } : e.noop, this.pageManager.isDomReady() ? n() : this.subscribe(this.pageManager, "nyt:page-ready", t.debounce(n, 0))
        },
        createMessageViews: function (e) {
            return e && t.each(e || [], function (e) {
                var t;
                t = new i({
                    model: e,
                    template: this.options.template,
                    closeButton: this.options.closeButton,
                    dismissAcknowledged: this.options.dismissAcknowledged
                }), this.subscribe(t, "nyt:messaging-message-view-expired", this.removeMessage), this.subscribe(t, "nyt:messaging-message-view-dismissed", this.removeMessage), this.subscribe(t, "nyt:messaging-message-view-dismissed", this.trackDismissal), this.addMessage(t)
            }, this), this
        },
        addMessage: function (t) {
            var i, n, s, a, o, r, l, d, c, h, u, m;
            if (t) {
                if (i = t.model.get("id"), n = !0, s = this.options.newestFirst ? "prepend" : "append", u = t.render().$el, m = this.$(".message-bed"), this.received.messages[i] = t, this.active.messages[i] = t, a = this.countMessages(), this.options.newestFirst && (o = t.model.get("timestamp"), o > this.newestTime && (this.newestTime = o), o < this.oldestTime && (this.oldestTime = o), o <= this.oldestTime ? s = "append" : o < this.newestTime && (n = !1)), n) m[s](u);
                else
                    for (r = this.$(".message-bed").find(".message-container"), d = r.length - 1, l = d; - 1 !== l; l -= 1)
                        if (h = e(r[l]), c = h.find(".message").data("timestamp"), c > o) {
                            h.after(u);
                            break
                        }
                t.$el.data("messageId", i), this.local(this, "nyt:messaging-message-rendered", t, a)
            }
        },
        removeMessage: function (e) {
            var t, i;
            e && (t = e.model.get("id"), this.notActive.messages[t] = e, this.active.messages[t] && delete this.active.messages[t], i = this.countMessages(), this.local(this, "nyt:messaging-message-removed", e, i))
        },
        addLastMessageClass: function () {
            this.$(".message-container").removeClass("last-message-container").last().addClass("last-message-container")
        },
        dimensions: function () {
            return {
                width: this.$el.find(".message-bed").outerWidth(!0),
                height: this.$el.find(".message-bed").outerHeight(!0)
            }
        },
        countMessages: function () {
            return t.size(this.active.messages)
        },
        trackImpressions: function (e) {
            var t, i;
            e = e || "", t = this.received.messages[e], i = this.getcontentCollection(t) || "", this.trackingTriggerImpression("messaging-impression", {
                action: "Impression",
                contentCollection: i,
                eventName: "Impression",
                contentID: e
            })
        },
        trackDismissal: function (e) {
            var t = e.model.get("id"),
                i = this.getcontentCollection(e);
            this.trackingTrigger("messaging-dismissal", {
                action: "Click",
                contentCollection: i,
                eventName: "DismissNotification",
                contentID: t
            })
        },
        trackLinkClicks: function (t) {
            var i = e(t.currentTarget),
                n = i.parents(".message-container").data("messageId"),
                s = this.received.messages[n],
                a = this.getcontentCollection(s),
                o = this.trackingAppendParams(i.attr("href"), {
                    action: "Click",
                    contentCollection: a,
                    contentID: n
                });
            i.attr("href", o)
        },
        getcontentCollection: function (e) {
            return e.model.get("sub_type") ? e.model.get("sub_type") : ""
        }
    };
    return a
}), define("shared/messaging/views/move-furniture-mixin", ["jquery/nyt"], function (e) {
    "use strict";
    var t = {
        moveFurniture: function (t, i, n) {
            var s, a, o, r = this,
                l = this.options.animationSpeed || 200;
            "add" === i ? s = "+=" + t : "subtract" === i && (s = "-=" + t), a = function (e) {
                e.animate({
                    marginTop: s
                }, l)
            }, o = function (t) {
                t.promise().done(function () {
                    e(this).css({
                        marginTop: s
                    })
                })
            }, n ? (this.$el.promise().done(function () {
                e(this).css("height", s), r.broadcast("nyt:messaging-" + r.options.messageType + "-after")
            }), this.messagesHeight = this.dimensions().height, this.broadcast("nyt:messaging-" + this.options.messageType + "-move-furniture", o, s, this)) : (this.$el.animate({
                height: s
            }, l, function () {
                r.messagesHeight = r.dimensions().height, r.broadcast("nyt:messaging-" + r.options.messageType + "-after")
            }), this.broadcast("nyt:messaging-" + this.options.messageType + "-move-furniture", a, s, this))
        }
    };
    return t
}), define("shared/messaging/views/critical-alerts", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "shared/messaging/views/messenger-mixin", "shared/messaging/views/move-furniture-mixin"], function (e, t, i, n, s) {
    "use strict";
    var a = i.registerView("messaging").extend(t.extend({}, s, n, {
        defaultSettings: {
            messageType: "critical-alerts",
            parent: function () {
                return 0 === e("#critical-alerts").length && e("body").prepend('<div id="critical-alerts"></div>'), e("#critical-alerts")
            }
        },
        prepareView: function () {
            this.messagesHeight = 0, this.$el.addClass("alerts"), this.$el.parent("#critical-alerts").addClass("critical-alerts messenger"), this.$el.css("height", "0")
        },
        afterMessageReceived: function (e, t) {
            var i, n = 0;
            e && t > 0 && (this.broadcast("nyt:messaging-message-" + this.options.id + "-received", e, this), 1 === t && (n += this.openMessenger()), e.reveal(!0), e.displayed(), n += e.dimensions().height, this.moveFurniture(n, "add"), i = e.model.get("id"), this.local(this, "nyt:messaging-message-" + this.options.id + "-displayed", i), this.createMessageClone(e), this.alignMessages(), this.options.expiration && this.startTimer(e))
        },
        startTimer: function (e) {
            var t;
            window.setTimeout(function () {
                t = e.model.get("status"), t && "dismissed" !== t && "expired" !== t && e.trigger("nyt:messaging-message-expired")
            }, 60 * this.options.expiration * 1e3)
        },
        openMessenger: function () {
            var e;
            return this.$el.show(), this.$el.find(".message-bed").show(), e = this.dimensions().height, this.subscribe(this.pageManager, "nyt:page-resize", this.handleWindowResize), this.broadcast("nyt:messaging-messenger-" + this.options.id + "-opened", this), e
        },
        afterMessageRemoved: function (e, t) {
            var i = 0;
            e && null !== t && (i += e.dimensions().height, e.$el.hide(), this.local(this, "nyt:messaging-message-cleared"), 0 === t && (i += this.closeMessenger()), this.broadcast("nyt:messaging-message-" + this.options.id + "-closed", e, this), this.moveFurniture(i, "subtract", !0))
        },
        closeMessenger: function () {
            var t = this.dimensions().height,
                i = this;
            return this.$el.hide(), this.$el.find(".message-bed").hide(), this.stopListening(this.pageManager, "nyt:page-resize"), this.broadcast("nyt:messaging-messenger-" + this.options.id + "-closed", this), this.$el.promise().done(function () {
                e(this).siblings(".alerts").is(":hidden") && i.broadcast("nyt:messaging-message-" + i.options.messageType + "-closed", i)
            }), t
        },
        createMessageClone: function (e) {
            e.$el.find(".message").clone().addClass("hidden-message").wrapInner('<div class="message-wrap" />').appendTo(e.$el)
        },
        handleWindowResize: function () {
            var e, t, i, n = this;
            this.$el.promise().done(function () {
                t = n.dimensions().height, i = n.messagesHeight, t > i ? (e = t - i, n.moveFurniture(e, "add", !0), n.messagesHeight = t) : i > t && (e = i - t, n.moveFurniture(e, "subtract", !0), n.messagesHeight = t), n.alignMessages()
            })
        },
        maxMessageWidth: function () {
            var e = this.$(".message-container").width();
            this.$(".message:not(.hidden-message)").css({
                "max-width": e + "px"
            })
        },
        alignMessages: function () {
            var e = 0,
                i = this.active.messages;
            t.size(i) > 0 && (t.each(i, function (t) {
                var i = t.$el.find(".hidden-message .message-wrap").outerWidth();
                i > e && (e = i)
            }), this.$el.find(".message:not(.hidden-message)").css({
                width: e + 2 + "px"
            }), this.maxMessageWidth())
        }
    }));
    return a
}), define("shared/messaging/views/suggestions", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "shared/messaging/views/messenger-mixin", "shared/messaging/views/move-furniture-mixin"], function (e, t, i, n, s) {
    "use strict";
    var a = i.registerView("messaging").extend(t.extend({}, s, n, {
        nytEvents: {
            "nyt:masthead-storytheme": "toggleTheme",
            "nyt:masthead-contenttheme": "toggleTheme",
            "nyt:messaging-message-breaking-news-alerts-received": "hideMessenger",
            "nyt:messaging-message-account-alerts-received": "hideMessenger"
        },
        defaultSettings: {
            messageType: "suggestions",
            closeButton: !1,
            trackingVersion: "Velcro"
        },
        prepareView: function () {
            this.messagePresent = !1, this.stayHidden = !1, this.$el.addClass("messenger"), this.$el.css("height", "0")
        },
        afterMessageReceived: function (t) {
            var i, n, s = e("#account-alerts"),
                a = e("#breaking-news-alerts"),
                o = e("#masthead");
            t && this.$el.is(":hidden") && s.is(":hidden") && a.is(":hidden") && (this.stayHidden || this.messagePresent || (t.reveal(!0), t.displayed(), t.showOnce(), this.messagePresent = !0, o.hasClass("theme-in-story") || (this.openMessenger(), i = this.dimensions().height, this.moveFurniture(i, "add"), n = t.model.get("id"), this.local(this, "nyt:messaging-message-" + this.options.id + "-displayed", n))))
        },
        openMessenger: function () {
            this.$el.show(), this.broadcast("nyt:messaging-messenger-" + this.options.id + "-opened", this)
        },
        afterMessageRemoved: function (e) {
            var t = this.dimensions().height;
            e && (e.$el.hide(), this.moveFurniture(t, "subtract", !0), this.broadcast("nyt:messaging-message-" + this.options.id + "-closed", e, this), this.closeMessenger())
        },
        closeMessenger: function () {
            this.$el.hide(), this.broadcast("nyt:messaging-messenger-" + this.options.id + "-closed", this)
        },
        hideMessenger: function () {
            var e = this.dimensions().height;
            this.$el.is(":visible") && (this.$el.hide(), this.moveFurniture(e, "subtract", !0)), this.broadcast("nyt:messaging-message-" + this.options.id + "-hidden", this), this.stayHidden = !0
        },
        showMessenger: function () {
            var e = this.dimensions().height;
            this.moveFurniture(e, "add"), this.broadcast("nyt:messaging-message-" + this.options.id + "-shown", this), this.$el.show()
        },
        toggleTheme: function (t) {
            var i, n = e("#account-alerts"),
                s = e("#breaking-news-alerts"),
                a = t ? "hide" : "show";
            "hide" === a && this.$el.is(":visible") ? (i = this.dimensions().height, this.moveFurniture(i, "subtract", !0), this.$el.addClass("theme-changed"), this.$el.hide()) : "show" === a && this.$el.is(":hidden") && n.is(":hidden") && !this.stayHidden && this.messagePresent && n.is(":hidden") && s.is(":hidden") && (this.$el.show(), i = this.dimensions().height, this.moveFurniture(i, "add", !0), this.$el.removeClass("theme-changed")), this.broadcast("nyt:messaging-message" + this.options.id + a, i, this)
        }
    }));
    return a
}), define("shared/messaging/views/announcements", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "shared/messaging/views/messenger-mixin"], function (e, t, i, n) {
    "use strict";
    var s = i.registerView("messaging").extend(t.extend({}, n, {
        nytEvents: {
            "nyt:page-resize": "adjustWidth"
        },
        defaultSettings: {
            messageType: "announcements",
            parent: function () {
                return e("#masthead").find(".container")
            },
            animationSpeed: 400,
            expiration: 30,
            expirationAfterPause: 3,
            trackingVersion: "LiveVideo"
        },
        prepareView: function () {
            var e = this,
                t = 1e3 * this.options.expirationAfterPause;
            this.messagePresent = !1, this.timer = null, this.currentMessageId = null, this.widthDiff = 45, this.$el.addClass("messenger"), this.adjustWidth(), this.$el.on("mouseenter", function () {
                e.clearTimer()
            }), this.$el.on("mouseleave", function () {
                e.startTimer(t)
            })
        },
        afterMessageReceived: function (e) {
            var t = e.model.get("id"),
                i = this,
                n = 1e3 * this.options.expiration;
            e && (this.messagePresent ? window.setTimeout(function () {
                i.afterMessageReceived(e)
            }, n) : (e.reveal(!0), e.displayed(), this.local(this, "nyt:messaging-message-" + this.options.id + "-displayed", t), this.messagePresent = !0, this.openMessenger(), this.currentMessageId = t, this.startTimer(n)))
        },
        startTimer: function (e) {
            var t = this.currentMessageId,
                i = this.active.messages[t],
                n = function () {
                    i && i.trigger("nyt:messaging-message-expired")
                };
            e = e || 5e3, this.timer = window.setTimeout(n, e)
        },
        clearTimer: function () {
            window.clearTimeout(this.timer)
        },
        openMessenger: function () {
            var e = this.options.animationSpeed || 500;
            this.$el.stop(!0).show().animate({
                top: 0
            }, e), this.broadcast("nyt:messaging-messenger-" + this.options.id + "-opened", this)
        },
        afterMessageRemoved: function (e) {
            e && this.closeMessenger(e)
        },
        closeMessenger: function (t) {
            var i = this.dimensions().height,
                n = this.options.animationSpeed || 500,
                s = this;
            t && this.$el.stop(!0).animate({
                top: "-" + i
            }, n, function () {
                e(this).hide(), t.$el.hide(), s.messagePresent = !1, s.broadcast("nyt:messaging-messenger-" + s.options.id + "-closed", s)
            })
        },
        adjustWidth: function () {
            var t, i = e("#masthead"),
                n = i.width(),
                s = this.widthDiff,
                a = this.pageManager.getCurrentBreakpoint(),
                o = 0;
            a > 1020 ? (10060 >= a && (o = parseInt(i.css("margin-left"), 10)), t = n - (2 * s + o), this.$el.css("width", t + "px"), this.$el.css("left", s + "px")) : (this.$el.css("left", "0px"), this.$el.css("width", "100%"))
        }
    }));
    return s
}), define("shared/messaging/models/follow", ["foundation/models/base-model"], function (e) {
    "use strict";
    var t = e.extend({
        defaults: {
            tag: "",
            type: "",
            following: "",
            thumb: "",
            description: "",
            isFollowing: !1
        },
        follow: function () {
            this.set("isFollowing", !0), this.broadcast("nyt:messaging-following-" + this.id)
        },
        unfollow: function () {
            this.set("isFollowing", !1), this.broadcast("nyt:messaging-unfollowing-" + this.id)
        },
        isFollowing: function () {
            return this.get("isFollowing")
        }
    });
    return t
}), define("shared/messaging/views/follow-onboarding", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "shared/modal/views/modal"], function (e, t, i, n) {
    "use strict";
    var s = i.registerView("messaging").extend({
        defaults: {
            featureName: "",
            extractTemplateData: function (e) {
                return e
            },
            animationDuration: 1e3,
            modalDefaults: {
                className: "",
                superclass: "",
                template: function () {},
                modalOptions: {
                    tailDirection: "up-right",
                    disableBindings: !0,
                    toggleSpeed: 200
                },
                onShow: function () {},
                onHide: function () {}
            },
            allows: {}
        },
        initialize: function (e) {
            var i, n, s, a = this;
            if (!e.types) return !1;
            this.modals = {}, this.settings = t.extend({}, this.defaults, e), this.modalSettings = {}, this.settings.modalOptions = t.extend({}, this.defaults.modalOptions, e.modalOptions), this.extractTemplateData = this.settings.extractTemplateData, this.allows = t.extend({}, this.defaults.allows, e.allows);
            for (i in e.types) this.modals[i] = {}, this.modalSettings[i] = t.extend({}, this.settings.modalDefaults, e.types[i]), this.modalSettings[i].modalOptions = t.extend({}, this.settings.modalDefaults.modalOptions, e.types[i].modalOptions), n = this.modalSettings[i].modalOptions.addlClasses, s = this.modalSettings[i].className + " " + this.modalSettings[i].superclass, n = n ? n + " " + s : s, n.replace(/\s/g, "").length > 0 && (this.modalSettings[i].modalOptions.addlClasses = n);
            return this.subscribe("nyt:" + this.settings.featureName + "-onboarding-show", function (e) {
                a.handleModalOpen(e.type, e)
            }), this.subscribe("nyt:" + this.settings.featureName + "-onboarding-hide", function (e) {
                a.handleModalClose(e.type, e)
            }), this
        },
        createNewModal: function (e, i) {
            var s = this,
                a = i ? i.binding : void 0,
                o = i && i.modalOptions ? i.modalOptions : {},
                r = this.modalSettings[e];
            return new n(t.extend({}, this.settings.modalOptions, r.modalOptions, o, {
                id: this.settings.featureName + "-toolitip-" + e,
                modalContent: r.template(s.extractTemplateData(i)),
                binding: a,
                openCallback: function () {
                    r.onShow(s)
                },
                closeCallback: function () {
                    r.onHide(s)
                }
            }))
        },
        showModal: function (e) {
            e && (this.modals[e].addToPage().open(), this.broadcast("nyt:" + this.settings.featureName + "-onboarding-shown", e))
        },
        hideModal: function (e) {
            e && (this.modals[e].close().removeFromPage(), this.broadcast("nyt:" + this.settings.featureName + "-onboarding-hidden", this), this.modals[e] = !1)
        },
        handleModalOpen: function (e, t) {
            e && this.allows[e] && (this.modals[e] = this.createNewModal(e, t), this.showModal(e), this.allows[e] = !1)
        },
        handleModalClose: function (e) {
            e && !t.isEmpty(this.modals[e]) && this.hideModal(e)
        }
    });
    return s
}), define("shared/messaging/collections/follows", ["jquery/nyt", "underscore/nyt", "foundation/collections/base-collection", "shared/messaging/models/follow", "shared/messaging/views/follow-onboarding", "shared/messaging/templates", "foundation/hosts"], function (e, t, i, n, s, a, o) {
    "use strict";
    var r = i.extend({
        model: n,
        defaultSettings: {},
        initialize: function (e) {
            this.settings = t.extend({}, this.defaultSettings, e), this.followSorts = !1, this.followQueue = [], this.followsInitialized = !1, this.knowsSubscriptionData = !1, this.followLater = {}, this.followedAlready = !1, this.stateKeys = {
                onboardWelcome: "follow.onboard-welcome",
                onboardSuggest: "follow.onboard-suggest",
                onboardConfirm: "follow.onboard-confirm",
                betaWhitelist: "follow.whitelist"
            }, this.pageManager.isDomReady() ? this.getFollowables() : this.subscribe(this.pageManager, "nyt:page-ready", this.getFollowables), this.subscribe("nyt:messaging-follow-data-received", this.handleFollowingDataReceived), this.subscribe("nyt:messaging-unfollow-tag", this.unsubscribeFromFollowable), this.subscribe("nyt:messaging-follow-tag", this.subscribeToFollowable), this.subscribe("nyt:notifications-onboarding-complete", this.handleOnboardingComplete)
        },
        changeSubscription: function (t, i, n) {
            var s = o.followApi + "/" + i + ".json";
            e.ajax({
                url: s,
                type: t
            }).done(n)
        },
        unsubscribeFromFollowable: function (e) {
            var t = this.get(e);
            t && t.unfollow(), this.changeSubscription("DELETE", e, function () {})
        },
        subscribeToFollowable: function (e) {
            var t = this.get(e);
            t && (t.follow(), this.followedAlready || (this.broadcast("nyt:notifications-onboarding-show", {
                type: "confirm",
                model: t
            }), this.followedAlready = !0)), this.changeSubscription("POST", e, function () {})
        },
        getFollowables: function () {
            var i = this;
            e.ajax({
                url: o.followableList + "/available_follows.jsonp",
                dataType: "jsonp",
                jsonpCallback: "followablesCallback"
            }).done(function (e) {
                var n, s;
                if (!e) return !1;
                if (e.followables)
                    for (n in e.followables) s = e.followables[n], s.id = n, i.add(s);
                i.followSorts = t.omit(e, "followables"), i.followsInitialized = !0, i.local(i, "nyt:messaging-followables-received")
            })
        },
        handleFollowingDataReceived: function (e) {
            var t = this;
            !this.knowsSubscriptionData && e["follow.whitelist"] && (this.knowsSubscriptionData = !0, this.pageManager.setMeta("nyt:messaging-user-has-ability-to-follow", "true"), this.broadcast("nyt:messaging-user-has-ability-to-follow"), this.followsInitialized ? this.followFollowables(e) : (this.followQueue = e, this.subscribe(this, "nyt:messaging-followables-received", this.followFollowables)), this.pageManager.getMeta("nyt:messaging-notifications-panel-active") ? this.handleOnboardingReady(e) : this.subscribe("nyt:messaing-notifications-panel-active", function () {
                t.handleOnboardingReady(e)
            }))
        },
        handleOnboardingReady: function (e) {
            e && !e[this.stateKeys.onboardConfirm] && "homepage" !== this.pageManager.getApplicationName() && (new s({
                featureName: "notifications",
                extractTemplateData: function (e) {
                    return e && e.model && e.model.get ? {
                        collectionName: e.model.get("following")
                    } : {}
                },
                types: {
                    welcome: {
                        template: a.onboardingIntroducingNotifications,
                        className: "notifications-tooltip",
                        superclass: "tooltip",
                        modalOptions: {
                            tailTopOffset: -8,
                            tailLeftOffset: -1,
                            fixedOverride: !0
                        },
                        onShow: function (e) {
                            var t = function () {
                                e.broadcast("nyt:notifications-onboarding-hide", {
                                    type: "welcome"
                                })
                            };
                            e.modals.welcome.$el.on("click", ".dismiss-button", function () {
                                e.broadcast("nyt:notifications-onboarding-complete", "welcome")
                            }), "homepage" === e.pageManager.getApplicationName() ? e.subscribeOnce("nyt:masthead-hidden", t) : e.subscribeOnce("nyt:masthead-storytheme", t)
                        }
                    },
                    suggest: {
                        template: a.onboardingSuggestFollow,
                        className: "notifications-tooltip",
                        superclass: "tooltip",
                        modalOptions: {
                            tailDirection: "down-right"
                        },
                        onShow: function (e) {
                            e.broadcast("nyt:notifications-onboarding-complete", "suggest"), e.modals.suggest.settings.fixedOverride && e.subscribeOnce("nyt:masthead-storytheme", function () {
                                e.broadcast("nyt:notifications-onboarding-hide", {
                                    type: "suggest"
                                })
                            })
                        }
                    },
                    confirm: {
                        template: a.onboardingFirstFollow,
                        className: "notifications-confirmation",
                        modalOptions: {
                            modalTitle: '<i class="icon"></i>Success!',
                            hasOverlay: !0,
                            hasCloseButton: !0,
                            tailDirection: "centered"
                        },
                        onShow: function (e) {
                            e.broadcast("nyt:notifications-onboarding-complete", "confirm")
                        }
                    }
                },
                modalOptions: {
                    modalFooter: '<button class="button dismiss-button">Ok, got it</button>'
                },
                allows: {
                    welcome: !e[this.stateKeys.onboardWelcome],
                    suggest: !e[this.stateKeys.onboardSuggest],
                    confirm: !e[this.stateKeys.onboardConfirm]
                }
            }), e[this.stateKeys.onboardWelcome] || this.broadcast("nyt:notifications-onboarding-show", {
                type: "welcome",
                binding: ".notifications-button"
            }), this.broadcast("nyt:messaging-user-onboarding-start"))
        },
        followFollowables: function (e) {
            var i, n, s = e || this.followQueue;
            for (s = t.isArray(s) ? s : t.keys(s); s.length > 0;) i = s.shift(), n = this.get(i), n ? n.follow() : this.followLater[i] = !0;
            this.handleFollowDataReady()
        },
        handleFollowDataReady: function () {
            var e = this.generateFollowSuggestions(),
                t = this.createOrderedFullList();
            this.broadcast("nyt:messaging-follow-suggestions-received", e), this.broadcast("nyt:messaging-followable-list-received", t)
        },
        generateFollowSuggestions: function (e) {
            var i, n, s = [],
                a = [],
                o = this.followSorts.weighted || this.followSorts.alpha || t.pluck(this.models, "id"),
                r = t.clone(o);
            for (e = e || 3; s.length < e;)
                if (r.length > 0) {
                    if (i = r.shift(), n = this.get(i), !n) continue;
                    n.isFollowing() ? a.push(n) : s.push(n)
                } else {
                    if (0 === a.length) break;
                    s.push(a.shift())
                }
            return s
        },
        createOrderedFullList: function (e) {
            var i, n, s, a, o = [];
            for (a = t.pluck(this.models, "id"), e = e || this.followSorts.alpha || a, i = 0; i < e.length; i += 1) s = this.followSorts.alpha[i], n = this.get(s), n && o.push(n);
            return o
        },
        getModelFromMeta: function (e) {
            var t, i, n = this.pageManager.getMeta("applicationName");
            return "article" !== n && "collection" !== n ? void 0 : (t = this.pageManager.getMeta("CT") + "." + this.pageManager.getMeta("CN"), t !== e ? void 0 : (i = this.add({
                following: this.pageManager.getMeta("nyt-collection:display-name"),
                id: t,
                tag: t,
                thumb: "collection" === n ? this.pageManager.getMeta("og:image") : void 0,
                description: this.pageManager.getMeta("nyt-collection:tagline")
            }), this.followLater[t] && i.follow(), i))
        },
        handleOnboardingComplete: function (e) {
            var t = {
                welcome: this.stateKeys.onboardWelcome,
                suggest: this.stateKeys.onboardSuggest,
                confirm: this.stateKeys.onboardConfirm
            };
            t[e] && this.subscribeToFollowable(t[e])
        }
    });
    return r
}), define("shared/messaging/instances/follows", ["foundation/views/page-manager", "shared/messaging/collections/follows"], function (e, t) {
    "use strict";
    return e.flag("followFeature") ? new t : {}
}), define("shared/messaging/views/notification-modal", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "shared/messaging/views/messenger-mixin", "shared/messaging/templates", "shared/messaging/views/messenger-format-mixin", "shared/modal/views/modal"], function (e, t, i, n, s, a, o) {
    "use strict";
    var r = i.extend({
        defaultSettings: {
            expiration: 7,
            stackSize: 3,
            modalHeight: 91,
            modalMargin: 6,
            truncateTextHeight: 34
        },
        template: s.notificationModals,
        el: "#notification-modals",
        nytEvents: {
            "nyt:messaging-notification-archive-opened": "closeModals"
        },
        initialize: function (e) {
            this.options = t.extend({}, this.defaultSettings, e), this.queue = {}, this.active = {}, this.timer = {}, this.maxHeight = this.options.stackSize * this.options.modalHeight + this.options.modalMargin, this.$el.css({
                "max-height": this.maxHeight + "px"
            })
        },
        instantiateModal: function (i, n) {
            var s = this,
                r = new o({
                    id: "notification-modal-" + n,
                    hasCloseButton: !0,
                    modalContent: s.template(t.extend(i.toJSON(), {
                        link: i.getPrimaryLink(),
                        emphasize: a.emphasizeTitle,
                        emphasis: i.getCombinedEmphasis()
                    })),
                    tailDirection: "up",
                    autoPosition: !1,
                    closeOnClick: !1,
                    toggleSpeed: 400,
                    openCallback: function () {
                        this.$el.css("left", 5)
                    },
                    closeCallback: function () {
                        s.closeModal(n)
                    }
                });
            return r.addToPage("#notification-modals"), r.$el.data("messageId", n), r.$el.on("click", function (e) {
                var t;
                e.preventDefault(), t = r.$el.find("a").attr("href"), s.local(s, "nyt:messaging-notification-modal-clicked", n), s.closeModal(n), s.trackNotificationClick(e), s.broadcast("nyt:messaging-notifications-navigate", t)
            }), r.$el.find(".modal-close").on("click", function (e) {
                e.stopPropagation(), s.local(s, "nyt:messaging-notification-modal-closed", n), s.closeModal(n), s.trackNotificationClose(e)
            }), r.$el.on("mouseenter", function () {
                e(this).parent().children(".active").each(function () {
                    var t = e(this).data("timerId");
                    s.clearTimer(t)
                })
            }), r.$el.on("mouseleave", function () {
                e(this).parent().children(".active").each(function () {
                    var t = s.startTimer(n, 2e3);
                    e(this).data("timerId", t)
                })
            }), r
        },
        render: function (e) {
            var t, i, n, s, a, o, r = this.options.truncateTextHeight;
            e && (t = e.model.get("id"), i = this.instantiateModal(e.model, t), t && i && (n = i.$el.find(".message"), s = n.find(".timestamp"), a = s.attr("datetime"), i.open(), i.truncateText(n.find("a"), r), o = this.prettyDate(a), o && s.text(o), this.showOrWait(t, i)))
        },
        showOrWait: function (e, t) {
            var i, n = t.$el.position().top,
                s = 1e3 * this.options.expiration;
            n >= this.maxHeight ? this.queue[e] = t : (this.queue[e] && delete this.queue[e], this.active[e] = t, t.$el.addClass("active"), i = this.startTimer(e, s), t.$el.data("timerId", i))
        },
        startTimer: function (e, t) {
            var i, n, s = this,
                a = function () {
                    n = s.active[e], n && n.close()
                };
            return i = window.setTimeout(a, t)
        },
        clearTimer: function (e) {
            e && window.clearTimeout(e)
        },
        closeModal: function (e) {
            var t, i = this.active[e];
            i && (t = i.$el.data("timerId"), t && this.clearTimer(t), i.removeFromPage(), this.active[e] && delete this.active[e], this.queue[e] && delete this.queue[e]), this.showNext()
        },
        closeModals: function () {
            var e, t;
            for (e in this.queue) t = this.queue[e], t.removeFromPage(), delete this.queue[e];
            for (e in this.active) t = this.active[e], t.removeFromPage(), delete this.active[e]
        },
        showNext: function () {
            var e;
            for (e in this.queue) this.showOrWait(e, this.queue[e])
        },
        trackNotificationClick: function (t) {
            var i = e(t.currentTarget).find("a"),
                n = {
                    module: "notification",
                    version: "NotificationPanel",
                    state: "notification",
                    action: "click",
                    region: "TopBar",
                    eventName: "goto-article",
                    contentId: i.attr("href")
                };
            this.trackingTrigger("notification-events", n, "interaction")
        },
        trackNotificationClose: function (t) {
            var i = e(t.currentTarget).closest(".modal").find("a"),
                n = {
                    module: "notification",
                    version: "NotificationPanel",
                    state: "notification",
                    action: "close",
                    region: "TopBar",
                    contentId: i.attr("href")
                };
            this.trackingTrigger("notification-events", n, "interaction")
        }
    });
    return r
}), define("shared/messaging/views/follow-button", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "shared/messaging/templates", "shared/messaging/instances/follows"], function (e, t, i, n, s) {
    "use strict";
    var a = i.registerView("messaging").extend({
        className: "follow-button-container",
        defaults: {
            template: n.followButton,
            followingText: "Following",
            followText: "Follow",
            unfollowText: "Unfollow"
        },
        initialize: function (e) {
            this.settings = t.extend({}, this.defaults, e), this.template = this.settings.template, e.$el && (this.model = s.get(e.$el.data("collection-id")), this.model || (this.model = s.getModelFromMeta(e.$el.data("collection-id"))), this.model && e.$el.replaceWith(this.render().$el)), this.model && (this.subscribe("nyt:messaging-following-" + this.model.id, this.updateFollowView), this.subscribe("nyt:messaging-unfollowing-" + this.model.id, this.updateFollowView))
        },
        render: function () {
            var i = this,
                n = t.extend(i.model.toJSON(), i.getRenderVars()),
                s = i.template(n);
            return i.$el.html(s), i.$el.on("click", ".follow-button", function () {
                var t = i.model.get("tag");
                return i.model.isFollowing() ? i.broadcast("nyt:messaging-unfollow-tag", t) : i.broadcast("nyt:messaging-follow-tag", t), i.trackFollowButtonClick(e(this)), !1
            }), i.$el.on("focusin mouseenter", ".follow-button", function () {
                var t = e(this),
                    n = t.parent().parent(),
                    s = {
                        tailDirection: "down-right",
                        fixedOverride: !1
                    };
                t.hasClass("is-following") ? t.addClass("active").find(".button-text").html(i.settings.unfollowText) : n.hasClass("follow-option") || (n.hasClass("collection-heading") ? s.tailTopOffset = 3 : n.hasClass("collection-meta") ? s.tailTopOffset = -2 : n.hasClass("collection-header") ? (s.tailDirection = "up-left", s.tailTopOffset = -2, s.tailLeftOffset = -44) : n.hasClass("user-tools-button-group") ? (s.tailDirection = "up-right", s.tailTopOffset = -2, s.fixedOverride = !0) : n.hasClass("extended-byline") && (s.tailDirection = "up-left"), i.broadcast("nyt:notifications-onboarding-show", {
                    type: "suggest",
                    binding: i.$el,
                    model: i.model,
                    modalOptions: s
                }))
            }), i.$el.on("mouseleave focusout", ".follow-button.is-following", function () {
                e(this).removeClass("active").find(".button-text").html(i.settings.followingText)
            }), this
        },
        getRenderVars: function () {
            var e = {};
            return this.model.isFollowing() ? (e.buttonText = this.settings.followingText, e.classes = "is-following") : (e.buttonText = this.settings.followText, e.classes = ""), e
        },
        updateFollowView: function () {
            var e = this.getRenderVars(),
                t = this.$el.find(".follow-button"),
                i = t.find(".button-text");
            t.removeClass("is-following active").addClass(e.classes), i.html(e.buttonText)
        },
        trackFollowButtonClick: function (i) {
            var n = this.model.get("id").split("."),
                s = {
                    module: "follow",
                    state: this.model.isFollowing() ? "following" : "not-following",
                    action: "click",
                    contentId: n[1] || "",
                    version: n[0] || "",
                    eventName: this.model.isFollowing() ? "unfollow" : "follow",
                    mData: {
                        textLabel: !0
                    }
                },
                a = ["marginalia", "next-in", "notifications-modal"],
                o = t.find(a, function (e) {
                    return i.parents("." + e).length > 0
                });
            o && (s.region = o), "notifications-modal" === o && (s.contentPlacement = e(".notifications-modal .follow-options .follow-button").index(i) + 1), this.trackingTrigger("follow-events", s, "interaction")
        }
    });
    return a
}), define("shared/messaging/views/follow", ["underscore/nyt", "foundation/views/base-view", "shared/messaging/views/follow-button", "shared/messaging/templates"], function (e, t, i, n) {
    "use strict";
    var s = t.registerView("messaging").extend({
        className: "follow-option",
        defaults: {
            template: n.followInfo
        },
        initialize: function (t) {
            this.settings = e.extend({}, this.defaults, t), this.template = this.settings.template, this.followButton = new i({
                model: this.model
            }), this.subscribe("nyt:messaging-following-" + this.model.id, this.updateFollowView), this.subscribe("nyt:messaging-unfollowing-" + this.model.id, this.updateFollowView)
        },
        render: function () {
            var t = e.extend(this.model.toJSON(), {
                    followClass: this.getFollowClass()
                }),
                i = this.template(t);
            return this.$el.html(i).append(this.followButton.render().$el), this
        },
        getFollowClass: function () {
            return this.model.isFollowing() ? "following" : ""
        },
        updateFollowView: function () {
            var e = this.getFollowClass(),
                t = this.$el.find(".follow-info");
            t.removeClass("following").addClass(e)
        }
    });
    return s
}), define("shared/messaging/views/notifications", ["jquery/nyt", "underscore/nyt", "foundation/views/base-view", "shared/messaging/instances/follows", "shared/messaging/views/messenger-mixin", "shared/messaging/views/notification-modal", "shared/messaging/views/follow", "shared/messaging/templates", "shared/modal/views/modal"], function (e, t, i, n, s, a, o, r, l) {
    "use strict";
    var d = i.registerView("messaging").extend(t.extend({}, s, {
        defaultSettings: {
            messageType: "notifications",
            parent: function () {
                var t = new l({
                    id: "notifications-modal",
                    binding: ".notifications-button",
                    modalTitle: "Notifications",
                    headerContent: "<button class='button customize-button hidden' id='toggle-customize-button'>Customize</button>",
                    modalFooter: '<p class="disclaimer">This is a beta version of notifications. <a class="user-action" href="mailto:messaging.feedback@nytimes.com?Subject=Notifications feedback">Send feedback &raquo;</a></p>',
                    tailDirection: "up-right",
                    tailTopOffset: -8,
                    tailLeftOffset: -1,
                    width: "360px",
                    toggleSpeed: 1,
                    fixedOverride: this.isFixed,
                    openCallback: function () {
                        this.$target.addClass("active"), this.subscribedAlready || (this.subscribe("nyt:comments-panel-opened", this.close), "homepage" === this.pageManager.getApplicationName() ? this.subscribe("nyt:masthead-hidden", this.close) : this.subscribe("nyt:masthead-storytheme", this.close), this.subscribedAlready = !0), this.broadcast("nyt:messaging-notification-archive-opened", this)
                    },
                    closeCallback: function () {
                        this.$target.removeClass("active"), this.broadcast("nyt:messaging-notification-archive-closed")
                    }
                });
                return t.addToPage(), e("#notifications-modal").find(".modal-content")
            },
            template: "notificationsModal",
            fadeOutDelay: 3e3,
            trackingVersion: "ReaderActivity",
            timestampUpdateFreq: 3e4,
            truncateTextHeight: 34,
            isFixed: !0,
            scrollCheckHeight: 15
        },
        nytEvents: {
            "nyt:messaging-notification-archive-opened": "handleArchivePanelOpened",
            "nyt:messaging-notification-archive-closed": "handleArchivePanelClosed",
            "nyt:messaging-count-received": "updateCounter",
            "nyt:messaging-existing-message-update": "updateMessageView",
            "nyt:messaging-critical-alerts-move-furniture": "movePanelForOtherAlerts",
            "nyt:messaging-suggestions-move-furniture": "movePanelForAlerts",
            "nyt:messaging-follow-suggestions-received": "addSuggestedFollows",
            "nyt:messaging-followable-list-received": "createFollowableList",
            "nyt:messaging-cache-pull-over": "setCachePullOver",
            "nyt:messaging-notifications-navigate": "handleNavigationRequired"
        },
        events: {
            "click .unsubscribe-button": "confirmUnfollowIntent",
            "click .unfollow-button": "confirmUnfollowed",
            "click .keep-following-button": "restoreOriginalFollowable",
            "click .undo-action-button": "undoUnfollowFollowable",
            "click .message-link": "handleMessageClicked"
        },
        prepareView: function () {
            var i = e(".notifications-button");
            t.bindAll(this, "trackArchiveAction"), i.removeClass("hidden"), this.notificationModal = new a, this.followCollection = n, this.$el.find(".message-bed").append(r.notificationsModal({
                show: "default"
            })), this.$archivePanel = e("#notifications-modal"), this.$modalContent = this.$archivePanel.find(".modal-content"), this.$notificationsModal = this.$archivePanel.find(".notifications-modal"), this.messageCount = 0, this.archiveOpen = !1, this.timestampsUpdating = !1, this.sliding = !1, this.maxHeight = parseInt(this.$modalContent.css("max-height"), 10), this.isUnfollowing = !1, this.unfollowing = {
                model: void 0,
                $el: void 0
            }, this.cachePullOver = !1, this.lastScrollCheck = 0, this.unreadMessages = [], this.subscribe(this.notificationModal, "nyt:messaging-notification-modal-clicked", this.handleMessageAcknowledged), this.subscribe(this.notificationModal, "nyt:messaging-notification-modal-closed", this.handleMessageDismissed), this.pageManager.setMeta("nyt:messaging-notifications-panel-active", "true"), this.broadcast("nyt:messaging-notifications-panel-active"), this.$el.show(), this.disablePageScrollOnHover()
        },
        afterMessageReceived: function (e) {
            var t, i, n = this.$archivePanel.is(":visible");
            e && (t = e.model.get("unread"), i = e.model.get("popup_unread"), t && (this.broadcast("nyt:messaging-count-received", 1), this.unreadMessages.push(e), !n && i && this.displayPopup(e)), this.hideDefaultNotification(), e.reveal(!0), n && (this.truncateCommentBodies(), this.markAppropriateMessagesRead()), this.addBottomBorder())
        },
        setCachePullOver: function () {
            this.cachePullOver = !0
        },
        displayPopup: function (e) {
            this.cachePullOver && this.notificationModal.render(e), e.model.setPopupRead()
        },
        markRead: function (e) {
            var t = this.active.messages[e];
            t.displayed()
        },
        handleMessageAcknowledged: function (e) {
            this.broadcast("nyt:messaging-modal-" + e + "-acknowledged")
        },
        handleMessageDismissed: function (e) {
            this.broadcast("nyt:messaging-modal-" + e + "-dismissed")
        },
        handleArchivePanelOpened: function () {
            var e = this;
            e.archiveOpen = !0, e.timestampsUpdating || (e.updateTimestamps(e), e.timestampsUpdating = setInterval(function () {
                e.updateTimestamps(e)
            }, e.timestampUpdateFreq)), e.markAppropriateMessagesRead(), e.truncateCommentBodies(), e.addBottomBorder(), e.trackArchiveAction("open")
        },
        handleArchivePanelClosed: function () {
            this.archiveOpen = !1, this.stopUpdatingTimestamps(), this.trackArchiveAction("close"), this.isUnfollowing && this.restoreOriginalFollowable()
        },
        isMessageVisible: function (e) {
            var t, i, n, s, a;
            return this.$modalContent.find(".follow-options").is(":visible") ? !1 : (t = this.$modalContent.offset().top, i = t + this.$modalContent.height(), n = e.$el.find(".message-title"), s = n.offset().top, a = s + n.height(), s >= t && i >= a)
        },
        markAppropriateMessagesRead: function () {
            var t, i, n, s, a, o = this,
                r = [];
            for (i = 0; i < this.unreadMessages.length; i++) s = this.unreadMessages[i], t = s.model.get("id"), a = this.isMessageVisible(s), n = s.model.get("unread"), a && n ? (s.displayed(this.options.fadeOutDelay), this.local(this, "nyt:messaging-message-" + this.options.id + "-displayed", t)) : !a && n && r.push(s);
            this.unreadMessages = r, this.watchingWhichMessagesAreSeen || (this.$modalContent.on("scroll", function () {
                var t = e(this).scrollTop(),
                    i = Math.abs(t - o.lastScrollCheck),
                    n = i / o.options.scrollCheckHeight > 1;
                o.unreadMessages.length > 0 && n && (o.markAppropriateMessagesRead(), o.lastScrollCheck = t)
            }), this.watchingWhichMessagesAreSeen = !0)
        },
        updateCounter: function (e) {
            var t, i;
            void 0 !== e && (t = this.messageCount + e, this.messageCount = Math.max(t, 0), i = {
                count: this.messageCount,
                delta: e
            }, this.broadcast("nyt:messaging-notification-count-update", i))
        },
        showDefaultNotification: function () {
            this.$el.find(".default-message").show()
        },
        hideDefaultNotification: function () {
            var e = this.$el.find(".message-default").closest(".message-container");
            "block" === e.css("display") && e.hide()
        },
        disablePageScrollOnHover: function () {
            this.$modalContent.on("mousewheel DOMMouseScroll", function (t) {
                var i = 0;
                "mousewheel" === t.type ? i = -1 * t.originalEvent.wheelDelta : "DOMMouseScroll" === t.type && (i = 40 * t.originalEvent.detail), i && (t.preventDefault(), e(this).scrollTop(i + e(this).scrollTop()))
            })
        },
        addBottomBorder: function () {
            var t = this.dimensions().height,
                i = parseInt(this.$modalContent.css("max-height"), 10);
            t > i && (e("#notifications-modal").find(".modal").addClass("scroll-active"), this.$modalContent.find(".comment-text").data("truncate", !0))
        },
        handleMessageClicked: function (t) {
            var i;
            t.preventDefault(), this.trackMessageLink(t), i = e(t.currentTarget).attr("href"), this.handleNavigationRequired(i)
        },
        handleNavigationRequired: function (e) {
            var t, i, n, s = window.location.href.split("#")[0] === e.split("#")[0];
            window.location.href = e, t = e.split("#")[1], t && s && (n = t.split("="), i = n[1], "permid" === n[0] && i && this.broadcast("nyt:community-commentspanel-open", i))
        },
        trackArchiveAction: function (e) {
            this.trackingTrigger("notification-events", {
                module: "notification",
                version: "NotificationPanel",
                state: "notification",
                action: e,
                region: "TopBar"
            }, "interaction")
        },
        trackMessageLink: function (t) {
            var i = e(t.currentTarget).closest(".message-link"),
                n = {
                    module: "notification",
                    version: "NotificationPanel",
                    state: "notification",
                    action: "click",
                    region: "TopBar",
                    contentId: i.attr("href"),
                    contentPlacement: e(".notifications-modal .notifications .message-link").index(i) + 1
                };
            this.trackingTrigger("notification-events", n, "interaction")
        },
        confirmUnfollowIntent: function (t) {
            var i, n, s = e(t.currentTarget).closest(".message-container"),
                a = this.collection.get(s.data("id"));
            this.isUnfollowing && this.restoreOriginalFollowable(), a.set("originalHTML", s.html()), t.preventDefault(), t.stopPropagation(), i = s.height(), s.css({
                height: i
            }), s.find(".unsubscribe-button").remove(), n = r.followConfirmation(a.toJSON()), s.find(".message").replaceWith(n), this.isUnfollowing = !0, this.unfollowing = {
                $el: s,
                model: a
            }
        },
        confirmUnfollowed: function (t) {
            var i, n = e(t.currentTarget).closest(".message-container"),
                s = this.collection.get(n.data("id")),
                a = s.get("tag");
            t.preventDefault(), t.stopPropagation(), this.broadcast("nyt:messaging-unfollow-tag", a), i = r.followUnfollowed(s.toJSON()), n.css({
                height: "auto"
            }), n.find(".message").replaceWith(i), this.isUnfollowing = !1
        },
        restoreOriginalFollowable: function (t) {
            var i = t ? e(t.currentTarget).closest(".message-container") : this.unfollowing.$el,
                n = t ? this.collection.get(i.data("id")) : this.unfollowing.model;
            return t && (t.preventDefault(), t.stopPropagation()), i.find(".message").replaceWith(n.get("originalHTML")), i.css({
                height: "auto"
            }), this.isUnfollowing = !1, n
        },
        undoUnfollowFollowable: function (e) {
            var t = this.restoreOriginalFollowable(e),
                i = t.get("tag");
            this.broadcast("nyt:messaging-follow-tag", i)
        },
        updateMessageView: function (e) {
            var t, i, n = this.received.messages[e.id],
                s = n.model;
            t = s.get("unread"), s.applyMetadata(e.update), i = s.get("unread"), e.message && s.updateProperties(e.message), !t && i ? this.broadcast("nyt:messaging-count-received", 1) : t && !i && this.broadcast("nyt:messaging-count-received", -1), i ? (n.$el.detach(), n.render(), this.$el.find(".message-bed").prepend(n.$el), n.reveal(!0), this.archiveOpen && this.markAppropriateMessagesRead()) : n.render().reveal(!0)
        },
        movePanelForOtherAlerts: function (e) {
            var t;
            this.archiveOpen && (t = this.$archivePanel.find(".notifications-modal"), e(t))
        },
        updateTimestamps: function (t) {
            e(".notifications-modal .timestamp").each(function () {
                var i = e(this),
                    n = 1e3 * parseInt(i.attr("datetime"), 10),
                    s = t.prettyDate(n);
                s && i.html(s)
            })
        },
        stopUpdatingTimestamps: function () {
            this.updating && (clearInterval(this.updating), this.updating = !1)
        },
        addSuggestedFollows: function (e) {
            var t, i, n, s = this,
                a = s.$el.find(".follow-suggestions");
            for (i = 0; i < e.length; i += 1) t = e[i], n = new o({
                model: t
            }), a.append(n.render().$el)
        },
        createFollowableList: function (e) {
            var t, i, n, s = this;
            for (this.$archivePanel.find("#toggle-customize-button").removeClass("hidden"), this.$modalContent.append("<div class='follow-options'><h4 class='follow-options-heading'>Follow columns and columnists</h4></div>"), n = this.$modalContent.find(".follow-options"), t = 0; t < e.length; t += 1) i = new o({
                model: e[t]
            }), n.append(i.render().$el);
            this.$archivePanel.find(".modal-header").on("click", ".button", function (e) {
                e.preventDefault(), e.stopPropagation(), s.sliding || (s.sliding = !0, s.toggleFollowableView(function () {
                    s.sliding = !1
                }))
            })
        },
        toggleFollowableView: function (e, t) {
            var i, n = this,
                s = this.$archivePanel.find(".modal-header");
            i = this.prepareToAnimateFollows(), t = t || 250, s.find("#toggle-customize-button").toggleClass("active"), i.wrapButton ? s.find(".modal-heading").wrap("<button class='button back-button'></button>") : s.find(".modal-heading").unwrap(), n.$modalContent.removeClass("scroll-active").css({
                height: i.destinationHeight
            }).addClass("is-animating"), i.$showing.addClass("is-animating").css({
                width: i.width,
                "max-height": n.maxHeight,
                left: i.moveShowingTo
            }), i.$toShow.addClass("is-animating").css({
                width: i.width,
                left: 0
            }), setTimeout(function () {
                i.scrollActive && n.$notificationsModal.addClass("scroll-active"), i.$showing.removeClass("is-animating scroll-active").css({
                    display: "none"
                }), i.$toShow.removeClass("is-animating scroll-active").css({
                    width: "auto"
                }), n.$modalContent.removeClass("is-animating").css({
                    height: "auto"
                }), e && e()
            }, t)
        },
        prepareToAnimateFollows: function () {
            var e, t, i, n, s, a = this.$modalContent.find(".follow-options"),
                o = this.$modalContent.width(),
                r = this.$modalContent.height(),
                l = this.maxHeight;
            return n = !1, s = a.is(":hidden"), e = s ? this.$el : a, t = s ? a : this.$el, this.$modalContent.css({
                height: r
            }), l = t.css({
                display: "inherit",
                width: o
            }).height(), l >= this.maxHeight ? (t.addClass("scroll-active"), n = !0) : this.$notificationsModal.removeClass("scroll-active"), r === this.maxHeight && e.addClass("scroll-active"), l = l > this.maxHeight ? this.maxHeight : l, i = s ? -o : o, {
                $showing: e,
                $toShow: t,
                wrapButton: s,
                destinationHeight: l,
                moveShowingTo: i,
                width: o,
                scrollActive: n
            }
        },
        truncateCommentBodies: function () {
            var t = this;
            this.$modalContent.find(".comment-text").each(function () {
                var i = e(this);
                i.data("truncate") && (t.truncateText(i, t.options.truncateTextHeight), i.data("truncate", !1))
            })
        }
    }));
    return d
}), define("shared/messaging/instances/messaging", ["foundation/views/page-manager", "shared/messaging/views/critical-alerts", "shared/messaging/views/suggestions", "shared/messaging/views/announcements", "shared/messaging/views/notifications"], function (e, t, i, n, s) {
    "use strict";
    var a = e.getMeta("nyt:messaging-user-has-ability-to-follow"),
        o = function () {
            e.flag("followFeature") && new s({
                id: "notifications",
                notifyWhen: "nyt:messaging-notification-received nyt:messaging-follow-notice-received"
            })
        };
    (!e.$html.hasClass("app-interactive") || e.$html.hasClass("page-interactive-default")) && !e.$html.hasClass("lt-ie9") && !e.$html.hasClass("template-minimal") && e.getCurrentBreakpoint() >= 120 && (e.getCurrentBreakpoint() >= 1010 && (new i({
        id: "suggestions",
        notifyWhen: "nyt:messaging-velcro-received"
    }), new t({
        id: "breaking-news-alerts",
        notifyWhen: "nyt:messaging-breaking-news-received",
        expiration: 20,
        dismissAcknowledged: !1,
        trackingVersion: "BreakingNews"
    }), new t({
        id: "account-alerts",
        notifyWhen: "nyt:messaging-account-alert-received",
        expiration: 10,
        trackingVersion: "UserAccounts"
    }), new n({
        id: "announcements",
        notifyWhen: "nyt:messaging-video-received"
    })), a ? o() : e.listenToOnce(e, "nyt:messaging-user-has-ability-to-follow", o))
}), define("shared/page/tech-jobs", [], function () {
    var e = ["", "       0000000                         000        0000000", "     111111111      11111111100          000      111111111", "     00000        111111111111111111      00000      000000", "     000        1111111111111111111111111100000         000", "     000        1111       1111111111111111100          000", "     000         11       0     1111111100              000", "     000          1      00             1               000", "     000               00      00       1               000", "     000             000    00000       1               000", "  00000            0000  00000000       1                00000", "11111            000 00    000000      000                 11111", "  00000          0000      000000     00000              00000", "     000        10000      000000      000              0000", "     000        00000      000000       1               000", "     000        000000     10000        1     0         000", "     000        1000000 00              1    00         000", "     000         1111111                1 0000          000", "     000          1111111100           000000           000", "     0000          111111111111111110000000            0000", "     111111111        111111111111100000          111111111", "       0000000              00000000              0000000", "\n\n", "NYTimes.com: All the code that's fit to printf()", "We're hiring: developers.nytimes.com/careers", "\n\n"].join("\n");
    console.log(e)
}), define("shared/video/models/video", ["backbone/nyt", "foundation/models/base-model"], function (e, t) {
    "use strict";
    var i = t.extend({
        playerPositions: {
            POSITION_LEDE: "position_lede",
            POSITION_INLINE: "position_inline",
            POSITION_EMBEDDED: "position_embedded",
            POSITION_PHOTOSPOT: "position_photospot"
        },
        videoEvents: {
            TEMPLATE_READY: "nyt:video-template-ready",
            VIDEO_COMPLETE: "nyt:video-complete",
            PLAY_CLICKED: "nyt:video-play-clicked",
            VIDEO_PLAY: "nyt:video-play",
            VIDEO_PAUSED: "nyt:video-video-paused",
            AD_START: "nyt:video-ad-start",
            AD_COMPLETE: "nyt:video-ad-complete",
            VIDEO_FULLSCREEN: "nyt:video-fullscreen",
            VIDEO_EXIT_FULLSCREEN: "nyt:video-exit-fullscreen",
            KILL_VIDEO: "nyt:video-kill",
            HIDE_VIDEO_END_CARD: "nyt:video-end-card-hide",
            MEDIA_CHANGE: "nyt:video-media-change"
        },
        clickableElements: [".video-share span", ".video-share i.icon", ".video-share a"],
        initialize: function () {
            this.videoObject = null, this.isVideoFullscreen = !1, this.isAdPlaying = !1
        },
        pause: function () {
            var e = this.get("videoObject");
            e && e.pause()
        },
        kill: function () {
            this.local(this, this.videoEvents.KILL_VIDEO, this.videoObject)
        },
        hideVideoEndCard: function () {
            this.local(this, this.videoEvents.HIDE_VIDEO_END_CARD, this)
        }
    });
    return i
}), define("shared/video/models/video-end-card", ["backbone/nyt", "foundation/models/base-model", "foundation/hosts"], function (e, t, i) {
    "use strict";
    var n = t.extend({
        PAUSE_STATE: "pause",
        COMPLETE_STATE: "complete",
        maxThumbs: 4,
        autoplayTimeout: 5,
        currentPlaylistIndex: 0,
        cachedPlaylist: null,
        defaults: {
            permalink: "http://www.nytimes.com/video",
            videoTitle: "NYTimes Video",
            videoDescription: "",
            videoStillImgUrl: "http://graphics8.nytimes.com/images/section/video/library/default-video-posterframe.png",
            playlistDisplayName: "Latest Video",
            playlistId: 1194811622182,
            playlistUrl: "http://www.nytimes.com/video/landing/latest-video/1194811622182/index.html",
            tags: []
        },
        initialize: function (e) {
            this.videoModel = e.videoModel, this.videoId = this.videoModel.get("videoId"), this.videoObject = this.videoModel.get("videoObject"), this.videoInnerContainer = this.videoModel.get("videoInnerContainer"), this.playlistVideosDataModel = null, this.playlistMetaDataModel = null, this.staticBaseUrl = i.image + "/"
        }
    });
    return n
}), define("shared/video/templates", ["underscore/nyt"], function (_) {
    var templates = {};
    return templates.video = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<div id="' + (null == (__t = outerId) ? "" : __t) + '" class="video-bind">\n<div id="' + (null == (__t = innerId) ? "" : __t) + '" class="video-container"></div>\n</div>';
        return __p
    }, templates.videoEndCard = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<div class="video-end-card layout-small"><button class="video-end-card-play-button"><i class=\'icon sprite-icon\'></i><span>Replay Video</span></button><div class="video-share sharetools theme-classic" data-shares="show-all|Share" data-url="' + (null == (__t = permalink) ? "" : __t) + '" data-title="' + (null == (__t = videoTitle) ? "" : __t) + '" data-description="' + (null == (__t = videoDescription) ? "" : __t) + '">\n</div><div class="video-end-card-videos">\n<h5 class="video-end-card-section-heading video-end-card-section-heading-loading">\n<a href="' + (null == (__t = playlistUrl) ? "" : __t) + '" style="opacity: 1;">More in ' + (null == (__t = playlistDisplayName) ? "" : __t) + ' &raquo;</a>\n</h5>\n<div class="video-end-card-thumbs">\n<span class="video-end-card-loader"></span>\n</div>\n</div>\n</div>';
        return __p
    }, templates.videoEndCardIcon = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<i class="icon sprite-icon"></i><span>' + (null == (__t = iconText) ? "" : __t) + "</span>";
        return __p
    }, templates.videoEndCardThumb = function (obj) {
        {
            var __t, __p = "";
            Array.prototype.join
        }
        with(obj || {}) __p += '<div class="video-end-card-thumb item-' + (null == (__t = itemIndex) ? "" : __t) + " " + (null == (__t = itemOrdinal) ? "" : __t) + '">\n<a href="' + (null == (__t = thumbLink) ? "" : __t) + '" alt="' + (null == (__t = thumbDesc) ? "" : __t) + '" title="' + (null == (__t = thumbDesc) ? "" : __t) + '" data-videoid="' + (null == (__t = thumbVideoId) ? "" : __t) + '" data-index="' + (null == (__t = thumbIndex) ? "" : __t) + '">\n', "first" == itemOrdinal && (__p += '\n<p class="autoplayMeta off ' + (null == (__t = thumbAutoPlayPaused) ? "" : __t) + '">\n<span class="countdownControl"></span>\n<span class="countdown">Playing in <span>' + (null == (__t = thumbAutoPlayRemainingTime) ? "" : __t) + "</span>...</span>\n</p>\n"), __p += '\n<span class="video-end-card-thumb-image">\n<img src="' + (null == (__t = thumbImg) ? "" : __t) + '">\n</span>\n<h4 class="video-headline">' + (null == (__t = thumbDesc) ? "" : __t) + "</h4>\n</a>\n</div>";
        return __p
    }, templates
}), define("shared/video/models/playlist-videos", ["backbone/nyt", "foundation/models/base-model", "foundation/hosts"], function (e, t, i) {
    "use strict";
    var n = t.extend({
        url: i.www + "/svc/video/api/v2/playlist/",
        fetchData: function (e, t, i, n) {
            var s = this,
                a = [],
                o = e.playlistId || "1194811622188";
            this.success = t, this.error = i, this.passThroughCallback = n, e.count && a.push("count=" + e.count), e.skip && a.push("skip=" + e.skip), this.url += o, a.length > 0 && (this.url += "?" + a.join("&")), this.fetch({
                success: function (e) {
                    s.success && (s.passThroughCallback && "function" == typeof s.passThroughCallback ? s.success(e, s.passThroughCallback) : s.success(e))
                },
                error: function (e) {
                    s.error && s.error(e)
                }
            })
        },
        sync: function (t, i, n) {
            return n.dataType = "jsonp", n.timeout = 1e4, n.cache = !0, n.jsonp = "callback", n.jsonpCallback = "hpPlaylistCallback", e.sync(t, i, n)
        }
    });
    return n
}), define("shared/video/models/playlist-metadata", ["backbone/nyt", "foundation/models/base-model"], function (e, t) {
    "use strict";
    var i = t.extend({
        url: "http://www.nytimes.com/svc/video/api/v2/playlists",
        initialize: function (e) {
            this.allPlaylistData = null, this.apiEnv = e.apiEnv || "production", "staging" === this.apiEnv && (this.url = "http://www.stg.nytimes.com/svc/video/api/v2/playlists")
        },
        sync: function (t, i, n) {
            return n.dataType = "json", n.timeout = 1e4, n.cache = !0, e.sync(t, i, n)
        },
        getPlaylistMetaData: function (e, t, i) {
            var n = this;
            this.playlistId = e, this.success = t, this.error = i, this.allPlaylistData ? this.findPlaylistById(this.allPlaylistData, this.playlistId, this.success, this.error) : this.fetch({
                success: function (e) {
                    n.allPlaylistData = e, n.findPlaylistById(e, n.playlistId, n.success, n.error)
                },
                error: function (e) {
                    n.error && n.error(e)
                }
            })
        },
        getPlaylistNode: function (e, t) {
            var i, n;
            if (e)
                for (n in e)
                    if (i = e[n], parseInt(i.knews_id, 10) === t) return i;
            return {}
        },
        findPlaylistById: function (e, t, i, n) {
            var s, a, o;
            if (this.playlistId = t, this.success = i, this.error = n, s = e.toJSON(), a = s.plst_all, o = this.getPlaylistNode(a, this.playlistId)) {
                if (!this.success) return o;
                this.success(o)
            } else this.error && this.error({
                message: "Could not find playlist in all playlists data."
            })
        }
    });
    return i
}), define("shared/video/models/video-thumb", ["backbone/nyt", "foundation/models/base-model"], function (e, t) {
    "use strict";
    var i = t.extend({
        defaults: {
            itemIndex: "",
            itemOrdinal: "",
            thumbLink: "",
            thumbImg: "",
            thumbDesc: "",
            thumbAutoPlayPaused: "",
            thumbAutoPlayRemainingTime: "5"
        }
    });
    return i
}), define("shared/video/collections/video-thumbs", ["backbone/nyt", "underscore/nyt", "foundation/collections/base-collection", "shared/video/models/video-thumb"], function (e, t, i, n) {
    "use strict";
    var s = i.extend({
        model: n
    });
    return s
}), define("shared/video/views/video-thumb", ["jquery/nyt", "underscore/nyt", "backbone/nyt", "shared/video/templates", "foundation/views/base-view"], function (e, t, i, n, s) {
    "use strict";
    var a = s.extend({
        thumbTemplate: n.videoEndCardThumb,
        render: function () {
            return this.thumbTemplate(this.model.toJSON())
        }
    });
    return a
}),
function (e, t) {
    "use strict";
    "function" == typeof define && define.amd ? define("shared/video/libs/countdown-timer", ["jquery/nyt"], t) : e.amdWeb = t(e.$)
}(this, function (e) {
    "use strict";

    function t(t, i) {
        this.timeout = 1e3 * t, this.interval = 1e3 * i || 1e3, this.running = !1, this.startTime = 0, this.ticks = 0, this.pauseTime = 0, this.runTime = 0, this.intervalId = null, this.resumeId = null, this.active = !0, this.$emitter = e({}), this.tick = e.proxy(this.tick, this)
    }
    return t.prototype.start = function () {
        var e = this,
            t = 0;
        this.active && (this.pauseTime ? (t = this.interval - this.runTime % this.interval, this.pauseTime = 0, this.emit("resume")) : this.emit("start"), this.running = !0, this.startTime = (new Date).getTime(), this.resumeId = setTimeout(function () {
            t > 0 && e.tick(), e.running && (e.intervalId = setInterval(e.tick, e.interval))
        }, t))
    }, t.prototype.tick = function () {
        var e;
        this.ticks++, e = this.timeout - this.ticks * this.interval, 0 >= e ? this.complete() : this.emit({
            type: "tick",
            timeLeft: e / 1e3
        })
    }, t.prototype.on = function (e, t) {
        this.$emitter.on(e, t)
    }, t.prototype.emit = function (e, t) {
        this.$emitter.trigger(e, t)
    }, t.prototype.complete = function () {
        this.emit("complete"), this.stop()
    }, t.prototype.stop = function () {
        clearInterval(this.intervalId), clearInterval(this.resumeId), this.emit("stop"), this.$emitter.off(), this.running = !1, this.startTime = 0, this.pauseTime = 0, this.runTime = 0, this.ticks = 0
    }, t.prototype.pause = function () {
        this.running && (clearInterval(this.intervalId), clearInterval(this.resumeId), this.emit("pause"), this.running = !1, this.pauseTime = (new Date).getTime(), this.runTime += this.pauseTime - this.startTime)
    }, t
}), define("shared/video/views/video-end-card", ["jquery/nyt", "underscore/nyt", "shared/video/templates", "foundation/views/base-view", "shared/video/models/playlist-videos", "shared/video/models/playlist-metadata", "shared/video/collections/video-thumbs", "shared/video/views/video-thumb", "shared/sharetools/views/sharetools", "foundation/views/page-manager", "shared/video/libs/countdown-timer"], function (e, t, i, n, s, a, o, r, l, d, c) {
    "use strict";
    var h = n.extend({
        initialize: function (e) {
            var n = window.location.host;
            t.bindAll(this, "processPlaylistVideos", "processPlaylistVideosError", "processPlaylistMetaData", "processPlaylistMetaDataError", "replayVideo", "resumeVideo", "onClickVideoOverlayHandler", "onMouseEnterVideoOverlayHandler", "onMouseLeaveVideoOverlayHandler", "onThumbClicked", "changeVideo", "initializeAutoPlayCountdown", "hideVideoEndCard", "stopAutoPlayCountdown"), this.videoModel = this.model.videoModel, this.videoObject = this.model.videoObject, this.currentPlaylistIndex = this.model.currentPlaylistIndex, this.enableAutoPlayCountdown = e.enableAutoPlayCountdown, this.cachedPlaylist = this.model.cachedPlaylist, this.autoplayTimeout = this.model.autoplayTimeout, this.enableAutoPlayCountdown && (this.countdown = new c(this.autoplayTimeout)), this.excludedAutoplayPlaylists = [1194812888716, 0x5af310a56ca7], this.apiEnv = "production", ("www.dev.nytimes.com" === n || "www.stg.nytimes.com" === n || "www.sbx.nytimes.com" === n) && (this.excludedAutoplayPlaylists = [1194812888716, 0x5af310a5dfd7], this.apiEnv = "staging"), this.videoEndCardTemplate = i.videoEndCard, this.iconTextTemplate = i.videoEndCardIcon, this.iconTextReplayHTML = this.iconTextTemplate({
                iconText: "Replay Video"
            }), this.iconTextResumeHTML = this.iconTextTemplate({
                iconText: "Resume Video"
            }), this.$videoInnerContainer = this.model.videoInnerContainer, this.$videoEndCard = null, this.$videoEndCardThumbsContainer = null, this.$videoEndCardVideosSectionHeading = null, this.$videoEndCardVideosSectionHeadingLink = null, this.$videoEndCardVideosReplayButton = null, this.registerListeners(), this.getVideoData(), this.listenTo(this.videoModel, this.videoModel.videoEvents.KILL_VIDEO, this.onKill), this.listenTo(this.videoModel, this.videoModel.videoEvents.HIDE_VIDEO_END_CARD, this.hideVideoEndCard), this.listenTo(this.pageManager, "nyt:page-breakpoint", this.onBreakpoint)
        },
        registerListeners: function () {
            var e = this.videoModel.videoEvents;
            this.listenTo(this.pageManager, e.VIDEO_COMPLETE, this.onVideoComplete), this.listenTo(this.pageManager, e.PLAY_CLICKED, this.onVideoPlayClicked), this.listenTo(this.pageManager, e.VIDEO_PLAY, this.onVideoPlay), this.listenTo(this.pageManager, e.VIDEO_PAUSED, this.onVideoPaused), this.listenTo(this.pageManager, e.AD_START, this.onAdStart)
        },
        unregisterListeners: function () {
            var e = this.videoModel.videoEvents;
            this.stopListening(this.pageManager, e.VIDEO_COMPLETE, this.onVideoComplete), this.stopListening(this.pageManager, e.PLAY_CLICKED, this.onVideoPlayClicked), this.stopListening(this.pageManager, e.VIDEO_PLAY, this.onVideoPlay), this.stopListening(this.pageManager, e.VIDEO_PAUSED, this.onVideoPaused), this.stopListening(this.pageManager, e.AD_START, this.onAdStart)
        },
        onVideoComplete: function (e) {
            e === this.videoModel.get("videoObject") && this.showVideoEndCard(this.model.COMPLETE_STATE)
        },
        onVideoPlayClicked: function (e) {
            e === this.videoModel.get("videoObject") && "playing" !== this.videoObject.status && "adplaying" !== this.videoObject.status && this.showVideoEndCard(this.model.PAUSE_STATE)
        },
        onVideoPaused: function () {},
        onVideoPlay: function (e) {
            e === this.videoModel.get("videoObject") && this.hideVideoEndCard()
        },
        onAdStart: function (e) {
            e === this.videoModel.get("videoObject") && this.hideVideoEndCard()
        },
        getVideoData: function () {
            var t, i, n = "";
            if (this.videoObject && (t = this.videoObject._data)) {
                this.videoModel.get("orphanVideo") ? this.model.set("permalink", e('link[rel="canonical"]').attr("href")) : this.model.set("permalink", t.domain + t.publish_url), this.model.set("videoTitle", t.headline), this.model.set("videoDescription", t.summary);
                for (i in t.images)
                    if ("videoSmall" === t.images[i].type) {
                        n = this.model.staticBaseUrl + t.images[i].url;
                        break
                    }
                this.model.set("videoStillImgUrl", n), t.playlist && this.model.set("playlistId", t.playlist.id || 1194811622182)
            }
        },
        getPlaylistId: function (e) {
            var t = /nytp_([^,]+)/.exec(e.join(","))[1];
            return parseInt(t, 10) || 1194811622182
        },
        showVideoEndCard: function (e) {
            var t, i = this;
            if (t = e, !this.videoModel.isVideoFullscreen) {
                if (!this.$videoEndCard) {
                    this.render(), this.$videoEndCard = this.$videoInnerContainer.find(".video-end-card"), this.$videoEndCardThumbsContainer = this.$videoEndCard.find(".video-end-card-thumbs"), this.$videoEndCardVideosSectionHeading = this.$videoEndCard.find(".video-end-card-section-heading"), this.$videoEndCardVideosSectionHeadingLink = this.$videoEndCardVideosSectionHeading.find("a");
                    try {
                        new l({
                            el: this.$videoEndCard.find(".video-share"),
                            showAllModalSettings: {
                                hasOverlay: !0,
                                tailDirection: "fixed",
                                hasCloseButton: !0
                            },
                            showAllModalData: {
                                shares: "facebook|Facebook,email|Email,twitter|Twitter,linkedin|LinkedIn,google|Google+,reddit|Reddit,save|Save,ad"
                            }
                        })
                    } catch (n) {
                        this.$videoEndCard.find(".video-share").hide()
                    }
                }
                this.$videoEndCard && (this.onSetEndCardTemplateClass(this.videoModel.get("videoOuterContainer")), this.$videoEndCardVideosReplayButton = this.$videoEndCard.find(".video-end-card-play-button"), t === this.model.COMPLETE_STATE ? this.$videoEndCardVideosReplayButton.removeClass("video-end-card-resume-button").html(this.iconTextReplayHTML).on("click", this.replayVideo) : t === this.model.PAUSE_STATE && this.$videoEndCardVideosReplayButton.addClass("video-end-card-resume-button").html(this.iconTextResumeHTML).on("click", this.resumeVideo), this.videoObject.modules.controls.hide(), this.$videoEndCard.fadeIn(500), null === this.cachedPlaylist ? (this.getVideoData(), this.fetchPlaylistVideos(function () {
                    i.initializeAutoPlayCountdown(t)
                }), this.fetchPlaylistMetaData()) : i.initializeAutoPlayCountdown(t), this.$videoEndCard.on("click", this.onClickVideoOverlayHandler), this.$videoEndCard.on("mouseenter", this.onMouseEnterVideoOverlayHandler), this.$videoEndCard.on("mouseleave", this.onMouseLeaveVideoOverlayHandler))
            }
        },
        onBreakpoint: function () {
            this.onSetEndCardTemplateClass(this.videoModel.get("videoOuterContainer"))
        },
        initializeAutoPlayCountdown: function (e) {
            function t(e) {
                o.text(e.timeLeft)
            }

            function i() {
                a.remove(), r.changeVideo(l.data("videoid"), l.data("index"), !1)
            }

            function n() {
                l.off("click", r.onThumbClicked), l.on("click", function (e) {
                    a.toggleClass("paused"), a.hasClass("paused") ? r.countdown.pause() : r.countdown.start(), e.stopPropagation(), e.preventDefault()
                })
            }

            function s() {
                l.off("click"), l.on("click", r.onThumbClicked), o.text(r.autoplayTimeout), a.addClass("off"), a.removeClass("paused")
            }
            var a, o, r = this,
                l = this.$videoEndCard.find(".video-end-card-thumb.first a");
            this.enableAutoPlayCountdown && e !== this.model.PAUSE_STATE && -1 === this.excludedAutoplayPlaylists.indexOf(this.model.get("playlistId")) && !this.videoModel.get("orphanVideo") && (a = this.$videoEndCard.find(".video-end-card-thumb.first .autoplayMeta"), o = a.find(".countdown span"), a.removeClass("off"), this.countdown.on("tick", t), this.countdown.on("complete", i), this.countdown.on("start", n), this.countdown.on("stop", s), this.countdown.start())
        },
        stopAutoPlayCountdown: function () {
            this.enableAutoPlayCountdown && this.countdown.stop()
        },
        onSetEndCardTemplateClass: function (e) {
            var t, i = e,
                n = "layout-large",
                s = "layout-medium",
                a = "layout-small";
            i && this.$videoEndCard && (t = i.width(), t >= 720 ? this.$videoEndCard.removeClass("hidden").addClass(a).addClass(s).addClass(n) : t >= 600 ? this.$videoEndCard.removeClass("hidden").addClass(a).addClass(s).removeClass(n) : t >= 450 ? this.$videoEndCard.removeClass("hidden").addClass(a).removeClass(s).removeClass(n) : this.$videoEndCard.addClass("hidden"), !this.videoObject || "playing" !== this.videoObject.status && "adplaying" !== this.videoObject.status || this.hideVideoEndCard())
        },
        onClickVideoOverlayHandler: function (t) {
            var i = this.videoModel.clickableElements,
                n = i.join(", "),
                s = e(t.target).is(n);
            s || t.stopPropagation()
        },
        onMouseEnterVideoOverlayHandler: function (e) {
            e.stopPropagation(), this.$videoEndCardVideosReplayButton && this.$videoEndCardVideosReplayButton.addClass("expand")
        },
        onMouseLeaveVideoOverlayHandler: function () {
            this.$videoEndCardVideosReplayButton && this.$videoEndCardVideosReplayButton.removeClass("expand")
        },
        hideVideoEndCard: function (t, i) {
            var n;
            t = t || 500, this.stopAutoPlayCountdown(), this.$videoEndCard && this.$videoEndCard.is(":visible") && (n = this, this.$videoEndCard.fadeOut(t, function () {
                e(this).hide(), n.$videoEndCardVideosReplayButton.off("click"), n.$videoEndCard.off("click"), i && i()
            }))
        },
        fetchPlaylistVideos: function (e) {
            this.model.playlistVideosDataModel || (this.model.playlistVideosDataModel = new s, this.model.playlistVideosDataModel.fetchData({
                playlistId: this.model.get("playlistId")
            }, this.processPlaylistVideos, this.processPlaylistVideosError, e))
        },
        processPlaylistVideos: function (t, i) {
            var n, s, a, l, d, c, h, u, m;
            if (s = t.toJSON(), n = this, s)
                if (null === this.cachedPlaylist && (this.cachedPlaylist = t), this.$videoEndCardThumbsContainer.empty(), s.videos) {
                    if (a = s.videos.length, this.currentPlaylistIndex >= a) return;
                    for (l = 0, this.videoThumbs = new o, c = this.currentPlaylistIndex; a > c; c++)
                        if (d = s.videos[c], m = this.model.get("videoStillImgUrl"), d.id !== this.videoModel.get("videoId")) {
                            if (!(l < this.model.maxThumbs)) break;
                            for (h in d.images)
                                if ("videoSmall" === d.images[h].type) {
                                    m = this.model.staticBaseUrl + d.images[h].url;
                                    break
                                }
                            u = {
                                itemIndex: l,
                                itemOrdinal: 0 === l ? "first" : l === this.model.maxThumbs - 1 ? "last" : "",
                                thumbLink: d.domain + d.publish_url,
                                thumbImg: m,
                                thumbDesc: d.headline,
                                thumbVideoId: d.id,
                                thumbIndex: c,
                                thumbAutoPlayRemainingTime: this.autoplayTimeout
                            }, this.videoThumbs.add(u), l += 1
                        }
                    this.currentPlaylistIndex = c, this.videoThumbs.each(function (t) {
                        var i = new r({
                                model: t
                            }),
                            s = e(i.render()),
                            a = parseInt(t.get("itemIndex"), 10),
                            o = 250 * a;
                        n.$videoEndCardThumbsContainer.append(s), s.find("a").on("click", n.onThumbClicked), setTimeout(function () {
                            s.addClass("fade-in")
                        }, o)
                    }), i && "function" == typeof i && i()
                } else this.processPlaylistError()
        },
        onThumbClicked: function () {
            var e = this.$videoEndCard.find(".video-end-card-thumb.first .autoplayMeta");
            e.hasClass("paused") || (this.countdown.pause(), e.addClass("paused"))
        },
        changeVideo: function (e, t, i) {
            var n = this;
            this.hideVideoEndCard(200, function () {
                n.currentPlaylistIndex = t + 1, n.videoObject.options.userInitiatedNext = i, n.videoObject.load(e, !0), n.processPlaylistVideos(n.cachedPlaylist)
            })
        },
        processPlaylistVideosError: function () {
            this.$videoEndCardThumbsContainer.empty(), this.$videoEndCardThumbsContainer.append('<p class="error">There was an error retrieving more videos.</p>')
        },
        fetchPlaylistMetaData: function () {
            this.model.playlistMetaDataModel || (this.model.playlistMetaDataModel = new a({
                apiEnv: this.apiEnv
            }), this.model.playlistMetaDataModel.getPlaylistMetaData(this.model.get("playlistId"), this.processPlaylistMetaData, this.processPlaylistMetaDataError))
        },
        processPlaylistMetaData: function (e) {
            var t = e;
            t && t.publish_url && t.display_name && (this.model.set("playlistUrl", ["http://www.nytimes.com", t.publish_url].join("")), this.model.set("playlistDisplayName", t.display_name), this.$videoEndCardVideosSectionHeadingLink.attr("href", this.model.get("playlistUrl")).html("More in " + this.model.get("playlistDisplayName"))), this.$videoEndCardVideosSectionHeading.css({
                opacity: 0
            }).removeClass("video-end-card-section-heading-loading").fadeTo(200, 1)
        },
        processPlaylistMetaDataError: function () {
            this.$videoEndCardVideosSectionHeading.css({
                opacity: 0
            }).removeClass("video-end-card-section-heading-loading").fadeTo(200, 1)
        },
        replayVideo: function () {
            this.videoObject.play(), this.hideVideoEndCard()
        },
        resumeVideo: function () {
            this.videoObject.play(), this.hideVideoEndCard()
        },
        render: function () {
            var e;
            return this.$videoEndCard || (this.$videoInnerContainer.find(".video-end-card").remove(), e = this.videoEndCardTemplate(this.model.toJSON()), this.$videoInnerContainer.append(e)), this
        },
        onKill: function () {
            this.stopListening(this.videoModel, this.videoModel.videoEvents.KILL_VIDEO, this.onKill), this.unregisterListeners(), this.$videoEndCard && this.$videoEndCard.remove(), this.model.clear(), this.remove()
        }
    });
    return h
}),
function (e, t) {
    "use strict";
    "function" == typeof define && define.amd ? define("shared/video/libs/inactivity-timer-manager", [], t) : e.InactvityTimerManager = t()
}(this, function () {
    "use strict";

    function e(e, t) {
        if (this.disableIntervalId = null, this.pageManager = e, this.disableInterval = t || 3e4, !e) throw new Error("InactvityTimerManager:: pageManger must be provided")
    }
    return e.prototype.disable = function (e) {
        e = e || this, e.disableIntervalId || (e.disableIntervalId = setInterval(e.disable, e.disableInterval, e)), e.pageManager.trigger("nyt:inactivity-timer-disable")
    }, e.prototype.enable = function () {
        clearInterval(this.disableIntervalId), this.disableIntervalId = null, this.pageManager.trigger("nyt:inactivity-timer-enable")
    }, e
}), define("shared/video/views/video", ["jquery/nyt", "underscore/nyt", "backbone/nyt", "foundation/collections/base-collection", "foundation/views/base-view", "shared/video/models/video-end-card", "shared/video/views/video-end-card", "foundation/views/page-manager", "shared/video/libs/inactivity-timer-manager", "shared/video/templates", "shared/video/models/video"], function (e, t, i, n, s, a, o, r, l, d, c) {
    "use strict";
    var h, u = s.extend({
        initialize: function () {
            var e = this,
                i = window.location.host,
                n = new c,
                s = this.model.get("videoId"),
                a = this.model.get("width"),
                o = this.model.get("height"),
                u = this.model.get("videoFigure"),
                m = this.model.get("pagePosition") || n.playerPositions.POSITION_EMBEDDED,
                g = this.model.get("autoStart") === !1 ? !1 : !0,
                p = this.model.get("playerType") || "article",
                f = "video_inner_" + m + "_",
                v = "video_outer_" + m + "_",
                b = this.model.get("userInitiatedPlay") || !1,
                y = this.model.get("orphanVideo") || !1,
                w = this.model.get("shareOptionsUrl") || null,
                _ = d.video,
                C = _({
                    outerId: v + s,
                    innerId: f + s
                });
            t.bindAll(this, "handleVHSLoad", "onTemplateReady", "onKillVideo", "onVideoComplete", "onVideoPlay", "onPlayClicked", "onVideoPaused", "onAdStart", "onAdComplete", "onFullscreen", "onExitFullscreen", "onClickVideoHandler", "onMediaChange"), this.genericVideoModel = n, u.prepend(C), this.vhsConfig = {
                container: f + s,
                width: a,
                height: o,
                id: s,
                autoplay: g,
                type: p,
                userInitiatedPlay: b,
                controlsOverlay: {
                    mode: "article"
                },
                cover: !1,
                endSlate: !1,
                shareOptions: this.setShareOptions(p, y, w)
            }, "photospot" === p && (this.inactivityTimerManager = new l(r), this.vhsConfig.cover = !0, this.vhsConfig.endSlate = !0), (i.indexOf("dev.") > -1 || i.indexOf("stg.") > -1 || i.indexOf("sbx.") > -1) && (this.vhsConfig.env = "staging"), require(["vhs"], function (t) {
                h = t, e.handleVHSLoad()
            })
        },
        setShareOptions: function (t, i, n) {
            var s = {},
                a = null,
                o = null;
            return n && (s.url = n), !i || n ? s : (a = e('meta[name="articleid"]').attr("content"), o = e('link[rel="canonical"]').attr("href"), "blog" === t && o ? s.blogPostUrl = o : a ? s.articleId = a : o && (s.url = o), s)
        },
        handleVHSLoad: function () {
            var e = this.model.get("videoId"),
                t = this.model.get("videoFigure"),
                i = t.find(".video-bind"),
                n = t.find(".video-container");
            this.video = h.player(this.vhsConfig), this.video && (this.model.set("videoObject", this.video), this.model.set("videoId", e), this.model.set("videoInnerContainer", n), this.model.set("videoOuterContainer", i), this.video.on(h.api.events.LOADED, this.onTemplateReady)), t.on("click", this.onClickVideoHandler)
        },
        onClickVideoHandler: function (t) {
            var i = this.model.clickableElements,
                n = i.join(", "),
                s = e(t.target).is(n);
            s || t.stopPropagation()
        },
        createVideoEndCard: function () {
            this.vhsConfig.endSlate || (this.videoEndCardModel = new a({
                videoModel: this.model
            }), this.videoEndCardView = new o({
                model: this.videoEndCardModel,
                enableAutoPlayCountdown: this.model.get("pagePosition") === this.model.playerPositions.POSITION_LEDE
            }))
        },
        onTemplateReady: function () {
            this.registerVideoEvents(), this.createVideoEndCard(), this.video && this.broadcast(this.model.videoEvents.TEMPLATE_READY, this.video), this.listenTo(this.model, this.model.videoEvents.KILL_VIDEO, this.onKillVideo)
        },
        onKillVideo: function () {
            var e = this.model.get("videoObject"),
                t = this.model.get("videoFigure"),
                i = this.model.get("videoOuterContainer");
            this.stopListening(this.model, this.model.videoEvents.KILL_VIDEO, this.onKillVideo), this.unregisterVideoEvents(), e && e.destroy(), t.off("click"), i.remove(), t.remove(), this.remove()
        },
        registerVideoEvents: function () {
            this.video && (this.video.on(h.api.events.ENDED, this.onVideoComplete), this.video.on(h.api.events.PLAY, this.onVideoPlay), this.video.on(h.api.events.PAUSE, this.onVideoPaused), this.video.on(h.api.events.AD_STARTED, this.onAdStart), this.video.on(h.api.events.AD_COMPLETED, this.onAdComplete), this.video.on(h.api.events.GO_FULLSCREEN, this.onFullscreen), this.video.on(h.api.events.EXIT_FULLSCREEN, this.onExitFullscreen), this.video.on(h.api.events.LOAD_START, this.onMediaChange))
        },
        unregisterVideoEvents: function () {
            this.video && (this.video.off(h.api.events.LOADED, this.onTemplateReady), this.video.off(h.api.events.ENDED, this.onVideoComplete), this.video.off(h.api.events.PLAY, this.onVideoPlay), this.video.off(h.api.events.PAUSE, this.onVideoPaused), this.video.off(h.api.events.AD_STARTED, this.onAdStart), this.video.off(h.api.events.AD_COMPLETED, this.onAdComplete), this.video.off(h.api.events.GO_FULLSCREEN, this.onFullscreen), this.video.off(h.api.events.EXIT_FULLSCREEN, this.onExitFullscreen), this.video.off(h.api.events.LOAD_START, this.onMediaChange))
        },
        onVideoComplete: function () {
            this.broadcast(this.model.videoEvents.VIDEO_COMPLETE, this.video), this.inactivityTimerManager && this.inactivityTimerManager.enable()
        },
        onVideoPlay: function () {
            this.model.isAdPlaying = !1, this.broadcast(this.model.videoEvents.VIDEO_PLAY, this.video), this.inactivityTimerManager && this.inactivityTimerManager.disable()
        },
        onPlayClicked: function () {
            this.broadcast(this.model.videoEvents.PLAY_CLICKED, this.video)
        },
        onVideoPaused: function () {
            this.broadcast(this.model.videoEvents.VIDEO_PAUSED, this.video), this.inactivityTimerManager && this.inactivityTimerManager.enable()
        },
        onAdStart: function () {
            this.model.isAdPlaying = !0, this.broadcast(this.model.videoEvents.AD_START, this.video), this.inactivityTimerManager && this.inactivityTimerManager.disable()
        },
        onAdComplete: function () {
            this.model.isAdPlaying = !1, this.broadcast(this.model.videoEvents.AD_COMPLETE, this.video), this.inactivityTimerManager && this.inactivityTimerManager.enable()
        },
        onFullscreen: function () {
            this.model.isVideoFullscreen = !0, this.broadcast(this.model.videoEvents.VIDEO_FULLSCREEN, this.video)
        },
        onExitFullscreen: function () {
            this.model.isVideoFullscreen = !1, this.broadcast(this.model.videoEvents.VIDEO_EXIT_FULLSCREEN, this.video)
        },
        onMediaChange: function () {
            this.broadcast(this.model.videoEvents.MEDIA_CHANGE, this.video)
        }
    });
    return u
}), define("shared/video/views/embedded-videos", ["jquery/nyt", "underscore/nyt", "backbone/nyt", "foundation/collections/base-collection", "foundation/views/base-view", "shared/video/models/video", "shared/video/views/video", "shared/mediaviewer/instances/media-viewer"], function (e, t, i, n, s, a, o, r) {
    "use strict";
    var l = s.extend({
        className: "video",
        el: e("figure.video .image"),
        videos: new n,
        events: {
            click: "embedVideo"
        },
        modalVideoModel: null,
        defaultSettings: {
            posterSelector: ".image",
            videoContainerSelector: "figure.video",
            posterPhotoCreditSelector: ".photo-credit",
            posterVideoCreditSelector: ".video-credit",
            minInlinePlayWidth: 370
        },
        initialize: function (e) {
            this.settings = t.extend({}, this.defaultSettings, e), this.subscribe("nyt:mediaviewer-open", this.onMediaViewerOpen), t.bindAll(this, "onVideoMediaViewerOpen"), this.genericVideoModel = new a, this.pageManager.isMobile() || this.subscribe(this.genericVideoModel.videoEvents.MEDIA_CHANGE, this.onMediaChange), this.pageManager.isDomReady() ? this.handlePageReady() : this.subscribeOnce("nyt:page-ready", this.handlePageReady)
        },
        handlePageReady: function () {
            this.pageManager.isDesktop() && this.checkForAutoplay(), this.checkForAutoEmbed()
        },
        checkForAutoEmbed: function () {
            var t = e("body").find("figure.video[data-position=photospot]"),
                i = this;
            t.each(function () {
                var t = e(this),
                    n = t.attr("data-videoid"),
                    s = t.data("embedded") || !1,
                    r = t.find(i.settings.posterSelector),
                    l = i.getPlayerPosition(t),
                    d = i.getPlayerType(l, r),
                    c = t.data("shareOptionsUrl") || null,
                    h = {
                        videoId: n,
                        videoFigure: t,
                        autoStart: !1,
                        width: "100%",
                        height: "100%",
                        modal: !1,
                        pagePosition: l,
                        playerType: d,
                        userInitiatedPlay: !1,
                        orphanVideo: s,
                        shareOptionsUrl: c
                    },
                    u = new a(h);
                new o({
                    model: u
                }), i.videos.add(u)
            })
        },
        checkForAutoplay: function () {
            var t, i, n, s, r, l, d = e("body").find("figure.video.lede, figure.video.blog-video").eq(0);
            d && (d.data("autoplay") === !0 || this.shouldRunABTest(d)) && (i = d.find(this.settings.posterSelector), d && i && (n = d.attr("data-videoid"), r = d.data("embedded") || !1, l = d.data("shareOptionsUrl") || null, i.width() >= this.settings.minInlinePlayWidth && n && (s = {
                videoId: n,
                videoFigure: d,
                autoStart: !0,
                width: "100%",
                height: "100%",
                modal: !1,
                pagePosition: this.genericVideoModel.playerPositions.POSITION_LEDE,
                playerType: "article-lede",
                userInitiatedPlay: !1,
                orphanVideo: r,
                shareOptionsUrl: l
            }, t = new a(s), new o({
                model: t
            }), this.videos.add(t))))
        },
        embedVideo: function (t) {
            var i, n, s, l, d, c, h, u = "100%",
                m = "100%",
                g = this.genericVideoModel.playerPositions.POSITION_EMBEDDED,
                p = !1;
            if (t && (this.$target = e(t.currentTarget), n = this.$target.closest(this.settings.videoContainerSelector), s = this.$target.closest(this.settings.posterSelector), n)) {
                if (l = n.attr("data-videoid"), c = n.data("embedded") || !1, h = n.data("shareOptionsUrl") || null, "link-to" === n.data("media-action")) return this;
                t.preventDefault(), n.hasClass("lede") ? g = this.genericVideoModel.playerPositions.POSITION_LEDE : n.hasClass("inline") ? g = this.genericVideoModel.playerPositions.POSITION_INLINE : "photospot" === n.data("position") && (g = this.genericVideoModel.playerPositions.POSITION_PHOTOSPOT), s.width() < this.settings.minInlinePlayWidth && (p = !0), l && (d = {
                    videoId: l,
                    videoFigure: n,
                    autoStart: !0,
                    width: u,
                    height: m,
                    modal: p,
                    pagePosition: g,
                    userInitiatedPlay: !0,
                    orphanVideo: c,
                    shareOptionsUrl: h
                }, g === this.genericVideoModel.playerPositions.POSITION_INLINE || p ? (d.playerType = "article-modal", this.modalVideoModel = new a(d), this.pageManager.isMobile() || this.subscribeOnce("nyt:mediaviewer-open", this.onVideoMediaViewerOpen), r.renderForVideo(this.modalVideoModel, this.onVideoMediaViewerOpen)) : (d.playerType = n.hasClass("blog-video") ? "blog" : g === this.genericVideoModel.playerPositions.POSITION_LEDE ? "article-lede" : g === this.genericVideoModel.playerPositions.POSITION_PHOTOSPOT ? "photospot" : "article-embedded", i = new a(d), n.addClass("is-playing"), new o({
                    model: i
                }), this.videos.add(i), this.pageManager.isMobile() && this.primeVideoForMobile(i), this.trackClickVideo()))
            }
            return this
        },
        getPlayerPosition: function (e) {
            var t = this.genericVideoModel.playerPositions,
                i = t.POSITION_EMBEDDED;
            return e.hasClass("lede") ? i = t.POSITION_LEDE : e.hasClass("inline") ? i = t.POSITION_INLINE : "photospot" === e.data("position") && (i = t.POSITION_PHOTOSPOT), i
        },
        getPlayerType: function (e, t) {
            var i = this.genericVideoModel.playerPositions,
                n = {};
            return n[i.POSITION_INLINE] = "article-modal", n[i.POSITION_LEDE] = "article-lede", n[i.POSITION_PHOTOSPOT] = "photospot", t && t.width() < this.settings.minInlinePlayWidth && (e = i.POSITION_INLINE), n[e] || "article-embedded"
        },
        trackClickVideo: function () {
            this.manualTrackEventTracker(), this.manualTrackWebTrends()
        },
        manualTrackEventTracker: function () {
            var e, t, i = window.NYTD || i || {};
            e = {
                contentCollection: this.pageManager.getMeta("article:section"),
                pgtype: this.pageManager.getMeta("PT"),
                region: "Body",
                module: "Video",
                version: "Embedded",
                eventName: "PlayVideo",
                action: "click",
                eventtimestamp: (new Date).getTime()
            }, t = {
                subject: "module-interactions",
                moduleData: JSON.stringify(e),
                url: window.location.href || "",
                referrer: window.referrer || ""
            }, "function" == typeof i.EventTracker && (this.tracker = new i.EventTracker, this.tracker.track(t))
        },
        manualTrackWebTrends: function () {
            var e = ["DCS.dcssip", "www.nytimes.com", "DCS.dcsuri", "/Video-Click-to-Play", "WT.ti", "Video Click to Play", "WT.z_dcsm", 1, "DCSext.module", "Video", "DCSext.version", "Embedded", "DCSext.action", "click", "DCSext.contentCollection", this.pageManager.getMeta("article:section"), "DCSext.region", "Body", "DCSext.eventName", "PlayVideo", "DCSext.pgtype", this.pageManager.getMeta("PT")];
            "function" == typeof window.dcsMultiTrack && window.dcsMultiTrack.apply(this, e)
        },
        primeVideoForMobile: function (e) {
            var t = e.get("videoObject");
            t && "html5" === t.getType() && null !== t.element && (t.element[0].play(), t.element[0].pause())
        },
        onVideoMediaViewerOpen: function () {
            var t = e("figure.media-viewer-video");
            t && this.modalVideoModel && (this.subscribeOnce("nyt:mediaviewer-close", this.onMediaViewerClose), this.modalVideoModel.set("videoFigure", t), new o({
                model: this.modalVideoModel
            }), this.pageManager.isMobile() && this.primeVideoForMobile(this.modalVideoModel))
        },
        onMediaViewerClose: function () {
            this.modalVideoModel && (this.modalVideoModel.kill(), this.modalVideoModel = null)
        },
        onMediaViewerOpen: function () {
            this.videos.each(function (e) {
                e && e.pause()
            })
        },
        onMediaChange: function (t) {
            var i;
            t.firstPlay || (i = e(t.container) || e(".video"), i.closest("figure").find(".caption").animate({
                opacity: 0
            }))
        },
        shouldRunABTest: function (e) {
            var t = this.isUserVariant("videoAutoPlay"),
                i = document.referrer,
                n = !i || i && -1 === i.indexOf("nytimes.com"),
                s = e && e.data("autoplay") === !1;
            return "article" === this.pageManager.getApplicationName() && s && n && "1" === t ? !0 : !1
        }
    });
    return l
}), define("shared/video/instances/videos", ["jquery/nyt", "underscore/nyt", "shared/video/views/embedded-videos"], function (e, t, i) {
    "use strict";
    var n = function () {
        var t = e("figure.video .image");
        t.length > 0 && new i({
            el: t,
            posterSelector: ".image",
            videoContainerSelector: "figure.video"
        })
    };
    e(document).ready(function () {
        t.defer(n)
    })
}), define("shared/interactive/views/app-communicator", ["underscore/nyt", "foundation/views/base-view"], function (e, t) {
    "use strict";
    var i = t.extend({
        triggeredResize: !1,
        autoTriggerDelay: 1500,
        initialize: function () {
            e.bindAll(this, "autoTriggerResize"), setTimeout(this.autoTriggerResize, this.autoTriggerDelay)
        },
        triggerResize: function () {
            this.triggeredResize = !0, window.parent && window.parent.$ && window.parent.$("body").trigger("resizedcontent", [window]), "true" === this.pageManager.getUrlParam("nytapp") && (window.location = "nytinteractive://resizedcontent?height=" + this.pageManager.$html.outerHeight())
        },
        autoTriggerResize: function () {
            this.triggeredResize || this.triggerResize()
        }
    });
    return i
}), define("shared/interactive/instances/app-communicator", ["shared/interactive/views/app-communicator"], function (e) {
    "use strict";
    return new e
}), define("interactive/instances/has-cover-media", ["jquery/nyt", "foundation/views/page-manager"], function (e, t) {
    "use strict";
    var i = e(".masthead");
    i.length && (i.hasClass("masthead-theme-transparent-ffffff") || i.hasClass("masthead-theme-transparent")) && t.$html.addClass("has-cover-media")
}), require(["interactive/instances/ad-manager", "shared/masthead/instances/masthead", "shared/searchform/instances/search-form", "shared/account/instances/account", "shared/navigation/instances/navigation", "shared/mediaviewer/instances/media-viewer", "interactive/instances/sharetools", "shared/ribbon/instances/ribbon", "interactive/instances/related-coverage", "interactive/instances/community", "interactive/instances/whats-next", "shared/masthead/instances/masthead-api", "shared/messaging/instances/messaging", "shared/page/tech-jobs", "shared/video/instances/videos", "shared/interactive/instances/app-communicator", "interactive/instances/has-cover-media"]);
//# sourceMappingURL=main.js
//# sourceMappingURL=main.js.map