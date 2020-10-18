import { DateFrame } from './DateFrame';
import { Georeference } from './Georeference';
import { Location } from './Location';

export class FrameData {
    protocol: String;
    codeProduct: String;
    plate: String;
    eventKey: String;
    eventCode: number;
    eventName: String;
    location: Location;
    georeference: Georeference;
    speed: number;
    azimuth: number;
    altitude: number;
    gpsStatus: number;
    gpsAccuracy: number;
    course: number;
    dateGPS: DateFrame;
    dateFrame: DateFrame;
    dateFrameUnit: DateFrame;
    frame: String;
    ipAddress: String;
    numberPort: String;
    countNumber: String;
    source: String;
    tenant: String;
    addData: JSON;

}
