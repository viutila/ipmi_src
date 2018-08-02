import Radium from "radium";
import React from "react";
import MainStore from "../../stores/MainStore";
import * as MainActions from "../../actions/MainActions";
import _ from 'lodash';
import * as FruLang from "./FruLanguageCode";

class Fru extends React.Component {
    constructor(props) {
        super(props);
        this.getFruData = this.getFruData.bind(this);

        this.state = {
            //Fan
            fru: '',
            selectId: 0,
            deviceName: '',
            content: '',
        };
    }

    componentWillMount() {
        MainStore.on("getFruCgiSuccess", this.getFruData);
        
        this.token = localStorage.getItem("LStoken");
        this.fruData = '';

        MainActions.getFruCgi(this.token);
        setTimeout(()=>{MainActions.setLoadingDIV(1)},1);
        //console.log("count", MainStore.listenerCount("getInfoCgiSuccess"));
    }

    componentDidMount() {
        
    }

    componentWillUnmount() {
        MainStore.removeListener("getFruCgiSuccess", this.getFruData);
    }

    getContentArray(idx) {
        var obj = this.fruData[idx];
        var ary = [];
        var sortAry = [];
        _.forEach(obj, (value,key) => {
            //console.log(i + ' ' + key + ' is ' + value);
            switch (key) {
                case "boardInfo":
                    ary.push(<BoardInfo key="2" boardInfoObj={obj.boardInfo} />)
                    break;
                case "chassisInfo":
                    ary.push(<ChasisInfo key="1" chasisInfoObj={obj.chassisInfo} />)
                    break;
                case "productInfo":
                    ary.push(<ProductInfo key="3" productInfoObj={obj.productInfo} />)
                    break;
            }
        })
        sortAry = ary.sort(function(a, b) {return a.key - b.key;});
        return sortAry;
    }

    getFruData() {
        this.fruData = MainStore.getFruData();
        console.log("fruData",this.fruData);
        var contentArray = this.getContentArray(this.state.selectId);
        
        this.setState({
            fru: this.fruData,
            deviceName: this.fruData[this.state.selectId].name,
            content: contentArray,
        })
        setTimeout(()=>{MainActions.setLoadingDIV(0)},1);
    }
    fruSelectOnChange(event) {
        var index = event.target.value;
        var contentArray = this.getContentArray(index);
        this.setState({
            selectId: index,
            deviceName: this.fruData[index].name,
            content: contentArray,
        });
    }
    render() {
        if (this.fruData == '')
            return false;

        var option = [];
        for (var i=0; i<this.fruData.length; i++){
            option.push(<option key={i} value={i}>{i}</option>);
        }
        var fruSelect =(
            <select value={this.state.selectId} style={style.idSelect} onChange={this.fruSelectOnChange.bind(this)}>
                {option}
            </select>
        );
        return (
            <div style={style.mainPanel} >
                <div style={style.north} >
                    <p style={style.title} >FRU</p>
                </div>
                <div style={style.container} >
                    <p style={style.infoTitle} >FRU Information</p>
                    <div style={style.info} >
                        <table style={style.table1}>
	                        <thead style={style.thead} >
                                <tr>
                                    <th style={style.th1}>FRU Device</th>
                                </tr>
                            </thead>
                            <tbody style={style.tbody} >
                                <tr>
                                    <td style={style.td1} >FRU Device ID</td>
                                    <td style={style.td2} >{fruSelect}</td>
                                </tr>
                                <tr>
                                    <td style={style.td1} >FRU Device Name</td>
                                    <td style={style.td2} >{this.state.deviceName}</td>
                                </tr>
                            </tbody>
                        </table>
                        {this.state.content}
                    </div>
                </div>
            </div>
        );
    }
};

class BoardInfo extends React.Component {
    render() {
        var obj = this.props.boardInfoObj;
        var ary = [];
        var i = 0;
        _.forEach(obj, (value,key) => {
            //console.log(i + ' ' + key + ' is ' + value);
            switch (key) {
                case "languageCode":
                    ary.push(<TR key={i} title="Language" value={FruLang.fruLangMapping(value).lang} />)
                    break;
                case "manufacturer":
                    ary.push(<TR key={i} title="Board Manufacturer" value={value} />)
                    break;
                case "manufacturerDateTime":
                    var date = new Date(value*1000)
                    ary.push(<TR key={i} title="Board Manufacturer Date Time" value={date.toDateString()} />)
                    break;
                case "partNumber":
                    ary.push(<TR key={i} title="Board Part Number" value={value} />)
                    break;
                case "productName":
                    ary.push(<TR key={i} title="Board Product Name" value={value} />)
                    break;
                case "serialNumber":
                    ary.push(<TR key={i} title="Board Serial Number" value={value} />)
                    break;
            }
            i++;
        })
        return(
            <table style={style.table1}>
                <thead style={style.thead} >
                    <tr>
                        <th style={style.th1}>Board Info.</th>
                    </tr>
                </thead>
                <tbody style={style.tbody} >
                    {ary}
                </tbody>
            </table>
        );
    }
}

class ChasisInfo extends React.Component {
    render() {
        var obj = this.props.chasisInfoObj;
        var ary = [];
        var i = 0;
        _.forEach(obj, (value,key) => {
            //console.log(i + ' ' + key + ' is ' + value);
            switch (key) {
                case "serialNumber":
                    ary.push(<TR key={i} title="Chasis Serial Number" value={value} />)
                    break;
            }
            i++;
        })
        return(
            <table style={style.table1}>
                <thead style={style.thead} >
                    <tr>
                        <th style={style.th1}>Chasis Info.</th>
                    </tr>
                </thead>
                <tbody style={style.tbody} >
                    {ary}
                </tbody>
            </table>
        );
    }
}

class ProductInfo extends React.Component {
    render() {
        var obj = this.props.productInfoObj;
        var ary = [];
        var i = 0;
        _.forEach(obj, (value,key) => {
            //console.log(i + ' ' + key + ' is ' + value);
            switch (key) {
                case "languageCode":
                    ary.push(<TR key={i} title="Language" value={FruLang.fruLangMapping(value).lang} />)
                    break;
                case "manufacturer":
                    ary.push(<TR key={i} title="Product Manufacturer" value={value} />)
                    break;
                case "partModelNumber":
                    ary.push(<TR key={i} title="Product Part Number" value={value} />)
                    break;
                case "productName":
                    ary.push(<TR key={i} title="Product Name" value={value} />)
                    break;
                case "productVersion":
                    ary.push(<TR key={i} title="Product Version" value={value} />)
                    break;
                case "serialNumber":
                    ary.push(<TR key={i} title="Product Serial Number" value={value} />)
                    break;
            }
            i++;
        })
        return(
            <table style={style.table1}>
                <thead style={style.thead} >
                    <tr>
                        <th style={style.th1}>Product Info.</th>
                    </tr>
                </thead>
                <tbody style={style.tbody} >
                    {ary}
                </tbody>
            </table>
        );
    }
}

class TR extends React.Component {
    render() {
        return(
            <tr>
                <td style={style.td1} >{this.props.title}</td>
                <td style={style.td2} >{this.props.value}</td>
            </tr>
        );
    }
}



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
        position: 'relative',
        width: '100%',
        height: 'calc(100% - 40px)',
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
        height: 'calc(100% - 82px)',
        border: '1px solid #d9d9d9',
        padding: '20px 20px 20px 20px'
    },
    table1: {
        margin: '0 0 20px 0'
    },
    thead: {
        fontSize: '12px',
        color: '#2f2f2f',
        fontWeight: '900',
        //margin: '0 0 20px 0'
        //padding: '0 0 20px 0',
    },
    tbody: {
        fontSize: '12px'
    },
    td1: {
        width: '230px',
        padding: '0 0 0 10px',
        color: '#777777'
    },
    td2: {
        width: '230px',
        padding: '0 0 0 10px',
        color: '#2f2f2f'
    },
    idSelect: {
        width: '40px',
        height: '23px',
        fontSize: '12px',
    },
    th1: {
        padding: '0 0 10px 0',
    }
};

module.exports = Radium(Fru);