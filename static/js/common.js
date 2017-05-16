/**
 * Created by liucc on 2015/6/16.
 */
var common = (function (api) {
    function toDouble(number) {
        if (parseInt(number) < 10) {
            return '0' + number;
        }
        return number;
    }

    /*
     * 解析url为json
     * */
    api.url2json = function(){
        var strParam = window.location.search.substring(1);
        if (/^\s*$/.test(strParam)) {
            return {};
        }
        var json = {};
        var arr = strParam.split('&');
        for (var i = 0; i < arr.length; i++) {
            arr2 = arr[i].split("=");
            json[arr2[0]] = decodeURIComponent(arr2[1]);
        }
        ;
        return json;
    };


    api.toArray=function(){
        var json = [];
        var cols = document.getElementsByTagName('th');
        var trs = document.getElementsByTagName('tr');
        var colnames = [];
        for (var p = 0; p < cols.length; p++) {
            colnames.push(cols[p].innerHTML);
        }
        for (var i = 1; i < trs.length; i++) {
            var tds = trs[i].getElementsByTagName('td');
            var temp = {};
            for (var j = 0; j < tds.length; j++) {
                temp[colnames[j]] = tds[j].innerHTML;
            }
            json.push(temp);
        }
        return json;

    }
    /*
     * 适用后台cms̨ajax
     * @param option{url,type,[,data {...}],[,success{function}],[,fali{function}],[,error {function}]}
     * */
    api.ajax = function (option) {
        $.ajax({
            url: '/web'+option.url,
            type: option.type || "get",
            traditional: true,
            data: option.data || {},
            async: option.async || true,
            processData: (option.processData === undefined ? true : option.processData),
            contentType: (option.contentType === undefined ? $.ajaxSettings.contentType : option.contentType),
            success: function (res) {
                if (res.status) {
                    if (res.status == 10101001) {
                        console.log(res.message); //登陆超时
                        window.top.location.href = '/login.html';
                    } else {
                        if (option.fail) {
                            option.fail(res);
                        } else {
                            $.messager.alert("警告", res.message);
                        }
                    }
                    return;
                }
                option.succ && option.succ(res);
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
                if (option.error) {
                    option.error();
                } else {
                    $.messager.alert("警告", "请检查网络");
                }
            },
            complete: option.complete || null
        });
    };
    /*
     *
     * 格式化时间
     * 将毫秒数转为 eg： 2015-06-15 10:09
     * */
    api.formatTime = function (ms) {
        if (!ms * 1) {
            return "";
        }
        var timeStr;
        var oDate = new Date();
        oDate.setTime(ms);
        var sYeay = oDate.getFullYear();
        var sMonth = oDate.getMonth() + 1;
        var sDate = oDate.getDate();
        var sHours = oDate.getHours();
        var sMinites = oDate.getMinutes();
        timeStr = sYeay + '-' + toDouble(sMonth) + '-' + toDouble(sDate) + "  " + toDouble(sHours) + ":" + toDouble(sMinites);
        return timeStr;
    };
    /*
     * 格式化时间(精确到天)
     * 将毫秒数转为 eg： 2015-06-15
     * */
    api.formatTime_accurateDays = function (ms) {
        if(!ms*1){
            return "";
        }
        var timeStr;
        var oDate = new Date();
        oDate.setTime(ms);
        var sYeay = oDate.getFullYear();
        var sMonth = oDate.getMonth() + 1;
        var sDate = oDate.getDate();
        //var sHours = oDate.getHours();
        //var sMinites = oDate.getMinutes();
        //var sSeconds = oDate.getSeconds();
        timeStr = sYeay + '-' + toDouble(sMonth) + '-' + toDouble(sDate);
        return timeStr;
    };
    /*
     * 格式化时间(精确到秒)
     * 将毫秒数转为 eg： 2015-06-15 10:09:02
     * */
    api.formatTime_accurateSeconds = function (ms) {
        if (!ms * 1) {
            return "";
        }
        var timeStr;
        var oDate = new Date();
        oDate.setTime(ms);
        var sYeay = oDate.getFullYear();
        var sMonth = oDate.getMonth() + 1;
        var sDate = oDate.getDate();
        var sHours = oDate.getHours();
        var sMinites = oDate.getMinutes();
        var sSeconds = oDate.getSeconds();
        timeStr = sYeay + '-' + toDouble(sMonth) + '-' + toDouble(sDate) + "  " + toDouble(sHours) + ":" + toDouble(sMinites) + ":" + toDouble(sSeconds);
        return timeStr;
    };

    /*
     * 获取用户信息
     *
     * */
    api.getUserData=function(){
        if(!localStorage.userData){
            window.parent.location.href = '../login.html';
        }
        return JSON.parse(localStorage.userData);

    };

    /*
     * 判断权限
     *
     * */
    api.isPowerful=function(){
        var userData=common.getUserData();
        var isPowerful= userData.isAdmin || userData.isSupperAdmin ;
        if(isPowerful){
            return true;
        }
        return false;
    };

    api.hasCode = function (code) {
        var userData = common.getUserData();
        var isPowerful = userData.isAdmin || userData.isSupperAdmin;
        if (isPowerful) {
            return true;
        }
        var userData = api.getUserData();

        var authList = userData ? userData.auth : [];
        for (var i = 0; i < authList.length; i++) {
            if (authList[i].code == code) {
                return true;
            }
        }
        return false;
    };

    api.toDate=function(str){

        var start = str.substring(0, 5);
        var middle = str.substring(6,10);
        var end = str.substring(10);
        var str1 = middle + "/" + start+end;
        if(str==""){
            return str
        }else{
            return str1.replace(/\/+/g, "-");
        }
    };

    return api;
})(common || (common = {}));

