function convertToIcal(items) {
  var ical = 'BEGIN:VCALENDAR\n'
  ical += 'VERSION:2.0\n'
  ical += 'PRODID:-//spiele-nd.de//Kalender//DE\n\n'
  items.forEach(item => {
    ical += 'BEGIN:VEVENT\n'
    ical += 'UID:' + item.id + '\n'
    ical += 'SUMMARY:' + item.title + '\n'
    ical += 'X-MOZ-GOOGLE-HTML-DESCRIPTION:true\n'
    ical += 'DESCRIPTION:' + item.description + '\n'
    ical += 'URL:' + item.link + '\n'
    ical += 'DTSTART:' + dateToIcal(item.date) + '\n'
    ical += 'END:VEVENT\n\n'
  })
  ical += 'END:VCALENDAR\n'
  return ical
}

function dateToIcal(date) {
  return date.toISOString().replace(/-|:|\.\d+/g, '')
}

module.exports.convertToIcal = convertToIcal;
