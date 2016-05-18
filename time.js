function Time(time,sectionMin,argEle,serverTime,callback){
	this.time = time;
	this.sectionMin = sectionMin;
	this.argEle = argEle;
	this.serverTime = serverTime;
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
		var serverTimeLen = Math.floor(_this.serverTime/60)>0 ? ("约"+ Math.floor(_this.serverTime/60) +"."+ Math.round((_this.serverTime%60)/60*10) + "小时") : (_this.serverTime+"分钟");
		var limitCount;
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
		console.log(limitCount);
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
			console.log(arg);
			var begin = arg,
				beginStamp = new Date(begin).getTime();

			var end = oldTime.end_time,
				endStamp = new Date(end).getTime();
			var lenStamp = timeLen * 60 * 1000;
			var i,
				len = Math.floor((endStamp - beginStamp) / lenStamp),
				timeChange,
				hours,
				minute;
			for(i = 0; i < len; i++){
				timeChange = newDate(beginStamp);
				hours = timeChange.getHours() >= 10 ? timeChange.getHours() : ("0"+timeChange.getHours());
				minute = timeChange.getMinutes() >= 10 ? timeChange.getMinutes() : ("0"+timeChange.getMinutes());
				if(len - limitCount <= i){
					timeSection += '<div class="time-ele limit-choose"><span class="time-ele-span"><p>'+hours+":"+minute+'</p><p>'+serverTimeLen+'</p></span></div>';
				}else{
					timeSection += '<div class="time-ele allow-choose"><span class="time-ele-span"><p>'+hours+":"+minute+'</p><p>'+serverTimeLen+'</p></span></div>';
				}

				beginStamp += lenStamp;
			}
			document.querySelector(_this.argEle).innerHTML = timeSection;
			
		}

		function newDate(arg){
			return new Date(arg);
		}
	}
}

