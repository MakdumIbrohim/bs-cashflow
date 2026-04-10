const url = "https://script.google.com/macros/s/AKfycbwKSxtsmw-E52NQrEos8URCm3k7ogKxYhkBSmZFojRyxWHpVAOUp3FYyI9RFpCcEzRSuw/exec";
const body = new URLSearchParams({
  action: "create",
  type: "pemasukan",
  date: "2026-04-10",
  title: "Test API",
  amount: "50000"
});

fetch(url, {
  method: "POST",
  body: body.toString(),
  headers: {
    "Content-Type": "application/x-www-form-urlencoded"
  }
}).then(res => res.text()).then(console.log).catch(console.error);
