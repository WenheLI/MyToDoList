let thisSticker = null;
let username = '';

function jump(content) {
    //console.log(typeof content);
    $('#refreshModal').modal('toggle');
    $('#note-change').val(content.innerText);
    thisSticker = content;
}

function addSticker(text) {
    console.log(username);
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

    if (text) {
        detail.innerText = text;
    } else {
        $('#addModal').modal('toggle');
        let textArea = $('#note-input');
        let text = textArea.val();
        detail.innerText = text;
        textArea.val('');


        let send = {"name": username['name'],
                    "message": text};

        $.ajax({
            url: "/add",
            type: "POST",
            data: send,
            success: (dataRec) => {
                dataRec = JSON.parse(dataRec);
                console.log(dataRec.message);
                if (dataRec["status"] === 1) {
                    console.log('store!!')
                }

            }
        });
    }



    stick.append(detail);
    stick.append(mark);
    board.append(stick);





}

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
        let parent = document.getElementById('show-board');
        parent.removeChild(thisSticker);

        $('#refreshModal').modal('toggle');
        let send = {"name": username['name'],
                    "message": thisSticker.firstChild.innerText};
        thisSticker = null;
        $.ajax({
            url: "/delete",
            type: "POST",
            data: send,
            success: (dataRec) => {
                dataRec = JSON.parse(dataRec);
                console.log(dataRec.message);
                if (dataRec["status"] === 1) {
                    console.log('delete!!')
                }

            }
        });


    }
}

function markSticker() {
    if (thisSticker) {
        let icon =thisSticker.lastChild;
        icon.className = 'glyphicon glyphicon-ok';
        thisSticker = null;
        $('#refreshModal').modal('toggle');
    }
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


function login() {
    username = $('#username').val();
    // var socket = new WebSocket("ws://" + window.location.host + "/login");
    // socket.onopen = () => {
    //     console.log('loading');
    //     socket.send(username);
    // };
    // socket.onmessage = (e) => {
    //     console.log(e.data)
    // }
    username = {'name': username};
    $('#loginModal').modal('toggle');
    $.ajax({
        url: "/login",
        type: "POST",
        data: username,
        success: (data) => {
            data = JSON.parse(data);
            if (data["status"] === 1) {
                for(let i = 0; i < data.message.length; i++){
                    addSticker(data.message[i]);
                }
            }

        }
    })
}