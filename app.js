const ctx = document.getElementById('chart').getContext('2d')

const mapCoinToURLSegment = {
  btc: 'bitcoin',
  bnb: 'binance-coin',
  eth: 'ethereum'
}

let activeURLSegment = mapCoinToURLSegment.btc

const btc = document.querySelector('.btc')
const bnb = document.querySelector('.bnb')
const eth = document.querySelector('.eth')

async function requestRate() {
  const coin = activeURLSegment

  let chart;
  let label = [];
  let price = [];

  try {
    const response = await fetch(`https://api.coincap.io/v2/assets/${coin}/history?interval=m1`);
    const data = await response.json();

    if (!data || !data.data) throw new Error('Данные отсутствуют');

    label = data.data.map(item => new Date(item.time).toLocaleTimeString());
    price = data.data.map(item => parseFloat(item.priceUsd));

    if (!chart) {
      chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: label,
          datasets: [{
            fill: true,
            borderColor: "rgba(20,220,20,1)",
            backgroundColor: "rgba(0,255,0,0.1)",
            data: price,
            pointRadius: 0,
            pointHoverRadius: 0,
            borderWidth: 0,
          }]
        },
        options: {
          legend: { 
            display: false,
          },
          scales: {
            xAxes: [{
              display: false,
            }],
          },
          animation: {
            duration: 0
          },
        }
      });
    } else {
      chart.data.labels = label;
      chart.data.datasets[0].data = price;
      chart.update();
    }
    const text = document.querySelector('.text');
    const grow = document.getElementById('grow')
    if (text && price.length > 0) {
      text.textContent = `${price[price.length - 1].toFixed(2)}`;
      grow.innerHTML = `${(((price[price.length - 1] - price[price.length - 361]) / price[price.length - 1]) * 100).toFixed(2)} % <span>6h<span/>`
      if((((price[price.length - 1] - price[price.length - 361]) / price[price.length - 1]) * 100).toFixed(2) > 0){
        grow.style.color = "rgb(10, 182, 10)"
      } else {
        grow.style.color = "rgb(239, 15, 15)"
      }
    }

    const infoP = document.querySelector('.information-price')
    const infoD = document.querySelector('.information-date')
    const lastItems = price.slice(-70).reverse();
    const lastDates = label.slice(-70).reverse();
    infoP.innerHTML = lastItems.map((item, index, arr) => {
      let color;
      if (index === 0) {
        color = "rgba(10,200,10,1)"; // Первый элемент всегда черный
      } else {
        color = item > arr[index - 1] ? "rgba(10,200,10,1)" : "rgba(255,0,0,1)"; // Остальные окрашиваются
      }
      return `<li style="color: ${color}">${item}</li>`;
    }).join(""); 
    infoD.innerHTML = lastDates.map(item => `<li style="color: white">${item}<li/>`).join("")

  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
  }
}

btc.addEventListener('click', function(){
  activeURLSegment = mapCoinToURLSegment.btc
  requestRate()

  const name = document.querySelector('.title')
  name.textContent = 'BTC/USD'

  const coin1 = document.querySelector('.coin-img1')
  const coin2 = document.querySelector('.coin-img2')
  const coin3 = document.querySelector('.coin-img3')
  coin1.style.display = 'block'
  coin2.style.display = 'none'
  coin3.style.display = 'none'
  btc.style.opacity = '0.4'
  bnb.style.opacity = '1'
  eth.style.opacity = '1'
})
bnb.addEventListener('click', function(){
  activeURLSegment = mapCoinToURLSegment.bnb
  requestRate()

  const name = document.querySelector('.title')
  name.textContent = 'BNB/USD'

  const coin1 = document.querySelector('.coin-img1')
  const coin2 = document.querySelector('.coin-img2')
  const coin3 = document.querySelector('.coin-img3')
  coin1.style.display = 'none'
  coin2.style.display = 'block'
  coin3.style.display = 'none'
  btc.style.opacity = '1'
  bnb.style.opacity = '0.4'
  eth.style.opacity = '1'
})
eth.addEventListener('click', function(){
  activeURLSegment = mapCoinToURLSegment.eth
  requestRate()

  const name = document.querySelector('.title')
  name.textContent = 'ETH/USD'

  const coin1 = document.querySelector('.coin-img1')
  const coin2 = document.querySelector('.coin-img2')
  const coin3 = document.querySelector('.coin-img3')
  coin1.style.display = 'none'
  coin2.style.display = 'none'
  coin3.style.display = 'block'
  btc.style.opacity = '1'
  bnb.style.opacity = '1'
  eth.style.opacity = '0.4'
})

requestRate()
setInterval(requestRate, 10000)


