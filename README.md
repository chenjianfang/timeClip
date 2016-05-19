功能说明：

  根据项目需要，选择的年月日selectTime，给出时间段timecli，把时间段切割成一定的时间长度sectionMin，生成到指定的元素内argEle，服务时长serverTime，回调函数callback
  
var time = new Time(selectTime,timeclip,sectionMin,argEle,serverTime,callback);

Useage：

  此功能是根据公司项目需要写的，移植到其他项目复用性不强，但针对本公司项目的时间切割长度有很好的扩展性。
