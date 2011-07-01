window.addEventListener('load', function() {
    init();
});

var bgWin;

function init() {
    bgWin = chrome.extension.getBackgroundPage();
    var len = bgWin.sites.length;
    for (var i = 0; i < len; i++) {
        addSite(i, bgWin.sites[i]);
    }
    document.getElementById('addSite').addEventListener('keyup', function(e) {
        if (e.keyCode !== 13)
            return;
        addNewSite(e.target.value);
        e.target.value = '';
    }, true);
}

function addSite(id, name) {
    var li = document.createElement('li');
    li.innerHTML = name;
    li.className = 'site';
    li.id = 'site'+id;
    var closeButton = document.createElement('div');
    closeButton.className = 'closeButton';
    closeButton.addEventListener('click', function(e) {
        deleteSite(e.target.parentNode.id.substring(4));
    }, true);
    li.appendChild(closeButton);
    document.getElementById('sites').appendChild(li);
}

function addNewSite(name) {
    var sites = document.getElementsByClassName('site');
    addSite(sites.length, name);
    bgWin.sites.push(name);
    saveToStore();
}

function deleteSite(id) {
    var parent = document.getElementById('sites');
    parent.removeChild(document.getElementById('site'+id));
    bgWin.sites.splice(id, 1);
    saveToStore();
    resetSiteIds(id);
}

function resetSiteIds(id) {
    var sites = document.getElementsByClassName('site');
    var len = sites.length;
    for (var i = 0; i < len; i ++)
        sites[i].id = 'site'+i;
}

function saveToStore() {
    try {
        localStorage.sites = JSON.stringify(bgWin.sites);
    }
    catch(e) { console.log(e); }
}