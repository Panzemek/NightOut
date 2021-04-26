import React, { Component } from "react";
import Calendar from "react-calendar";

export default class CalendarComponent extends Component {
  render() {
    const { value, onChange } = this.props;
    return (
      <div className="calendarContainerInternal">
        <Calendar onChange={onChange} value={value} />
      </div>
    );
  }
}
