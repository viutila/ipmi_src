import Radium from "radium";
import React from "react";
import Alert from "./RightPanel/Alert";
import DateAndTime from "./RightPanel/DateAndTime";
import Fan from "./RightPanel/Fan";
import Fru from "./RightPanel/Fru";
import HealthSummary from "./RightPanel/HealthSummary";
import HwTopology from "./RightPanel/HwTopology";
import Log from "./RightPanel/Log";
import Network from "./RightPanel/Network";
import Power from "./RightPanel/Power";
import Summary from "./RightPanel/Summary";
import Thermal from "./RightPanel/Thermal";
import UpdateAndReset from "./RightPanel/UpdateAndReset";
import User from "./RightPanel/User";
import Voltage from "./RightPanel/Voltage";
import MainStore from "../stores/MainStore";
import * as MainActions from "../actions/MainActions";

class RightPanel extends React.Component {
    constructor() {
        super();
        this.refreshPage = this.refreshPage.bind(this);

        this.state = {
            page: MainStore.getPage(),
            key: Math.random(),
        }
        this.changePage = () => {
            this.setState({
                page: MainStore.getPage()
            });
        };
    }

    componentWillMount() {
        MainStore.on("chagePage", this.changePage);
        MainStore.on("refreshPage", this.refreshPage);
        
    }

    componentWillUnmount() {
        MainStore.removeListener("chagePage", this.changePage);
        MainStore.removeListener("refreshPage", this.refreshPage);
    }

    refreshPage() {
        //this.forceUpdate();
        this.setState({
            key: Math.random(),
        })
        //return (<div></div>)
    }

    getPageView() {
        const domObj = {
            'Alert': <Alert key={this.state.key} />,
            'Date And Time': <DateAndTime key={this.state.key} />,
            'Fan': <Fan key={this.state.key} />,
            'FRU': <Fru key={this.state.key} />,
            'Health Summary': <HealthSummary key={this.state.key} />,
            'Hardware Topology': <HwTopology key={this.state.key} />,
            'Log': <Log key={this.state.key} />,
            'Network': <Network key={this.state.key} />,
            'Power': <Power key={this.state.key} />,
            'Summary': <Summary key={this.state.key} />,
            'Thermal': <Thermal key={this.state.key} />,
            'Update And Reset': <UpdateAndReset key={this.state.key} />,
            'User': <User key={this.state.key} />,
            'Voltage': <Voltage key={this.state.key} />
        }

        return this.state.page in domObj ? domObj[this.state.page] : null;
    }

    render() {
        var content = this.getPageView();
        return (
            <div style={style.divRightPanel} >
                {content}
            </div>
        );
    }
};

const style = {
    divRightPanel: {
        position: 'absolute',
        top: '44px',
        left: '220px',
        width: 'calc(100% - 220px)',
        height: 'calc(100% - 44px)',
        overflow: 'auto'
    }
};

module.exports = Radium(RightPanel);