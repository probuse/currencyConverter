function startConversion(){
    const fromCurrency = document.getElementById('fromCurrency').value;
    const fromAmount = document.getElementById('fromAmount').value;
    const toCurrency = document.getElementById('toCurrency').value;
    
    const requestParams = {
        fromCurrency: fromCurrency,
        fromAmount: fromAmount,
        toCurrency: toCurrency
    };

    // callAPI(requestParams); 
    getCurrencies()
}

function getCurrencies(){
    fetch('https://free.currencyconverterapi.com/api/v5/currencies')
        .then(response => {
            return response.json();
        }).then(data => {
            let fromSelect = document.getElementById('fromCurrency');
            for(const currency of Object.keys(data.results)){
                // console.log(currency);
                let currencyOption = fillCurrencyDropdownMenu(currency);
                fromSelect.appendChild(currencyOption);
            }
        }).catch(error => {
            console.log(error);
        });
}

function fillCurrencyDropdownMenu(currency){
    let currencyOption = document.createElement('option');
    currencyOption.textContent = currency;
    return currencyOption;
}
