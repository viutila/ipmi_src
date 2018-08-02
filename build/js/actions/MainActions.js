import dispatcher from "../dispatcher";
import JQuery from "jquery"

var $ = JQuery;
var cgiIP = "https://172.17.37.87";

export function setPage(v) {
    dispatcher.dispatch({
        type: "SET_PAGE",
        value: v
    });
}

export function setLoadingDIV(v) {
    dispatcher.dispatch({
        type: "SET_LOADING_DIV",
        value: v
    });
}

export function loginUpdate(userName, passWord) {

    $.ajax({
        type: 'GET',
        url: cgiIP + '/cgi-bin/authorization/ipmi.cgi',
        dataType: 'json',
        timeout: 30000,
        beforeSend: function(xhr){
            // beforeSend 事件發生時的處理函式
            xhr.setRequestHeader ("Authorization", "Basic " + btoa(userName + ":" + passWord));
        },
        complete: function(){
            // complete 事件發生時的處理函式
            //console.log("Complete");
        },
        success: function(data){
            console.log(data);
            dispatcher.dispatch({
                type: "LOGIN_UPDATE",
                value: data
            });
        },
        error: function(){
            console.log("Error Login");
            dispatcher.dispatch({
                type: "LOGIN_ERROR",
                value: userName
            });
        }
        // ...
    });
}

export function logOut() {
    dispatcher.dispatch({
        type: "LOGOUT",
    })
}

export function refreshPage() {
    dispatcher.dispatch({
        type: "REFRESH_PAGE",
    })
}

export function getInfoCgi(token) {
    $.ajax({
        type: 'GET',
        url: cgiIP + '/cgi-bin/information/ipmi.cgi',
        dataType: 'json',
        timeout: 30000,
        beforeSend: function(xhr){
            // beforeSend 事件發生時的處理函式
            xhr.setRequestHeader ("Authorization", "Bearer " + token);
        },
        complete: function(){
            // complete 事件發生時的處理函式
            console.log("Complete");
        },
        success: function(data){
            console.log("GETINFOCGI_SUCCESS",data);
            dispatcher.dispatch({
                type: "GETINFOCGI_SUCCESS",
                value: data
            });
        },
        error: function(data){
            console.log("GETINFOCGI_ERROR");
            dispatcher.dispatch({
                type: "GETINFOCGI_ERROR",
                value: data
            });
        }
        // ...
    });
}

export function getHealthCgi(token) {
    $.ajax({
        type: 'GET',
        url: cgiIP + '/cgi-bin/health/ipmi.cgi',
        dataType: 'json',
        timeout: 30000,
        beforeSend: function(xhr){
            // beforeSend 事件發生時的處理函式
            xhr.setRequestHeader ("Authorization", "Bearer " + token);
        },
        complete: function(){
            // complete 事件發生時的處理函式
            console.log("Complete");
        },
        success: function(data){
            console.log("GETHEALTHCGI_SUCCESS",data);
            dispatcher.dispatch({
                type: "GETHEALTHCGI_SUCCESS",
                value: data
            });
        },
        error: function(data){
            console.log("GETHEALTHCGI_ERROR");
            dispatcher.dispatch({
                type: "GETHEALTHCGI_ERROR",
                value: data
            });
        }
        // ...
    });
}

export function getFanCgi(token) {
    $.ajax({
        type: 'GET',
        url: cgiIP + '/cgi-bin/fan/ipmi.cgi',
        dataType: 'json',
        timeout: 30000,
        beforeSend: function(xhr){
            // beforeSend 事件發生時的處理函式
            xhr.setRequestHeader ("Authorization", "Bearer " + token);
        },
        complete: function(){
            // complete 事件發生時的處理函式
            console.log("Complete");
        },
        success: function(data){
            console.log("GET_FAN_CGI_SUCCESS",data);
            dispatcher.dispatch({
                type: "GET_FAN_CGI_SUCCESS",
                value: data
            });
        },
        error: function(data){
            console.log("GET_FAN_CGI_ERROR");
            dispatcher.dispatch({
                type: "GET_FAN_CGI_ERROR",
                value: data
            });
        }
        // ...
    });
}

export function getVoltageCgi(token) {
    $.ajax({
        type: 'GET',
        url: cgiIP + '/cgi-bin/voltage/ipmi.cgi',
        dataType: 'json',
        timeout: 30000,
        beforeSend: function(xhr){
            // beforeSend 事件發生時的處理函式
            xhr.setRequestHeader ("Authorization", "Bearer " + token);
        },
        complete: function(){
            // complete 事件發生時的處理函式
            console.log("Complete");
        },
        success: function(data){
            console.log("GET_VOLTAGE_CGI_SUCCESS",data);
            dispatcher.dispatch({
                type: "GET_VOLTAGE_CGI_SUCCESS",
                value: data
            });
        },
        error: function(data){
            console.log("GET_VOLTAGE_CGI_ERROR");
            dispatcher.dispatch({
                type: "GET_VOLTAGE_CGI_ERROR",
                value: data
            });
        }
        // ...
    });
}

export function getThermalCgi(token) {
    $.ajax({
        type: 'GET',
        url: cgiIP + '/cgi-bin/thermal/ipmi.cgi',
        dataType: 'json',
        timeout: 30000,
        beforeSend: function(xhr){
            // beforeSend 事件發生時的處理函式
            xhr.setRequestHeader ("Authorization", "Bearer " + token);
        },
        complete: function(){
            // complete 事件發生時的處理函式
            console.log("Complete");
        },
        success: function(data){
            console.log("GET_THERMAL_CGI_SUCCESS",data);
            dispatcher.dispatch({
                type: "GET_THERMAL_CGI_SUCCESS",
                value: data
            });
        },
        error: function(data){
            console.log("GET_THERMAL_CGI_ERROR");
            dispatcher.dispatch({
                type: "GET_THERMAL_CGI_ERROR",
                value: data
            });
        }
        // ...
    });
}

export function getFruCgi(token) {
    $.ajax({
        type: 'GET',
        url: cgiIP + '/cgi-bin/fru/ipmi.cgi',
        dataType: 'json',
        timeout: 30000,
        beforeSend: function(xhr){
            // beforeSend 事件發生時的處理函式
            xhr.setRequestHeader ("Authorization", "Bearer " + token);
        },
        complete: function(){
            // complete 事件發生時的處理函式
            console.log("Complete");
        },
        success: function(data){
            console.log("GET_FRU_CGI_SUCCESS",data);
            dispatcher.dispatch({
                type: "GET_FRU_CGI_SUCCESS",
                value: data
            });
        },
        error: function(data){
            console.log("GET_FRU_CGI_ERROR");
            dispatcher.dispatch({
                type: "GET_FRU_CGI_ERROR",
                value: data
            });
        }
        // ...
    });
}

export function getTopologyCgi(token) {
    $.ajax({
        type: 'GET',
        url: cgiIP + '/cgi-bin/topology/ipmi.cgi',
        dataType: 'json',
        timeout: 30000,
        beforeSend: function(xhr){
            // beforeSend 事件發生時的處理函式
            xhr.setRequestHeader ("Authorization", "Bearer " + token);
        },
        complete: function(){
            // complete 事件發生時的處理函式
            console.log("Complete");
        },
        success: function(data){
            console.log("GET_TOPOLOGY_CGI_SUCCESS",data);
            dispatcher.dispatch({
                type: "GET_TOPOLOGY_CGI_SUCCESS",
                value: data
            });
        },
        error: function(data){
            console.log("GET_TOPOLOGY_CGI_ERROR");
            dispatcher.dispatch({
                type: "GET_TOPOLOGY_CGI_ERROR",
                value: data
            });
        }
        // ...
    });
}

export function getPowerCgi(token) {
    $.ajax({
        type: 'GET',
        url: cgiIP + '/cgi-bin/powerMonitoring/ipmi.cgi',
        dataType: 'json',
        timeout: 30000,
        beforeSend: function(xhr){
            // beforeSend 事件發生時的處理函式
            xhr.setRequestHeader ("Authorization", "Bearer " + token);
        },
        complete: function(){
            // complete 事件發生時的處理函式
            console.log("Complete");
        },
        success: function(data){
            console.log("GET_POWER_CGI_SUCCESS",data);
            dispatcher.dispatch({
                type: "GET_POWER_CGI_SUCCESS",
                value: data
            });
        },
        error: function(data){
            console.log("GET_POWER_CGI_ERROR");
            dispatcher.dispatch({
                type: "GET_POWER_CGI_ERROR",
                value: data
            });
        }
        // ...
    });
}

export function getPowerControlCgi(token) {
    $.ajax({
        type: 'GET',
        url: cgiIP + '/cgi-bin/powerControl/ipmi.cgi',
        dataType: 'json',
        timeout: 30000,
        beforeSend: function(xhr){
            // beforeSend 事件發生時的處理函式
            xhr.setRequestHeader ("Authorization", "Bearer " + token);
        },
        complete: function(){
            // complete 事件發生時的處理函式
            console.log("Complete");
        },
        success: function(data){
            console.log("GET_POWER_CONTROL_CGI_SUCCESS",data);
            dispatcher.dispatch({
                type: "GET_POWER_CONTROL_CGI_SUCCESS",
                value: data
            });
        },
        error: function(data){
            console.log("GET_POWER_CONTROL_CGI_ERROR");
            dispatcher.dispatch({
                type: "GET_POWER_CONTROL_CGI_ERROR",
                value: data
            });
        }
        // ...
    });
}

export function postPowerControlCgi(token,type) {

    var tmpData = {"action": type};
    $.ajax({
        type: 'POST',
        url: cgiIP + '/cgi-bin/powerControl/ipmi.cgi',
        //dataType: 'json',
        data: JSON.stringify(tmpData),
        contentType: 'application/json',
        //processData: false,
        timeout: 30000,
        beforeSend: function(xhr){
            // beforeSend 事件發生時的處理函式
            xhr.setRequestHeader ("Authorization", "Bearer " + token);
            //xhr.setRequestHeader ("Content-Type", "application/json");
        },
        complete: function(){
            // complete 事件發生時的處理函式
            console.log("Complete");
        },
        success: function(data){
            console.log("POST_POWER_CONTROL_CGI_SUCCESS",data);
            dispatcher.dispatch({
                type: "POST_POWER_CONTROL_CGI_SUCCESS",
                value: data
            });
        },
        error: function(data){
            console.log("POST_POWER_CONTROL_CGI_ERROR");
            dispatcher.dispatch({
                type: "POST_POWER_CONTROL_CGI_ERROR",
                value: data
            });
        }
        // ...
    });
}

export function getUserCgi(token) {
    $.ajax({
        type: 'GET',
        url: cgiIP + '/cgi-bin/user/ipmi.cgi',
        dataType: 'json',
        timeout: 30000,
        beforeSend: function(xhr){
            // beforeSend 事件發生時的處理函式
            xhr.setRequestHeader ("Authorization", "Bearer " + token);
        },
        complete: function(){
            // complete 事件發生時的處理函式
            console.log("Complete");
        },
        success: function(data){
            console.log("GET_USER_CGI_SUCCESS",data);
            dispatcher.dispatch({
                type: "GET_USER_CGI_SUCCESS",
                value: data
            });
        },
        error: function(data){
            console.log("GET_USER_CGI_ERROR");
            dispatcher.dispatch({
                type: "GET_USER_CGI_ERROR",
                value: data
            });
        }
        // ...
    });
}

export function patchUserCgi(token,patchData) {
    var tmpData = patchData;
    $.ajax({
        method: "PATCH",
        url: cgiIP + '/cgi-bin/user/ipmi.cgi',
        data: JSON.stringify(tmpData),
        contentType: 'application/json',
        //processData: false,
        //dataType: 'json',
        //async: true,
        //crossDomain: true,
        timeout: 30000,
        beforeSend: function(xhr){
            // beforeSend 事件發生時的處理函式
            xhr.setRequestHeader ("Authorization", "Bearer " + token);
        },
        complete: function(){
            // complete 事件發生時的處理函式
            console.log("Complete");
        },
        success: function(data){
            console.log("PATCH_USER_CGI_SUCCESS",data);
            dispatcher.dispatch({
                type: "PATCH_USER_CGI_SUCCESS",
                value: data
            });
        },
        error: function(data){
            console.log("PATCH_USER_CGI_ERROR");
            dispatcher.dispatch({
                type: "PATCH_USER_CGI_ERROR",
                value: data
            });
        }
        // ...
    });
}

export function deleteUserCgi(token,data) {
    var tmpData = data;
    $.ajax({
        method: "DELETE",
        url: cgiIP + '/cgi-bin/user/ipmi.cgi',
        data: JSON.stringify(tmpData),
        contentType: 'application/json',
        //processData: false,
        //dataType: 'json',
        //async: true,
        //crossDomain: true,
        timeout: 30000,
        beforeSend: function(xhr){
            // beforeSend 事件發生時的處理函式
            xhr.setRequestHeader ("Authorization", "Bearer " + token);
        },
        complete: function(){
            // complete 事件發生時的處理函式
            console.log("Complete");
        },
        success: function(data){
            console.log("DELETE_USER_CGI_SUCCESS",data);
            dispatcher.dispatch({
                type: "DELETE_USER_CGI_SUCCESS",
                value: data
            });
        },
        error: function(data){
            console.log("DELETE_USER_CGI_ERROR");
            dispatcher.dispatch({
                type: "DELETE_USER_CGI_ERROR",
                value: data
            });
        }
        // ...
    });
}