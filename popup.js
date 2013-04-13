addEventListener("load", function() {
	document.getElementById("rules").value = localStorage.getItem("rules");
	document.getElementById("save").addEventListener("click", function() {
		localStorage.setItem("rules", document.getElementById("rules").value);
	})
});
