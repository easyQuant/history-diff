# history-stock-diff
使用 jqdatasdk 实现的小工具
主要功能可以实现 A股历史日内分时数据的可视化对比
辅助分析短线的走势

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
# 此处深入聚宽账号和密码
jqdatasdk.auth('聚宽账号', '聚宽密码')
```

4. 输入python3 app.py 打开 http://localhost:5000/ 
```
python3 app.py
```

5. 页面内输入股票代码 例如 600519, 000858 使用逗号隔开 选择时间 即可当日分时数据对比
