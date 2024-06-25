const { denormalize } = require('./denormalize');
const { convertToIcal } = require('./ical');
const { parse } = require('./xml');
const { Event } = require('../models');
const fetch = require('node-fetch');

function extractEventData(channel) {
  return channel.items.map(event => {
    return {
      id: event.guid,
      title: event.title,
      description: event.description,
      link: event.link,
      date: event.pubDate
    }
  });
}

async function getOrUpdateInDb(events) {
  for (let i = 0; i < events.length; i++) {
    const data = events[i];
    const [event, created] = await Event.findOrCreate({
      where: { id: data.id },
      defaults: data
    });
    if (created) {
      console.log(`Event ${event.id} created`);
    } else {
      console.log(`Event ${event.id} already exists`);
    }
  }
}

let ical = convertToIcal([]);

async function updateIcal() {
  const events = await Event.findAll();
  ical = convertToIcal(events);
}

async function pipeline() {
  try {
    console.log('Fetching XML...');
    const response = await fetch(process.env.SPIELEND_URL);
    const xml = await response.text();
    console.log('Parsing XML...');
    const parsed = parse(xml);
    console.log('Denormalizing...');
    const data = denormalize(parsed);
    console.log('Extracting event data...');
    const events = data.map(extractEventData).flat();
    console.log('Getting or updating in DB...');
    await getOrUpdateInDb(events);
    console.log('Updating iCal...');
    await updateIcal();
  } catch (error) {
    console.error(error);
  }
}

function getIcal() {
  return ical;
}

module.exports = {
  pipeline,
  getIcal,
}