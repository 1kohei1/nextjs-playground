import * as React from 'react';

import { KoCalendarConstants } from '../../models/Constants';
import PresentationSlotTile from './PresentationSlotTile';
import Presentation from '../../models/Presentation';
import PresentationDate from '../../models/PresentationDate';

export interface PresentationSlotsProps {
  ruler: number[];
  presentations: Presentation[];
  dbPresentationDates: PresentationDate[];
  cancelPresentation: (presentation: Presentation, note: string) => void;  
}

export default class PresentationSlots extends React.Component<PresentationSlotsProps, any> {
  render() {
    return (
      <div className="ko-presentationslot_wrapper">
        {this.props.presentations.map(presentation => (
          <PresentationSlotTile 
            key={presentation._id}
            ruler={this.props.ruler}
            presentation={presentation}
            dbPresentationDates={this.props.dbPresentationDates}
            cancelPresentation={this.props.cancelPresentation}
          />
        ))}
        <style jsx>{`
          .ko-presentationslot_wrapper {
            position: absolute;
            left: 0;
            top: ${KoCalendarConstants.dayTitleHeight};
            height: calc(100% - ${KoCalendarConstants.dayTitleHeight} - 1px);
            width: 100%;
          }
        `}
        </style>
      </div>
    );
  }
}
