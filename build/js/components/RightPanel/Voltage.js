import Radium from "radium";
import React from "react";
import MainStore from "../../stores/MainStore";
import * as MainActions from "../../actions/MainActions";

class Voltage extends React.Component {

    constructor(props) {
        super(props);
        this.getVoltageData = this.getVoltageData.bind(this);

        this.state = {
            //voltage
            voltage: '',
            sortType: {key: "status", order: "asc"},
        };
    }

    componentWillMount() {
        MainStore.on("getVoltageCgiSuccess", this.getVoltageData);
        
        this.token = localStorage.getItem("LStoken");
        this.voltageData = '';

        MainActions.getVoltageCgi(this.token);
        setTimeout(()=>{MainActions.setLoadingDIV(1)},1);
        //console.log("count", MainStore.listenerCount("getInfoCgiSuccess"));
    }

    componentDidMount() {
        
    }

    componentWillUnmount() {
        MainStore.removeListener("getVoltageCgiSuccess", this.getVoltageData);
    }

    getVoltageData() {
        this.voltageData = MainStore.getVoltageData();
        console.log("voltageData",this.voltageData);
        this.setState({
            voltage: this.voltageData,
        })
        setTimeout(()=>{MainActions.setLoadingDIV(0)},1);
    }

    sortClickHandle(v) {
        if (this.state.sortType.key == v)
        {
            this.setState({
                sortType: {key: v, order: this.state.sortType.order=="asc" ? "desc" : "asc"}
            });
        }
        else
        {
            this.setState({
                sortType: {key: v, order: "desc"}
            });
        }
       
    }

    render() {
        if (this.voltageData == '')
            return false;

        var voltageArray = [];
        var rows = [];

        for (var i = 0; i < Object.keys(this.state.voltage).length; i++)
        {
            var x = this.state.voltage[Object.keys(this.state.voltage)[i]];
            for (var j = 0; j < x.length; j++)
            {
                x[j].status = Math.abs(x[j].status);
                voltageArray.push(x[j]);
            }
        }
        var tmpSortType = this.state.sortType.key;
        var tmpSortOrder = this.state.sortType.order;

        //voltageArray = _.sortBy(voltageArray, function(o){ return o[tmpSortType]});
        voltageArray = _.orderBy(voltageArray, function(o){ return o[tmpSortType]}, tmpSortOrder);

        voltageArray.forEach(function(voltage,i) {
            console.log("voltage",voltage.name);
            rows.push(<TR critical={voltage.critical} location={voltage.location} name={voltage.name} status={voltage.status} value={voltage.value} warning={voltage.warning} key={i} />);
        });
        var sortImgStyle = {"status": {style: {display: 'none'},src: 'img/table_sort_down.png'},
                            "name": {style: {display: 'none'},src: 'img/table_sort_down.png'},
                            "value": {style: {display: 'none'},src: 'img/table_sort_down.png'},
                            "location": {style: {display: 'none'},src: 'img/table_sort_down.png'}};
        //sortImgStyle[tempSortType].display = "inline-block";
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

        return (
            <div style={style.mainPanel} >
                <div style={style.north} >
                    <p style={style.title} >Voltage</p>
                </div>
                <div style={style.container} >
                    <p style={style.infoTitle} >Subsystems and Devices</p>
                    <div style={style.info} >
                        <table id="stripedTable">
                            <thead>
                                <tr>
                                    <th style={style.th1} onClick={this.sortClickHandle.bind(this,"status")}>Serverity <img src={sortImgStyle["status"].src} style={sortImgStyle["status"].style} /></th>
                                    <th style={style.th2} onClick={this.sortClickHandle.bind(this,"name")}>Voltage <img src={sortImgStyle["name"].src} style={sortImgStyle["name"].style} /></th>
                                    <th style={style.th3} onClick={this.sortClickHandle.bind(this,"value")}>Reading <img src={sortImgStyle["value"].src} style={sortImgStyle["value"].style} /></th>
                                    <th style={style.th3} onClick={this.sortClickHandle.bind(this,"location")}>Location <img src={sortImgStyle["location"].src} style={sortImgStyle["location"].style} /></th>
                                    <th style={[style.th2,{cursor: 'context-menu'}]} >Warning Threshold</th>
                                    <th style={[style.th4,{cursor: 'context-menu'}]} >Critical Threshold</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
};

class TR extends React.Component {
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
        return (
            <tr>
                <td style={{textAlign: 'center'}}><img src={imgSrc()} /></td>
                <td>{this.props.name}</td>
                <td>{this.props.value.toFixed(2)} V</td>
                <td>{this.props.location}</td>
                <td>Min {this.props.warning.minimum} V; Max {this.props.warning.maximum} V</td>
                <td>Min {this.props.critical.minimum} V; Max {this.props.critical.maximum} V</td>
            </tr>
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
        margin: '10px 0 0 0',
        fontSize: '14px',
        color: '#2f2f2f',
        fontWeight: '900'
    },
    container: {
        position: 'relative'
    },
    infoTitle: {
        position: 'absolute',
        top: '30px',
        left: '36px',
        fontSize: '12px',
        color: '#2f2f2f'
    },
    info: {
        position: 'absolute',
        top: '52px',
        left: '36px',
        width: 'calc(100% - 72px)',
        border: 'none',
        paddingBottom: '30px',
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
};

module.exports = Radium(Voltage);