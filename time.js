function Time(nowYMD,time,sectionMin,argEle,serverTime,callback){
	this.time = time;
	this.sectionMin = sectionMin;
	this.argEle = argEle;
	this.serverTime = serverTime;
	this.nowYMD = nowYMD;
	this.callback = callback;
	this.init();
}
Time.prototype={
	constructor: Time,
	init: function(){
		var _this = this;
		var timeArr = [];
		var cache;
		var timeSection = "";
		var limitCount;
		var serverTimeLen = Math.floor(_this.serverTime/60)>0 ? ("约"+ Math.floor(_this.serverTime/60) +"."+ Math.round((_this.serverTime%60)/60*10) + "小时") : (_this.serverTime+"分钟");
		if(_this.serverTime%60 == 0){
		    serverTimeLen = "约"+(_this.serverTime/60)+"小时";
		}
		for(var k = 0; k < _this.time.length; k += 1){
			cache = {};
			for(var j in _this.time[k]){
				cache[j] = _this.time[k][j].replace(/-/g,'/');
			}
			timeArr.push(cache);
		}

		//-----------计算出不可预约的最后几个数目
		if(_this.serverTime <= _this.sectionMin){
			limitCount = 0;
		}else{
			limitCount = Math.floor(_this.serverTime / _this.sectionMin)
		}
		var timeEle = bornTime(timeArr,_this.sectionMin);
		//入口函数，生成时间段
		function bornTime(time,section){
			time.map(function(value,index){
				var aa;
				aa = removeFork(value);  //取整时间
				timeBlock(aa,value,section);
			});
			//生成元素成功回调
			if(_this.callback && typeof(_this.callback) == "function"){
                _this.callback();
            }
		}
		//时间取整
		function removeFork(arg){  
			var hour,
			 	min,
				sec;
			var arr = [],
				temp = 0;
			var returnValue;

			returnValue = newDate(arg.begin_time);
			min = returnValue.getMinutes();
			hour = returnValue.getHours();
			returnValue.setSeconds(0);
			if(min % _this.sectionMin !== 0){
				var rate = Math.floor(min / _this.sectionMin);
				var minSum = 0;
				minSum = hour*60 + _this.sectionMin*(rate+1);
				returnValue.setHours(Math.floor(minSum/60));
				returnValue.setMinutes(minSum%60);
			}
			return returnValue;
		}
		//把一个区段的时间生成块
		function timeBlock(arg,oldTime,timeLen){
			var begin = arg,
				beginStamp = new Date(begin).getTime();
			var lenStamp = timeLen * 60 * 1000;
			//获取当天和当前的各个时间点
			var nowTime = newDate();
			var nowTimeStamp = nowTime.getTime(); //当前时间

			var nowDateTime = newDate(_this.nowYMD.replace(/-/g,"/")+" 00:00:00").getTime();  //选中那天的起点时间
			//当天末尾时间：23:59:59
			var nowLastTime = newDate(_this.nowYMD.replace(/-/g,"/")+" 23:59:59").getTime();
			//如果是当天过去时的时间，截断之
			if(beginStamp < nowDateTime){
				beginStamp = nowDateTime;
			}

			var end = oldTime.end_time,
				endStamp = new Date(end).getTime();
			var i,
				len = Math.floor((endStamp - beginStamp) / lenStamp),
				timeChange,
				hours,
				minute;
			for(i = 0; i < len; i++){
				if(beginStamp < nowLastTime){
					timeChange = newDate(beginStamp);
					hours = timeChange.getHours() >= 10 ? timeChange.getHours() : ("0"+timeChange.getHours());
					minute = timeChange.getMinutes() >= 10 ? timeChange.getMinutes() : ("0"+timeChange.getMinutes());
					if(len - limitCount <= i || beginStamp < nowTimeStamp){
						timeSection += '<div class="time-ele limit-choose"><span class="time-ele-span"><p>'+hours+":"+minute+'</p><p>'+serverTimeLen+'</p></span></div>';
					}else{
						timeSection += '<div class="time-ele allow-choose"><span class="time-ele-span"><p>'+hours+":"+minute+'</p><p>'+serverTimeLen+'</p></span></div>';
					}

					beginStamp += lenStamp;
				}
			}
			document.querySelector(_this.argEle).innerHTML = timeSection;
		}

		function newDate(arg){
			if(arg){
				return new Date(arg);
			}else{
				return new Date();
			}
			
		}
	}
}

