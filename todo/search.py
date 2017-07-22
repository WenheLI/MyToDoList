from django.http import HttpResponse
from django.shortcuts import render_to_response, render
from django.views.decorators import csrf


def search_form(request):
    return render_to_response('search_form.html')


def search(request):
    request.encoding = 'utf-8'
    if 'q' in request.GET:
        message = 'what you search: ' + request.GET['q']
    else:
        message = 'nothing'
    return HttpResponse(message)


def search_post(request):
    ctx = {}
    if request.POST:
        ctx['rlt'] = request.POST['q']
    return render(request, "post.html", ctx)

