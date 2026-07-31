export function logHotlineClick(phone: string = "0559869392") {
  fetch('/api/notifications/log-hotline', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ phone })
  }).catch(err => console.error("Failed to log hotline call:", err));
}
