from django.http import HttpResponse
from django.shortcuts import render
# from dwebsocket import require_websocket
import json
import psycopg2


def hello(request):
    return render(request, 'index.html')


def connection():
    conn = psycopg2.connect(database="ToDoList", user="eric", password="123", host="127.0.0.1", port="5432")
    print "connect successfully"
    return conn


def login(request):
    if request.method == "POST":
        conn = connection()
        cur = conn.cursor()
        name = request.POST.get('name')
        status = 1
        try:
            cur.execute("SELECT name, message FROM todoDB WHERE NAME LIKE '%s'" % name)
            rows = cur.fetchall()
            data = json.dumps({
                "status": status,
                "message": rows[0][1].split(',')
            })
        except:
            cur.execute("INSERT INTO todoDB (name, message) VALUES('%s', '')" % name)
            conn.commit()
            data = json.dumps({
                "status": status,
                "message": ''
            })

        conn.close()
        return HttpResponse(data)


def add(request):
    if request.method == "POST":
        print 'start add'
        conn = connection()
        cur = conn.cursor()

        name = request.POST.get('name')
        message = request.POST.get('message')
        status = 1
        cur.execute("SELECT name, message FROM todoDB WHERE NAME LIKE '%s'" % name)
        rows = cur.fetchall()
        if rows[0][1]:
            message = rows[0][1] + ',' + message
        cur.execute("UPDATE todoDB set message = '%s' WHERE name = '%s'" % (message, name))

        data = json.dumps({
            status: status
        })
        conn.commit()
        cur.execute("SELECT name, message FROM todoDB WHERE NAME LIKE '%s'" % name)
        rows = cur.fetchall()

        conn.close()
        return HttpResponse(data)


def delete(request):
    if request.method == "POST":
        print 'start delete'
        conn = connection()
        cur = conn.cursor()

        name = request.POST.get('name')
        message = request.POST.get('message')
        status = 1
        cur.execute("SELECT name, message FROM todoDB WHERE NAME LIKE '%s'" % name)
        rows = cur.fetchall()
        msgs = rows[0][1].split(',')
        msgs.remove(message)
        com = ','
        msgs = com.join(msgs)
        cur.execute("UPDATE todoDB set message = '%s' WHERE name = '%s'" % (msgs, name))
        data = json.dumps({
            status: status
            })
        conn.commit()

        conn.close()
        return HttpResponse(data)


if __name__ == "__main__":
    conn = psycopg2.connect(database="ToDoList", user="eric", password="123", host="127.0.0.1", port="5432")
    print "connect successfully"
    cur = conn.cursor()
    conn.commit()
    cur.execute("SELECT NAME, MESSAGE from todoDB WHERE name LIKE 'hahaha'")
    rows = cur.fetchall()
    for row in rows:
        print "ID: ", row[0]
        print "message", row[1]
