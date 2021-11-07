import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { changeLayout, changeTopbarTheme, toggleRightSidebar, changeLayoutWidth } from '../../store/actions';

// Other Layout related Component
import Navbar from './Navbar';
import Header from './Header';
import Footer from './Footer';
import Rightbar from '../CommonForBoth/Rightbar';

class Layout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isMenuOpened: false,
    };
    this.toggleRightSidebar = this.toggleRightSidebar.bind(this);
  }

  /**
   * Open/close right sidebar
   */
  toggleRightSidebar() {
    this.props.toggleRightSidebar();
  }

  componentDidMount() {
    // Scrollto 0,0
    window.scrollTo(0, 0);

    const title = this.props.location.pathname;
    const currentage = title.charAt(1).toUpperCase() + title.slice(2);

    this.props.changeLayout('horizontal');
    if (this.props.topbarTheme) {
      this.props.changeTopbarTheme(this.props.topbarTheme);
    }
    if (this.props.layoutWidth) {
      this.props.changeLayoutWidth(this.props.layoutWidth);
    }
    if (this.props.showRightSidebar) {
      this.toggleRightSidebar();
    }
  }

  /**
   * Opens the menu - mobile
   */
  openMenu = (e) => {
    this.setState({ isMenuOpened: !this.state.isMenuOpened });
  };

  render() {
    return (
      <>
        <div id="layout-wrapper">
          <Header
            theme={this.props.topbarTheme}
            isMenuOpened={this.state.isMenuOpened}
            toggleRightSidebar={this.toggleRightSidebar}
            openLeftMenuCallBack={this.openMenu}
          />
          <Navbar menuOpen={this.state.isMenuOpened} />
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
  changeTopbarTheme,
  toggleRightSidebar,
  changeLayout,
  changeLayoutWidth,
})(withRouter(Layout));
