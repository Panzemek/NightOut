import React, { Component } from "react";
import { Map, Marker, GoogleApiWrapper } from "google-maps-react";

export class MapContainer extends Component {
  render() {
    const { google, mapWasClicked, onClick } = this.props;
    return (
      <Map
        initialCenter={{ lat: this.props.lat, lng: this.props.lng }}
        style={{ width: "414px", height: "606px", position: "relative" }}
        className={`googleMap ${this.props.isHidden ? "noDisplay" : ""}`}
        google={google}
        zoom={14}
        onClick={onClick}
      >
        <Marker position={{ lat: this.props.lat, lng: this.props.lng }} />
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAY_7_HsiREY4UmT8OzEXU7WeEy8ANzoPc",
})(MapContainer);
