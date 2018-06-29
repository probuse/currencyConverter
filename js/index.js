window.addEventListener('load', () => {
    // remember to consult the cache for offline functionality.
    fetch('https://free.currencyconverterapi.com/api/v5/currencies').then(response => {       
        return response.json();   
    }).then(data => {
        for(const currency of Object.values(data.results)){
            /* populate option fields */
            let currencyOption = document.createElement('option');
            let fromSelect = document.getElementById('fromCurrency');
            currencyOption.textContent = currency.currencyName;
            currencyOption.setAttribute("id", currency.id);
            fromSelect.appendChild(currencyOption);
        }

        for(const currency of Object.values(data.results)){
            /* populate option fields */
            let currencyOption = document.createElement('option');
            let toSelect = document.getElementById('toCurrency');
            currencyOption.textContent = currency.currencyName;
            currencyOption.setAttribute("id", currency.id);
            toSelect.appendChild(currencyOption);
        }
    });
});

document.getElementById('submitCurrency').addEventListener('click', () => {
    startConversion();
});

function startConversion(){
    const fromSelector = document.getElementById('fromCurrency');
    const toSelector = document.getElementById('toCurrency');
    const fromAmount = document.getElementById('fromAmount').value;
    const fromCurrency = fromSelector.value;
    const toCurrency = toSelector.value;
    const fromId = encodeURIComponent(fromSelector[fromSelector.selectedIndex].id);
    const toId = encodeURIComponent(toSelector[toSelector.selectedIndex].id);
    
    let query = `${fromId}_${toId}`
    fetch(`https://free.currencyconverterapi.com/api/v5/convert?q={${query}}`).then(response => {
        console.log(response.json());
        console.log('We resolved');
    }).catch(error => {
        console.log(error);
        console.log('We resolved');
    });
}