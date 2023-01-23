document.body.onload = () => run_intro(document.getElementById("typebox"));



const form = document.querySelector('form')
form.addEventListener('submit', event => {

  event.preventDefault()
})

function sendMessage(form){
    document.getElementById("sendmessage").innerText = "Sending ...";
    let formData = new FormData(form);
    let object = {};
    formData.forEach(function(value, key){
        object[key] = value;
    });
    var msg = JSON.stringify(object);
    console.log(msg);

    fetch('msg', {
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
     },
     body: msg,
    })
     .then((response) =>  response.text())
     .then(response => messageSent(String(response)))
     .catch((error) => {
      console.error('Error:', error);
      messageSent("I am sorry, there appears to have been an error, check the console for details.");
     });

}

function messageSent(successmessage) {
    let cr = document.getElementById("contactcontainer");
    cr.innerHTML = '<div id="contactresponse"></div>';
    typeAt(26, successmessage,cr).then(cursor => placeCursor(cursor,cr));
}






function wait(ms) {
    if (ms === 0){
        let variance = 200;
        ms = 150 + (Math.floor(Math.random() * variance))-(variance/2);
    } 
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function typeAt(index, text, box) {
    removeCursor();
    for (let char of text) {
        box.innerHTML = box.innerHTML.slice(0, index) + char + box.innerHTML.slice(index);
        index += 1;
        await wait(0);
    }
    placeCursor(index, box);
    return index;
}

async function deleteAt(index, n, box) {
    removeCursor()
    
    while (n > 0) {
        box.innerHTML = box.innerHTML.slice(0,index-1) + box.innerHTML.slice(index);      
        index -= 1;
        n -= 1;
        await wait(0);
    }
    placeCursor(index, box);
    return index;
}

function placeCursor(pos, box) {
    box.innerHTML = box.innerHTML.slice(0,pos) + '<span id="cursorwrap"><span id="cursor"></span></span>' + box.innerHTML.slice(pos);
    return pos;
}

function removeCursor() {
    let cur = document.getElementById("cursorwrap");
    if (cur) { 
        cur.remove();
    }
}

async function pause(time, cursor) {
    await wait(time);
    return cursor;
}

function wrapInTag(startPos, endPos, tagOpen, tagClose, box){
    box.innerHTML = box.innerHTML.slice(0,startPos) + tagOpen + box.innerHTML.slice(startPos, endPos) + tagClose + box.innerHTML.slice(endPos);
    return endPos + tagOpen.length + tagClose.length;
}



function run_intro(container) {
    let tb = container;
    tb.innerText = "";
    placeCursor(0, tb);
    typeAt(0, 'I like to build things.', tb)
    .then((cursor) => pause(3000, cursor))
    .then( (cursor) => deleteAt(cursor-8,5, tb))
    .then((cursor) => pause(1000, cursor))
    .then((cursor) => {
        return typeAt(cursor, "learn", tb);
    }).then((cursor) => pause(3000, cursor))
    .then((cursor) => {
        return deleteAt(cursor, 5, tb);
    }).then((cursor) => pause(1000, cursor))
    .then((cursor) => {
        return typeAt(cursor, "improve", tb);
    }).then((cursor) => pause(3000, cursor))
    .then((cursor) => deleteAt(cursor, 7, tb))
    .then((cursor) => typeAt(cursor, "{passion}", tb))
    .then((cursor) => {
        wrapInTag(cursor-9,cursor,"<i>","</i>", tb);
    }).then(cursor => {
        tb.innerHTML = "</br>&emsp; &emsp;" + tb.innerHTML;
        return typeAt(0, "let", tb) 
    }).then(cursor =>  wrapInTag(cursor-3,cursor,'<span class="keyword">','</span>', tb))
    .then(cursor => typeAt(cursor, " my_life", tb))
    .then(cursor => wrapInTag(cursor-7,cursor,'<b>','</b>', tb))
    .then(cursor => typeAt(cursor," = ['build'", tb))
    .then(cursor => wrapInTag(cursor-7, cursor, '<span class="stringlit">', '</span>', tb))
    .then(cursor => typeAt(cursor,", 'learn'", tb))
    .then(cursor => wrapInTag(cursor-7, cursor, '<span class="stringlit">', '</span>', tb))
    .then(cursor => typeAt(cursor,", 'code'", tb))
    .then(cursor => wrapInTag(cursor-6, cursor, '<span class="stringlit">', '</span>', tb))
    .then(cursor => typeAt(cursor,", 'improve'", tb))
    .then(cursor => wrapInTag(cursor-9, cursor, '<span class="stringlit">', '</span>', tb))
    .then(cursor => typeAt(cursor,"];", tb))   
    .then(cursor => {
        tb.innerHTML = tb.innerHTML.slice(0,cursor) + "</br></br>" + tb.innerHTML.slice(cursor);
        return cursor+8;
    }).then(cursor => typeAt(cursor, "for", tb))
    .then(cursor =>  wrapInTag(cursor-3,cursor,'<span class="keyword">','</span>', tb))
    .then(cursor => typeAt(cursor, " passion", tb))
    .then(cursor => wrapInTag(cursor-7,cursor,'<b>','</b>', tb))
    .then(cursor => typeAt(cursor, " in", tb))
    .then(cursor =>  wrapInTag(cursor-2,cursor,'<span class="keyword">','</span>', tb))
    .then(cursor => typeAt(cursor, " my_life", tb))
    .then(cursor => wrapInTag(cursor-7,cursor,'<b>','</b>', tb))
    .then(cursor => typeAt(cursor, " {", tb))
    .then(cursor => typeAt(cursor+7, "println!('", tb))
    .then(cursor => typeAt(cursor+34, "'", tb))
    .then(cursor => wrapInTag(cursor-36, cursor, '<span class="stringlit">', '</span>', tb))
    .then(cursor => typeAt(cursor,");", tb))
    .then(cursor => { 
        tb.innerHTML = tb.innerHTML + '</br>}'
        return tb.innerHTML.length;
    
    }).then(cursor => pause(1000, cursor))
    .then(cursor => {
        tb.innerHTML = tb.innerHTML + '</br></br>I like to build things. </br>I like to learn things. </br>I like to code things. </br>I like to improve things.';
    })    
}