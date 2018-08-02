import Radium from "radium";
import React from "react";
import MainStore from "../stores/MainStore";
import * as MainActions from "../actions/MainActions";

class Frameset extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loginState: this.props.loginState,
            user: localStorage.getItem("LSuserNameC"),
            ip: localStorage.getItem("LSIPC")==null ? '' : localStorage.getItem("LSIPC"),
            modelName: localStorage.getItem("LSMLC")==null ? '' : localStorage.getItem("LSMLC"),
        };
        this.getInfoData = this.getInfoData.bind(this);
        this.infoData = '';
    }
    componentWillMount() {
        MainStore.on("loginUpdate", () => {
            this.setState({
                //page: MainStore.getPage()
                user: localStorage.getItem("LSuserNameC"),
                ip: '',
                loginState: true,
            });
        });

        MainStore.on("loguot", () => {
            localStorage.removeItem("LSuserNameC");
            localStorage.removeItem("LSIPC");
            localStorage.removeItem("LSMLC");
            this.setState({
                user: '',
                ip: '',
                loginState: false,
            });
        });
        MainStore.on("getInfoCgiSuccess", this.getInfoData);
    }

    getInfoData() {
        this.infoData = MainStore.getInfoData();
        console.log("infoData",this.infoData);
        localStorage.setItem("LSIPC", this.infoData.network.ipv4);
        localStorage.setItem("LSMLC", this.infoData.device.model);
        this.setState({
            ip: this.infoData.network.ipv4,
            modelName: this.infoData.device.model,
        })
    }

    refreshClick() {
        //location.reload();
        MainActions.refreshPage();
    }

    logoutClick() {
        MainActions.logOut();
    }
    printClick() {
        window.print();
    }
    render() {
        var userStr = '';
        var ipStr = '';
        var divToolIcon = '';
        if (this.state.loginState)
        {
            var userStr = "Local User: " + this.state.user;
            var ipStr = "IP: " + this.state.ip;
            var modelStr = "System Model Name: " + this.state.modelName;

            divToolIcon = (
                <div>
                    <button style={style.btnPrint} onClick={this.printClick.bind(this)} />
                    <button style={style.btnRefresh} onClick={this.refreshClick.bind(this)} />
                    <button style={style.btnHelp} />
                    <button style={style.btnLogout} onClick={this.logoutClick.bind(this)} />
                </div>
            )
        }
        
        return (
            <div style={style.divFrameset}>
                <img src="img/qnap.png" style={style.divIcon} />
                <div style={style.divInfo}>
                    <p>{userStr}</p>
                    <p>{modelStr}&nbsp;&nbsp;&nbsp;&nbsp;{ipStr}</p>
                </div>
                {divToolIcon}
            </div>
        );
    }
};

const style = {
    divFrameset: {
        position: 'relative',
        height: '44px',
        width: '100%',
        background: 'url(img/banner.png) top left / cover no-repeat'
    },
    divIcon: {
        position: 'absolute',
        left: '30px',
        top: '13px'
    },
    divInfo: {
        position: 'relative',
        left: '220px',
        top: '0px',
        fontSize: '12px',
        lineHeight: '4px',
        padding: '12px 0 0 0',
        color: '#afe7f8',
    },
    btnPrint: {
        position: 'absolute',
        right: '130px',
        top: '12px',
        width: '20px',
        height: '20px',
        background: 'url(img/print.png) top left / cover no-repeat'
    },
    btnRefresh: {
        position: 'absolute',
        right: '95px',
        top: '12px',
        width: '20px',
        height: '20px',
        background: 'url(img/refresh.png) top left / cover no-repeat'
    },
    btnHelp: {
        position: 'absolute',
        right: '60px',
        top: '12px',
        width: '20px',
        height: '20px',
        background: 'url(img/help.png) top left / cover no-repeat'
    },
    btnLogout: {
        position: 'absolute',
        right: '25px',
        top: '12px',
        width: '20px',
        height: '20px',
        background: 'url(img/Logout.png) top left / cover no-repeat'
    }
};

module.exports = Radium(Frameset);