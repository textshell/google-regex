NS = "googleregex"

regexGeneration = 1;
debug = false;

function loadRules(rulesRaw) {
	var re = [];
	var cmd = [];
	var rule = {re: [], cmd: [], debug: false}
	rules = [];
	debug = false;
	for (var i=0; i < rulesRaw.length; i++) {
		line = rulesRaw[i];
		if (line[0] === "#") continue;
		if (line[0] === "^") {
			if (rule.cmd.length) {
				rules.push(rule);
				rule = {re: [], cmd: [], debug: false}
			}
			rule.re.push(new RegExp(line, "i"));
		}
		if (line[0] === ".") {
			rule.cmd.push(line);
		} else if (line[0] === "!") {
			rule.cmd.push(line);
		}
		if (line[0] === "?") {
			rule.debug = true;
			debug = true;
		}
	}
	if (rule.cmd.length) {
		rules.push(rule);
	}
}

chrome.runtime.sendMessage({ init: true }, function(response) {
  loadRules(response);
});

function applyRule(rule, match, resultAnchor, resultWrapper) {
	for (var k=0; k < rule.cmd.length; k++) {
		var cmd = rule.cmd[k];
		if (rule.debug) console.log(cmd);
		if (cmd[0] === ".") {
			var idx = cmd.indexOf(":");
			var prop = cmd.substr(1, idx-1).trim();
			var val = cmd.substr(idx+1);
			resultWrapper.style[prop] = val;
		}
		if (cmd[0] === "!") {
			var newHref = "", tmp = cmd.substr(1);
			for (var idx=0; idx < tmp.length; idx++) {
				if (tmp[idx] != "$") {
					newHref += tmp[idx]
					continue;
				}
				if (idx+1 < tmp.length) {
					var matchNo = tmp[idx+1];
					if (matchNo < match.length) {
						newHref += match[matchNo]
						idx += 1;
					}
				} else {
					break;
				}
			}
			resultAnchor.setAttribute("href", newHref);
			resultAnchor.removeAttribute("onmousedown");
		}
	}
}

setInterval(function() {
	if (!rules) {
		if (debug) console.log("rules not yet loaded");
		return;
	}
	var all = document.querySelectorAll("h3.r > a");
	for (var i=0; i < all.length; i++) {
		var resultAnchor = all[i];
        if (resultAnchor.getAttribute("data-" + NS + "-gen") == regexGeneration) {
            continue;
        }
        resultAnchor.setAttribute("data-" + NS + "-gen", regexGeneration);
        var href = resultAnchor.getAttribute("href");
		var resultWrapper;
		if (window.location.protocol == 'https:') {
			resultWrapper = resultAnchor.parentElement.parentElement;
		} else {
			resultWrapper = resultAnchor.parentElement.parentElement.parentElement;
		}
        if (debug) console.log("looking at result: " + href);
		for (var j=0; j < rules.length; j++) {
			var rule = rules[j];
			var x = null;
			for (var k=0; k < rule.re.length; k++) {
				x = rule.re[k].exec(href);
				if (x) break;
			}
			if (x) {
				if (rule.debug) console.log("matched " + rule.re[k] + " " + x);
				applyRule(rule, x, resultAnchor, resultWrapper);
				break;
			}
		}
	}
}, 1000);
