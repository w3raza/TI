#!/usr/bin/env python3
import cgi

def print_form_file():
	print("<table>")
	print("<tr>")
	print("<th>title</th>")
	print("<th>author</th>")
	print("</tr>")
	with open("book.txt", "r") as file:
		data = file.readlines();
		for line in data:
			print("<tr>")
			for td in line.split(';'):
				print("<td>" + td + "</td>")
			print("</tr>")
				
	print("</tabele>")


print ("Content-type: text/html")
print ()
print ("<!DOCTYPE html>")
print ("<html><head>")
print ('<link rel="stylesheet" href="../lab07/style.css">')
print ("<title>Library</title>")
print ("</head><body>")
print_form_file();
print ("</body></html>")
