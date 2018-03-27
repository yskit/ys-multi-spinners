const timer = setInterval(() => {
  console.log(Date.now());
}, 1000);

process.on('SIGINT', () => {
  clearInterval(timer);
  process.exit(0);
});