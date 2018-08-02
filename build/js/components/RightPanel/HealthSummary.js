import Radium from "radium";
import React from "react";
import MainStore from "../../stores/MainStore";
import * as MainActions from "../../actions/MainActions";

class HealthSummary extends React.Component {
    constructor(props) {
        super(props);
        this.getHealthData = this.getHealthData.bind(this);

        this.state = {
            //Health
            healthFan: 0,
            healthPower: 0,
            healthThermal: 0,
            healthVoltage: 0,
            sortType: {key: "status", order: "asc"},
            healthData: [   {name: "Fans", status: ""},
                            {name: "Temperatures", status: ""},
                            {name: "VRMs", status: ""},
                            {name: "Power Supplies", status: ""},
                        ]
        };
    }
    componentWillMount() {
        MainStore.on("getHealthCgiSuccess", this.getHealthData);
        
        this.token = localStorage.getItem("LStoken");
        this.healthData = '';

        //console.log("count", MainStore.listenerCount("getInfoCgiSuccess"));
    }
    componentDidMount() {
        MainActions.getHealthCgi(this.token);
        setTimeout(()=>{MainActions.setLoadingDIV(1)},1);
    }

    componentWillUnmount() {
        MainStore.removeListener("getHealthCgiSuccess", this.getHealthData);
    }

    getHealthData() {
        this.healthData = MainStore.getHealthData();
        //console.log(this.healthData);
        this.setState({
            healthFan: this.healthData.fan,
            healthPower: this.healthData.power,
            healthThermal: this.healthData.thermal,
            healthVoltage: this.healthData.voltage,
            healthData: [   {name: "Fans", status: Math.abs(this.healthData.fan)},
                            {name: "Temperatures", status: Math.abs(this.healthData.thermal)},
                            {name: "VRMs", status: Math.abs(this.healthData.voltage)},
                            {name: "Power Supplies", status: Math.abs(this.healthData.power)},
                        ]
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
        if (this.healthData == '')
            return false;

        var healthArray = this.state.healthData;
        var rows = [];
        var tmpSortType = this.state.sortType.key;
        var tmpSortOrder = this.state.sortType.order;

        healthArray = _.orderBy(healthArray, function(o){ return o[tmpSortType]}, tmpSortOrder);

        healthArray.forEach(function(fan,i) {
            //console.log("fan",fan);
            rows.push(<TR name={fan.name} status={fan.status} key={i} />);
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

        return (
            <div style={style.mainPanel} >
                <div style={style.north} >
                    <p style={style.title} >Health Summary</p>
                </div>
                <div style={style.container} >
                    <p style={style.infoTitle} >Subsystems and Devices</p>
                    <div style={style.info} >
                        <table id="stripedTable">
                            <thead>
                                <tr>
                                    <th style={style.th1} onClick={this.sortClickHandle.bind(this,"status")}>Serverity <img src={sortImgStyle["status"].src} style={sortImgStyle["status"].style} /></th>
                                    <th style={style.th2} onClick={this.sortClickHandle.bind(this,"name")}>Subsystems and Devices <img src={sortImgStyle["name"].src} style={sortImgStyle["name"].style} /></th>
                                </tr>
                            </thead>
                            <tbody>
                                {/*<TR name="Fans" status={this.state.healthFan} index={1} />
                                <TR name="Temperatures" status={this.state.healthThermal} index={2} />
                                <TR name="VRMs" status={this.state.healthVoltage} index={3} />
                                <TR name="Power Supplies" status={this.state.healthPower} index={4} />*/}
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
            </tr>
        );
    }
};

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
        border: 'none'
    },

    th1: {
        width: '10%',
        padding: '0 0 0 10px',
        height: '28px',
        borderRight: '1px solid #a1a9bb',
        cursor: 'pointer',
    },
    th2: {
        width: '90%',
        padding: '0 0 0 10px',
        height: '28px',
        cursor: 'pointer',
    },
};

module.exports = Radium(HealthSummary);