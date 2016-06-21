function ajax_get(url, callback) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            console.log('responseText:' + xmlhttp.responseText);
            try {
                var data = JSON.parse(xmlhttp.responseText);
            } catch(err) {
                console.log(err.message + " in " + xmlhttp.responseText);
                return;
            }
            callback(data);
        }
    };

    xmlhttp.open('GET','http://localhost:3000/docs.svc/' + url,true);
    xmlhttp.send();
    var elem1 = document.querySelector('.wraper');
    elem1.style.background = '#DBFAF9';
    elem1.style.width = '1000px';
    elem1.style.color = '#706B0C';
    var elem2 = document.querySelector('.title');
    elem2.style.color = '#706B0C';
    var elem3 = document.querySelector('.table');
    elem3.style.background = '#BEDEDC';
    elem3.style.width = '100%';
    var elem4 = document.querySelector('.btn-doc');
    elem4.style.background = '#eee';
    elem4.style.color = '#088';
    elem4.style.width = '110px';
    var elem5 = document.querySelector('.btn-save');
    elem5.style.background = '#eee';
    elem5.style.color = '#088';
    elem5.style.width = '110px';
    var elem6 = document.querySelector('.btn-par');
    elem6.style.background = '#eee';
    elem6.style.color = '#088';
    elem6.style.width = '110px';

}
ajax_get('getDocuments', getDocuments);

function getDocuments(data) {
    var html = "";
    var ht = "";

    var nn = data["documents"].length;
    for (var i=0; i < data["documents"].length; i++) {
        var id = i;
        ht  += '<div style="visibility:hidden; position:absolute; padding-left:50px;" id = '+id+'>';
        html += '<ul style = "list-style: none; padding-left: 10px; " class="docs-list">' +'<a href=#'+id+' onclick="showHide('+id+','+nn+')">'+ data["documents"][i]["name"] +'</a>';
        for (var l=0; l < data["documents"][i]["fragments"].length; l++) {
            html += '<li style="padding-left: 20px;">';
            html += data["documents"][i]["fragments"][l]["name"];
            html += "</li>";
            ht += '<h4 style="background: #BEDEDC; width: 700px;">'+ data["documents"][i]["fragments"][l]["name"] + '</h4>';
            ht += '<p style="width: 700px;">'+ data["documents"][i]["fragments"][l]["content"] + '</p>';
        }
        html +='</ul>';
        ht += '</div>';
    }
    document.getElementById("text1").innerHTML = ht;
    document.getElementById("docs").innerHTML = html;

}
function hide(other_id) {
    document.getElementById(other_id).style.visibility='hidden';
}
function visib(element_id) {
    document.getElementById(element_id).style.visibility='visible';
}

function showHide(element_id, col) {
    visib(element_id);
    for(var k=0; k<col && k!==element_id; k++){
        hide(k);
    }
    for(var f=col-1; f>0 && f!==element_id; f--){
        hide(f);
    }
}
var newDocument = function(name, nameFr, content) {
    var documentCreating = {};
    if (!documentCreating.hasOwnProperty('name')) {
        documentCreating.name = name;
        if (documentCreating.hasOwnProperty('fragments')) {
            documentCreating.fragments.push({'name': nameFr, 'content': content});
        } else {
            documentCreating.fragments = [];
            documentCreating.fragments.name = nameFr;
            documentCreating.fragments.content = content;
        }
    }
    return documentCreating;
};
function forSave(data){
    var request = new XMLHttpRequest();
    request.open('POST','http://localhost:3000/docs.svc/saveDocument',true);
    request.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=ISO-8859-1');
    request.send('document='+JSON.stringify(data));
}
function createObj(){
    var nameDoc = document.querySelector('.docName').innerHTML;
    var obj = newDocument(nameDoc);
    var il,ilC;
    il=document.getElementById('new-par-name').getElementsByTagName('li');
    ilC=document.getElementById('new-content-name').getElementsByTagName('div');
    for(var o=0;o<il.length;o++)
    {
        obj.fragments.push({'name':il[o].innerHTML, 'content':ilC[o].innerHTML});
    }

    return obj;
}
function save(){
    forSave(createObj());
    ajax_get('getDocuments', getDocuments);
    document.querySelector('.btn-doc').disabled = false;
    document.querySelector('.btn-par').disabled = true;
    document.querySelector('.btn-save').disabled = true;
    document.querySelector('.newDocName').innerHTML = '';
    document.querySelector('.newDocPar').innerHTML = '';
    document.querySelector('.newDocContent').innerHTML = '';
}

function createMessage(title, body) {
    var container = document.createElement('div');
    container.innerHTML = '<div style="padding: 15px; width: 300px; height: 100px; border: solid 1px black; background:#ACC07E;"> \
    <div class="my-message-title">'+title+'</div> \
	<hr>\
    <p class="my-message-body">'+body+'</p> \
	<input class="article" type="text"/> \
    <input class="my-message-ok" type="button" value="Create"/> \
	<input class="my-message-ok" type="button" value="Clear"/> \
	</div>';

    return container.firstChild;
}
function addCloseOnClick(messageElem) {
    var input = messageElem.getElementsByTagName('INPUT')[2];
    input.onclick = function() {
        messageElem.parentNode.removeChild(messageElem);
    }
}
function addCreateOnClick(messageElem) {
    var input = messageElem.getElementsByTagName('INPUT')[1];
    input.onclick = function() {
        var articleLi = document.getElementById('new-doc-name');
        var ul = document.createElement('div');
        ul.classList.add('docName');
        var articleDiv = document.querySelector("input.article");
        ul.innerHTML = articleDiv.value;
        articleLi.appendChild(ul);
        document.querySelector('.btn-par').disabled = false;
        document.querySelector('.btn-doc').disabled = true;
        messageElem.parentNode.removeChild(messageElem);
    }
}
function positionMessage(elem) {
    elem.style.position = 'absolute';
    var scroll = document.documentElement.scrollTop || document.body.scrollTop;
    elem.style.top = scroll + 200 + 'px';
    elem.style.left = Math.floor(document.body.clientWidth/2) - 150 + 'px';
}
function setupMessageButton(title, body) {
    var messageElem = createMessage(title, body);
    positionMessage(messageElem);
    addCloseOnClick(messageElem);
    addCreateOnClick(messageElem);
    document.body.appendChild(messageElem);
}

function createParagraf(titleP, bodyP, cont) {
    var containerP = document.createElement('div');
    containerP.innerHTML = '<div style="padding: 15px; width: 300px; height: 200px; border: solid 1px black; background:#ACC07E; "> \
    <div>'+titleP+'</div> \
	<hr>\
    <p>'+bodyP+'</p> \
	<input class="my-message-body" type="text"/> \
	<p>'+cont+'</p> \
	<input class="my-message-text" type="text"/> \
    <input class="my-message-create" type="button" value="Create"/> \
	<input class="my-message-clear" type="button" value="Clear"/> \
	</div>';
    return containerP.firstChild;
}
function addCloseOnClickP(paragrafElem) {
    var input = paragrafElem.getElementsByTagName('INPUT')[3];
    input.onclick = function() {
        paragrafElem.parentNode.removeChild(paragrafElem);
    }
}

function addCreateOnClickP(paragrafElem) {
    var input = paragrafElem.getElementsByTagName('INPUT')[2];
    input.onclick = function() {
        var listP = document.getElementById('new-par-name');
        var liP = document.createElement('li');
        var articleDivP = document.querySelector("input.my-message-body");
        liP.innerHTML = articleDivP.value;
        listP.appendChild(liP);

        var listT = document.getElementById('new-content-name');
        var liT = document.createElement('div');
        var articleDivT = document.querySelector("input.my-message-text");
        liT.innerHTML = articleDivT.value;
        listT.appendChild(liT);
        document.querySelector('.btn-save').disabled = false;
        paragrafElem.parentNode.removeChild(paragrafElem);
    }
}

function setupParagrafButton(titleP, bodyP, cont) {
    var paragrafElem = createParagraf(titleP, bodyP, cont);
    positionMessage(paragrafElem);
    addCloseOnClickP(paragrafElem);
    addCreateOnClickP(paragrafElem);
    document.body.appendChild(paragrafElem);
}