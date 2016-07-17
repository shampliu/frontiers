/* global require,module,setTimeout */
var React     = require('react'),
    ReactDOM  = require('react-dom'),
    addons    = require('react-addons'),
    Hammer    = require('hammerjs'),
    merge     = require('merge');

var Card = React.createClass({displayName: "Card",
  getInitialState: function() {
    return {
      initialPosition: {
        x: 0,
        y: 0
      }
    };
  },

  setInitialPosition: function() {
    var screen = document.getElementById('tinder-start'),
        card = ReactDOM.findDOMNode(this),
        initialPosition = {
          x: Math.round((screen.offsetWidth - card.offsetWidth) / 2),
          y: Math.round((screen.offsetHeight - card.offsetHeight) / 2)
        };

    this.setState({
      initialPosition: initialPosition
    });
  },

  componentDidMount: function() {
    this.setInitialPosition();

    window.addEventListener('resize', this.setInitialPosition);
  },

  componentWillUnmount: function() {
    window.removeEventListener('resize', this.setInitialPosition);
  },

  render: function() {
    var initialTranslate = ''.concat(
      'translate3d(',
        this.state.initialPosition.x + 'px,',
        '0px,',
        '0px)'
    );

    var style = merge({
      msTransform: initialTranslate,
      WebkitTransform: initialTranslate,
      transform: initialTranslate,
      zIndex: this.props.index
    }, this.props.style);

    var innerStyle = {
      backgroundImage: 'url("' + (this.props.image || "http://placehold.it/300x300") + '")',

      zIndex: this.props.index
    };
    var classes = addons.classSet(merge(
                    {
                      card: true
                    },
                    this.props.classes
                  ));
    this.title = this.props.title.length > 24 ? this.props.title.substring(0, 22) + "..." : this.props.title;
    var startTime = new Date(this.props.startTime);
    startTime = startTime.toDateString() + " " + this.props.startTime.substring(12);
    return (
      // React.createElement("div", {style:style, className: classes},
      //   React.createElement("h1", {className: "title"}, this.title),
      //   React.createElement("h3", {className: "location"}, startTime),
      //   React.createElement("div", {style: innerStyle, className: "inner-image"}),
      //   React.createElement("h3", {className: "location"}, this.props.location),
      //   React.createElement("p", null, this.props.text),
      //   React.createElement("a", {href: this.props.url, target: "_blank"}, "More information"))
      
        <div className="card">
          <div style={style} className={classes}>
            <h1 className="title">
              <a href={this.props.url} target="_blank">
                {this.title}
              </a>
            </h1>
            <h3 className="location">{startTime}</h3>
            <div className="inner-image" style={innerStyle}></div>
            <h3 className="location">{this.props.location}</h3>
            <p>{this.props.text}</p>
            <a href={this.props.url} target="_blank">More Information</a>
          </div>
        </div>
      );
  }
});

var DraggableCard = React.createClass({displayName: "DraggableCard",
  getInitialState: function() {
    return {
      x: 0,
      y: 0,
      initialPosition: {
        x: 0,
        y: 0
      },
      startPosition: {
        x: 0,
        y: 0
      },
      animation: null
    };
  },

  resetPosition: function() {
    var screen = document.getElementById('tinder-start'),
        card = ReactDOM.findDOMNode(this),
        initialPosition = {
          x: Math.round((screen.offsetWidth - card.offsetWidth) / 2),
          y: Math.round((screen.offsetHeight - card.offsetHeight) / 2)
        };

    var initialState = this.getInitialState();
    this.setState(
    {
      x: initialPosition.x,
      y: initialPosition.y,
      initialPosition: initialPosition,
      startPosition: initialState.startPosition
    }
    );
  },

  panHandlers: {
    panstart: function() {
      this.setState({
        animation: false,
        startPosition: {
          x: this.state.x,
          y: this.state.y
        }
      });
    },
    panend: function(ev) {
      var screen = document.getElementById('tinder-start'),
          card = ReactDOM.findDOMNode(this);
      if (this.state.x < -50) {
        this.props.onOutScreenLeft(this.props.cardId);
      } else if ((this.state.x + (card.offsetWidth - 50)) > screen.offsetWidth) {
        this.props.onOutScreenRight(this.props.cardId);
      } else {
        this.resetPosition();
        this.setState({
          animation: true
        });
      }
    },
    panmove: function(ev) {
      this.setState(this.calculatePosition(
        ev.deltaX, ev.deltaY
        ));
    },
    pancancel: function(ev) {
      console.log(ev.type);
    }
  },

  handlePan: function(ev) {
    ev.preventDefault();
    this.panHandlers[ev.type].call(this, ev);
    return false;
  },

  handleSwipe: function(ev) {
    console.log(ev.type);
  },

  calculatePosition: function(deltaX, deltaY) {
    return {
      x: (this.state.initialPosition.x + deltaX),
      y: (this.state.initialPosition.y + deltaY)
    };
  },

  componentDidMount: function() {
    this.hammer = new Hammer.Manager(ReactDOM.findDOMNode(this));
    this.hammer.add(new Hammer.Pan({threshold: 0}));

    var events = [
      ['panstart panend pancancel panmove', this.handlePan],
      ['swipestart swipeend swipecancel swipemove', this.handleSwipe]
    ];

    events.forEach(function(data) {
      if (data[0] && data[1]) {
        this.hammer.on(data[0], data[1]);
      }
    }, this);

    this.resetPosition();
    window.addEventListener('resize', this.resetPosition);
  },

  componentWillUnmount: function() {
    this.hammer.stop();
    this.hammer.destroy();
    this.hammer = null;

    window.removeEventListener('resize', this.resetPosition);
  },

  render: function() {
    var translate = ''.concat(
      'translate3d(',
        this.state.x + 'px,',
        '0px,',
        '0px)'
    );

    var style = {
      msTransform: translate,
      WebkitTransform: translate,
      transform: translate
    };

    var classes = {
      animate: this.state.animation
    };

    console.log("rendering card");

    // return (React.createElement(Card, React.__spread({},  this.props,
    //   {style: style,
    //     classes: classes})));
    return (
      <div className="draggableCard">
        <Card
          cardId={this.props.cardId}
          index={this.props.index}
          onOutScreenLeft={this.props.onOutScreenLeft}
          onOutScreenRight={this.props.onOutScreenRight}
          title={this.props.title}
          text={this.props.text}
          image={this.props.image}
          location={this.props.location}
          startTime={this.props.startTime}
          url={this.props.url}
          style={style}
          classes={classes} />
      </div>
    );
  }
});

var Tinderable = React.createClass({displayName: "Tinderable",
  getInitialState: function() {
    return {
      alertLeft: false,
      alertRight: false
    };
  },

  handleSave: function(eventId) {
    let http = new XMLHttpRequest();
    http.open('GET','/user/save/'+eventId+'',true);
    http.addEventListener('load', function() {
      console.log('saved!');
    });
    http.send();
  },

  removeCard: function(side, cardId) {
    setTimeout(function(){
      if (side === 'left') {
        this.setState({alertLeft: false});
      } else if (side === 'right') {
        this.setState({alertRight: false});
      }
    }.bind(this), 3000);

    if (side === 'right') {
      this.handleSave(cardId);
    }

    this.setState({
      alertLeft: side === 'left',
      alertRight: side === 'right'
    });
    this.props.removeCard(cardId);
  },

  render: function() {
    var leftRemove = this.removeCard.bind(this, 'left');
    var rightRemove = this.removeCard.bind(this, 'right');
    var cards = this.props.cardData.map(function(c, index, coll) {
      console.log("card", index);
      if (index === (coll.length - 1)) {
        var theCard =
          <div key={index}>
            <DraggableCard
              cardId={c.id}
              index={index}
              onOutScreenLeft={leftRemove}
              onOutScreenRight={rightRemove}
              title={c.title}
              text={c.text}
              image={c.image}
              location={c.location}
              startTime={c.startTime}
              url={c.url}
              />
          </div>
      }
      else {
        var theCard =
          <div key={index}>
          <Card
            cardId={c.id}
            index={index}
            onOutScreenLeft={leftRemove}
            onOutScreenRight={rightRemove}
            title={c.title}
            text={c.text}
            image={c.image}
            location={c.location}
            startTime={c.startTime}
            url={c.url}
            />
          </div>
      }
      return theCard;
    });

    var classesAlertLeft = addons.classSet({
      'alert-visible': this.state.alertLeft,
      'alert-left': true,
      'alert': true
    });
    var classesAlertRight = addons.classSet({
      'alert-visible': this.state.alertRight,
      'alert-right': true,
      'alert': true
    });

    return (

      <div className="tinderable">
        <div className={classesAlertLeft}>
        <i className="remove icon"></i>  Pass
        </div>
        <div className={classesAlertRight}>
        <i className="checkmark icon"></i>  Save
        </div>
        <div id="ui link cards">
          {cards}
        </div>
      </div>
    );
  }
});

module.exports = Tinderable;
