let thisSticker = null;
let username = '';


$(function(){
    $('#loginModal').modal({
        show:true,
        backdrop:'drop',
        keyboard:false
    })
});

$(function () {
    let timeAdd = $('#time-add')
   timeAdd.val(formatDateTime(new Date()));
   timeAdd.attr('min',formatDateTime(new Date()));
   $('#time-refresh').val(formatDateTime(new Date()));
});

function formatDateTime(date){
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    return y + '-' + m + '-' + d;
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
                if (data.detail) {

                    for (let i = 0; i < data.detail.length; i++) {
                        addSticker(data.detail[i]);

                    }
                }
            }

        }
    })
}

function jump(content) {
    $('#refreshModal').modal('toggle');
    $('#note-change').val(content.innerText);
    send = {'name': username['name'],
                'message':content.innerText.substring(0, content.innerText.length - 1)};
    $.ajax({
        url: "/jump",
        type: "POST",
        data: send,
        success: (data) => {
            data = JSON.parse(data);
            if (data["status"] === 1) {
                if (data.detail) {
                    let timeRefresh = $('#time-refresh');
                    console.log(data.detail[0]);
                    timeRefresh.val(data.detail[0][1]);
                    timeRefresh.attr('min',data.detail[0][1]);
                    $('#priority-refresh').val(data.detail[0][0]);
                }
            }

        }
    });
    thisSticker = content;
}

function addSticker(data) {
    let board = $('#show-board');
    let stick = document.createElement('li');
    let detail = document.createElement('span');
    let mark = document.createElement('span');
    let priority = $('#priority-setup').val();
    let dateTime = $('#time-add').val();

    console.log(dateTime);
    stick.setAttribute("class", "sticky");
    stick.setAttribute("onclick", "jump(this)");
    mark.setAttribute("class", "glyphicon glyphicon-remove");
    mark.style.top = "6em";
    mark.style.left = "7em";
    mark.style.float = "bottom";

    if (data) {
        detail.innerText = data[0];
        if (data[1] === 1){
            mark.setAttribute("class", "glyphicon glyphicon-ok");
        }
    } else if (data === undefined){
        $('#addModal').modal('toggle');
        let textArea = $('#note-input');
        let text = textArea.val();
        detail.innerText = text;
        textArea.val('');


        let send = {"name": username['name'],
                    "message": text,
                    "isFinish": 0,
                    "priority": priority,
                    "date": dateTime};

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
        let priority = $('#priority-refresh').val();
        let send = {"name": username['name'],
                    "priority": priority,
                    "cMessage": newText,
                    "pMessage": thisSticker.firstChild.innerText}; //cMessage = change message
                                                                    // PMessage = primary message
        $.ajax({
            url: "/refresh",
            type: "POST",
            data: send,
            success: (dataRec) => {
                dataRec = JSON.parse(dataRec);
                console.log(dataRec.message);
                if (dataRec["status"] === 1) {
                    console.log('refresh!!')
                }

            }
        });

        thisSticker.firstChild.innerText = newText;
        thisSticker = null;
        $('#refreshModal').modal('toggle');
    }

}

function deleteSticker(data) {
    let parent = document.getElementById('show-board');
    //console.log(thisSticker);
    if (data){
        parent.removeChild();
    }
    if (thisSticker) {

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

function markSticker(msg) {

    if (thisSticker) {
        let icon =thisSticker.lastChild;
        icon.className = 'glyphicon glyphicon-ok';
        let send = {"name": username['name'],
                    "message": thisSticker.firstChild.innerText};
        $.ajax({
            url: "/mark",
            type: "POST",
            data: send,
            success: (dataRec) => {
                dataRec = JSON.parse(dataRec);
                console.log(dataRec.message);
                if (dataRec["status"] === 1) {
                    console.log('mark!!')
                }

            }
        });
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


function sort(mode) {
            let send = {"name": username['name'],
                        "mode": mode};
        $.ajax({
            url: "/sort",
            type: "POST",
            data: send,
            success: (dataRec) => {
                dataRec = JSON.parse(dataRec);
                console.log(dataRec);
                if (dataRec["status"] === 1) {
                    console.log('sort!!');
                    for (let i = 0; i < dataRec.detail.length; i++) {
                        $("li").filter(function(index){
                                return $(this).text() === dataRec.detail[i][0];
                            }).remove();
                    }
                    for (let i = 0; i < dataRec.detail.length; i++) {
                        addSticker(dataRec.detail[i])
                    }
                }

            }
        });
}

