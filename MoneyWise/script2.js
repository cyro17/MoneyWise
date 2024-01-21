'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2024-01-18T17:01:17.194Z',
    '2024-01-19T23:36:17.929Z',
    '2024-01-20T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'en-US', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'pt-PT',
};

const accounts = [account1, account2];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const labelBalanceDate = document.querySelector('.balance__date');


const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions

const formatMovementDate = function (date, locale) {
  const calcdaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
  
  const daysPassed = calcdaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed  <=7 ) return `${daysPassed}`;

  // const day = `${date.getDate()}`.padStart(2, 0);
  // const month = `${date.getMonth() + 1}`.padStart(2, 0);
  // const year = date.getFullYear();
    
  return new Intl.DateTimeFormat(locale).format(date);
}


const displayMovements = function (acc, movements, sort = false) {
  containerMovements.innerHTML = '';

  const movs = sort ? acc.movements
    .slice()
    .sort((a, b) => a - b) : acc.movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const date = new Date(acc.movementsDates[i]);
    const displayDate = formatMovementDate(date);
    

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
      } ${type}
      </div>
      <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${mov.toFixed(2)}€</div>
      </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${acc.balance.toFixed(2)}€`;

  const date = new Date();

  const displayDate = formatMovementDate(date, acc.locale);

  const min = `${date.getMinutes()}`.padStart(2, 0);
  const hour = `${date.getHours()}`.padStart(2, 0);

  // labelBalanceDate.textContent = `As of ${displayDate}, ${hour}:${min}`
};

const calcDisplaySummary = function (acc) {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${incomes.toFixed(2)}€`;

  const out = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${Math.abs(out).toFixed(2)}€`;

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter((int, i, arr) => {
      // console.log(arr);
      return int >= 1;
    })
    .reduce((acc, int) => acc + int, 0);
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

const startLogOutTimer = function () {

  const tick = function () {
    const min = String(Math.trunc(time / 60)).padStart(2, 0);
    const sec = String(Math.trunc(time % 60)).padStart(2, 0);

    // In each call, print hte remaining time to UI
    labelTimer.textContent = `${min}:${sec}`;
    
    // when 0 seconds, stop timer and logout user
    if (time === 0) {
      clearInterval(timer);
      labelWelcome.textContent = `Login to get started!!!`;
      containerApp.style.opacity = 0;
    };

    // Decrease 1s
    time--;
  };

    // set time to 5 minutes
    let time = 120;

    // call the timer every second
    // tick();
    const timer = setInterval(tick, 1000);

    return timer;
  }


///////////////////////////////////////
// Event handlers
let currentAccount, timer;

// fase always logged in

// currentAccount = account1;
// updateUI(currentAccount);
// containerApp.style.opacity = 100;


// Experimenting with API

// ->  use mdn Intl API

///////////////////////////////////////////////////
btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );
  console.log(currentAccount);

  if (currentAccount?.pin === +inputLoginPin.value) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 100;

    // Create current date and time
    const now = new Date();
    const options = {
      hour: 'numeric',
      minute: 'numeric',
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
      // weekday: 'long'
    };

    // const locale = navigator.language;
    // console.log(locale);

    labelDate.textContent = new Intl.DateTimeFormat
        (currentAccount.locale, options).format(now);

    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    if (timer) clearInterval(timer);
    timer = startLogOutTimer()

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {

    setTimeout(function () {
      
      // Doing the transfer
      currentAccount.movements.push(-amount);
      receiverAcc.movements.push(amount);

      // Add transfer date
      currentAccount.movementsDates.push(new Date().toISOString());
      receiverAcc.movementsDates.push(new Date().toISOString());

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
      
      // Update UI
      updateUI(currentAccount);

    }, 1000);
  };
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Math.floor(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov =>
    mov >= amount * 0.1)) {
    
    setTimeout(function () {
      // Add movement
      currentAccount.movements.push(amount);

      // Add loan date
      currentAccount.movementsDates.push(new Date().toISOString());
      
      // Update UI
      updateUI(currentAccount);

      // Reset timer
      clearInterval(timer);
      timer = startLogOutTimer();
      
    }, 2500);
    inputLoanAmount.value = '';
  }
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    +inputClosePin.value === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    // Delete account
    accounts.splice(index, 1);

    // Hide UI
    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';
});


let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

//convert strings to number using +

console.log(Number('23'));
console.log(+'23');

//parsing 
console.log(Number.parseInt('30px', 10));  // 30
console.log(Number.parseInt('e30', 10));   // NaN

console.log(Number.parseInt('2.5rem'));   // 2
console.log(Number.parseFloat('2.5rem')); // 2.5

// parseFloat() method is better way to check whether it is 
// float number  ,mostly coming out of css

// use only when to check is NaN
console.log(Number.isNaN(20));          //false
console.log(Number.isNaN('20'));        //false
console.log(Number.isNaN(+'20X'));      //true
console.log(Number.isNaN(23 / 0));      //true


// checking if value is a number not a string
// isFinite() method is best way of checking this

console.log(Number.isFinite(20));         //true
console.log(Number.isFinite('20'));       //false
console.log(Number.isFinite(+'20X'));     //false
console.log(Number.isFinite(20 / 0));     //false

console.log(Number.isInteger(23));      // true
console.log(Number.isInteger(23.0));    // true


console.log(Math.sqrt(23));

console.log(Math.trunc(Math.random() * 6) + 1);

// random() => gievs a no betweetn 0 - 1
// trunc()  => returns integer part of the number
// round()  => returns the value of number rounded to nearest integer
// abs()    => returns absolute value of the no.

const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min) + 1) + min;

  
// Rounding decimals
console.log((2.7).toFixed(0));
console.log((2.7).toFixed(3));
console.log((2.345).toFixed(2));
console.log(+(2.345).toFixed(0));

/////////////////////////////////////

const isEven = n => n % 2 === 0;
console.log(isEven(2));

labelBalance.addEventListener('click', function(e){ 
   e.preventDefault(); 
   [...document.querySelectorAll('.movements__row')].
     forEach(function (row, i) {
       if (i % 2 === 0) row.style.backgroundColor = 'orangered';
     });
})

console.log(Number('230_000'))
console.log(parseInt('230_000'))

///////////////////////////////////////////
console.log(2 ** 53 - 1);
console.log(Number.MAX_SAFE_INTEGER);
 
console.log(23422444444332444444442111n)



// working with dates

const future = new Date(2037, 10, 19, 15, 23);
console.log(future);



// const days1 = calcdaysPassed(new Date(2037, 3, 14),
//   new Date(2037, 3, 24));
// console.log(days1);

 
// Intl Time API

const now_ = new Date();
console.log(new Intl.DateTimeFormat('en-US').format(now_));

const num = 34324232.23;

console.log(
  new Intl
  .NumberFormat('en-US')
    .format(num)
)
  
// 34,324,232.23

console.log(
  new Intl
  .NumberFormat(navigator.language)
    .format(num)
)

// 3,43,24,232.23


// timeout function

setTimeout(() => console.log('pizza'), 2000)

const ingredients = ['curious', 'spinach'];
const pizzaTimer = setTimeout(
  (ing1, ing2) =>
    console.log(`pizza with ${ing1} ${ing2}`),
  3000,
  'olives',
  'spinach'
);

console.log('waiting...');

// how to stop timer
if (ingredients.includes('spinach'))
  clearTimeout(pizzaTimer);

// setTimeout

// setInterval(function () {
//   const now = new Date();
//   console.log(now);
// });

