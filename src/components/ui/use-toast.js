// Simple toast implementation
let toastQueue = [];

export const toast = ({ title, description, variant = 'default' }) => {
  console.log(`Toast [${variant}]: ${title}${description ? ' - ' + description : ''}`);
  // For now, just log to console. In production you'd implement a proper toast system
};