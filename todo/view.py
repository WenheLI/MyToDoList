from django.http import HttpResponse
from django.shortcuts import render
# from dwebsocket import require_websocket
import json
import psycopg2
import time
import datetime


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
        dates = []
        status = 1

        cur.execute('''SELECT   tablename   FROM   pg_tables   
                        WHERE   tablename   NOT   LIKE   'pg%'   
                        AND tablename NOT LIKE 'sql_%' 
                        ORDER   BY   tablename;''')
        res = cur.fetchall()
        if ('%s' % name,) in res:
            cur.execute("SELECT message, isFinish FROM %s ORDER BY date ASC" % name)
            rows = cur.fetchall()
            print rows
            data = json.dumps({
                "status": status,
                "detail": rows
            })
        else:
            cur.execute('''CREATE TABLE %s
            (
                message TEXT NOT NULL,
                isFinish smallint NOT NULL,
                priority SMALLINT NOT NULL,
                date DATE NOT NULL);
            ''' % name)
            conn.commit()
            data = json.dumps({
                "status": status,
                "message": ''
            })

        cur.execute("SELECT * FROM %s ORDER BY DATE ASC" % name)
        print cur.fetchall()

        conn.close()
        return HttpResponse(data)


def add(request):
    if request.method == "POST":
        print 'start add'
        conn = connection()
        cur = conn.cursor()

        isFinish = int(request.POST.get('isFinish'))
        priority = int(request.POST.get('priority'))
        date = request.POST.get('date')
        print date
        name = request.POST.get('name')
        message = request.POST.get('message')
        status = 1

        cur.execute("INSERT INTO %s (message, isFinish, priority, date) VALUES('%s', %d, %d, '%s')"
                    % (name, message, isFinish, priority, date))

        data = json.dumps({
            status: status
        })
        conn.commit()

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

        cur.execute("DELETE FROM %s WHERE message LIKE '%s' " % (name, message))
        data = json.dumps({
            status: status
        })
        conn.commit()

        conn.close()
        return HttpResponse(data)


def mark(request):
    if request.method == "POST":
        print 'start mark'
        conn = connection()
        cur = conn.cursor()

        name = request.POST.get('name')
        message = request.POST.get('message')
        status = 1
        cur.execute("UPDATE %s SET isFinish = 1 WHERE message = '%s'" % (name, message))
        data = json.dumps({
            status: status
        })
        conn.commit()

        conn.close()
        return HttpResponse(data)


def refresh(request):
    if request.method == "POST":
        print 'start mark'
        conn = connection()
        cur = conn.cursor()

        name = request.POST.get('name')
        cMessage = request.POST.get('cMessage')
        pMessage = request.POST.get('pMessage')
        priority = int(request.POST.get('priority'))
        status = 1

        data = json.dumps({
            "status": status
        })

        cur.execute("UPDATE %s SET message = '%s', priority = %d WHERE message = '%s'"
                    % (name, cMessage, priority, pMessage))

        conn.commit()

        conn.close()
        return HttpResponse(data)


def jump(request):
    if request.method == "POST":
        print 'start jump'
        conn = connection()
        cur = conn.cursor()

        name = request.POST.get('name')
        message = request.POST.get('message')
        status = 1
        print request.POST
        cur.execute("SELECT priority, date FROM %s WHERE message LIKE '%s'" % (name, message))
        rows = cur.fetchall()
        conn.commit()
        print rows
        for i in range(len(rows)):
            rows[i] = list(rows[i])
            rows[i][-1] = rows[i][-1].strftime('%Y-%m-%d')

        data = json.dumps({
            "status": status,
            "detail": rows
        })

        conn.close()
        return HttpResponse(data)


def sort(request):
    if request.method == "POST":
        print 'start sort'
        conn = connection()
        cur = conn.cursor()

        name = request.POST.get('name')
        mode = request.POST.get('mode')
        status = 1

        cur.execute("SELECT * FROM %s ORDER BY %s ASC" % (name, mode))
        rows = cur.fetchall()
        conn.commit()
        for i in range(len(rows)):
            rows[i] = list(rows[i])
            rows[i][-1] = rows[i][-1].strftime('%Y-%m-%d')

        data = json.dumps({
            "status": status,
            "detail": rows
        })

        conn.close()
        return HttpResponse(data)

