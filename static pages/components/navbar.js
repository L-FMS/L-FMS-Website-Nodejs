/**
 * 
 * @authors Tom Hu (webmaster@h1994st.com)
 * @date    2015-06-06 17:22:19
 * @version 0.1
 */

'use strict';

var BootstrapButton = React.createClass({
  render: function () {
    return (
      <a {...this.props}
        href={this.props.href || '#'}
        role="button"
        className={(this.props.className || '') + ' btn'} />
    );
  }
});

var SearchComponent = React.createClass({
  render: function () {
    return (
      <form {...this.props} className={(this.props.className || '') + ' navbar-form'} role="search" method="POST">
        <div className="form-group">
          <input type="text" className="form-control" placeholder="Search" />
        </div>
        <button type="submit" className="btn btn-default">Submit</button>
      </form>
    );
  }
});

var LoginRegisterComponent = React.createClass({
  render: function () {
    return (
      <ul {...this.props} className={(this.props.className || '') + ' nav navbar-nav'}>
        <li><a href="#" className="navbar-link">Log in</a></li>
        <li><a href="#" className="navbar-link">Sign up</a></li>
      </ul>
    );
  }
});

var UserInfoConponent = React.createClass({
  render: function () {
    return (
      <ul {...this.props} className={(this.props.className || '') + ' nav navbar-nav'}>
        <li className="dropdown">
          <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">h1994st <span className="caret"></span></a>
          <ul className="dropdown-menu" role="menu">
            <li><a href="#">Message</a></li>
            <li><a href="#">Something else here</a></li>
            <li className="divider"></li>
            <li><a href="#">Log out</a></li>
          </ul>
        </li>
      </ul>
    );
  }
});

var NavbarComponent = React.createClass({
  didClickNavbarItem: function (i) {
    this.setState({
      activeItem: i 
    });
  },
  getInitialState: function () {
    return {
      loggedIn: false,
      activeItem: (this.props.activeItem || '0'),
    };
  },
  render: function () {
    var rightPart;
    if (this.state.loggedIn) {
      rightPart = <UserInfoConponent className="navbar-right" />
    } else {
      rightPart = <LoginRegisterComponent className="navbar-right" />
    }

    return (
      <nav {...this.props} className={(this.props.className || '') + ' navbar'}>
        <div className="container">
          <div className="navbar-header">
            <BootstrapButton type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar-content">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </BootstrapButton>
            <a className="navbar-brand" href="#">Brand</a>
          </div>

          <div className="collapse navbar-collapse" id="navbar-content">
            <ul className="nav navbar-nav">
              {
                this.props.children.map(function (child, index) {
                  var itemClassName = "";
                  if (index == this.state.activeItem) {
                    itemClassName = "active";
                  };

                  return (
                    <li onClick={this.didClickNavbarItem.bind(this, index)} className={itemClassName} key={index}>
                      {child}
                    </li>
                  );
                }, this)
              }
            </ul>

            <SearchComponent className="navbar-left" />

            {rightPart}
          </div>
        </div>
      </nav>
    );
  }
});

React.render((
  <NavbarComponent className="navbar-default" activeItem="2">
    <a href="#">Home</a>
    <a href="#">Message</a>
    <a href="#">About us</a>
  </NavbarComponent>
), document.getElementById('TopNavBar'));
