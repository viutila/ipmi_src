import Radium from "radium";
import React from "react";
import MainStore from "../../stores/MainStore";
import * as MainActions from "../../actions/MainActions";
import {Chart} from 'react-google-charts';
import moment from 'moment';

@Radium
class Power extends React.Component {
    constructor(props) {
        super(props);
        this.getPowerData = this.getPowerData.bind(this);
        this.getPowerControlData = this.getPowerControlData.bind(this);
        this.getPowerControlCgiAction = ()=>{ MainActions.getPowerControlCgi(this.token); }

        this.state = {
            //power
            power: '',
            powerControl: '',
            sortType1: {key: "status", order: "asc"},
            sortType2: {key: "type", order: "asc"},
            buttonSelect: 'PSU1',
            radioType: 'Watts',
            chartButtonSelect: 'hour',
            page: 'PM',
            pcRadio: 'powerOnSystem',
        };
    }

    componentWillMount() {
        MainStore.on("getPowerCgiSuccess", this.getPowerData);
        MainStore.on("getPowerControlCgiSuccess", this.getPowerControlData);
        MainStore.on("postPowerControlCgiSuccess", this.getPowerControlCgiAction);
        
        this.token = localStorage.getItem("LStoken");
        this.powerData = '';
        this.powerControlData = '';

        MainActions.getPowerCgi(this.token);
        MainActions.getPowerControlCgi(this.token);
        
        setTimeout(()=>{MainActions.setLoadingDIV(1)},1);
        //console.log("count", MainStore.listenerCount("getInfoCgiSuccess"));
        this.intervalTimer = setInterval(this.getPowerCgiTimerFunc.bind(this), 60000);
        this.intervalTimer2 = setInterval(this.getPowerControlCgiTimerFunc.bind(this), 5000);
    }

    componentDidMount() {
        
    }

    componentWillUnmount() {
        MainStore.removeListener("getPowerCgiSuccess", this.getPowerData);
        MainStore.removeListener("getPowerControlCgiSuccess", this.getPowerControlData);
        MainStore.removeListener("postPowerControlCgiSuccess", this.getPowerControlCgiAction);

        clearInterval(this.intervalTimer);
        clearInterval(this.intervalTimer2);
    }

    getPowerCgiTimerFunc() {
        console.log("------- Enter getPowerCgiTimerFunc");
        MainActions.getPowerCgi(this.token);
    }

    getPowerControlCgiTimerFunc() {
        console.log("------- Enter getPowerControlCgiTimerFunc");
        MainActions.getPowerControlCgi(this.token);
    }

    getPowerData() {
        this.powerData = MainStore.getPowerData();
        console.log("powerData",this.powerData);
        this.setState({
            power: this.powerData,
        })
        setTimeout(()=>{MainActions.setLoadingDIV(0)},1);
    }

    getPowerControlData() {
        this.powerControlData = MainStore.getPowerControlData();
        console.log("powerControlData",this.powerControlData);
        var tmpPowerOnStatus = this.powerControlData.powerOnStatus;
        var tmpPCRadio;
        if (tmpPowerOnStatus==1 && this.state.pcRadio=="powerOnSystem")
        {
            this.setState({
                pcRadio: "powerOffSystem"
            })
        }
        else if(tmpPowerOnStatus==0 && (this.state.pcRadio=="powerOffSystem" ||
                                        this.state.pcRadio=="powerOffSystemImmediately" ||
                                        this.state.pcRadio=="resetSystem"))
        {
            this.setState({
                pcRadio: "powerOnSystem"
            })
        }
        this.setState({
            powerControl: this.powerControlData,
        })
        //setTimeout(()=>{MainActions.setLoadingDIV(0)},1);
    }

    onRadioChange(e) {
        this.setState({
            radioType: e.currentTarget.value
        });
    }
    typeRadioClickFunc(v) {
        this.setState({
            radioType: v
        })
    }

    onPsuClick(e) {
        this.setState({
            buttonSelect: e.currentTarget.value
        });
    }

    onChartButtonClick(e) {
        this.setState({
            chartButtonSelect: e.currentTarget.value
        });
    }

    onPageClick(e) {
        this.setState({
            page: e.currentTarget.value
        })
    }

    onPCRadioChange(e) {
        this.setState({
            pcRadio: e.currentTarget.value
        })
    }

    onClickTest() {
        var type = this.state.pcRadio;
        MainActions.postPowerControlCgi(this.token, type);
    }

    sortClickHandle1(v) {
        if (this.state.sortType1.key == v)
        {
            this.setState({
                sortType1: {key: v, order: this.state.sortType1.order=="asc" ? "desc" : "asc"}
            });
        }
        else
        {
            this.setState({
                sortType1: {key: v, order: "desc"}
            });
        }
    }

    sortClickHandle2(v) {
        if (this.state.sortType2.key == v)
        {
            this.setState({
                sortType2: {key: v, order: this.state.sortType2.order=="asc" ? "desc" : "asc"}
            });
        }
        else
        {
            this.setState({
                sortType2: {key: v, order: "desc"}
            });
        }
    }

    radioClickFunc(v) {
        this.setState({
            pcRadio: v
        })
    }

    render() {
        if (this.powerData == '' || this.powerControlData == '')
            return false;

        var powerArray = [];
        var rows = [];
        var rowsSpan1 = [];

        var averageData = {};
        var minimumData = {};
        var maximumData = {};
        var cData = [['Time', 'Average(W)', 'Minimum(W)', 'Maximum(W)']];

        var unitType = this.state.chartButtonSelect;

        var hGridCount;
        var hGridStr;
        var ticksAry = [];
        var timeZone;
        switch (unitType){
            case "hour":
                hGridStr = "m";
                break;
            case "day":
                hGridStr = "h";
                break;
            case "week":
                hGridStr = "d";
                break;
        }

        for (var i = 0; i < Object.keys(this.powerData).length; i++)
        {
            var objKey = Object.keys(this.powerData)[i];
            var x = this.powerData[objKey];
            if (objKey=="timezone")
            {
                timeZone = x;
                break;
            }
            /*for (var j = 0; j < x.length; j++)
            {
                x[j].status = Math.abs(x[j].status);
                powerArray.push(x[j]);
            }*/
            powerArray.push(x.watt);
            rowsSpan1.push( <Span1 name={objKey} ampere={x.ampere} voltage={x.voltage} key={i} />);

            

            if (objKey == this.state.buttonSelect )
            {
                switch (this.state.radioType)
                {
                    case "Watts":
                        averageData = { "hour": {"value": x.hour.avgWatt, "time": "N/A"},
                                        "day": {"value": x.day.avgWatt, "time": "N/A"},
                                        "week": {"value": x.week.avgWatt, "time": "N/A"},
                                      };
                        minimumData = { "hour": {"value": x.hour.minWatt, "time": new Date(x.hour.minTime*1000)},
                                        "day": {"value": x.day.minWatt, "time": new Date(x.day.minTime*1000)},
                                        "week": {"value": x.week.minWatt, "time": new Date(x.week.minTime*1000)},
                                      };
                        maximumData = { "hour": {"value": x.hour.maxWatt, "time": new Date(x.hour.maxTime*1000)},
                                        "day": {"value": x.day.maxWatt, "time": new Date(x.day.maxTime*1000)},
                                        "week": {"value": x.week.maxWatt, "time": new Date(x.week.maxTime*1000)},
                                      };

                        
                        var tmpArray = x[unitType].chart;
                        hGridCount = tmpArray.length;
                        tmpArray.forEach(function(data,i) {
                            //cData.push([data.time, data.avgWatt, data.minWatt, data.maxWatt]);
                            var numberStr = unitType=="hour" ? "-"+ (hGridCount-i-1)*5 : "-"+(hGridCount-i-1);
                            var str = ((hGridCount-i-1)==0) ? "NOW" : (numberStr+hGridStr);
                            
                            /*if ((hGridCount-i-1) == 0)
                                str = "NOW";*/
                            cData.push([i, data.avgWatt, data.minWatt, data.maxWatt]);

                            if (hGridCount>10)
                            {
                                if (i%3==0)
                                    ticksAry.push({v: i, f: str});
                            }
                            else
                            {
                                ticksAry.push({v: i, f: str});
                            }

                            if ((hGridCount-i-1)==0)
                                ticksAry.push({v: i, f: str});
                                
                        });

                        break;
                    case "Amps":
                        averageData = { "hour": {"value": x.hour.avgAmpere, "time": "N/A"},
                                        "day": {"value": x.day.avgAmpere, "time": "N/A"},
                                        "week": {"value": x.week.avgAmpere, "time": "N/A"},
                                      };
                        minimumData = { "hour": {"value": x.hour.minAmpere, "time": new Date(x.hour.minTime*1000)},
                                        "day": {"value": x.day.minAmpere, "time": new Date(x.day.minTime*1000)},
                                        "week": {"value": x.week.minAmpere, "time": new Date(x.week.minTime*1000)},
                                      };
                        maximumData = { "hour": {"value": x.hour.maxAmpere, "time": new Date(x.hour.maxTime*1000)},
                                        "day": {"value": x.day.maxAmpere, "time": new Date(x.day.maxTime*1000)},
                                        "week": {"value": x.week.maxAmpere, "time": new Date(x.week.maxTime*1000)},
                                      };
                        var tmpArray = x[unitType].chart;
                        hGridCount = tmpArray.length;
                        tmpArray.forEach(function(data,i) {
                            //cData.push([data.time, data.avgWatt, data.minWatt, data.maxWatt]);
                            var numberStr = unitType=="hour" ? "-"+ (hGridCount-i-1)*5 : "-"+(hGridCount-i-1);
                            var str = ((hGridCount-i-1)==0) ? "NOW" : (numberStr+hGridStr);
                            
                            /*if ((hGridCount-i-1) == 0)
                                str = "NOW";*/
                            cData.push([i, data.avgAmpere, data.minAmpere, data.maxAmpere]);
                            
                            if (hGridCount>10)
                            {
                                if (i%3==0)
                                    ticksAry.push({v: i, f: str});
                            }
                            else
                            {
                                ticksAry.push({v: i, f: str});
                            }

                            if ((hGridCount-i-1)==0)
                                ticksAry.push({v: i, f: str});
                                
                        });
                        break;
                }
            }

        }

        var tmpSortType = this.state.sortType1.key;
        var tmpSortOrder = this.state.sortType1.order;
        powerArray = _.orderBy(powerArray, function(o){ return o[tmpSortType]}, tmpSortOrder);
        
        powerArray.forEach(function(power,i) {
            //console.log("power",power.name);
            rows.push(<TR1 name={power.name} status={power.status} value={power.value} warning={power.warning} critical={power.critical} key={i} />);
            
        });

        var sortImgStyle = {"status": {style: {display: 'none'},src: 'img/table_sort_down.png'},
                            "name": {style: {display: 'none'},src: 'img/table_sort_down.png'},
                            "value": {style: {display: 'none'},src: 'img/table_sort_down.png'}};
        //(tmpSortOrder == "asc") ? false : (sortImgStyle[tmpSortType].display = "inline-block") ;
        if (tmpSortOrder == "asc")
        {
            sortImgStyle[tmpSortType].style = {display: "inline-block"};
            sortImgStyle[tmpSortType].src = "img/table_sort_up.png";
        }
        else
        {
            sortImgStyle[tmpSortType].style = {display: "inline-block"};
            sortImgStyle[tmpSortType].src = "img/table_sort_down.png";
        }





        //******* Sort Array *******/
        var tmpSortType2 = this.state.sortType2.key;
        var tmpSortOrder2 = this.state.sortType2.order;
        var sortArray = [{type: "Average", data: averageData},
                         {type: "Minimum", data: minimumData},
                         {type: "Maximum", data: maximumData}];

        sortArray = _.orderBy(sortArray, function(o){
            switch (tmpSortType2)
            {
                case "hourValue":
                    return o.data.hour.value;
                case "hourTime":
                    return o.data.hour.time;
                case "dayValue":
                    return o.data.day.value;
                case "dayTime":
                    return o.data.day.time;
                case "weekValue":
                    return o.data.week.value;
                case "weekTime":
                    return o.data.week.time;
            }
             return o[tmpSortType2]
            }, tmpSortOrder2);

        var rows2 = [];
        var tmpRType = this.state.radioType;
        sortArray.forEach(function(data,i) {
            //console.log("power",power.name);
            rows2.push(<TR2 unit={tmpRType} type={data.type} data={data.data} key={i} />);
        });
        var sortImgStyle2 = {"type": {style: {display: 'none'},src: 'img/table_sort_down.png'},
                             "hourValue": {style: {display: 'none'},src: 'img/table_sort_down.png'},
                             "hourTime": {style: {display: 'none'},src: 'img/table_sort_down.png'},
                             "dayValue": {style: {display: 'none'},src: 'img/table_sort_down.png'},
                             "dayTime": {style: {display: 'none'},src: 'img/table_sort_down.png'},
                             "weekValue": {style: {display: 'none'},src: 'img/table_sort_down.png'},
                             "weekTime": {style: {display: 'none'},src: 'img/table_sort_down.png'}};
        //(tmpSortOrder2 == "asc") ? false : (sortImgStyle2[tmpSortType2].display = "inline-block") ;
        if (tmpSortOrder2 == "asc")
        {
            sortImgStyle2[tmpSortType2].style = {display: "inline-block"};
            sortImgStyle2[tmpSortType2].src = "img/table_sort_up.png";
        }
        else
        {
            sortImgStyle2[tmpSortType2].style = {display: "inline-block"};
            sortImgStyle2[tmpSortType2].src = "img/table_sort_down.png";
        }

        //******* Chart Options *******/

        var cOption = {
            legend: 'none',
            /*legend: {
                position: 'bottom',
                alignment: 'end',
            },*/
            enableInteractivity: false,
            colors: ['#5574C2', '#CCCE3C', '#F05238'],
            chartArea: {width: '87%',left: '53',height: '80%', top: '20'},
            vAxis: {
                baseline: 'none',
                //baselineColor: '#c8c8c8',
                textStyle: {
                    color: '#969696',
                    fontSize: 12
                },
                gridlines: {
                    count: 7,
                    //color: '#FFFFFF',
                },
            },
            hAxis: {
                //title: this.state.chartButtonSelect,
                gridlines: {
                    count: hGridCount,
                    color: '#FFFFFF',
                },
                textStyle: {
                    color: '#2F2F2F',
                    fontSize: 12
                },
                baseline: 'none',
                ticks: ticksAry,
                //baseline: 1000,
            }
        }

        //******* Power Control *******
        var tmpPowerOnStatus = this.powerControlData.powerOnStatus;
        var statusFont = tmpPowerOnStatus == "1" ? (<font color="#61a61f" >ON</font>) : (<font color="#777777" >OFF</font>);

        var content = (this.state.page == "PM") ? (
            <div style={style.container} >
                <p style={style.infoTitle} >Present Reading</p>
                <div style={style.info} >
                    {/******* Present Reading Table *******/}
                    <table id="stripedTable">
                        <thead>
                            <tr>
                                <th style={style.th1} onClick={this.sortClickHandle1.bind(this,"status")} >Status <img src={sortImgStyle["status"].src} style={sortImgStyle["status"].style} /></th>
                                <th style={style.th2} onClick={this.sortClickHandle1.bind(this,"name")} >Probe Name <img src={sortImgStyle["name"].src} style={sortImgStyle["name"].style} /></th>
                                <th style={style.th3} onClick={this.sortClickHandle1.bind(this,"value")} >Reading <img src={sortImgStyle["value"].src} style={sortImgStyle["value"].style} /></th>
                                <th style={[style.th2,{cursor: 'context-menu'}]} >Warning Threshold</th>
                                <th style={[style.th4,{cursor: 'context-menu'}]} >Critical Threshold</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows}
                        </tbody>
                    </table>
                    <p style={style.textTitle}>{rowsSpan1}</p>
                

                    <div style={style.divHori}></div>

                    <p style={style.infoTitle2}>
                        Power Consumption History And Graph
                    </p>

                    {/******* PSU Button *******/}
                    <div style={style.psuBtnDiv}>
                        <button style={this.state.buttonSelect == "PSU1" ? style.psuBtn.active : style.psuBtn.inactive} value="PSU1" onClick={this.onPsuClick.bind(this)} >PSU1</button>
                        <button style={this.state.buttonSelect == "PSU2" ? style.psuBtn.active : style.psuBtn.inactive} value="PSU2" onClick={this.onPsuClick.bind(this)} >PSU2</button>
                        <br />
                        
                    </div>
                    {/******* Unit Radio Button *******/}
                    <div style={style.radioDiv}>
                        {/*<input type="radio" name="unitType" value="Watts" checked={this.state.radioType == 'Watts'} onChange={this.onRadioChange.bind(this)} /><span style={{position:'inline-block',paddingRight:'15px'}}>Watts</span>
                        <input type="radio" name="unitType" value="Amps" checked={this.state.radioType == 'Amps'} onChange={this.onRadioChange.bind(this)} />Amps*/}
                        <RadioButton name="Watts" clickFunc={this.typeRadioClickFunc.bind(this)} currentName={this.state.radioType} disabled={false} key={Math.random()}/> <span style={{position:'inline-block',paddingRight:'15px'}}>Watts</span>
                        <RadioButton name="Amps" clickFunc={this.typeRadioClickFunc.bind(this)} currentName={this.state.radioType} disabled={false} key={Math.random()}/> Amps
                    </div>

                    {/******* Power Statistics Table *******/}
                    <table id="stripedTable" style={{position: 'relative', top: '55px'}}>
                        <thead>
                            <tr>
                                <th style={{width:'12%',minWidth:'102px'}} onClick={this.sortClickHandle2.bind(this,"type")} >Power Statistics <img src={sortImgStyle2["type"].src} style={sortImgStyle2["type"].style} /></th>
                                <th style={{width:'8%'}} onClick={this.sortClickHandle2.bind(this,"hourValue")} >Last Hour <img src={sortImgStyle2["hourValue"].src} style={sortImgStyle2["hourValue"].style} /></th>
                                <th style={{width:'20%'}} onClick={this.sortClickHandle2.bind(this,"hourTime")} >Time <img src={sortImgStyle2["hourTime"].src} style={sortImgStyle2["hourTime"].style} /></th>
                                <th style={{width:'10%'}} onClick={this.sortClickHandle2.bind(this,"dayValue")} >Last 24 Hours <img src={sortImgStyle2["dayValue"].src} style={sortImgStyle2["dayValue"].style} /></th>
                                <th style={{width:'20%'}} onClick={this.sortClickHandle2.bind(this,"dayTime")} >Time <img src={sortImgStyle2["dayTime"].src} style={sortImgStyle2["dayTime"].style} /></th>
                                <th style={{width:'10%'}} onClick={this.sortClickHandle2.bind(this,"weekValue")} >Last 7 Days <img src={sortImgStyle2["weekValue"].src}  style={sortImgStyle2["weekValue"].style} /></th>
                                <th style={{width:'20%'}} onClick={this.sortClickHandle2.bind(this,"weekTime")} >Time <img src={sortImgStyle2["weekTime"].src} style={sortImgStyle2["weekTime"].style} /></th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows2}
                            {/*<TR2 unit={this.state.radioType} type="Average" data={averageData} />
                            <TR2 unit={this.state.radioType} type="Minimum" data={minimumData} />
                            <TR2 unit={this.state.radioType} type="Maximum" data={maximumData} />*/}
                        </tbody>
                    </table>

                    <div style={style.chartDiv}>
                        <div style={style.chartButtonDiv}>
                            <button style={style.level2} value="hour" onClick={this.onChartButtonClick.bind(this)}>
                                <p style={this.state.chartButtonSelect == "hour" ? style.titleLevel2.active : style.titleLevel2.inactive}>Last Hour</p>
                            </button>
                            <button style={style.level2} value="day" onClick={this.onChartButtonClick.bind(this)}>
                                <p style={this.state.chartButtonSelect == "day" ? style.titleLevel2.active : style.titleLevel2.inactive}>Last Day</p>
                            </button>
                            <button style={style.level2} value="week" onClick={this.onChartButtonClick.bind(this)}>
                                <p style={this.state.chartButtonSelect == "week" ? style.titleLevel2.active : style.titleLevel2.inactive}>Last Week</p>
                            </button>
                        </div>

                        <div style={{float: 'left',position: 'relative',width: 'calc(100% - 100px)',height:'80%', cursor: 'context-menu'}}>
                            <Chart chartType="LineChart" data={cData} options={cOption} graph_id="LineChart"  width={"99%"} height={"100%"}  legend_toggle={false} />
                            <div style={style.legendDiv}>
                                <RectLegend unit={this.state.radioType} type="Average"/>
                                <RectLegend unit={this.state.radioType} type="Minimum"/>
                                <RectLegend unit={this.state.radioType} type="Maximum"/>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        )
        :
        (
            <div style={style.container} >
                <p style={style.infoTitle} >Current Power Status: {statusFont}</p>

                <div style={style.info} >
                    <div style={style.pcRadioDiv}>
                        {/*<input type="radio" name="unitType" value="powerOnSystem" checked={this.state.pcRadio == 'powerOnSystem'} onChange={this.onPCRadioChange.bind(this)} />Power On System
                        <br/>
                        <input type="radio" name="unitType" value="powerOffSystem" checked={this.state.pcRadio == 'powerOffSystem'} onChange={this.onPCRadioChange.bind(this)} />Power Off System
                        <br/>
                        <input type="radio" name="unitType" value="powerOffSystemImmediately" checked={this.state.pcRadio == 'powerOffSystemImmediately'} onChange={this.onPCRadioChange.bind(this)} />Power Off System Immediately
                        <br/>
                        <input type="radio" name="unitType" value="resetSystem" checked={this.state.pcRadio == 'resetSystem'} onChange={this.onPCRadioChange.bind(this)} />Reset System (warm boot)
                        <br/>
                        <input type="radio" name="unitType" value="powerCycleSystem" checked={this.state.pcRadio == 'powerCycleSystem'} onChange={this.onPCRadioChange.bind(this)} />Power Cycle System (cold boot)
                        <br/>*/}
                        <p><RadioButton name="powerOnSystem" clickFunc={this.radioClickFunc.bind(this)} currentName={this.state.pcRadio} disabled={(tmpPowerOnStatus==1)} key={Math.random()}/> Power On System</p>
                        <p><RadioButton name="powerOffSystem" clickFunc={this.radioClickFunc.bind(this)} currentName={this.state.pcRadio} disabled={(tmpPowerOnStatus==0)}  key={Math.random()}/> Power Off System</p>
                        <p><RadioButton name="powerOffSystemImmediately" clickFunc={this.radioClickFunc.bind(this)} currentName={this.state.pcRadio} disabled={(tmpPowerOnStatus==0)}  key={Math.random()}/> Power Off System Immediately</p>
                        <p><RadioButton name="resetSystem" clickFunc={this.radioClickFunc.bind(this)} currentName={this.state.pcRadio} disabled={(tmpPowerOnStatus==0)}  key={Math.random()}/> Reset System (warm boot)</p>
                        <p><RadioButton name="powerCycleSystem" clickFunc={this.radioClickFunc.bind(this)} currentName={this.state.pcRadio} disabled={false}  key={Math.random()}/> Power Cycle System (cold boot)</p>
                    </div>

                    <div style={{position:'relative',top:'20px'}}>
                        <button style={style.stdButton} onClick={this.onClickTest.bind(this)}>
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        )

        return (
            <div style={style.mainPanel} >
                <div style={style.north} >
                    <div style={style.title}>
                        <button style={this.state.page=='PM' ? style.span1 : style.span2} value="PM" onClick={this.onPageClick.bind(this)}>Power Monitoring</button>
                        <button style={this.state.page=='PC' ? style.span1 : style.span2} value="PC" onClick={this.onPageClick.bind(this)}>Power Control</button>
                    </div>
                </div>
                {content}
            </div>
        );
    }
};

class TR1 extends React.Component {
    render() {
        var imgSrc = () => {
            switch (Math.abs(this.props.status))
            {
                case 0:
                    return "img/ok_s.png";
                case 1:
                    return "img/warning_s.png";
                case 2:
                    return "img/error_s.png";
                default:
                    return "img/error_s.png";
            }
        }
        return(
            <tr>
                <td style={{textAlign: 'center'}}><img src={imgSrc()} /></td>
                <td>{this.props.name}</td>
                <td>{this.props.value.toFixed(2)} W</td>
                <td>Min {this.props.warning.minimum}; Max {this.props.warning.maximum}</td>
                <td>Min {this.props.critical.minimum}; Max {this.props.critical.maximum}</td>
            </tr>
        )
    }
}

class TR2 extends React.Component {
    handleDateTime(v) {
        if (!(v instanceof Date))
            return v;

        var rst = moment(v).format("YYYY/MM/DD HH:mm:ss");
        return rst;
    }
    render() {
        
        
        var unit = this.props.unit == "Watts" ? "W" : "A";
        var type = this.props.type;
        var data = this.props.data;
        var rectColor = '';
        switch (type)
        {
            case "Average":
                rectColor = '#5574c2'
                break;
            case "Minimum":
                rectColor = '#ccce3c'
                break;
            case "Maximum":
                rectColor = '#f05238'
                break;
        }
        var rect = (<div style={{width: '10px', height: '10px', background: rectColor, float: 'left', position: 'relative', top: '2px'}}></div>);
        var title = (<span>{type}({unit})</span>);
        return(
            <tr>
                <td>{rect}&nbsp;{title}</td>
                <td>{data.hour.value.toFixed(2)}</td>
                <td>{this.handleDateTime(data.hour.time)}</td>
                <td>{data.day.value.toFixed(2)}</td>
                <td>{this.handleDateTime(data.day.time)}</td>
                <td>{data.week.value.toFixed(2)}</td>
                <td>{this.handleDateTime(data.week.time)}</td>
            </tr>
        )
    }
}

class Span1 extends React.Component {
    render() {
        var str = this.props.name + ": " + this.props.ampere + " AMP, " + this.props.voltage + " Volts";
        return(
            <span style={style.span3}>
                {str}
            </span>
        );
    }
}

class RectLegend extends React.Component {
    render() {
        var unit = this.props.unit == "Watts" ? "W" : "A";
        var type = this.props.type;
        var title = (<span style={{fontSize: '12px'}}>{type}({unit})</span>);
        var rectColor = '';
        switch (type)
        {
            case "Average":
                rectColor = '#5574c2'
                break;
            case "Minimum":
                rectColor = '#ccce3c'
                break;
            case "Maximum":
                rectColor = '#f05238'
                break;
        }
        var rect = (<div style={{width: '10px', height: '10px', background: rectColor, float: 'left', position: 'relative', top: '6px'}}></div>);
        return(
            <div style={{float: 'left', paddingRight: '10px'}}>{rect}&nbsp;{title}</div>
        )
    }
}

class RadioButton extends React.Component {
    constructor(props) {
        super(props);
        var tmpImgSrc;
        switch (this.props.disabled)
        {
            case true:
                this.state = {
                    imgSrc: "img/btn_radio_disable.png"
                }
                break;
            case false:
                this.state = {
                    imgSrc: this.props.name == this.props.currentName ? "img/btn_radio_pressed.png" : "img/btn_radio.png"
                }
                break;
        }
        
    }
    handleClick() {
        /*switch (this.state.imgSrc)
        {
            case "img/btn_radio.png":
            case "img/btn_radio_over.png":
                this.setState({
                    imgSrc: "img/btn_radio_pressed.png"
                })
                break;
        }*/
        
        /*this.setState({
            imgSrc: this.props.name == this.props.currentName ? "img/btn_radio_pressed.png" : "img/btn_radio.png"
        });*/
        switch (this.props.disabled)
        {
            case true:
                break;
            case false:
                this.props.clickFunc(this.props.name);
                break;
        }
    }
    handleMouseOver() {
        switch (this.state.imgSrc)
        {
            case "img/btn_radio.png":
                this.setState({
                    imgSrc: "img/btn_radio_over.png"
                })
                break;
            case "img/btn_radio_pressed.png":
                this.setState({
                    imgSrc: "img/btn_radio_pressedover.png"
                })
                break;
        }
    }
    handleMouseOut() {
        switch (this.state.imgSrc)
        {
            case "img/btn_radio.png":
            case "img/btn_radio_over.png":
                this.setState({
                    imgSrc: "img/btn_radio.png"
                })
                break;
            case "img/btn_radio_pressed.png":
            case "img/btn_radio_pressedover.png":
                this.setState({
                    imgSrc: "img/btn_radio_pressed.png"
                })
                break;
        }
    }
    render() {
        //var tmpSrc = this.props.name == this.props.currentName ? "img/btn_radio_pressed.png" : "img/btn_radio.png";
        return(
            <img src={this.state.imgSrc} onClick={this.handleClick.bind(this)} onMouseOver={this.handleMouseOver.bind(this)} onMouseOut={this.handleMouseOut.bind(this)} />
        );
    }
}

const style = {
    mainPanel: {
        position: 'relative',
        width: '100%',
        height: '100%',
    },
    north: {
        position: 'relative',
        height: '40px',
        borderTop: '1px solid #ffffff',
        borderBottom: '1px solid #d9d9d9',
        padding: '0 0 0 36px'
    },
    title: {
        //margin: '15px 0 0 0',
        position: 'absolute',
        bottom: '0px',
        fontSize: '14px',
        color: '#2f2f2f',
        fontWeight: 'bold'
    },
    span1: {
        //lineHeight: '15px',
        //width: '130px',
        borderBottom: '2px solid #2f2f2f',
        cursor: 'pointer',
        position: 'relative',
        textAlign: 'center',
        display: 'inline-block',
        background: '#ffffff',
        padding: '0 25px 0 25px',
    },
    span2: {
        //lineHeight: '15px',
        //width: '130px',
        //borderBottom: '2px solid #2f2f2f',
        cursor: 'pointer',
        position: 'relative',
        textAlign: 'center',
        background: '#ffffff',
        padding: '0 25px 0 25px',
    },
    info: {
        position: 'absolute',
        top: '52px',
        left: '36px',
        width: 'calc(100% - 72px)',
        border: 'none',
        paddingBottom: '30px',
    },
    infoTitle: {
        position: 'absolute',
        top: '30px',
        left: '36px',
        fontSize: '12px',
        color: '#2f2f2f'
    },
    textTitle: {
        position: 'relative',
        top: '10px',
        fontSize: '12px',
        color: '#777777'
    },
    container: {
        position: 'relative'
    },
    th1: {
        width: '10%',
        padding: '0 0 0 10px',
        height: '28px',
        borderRight: '1px solid #a1a9bb',
        cursor: 'pointer',
    },
    th2: {
        width: '20%',
        padding: '0 0 0 10px',
        height: '28px',
        borderRight: '1px solid #a1a9bb',
        cursor: 'pointer',
    },
    th3: {
        width: '15%',
        padding: '0 0 0 10px',
        height: '28px',
        borderRight: '1px solid #a1a9bb',
        cursor: 'pointer',
    },
    th4: {
        width: '20%',
        padding: '0 0 0 10px',
        height: '28px',
        cursor: 'pointer',
    },
    span3: {
        display: 'inline-block',
        paddingRight: '20px',
    },
    divHori: {
        position: 'relative',
        //height: '40px',
        //left: '36px',
        top: '15px',
        //borderTop: '1px solid #ffffff',
        borderBottom: '1px solid #d9d9d9',
        padding: '0 0 0 36px',
        width: '100%',
    },
    infoTitle2: {
        position: 'relative',
        top: '30px',
        //left: '36px',
        fontSize: '12px',
        color: '#2f2f2f'
    },
    psuBtn: {
        active: {
            fontSize: '12px',
            background: '#4b82f2',
            height: '28px',
            width: '132px',
            borderColor: '#4b82f2',
            borderStyle: 'solid',
            //borderRadius: '8px',
            borderWidth: '1px',
            color: '#ffffff',
            //margin: '0 8px 15px 0',
            paddingTop: '4px',
        },
        inactive: {
            fontSize: '12px',
            background: '#ffffff',
            height: '28px',
            width: '132px',
            borderColor: '#4b82f2',
            borderStyle: 'solid',
            //borderRadius: '8px',
            borderWidth: '1px',
            color: '#4b82f2',
            //margin: '0 8px 15px 0',
            paddingTop: '4px',
        }
    },
    psuBtnDiv: {
        position: 'relative',
        top: '30px',
        //left: '36px',
    },

    radioDiv: {
        position: 'relative',
        top: '40px',
        //left: '36px',
        fontSize: '12px',
        cursor: 'context-menu',
    },
    chartDiv: {
        position: 'relative',
        top: '70px',
        width: '660px',
        height: '238px',
        border: '1px solid #d9d9d9',
    },
    chartButtonDiv: {
        width: '100px',
        height: '100%',
        float: 'left',
        borderRight: '1px solid #d9d9d9'
    },
    level2: {
        position: 'relative',
        //height: '32px',
        width: '100%',
        background: 'rgba(0, 0, 0, 0)',
        left: '8px',
        fontSize: '12px',
        color: '#2f2f2f',
        textAlign: 'left',
        marginTop: '20px',
        //borderLeft: '2px solid #2f2f2f',
    },
    titleLevel2: {
        active: {
            borderLeft: '2px solid #2f2f2f',
            paddingLeft: '8px',
            marginBottom: '0px',
        },
        inactive: {
            borderLeft: '2px solid #ffffff',
            //borderColor: 'rgba(0, 0, 0, 0)',
            paddingLeft: '8px',
            marginBottom: '0px',
        }
        
    },
    legendDiv : {
        position: 'absolute',
        top: '203px',
        right: '22px',
    },
    pcRadioDiv: {
        position: 'relative',
        left: '10px',
        top: '10px',
        fontSize: '12px',
    },
    stdButton: {
        minWidth:'80px',
        height:'30px',
        padding: '0 22px 0 22px',
        background:'#ffffff',
        borderWidth: '1px',
        borderColor: '#707070',
        borderStyle: 'solid',
        fontSize:'14px',
        fontWeight: 'bold',
        color: '#2f2f2f',
        margin:'0 auto',
        outline:'1px',
        ':hover': {borderColor: '#707070', color: '#707070',},
        ':active': {borderColor: '#2f2f2f', color: '#2f2f2f',},
    }
};

module.exports = Radium(Power);