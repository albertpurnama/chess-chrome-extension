let trollBtn = document.getElementById('troll');
let getState = document.getElementById('getState');

trollBtn.onclick = function(element) {
  var borw = document.getElementById('borw').value;
  chrome.storage.sync.set({'borw':borw}, function(){
    console.log('Value is set to ' + value);
  })
  // let color = element.target.value;
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      {file: 'startEngine.js'}
    );
  });
};

getState.onclick = function() {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
        tabs[0].id,
        {file: 'status.js'});
  });
}

document.getElementById('show-instruction').addEventListener("click", ()=> {
  instructionDiv = document.getElementById('instructions-div');
  instructionDiv.style.display = "block";
});