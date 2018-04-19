import * as React from 'react';
import { List } from 'immutable';
import Link from 'next/link';
import { Row, Col, Alert, Checkbox, Button, Slider, Form } from 'antd';

import AppLayout from '../components/AppLayout';
import { Semester } from '../models/Semester';
import Faculty from '../models/Faculty';
import AvailableSlot from '../models/AvailableSlot';
import PresentationDate from '../models/PresentationDate';
import Presentation from '../models/Presentation';
import { DateConstants, SchedulingCalendarConstants, ScheduleFormLayoutConstants } from '../models/Constants';
import TimeSlot from '../models/TimeSlot';
import DatetimeUtil from '../utils/DatetimeUtil';
import Api from '../utils/Api';
import Loading from '../components/Loading';
import SchedulingCalendar from '../components/SchedulingCalendar/SchedulingCalendar';
import CalendaroForm from '../components/CalendarForm';

export interface CalendarProps {
  semester: Semester;
}

interface CalendarState {
  loading: boolean;
  errs: List<string>;

  faculties: Faculty[];
  availableSlots: AvailableSlot[];
  presentationDates: PresentationDate[];
  presentations: Presentation[];

  facultyColumnRatio: number;
  checkedFaculties: string[];
}

export default class Calendar extends React.Component<CalendarProps, CalendarState> {
  static async getInitialProps() {
    const semesters = await Api.getSemesters();
    const semester = semesters[0];

    return {
      semester,
    }
  }

  constructor(props: CalendarProps) {
    super(props);

    this.state = {
      loading: true,
      errs: List<string>(),

      faculties: [],
      availableSlots: [],
      presentationDates: [],
      presentations: [],

      facultyColumnRatio: 1,
      checkedFaculties: [],
    }

    this.onSlideChange = this.onSlideChange.bind(this);
    this.onFacultyChange = this.onFacultyChange.bind(this);
  }

  onErr(err: string) {
    this.setState({
      errs: this.state.errs.push(err),
      loading: false,
    });
  }

  componentDidMount() {
    Promise.all([
      this.getFaculties(),
      this.getAvailableSlots(),
      this.getPresentationDates(),
      this.getPresentations(),
    ])
      .then(() => {
        this.setState({
          loading: false,
        });
      })
      .catch(err => {
        this.onErr(err.message);
      })
  }

  private async getFaculties() {
    try {
      const faculties = await Api.getFaculties('isActive=true');
      this.setState({
        faculties,
        checkedFaculties: faculties.map((f: Faculty) => f._id),
      });
    } catch (err) {
      this.onErr(err.message);
    }
  }

  private async getAvailableSlots() {
    try {
      const availableSlots = await Api.getAvailableSlots(`semester=${this.props.semester._id}`);
      this.setState({
        availableSlots,
      });
    } catch (err) {
      this.onErr(err.message);
    }
  }

  private async getPresentationDates() {
    try {
      const presentationDates = await Api.getPresentationDates(`semester=${this.props.semester._id}`);
      this.setState({
        presentationDates,
      })
    } catch (err) {
      this.onErr(err.message);
    }
  }

  private async getPresentations() {
    try {
      const presentations = await Api.getPresentations(`semester=${this.props.semester._id}`);
      this.setState({
        presentations,
      });
    } catch (err) {
      this.onErr(err.message);
    }
  }

  onSlideChange(val: number) {
    this.setState({
      facultyColumnRatio: val,
    });
  }

  onFacultyChange(fid: string, checked: boolean) {
    const copyCheckedFaculties = [...this.state.checkedFaculties];
    if (checked) {
      copyCheckedFaculties.push(fid);
    } else {
      const index = copyCheckedFaculties.indexOf(fid);
      copyCheckedFaculties.splice(index, 1);
    }
    this.setState({
      checkedFaculties: copyCheckedFaculties,
    })
  }

  render() {
    return (
      <AppLayout>
        <div className="container">
          <h1>Semester calendar</h1>
          <CalendaroForm
            facultyColumnRatio={this.state.facultyColumnRatio}
            onSlideChange={this.onSlideChange}
            faculties={this.state.faculties}
            checkedFaculties={this.state.checkedFaculties}
            onFacultyChange={this.onFacultyChange}
          />
          {this.state.loading ? <Loading /> : (
            <SchedulingCalendar
              presentationDates={
                this.state.presentationDates
                  .filter((pd: PresentationDate) => this.state.checkedFaculties.indexOf(pd.admin._id) >= 0)
              }
              faculties={
                this.state.faculties
                  .filter((f: Faculty) => f.isAdmin || this.state.checkedFaculties.indexOf(f._id) >= 0)
              }
              availableSlots={this.state.availableSlots}
              presentations={this.state.presentations}
              facultyColumnRatio={this.state.facultyColumnRatio}
            />
          )}
          <div className="description">
            Ready to schedule presentation?&nbsp;&nbsp;&nbsp;
            <Link href="/schedule">
              <a>
                <Button type="primary">
                  Schedule presentation
                </Button>
              </a>
            </Link>
          </div>
        </div>
        <style jsx>{`
          .container {
            max-width: ${SchedulingCalendarConstants.containerWidth};
            padding-left: ${SchedulingCalendarConstants.containerLeftPadding};
            padding-right: ${SchedulingCalendarConstants.containerRightPadding};
            margin: auto;
            margin-top: 100px;
          }
          .container h1 {
            margin: 0;
          }
          .description {
            padding: 32px 0;
            line-height: 32px;
          }
        `}</style>
      </AppLayout>
    );
  }
}
