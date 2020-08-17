"use strict";


const currencyList = document.querySelector(".currencyList");
const currenciesList = document.querySelector(".currencies");



const initiallyDisplayedCurrencies = ["EUR", "KRW", "CNY", "JPY", "HKD"];
let baseCurrency;
let baseCurrencyAmount;

let currencies = [
  {
    name: "Euro",
    afkorting: "EUR",
    symbol: "\u20AC"
  },
  {
    name: "Japanese Yen",
    afkorting: "JPY",
    symbol: "\u00A5"
  },
  {
    name: "Chinese Yuan Renminbi",
    afkorting: "CNY",
    symbol: "\u00A5"
  },
  {
    name: "Hong Kong Dollar",
    afkorting: "HKD",
    symbol: "\u0024"
  },
  {
    name: "South Korean Won",
    afkorting: "KRW",
    symbol: "\u20A9"
  },
];




currenciesList.addEventListener("input", currenciesListInputChange);

function currenciesListInputChange(event) {
  const newBaseCurrencyAmount = isNaN(event.target.value) ? 0 : Number(event.target.value);
  if(baseCurrencyAmount!==newBaseCurrencyAmount || isNewBaseCurrency) {
    baseCurrencyAmount = newBaseCurrencyAmount;
    const baseCurrencyRate = currencies.find(currency => currency.afkorting===baseCurrency).rate;
    currenciesList.querySelectorAll(".currency").forEach(currencyLI => {
      if(currencyLI.id!==baseCurrency) {
        const currencyRate = currencies.find(currency => currency.afkorting===currencyLI.id).rate;
        const exchangeRate = currencyLI.id===baseCurrency ? 1 : (currencyRate/baseCurrencyRate).toFixed(4);
        currencyLI.querySelector(".input input").value = exchangeRate*baseCurrencyAmount!==0 ? (exchangeRate*baseCurrencyAmount).toFixed(4) : "";
      }
    });
  }
}




function valueList() {
  for(let i=0; i<currencies.length; i++) {
    currencyList.insertAdjacentHTML(
      "beforeend", 
      `<li data-currency=${currencies[i].afkorting}></li>`
    );
  }
}

function valuesList() {
  for(let i=0; i<initiallyDisplayedCurrencies.length; i++) {
    const currency = currencies.find(c => c.afkorting===initiallyDisplayedCurrencies[i]);
    if(currency) newCurrenciesListItem(currency);
  }
}

function newCurrenciesListItem(currency) {
  if(currenciesList.childElementCount===0) {
    baseCurrency = currency.afkorting;
    baseCurrencyAmount = 0;
  }
  currencyList.querySelector(`[data-currency=${currency.afkorting}]`).classList.add("disabled");
  const baseCurrencyRate = currencies.find(c => c.afkorting===baseCurrency).rate;
  const exchangeRate = currency.afkorting===baseCurrency ? 1 : (currency.rate/baseCurrencyRate).toFixed(4);
  const inputValue = baseCurrencyAmount ? (baseCurrencyAmount*exchangeRate).toFixed(4) : "";

  currenciesList.insertAdjacentHTML(
    "beforeend",
    `<li class="currency ${currency.afkorting===baseCurrency ? "base-currency" : ""}" id=${currency.afkorting}>
      <div class="info">
        <p class="input"><span class="currency-symbol">${currency.symbol}</span><input placeholder="0.0000" value=${inputValue}></p>
        <p class="currency-name">${currency.afkorting} - ${currency.name}</p>
        <p class="base-currency-rate">1 ${baseCurrency} = ${exchangeRate} ${currency.afkorting}</p>
      </div>
    </li>`
  );
}

fetch("https://api.exchangeratesapi.io/latest")
  .then(res => res.json())
  .then(data => {
    data.rates["EUR"] = 1;
    currencies = currencies.filter(currency => data.rates[currency.afkorting]);
    currencies.forEach(currency => currency.rate = data.rates[currency.afkorting]);
    valueList();
    valuesList();
  })
  .catch(err => console.log(err));



  ////test

if (true) {
  let hello = 'say hello';
  console.log(hello);
}


///visitors


const visitorsList = document.querySelector('#visitors-list');
const form = document.querySelector('#add-visitors-section');


function renderVisitor(doc){
  let h2 = document.createElement('h2');
  let name = document.createElement('p');
  let lastName = document.createElement('p');
  let cross = document.createElement('div');


  h2.setAttribute('data-id', doc.id);
  name.textContent = doc.data().name;
  lastName.textContent = doc.data().lastName;
  cross.textContent= 'x';

  h2.appendChild(name);
  h2.appendChild(lastName);
  h2.appendChild(cross);

  visitorsList.appendChild(h2);


  cross.addEventListener('click', (e) => {
    e.stopPropagation();
    let id = e.target.parentElement.getAttribute('data-id');
    db.collection('Comment').doc(id).delete();
  })
}







form.addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection('Comment').add({
      name: form.name.value,
      lastName: form.lastName.value
  });
  form.name.value = '';
  form.lastName.value = '';
});


db.collection('Comment').orderBy('lastName').onSnapshot(snapshot => {
  let changes = snapshot.docChanges();
  changes.forEach(change => {
    if(change.type == 'added') {
      renderVisitor(change.doc);
    } else if (change.type == 'removed') {
      let h2 = visitorsList.querySelector('[data-id=' + change.doc.id + ']');
      visitorsList.removeChild(h2);
    }
    
  })
})

