import Radium from "radium";
import React from "react";
import MainStore from "../../stores/MainStore";
import * as MainActions from "../../actions/MainActions";

class HwTopology extends React.Component {
    constructor(props) {
        super(props);
        this.getTopologyData = this.getTopologyData.bind(this);

        this.state = {
            topology: '',
        };
    }

    componentWillMount() {
        MainStore.on("getTopologyCgiSuccess", this.getTopologyData);
        
        this.token = localStorage.getItem("LStoken");
        this.topologyData = '';

        MainActions.getTopologyCgi(this.token);
        setTimeout(()=>{MainActions.setLoadingDIV(1)},1);
        //console.log("count", MainStore.listenerCount("getInfoCgiSuccess"));
    }

    componentDidMount() {
        
    }

    componentWillUnmount() {
        MainStore.removeListener("getTopologyCgiSuccess", this.getTopologyData);
    }

    getTopologyData() {
        this.topologyData = MainStore.getTopologyData();
        console.log("topologyData",this.topologyData);
        
        
        this.setState({
            topology: this.topologyData,
        })
        setTimeout(()=>{MainActions.setLoadingDIV(0)},1);
    }

    getContentArray() {
        var obj = this.topologyData;
        var ary = [];
        var sortAry = [];
        _.forEach(obj, (value,key) => {
            //console.log(i + ' ' + key + ' is ' + value);
            switch (key) {
                case "system":
                    console.log("system",value);
                    ary.push(<TP obj={value} title="System" key="1" />);
                    break;
                case "bios":
                    console.log("bios",value);
                    ary.push(<TP obj={value} title="BIOS" key="2" />);
                    break;
                case "cpu":
                    console.log("cpu",value);
                    ary.push(<TPLevel2 obj={value} title="CPU" key="3" />);
                    break;
                case "dimm":
                    console.log("dimm",value);
                    ary.push(<TPLevel2 obj={value} title="DIMM" key="4" />);
                    break;
                case "powerSupply":
                    console.log("powerSupply",value);
                    ary.push(<TPLast obj={value} title="Power Supply" key="5" />);
                    break;
            }
        })
        sortAry = ary.sort(function(a, b) {return a.key - b.key;});
        return sortAry;
    }

    render() {
        if (this.topologyData == '')
            return false;

        var ary = this.getContentArray();
        return (
            <div style={style.mainPanel} >
                <div style={style.north} >
                    <p style={style.title} >Hardware Topology</p>
                </div>
                <div style={style.container} >
                    <div style={style.info}>
                        <img src="img/computer.png" /><span style={style.infoTitle}>Computer</span>
                        {ary}
                    </div>
                </div>
            </div>
        );
    }
};



class TP extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            toogleStyle: style.subsubDiv,
            toogleImgSrc: 'img/triangle_02.png',
            obj: this.props.obj,
        };
    }

    handleClick() {
        this.setState({
            toogleStyle: this.state.toogleStyle == style.subsubDiv ? style.subsubDivNone : style.subsubDiv,
            toogleImgSrc: this.state.toogleImgSrc == 'img/triangle_02.png' ? 'img/triangle_01.png' : 'img/triangle_02.png',
        })
    }
    handleObj() {
        var obj = this.state.obj;
        var ary = [];
        var i = 0;

        switch (this.props.title) {
            case "BIOS":
                _.forEach(obj, (value,key) => {
                    switch (key) {
                        case "vendor":
                            console.log("vendor",value);
                            ary.push(<TPChild title="Vendor" value={value} key="1" />);
                            break;
                        case "version":
                            console.log("version",value);
                            ary.push(<TPChild title="Version" value={value} key="2" />);
                            break;
                    }
                    i++;
                })
                break;
            case "CPU":
                break;
            case "DIMM":
                break;
            case "Power Supply":
                break;
            case "System":
                _.forEach(obj, (value,key) => {
                    switch (key) {
                        case "manufacturer":
                            console.log("manufacturer",value);
                            ary.push(<TPChild title="Manufacturer" value={value} key="3" />);
                            break;
                        case "productName":
                            console.log("productName",value);
                            ary.push(<TPChild title="Product Name" value={value} key="4" />);
                            break;
                        case "serialNumber":
                            console.log("serialNumber",value);
                            ary.push(<TPChild title="Serial Number" value={value} key="5" />);
                            break;
                    }
                })
                break;
        }
        return ary;
    }
    render() {
        var ary = this.handleObj();
        return(
            <div style={style.subDiv}>
                <div>
                    <img src={this.state.toogleImgSrc} onClick={this.handleClick.bind(this)} style={style.toogleImage}/>
                    <span style={style.infoTitle2}>{this.props.title}</span>
                </div>
                <div style={this.state.toogleStyle}>
                    {ary}
                </div>
                <div style={{position:'relative',top:'0px',height:'5px'}}>
                    <img src="img/triangle_04.png" style={{position: 'absolute',top:'-10px'}}  />
                </div>
            </div>
        );
    }
}

class TPChild extends React.Component {
    render() {
        return(
            <div>
                <img src="img/triangle_04.png" />
                <img src="img/triangle_04.png" style={style.tringleLevel2} />
                <span style={style.infoTitle3}>{this.props.title}: {this.props.value}</span>
            </div>
        );
    }
}



@Radium
class TPLevel2 extends TP {
    constructor(props){
        super(props);
        this.state = {
            toogleStyle: style.subsubDiv,
            toogleImgSrc: 'img/triangle_02.png',

            
            obj: this.props.obj,
        };
    }
    
    handleObj() {
        var obj = this.state.obj;
        
        var aryFather = [];
        var tmpTitle = this.props.title;

        if (tmpTitle=="BIOS")
        {
            var ary = [];
            _.forEach(obj, (value,key) => {
                switch (key) {
                    case "vendor":
                        console.log("vendor",value);
                        ary.push(<TPLevel2Child title="Vendor" value={value} key="1" />);
                        break;
                    case "version":
                        console.log("version",value);
                        ary.push(<TPLevel2Child title="Version" value={value} key="2" />);
                        break;
                }
            })
            aryFather.push(<TPLevel2Father ary={ary} title={tmpTitle}/>);
        }
        else
        {

        var objLength = obj.length;
        var count = 1;
        obj.forEach(function(obj,i) {
            var ary = [];
            switch (tmpTitle) {
                case "BIOS":
                    _.forEach(obj, (value,key) => {
                        switch (key) {
                            case "vendor":
                                console.log("vendor",value);
                                ary.push(<TPLevel2Child title="Vendor" value={value} key="1" />);
                                break;
                            case "version":
                                console.log("version",value);
                                ary.push(<TPLevel2Child title="Version" value={value} key="2" />);
                                break;
                        }
                    })
                    break;
                case "CPU":
                    if (objLength>1)
                    {
                        if (count != objLength)
                        {
                            _.forEach(obj, (value,key) => {
                                switch (key) {
                                    case "coreActiveMaximum":
                                        console.log("coreActiveMaximum",value);
                                        ary.push(<TPLevel2ChildMulti title="Core Active Maximum" value={value} key="3" />);
                                        break;
                                    case "coreMaximum":
                                        console.log("coreMaximum",value);
                                        ary.push(<TPLevel2ChildMulti title="Core Maximum" value={value} key="4" />);
                                        break;
                                    case "manufacturer":
                                        console.log("manufacturer",value);
                                        ary.push(<TPLevel2ChildMulti title="Manufacturer" value={value} key="5" />);
                                        break;
                                    case "processor":
                                        console.log("processor",value);
                                        ary.push(<TPLevel2ChildMulti title="Processor" value={value} key="6" />);
                                        break;
                                    case "speed":
                                        console.log("speed",value);
                                        ary.push(<TPLevel2ChildMulti title="Speed" value={value + ' MHz'} key="7" />);
                                        break;
                                }
                            })
                        }
                        else
                        {
                            _.forEach(obj, (value,key) => {
                                switch (key) {
                                    case "coreActiveMaximum":
                                        console.log("coreActiveMaximum",value);
                                        ary.push(<TPLevel2Child title="Core Active Maximum" value={value} key="3" />);
                                        break;
                                    case "coreMaximum":
                                        console.log("coreMaximum",value);
                                        ary.push(<TPLevel2Child title="Core Maximum" value={value} key="4" />);
                                        break;
                                    case "manufacturer":
                                        console.log("manufacturer",value);
                                        ary.push(<TPLevel2Child title="Manufacturer" value={value} key="5" />);
                                        break;
                                    case "processor":
                                        console.log("processor",value);
                                        ary.push(<TPLevel2Child title="Processor" value={value} key="6" />);
                                        break;
                                    case "speed":
                                        console.log("speed",value);
                                        ary.push(<TPLevel2Child title="Speed" value={value + ' MHz'} key="7" />);
                                        break;
                                }
                            })
                        }
                    }
                    else
                    {
                        _.forEach(obj, (value,key) => {
                            switch (key) {
                                case "coreActiveMaximum":
                                    console.log("coreActiveMaximum",value);
                                    ary.push(<TPLevel2Child title="Core Active Maximum" value={value} key="3" />);
                                    break;
                                case "coreMaximum":
                                    console.log("coreMaximum",value);
                                    ary.push(<TPLevel2Child title="Core Maximum" value={value} key="4" />);
                                    break;
                                case "manufacturer":
                                    console.log("manufacturer",value);
                                    ary.push(<TPLevel2Child title="Manufacturer" value={value} key="5" />);
                                    break;
                                case "processor":
                                    console.log("processor",value);
                                    ary.push(<TPLevel2Child title="Processor" value={value} key="6" />);
                                    break;
                                case "speed":
                                    console.log("speed",value);
                                    ary.push(<TPLevel2Child title="Speed" value={value + ' MHz'} key="7" />);
                                    break;
                            }
                        })
                    }
                    break;
                case "DIMM":
                    if (objLength>1)
                    {
                        if (count != objLength)
                        {
                            _.forEach(obj, (value,key) => {
                                switch (key) {
                                    case "capableSpeed":
                                        console.log("capableSpeed",value);
                                        ary.push(<TPLevel2ChildMulti title="Capable Speed" value={value + ' MHz'} key="8" />);
                                        break;
                                    case "manufacturer":
                                        console.log("manufacturer",value);
                                        ary.push(<TPLevel2ChildMulti title="Manufacturer" value={value} key="9" />);
                                        break;
                                    case "operatingSpeed":
                                        console.log("operatingSpeed",value);
                                        ary.push(<TPLevel2ChildMulti title="Operating Speed" value={value + ' MHz'} key="10" />);
                                        break;
                                    case "partNumber":
                                        console.log("partNumber",value);
                                        ary.push(<TPLevel2ChildMulti title="Part Number" value={value} key="11" />);
                                        break;
                                    case "serialNumber":
                                        console.log("serialNumber",value);
                                        ary.push(<TPLevel2ChildMulti title="Serial Number" value={value} key="12" />);
                                        break;
                                    case "size":
                                        console.log("size",value);
                                        ary.push(<TPLevel2ChildMulti title="Size" value={value + ' MB'} key="13" />);
                                        break;
                                }
                            })
                        }
                        else
                        {
                            _.forEach(obj, (value,key) => {
                                switch (key) {
                                    case "capableSpeed":
                                        console.log("capableSpeed",value);
                                        ary.push(<TPLevel2Child title="Capable Speed" value={value + ' MHz'} key="8" />);
                                        break;
                                    case "manufacturer":
                                        console.log("manufacturer",value);
                                        ary.push(<TPLevel2Child title="Manufacturer" value={value} key="9" />);
                                        break;
                                    case "operatingSpeed":
                                        console.log("operatingSpeed",value);
                                        ary.push(<TPLevel2Child title="Operating Speed" value={value + ' MHz'} key="10" />);
                                        break;
                                    case "partNumber":
                                        console.log("partNumber",value);
                                        ary.push(<TPLevel2Child title="Part Number" value={value} key="11" />);
                                        break;
                                    case "serialNumber":
                                        console.log("serialNumber",value);
                                        ary.push(<TPLevel2Child title="Serial Number" value={value} key="12" />);
                                        break;
                                    case "size":
                                        console.log("size",value);
                                        ary.push(<TPLevel2Child title="Size" value={value + ' MB'} key="13" />);
                                        break;
                                }
                            })
                        }
                        
                    }
                    else
                    {
                        _.forEach(obj, (value,key) => {
                            switch (key) {
                                case "capableSpeed":
                                    console.log("capableSpeed",value);
                                    ary.push(<TPLevel2Child title="Capable Speed" value={value + ' MHz'} key="8" />);
                                    break;
                                case "manufacturer":
                                    console.log("manufacturer",value);
                                    ary.push(<TPLevel2Child title="Manufacturer" value={value} key="9" />);
                                    break;
                                case "operatingSpeed":
                                    console.log("operatingSpeed",value);
                                    ary.push(<TPLevel2Child title="Operating Speed" value={value + ' MHz'} key="10" />);
                                    break;
                                case "partNumber":
                                    console.log("partNumber",value);
                                    ary.push(<TPLevel2Child title="Part Number" value={value} key="11" />);
                                    break;
                                case "serialNumber":
                                    console.log("serialNumber",value);
                                    ary.push(<TPLevel2Child title="Serial Number" value={value} key="12" />);
                                    break;
                                case "size":
                                    console.log("size",value);
                                    ary.push(<TPLevel2Child title="Size" value={value + ' MB'} key="13" />);
                                    break;
                            }
                        })
                    }
                    break;
                case "Power Supply":
                    _.forEach(obj, (value,key) => {
                        switch (key) {
                            case "assetTag":
                                console.log("assetTag",value);
                                ary.push(<TPLevel2Child title="Asset Tag" value={value} key="1" />);
                                break;
                            case "deviceName":
                                console.log("deviceName",value);
                                ary.push(<TPLevel2Child title="Device Name" value={value} key="2" />);
                                break;
                            case "manufacturer":
                                console.log("manufacturer",value);
                                ary.push(<TPLevel2Child title="Manufacturer" value={value} key="3" />);
                                break;
                            case "maxPowerCapacity":
                                console.log("maxPowerCapacity",value);
                                ary.push(<TPLevel2Child title="Max Power Capacity" value={value} key="4" />);
                                break;
                            case "partNumber":
                                console.log("partNumber",value);
                                ary.push(<TPLevel2Child title="Part Number" value={value} key="5" />);
                                break;
                            case "powerUnitGroup":
                                console.log("powerUnitGroup",value);
                                ary.push(<TPLevel2Child title="Power Unit Group" value={value} key="6" />);
                                break;
                            case "revision":
                                console.log("revision",value);
                                ary.push(<TPLevel2Child title="Revision" value={value} key="7" />);
                                break;
                            case "serialNumber":
                                console.log("serialNumber",value);
                                ary.push(<TPLevel2Child title="Serial Number" value={value} key="8" />);
                                break;
                            case "status":
                                console.log("status",value);
                                ary.push(<TPLevel2Child title="Status" value={value} key="9" />);
                                break;
                        }
                    })
                    break;
            }
            if (count != objLength)
            {
                aryFather.push(<TPLevel2FatherMulti ary={ary} title={tmpTitle+(i+1)} key={i} />);
            }
            else
            {
                aryFather.push(<TPLevel2Father ary={ary} title={tmpTitle+(i+1)} key={i} />);
            }
            count++;
        });


        }//****** else END
        
        return aryFather;
    }
    render() {
        var ary = this.handleObj();
        return(
            <div style={style.subDiv}>
                <div>
                    <img src={this.state.toogleImgSrc} onClick={this.handleClick.bind(this)} style={style.toogleImage}/>
                    <span style={style.infoTitle2}>{this.props.title}</span>
                </div>
                <div style={this.state.toogleStyle}>
                    {/*<div>
                        <img src="img/triangle_04.png" />
                        <img src={this.state.toogleImgSrcLevel2} onClick={this.handleClickLevel2.bind(this)} style={[style.tringleLevel2,style.toogleImage]} />
                        <span style={style.infoTitle3}>{this.props.title + '1'}</span>
                    </div>
                    <div style={this.state.toogleStyleLevel2}>
                        {ary}
                    </div>*/}
                    {/*<TPLevel2Father ary={ary} title={this.props.title} />*/}
                    {ary}
                </div>
                <div style={{position:'relative',top:'0px',height:'5px'}}>
                    <img src="img/triangle_04.png" style={{position: 'absolute',top:'-10px'}}  />
                </div>

            </div>
        );
    }
}

@Radium
class TPLevel2Father extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toogleStyleLevel2: style.subsubDiv,
            toogleImgSrcLevel2: 'img/triangle_03.png',
        }
    }

    handleClickLevel2() {
        this.setState({
            toogleStyleLevel2: this.state.toogleStyleLevel2 == style.subsubDiv ? style.subsubDivNone : style.subsubDiv,
            toogleImgSrcLevel2: this.state.toogleImgSrcLevel2 == 'img/triangle_03.png' ? 'img/triangle_05.png' : 'img/triangle_03.png',
        })
    }

    render () {
        var ary = this.props.ary;
        return(
            <div>
                <div>
                    <img src="img/triangle_04.png" />
                    <img src={this.state.toogleImgSrcLevel2} onClick={this.handleClickLevel2.bind(this)} style={[style.tringleLevel2,style.toogleImage]} />
                    <span style={style.infoTitle3}>{this.props.title}</span>
                </div>
                <div style={this.state.toogleStyleLevel2}>
                    {ary}
                </div>
            </div>
        )
    }
}

@Radium
class TPLevel2FatherMulti extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toogleStyleLevel2: style.subsubDiv,
            toogleImgSrcLevel2: 'img/triangle_02.png',
        }
    }

    handleClickLevel2() {
        this.setState({
            toogleStyleLevel2: this.state.toogleStyleLevel2 == style.subsubDiv ? style.subsubDivNone : style.subsubDiv,
            toogleImgSrcLevel2: this.state.toogleImgSrcLevel2 == 'img/triangle_02.png' ? 'img/triangle_01.png' : 'img/triangle_02.png',
        })
    }

    render () {
        var ary = this.props.ary;
        return(
            <div>
                <div>
                    <img src="img/triangle_04.png" />
                    <img src={this.state.toogleImgSrcLevel2} onClick={this.handleClickLevel2.bind(this)} style={[style.tringleLevel2,style.toogleImage]} />
                    <span style={style.infoTitle3}>{this.props.title}</span>
                </div>
                <div style={this.state.toogleStyleLevel2}>
                    {ary}
                </div>
            </div>
        )
    }
}

class TPLevel2Child extends TPChild {
    render() {
        return(
            <div>
                <img src="img/triangle_04.png" />
                <img src="img/triangle_04.png" style={{position: 'relative', left: '24px'}} />
                <span style={{position: 'relative',left: '28px',fontSize: '12px',color: '#2f2f2f',cursor: 'default'}}>{this.props.title}: {this.props.value}</span>
            </div>
        );
    }
}

class TPLevel2ChildMulti extends TPChild {
    render() {
        return(
            <div>
                <img src="img/triangle_04.png" />
                <img src="img/triangle_04.png" style={{position: 'relative', left: '9px'}} />
                <img src="img/triangle_04.png" style={{position: 'relative', left: '18px'}} />
                <span style={style.infoTitle4}>{this.props.title}: {this.props.value}</span>
            </div>
        );
    }
}


class TPLast extends TP {
    constructor(props){
        super(props);
        this.state = {
            toogleStyle: style.subsubDiv,
            toogleImgSrc: 'img/triangle_03.png',
            obj: this.props.obj,
        };
    }

    handleClick() {
        this.setState({
            toogleStyle: this.state.toogleStyle == style.subsubDiv ? style.subsubDivNone : style.subsubDiv,
            toogleImgSrc: this.state.toogleImgSrc == 'img/triangle_03.png' ? 'img/triangle_05.png' : 'img/triangle_03.png',
        })
    }

    handleObj() {
        var obj = this.state.obj;
        var ary = [];

        var obj = this.state.obj;
        
        var aryFather = [];
        var tmpTitle = this.props.title;

        var objLength = obj.length;
        var count = 1;
        obj.forEach(function(obj,i) {
            var ary = [];
            switch (tmpTitle) {
                case "BIOS":
                    _.forEach(obj, (value,key) => {
                        switch (key) {
                            case "vendor":
                                console.log("vendor",value);
                                ary.push(<TPLastChild title="Vendor" value={value} key="1" />);
                                break;
                            case "version":
                                console.log("version",value);
                                ary.push(<TPLastChild title="Version" value={value} key="2" />);
                                break;
                        }
                    })
                    break;
                case "CPU":
                    break;
                case "DIMM":
                    break;
                case "Power Supply":
                    if (objLength>1)
                    {
                        if (count != objLength)
                        {
                            _.forEach(obj, (value,key) => {
                                switch (key) {
                                    case "assetTag":
                                        console.log("assetTag",value);
                                        ary.push(<TPLastChildMulti title="Asset Tag" value={value} key="1" />);
                                        break;
                                    case "deviceName":
                                        console.log("deviceName",value);
                                        ary.push(<TPLastChildMulti title="Device Name" value={value} key="2" />);
                                        break;
                                    case "manufacturer":
                                        console.log("manufacturer",value);
                                        ary.push(<TPLastChildMulti title="Manufacturer" value={value} key="3" />);
                                        break;
                                    case "maxPowerCapacity":
                                        console.log("maxPowerCapacity",value);
                                        ary.push(<TPLastChildMulti title="Max Power Capacity" value={value} key="4" />);
                                        break;
                                    case "partNumber":
                                        console.log("partNumber",value);
                                        ary.push(<TPLastChildMulti title="Part Number" value={value} key="5" />);
                                        break;
                                    case "powerUnitGroup":
                                        console.log("powerUnitGroup",value);
                                        ary.push(<TPLastChildMulti title="Power Unit Group" value={value} key="6" />);
                                        break;
                                    case "revision":
                                        console.log("revision",value);
                                        ary.push(<TPLastChildMulti title="Revision" value={value} key="7" />);
                                        break;
                                    case "serialNumber":
                                        console.log("serialNumber",value);
                                        ary.push(<TPLastChildMulti title="Serial Number" value={value} key="8" />);
                                        break;
                                    case "status":
                                        console.log("status",value);
                                        ary.push(<TPLastChildMulti title="Status" value={value} key="9" />);
                                        break;
                                }
                            })
                        }
                        else
                        {
                            _.forEach(obj, (value,key) => {
                                switch (key) {
                                    case "assetTag":
                                        console.log("assetTag",value);
                                        ary.push(<TPLastChild title="Asset Tag" value={value} key="1" />);
                                        break;
                                    case "deviceName":
                                        console.log("deviceName",value);
                                        ary.push(<TPLastChild title="Device Name" value={value} key="2" />);
                                        break;
                                    case "manufacturer":
                                        console.log("manufacturer",value);
                                        ary.push(<TPLastChild title="Manufacturer" value={value} key="3" />);
                                        break;
                                    case "maxPowerCapacity":
                                        console.log("maxPowerCapacity",value);
                                        ary.push(<TPLastChild title="Max Power Capacity" value={value} key="4" />);
                                        break;
                                    case "partNumber":
                                        console.log("partNumber",value);
                                        ary.push(<TPLastChild title="Part Number" value={value} key="5" />);
                                        break;
                                    case "powerUnitGroup":
                                        console.log("powerUnitGroup",value);
                                        ary.push(<TPLastChild title="Power Unit Group" value={value} key="6" />);
                                        break;
                                    case "revision":
                                        console.log("revision",value);
                                        ary.push(<TPLastChild title="Revision" value={value} key="7" />);
                                        break;
                                    case "serialNumber":
                                        console.log("serialNumber",value);
                                        ary.push(<TPLastChild title="Serial Number" value={value} key="8" />);
                                        break;
                                    case "status":
                                        console.log("status",value);
                                        ary.push(<TPLastChild title="Status" value={value} key="9" />);
                                        break;
                                }
                            })
                        }
                    }
                    else
                    {
                        _.forEach(obj, (value,key) => {
                            switch (key) {
                                case "assetTag":
                                    console.log("assetTag",value);
                                    ary.push(<TPLastChild title="Asset Tag" value={value} key="1" />);
                                    break;
                                case "deviceName":
                                    console.log("deviceName",value);
                                    ary.push(<TPLastChild title="Device Name" value={value} key="2" />);
                                    break;
                                case "manufacturer":
                                    console.log("manufacturer",value);
                                    ary.push(<TPLastChild title="Manufacturer" value={value} key="3" />);
                                    break;
                                case "maxPowerCapacity":
                                    console.log("maxPowerCapacity",value);
                                    ary.push(<TPLastChild title="Max Power Capacity" value={value} key="4" />);
                                    break;
                                case "partNumber":
                                    console.log("partNumber",value);
                                    ary.push(<TPLastChild title="Part Number" value={value} key="5" />);
                                    break;
                                case "powerUnitGroup":
                                    console.log("powerUnitGroup",value);
                                    ary.push(<TPLastChild title="Power Unit Group" value={value} key="6" />);
                                    break;
                                case "revision":
                                    console.log("revision",value);
                                    ary.push(<TPLastChild title="Revision" value={value} key="7" />);
                                    break;
                                case "serialNumber":
                                    console.log("serialNumber",value);
                                    ary.push(<TPLastChild title="Serial Number" value={value} key="8" />);
                                    break;
                                case "status":
                                    console.log("status",value);
                                    ary.push(<TPLastChild title="Status" value={value} key="9" />);
                                    break;
                            }
                        })
                    }
                    break;
                case "System":
                    _.forEach(obj, (value,key) => {
                        switch (key) {
                            case "manufacturer":
                                console.log("manufacturer",value);
                                ary.push(<TPLastChild title="Manufacturer" value={value} key="3" />);
                                break;
                            case "productName":
                                console.log("productName",value);
                                ary.push(<TPLastChild title="Product Name" value={value} key="4" />);
                                break;
                            case "serialNumber":
                                console.log("serialNumber",value);
                                ary.push(<TPLastChild title="Serial Number" value={value} key="5" />);
                                break;
                        }
                    })
                    break;
            }
            if (count != objLength)
            {
                //aryFather.push(<TPLevel2FatherMulti ary={ary} title={tmpTitle+(i+1)} key={i} />);
                aryFather.push(<TPLastFatherMulti ary={ary} title={tmpTitle+(i+1)} key={i} />);
            }
            else
            {
                //aryFather.push(<TPLevel2Father ary={ary} title={tmpTitle+(i+1)} key={i} />);
                aryFather.push(<TPLastFather ary={ary} title={tmpTitle+(i+1)} key={i} />);
            }
            count++;
            
        });

        return aryFather;
    }

    render() {
        var ary = this.handleObj();
        return(
            <div style={style.subDiv}>
                <div>
                    <img src={this.state.toogleImgSrc} onClick={this.handleClick.bind(this)} style={style.toogleImage} />
                    <span style={style.infoTitle2}>{this.props.title}</span>
                </div>
                <div style={this.state.toogleStyle}>
                    {ary}
                </div>
            </div>
        )
    }
}

@Radium
class TPLastFather extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toogleStyleLevel2: style.subsubDiv,
            toogleImgSrcLevel2: 'img/triangle_03.png',
        }
    }

    handleClickLevel2() {
        this.setState({
            toogleStyleLevel2: this.state.toogleStyleLevel2 == style.subsubDiv ? style.subsubDivNone : style.subsubDiv,
            toogleImgSrcLevel2: this.state.toogleImgSrcLevel2 == 'img/triangle_03.png' ? 'img/triangle_05.png' : 'img/triangle_03.png',
        })
    }

    render () {
        var ary = this.props.ary;
        return(
            <div>
                <div>
                    <img src={this.state.toogleImgSrcLevel2} onClick={this.handleClickLevel2.bind(this)} style={[{position: 'relative',left: '15px'},style.toogleImage]} />
                    <span style={style.infoTitleLastFather}>{this.props.title}</span>
                </div>
                <div style={this.state.toogleStyleLevel2}>
                    {ary}
                </div>
            </div>
        )
    }
}

@Radium
class TPLastFatherMulti extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toogleStyleLevel2: style.subsubDiv,
            toogleImgSrcLevel2: 'img/triangle_02.png',
        }
    }

    handleClickLevel2() {
        this.setState({
            toogleStyleLevel2: this.state.toogleStyleLevel2 == style.subsubDiv ? style.subsubDivNone : style.subsubDiv,
            toogleImgSrcLevel2: this.state.toogleImgSrcLevel2 == 'img/triangle_02.png' ? 'img/triangle_01.png' : 'img/triangle_02.png',
        })
    }

    render () {
        var ary = this.props.ary;
        return(
            <div>
                <div>
                    <img src={this.state.toogleImgSrcLevel2} onClick={this.handleClickLevel2.bind(this)} style={[{position: 'relative',left: '15px'},style.toogleImage]} />
                    <span style={{position: 'relative',left: '19px',fontSize: '12px',color: '#2f2f2f',cursor: 'default'}}>{this.props.title}</span>
                </div>
                <div style={this.state.toogleStyleLevel2}>
                    {ary}
                </div>
            </div>
        )
    }
}

class TPLastChild extends TPChild {
    render() {
        return(
            <div>
                <img src="img/triangle_04.png" style={{position: 'relative',left: '30px'}} />
                <span style={{position: 'relative',left: '34px',fontSize: '12px',color: '#2f2f2f',cursor: 'default'}}>{this.props.title}: {this.props.value}</span>
            </div>
        );
    }
}

class TPLastChildMulti extends TPChild {
    render() {
        return(
            <div>
                <img src="img/triangle_04.png" style={{position: 'relative', left: '15px'}} />
                <img src="img/triangle_04.png" style={{position: 'relative', left: '24px'}} />
                <span style={{position: 'relative',left: '28px',fontSize: '12px',color: '#2f2f2f',cursor: 'default'}}>{this.props.title}: {this.props.value}</span>
            </div>
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
        fontWeight: 'bold',
        cursor: 'default',
    },
    container: {
        position: 'relative'
    },
    infoTitle: {
        position: 'relative',
        left: '6px',
        fontSize: '14px',
        color: '#2f2f2f',
        cursor: 'default',
    },
    infoTitle2: {
        position: 'relative',
        left: '6px',
        fontSize: '12px',
        color: '#2f2f2f',
        cursor: 'default',
    },
    infoTitle3: {
        position: 'relative',
        left: '13px',
        fontSize: '12px',
        color: '#2f2f2f',
        cursor: 'default',
    },
    infoTitle4: {
        position: 'relative',
        left: '24px',
        fontSize: '12px',
        color: '#2f2f2f',
        cursor: 'default',
    },
    infoTitleLastFather: {
        position: 'relative',
        left: '21px',
        fontSize: '12px',
        color: '#2f2f2f',
        cursor: 'default',
    },
    info: {
        position: 'absolute',
        top: '30px',
        left: '50px',
        width: 'calc(100% - 72px)',
        paddingBottom: '30px',
        border: 'none'
    },
    subDiv: {
        display: 'inline',
        position: 'relative',
        left: '6px',
        top: '5px',
    },
    subsubDiv: {
        display: 'inline',
    },
    subsubDivNone: {
        display: 'none',
    },
    subDivNone: {
        display: 'none',
        position: 'relative',
        left: '6px',
        top: '5px',
    },
    tringleLevel2: {
        position: 'relative',
        left: '9px',
    },
    toogleImage: {
        cursor: 'pointer',
    },
};

module.exports = Radium(HwTopology);