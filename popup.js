let trollBtn = document.getElementById('troll');
let getState = document.getElementById('getState');

chrome.storage.sync.get('trollBtn', function(data) {
  console.log(data.trollBtn);
});

trollBtn.onclick = function(element) {
  trollBtn.disabled = true;
  chrome.storage.sync.set({trollBtn:"disabled"}, () => {
    console.log("Disabled Troll Button!");
  })

  // let color = element.target.value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      {file: 'startEngine.js'});
  });
};

getState.onclick = function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {file: 'status.js'});
  });
}