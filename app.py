import jqdatasdk
import time
import re

from flask import Flask, request, jsonify
from datetime import datetime, timedelta

app = Flask(__name__)

# 此处输入聚宽账号和密码
jqdatasdk.auth('聚宽账号', '聚宽密码')

g = {
	'names': None,
	'stocks': None
}

## 兼容聚宽股票代码
def parseStockCode (code):
	regXSHE = r'^(002|000|300|1599|1610)'
	regXSHG = r'^(600|601|603|51)'
	regCode = r'\.(XSHE|XSHG)'

	# if re.search(regCode, code):
	# 	return code
	# else:

	if re.search(regXSHE, code):
		return '.'.join([code, 'XSHE'])
	elif re.search(regXSHG, code):
		return '.'.join([code, 'XSHG'])

@app.route('/')
def root():
	return app.send_static_file('index.html')

@app.route('/get_stocks')
def get_stocks():
	global g

	if (g['stocks'] and g['names']):
		print('已存在 从本地获取')
	else:
		df = jqdatasdk.get_all_securities(['stock'])

		# 将所有股票列表转换成数组
		stocks = list(df.index)
		names = list(df.display_name)
		g['stocks'] = stocks
		g['names'] = names
		print('没有数据从远程获取')
		
	
	# print(stocks)
	return jsonify({
		'stocks': g['stocks'],
		'names': g['names']
	})

@app.route('/get_bars')
def get_bars():
	stocks = request.args.get('stocks').split(',')
	date = request.args.get('date')
	data = {}
	query_date = datetime.strptime(date, '%Y-%m-%d')
	total_count = 240
	_list = [[] for _ in range(total_count)]
	_stocks = []
	reply_close = {}
	current_open = {}

	for stock in stocks:
		stock = stock.split('.')[0]
		print('stock => ', stock)
		_stocks.append(stock)
		reply_close[stock] = list(jqdatasdk.get_bars(parseStockCode(stock), 2, unit='1d', fields=['close'], include_now=False, end_dt = query_date, fq_ref_date=None)['close'])[0]
		current_open[stock] = list(jqdatasdk.get_bars(parseStockCode(stock), 1, unit='1d', fields=['open'], include_now=False, end_dt = query_date, fq_ref_date=None)['open'])

		## 获取标的分时图每个点
		stock_bars = list(jqdatasdk.get_bars(parseStockCode(stock), total_count, unit='1m', fields=['close'], include_now=False, end_dt = query_date, fq_ref_date=None)['close'])
		data[stock] = current_open[stock] + stock_bars

	## 统计当日涨幅
	for index in range(0, total_count):
		_list[index] = {
			'index': index,
		}

		for stock in data:
			_list[index][stock] = round((data[stock][index] - reply_close[stock]) / reply_close[stock] * 100, 2)

	
	# print('昨日收盘价')
	# print(reply_close)

	# print('涨幅')
	# print(result)
	return jsonify({
		'stocks': _stocks,
		'list': _list
	})
	

if __name__ == '__main__':
	app.run()
