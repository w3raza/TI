#!/usr/bin/env python3
import cgi
import os
import datetime
import cgitb; cgitb.enable()

print ("Content-Type: aplication/html")
print ()


form = cgi.FieldStorage()

title = form.getvalue("title", "(no_data)")
author = form.getvalue("author", "(no_data)")

new_rekord = title + ";" + author + ";\n"
try:
    file = open("book.txt", "a")
    file.write(new_rekord)
    file.close();
except Exception as Obj:
    print(Obj)
    pass;