import {
  addHours,
  addMinutes,
  isPast,
  isFuture,
  startOfToday,
  nextSunday,
  isSunday,
} from 'date-fns';
import { zonedTimeToUtc } from 'date-fns-tz';
import * as LiveStream from '@apollosproject/data-connector-church-online';

const { schema, resolver } = LiveStream;

class dataSource extends LiveStream.dataSource {
  getCampusMap = () => {
    const today = zonedTimeToUtc(startOfToday(), 'America/Chicago');
    const sunday = isSunday(today) ? today : nextSunday(today);

    return {
      'Fellowship Fayetteville': {
        times: [
          zonedTimeToUtc(
            addMinutes(addHours(sunday, 8), 50),
            'America/Chicago'
          ),
          zonedTimeToUtc(
            addMinutes(addHours(sunday, 10), 15),
            'America/Chicago'
          ),
        ],
        url: 'https://resi.media/fel-bi-Ea/Manifest.m3u8',
      },
      'Fellowship Rogers': {
        times: [
          zonedTimeToUtc(
            addMinutes(addHours(sunday, 9), 20),
            'America/Chicago'
          ),
          zonedTimeToUtc(
            addMinutes(addHours(sunday, 10), 50),
            'America/Chicago'
          ),
        ],
        url: 'https://resi.media/fe-SH-Ar/Manifest.m3u8',
      },
      'Fellowship Mosaic': {
        times: [
          zonedTimeToUtc(
            addMinutes(addHours(sunday, 16), 50),
            'America/Chicago'
          ),
          zonedTimeToUtc(
            addMinutes(addHours(sunday, 18), 15),
            'America/Chicago'
          ),
        ],
        url: 'https://resi.media/fe-llo-sp/Manifest.m3u8',
      },
    };
  };

  async getLiveStream() {
    const { id } = await this.context.dataSources.Auth.getCurrentPerson();
    const campus = await this.context.dataSources.Campus.getForPerson({ id });
    const { times, url } = this.getCampusMap()[campus.name];

    return {
      isLive: isPast(times[0]) && isFuture(times[1]),
      eventStartTime: null,
      media: { sources: [{ uri: url }] },
      webViewUrl: null,
    };
  }

  async getLiveStreams() {
    const { ContentItem } = this.context.dataSources;
    // This logic is a little funky right now.
    // The follow method looks at the sermon feed and the `getLiveStream` on this module
    // If we have data in the sermon feed, and the `getLiveStream.isLive` is true
    // this returns an array of livestreams
    const liveItems = await ContentItem.getActiveLiveStreamContent();

    return Promise.all(
      liveItems.map(async (item) => {
        const { times, url } = this.getCampusMap()[
          item.attributeValues.congregation.valueFormatted
        ];
        return {
          contentItem: item,
          ...(await this.getLiveStream()),
          isLive: isPast(times[0]) && isFuture(times[1]),
          media: { sources: [{ uri: url }] },
        };
      })
    );
  }
}

export { schema, resolver, dataSource };
