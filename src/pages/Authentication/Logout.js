import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class Logout extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {}

    render() {
        return (
            <>
                <h1>&nbsp;</h1>
            </>
        );
    }
}

export default withRouter(connect(null, null)(Logout));
