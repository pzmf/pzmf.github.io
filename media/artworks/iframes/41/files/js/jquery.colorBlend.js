/*
*   jQuery Plugin colorBlend v4.0.3
*   Requires jQuery 1.3+ 
*   Copyright (c) 2007-2011 Aaron E. [jquery at happinessinmycheeks dot com] 
*   Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
*
*	@param: Object Array. Arguments need to be in object notation.
*	Returns: jQuery.
*
*	Options:	
*		param:			What css color option you wish to blend. 
*						Such as "background-color", "color", "border-left-color", "scrollbar-face-color" etc.
*						"All" works when calling an action.
*						(default: "background-color").
*		fps:			Frames per second (default: 60).
*		duration:		How long you want the animation to take in miliseconds. (default: 1000)
*		cycles:			How many times you want the object to blend. -1 = Infinite. (default: -1).
*		random:			Will transition from a random color to a random color. (default: false).
*						Note: Will change strobe to false.
*		strobe:			Will blend from the original color and back to the original color. (default: true).
*						Note: Cannot set to true if random is set to true.
*		colorList:		Now accepts an array of color strings! colorList can accept 3 or 6 digit hex colors, rgb and color names (#000000, #000, (255, 120, 00), "aliceblue"). 
*						Note: Also accepts "current", "random", "opposite", "transparent" (will attempt to match parent color), "parent".
*		alpha:			Opacity of element! accepts numerical array. (Default: [100, 100]). 
*						Note: Only works on "Opacity" param.
*		classList:		Accepts class strings, nust match exactly what's in style tag or css document. AND the Blend attribute must exists on style/link element.
*		isQueue:		Will queue up color aniimations for a paramater. 
*		action:			Allows pausing, stopping, resume, reversing and resetting the current param.
*						Note: If "all" is specified as param the action will take place on all blended params of the object.
*		preCallBack:	function to be called right before it animates an object. (Wont get called if object is resuming a pause)
*		postCallBack:	function to be called right after animation stops.
*		cycleCallBack:	function that gets called after a cycle and before the next (Will get called every time it cycles!);
*		apexCallBack:	function to be called right when animation reaches 100% or 0% (if strobing).
*		onQueueCallBack:function that gets called when a queue item is added;
*
*	Examples: 
*		$("body").colorBlend([{colorList:["black", "white"], param:"color"}]);
*		var myColors = [
*			{param:'color', colorList: ["white", "black"]},
*			{param:'opacity', alpha: [20,75]},
*			{param:'border-left-color', colorList: ["random", "black"]},
*			{param:'border-top-color', colorList: ["white", "black", "pink"]},
*			{param:'border-bottom-color', colorList: ["white", "tomato", "lime"]}
*		];
*		$("tr").colorBlend(myColors);
*		$("div").colorBlend("background-color", ["green", "blue", "red"], 5000);
*		$("span").colorBlend("color", "#ff9900, blue, #f3a, aliceblue");
*		$("p").colorBlend("opacity", [10, 30, 5, 90, 50], 15000);
*		$("input").colorBlend("background-color", "random", true);
*		$("div").colorBlend("pause", "backround-color");
*
*	colorPercent
*	Returns: hex color
*	Options: 
*		[]:			An array of colors.
*		percent:	A decimal number less than or equal to one and greater than or equal to zero.
*	Examples:
*		$.colorPercent(["blue", "green", "black", "#ff0000", [22, 142, 230], "#f90"], .86);
*		Returns: #5b91a1
*
*		var colors = ["aliceblue", "#00ff00", "#336699"];
*		$.colorPercent(colors, .43);
*		Returns: #21fe23;
*	
*	Release fixes:
*		3.0.0:
*			Another round of overhaul of code, made huge changes.
*		3.0.1:
*			Noticed siblings weren't getting the same treatment. fixed.
*		3.0.2:
*			Mathmatical logistics error in opacity, fixed.
*			Speed tweaks.
*		3.0.3:
*			Fixed a bug with strobe and color transitions. Dumb mistake on my part, didn't catch in initial testing.
*			Updated documentation.
*		3.0.4:
*			Fixed another bug in opacity.
*		3.0.5:
*			Refactored code using simple(r) math.
*			Made it simpler to call colorBlend, no longer needs a semi complex object.
*			Added colorPercent to base jQuery, takes in an array of colors and a percentage, will return blended color based on percent.
*		4.0.0:
*			Made some interface changes. Now can be called in a simpler manner and can take argument pairs, such as 
*			$("body").colorBlend("background-color", "random", "true", "fps", 35, "cycles", 4). 
*			First argument is the parameter you want to use and the following argument is the value.
*			Now accepts Classes and will traverse style tags and css documents with the Blend attribute.
*			<link rel="Stylesheet" href="style.css" Blend="true" /> and <style type="text/css" Blend="true">
*			The following functions will pre-load html/css with the Blend attribute. Recommended use on small files/sections only.
*			$.colorBlendStyleLoad() will load Html Style Tags.
*			$.colorBlendCssLoad() will load Css pages.
*			$.colorBlendLoad() will load html and css.
*			$("div").colorBlend([{ classList: [".class1",".class2"], duration: 2000, fps: 90, cycles: 1 }]);
*			Added more callBack locations: onQueueCallBack and apexCallBack. onQueueCallBack gets called when a parameter isQueue is true and something is queued. 
*			apexCallBack is called at the lowest position and highest position on strobe, and on high position when strobe is false.
*			$("div").colorBlend("background-color", ["lime", "white"], 2000);
*		4.0.1:
*			Bug fixes: When calling random in comma delimited string color list, it was being ignored.
*			Bug fixes: When calling action short cuts, if background-color wasn't used it would assign it.
*		4.0.2:
*			Ran code through jsLint for optimization. http://www.jslint.com/
*		4.0.3:
*			Noticed dumb mistake. class list shortcuts should work now.
*			To help performance I no longer animate any colors that aren't visible.
*/

(function (jQuery) {
	var actionWords = ["play", "start", "stop", "pause", "resume", "reverse", "reset"], cmdParse = ["param", "colorlist", "action", "alpha", "fps", "duration", "random", "strobe", "cycles", "queue", "classlist", "precallback", "postcallback", "cyclecallback", "apexcallback", "onqueuecallback"], cb = [], htmlStyle = [], cssExtract = [], colors = {
		aliceblue: "F0F8FF", antiquewhite: "FAEBD7", aqua: "00FFFF", aquamarine: "7FFFD4",
		azure: "F0FFFF", beige: "F5F5DC", bisque: "FFE4C4", black: "000000",
		blanchedalmond: "FFEBCD", blue: "0000FF", blueviolet: "8A2BE2", brown: "A52A2A",
		burlywood: "DEB887", cadetblue: "5F9EA0", chartreuse: "7FFF00", chocolate: "D2691E",
		coral: "FF7F50", cornflowerblue: "6495ED", cornsilk: "FFF8DC", crimson: "DC143C",
		cyan: "00FFFF", darkblue: "00008B", darkcyan: "008B8B", darkgoldenrod: "B8860B",
		darkgray: "A9A9A9", darkgreen: "006400", darkkhaki: "BDB76B", darkmagenta: "8B008B",
		darkolivegreen: "556B2F", darkorange: "FF8C00", darkorchid: "9932CC", darkred: "8B0000",
		darksalmon: "E9967A", darkseagreen: "8FBC8F", darkslateblue: "483D8B", darkslategray: "2F4F4F",
		darkturquoise: "00CED1", darkviolet: "9400D3", deeppink: "FF1493", deepskyblue: "00BFFF",
		dimgray: "696969", dodgerblue: "1E90FF", firebrick: "B22222", floralwhite: "FFFAF0",
		forestgreen: "228B22", fuchsia: "FF00FF", gainsboro: "DCDCDC", ghostwhite: "F8F8FF",
		gold: "FFD700", goldenrod: "DAA520", gray: "808080", grey: "808080", green: "008000",
		greenyellow: "ADFF2F", honeydew: "F0FFF0", hotpink: "FF69B4", indianred: "CD5C5C",
		indigo: "4B0082", ivory: "FFFFF0", khaki: "F0E68C", lavender: "E6E6FA",
		lavenderblush: "FFF0F5", lawngreen: "7CFC00", lemonchiffon: "FFFACD", lightblue: "ADD8E6",
		lightcoral: "F08080", lightcyan: "E0FFFF", lightgoldenrodyellow: "FAFAD2", lightgreen: "90EE90",
		lightgrey: "D3D3D3", lightpink: "FFB6C1", lightsalmon: "FFA07A", lightseagreen: "20B2AA",
		lightskyblue: "87CEFA", lightslategray: "778899", lightsteelblue: "B0C4DE", lightyellow: "FFFFE0",
		lime: "00FF00", limegreen: "32CD32", linen: "FAF0E6", magenta: "FF00FF",
		maroon: "800000", mediumaquamarine: "66CDAA", mediumblue: "0000CD", mediumorchid: "BA55D3",
		mediumpurple: "9370DB", mediumseagreen: "3CB371", mediumslateblue: "7B68EE", mediumspringgreen: "00FA9A",
		mediumturquoise: "48D1CC", mediumvioletred: "C71585", midnightblue: "191970", mintcream: "F5FFFA",
		mistyrose: "FFE4E1", moccasin: "FFE4B5", navajowhite: "FFDEAD", navy: "000080",
		oldlace: "FDF5E6", olive: "808000", olivedrab: "6B8E23", orange: "FFA500",
		orangered: "FF4500", orchid: "DA70D6", palegoldenrod: "EEE8AA", palegreen: "98FB98",
		paleturquoise: "AFEEEE", palevioletred: "DB7093", papayawhip: "FFEFD5", peachpuff: "FFDAB9",
		peru: "CD853F", pink: "FFC0CB", plum: "DDA0DD", powderblue: "B0E0E6",
		purple: "800080", red: "FF0000", rosybrown: "BC8F8F", royalblue: "4169E1",
		saddlebrown: "8B4513", salmon: "FA8072", sandybrown: "F4A460", seagreen: "2E8B57",
		seashell: "FFF5EE", sienna: "A0522D", silver: "C0C0C0", skyblue: "87CEEB",
		slateblue: "6A5ACD", slategray: "708090", snow: "FFFAFA", springgreen: "00FF7F",
		steelblue: "4682B4", tan: "D2B48C", teal: "008080", thistle: "D8BFD8",
		tomato: "FF6347", turquoise: "40E0D0", violet: "EE82EE", wheat: "F5DEB3",
		white: "FFFFFF", whitesmoke: "F5F5F5", yellow: "FFFF00", yellowgreen: "9ACD32"
	};

	function RandomRange(lowVal, highVal) {
		return Math.floor(Math.random() * (highVal - lowVal + 1)) + lowVal;
	}

	function RandomColor() {
		var res = [], cm, i = 0;
		for (i = 0; i < 3; i++) {
			cm = RandomRange(0, 255).toString(16);
			res[res.length] = (cm.length === 1 ? '0' + cm : cm);
		}
		return "#" + res.join('');
	}

	function IsArray(obj) {
		return obj.constructor === Array;
	}

	function udf(val) {
		return typeof (val) === 'undefined' ? true : val === null ? true : false;
	}

	function SetCbID() {
		var res = [], i = 0;
		for (i = 0; i < 7; i++) {
			res.push(RandomRange(0, 15).toString(16));
		}
		return res.join('');
	}

	jQuery.extend(jQuery.expr[':'], {
		blendingParam: function (element, index, matches, set) {
			var param = matches[3], jObj = jQuery(element), cbObj = cb[element.uniqueID];
			return (jObj.is(":hasBlend('" + param + "')") && cbObj[param].internals.animating);
		},
		blendableParam: function (element, index, matches, set) {
			var param = matches[3], jObj = jQuery(element), cbObj = cb[element.uniqueID];
			return jObj.is(":blendingParam('" + param + "')") ? (cbObj[param].isQueue && cbObj[param].cycles > -1) : true;
		},
		paramMyBlend: function (element, index, matches, set) {
			var mVals = matches[3].split(","), jObj = jQuery(element), blendId = mVals[0], param = mVals[1], cbObj = cb[element.uniqueID];
			return (jObj.is(":hasBlend('" + param + "')") && cbObj[param].blendId === blendId);
		},
		hasBlend: function (element, index, matches, set) {
			var param = matches[3], cbObj = cb[element.uniqueID];
			return !udf(cbObj) && !udf(cbObj[param]);
		},
		blending: function (element, index, matches, set) {
			var cbObj = cb[element.uniqueID], param;
			if (!udf(cbObj)) {
				for (param in cbObj) {
					if (!udf(cbObj[param]) && !cbObj[param].internals.animating) { continue; }
					return true;
				}
			}
			return false;
		},
		uniqueIDAssigned: function (element, index, matches, set) {
			var uId = element.uniqueID;
			if (udf(uId)) {
				var obj = {};
				obj.uniqueID = SetCbID();
				jQuery.extend(element, obj);
			}
			return true;
		}
	});

	function ColorDecToHex(r, g, b) {
		return '#' + (1 << 24 | (r << 16) | (g << 8) | (b << 0)).toString(16).substring(1);
	}

	function ColorHexToDec(value) {
		var res = [], i = 0;
		if (udf(value)) {
			return "0, 0, 0";
		}

		value = value.split("#").join('');

		for (i = 0; i < 3; i++) {
			res.push(parseInt(value.substr(i * 2, 2), 16));
		}
		return res.join(', ');
	}

	// Color Conversion functions from highlightFade
	// By Blair Mitchelmore
	// http://jquery.offput.ca/highlightFade/
	// Parse strings looking for color tuples [255,255,255]
	function GetRGB(color) {
		var result;

		// Check if we're already dealing with an array of colors
		if (color && color.constructor === Array && color.length === 3) {
			return color;
		}
		// Look for rgb(num,num,num)
		if (result = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(color)) {
			return [parseInt(result[1], 10), parseInt(result[2], 10), parseInt(result[3], 10)];
		}
		// Look for rgb(num%,num%,num%)
		if (result = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(color)) {
			return [parseFloat(result[1]) * 2.55, parseFloat(result[2]) * 2.55, parseFloat(result[3]) * 2.55];
		}
		// Look for #a0b1c2
		if (result = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(color)) {
			return [parseInt(result[1].toString(), 16), parseInt(result[2].toString(), 16), parseInt(result[3].toString(), 16)];
		}
		// Look for #fff
		if (result = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(color)) {
			return [parseInt(result[1] + result[1], 16), parseInt(result[2] + result[2], 16), parseInt(result[3] + result[3], 16)];
		}
		// Otherwise, we're most likely dealing with a named color
		return ColorHexToDec(colors[jQuery.trim(color).toLowerCase()]).split(',');

	}

	function ToHexColor(value) {
		var rgb = GetRGB(value);
		return ColorDecToHex(parseInt(rgb[0], 10), parseInt(rgb[1], 10), parseInt(rgb[2], 10));
	}

	function OppositeColor(value) {
		value = ToHexColor(value).split("#").join('').split('');
		var hexVals = "0123456789abcdef", revHexs = hexVals.split('').reverse().join(''), currentPos, i = 0;
		for (i = 0; i < value.length; i++) {
			currentPos = hexVals.indexOf(value[i]);
			value[i] = revHexs.substring(currentPos, currentPos + 1);
		}
		return "#" + value.join('');
	}

	function GetAlpha(alpha, pct) {
		var modifier = ((alpha.length - 1) * pct),
			step = Math.floor(modifier),
			highpct = (modifier - step),
			lowpct = 1 - highpct,
			fc = alpha[step],
			tc = pct === 1 ? alpha[step] : alpha[step + 1];

		return Math.min(100, Math.max(0, Math.floor(fc * (lowpct) + tc * (highpct)))) * parseFloat(".01");
	}

	function GetColor(colorList, pct) {
		var modifier = ((colorList.length - 1) * pct),
			step = Math.floor(modifier),
			highpct = (modifier - step),
			lowpct = 1 - highpct,
			rgb = [0, 0, 0],
			fc = GetRGB(colorList[step]),
			tc = pct === 1 ? GetRGB(colorList[step]) : GetRGB(colorList[step + 1]),
			i = 0;

		for (i = 0; i < 3; i++) {
			rgb[i] = Math.floor(parseInt(fc[i], 10) * (lowpct) + parseInt(tc[i], 10) * (highpct));
		}
		return ColorDecToHex(rgb[0], rgb[1], rgb[2]);
	}

	function GetPct(opts) {
		return (opts.param.toLowerCase() === "opacity") ? GetAlpha(opts.alpha, opts.internals.pct()) : GetColor(opts.colorList, opts.internals.pct());
	}

	function stripArray(arry, strng) {
		var res = strng;
		jQuery.each(arry, function (i, v) {
			res = res.split(v).join('');
		});
		return res;
	}

	//Hey, If you happen to like this code, or use a likeness of it. It would be really cool of you to give me a mention. Aaron E. [jquery at happinessinmycheeks dot com] 
	function colorObjectCss(dta) {
		var rx = /(?:([\w\-\.\s#]*)[^\}]*\})/gim, match, idex = 0, result = [];
		while (match = rx.exec(dta)) {
			var nrx = /(?:[^:;{\w]*(?:([\w\-]*color):([^;]+)(?:;|\})))/gim, className = jQuery.trim(match[1]), subMatch,
							classObj = {
								selector: className,
								blendObj: [],
								index: idex
							};
			while (subMatch = nrx.exec(match[0])) {
				var bObj = {
					param: subMatch[1].toLowerCase(),
					color: jQuery.trim(stripArray(["\"", "'"], subMatch[2]))
				};
				classObj.blendObj.push(bObj);
			}
			result.push(classObj);
			idex++;
		}
		return result;
	}

	//Hey, If you happen to like this code, or use a likeness of it. It would be really cool of you to give me a mention. Aaron E. [jquery at happinessinmycheeks dot com] 
	function ExtractHtmlStyle() {
		var result = [], styles = jQuery("style[Blend]");
		styles.each(function (i, v) {
			var cObs = colorObjectCss(jQuery(this).html());
			jQuery.each(cObs, function (j, w) {
				result.push(w);
			});
		});
		return result;
	}

	//Hey, If you happen to like this code, or use a likeness of it. It would be really cool of you to give me a mention. Aaron E. [jquery at happinessinmycheeks dot com] 
	function ExtractCss() {
		var links = jQuery("link[href$='.css'][Blend]"), result = [];
		links.each(function (i, v) {
			var o = jQuery(this), href = o.attr("href");
			jQuery.ajax(href, {
				dataType: "text",
				async: false,
				success: function (dta) {
					var cObs = colorObjectCss(dta);
					jQuery.each(cObs, function (j, w) {
						result.push(w);
					});
				}
			});
		});
		return result;
	}

	function CheckCssExtract() {
		if (!udf(cssExtract) && cssExtract.length <= 0) {
			cssExtract = ExtractCss();
		}
	}

	function CheckHtmlStyle() {
		if (!udf(htmlStyle) && htmlStyle.length <= 0) {
			htmlStyle = ExtractHtmlStyle();
		}
	}

	jQuery.extend({
		colorPercent: function () {
			if (IsArray(arguments[0]) && !(!arguments[1]) && !isNaN(arguments[1])) {
				return GetColor(arguments[0], arguments[1]);
			}
		},
		colorBlendStyleLoad: function () {
			CheckHtmlStyle();
		},
		colorBlendCssLoad: function () {
			CheckCssExtract();
		},
		colorBlendLoad: function () {
			CheckHtmlStyle();
			CheckCssExtract();
		}
	});

	function parseBool(val) {
		return typeof (val) === 'boolean' ? true : typeof (val) === 'string' ? val.match(/(true|false)/gi) ? true : false : false;
	}

	function boolVal(val) {
		return parseBool(val) ? typeof (val) === 'string' ? val.toLowerCase() === 'true' : val ? true : false : false;
	}

	function argumentParser(options, argys, startAt) {
		var i = startAt;
		for (i = startAt; i <= argys.length; i++) {
			if (typeof (argys[i]) === 'string') {
				if (jQuery.inArray(argys[i].toLowerCase(), cmdParse) > -1 && ((i + 1) <= argys.length && (!(!argys[i + 1]) || parseBool(argys[i + 1])))) {
					var argVal = argys[i + 1];
					switch (argys[i].toLowerCase()) {
						case "alpha":
							options[0].alpha = argVal;
							break;
						case "classlist":
							options[0].classList = argVal;
							break;
						case "colorlist":
							options[0].colorList = argVal;
							break;
						case "param":
							options[0].param = argVal;
							break;
						case "action":
							options[0].action = argVal;
							break;
						case "fps":
							options[0].fps = parseInt(argVal, 10);
							break;
						case "duration":
							options[0].duration = parseInt(argVal, 10);
							break;
						case "random":
							options[0].random = boolVal(argVal);
							break;
						case "cycles":
							options[0].cycles = parseInt(argVal, 10);
							break;
						case "strobe":
							options[0].strobe = boolVal(argVal);
							break;
						case "queue":
							options[0].isQueue = boolVal(argVal);
							break;
						case "postcallback":
							if (typeof (argVal) === 'function') {
								options[0].postCallBack = argVal;
							}
							break;
						case "precallback":
							if (typeof (argVal) === 'function') {
								options[0].preCallBack = argVal;
							}
							break;
						case "cyclecallback":
							if (typeof (argVal) === 'function') {
								options[0].cycleCallBack = argVal;
							}
							break;
						case "onqueuecallback":
							if (typeof (argVal) === 'function') {
								options[0].onQueueCallBack = argVal;
							}
							break;
						case "apexcallback":
							if (typeof (argVal) === 'function') {
								options[0].apexCallBack = argVal;
							}
							break;

					}
				}
			}
		}
		return options;
	}

	function ProcessAction(param, obj, action) {
		if (param.toLowerCase() === "all" || obj.is(":hasBlend('" + param + "')")) {
			var slkt = param.toLowerCase() === "all" ? ":blending" : ":hasBlend('" + param + "')", cPrm = null;
			obj.filter(slkt).each(function (i, w) {
				for (cPrm in cb[w.uniqueID]) {
					var v = cb[w.uniqueID][cPrm];
					if (!udf(v) && (cPrm === param || param === "all")) {
						switch (jQuery.trim(action.toLowerCase())) {
							case "pause":
							case "stop":
								v.internals.tId = clearTimeout(v.internals.tId);
								v.internals.isPOrS = true;
								if (action.toLowerCase() === "stop") {
									v.internals.animating = false;
								}
								break;
							case "reverse":
								v.internals.step = -1 * v.internals.step;
								break;
							case "reset":
								v.internals.step = 1;
								v.internals.currentCycle = v.cycles > -1 ? v.cycles : 0;
								v.internals.pos = 0;
								break;
							case "start":
							case "play":
							case "resume":
								if (v.internals.isPOrS) {
									v.internals.isPOrS = false;
									v.internals.animating = true;
									v.internals.next();
								}
								break;
						}
					}
				}
			});
		}
	}

	jQuery.fn.colorBlend = function (options) {
		if (arguments.length >= 2) {
			//Checking arguments for parameter and color list.
			if (typeof (arguments[0]) === 'string'
				&& ((typeof (arguments[1]) === 'string' && (arguments[1].indexOf(",") > -1) || IsArray(arguments[1])))) {

				var cList = IsArray(arguments[1]) ? arguments[1] : arguments[1].toString().split(",");
				options = arguments[0].toLowerCase() === 'classlist' ? [{ classList: cList}] : arguments[0].toLowerCase() === 'opacity' ? [{ param: arguments[0], alpha: cList}] : [{ param: arguments[0], colorList: cList}];

				if (!(!arguments[2])) {
					if (!isNaN(parseInt(arguments[2], 10))) {
						options[0].duration = parseInt(arguments[2], 10);
					}
					options = jQuery.extend(options, argumentParser(options, arguments, 2));
				}
			}

			if (typeof (arguments[0]) === 'string'
				&& (arguments[0].indexOf(",") === -1 || !IsArray(arguments[0]))
				&& ((typeof (arguments[1]) === 'string' && (arguments[1].indexOf(",") === -1) || !IsArray(arguments[1])))) {
				var actionPos = jQuery.inArray(arguments[0].toLowerCase(), actionWords);
				if (actionPos > -1) {
					ProcessAction(arguments[1], this, actionWords[actionPos]);
				} else {
					options = [{ param: arguments[0]}];
					options = jQuery.extend(options, argumentParser(options, arguments, 1));
				}
			}
		}

		function Dispose(opts) {
			opts.parent.filter(":paramMyBlend('" + opts.blendId + "," + opts.param + "')").each(function (i, v) {
				if (!udf(cb[v.uniqueID])) {
					var empty = true, sObj;
					cb[v.uniqueID][opts.param] = null;
					for (sObj in cb[v.uniqueID]) {
						if (udf(cb[v.uniqueID][sObj])) { continue; }
						empty = false;
					}

					if (empty) {
						cb[v.uniqueID] = null;
					}
				}
			});
		}

		function CheckStopAnimation(opts) {
			opts.apexCallBack();
			if (opts.cycles > -1 && opts.internals.pos <= 0) {
				opts.internals.currentCycle -= opts.internals.currentCycle !== 0 ? 1 : 0;
				if (opts.internals.currentCycle === 0) {
					opts.internals.tId = clearTimeout(opts.internals.tId);
					opts.cycleCallBack();
					if (IsArray(opts.queue) && opts.queue.length > 0) {
						var tmp = opts.queue.concat();
						tmp.splice(0, 1);
						opts = jQuery.extend(opts, opts.queue.shift());
						opts.queue = tmp.concat();
						opts.internals.animating = true;
						opts.onQueueCallBack();
					} else {
						opts.internals.animating = false;
						opts.internals.isPOrS = false;
						opts.postCallBack();
						Dispose(opts);
					}
				}
			}
		}

		function waitFor(opts) {
			if (opts.parent.is(":visible")) {
				opts.internals.tId = setTimeout(function () { NextStep(opts); }, opts.internals.delay);
			} else {
				opts.internals.tId = setTimeout(function () { waitFor(opts); }, opts.internals.delay);
			}
		}

		function NextStep(opts) {
			var optsy = !udf(opts) ? opts : !udf(this.opts) ? this.opts : null;
			if (optsy !== null) {
				if (optsy.internals.animating && !optsy.internals.isPOrS) {
					optsy.parent.css(optsy.param, GetPct(optsy));
					optsy.internals.pos += optsy.internals.step;

					if (optsy.internals.pos > optsy.internals.frames || optsy.internals.pos < 0) {

						if (optsy.random && optsy.param.toLowerCase() !== "opacity") {
							optsy.colorList = [optsy.colorList[optsy.colorList.length - 1], RandomColor()];
						}

						if (optsy.strobe) {
							optsy.internals.step = -1 * optsy.internals.step;
							optsy.internals.pos += optsy.internals.step;
							CheckStopAnimation(optsy);
						} else {
							if (optsy.internals.pos > optsy.internals.frames) {
								optsy.internals.pos = 0;
								CheckStopAnimation(optsy);
							}
						}
					}
					if (optsy.internals.animating && !optsy.internals.isPOrS) {
						if (optsy.parent.is(":visible") || optsy.param.toLowerCase() === "opacity") {
							optsy.internals.tId = setTimeout(function () { NextStep(optsy); }, optsy.internals.delay);
						}
						else {
							optsy.internals.tId = setTimeout(function () { waitFor(optsy, optsy.internals.delay); }, optsy.internals.delay);
						}
					}
				}
			}
		}

		function findSelector(list, selector) {
			var result = null;
			jQuery.each(list, function (i, v) {
				if (v.selector === selector) {
					result = v;
					return false;
				}
			});
			return result;
		}

		function atIndex(cbObj, chkParam) {
			var found = -1;
			jQuery.each(cbObj, function (k, x) {
				if (cbObj[k].param === chkParam) {
					found = k;
					return false;
				}
			});
			return found;
		}

		function buildFromStyle(selktorList) {
			var cbObj = [];
			jQuery.each(selktorList, function (i, v) {
				var res = findSelector(htmlStyle, v);
				if (res === null) { res = findSelector(cssExtract, v); }
				if (res != null) {
					jQuery.each(res.blendObj, function (j, w) {
						var rbo = res.blendObj[j];
						if (rbo !== null && !udf(rbo.color)) {
							var exists = atIndex(cbObj, rbo.param);
							if (exists === -1 || cbObj.length === 0) {
								cbObj.push({ param: rbo.param, colorList: [] });
								cbObj[cbObj.length - 1].colorList.push(rbo.color);
							} else {
								cbObj[exists].colorList.push(rbo.color);
							}
						}
					});
				}
			});
			return cbObj;
		}

		if (!options) { options = [{}]; }

		var defaultOpts = {
			fps: 60,
			duration: 1000,
			param: "background-color",
			cycles: -1,
			colorList: ["current", "opposite"],
			alpha: [],
			action: "",
			random: false,
			strobe: true,
			isQueue: true,
			cycleCallBack: function () { },
			preCallBack: function () { },
			postCallBack: function () { },
			apexCallBack: function () { },
			onQueueCallBack: function () { }
		}
		, internals = {
			currentCycle: 0,
			pos: 0,
			frames: 0,
			delay: 0,
			step: 1,
			tId: 0, //Timer id
			animating: false,
			isPOrS: false,
			pct: function () {
				return (this.pos / this.frames);
			},
			next: NextStep
		},
		classOpt = {
			classList: []
		},
		_paramList = [];

		function CheckParentColor(elm, param) {
			/*White is chosen as default to eliminate issues between IE and FF*/
			var pColr = "#ffffff";

			jQuery(elm).parents().each(function () {
				var result = jQuery(this).css(param);
				if (result !== 'transparent' && result !== '') {
					pColr = result;
					return false;
				}
			});

			return pColr;
		}

		function SetOptions(opts) {
			if (!opts.internals.animating) {
				if (jQuery.trim(opts.param.toLowerCase()) !== "opacity") {
					if (opts.colorList.length === 1) {
						opts.colorList.push("opposite");
					}

					if (opts.random) {
						opts.strobe = false;
						opts.colorList = [RandomColor(), RandomColor()];
					} else {
						jQuery.each(opts.colorList, function (i, v) {
							switch (jQuery.trim(v.toLowerCase())) {
								case "current":
									opts.colorList[i] = opts.parent.css(opts.param) === "transparent" ? CheckParentColor(opts.parent, opts.param) : opts.parent.css(opts.param);
									break;
								case "parent":
								case "transparent":
									opts.colorList[i] = CheckParentColor(opts.parent, opts.param);
									break;
								case "opposite":
									opts.colorList[i] = OppositeColor(ToHexColor(CheckParentColor(opts.parent, opts.param)));
									break;
								case "random":
									opts.colorList[i] = RandomColor();
									break;
							}
						});
					}
				}

				var interval = Math.floor(1000 / opts.fps), totalFrames = Math.ceil(opts.duration / interval);
				opts.internals.currentCycle = opts.cycles > -1 ? opts.cycles : 0;
				opts.internals.frames = opts.strobe ? Math.floor(totalFrames / 2) : totalFrames;
				opts.internals.delay = interval;

				return opts;
			}
		}

		function CreateCbObj(opts, uId, param) {
			if (udf(cb[uId])) {
				cb[uId] = [];
			}
			cb[uId][param] = opts;
		}

		function FinalizeObject(obj, opts) {
			var myOpts = jQuery.extend(true, {}, opts);
			myOpts.parent = jQuery(obj);
			myOpts.internals.opts = myOpts;
			return myOpts;
		}

		function Nanny(obj, opts) {
			jQuery.each(_paramList, function (i, v) {
				var sansCbObj = obj.filter(":not(:hasBlend('" + v + "'))");
				sansCbObj.each(function (j, w) {
					CreateCbObj(FinalizeObject(w, opts[v]), w.uniqueID, v);
				});

				if (sansCbObj.size() < obj.size()) {
					var blending = obj.not(sansCbObj).filter(":blendingParam('" + v + "')");
					blending.filter(":blendableParam('" + v + "')").each(function (j, w) {
						cb[w.uniqueID][v].queue.push(FinalizeObject(w, opts[v]));
					});

					obj.not(sansCbObj).not(blending).each(function (j, w) {
						CreateCbObj(FinalizeObject(w, opts[v]), w.uniqueID, v);
					});
				}
			});
		}

		function AssignDefaultOptions(opts, obj) {
			var cbOpts = [], blendId = SetCbID();
			obj.blendId = blendId;
			_paramList = [];
			jQuery.each(opts, function (i, v) {
				var newOpts = jQuery.extend({}, defaultOpts, v), actionPos = jQuery.inArray(newOpts.action.toLowerCase(), actionWords), paramName = newOpts.param.toLowerCase(), clsOpt = jQuery.extend({}, defaultOpts, classOpt, v);
				if (paramName !== "all" && clsOpt.classList.length <= 1) {
					_paramList.push(paramName);
				}

				if (actionPos > -1) {
					ProcessAction(paramName, obj, actionWords[actionPos]);
					return true;
				}

				if (paramName === "opacity") {
					newOpts.colorList = []; //Set to null?
					newOpts.random = false;
				}

				newOpts.blendId = blendId;
				newOpts.parent = obj;
				newOpts.queue = [];
				newOpts.internals = jQuery.extend({}, internals);

				if (clsOpt.classList.length > 1) {
					jQuery.colorBlendLoad();
					newOpts.classList = newOpts.colorList = [];
					var nObj = buildFromStyle(clsOpt.classList);
					jQuery.each(nObj, function (q, z) {
						if (jQuery.inArray(nObj[q].param, cbOpts) === -1) {
							_paramList.push(nObj[q].param);
							cbOpts[nObj[q].param] = SetOptions(jQuery.extend({}, newOpts, nObj[q]));
						}
					});
				} else {
					if (jQuery.inArray(paramName, cbOpts) === -1) {
						cbOpts[paramName] = SetOptions(newOpts);
					}
				}
			});

			Nanny(obj, cbOpts);
		}

		function Assemble(obj) {
			if (obj.is(":uniqueIDAssigned") && jQuery.inArray(options, actionWords) === -1) {
				AssignDefaultOptions(options, obj);

				if (!udf(obj.blendId)) {
					jQuery.each(_paramList, function (i, v) {
						obj.filter(":paramMyBlend('" + obj.blendId + "," + v + "')").each(function (j, w) {
							var cObj = cb[w.uniqueID][v];
							cObj.preCallBack();
							cObj.internals.animating = true;
							cObj.internals.next();
						});
					});
				}
			}
			return obj;
		}

		return Assemble(this);
	};

})(jQuery);
