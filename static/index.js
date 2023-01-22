const form = document.querySelector('form')
form.addEventListener('submit', event => {

  event.preventDefault()
})

function sendMessage(form){
    
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
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });

}

const data = { username: 'example' };





function run_intro(containerId) {
    let box = document.getElementById(containerId);

    function wait(ms) {
        if (ms === 0){
            let variance = 200;
            ms = 150 + (Math.floor(Math.random() * variance))-(variance/2);
        } 
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    async function typeAt(index, text) {
        removeCursor();
        for (let char of text) {
            box.innerHTML = box.innerHTML.slice(0, index) + char + box.innerHTML.slice(index);
            index += 1;
            await wait(0);
        }
        placeCursor(index);
        return index;
    }
    
    async function deleteAt(index, n) {
        removeCursor()
        
        while (n > 0) {
            box.innerHTML = box.innerHTML.slice(0,index-1) + box.innerHTML.slice(index);      
            index -= 1;
            n -= 1;
            await wait(0);
        }
        placeCursor(index);
        return index;
    }
    
    function placeCursor(pos) {
        box.innerHTML = box.innerHTML.slice(0,pos) + '<span id="cursorwrap"><span id="cursor"></span></span>' + box.innerHTML.slice(pos);
        return pos;
    }
    
    function removeCursor() {
        document.getElementById("cursorwrap").remove();
    }
    
    async function pause(time, cursor) {
        await wait(time);
        return cursor;
    }
    
    function wrapInTag(startPos, endPos, tagOpen, tagClose){
        box.innerHTML = box.innerHTML.slice(0,startPos) + tagOpen + box.innerHTML.slice(startPos, endPos) + tagClose + box.innerHTML.slice(endPos);
        return endPos + tagOpen.length + tagClose.length;
    }
    



    box.innerText = "";
    placeCursor(0);
    typeAt(0, 'I like to build things.')
    .then((cursor) => pause(3000, cursor))
    .then( (cursor) => deleteAt(cursor-8,5))
    .then((cursor) => pause(1000, cursor))
    .then((cursor) => {
        return typeAt(cursor, "learn");
    }).then((cursor) => pause(3000, cursor))
    .then((cursor) => {
        return deleteAt(cursor, 5);
    }).then((cursor) => pause(1000, cursor))
    .then((cursor) => {
        return typeAt(cursor, "improve");
    }).then((cursor) => pause(3000, cursor))
    .then((cursor) => deleteAt(cursor, 7))
    .then((cursor) => typeAt(cursor, "{passion}"))
    .then((cursor) => {
        wrapInTag(cursor-9,cursor,"<i>","</i>");
    }).then(cursor => {
        box.innerHTML = "</br>&emsp; &emsp;" + box.innerHTML;
        return typeAt(0, "let") 
    }).then(cursor =>  wrapInTag(cursor-3,cursor,'<span class="keyword">','</span>'))
    .then(cursor => typeAt(cursor, " my_life"))
    .then(cursor => wrapInTag(cursor-7,cursor,'<b>','</b>'))
    .then(cursor => typeAt(cursor," = ['build'"))
    .then(cursor => wrapInTag(cursor-7, cursor, '<span class="stringlit">', '</span>'))
    .then(cursor => typeAt(cursor,", 'learn'"))
    .then(cursor => wrapInTag(cursor-7, cursor, '<span class="stringlit">', '</span>'))
    .then(cursor => typeAt(cursor,", 'code'"))
    .then(cursor => wrapInTag(cursor-6, cursor, '<span class="stringlit">', '</span>'))
    .then(cursor => typeAt(cursor,", 'improve'"))
    .then(cursor => wrapInTag(cursor-9, cursor, '<span class="stringlit">', '</span>'))
    .then(cursor => typeAt(cursor,"];"))   
    .then(cursor => {
        box.innerHTML = box.innerHTML.slice(0,cursor) + "</br></br>" + box.innerHTML.slice(cursor);
        return cursor+8;
    }).then(cursor => typeAt(cursor, "for"))
    .then(cursor =>  wrapInTag(cursor-3,cursor,'<span class="keyword">','</span>'))
    .then(cursor => typeAt(cursor, " passion"))
    .then(cursor => wrapInTag(cursor-7,cursor,'<b>','</b>'))
    .then(cursor => typeAt(cursor, " in"))
    .then(cursor =>  wrapInTag(cursor-2,cursor,'<span class="keyword">','</span>'))
    .then(cursor => typeAt(cursor, " my_life"))
    .then(cursor => wrapInTag(cursor-7,cursor,'<b>','</b>'))
    .then(cursor => typeAt(cursor, " {"))
    .then(cursor => typeAt(cursor+7, "println!('"))
    .then(cursor => typeAt(cursor+34, "'"))
    .then(cursor => wrapInTag(cursor-36, cursor, '<span class="stringlit">', '</span>'))
    .then(cursor => typeAt(cursor,");"))
    .then(cursor => box.innerHTML = box.innerHTML + '</br>}')    
}