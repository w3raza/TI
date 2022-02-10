#!/usr/bin/env python3
import cgi
import os
import datetime

def print_form_file(rec):
	print("<table>")
	print("<tr>")
	print("<th>TITLE</th>")
	print("<th>AUTHOR</th>")
	print("<th>IP</th>")
	print("<th>DATE</th>")
	print("</tr>")
	with open("books.txt", "r") as file:
		data = file.readlines();
		for line in data:
			print("<tr>")
			for td in line.split(';'):
				print("<td>" + td + "</td>")
			print("</tr>")
				
	print("</table>")

form = cgi.FieldStorage()

title = form.getvalue("title", "(no_data)")
author = form.getvalue("author", "(no_data)")
try:
    ip = cgi.escape(os.environ["REMOTE_ADDR"])
except:
    ip = "127.0.0.1"
    pass;
date = datetime.datetime.now().strftime("%m/%d/%Y %H:%M:%S")
new_rekord = title + ";" + author + ";" + ip + ";" + date + ";\n"
try:
    file = open("books.txt", "a")
    file.write(new_rekord)
    file.close();
except Exception as Obj:
    print(Obj)
    pass;

print ("Content-type: text/html")
print ()
print ("<!DOCTYPE html>")
print ("<html><head>")
print ('<link rel="stylesheet" href="../lab05/style.css">')
print ("<title>Library</title>")
print ("</head><body>")
print_form_file(new_rekord);
print ("</body></html>")