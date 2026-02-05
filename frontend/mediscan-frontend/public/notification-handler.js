// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  
  const { action, data } = event.notification;
  const medicineId = data?.medicineId;
  
  event.notification.close();
  
  if (action && medicineId) {
    // Handle action button clicks
    if (action.startsWith('taken_')) {
      // Call taken API
      fetch(`http://localhost:5000/api/medicine-action/taken/${medicineId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      }).then(() => {
        console.log('Medicine marked as taken');
      });
    } else if (action.startsWith('missed_')) {
      // Call missed API
      fetch(`http://localhost:5000/api/medicine-action/missed/${medicineId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      }).then(() => {
        console.log('Medicine marked as missed');
      });
    }
  }
  
  // Open app
  event.waitUntil(
    clients.openWindow('/')
  );
});