import React, { useState } from "react";
import ReactDOM from "react-dom";
import Carousel from "react-bootstrap/Carousel";
import Calendar from "react-calendar";
import MapContainer, { GoogleApiWrapper } from "./mapcomponent.js";
import CalendarComponent from "./calendarcomponent.js";

import "./reset.css";
import "./index.css";

import HouseIcon from "./images/houseicon.svg";
import OutIcon from "./images/outicon.svg";
import LocationIcon from "./images/locationicon.svg";
import CalendarIcon from "./images/calendaricon.svg";
import LockClosedIcon from "./images/lockclosed.svg";
import LockOpenIcon from "./images/lockopen.svg";
import RouletteIcon from "./images/spinicon.svg";
import Event0 from "./images/events/ballet.jpg";
import Event1 from "./images/events/blueBand.jpg";
import Event2 from "./images/events/yoga.jpg";
import Event3 from "./images/events/movie.jpg";
import Food0 from "./images/restaurants/african.jpg";
import Food1 from "./images/restaurants/american.jpg";
import Food2 from "./images/restaurants/avocado.jpg";
import Food3 from "./images/restaurants/breakfast.jpg";
import "bootstrap/dist/css/bootstrap.min.css";

// function importAll(r) {
//   let images = {};
//   r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
//   return images;
// }

const eventCarouselImages = [Event0, Event1, Event2, Event3];
const foodCarouselImages = [Food0, Food1, Food2, Food3];

class InOutTabs extends React.Component {
  render() {
    let tabIcon = OutIcon;
    let altDesc = "Wandering footsteps going out";
    if (!(this.props.whichTab === "outTab")) {
      tabIcon = HouseIcon;
      altDesc = "A comfy home for staying in";
    }

    return (
      <button
        className={`inOutTab ${this.props.whichTab} ${
          this.props.active ? "" : "inactive"
        }`}
        onClick={() =>
          this.props.onClick(this.props.active, this.props.whichTab)
        }
      >
        {<img src={tabIcon} alt={altDesc} className={"tabImage"}></img>}
      </button>
    );
  }
}

class LocationWidget extends React.Component {
  render() {
    return (
      <button
        className={`locationButton widget`}
        onClick={() => this.props.onClick()}
      >
        {
          <img
            src={LocationIcon}
            alt={"A location symbol"}
            className={"locationIcon widgetIcon"}
          ></img>
        }
      </button>
    );
  }
}

class CalendarWidget extends React.Component {
  render() {
    return (
      <button
        className={`calendarButton widget`}
        onClick={() => this.props.onClick()}
      >
        {
          <img
            src={CalendarIcon}
            alt={"A calendar symbol"}
            className={"calendarIcon widgetIcon"}
          ></img>
        }
      </button>
    );
  }
}

class CarouselComponent extends React.Component {
  render() {
    let lockIcon = LockOpenIcon;
    let altDesc = "An open lock";
    if (this.props.isLocked) {
      lockIcon = LockClosedIcon;
      altDesc = "A closed lock";
    }

    if (this.props.isSpinning && !this.props.isLocked) {
      return (
        <CarouselSpinning
          isHidden={this.props.isHidden}
          imageArray={this.props.imageArray}
          isEventCarousel={this.props.isEventCarousel}
        ></CarouselSpinning>
      );
    } else {
      return (
        <CarouselResult
          isHidden={this.props.isHidden}
          lockIcon={lockIcon}
          altDesc={altDesc}
          onClick={(lockClick) => this.props.onClick(lockClick)}
        ></CarouselResult>
      );
    }
  }
}

class CarouselSpinning extends React.Component {
  render() {
    let carouselClass = "foodCarousel";
    let carouselItemClass = "foodCarouselItem";
    if (this.props.isEventCarousel) {
      carouselClass = "eventCarousel";
      carouselItemClass = "eventCarouselItem";
    }
    return (
      <Carousel
        className={`${carouselClass} ${this.props.isHidden ? "noDisplay" : ""}`}
        interval={100}
        controls={false}
        pause={false}
        keyboard={false}
        indicators={false}
      >
        <Carousel.Item className={carouselItemClass}>
          <img
            className="d-block w-100"
            src={this.props.imageArray[0]}
            alt="First slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={this.props.imageArray[1]}
            alt="Second slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={this.props.imageArray[2]}
            alt="Third slide"
          />
        </Carousel.Item>
        <Carousel.Item>
          <img
            className="d-block w-100"
            src={this.props.imageArray[3]}
            alt="Fourth slide"
          />
        </Carousel.Item>
      </Carousel>
    );
  }
}

class CarouselResult extends React.Component {
  render() {
    return (
      <div
        className={`resultsDiv placeholder flex ${
          this.props.isHidden ? "noDisplay" : ""
        }`}
      >
        <LockButton
          lockIcon={this.props.lockIcon}
          altDesc={this.props.altDesc}
          onClick={(lockClick) => this.props.onClick(lockClick)}
        />
      </div>
    );
  }
}

class LockButton extends React.Component {
  render() {
    return (
      <button
        className={`lockButton flex`}
        onClick={() => this.props.onClick(true)}
      >
        {
          <img
            src={this.props.lockIcon}
            alt={this.props.altDesc}
            className={"lockIcon"}
          ></img>
        }
      </button>
    );
  }
}

class RouletteButton extends React.Component {
  render() {
    return (
      <button className={`rouletteButton`} onClick={() => this.props.onClick()}>
        {
          <img
            src={RouletteIcon}
            alt={"A spin symbol"}
            className={"spinIcon"}
          ></img>
        }
      </button>
    );
  }
}

class OptionsButton extends React.Component {
  render() {
    return null;
  }
}

class OptionsList extends React.Component {
  render() {
    return null;
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lat: 0,
      lng: 0,
      eventOut: true,
      value: new Date(),
      carouselSpinning: false,
      eventLocked: false,
      foodLocked: false,
      eventResult: {},
      foodResult: {},
      eventPopup: false,
      eventOptions: {},
      foodPopup: false,
      foodOptions: {},
      mapUp: false,
      calendarUp: false,
    };
  }

  componentDidMount() {
    this.spinCarousel();
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.setState({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  }

  tabClick(active) {
    if (!active) {
      /* set api calls */

      /* set carousel images and spin */

      /* set active tab */
      this.setState({ eventOut: !this.state.eventOut });
    }
  }

  /* location functions */

  mapPopup() {
    this.setState({ mapUp: !this.state.mapUp });
  }

  mapClicked(mapProps, map, clickEvent) {
    this.setState({
      lat: clickEvent?.latLng?.lat(),
      lng: clickEvent?.latLng?.lng(),
    });
  }

  /* calendar functions */

  onChange(value) {
    this.setState({ value: value });
  }

  calendarOpen() {
    this.setState({ calendarUp: !this.state.calendarUp });
  }

  /* carousel functions */

  carouselClick(lockClick, isEvent) {
    let isEventLocked = this.state.eventLocked;

    let isFoodLocked = this.state.foodLocked;

    if (!lockClick) {
      if (!this.state.carouselSpinning) {
        if (isEvent) {
        } else {
        }
      }
    } else {
      if (isEvent) {
        this.setState({ eventLocked: !isEventLocked });
      } else {
        this.setState({ foodLocked: !isFoodLocked });
      }
    }
  }

  spinCarousel() {
    this.setState({ carouselSpinning: true });
    setTimeout(() => this.setState({ carouselSpinning: false }), 3000);
  }

  /* spin button functions */
  spinButtonClick() {
    if (!this.state.carouselSpinning) {
      this.spinCarousel();
    }
  }

  /* event options functions */
  optionsClick(isEventOptions) {}

  /* dinner options functions */

  render() {
    return (
      <div className="flex wrapperdiv">
        <div className="flex basediv">
          <div className="flex fullblock tabContainer">
            <InOutTabs
              active={this.state.eventOut}
              whichTab="outTab"
              onClick={(active, whichTab) => this.tabClick(active, whichTab)}
            />
            <InOutTabs
              active={!this.state.eventOut}
              whichTab="inTab"
              onClick={(active, whichTab) => this.tabClick(active, whichTab)}
            />
          </div>

          <div className="flex fullblock widgetContainer">
            <LocationWidget
              location={this.location}
              onClick={() => this.mapPopup()}
            />
            <CalendarWidget date={this.date} onClick={() => this.calendarOpen()} />
            <div
              className={`calendarContainerExternal ${
                this.state.calendarUp ? "" : "noDisplay"
              }`}
            >
              <CalendarComponent
                onChange={(value) => this.onChange(value)}
              ></CalendarComponent>
            </div>
          </div>

          <div className="flex fullblock carouselContainer">
            <CarouselComponent
              className={`${this.state.mapUp ? "" : "noDisplay"}`}
              isEventCarousel={true}
              isLocked={this.state.eventLocked}
              imageArray={eventCarouselImages}
              isSpinning={this.state.carouselSpinning}
              isHidden={this.state.mapUp}
              onClick={(lockClick) => this.carouselClick(lockClick, true)}
            />
            <CarouselComponent
              className={`${this.state.mapUp ? "" : "noDisplay"}`}
              isEventCarousel={false}
              isLocked={this.state.foodLocked}
              imageArray={foodCarouselImages}
              isSpinning={this.state.carouselSpinning}
              isHidden={this.state.mapUp}
              onClick={(lockClick) => this.carouselClick(lockClick, false)}
            />
            <MapContainer
              className={"mapContainer"}
              lat={this.state.lat}
              lng={this.state.lng}
              isHidden={!this.state.mapUp}
              onClick={(mapProps, map, clickEvent) =>
                this.mapClicked(mapProps, map, clickEvent)
              }
            ></MapContainer>
          </div>

          <div className="flex fullblock rouletteButtonContainer">
            <RouletteButton
              className="rouletteButton"
              isSpinning={this.state.carouselSpinning}
              onClick={() => this.spinButtonClick()}
            />
          </div>

          <div className="flex fullblock optionsButtonsContainers">
            <OptionsButton
              className="eventOptionsButton"
              isEventOptions={true}
              onClick={() => this.optionsClick(this.isEventOptions)}
            />
            <OptionsButton
              className="eventOptionsButton"
              isEventOptions={false}
              onClick={() => this.optionsClick(this.isEventOptions)}
            />
          </div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
