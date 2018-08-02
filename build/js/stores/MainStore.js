import EventEmitter from "events";
import dispatcher from "../dispatcher";

class MainStore extends EventEmitter {
    constructor() {
        super();
        this.mainData = {
            page: 'Summary'
        };
        this.loginData = '';
        this.infoData = '';
        this.healthData = '';
        this.fanData = '';
        this.voltageData = '';
        this.thermalData = '';
        this.fruData = '';
        this.topologyData = '';
        this.loadingDIV = false;
        this.powerData = '';
        this.powerControlData = '';
        this.userData = '';
    }

    
//******* Paging *******
    getAll() {
        return this.mainData;
    }

    getPage() {
        return this.mainData.page;
    }

    setPage(v) {
        const myArray = ['Alert', 'Date And Time', 'Fan', 'FRU', 'Health Summary', 'Hardware Topology', 'Log', 'Network', 'Power', 'Summary', 'Thermal', 'Update And Reset', 'User', 'Voltage'];
        const pageSet = new Set(myArray);

        if ((pageSet.has(v)) && this.mainData.type !== v) {
            this.mainData.page = v;
            this.emit("chagePage");
        }
    }
    setLoadingDIV(v) {
        this.loadingDIV = v ? true : false;
        this.emit("setLoadingDIV");
    }
    getLoadingDIV() {
        return this.loadingDIV;
    }
// ******* Login *******
    loginUpdate(v) {
        this.loginData = v;
        console.log(this.loginData);
        this.emit("loginUpdate");
    }
    getLoginData() {
        return this.loginData;
    }
    loginError() {
        this.emit("loginError");
    }

    logout() {
        this.mainData.page = 'Summary';
        this.emit("loguot");
    }

// ******* RefreshPage *******/
    refreshPage() {
        this.emit("refreshPage");
    }
// ******* Info *******
    getInfoCgiSuccess(v) {
        this.infoData = v;
        this.emit("getInfoCgiSuccess");
    }
    getInfoData() {
        return this.infoData;
    }

// ******* Health *******
    getHealthCgiSuccess(v) {
        this.healthData = v;
        this.emit("getHealthCgiSuccess");
    }
    getHealthData() {
        return this.healthData;
    }
    
// ******* Fan *******
    getFanCgiSuccess(v) {
        this.fanData = v;
        this.emit("getFanCgiSuccess");
    }
    getFanData() {
        return this.fanData;
    }

// ******* Voltage *******
    getVoltageCgiSuccess(v) {
        this.voltageData = v;
        this.emit("getVoltageCgiSuccess");
    }
    getVoltageData() {
        return this.voltageData;
    }

// ******* Thermal *******
    getThermalCgiSuccess(v) {
        this.thermalData = v;
        this.emit("getThermalCgiSuccess");
    }
    getThermalData() {
        return this.thermalData;
    }

// ******* Fru *******
    getFruCgiSuccess(v) {
        this.fruData = v;
        this.emit("getFruCgiSuccess");
    }
    getFruData() {
        return this.fruData;
    }

// ******* Topology *******
    getTopologyCgiSuccess(v) {
        this.topologyData = v;
        this.emit("getTopologyCgiSuccess");
    }
    getTopologyData() {
        return this.topologyData;
    }

// ******* Power *******
    getPowerCgiSuccess(v) {
        this.powerData = v;
        this.emit("getPowerCgiSuccess");
    }
    getPowerData() {
        return this.powerData;
    }

// ******* Power Control *******
    getPowerControlCgiSuccess(v) {
        this.powerControlData = v;
        this.emit("getPowerControlCgiSuccess");
    }
    getPowerControlData() {
        return this.powerControlData;
    }

// ******* Post Power Control *******
    postPowerControlCgiSuccess() {
        this.emit("postPowerControlCgiSuccess");
    }

// ******* User *******
    getUserCgiSuccess(v) {
        this.userData = v;
        this.emit("getUserCgiSuccess");
    }
    getUserData() {
        return this.userData;
    }
    patchUserCgiSuccess() {
        this.emit("patchUserCgiSuccess");
    }
    deleteUserCgiSuccess() {
        this.emit("deleteUserCgiSuccess");
    }

    handleActions(action) {
        //console.log('MainStore received an action', action);
        switch (action.type) {
            case "SET_PAGE": {
                this.setPage(action.value);
                break;
            }
            case "SET_LOADING_DIV": {
                this.setLoadingDIV(action.value);
                break;
            }
            case "LOGIN_UPDATE": {
                this.loginUpdate(action.value);
                break;
            }
            case "LOGIN_ERROR": {
                this.loginError();
                break;
            }
            case "LOGOUT": {
                this.logout();
                break;
            }
            case "REFRESH_PAGE" :{
                this.refreshPage();
                break;
            }
            case "GETINFOCGI_SUCCESS": {
                this.getInfoCgiSuccess(action.value);
                break;
            }
            case "GETHEALTHCGI_SUCCESS": {
                this.getHealthCgiSuccess(action.value);
                break;
            }
            case "GET_FAN_CGI_SUCCESS": {
                this.getFanCgiSuccess(action.value);
                break;
            }
            case "GET_VOLTAGE_CGI_SUCCESS": {
                this.getVoltageCgiSuccess(action.value);
                break;
            }
            case "GET_THERMAL_CGI_SUCCESS": {
                this.getThermalCgiSuccess(action.value);
                break;
            }
            case "GET_FRU_CGI_SUCCESS": {
                this.getFruCgiSuccess(action.value);
                break;
            }
            case "GET_TOPOLOGY_CGI_SUCCESS": {
                this.getTopologyCgiSuccess(action.value);
                break;
            }
            case "GET_POWER_CGI_SUCCESS": {
                this.getPowerCgiSuccess(action.value);
                break;
            }
            case "GET_POWER_CONTROL_CGI_SUCCESS": {
                this.getPowerControlCgiSuccess(action.value);
                break;
            }
            case "POST_POWER_CONTROL_CGI_SUCCESS": {
                this.postPowerControlCgiSuccess();
                break;
            }
            case "GET_USER_CGI_SUCCESS": {
                this.getUserCgiSuccess(action.value);
                break;
            }
            case "PATCH_USER_CGI_SUCCESS": {
                this.patchUserCgiSuccess();
                break;
            }
            case "DELETE_USER_CGI_SUCCESS": {
                this.deleteUserCgiSuccess();
                break;   
            }
        }
    }
}

const mainStore = new MainStore;
dispatcher.register(mainStore.handleActions.bind(mainStore));
//window.dispatcher = dispatcher;
export default mainStore;