const cron = require('node-cron');

let job = cron.schedule('16 12 18 * *', () => {
    console.log(new Date());
}, {
    scheduled: true,
    timezone: "America/Chicago"
});

const myTimeout = setTimeout(myGreeting, 300000);
function myGreeting() {
    console.log("Wait 5 mins, and change the cronExpression.");
    job.stop();
    
    job = cron.schedule('25 12 18 * *', () => {
        console.log(new Date());
    }, {
        scheduled: true,
        timezone: "America/Chicago"
    });
  }
