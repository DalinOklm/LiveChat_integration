//const stripe = Stripe('pk_test_333PwYxyqGNH5j8waNwAe53f00RiiIIGW6');
var stripe = Stripe("pk_test_51HBpyCEz5HkY0yWD4ZQlo9SuYQ3jDR2AVrs9U96wQA2K9ilFfoXaV7XMNY1oIhrr6YxcjaX2XSfzs0ixZMGGOTIg00rz97pseB");

const elements = stripe.elements();

var style = {
    base: {
        color: "#fff"
    }
}
const card = elements.create('card', { style });
card.mount('#card-element');

const form = document.querySelector('form');
const errorEl = document.querySelector('#card-errors');

const stripeTokenHandler = token => {
    const hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);

    console.log(form)
    form.submit();
}

form.addEventListener('submit', e => {
    e.preventDefault();

    stripe.createToken(card).then(res => {
        if (res.error) errorEl.textContent = res.error.message;
        else {
            console.log(res.token)
            stripeTokenHandler(res.token);
        }
    })
})

