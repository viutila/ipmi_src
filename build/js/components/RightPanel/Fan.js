import Radium from "radium";
import React from "react";
import MainStore from "../../stores/MainStore";
import * as MainActions from "../../actions/MainActions";

class Fan extends React.Component {
    constructor(props) {
        super(props);
        this.getFanData = this.getFanData.bind(this);

        this.state = {
            //Fan
            fan: '',
            sortType: {key: "status", order: "asc"},
        };
    }

    componentWillMount() {
        MainStore.on("getFanCgiSuccess", this.getFanData);
        
        this.token = localStorage.getItem("LStoken");
        this.fanData = '';

        MainActions.getFanCgi(this.token);
        setTimeout(()=>{MainActions.setLoadingDIV(1)},1);
        //console.log("count", MainStore.listenerCount("getInfoCgiSuccess"));
    }

    componentDidMount() {
        
    }

    componentWillUnmount() {
        MainStore.removeListener("getFanCgiSuccess", this.getFanData);
    }

    getFanData() {
        this.fanData = MainStore.getFanData();
        console.log(this.fanData);
        this.setState({
            fan: this.fanData,
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
        if (this.state.fan == '')
        {
            return false;
        }
            
        

        /*this.state.fan.ec.forEach(function(fan) {
            fanArray.push(fan);
        });

        this.state.fan.ec_psu.forEach(function(fan) {
            fanArray.push(fan);
        });*/


        var fanArray = [];
        var rows = [];

        for (var i = 0; i < Object.keys(this.state.fan).length; i++)
        {
            var x = this.state.fan[Object.keys(this.state.fan)[i]];
            for (var j = 0; j < x.length; j++)
            {
                x[j].status = Math.abs(x[j].status);
                fanArray.push(x[j]);
            }
        }

        var tmpSortType = this.state.sortType.key;
        var tmpSortOrder = this.state.sortType.order;

        fanArray = _.orderBy(fanArray, function(o){ return o[tmpSortType]}, tmpSortOrder);

        fanArray.forEach(function(fan,i) {
            //console.log("fan",fan);
            rows.push(<TR name={fan.name} status={fan.status} value={fan.value} critical={fan.critical} nonrecovery={fan.nonrecovery} key={i} />);
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
                    <p style={style.title} >Fan</p>
                </div>
                <div style={style.container} >
                    <p style={style.infoTitle} >Subsystems and Devices</p>
                    <div style={style.info} >
                        <table id="stripedTable">
                            <thead>
                                <tr>
                                    <th style={style.th1} onClick={this.sortClickHandle.bind(this,"status")}>Serverity <img src={sortImgStyle["status"].src} style={sortImgStyle["status"].style} /></th>
                                    <th style={style.th2} onClick={this.sortClickHandle.bind(this,"name")} >Fan <img src={sortImgStyle["name"].src} style={sortImgStyle["name"].style} /></th>
                                    <th style={style.th3} onClick={this.sortClickHandle.bind(this,"value")} >Speed <img src={sortImgStyle["value"].src} style={sortImgStyle["value"].style} /></th>
                                    <th style={[style.th3,{cursor: 'context-menu'}]} >Critical Threshold</th>
                                    <th style={[style.th3,{cursor: 'context-menu'}]} >Nonrecovery Threshold </th>
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
                <td>{this.props.value} rpm</td>
                <td>Min {this.props.critical.minimum} rpm; Max {this.props.critical.maximum} rpm</td>
                <td>Min {this.props.nonrecovery.minimum} rpm; Max {this.props.nonrecovery.maximum} rpm</td>
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
        width: '30%',
        padding: '0 0 0 10px',
        height: '28px',
        borderRight: '1px solid #a1a9bb',
        cursor: 'pointer',
    },
    th3: {
        width: '20%',
        padding: '0 0 0 10px',
        height: '28px',
        cursor: 'pointer',
        borderRight: '1px solid #a1a9bb',
    },
};

module.exports = Radium(Fan);