import React, { Component } from 'react';

import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  toggleRightSidebar,
  changeTopbarTheme,
  changeLayoutWidth,
} from '../../store/actions';

// Layout Related Components
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import Rightbar from '../CommonForBoth/Rightbar';

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMobile: /iPhone|iPad|iPod|Android/i.test(navigator.userAgent),
    };
    this.toggleMenuCallback = this.toggleMenuCallback.bind(this);
    this.toggleRightSidebar = this.toggleRightSidebar.bind(this);
  }

  toggleRightSidebar() {
    this.props.toggleRightSidebar();
  }

  capitalizeFirstLetter = (string) => string.charAt(1).toUpperCase() + string.slice(2);

  componentDidMount() {
    // Scroll Top to 0
    window.scrollTo(0, 0);
    const currentage = this.capitalizeFirstLetter(this.props.location.pathname);

    document.title = `${currentage} | Uncle Bear's`;
    if (this.props.leftSideBarTheme) {
      this.props.changeSidebarTheme(this.props.leftSideBarTheme);
    }

    if (this.props.layoutWidth) {
      this.props.changeLayoutWidth(this.props.layoutWidth);
    }

    if (this.props.leftSideBarType) {
      this.props.changeSidebarType(this.props.leftSideBarType);
    }
    if (this.props.topbarTheme) {
      this.props.changeTopbarTheme(this.props.topbarTheme);
    }

    if (this.props.showRightSidebar) {
      this.toggleRightSidebar();
    }
  }

  toggleMenuCallback = () => {
    if (this.props.leftSideBarType === 'default') {
      this.props.changeSidebarType('condensed', this.state.isMobile);
    } else if (this.props.leftSideBarType === 'condensed') {
      this.props.changeSidebarType('default', this.state.isMobile);
    }
  };

  render() {
    return (
      <>
        <div id="layout-wrapper">
          <Header
            toggleMenuCallback={this.toggleMenuCallback}
            toggleRightSidebar={this.toggleRightSidebar}
            type={this.props.leftSideBarType}
          />
          <Sidebar
            theme={this.props.leftSideBarTheme}
            type={this.props.leftSideBarType}
            isMobile={this.state.isMobile}
          />
          <div className="main-content">
            {this.props.children}
            <Footer />
          </div>
        </div>
        <Rightbar />
      </>
    );
  }
}

const mapStatetoProps = (state) => ({
  ...state.Layout,
});
export default connect(mapStatetoProps, {
  changeLayout,
  changeSidebarTheme,
  changeSidebarType,
  toggleRightSidebar,
  changeTopbarTheme,
  changeLayoutWidth,
})(withRouter(Layout));
