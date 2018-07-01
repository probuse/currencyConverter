self.addEventListener('install', event => {
    console.log('We are installing service worker.')
});

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
    });
});


startConversion = () => {
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
        
    }).catch(error => {
        console.log(error);
    });
}

