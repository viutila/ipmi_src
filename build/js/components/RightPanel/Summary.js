import Radium from "radium";
import React from "react";
import MainStore from "../../stores/MainStore";
import * as MainActions from "../../actions/MainActions";

class Summary extends React.Component {

    constructor(props) {
        super(props);
        this.getInfoData = this.getInfoData.bind(this);
        this.getHealthData = this.getHealthData.bind(this);
        this.getPowerControlData = this.getPowerControlData.bind(this);

        this.state = {

            //Device
            systemModel: '',
            systemHostName: '',
            firmwareVersion: '',
            ecVersion: '',
            biosVersion: '',

            //Network
            bmcMacAddr: '',
            v4NetworkMode: '',
            ipv4Addr: '',
            v6NerworkMode: '',
            ipv6Addr: '',

            //Health
            healthFan: 0,
            healthPower: 0,
            healthThermal: 0,
            healthVoltage: 0,

            //Power Control
            powerControl: '',
        };
    }
    
    componentWillMount() {
        MainStore.on("getInfoCgiSuccess", this.getInfoData);
        MainStore.on("getHealthCgiSuccess", this.getHealthData);
        MainStore.on("getPowerControlCgiSuccess", this.getPowerControlData);
        
        this.token = localStorage.getItem("LStoken");

        this.infoData = '';
        this.healthData = '';
        this.powerControlData = '';

        //console.log("count", MainStore.listenerCount("getInfoCgiSuccess"));
    }

    componentDidMount() {
        MainActions.getInfoCgi(this.token);
        MainActions.getHealthCgi(this.token);
        MainActions.getPowerControlCgi(this.token);
        setTimeout(()=>{MainActions.setLoadingDIV(1)},1);
    }

    componentWillUnmount() {
        MainStore.removeListener("getInfoCgiSuccess", this.getInfoData);
        MainStore.removeListener("getHealthCgiSuccess", this.getHealthData);
        MainStore.removeListener("getPowerControlCgiSuccess", this.getPowerControlData);
    }

    getInfoData() {
        this.infoData = MainStore.getInfoData();
        console.log("infoData",this.infoData);
        this.setState({
            systemModel: this.infoData.device.model,
            ecVersion: this.infoData.device.ecVersion,
            biosVersion: this.infoData.device.biosVersion,
            
            ipv4Addr: this.infoData.network.ipv4,
            bmcMacAddr: this.infoData.network.mac,
        })
    }

    getHealthData() {
        this.healthData = MainStore.getHealthData();
        console.log("healthData",this.healthData);
        this.setState({
            healthFan: this.healthData.fan,
            healthPower: this.healthData.power,
            healthThermal: this.healthData.thermal,
            healthVoltage: this.healthData.voltage,
        })
        setTimeout(()=>{MainActions.setLoadingDIV(0)},1);
    }

    getPowerControlData() {
        this.powerControlData = MainStore.getPowerControlData();
        console.log("powerControlData",this.powerControlData);
        this.setState({
            powerControl: this.powerControlData,
        })
    }

    imgSrc(v) {
        switch (Math.abs(v))
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

    setPage(v) {
        MainActions.setPage(v);
    }

    render() {
        if (this.healthData == '' || this.infoData == '' || this.powerControlData == '')
        {
            return false;
        }
        var tmpPowerOnStatus = this.powerControlData.powerOnStatus;
        return (
            <div style={style.mainPanel} >
                <div style={style.north} >
                    <p style={style.title} >Summary</p>
                </div>
                <div style={style.container} >
                    <p style={style.infoTitle} >Information</p>
                    <div style={style.info} >
	                    <table style={style.table1}>
	                        <thead style={style.thead} >
                                <tr>
                                    <th>Device</th>
                                </tr>
                            </thead>
                            <tbody style={style.tbody} >
                                <tr>
                                    <td style={style.td1} >System Model Name</td>
                                    <td style={style.td2} >{this.state.systemModel}</td>
                                </tr>
                                {/*
                                <tr>
                                    <td style={style.td1} >System Host Name</td>
                                    <td style={style.td2} >{this.state.systemHostName}</td>
                                </tr>
                                */}
                                <tr>
                                    <td style={style.td1} >Firmware Version</td>
                                    <td style={style.td2} >{this.state.firmwareVersion}</td>
                                </tr>
                                <tr>
                                    <td style={style.td1} >EC Version</td>
                                    <td style={style.td2} >{this.state.ecVersion}</td>
                                </tr>
                                <tr>
                                    <td style={style.td1} >BIOS Version</td>
                                    <td style={style.td2} >{this.state.biosVersion}</td>
                                </tr>
                            </tbody>
                        </table>
                        <table>
	                        <thead style={style.thead} >
                                <tr>
                                    <th>Network</th>
                                </tr>
                            </thead>
                            <tbody style={style.tbody} >
                                <tr>
                                    <td style={style.td1} >BMC MAC Address</td>
                                    <td style={style.td2} >{this.state.bmcMacAddr}</td>
                                </tr>
                                <tr>
                                    <td style={style.td1} >V4 Network Mode</td>
                                    <td style={style.td2} >{this.state.v4NetworkMode}</td>
                                </tr>
                                <tr>
                                    <td style={style.td1} >IPv4 Address</td>
                                    <td style={style.td2} >{this.state.ipv4Addr}</td>
                                </tr>
                                <tr>
                                    <td style={style.td1} >V6 Network Mode</td>
                                    <td style={style.td2} >{this.state.v6NerworkMode}</td>
                                </tr>
                                <tr>
                                    <td style={style.td1} >IPv6 Address</td>
                                    <td style={style.td2} >{this.state.ipv6Addr}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <p style={style.consoleTitle} >Remote Console View</p>
                    <div style={style.console} >
                    </div>

                    <p style={style.powerTitle} >Power Control via IPMI</p>
                    <div style={style.power} >
                        <p style={style.thead} >Host Status: {tmpPowerOnStatus==1 ? (<font color="#61a61f" >ON</font>) : (<font color="#777777" >OFF</font>)}</p>
                        <button style={style.powerBtn} >Power On</button>
                        <button style={style.powerBtn} >Power Off</button>
                        <button style={style.powerBtn} >Power Off System Immediately</button>
                        <br />
                        <button style={style.powerBtn} >Power Reset</button>
                        <button style={style.powerBtn} >Power Cycle System</button>
                    </div>

                    <p style={style.healthTitle} >Server Health</p>
                    <div style={style.health} >
	                    <table style={style.table2}>
                            <tbody style={style.tbody} >
                                <tr>
                                    <td style={style.td3} ><img src={this.imgSrc(this.state.healthFan)} style={style.statusIcon} /><span style={style.span1} onClick={this.setPage.bind(this,'Fan')}>Fans</span></td>
                                    <td style={style.td3} ><img src={this.imgSrc(this.state.healthThermal)} style={style.statusIcon} /><span style={style.span1} onClick={this.setPage.bind(this,'Thermal')}>Temperatures</span></td>
                                </tr>
                                <tr>
                                    <td style={style.td3} ><img src={this.imgSrc(this.state.healthPower)} style={style.statusIcon} /><span style={style.span1} onClick={this.setPage.bind(this,'Power')}>Power Supplies</span></td>
                                    <td style={style.td3} ><img src={this.imgSrc(this.state.healthVoltage)} style={style.statusIcon} /><span style={style.span1} onClick={this.setPage.bind(this,'Voltage')}>Voltages</span></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
};

const style = {
    mainPanel: {
        position: 'relative',
        width: '100%',
        height: '100%',
        minWidth: '1134px',
        minHeight: '584px'
    },
    north: {
        position: 'relative',
        height: '40px',
        //width: '100%',
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
        width: '510px',
        height: '280px',
        border: '1px solid #d9d9d9',
        padding: '20px 20px 20px 20px'
    },
    consoleTitle: {
        position: 'absolute',
        top: '30px',
        left: '588px',
        fontSize: '12px',
        color: '#2f2f2f'
    },
    console: {
        position: 'absolute',
        top: '52px',
        left: '588px',
        width: '510px',
        height: '280px',
        border: '1px solid #d9d9d9',
        background: 'url(img/console.png) top left / cover no-repeat'
    },
    powerTitle: {
        position: 'absolute',
        top: '356px',
        left: '36px',
        fontSize: '12px',
        color: '#2f2f2f'
    },
    power: {
        position: 'absolute',
        top: '378px',
        left: '36px',
        width: '510px',
        height: '134px',
        border: '1px solid #d9d9d9',
        padding: '20px 20px 20px 20px',
        lineHeight: '12px'
    },
    healthTitle: {
        position: 'absolute',
        top: '356px',
        left: '588px',
        fontSize: '12px',
        color: '#2f2f2f'
    },
    health: {
        position: 'absolute',
        top: '378px',
        left: '588px',
        width: '510px',
        height: '134px',
        border: '1px solid #d9d9d9',
        padding: '20px 20px 20px 20px',
        lineHeight: '12px'
    },
    table1: {
        margin: '0 0 15px 0'
    },
    table2: {
        margin: '0 0 0 0'
    },
    thead: {
        fontSize: '12px',
        color: '#2f2f2f',
        fontWeight: '900',
        margin: '0 0 20px 0'
    },
    tbody: {
        fontSize: '12px'
    },
    td1: {
        width: '235px',
        padding: '0 0 0 10px',
        color: '#777777'
    },
    td2: {
        width: '235px',
        padding: '0 0 0 10px',
        color: '#2f2f2f'
    },
    td3: {
        width: '235px',
        color: '#2f2f2f',
        height: '27px',
        verticalAlign: 'top'
    },
    powerBtn: {
        fontSize: '12px',
        background: 'rgba(0, 0, 0, 0)',
        height: '22px',
        borderColor: '#707070',
        borderStyle: 'solid',
        borderRadius: '8px',
        borderWidth: '1px',
        color: '#2f2f2f',
        margin: '0 8px 15px 0',
        padding: '0 22px 0 22px',
    },
    statusIcon: {
        margin: '0 5px 0 0'
    },
    span1: {
        textDecoration: 'underline',
        cursor: 'pointer',
    }
};

module.exports = Radium(Summary);