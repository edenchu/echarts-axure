let InitChart = function(){
    this.rootPath = 'https://cdn.jsdelivr.net/gh/apache/echarts-website@asf-site/examples';
    this.checkOwner = function(obj,key){
        let _key='';
        if (typeof obj ==='object' && obj.hasOwnProperty(key)){_key = obj[key]}
        return _key;
    };

    this.showEchart = function( code, _option, dom, color){
        let $this = this;
        let option, myChart;
        let ROOT_PATH = this.rootPath;
        myChart = echarts.init(dom , color);
        let getECStat = function(path, func){
            if (typeof (ecStat) == "object"){
                func;
                option = '';
            }
            else{
                $.getScript(path,func);
            }
        };
        try{
            code&&eval(code);
            if(typeof option ==='object'){
                option = $.extend(true,option,_option);
                myChart.setOption(option);
            }
        }
        catch (e){console.log(e);}
    }
};
InitChart.prototype  = {
    constructor:InitChart,
    initialize: function(chart){
        let interval;
        let $this = this;
        interval = setInterval(function() {
            if (typeof (echarts) == "object") {
                clearInterval(interval);
                $this.renderChart(chart);
            }
        },1000);
    },
    renderChart :function(chart){
        let _chart = chart, _dom, _code, _color;
        let $this = this;
        for(let key in _chart.doms){
            let _key,_option;
            _key = key;
            _option = $this.checkOwner(_chart.options, _key);
            _dom = $this.checkOwner(_chart.doms, _key);
            _code = $this.checkOwner(_chart.codes, _key);
            _color = $this.checkOwner(_chart.colors, _key);
            if(_color==='') _color = 'light';
            $this.showEchart(_code, _option,_dom,_color);
        }
    }
}

$axure.internal(function($ax) {
    let _charts = {}, options={}, doms={}, codes={}, colors={};
    $ax.charts = _charts;
    _charts.codes = codes;
    _charts.colors = colors;
    _charts.options = options;
    _charts.doms = doms;
    let _initDataSet = function() {
        $ax(function(obj) {
            return $ax.public.fn.IsRepeater(obj.type);
        }).each(function(obj, repeaterId) {
            if(obj.label==='chart-config'){
                options[repeaterId] = $ax.deepCopy(obj.data);
                doms[repeaterId] = $('#'+repeaterId).prev()[0];
            }
        });
    };
    _charts.initDataSet = _initDataSet;


    let _initKey = function(nameStr, configText){
        let arr = nameStr&&nameStr.split('.'), arrLen = arr&&arr.length;
        let strStar = '', strEnd ='';
        let paramStr = 'var params = ', paramKey = 'params.', _configStr = 'var configStr = ';
        let reg = /[\[|{]([^]*)[\]|}]/g;
        if(reg.test(configText)) {
            _configStr += configText;
        }
        else {
            if (configText==='true' || configText==='false'){
                _configStr += configText;
            }
            else{
                _configStr +='"'+ configText+'"';
            }
        }
        eval(_configStr);
        for(let len=0; len<arrLen; len++){
            strStar += '{'+arr[len]+':';
            if(len+1 === arrLen) {
                strStar +='{}';
                paramKey += arr[len];
            }
            else {
                paramKey += arr[len]+'.';
            }
            strEnd +='}';
        }
        paramStr += strStar +strEnd;
        paramKey +='=configStr';
        eval(paramStr);
        eval(paramKey);
        return params;

    };
    _charts.initKey = _initKey;

    let _checkIsNull = function(obj){
        if(typeof obj.name ==='undefined') alert("配置名为空，请检查");
        if(typeof obj.config==='undefined') {
            obj.config = {text:''};
        }
        return obj;
    };
    _charts.checkIsNull = _checkIsNull;

    let _regexParam = function(str){
        let _str = str;
        let reg = {
            de:/'/g,
            space:/\s+/g,
            note:/( \/\/.+)/g,
            //mark:/([\[:,{]\s*)'([^']*)'/g,
            marks:/([\[:,{]\s*)["“’]([^"]*)["”’]/g
        };
        let place = {
            space:' ',
            marks:'$1\'$2\''
        };
        if (reg.note.test(_str)){
            console.log(_str);
            alert('请删除配置项中的"//"注’释内容');
        }
        else{
            for (let key in place) {
                //if(key==='marks') _str = _str.replace(reg.mark,'$1"$2"');
                _str = _str.replace(reg[key],place[key]);
            }
        }
        return _str;

    }
    _charts.regexParam = _regexParam;

    let _initUserOption = function(){
        let _option, _key, nText ,cText;
        for(let key in options){
            _option ={};
            _key = options[key];
            for(let m=0; m<_key.length; m++){
                _key[m] = _checkIsNull(_key[m]);
                nText = _regexParam(_key[m].name.text);
                cText = _regexParam(_key[m].config.text);
                if(nText==='chartCode') codes[key] = cText;
                else if(nText==='chartColor') colors[key] = cText;
                else $.extend(true,_option,_initKey(nText,cText));
            }
            options[key] = _option;
        }
    }
    _charts.initUserOption = _initUserOption;


    _charts.initialize = function () {
        _initDataSet();
        _initUserOption();
    }

    $(function(){
        const chart = $ax.charts;
        chart.initialize();
        let initChart = new InitChart();
        initChart.initialize(chart);
    });
});
