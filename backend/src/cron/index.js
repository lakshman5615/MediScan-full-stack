// Initialize all cron jobs
require('./reminder.cron');
require('./expiry.cron');
require('./stock.cron');

console.log('🚀 All alert cron jobs initialized');