(function () {
	let storage = window.storage || chrome.storage;
	let stateImage = document.getElementById("enableExtension");

	if (stateImage === null) {
		console.error("Something went wrong!");
		return;
	}
	function toggle() {
		let prom = chrome.storage.local.set({ isDisabled: !currentState });
		if (prom instanceof Promise) {
			prom.reject();
		}
		update();
	}
	stateImage.addEventListener("click", toggle)
	let stateDesc = document.getElementById("enableExtension");
	if (stateDesc === null) {
		console.error("Something went wrong!");
		return;
	}

	const hideWikiaCheck = document.querySelector("#hideWikiaCheck")
	hideWikiaCheck.addEventListener("click", (e) => {
		chrome.storage.local.set({ hideWikia: e.target.checked });
	});

	window.update = function () {
		chrome.storage.local.get(['isDisabled', 'hideWikia'], function (result) {
			if (result === undefined) {
				result = { isDisabled: false, hideWikia: true };
			}
			window.currentState = result.isDisabled === true;
			stateDesc.innerHTML = result.isDisabled ? "disabled" : "enabled";
			stateDesc.style.color = result.isDisabled ? "transparent" : "transparent";
			enableExtension.checked = result.isDisabled;
			hideWikiaCheck.checked = result.hideWikia;
		});
	}
	update();
})();