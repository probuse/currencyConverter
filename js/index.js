function getDatabaseObject(){
    return idb.open('currencyConverter-store', 1, upgradeDb => {
        switch(upgradeDb.oldVersion) {
            case 0:
                upgradeDb.createObjectStore('currencies');
            case 1:
                upgradeDb.createObjectStore('currencyRates');
        }
    })
}
window.addEventListener('load', () => {
    // remember to consult the cache for offline functionality.
    document.getElementById('fromAmount').value = 0;
    document.getElementById('toAmount').value = 0;

    fetch('https://free.currencyconverterapi.com/api/v5/currencies').then(response => {       
        return response.json();   
    }).then(data => {
        for(const currency of Object.values(data.results)){
            /* populate from option fields */
            let currencyOption = document.createElement('option');
            let fromSelect = document.getElementById('fromCurrency');
            currencyOption.textContent = currency.currencyName;
            currencyOption.setAttribute("id", currency.id);
            fromSelect.appendChild(currencyOption);
        }

        for(const currency of Object.values(data.results)){
            /* populate to option fields */
            let currencyOption = document.createElement('option');
            let toSelect = document.getElementById('toCurrency');
            currencyOption.textContent = currency.currencyName;
            currencyOption.setAttribute("id", currency.id);
            toSelect.appendChild(currencyOption);
        }
    }).catch(error => {
        getDatabaseObject().then(db => {
            let currenciesStore = db.transaction('currencies').objectStore('currencies');
            return currenciesStore.openCursor();
        }).then(function populateUI(currencies) {
            if(currencies){
                /* populate from option fields */
                let fromCurrencyOption = document.createElement('option');
                let toCurrencyOption = document.createElement('option');
                let fromSelect = document.getElementById('fromCurrency');
                let toSelect = document.getElementById('toCurrency');
                fromCurrencyOption.textContent = currencies.value[0];
                toCurrencyOption.textContent = currencies.value[1];
                fromCurrencyOption.setAttribute("id", currencies.key.split('_')[0]);
                toCurrencyOption.setAttribute("id", currencies.key.split('_')[1]);
                fromSelect.appendChild(fromCurrencyOption);
                toSelect.appendChild(toCurrencyOption);
                return currencies.continue().then(populateUI);
            }
        });
    }); 
});


const startConversion = () => {
    const fromSelector = document.getElementById('fromCurrency');
    const toSelector = document.getElementById('toCurrency');
    const fromAmount = document.getElementById('fromAmount').value;
    const fromCurrency = fromSelector.value;
    const toCurrency = toSelector.value;
    const fromId = fromSelector[fromSelector.selectedIndex].id;
    const toId = toSelector[toSelector.selectedIndex].id;
    let toAmount = document.getElementById('toAmount');
    
    let query = `${fromId}_${toId}`;
    let inverseQuery = `${toId}_${fromId}`;
    
    fetch(`https://free.currencyconverterapi.com/api/v5/convert?q=${query},${inverseQuery}&compact=ultra`).then(response => {
        return response.json();
    }).then(data => {
        [queryResult, inverseQueryResult] = Object.values(data);
        conversionResult = fromAmount * queryResult;
        toAmount.value = conversionResult;

        getDatabaseObject().then(db => {
            let currenciesTX = db.transaction('currencies', 'readwrite');
            let currencyRatesTX = db.transaction('currencyRates', 'readwrite');
            let currenciesStore = currenciesTX.objectStore('currencies');
            let currencyRatesStore = currencyRatesTX.objectStore('currencyRates');

            let currenciesKey = `${fromId}_${toId}`;
            let inverseCurrenciesKey = `${toId}_${fromId}`;
            let currenciesValue = [fromCurrency, toCurrency];

            currenciesStore.put(currenciesValue, currenciesKey);
            currencyRatesStore.put(queryResult, currenciesKey);
            currencyRatesStore.put(inverseQueryResult, inverseCurrenciesKey);
            currenciesTX.complete;
            currencyRatesTX.complete;
        }).then(() => {
            
            console.log('Currencies Successfully stored in Database.');
        });
        
    }).catch(error => {
        console.log(error);
        getDatabaseObject().then(db => {
            let currencyRatesStore = db.transaction('currencyRates').objectStore('currencyRates');
            return currencyRatesStore.openCursor();
        }).then(function calculateRate(cursor) {
            if(cursor){
                if(cursor.key === query){
                    toAmount.value = cursor.value * fromAmount;
                }
            return cursor.continue().then(calculateRate);
            }
        }); 
    });
}

