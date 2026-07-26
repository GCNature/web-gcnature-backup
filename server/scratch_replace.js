const fs = require('fs');
let content = fs.readFileSync('src/components/CheckoutPopup.tsx', 'utf8');
content = content.replace(/bg-red-/g, 'bg-blue-')
                 .replace(/text-red-/g, 'text-blue-')
                 .replace(/border-red-/g, 'border-blue-')
                 .replace(/shadow-red-/g, 'shadow-blue-')
                 .replace(/ring-red-/g, 'ring-blue-')
                 .replace(/accent-red-/g, 'accent-blue-');
content = content.replace(/text-blue-500">\*/g, 'text-red-500">*');
// Change specific hardcoded ACB blue color if we want, but blue-600 is fine.
fs.writeFileSync('src/components/CheckoutPopup.tsx', content);
console.log('Done CheckoutPopup');

let adminPayments = fs.readFileSync('src/pages/admin/AdminPayments.tsx', 'utf8');
adminPayments = adminPayments.replace(/bg-red-/g, 'bg-blue-').replace(/text-red-/g, 'text-blue-');
fs.writeFileSync('src/pages/admin/AdminPayments.tsx', adminPayments);
console.log('Done AdminPayments');
