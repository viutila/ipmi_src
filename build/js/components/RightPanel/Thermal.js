import Radium from "radium";
import React from "react";
import MainStore from "../../stores/MainStore";
import * as MainActions from "../../actions/MainActions";

class Thermal extends React.Component {
    constructor(props) {
        super(props);
        this.getThermalData = this.getThermalData.bind(this);

        this.state = {
            //Fan
            thermal: '',
            sortType: {key: "status", order: "asc"},
        };
    }

    componentWillMount() {
        MainStore.on("getThermalCgiSuccess", this.getThermalData);
        
        this.token = localStorage.getItem("LStoken");
        this.thermalData = '';

        MainActions.getThermalCgi(this.token);
        setTimeout(()=>{MainActions.setLoadingDIV(1)},1);
        //console.log("count", MainStore.listenerCount("getInfoCgiSuccess"));
    }

    componentDidMount() {
        
    }

    componentWillUnmount() {
        MainStore.removeListener("getThermalCgiSuccess", this.getThermalData);
    }

    getThermalData() {
        this.thermalData = MainStore.getThermalData();
        console.log("thermalData",this.thermalData);
        this.setState({
            thermal: this.thermalData,
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
        if (this.thermalData == '')
            return false;
            
        var thermalArray = [];
        var rows = [];

        for (var i = 0; i < Object.keys(this.state.thermal).length; i++)
        {
            var x = this.state.thermal[Object.keys(this.state.thermal)[i]];
            for (var j = 0; j < x.length; j++)
            {
                thermalArray.push(x[j]);
            }
        }

        var tmpSortType = this.state.sortType.key;
        var tmpSortOrder = this.state.sortType.order;
        thermalArray = _.orderBy(thermalArray, function(o){ return o[tmpSortType]}, tmpSortOrder);

        thermalArray.forEach(function(thermal,i) {
            //console.log("thermal",thermal);
            rows.push(<TR critical={thermal.critical} location={thermal.location} name={thermal.name} status={thermal.status} value={thermal.value} warning={thermal.warning} key={i} />);
        });

        var sortImgStyle = {"status": {style: {display: 'none'},src: 'img/table_sort_down.png'},
                            "name": {style: {display: 'none'},src: 'img/table_sort_down.png'},
                            "value": {style: {display: 'none'},src: 'img/table_sort_down.png'},
                            "location": {style: {display: 'none'},src: 'img/table_sort_down.png'}};
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
                    <p style={style.title} >Thermal</p>
                </div>
                <div style={style.container} >
                    <p style={style.infoTitle} >Temperature Information</p>
                    <div style={style.info} >
                        <table id="stripedTable">
                            <thead>
                                <tr>
                                    <th style={style.th1} onClick={this.sortClickHandle.bind(this,"status")} >Status <img src={sortImgStyle["status"].src} style={sortImgStyle["status"].style} /></th>
                                    <th style={style.th2} onClick={this.sortClickHandle.bind(this,"name")} >Thermal <img src={sortImgStyle["name"].src} style={sortImgStyle["name"].style} /></th>
                                    <th style={style.th3} onClick={this.sortClickHandle.bind(this,"value")} >Reading <img src={sortImgStyle["value"].src} style={sortImgStyle["value"].style} /></th>
                                    <th style={style.th3} onClick={this.sortClickHandle.bind(this,"location")} >Location <img src={sortImgStyle["location"].src} style={sortImgStyle["location"].style} /></th>
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
                <td>{this.props.value} °C</td>
                <td>{this.props.location}</td>
                <td>Min {this.props.warning.minimum} °C; Max {this.props.warning.maximum} °C</td>
                <td>Min {this.props.critical.minimum} °C; Max {this.props.critical.maximum} °C</td>
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

module.exports = Radium(Thermal);