# history-stock-diff
使用 jqdatasdk 实现的小工具
主要功能可以实现 A股历史日内分时数据的可视化对比
辅助分析短线的走势

欢迎大家star 和 fork 我们会持续迭代功能

另外推荐大家使用我们开发的A股本地实盘下单接口 可以完美配合聚宽本地量化终端进行程序化实盘交易

欢迎加群 273896202 咨询详情
https://github.com/easyQuant/trade-api

# 使用方法
确保安装了python3+

1. 下载项目
```
git clone https://github.com/easyQuant/history-stock-diff.git
```

2. 安装python依赖
```
## 如果需要权限则加上sudo
pip3 install -r requirements.txt -i https://pypi.tuna.tsinghua.edu.cn/simple
```

3. app.py文件内输入joinquant的account info
```
# 此处输入聚宽账号和密码 
# 如果没有jqdatasdk权限 可以从这里申请 https://www.joinquant.com/default/index/sdk
jqdatasdk.auth('聚宽账号', '聚宽密码')
```

4. 输入python3 app.py 打开 http://127.0.0.1:5000/
```
python3 app.py
```

5. 页面内输入股票代码 例如 600519, 000858 使用逗号隔开 选择时间 即可当日分时数据对比
