function addSticker() {
    let board = $('#show-board');
    let stick = document.createElement('li');
    let detail = document.createElement('span');
    let mark = document.createElement('span');


    stick.setAttribute("class", "sticky");
    stick.setAttribute("onclick", "jump(this)");
    mark.setAttribute("class", "glyphicon glyphicon-remove");
    mark.style.top = "6em";
    mark.style.left = "7em";
    mark.style.float = "bottom";


    let textArea = $('#note-input');
    let text = textArea.val();
    detail.innerText = text;

    stick.append(detail);
    stick.append(mark);
    board.append(stick);
    textArea.val('');


    $('#addModal').modal('toggle');

}
let thisSticker = null;
function refreshSticker() {
    //console.log(thisSticker);
    if (thisSticker) {
        //console.log(thisSticker.firstChild);
        let newText = $('#note-change').val();

        thisSticker.firstChild.innerText = newText;
        thisSticker = null;
        $('#refreshModal').modal('toggle');
    }

}

function deleteSticker() {
    //console.log(thisSticker);
    if (thisSticker) {
        var parent = document.getElementById('show-board');
        parent.removeChild(thisSticker);
        thisSticker = null;
        $('#refreshModal').modal('toggle');
    }
}

function markSticker() {
    if (thisSticker) {
        var icon =thisSticker.lastChild;
        icon.className = 'glyphicon glyphicon-ok';
        thisSticker = null;
        $('#refreshModal').modal('toggle');
    }
}

function jump(content) {
    //console.log(typeof content);
    $('#refreshModal').modal('toggle');
    $('#note-change').val(content.innerText);
    thisSticker = content;
}

function listAll() {
    let all = $('.sticky');
    let listBoard = $('.list-group');
    for (let i = 0; i < all.length; i++) {
        let list = document.createElement('li');
        let badge = document.createElement('span');

        list.setAttribute("class", "list-group-item");
        list.innerText = all[i].innerText;
        badge.setAttribute("class", "badge");

        if (all[i].lastChild.className === 'glyphicon glyphicon-remove') {
            badge.innerText = 'Unfinished'
        } else {
            badge.innerText = 'Finished'
        }
        list.append(badge);

        listBoard.append(list);

    }
    $('br').remove();

    $('#listModal').on('hide.bs.modal', () => {
        let uls = $('ul');
        for (let i = 0; i < uls.length; i++){
           if (uls[i].className === 'list-group') {
               uls[i].innerHTML = '';
               break;
           }
        }
    })
}