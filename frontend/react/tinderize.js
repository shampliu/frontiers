/* global require,module,setTimeout */
var React     = require('react'),
    ReactDOM  = require('react-dom'),
    addons    = require('react-addons'),
    Hammer    = require('hammerjs'),
    merge     = require('merge');


var cardsData = [
    {
        title: 'A wonderful day',
        text: '—— - ——— - - - ——— ———— - — ——— —— - ————— - - ———— —— - ——— - - - ——— ———— - — ——— —— -',
        image: 'dolores-park.jpg',
        id: '1',
        location: 'portland',
        startTime: '2016-09-06T10:00:00',
        url: "http://www.eventbrite.com/e/tech-in-asia-tokyo-2016-for-international-delegates-tickets-25989587556?aff=ebapi"
    },
    {
        title: 'My amazing journey',
        text: ' - — ——— —— - ————— - - ———— —— - ——— - - - ——— ———— - — ——— —— - ————— - - ——— - - - ——— ———— ',
        image: 'coachella.jpg',
        id: '2',
        location: 'Near Los Angeles',
        startTime: '2016-09-06T17:00:00',
        url: "http://www.eventbrite.com/e/tech-in-asia-tokyo-2016-for-international-delegates-tickets-25989587556?aff=ebapi"
    },
    {
        title: 'Three recipes without cocoa',
        text: ' - — ——— —— - ————— - - ———— —— - ——— - - - ——— ———— - — ——— —— - ————— - - ——— - - - ———',
        image: '',
        id: '3',
        location: 'portland',
        startTime: '2016-09-06T12:00:00',
        url: "http://www.eventbrite.com/e/tech-in-asia-tokyo-2016-for-international-delegates-tickets-25989587556?aff=ebapi"
    },
    {
        title: 'Generiffaftitle',
        text: ' —— ———— - — ——— —— - ————— - - ———— —— - ——— - - - ——— ———— - — ——— —— - ————— - - ———— —— - ——— - - - ——— ———— - — ——— —— - ————— - - ———— - ——— ',
        image: 'dolores-park.jpg',
        id: '4',
        location: 'portland',
        startTime: '2016-09-06T17:00:00',
        url: "http://www.eventbrite.com/e/tech-in-asia-tokyo-2016-for-international-delegates-tickets-25989587556?aff=ebapi"
    }
];

var Card = React.createClass({
  displayName: "Card",
  getInitialState: function() {
    return {
      initialPosition: {
        x: 0,
        y: 0
      }
    };
  },

  setInitialPosition: function() {
    var screen = document.getElementById('react-start'),
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
        this.state.initialPosition.y + 'px,',
        '0px)'
    );

    var style = merge({
      msTransform: initialTranslate,
      WebkitTransform: initialTranslate,
      transform: initialTranslate,
      zIndex: this.props.index
    }, this.props.style);

    var innerStyle = {
      backgroundImage: 'url("images/' + this.props.image + '")',
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
    startTime = startTime.toDateString() + " ";
    if (this.props.startTime[11] === "0") {
      startTime += this.props.startTime.substring(12) + " AM";
    }
    else if ((this.props.startTime[11] === "1" && this.props.startTime[12] === "0") ||
            (this.props.startTime[11] === "1" && this.props.startTime[12] === "1")) {
      startTime += this.props.startTime.substring(11) + " AM";
    }
    else {
      if (this.props.startTime.substring(11, 13) === "12") {
        startTime += this.props.startTime.substring(11) + " PM";
      }
      else {
        var hour = Number(this.props.startTime.substring(11, 13)) - 12;
        startTime += hour.toString() + this.props.startTime.substring(13) + " PM";
      }
    }
    return (
      React.createElement("div", {style:style, className: classes},
        React.createElement("h1", {className: "title"}, this.title),
        React.createElement("h3", {className: "location"}, startTime),
        React.createElement("div", {style: innerStyle, className: "inner-image"}),
        React.createElement("h3", {className: "location"}, this.props.location),
        React.createElement("p", null, this.props.text),
        React.createElement("a", {href: this.props.url, target: "_blank"}, "More information"))
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
    var screen = document.getElementById('react-start'),
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
      var screen = document.getElementById('react-start'),
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
        this.state.y + 'px,',
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

    return (React.createElement(Card, React.__spread({},  this.props,
      {style: style,
        classes: classes})));
  }
});

var Tinderable = React.createClass({displayName: "Tinderable",
  getInitialState: function() {
    return {
      cards: this.props.initialCardsData,
      alertLeft: false,
      alertRight: false
    };
  },

  handleDismiss: function(cardId) {
    console.log('Fuck this one.')
  },

  handleSave: function(cardId) {
    console.log('WE SAVED HIM!')
  },

  removeCard: function(side, cardId) {
    setTimeout(function(){
      if (side === 'left') {
        this.setState({alertLeft: false});
      } else if (side === 'right') {
        this.setState({alertRight: false});
      }
    }.bind(this), 3000);

    if (side === 'left') {
      this.handleDismiss(cardId);
    } else if (side === 'right') {
      this.handleSave(cardId);
    }

    this.setState({
      cards: this.state.cards.filter(function(c) {
        return c.id !== cardId;
      }),
      alertLeft: side === 'left',
      alertRight: side === 'right'
    });
  },

  render: function() {
    console.log(this.state);
    var cards = this.state.cards.map(function(c, index, coll) {
      var props = {
        cardId: c.id,
        index: index,
        onOutScreenLeft: this.removeCard.bind(this, 'left'),
        onOutScreenRight: this.removeCard.bind(this, 'right'),
        title: c.title,
        text: c.text,
        image: c.image,
        location: c.location,
        startTime: c.startTime,
        url: c.url
      };

      var component = (index === (coll.length - 1)) ?
      DraggableCard:
      Card;

      return React.createElement(component, props);
    }, this);

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
      React.createElement("div", null,
        React.createElement("div", {className: classesAlertLeft}, "Pass"),
        React.createElement("div", {className: classesAlertRight}, "Save"),
        React.createElement("div", {id: "cards"},
          cards
          )
        )
      );
  }
});

// ReactDOM.render(
//   <Tinderable initialCardsData={cardsData} />,
//   document.getElementById('react-start')
// );

module.exports = Tinderable;
