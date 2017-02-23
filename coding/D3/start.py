#coding: UTF-8
import subprocess
import datetime
import os
import webbrowser

#Execute command function
def DoCommand(start):
	subprocess.check_call(start.strip().split(" "))


def openBrowser():
	url = "http://localhost:8888/"
	webbrowser.open(url)

#main function
if __name__ == "__main__":
	#get today_data
	d = datetime.datetime.today()
	year = str(d.year)
	month = str(d.month)
	day = str(d.day)
	sec = str(d.second)

	#変数一覧
	start = "python -m SimpleHTTPServer 8888"
	fileName = "memo.txt"

	#関数実行
	openBrowser()
	DoCommand(start)
