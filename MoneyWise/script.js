'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data

const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

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


// create UserNames

const createUserNames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  })
};

createUserNames(accounts);

// Display Movements

const displayMovements = function (movements, sort = false){
  containerMovements.innerHTML = '';

  const movs = sort ? movements.slice().sort((a, b) => a - b)
                    : movements;

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
      <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
      <div class="movements__date"> </div>
      <div class="movements__value">${mov}€</div>
  </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
}

// Display balanace

const calcDisplayBalance = function (acc) {

   acc.balance = acc.movements.reduce((acc, mov) =>
    acc + mov, 0);
  labelBalance.textContent = `${acc.balance} €`;
}

// Update UI 

const updateUI = function (acc) {

  // Display movements  
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);
  
  //Display summary
  calcDisplaySummary(acc);
}

// Display Summary

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumIn.textContent = `${incomes}`;

  const outcome = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);

  labelSumOut.textContent = `${Math.abs(outcome)}`;

  const interest = account.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter((int, i) => {
      return int >= 1;
    })
    .reduce((acc, curr) => acc + curr, 0);

  labelSumInterest.textContent = `${interest}`;
}

///////////////////////////////////////////////////
// Event Handlers

//Login event

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  // Prevent form from submitting
  e.preventDefault();
  currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
  console.log(currentAccount);

  //using optional chaining
  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and welcome message
    
    labelWelcome.textContent = `Welcome back, 
      ${currentAccount.owner.split(' ')[0]}`;
    
    containerApp.style.opacity = 100;

    //clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();

    //update UI
    updateUI(currentAccount);
  }
})

// Transfer Event

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc =>
    acc.username === inputTransferTo.value
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    //update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', function(e){ 
   e.preventDefault(); 
  const amt = Number(inputLoanAmount.value);
  
  if (amt > 0 && currentAccount.movements.some(
    mov => mov >= amt * 0.1)) {
    // Add movement
    currentAccount.movements.push(amt);

    //update UI
    updateUI(currentAccount);
  }
  inputLoanAmount.value = '';

})

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  if (inputCloseUsername.value == currentAccount.username &&
    Number(inputClosePin.value) === Number(currentAccount.pin)
  ) {
    const index = accounts.findIndex(acc =>
      acc.username === currentAccount.username);
    
    //delete the user account
    accounts.splice(index, 1);
    
    // hide UI
    containerApp.style.opacity = 0;

    inputCloseUsername.value = '';
    currentAccount.username = '';
  }
});

let sorted = false;

btnSort.addEventListener('click', function(e){ 
   e.preventDefault(); 
  displayMovements(currentAccount.movements, !sorted); 
  sorted = !sorted;
})

// const user = 'Steven Thomas Williams';
// console.log(createUserNames(user));

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

console.log('--------------------------------')
const movements = account1.movements;

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);
//
const eurToUSD = 1.1;
// const movements = account1.movements;
// const movementsUSD = movements.map(function (mov) {
//   return mov * eurToUSD;
// })
const movementsUSD = movements.map((mov) => mov * eurToUSD);

console.log(movements)
console.log(movementsUSD)

const movementsDescriptions = movements.map((mov, i) =>
  `Movement ${i + 1}: You ${mov > 0 ? 'deposited' : 'withdrew'} ${Math.abs(mov)}`
)
console.log(movementsDescriptions);


const deposits = movements.filter((mov) => mov > 0);
console.log(deposits);

const withrawals = movements.filter(mov => mov < 0);
console.log(withrawals);

const balance = movements.reduce((acc, curr, i, test) =>
  acc + curr, 0);
console.log(balance);

console.log(accounts);



// maximum value
const max = movements.reduce((acc, mov) => {
  if (acc > mov) return acc;
  else return mov;
}, movements[0]);
console.log(max);



// PIPELINE 
const totalDepositUSD = movements
  .filter(mov => mov > 0)
  .map(mov => mov * eurToUSD)
  .reduce((acc, mov) => acc + mov, 0);



console.log("totalDepositUSD " + Math.round(totalDepositUSD));


/////////////////////////////////////////////////
//  coding challege 1

/*
const checkDogs = function (test1, test2) {
  const test1_ = test1.slice(1, -2);
  const test = test1_.concat(test2);
  // console.log(test)
  test.forEach(function (ele, i) {
    const type = ele >= 3 ? 'adult' : 'puppy';
    if (type === 'adult') {
      console.log(`Dog number ${i + 1} is an adult, and is ${ele} years old.`)
    }
    else
      console.log(`Dog number ${i + 1} is still a ${type} 🐶`);
  });
}

const julia_data = [3, 5, 2, 12, 7];
const julia_data2 = [3, 5, 2, 12, 7];
const kate_data = [9, 16, 6, 8, 3];
const kate_data2 = [10, 5, 6, 1, 4];

checkDogs(julia_data, kate_data);
checkDogs(julia_data2, kate_data2);

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]
*/

//////////////////////////////////////////////////////////
// coding challenge #2
//////////////////////////////////////////////////////////


const calcAverageHumanAge = function (test) {
  // const test_ = test.map((age, i) => age <= 2 ? age * 2 : 16 + age * 4
  // );
  const test_ = test.map(function (age, i) {
    if (age <= 2) return age * 2;
    else return 16 + age * 4;
  })
  return test_;
}

const calcAverageHumanAge_ = ages =>
  ages
    .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
    .filter(age => age >= 18)
    .reduce((acc, age, i, test) => acc + age / test.length, 0);


const avg1 = calcAverageHumanAge_([5, 2, 4, 1, 15, 8, 3]);
const avg2 = calcAverageHumanAge_([16, 6, 10, 5, 6, 1, 4]);
console.log(Math.abs(avg1), Math.abs(avg2));

// const human_18 = human_.filter((ele, i) => ele > 18);
// console.log(human_18);

// const sum = human_18.reduce((acc, age) => acc + age, 0);
// const avg = sum / human_18.length;
// console.log(avg);
//////////////////////////////////////////////////////////
// coding challenge #3
//////////////////////////////////////////////////////////

const firstWithdrawal = movements.find(mov => mov < 0)
// find method returns first element int the testay which satisfy the condition
// find() is used when we need just one element
console.log(movements);
console.log(firstWithdrawal);

console.log(accounts);
const account = accounts.find(acc => acc.owner === 'Jessica Davis');

///////////////////////////////////////////////
//  sort function 

const test = [1, 2, 99, 3];
console.log(test);
test.sort((a, b) => a - b);

console.log(test);

const x = new Array(7);
console.log(x);

x.fill(1, 3, 5);
console.log(x);

//from() method
const z = Array.from({ length: 7 }, (_, i) => i+ 1);
console.log(z);


labelBalance.addEventListener('click', function(e){ 
   e.preventDefault(); 
  const movementsUI = Array.from(
    document.querySelectorAll('.movements__value'),
    el => Number(el.textContent.replace('€', ''))
  );
  console.log(movementsUI);
})


/////////////////////////////////////////////////////
// Array Methods Practice
///////////////////////////////////////////

// ex -1 calculate deposit amount in the bank
// console.log(accounts);
const bankDepositSum = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov > 0)
  .reduce((acc, mov) => acc + mov, 0);
console.log(bankDepositSum);

// ex -2 how many deposits in the bank with atleast 1000 usd
const numDeposits1000 = accounts
  .flatMap(acc => acc.movements)
  .filter(mov => mov >= 1000).length;

//array of mov >= 1000
console.log(accounts
  .flatMap(acc => acc.movements).filter(mov => mov >= 1000));
  
// using reduce method 
const numDeposits1000_ = accounts
  .flatMap(acc => acc.movements)
  .reduce((count, curr) =>
    curr >= 1000 ? ++count : count, 0);

console.log(numDeposits1000_);

// 3. advance case of reduce method
/*  creating object using reduce method. */
//    to create an object which contains the sum of deposits and of their withdrawal

const { deposits_, withdrawals_ }  = accounts
  .flatMap(acc => acc.movements)
  .reduce((obj, curr) => {
    // curr > 0 ? obj.deposits_ += curr : obj.withdrawals_ += curr;
    obj[curr > 0 ? 'deposits_' : 'withdrawals_'] += curr;
    return obj;
  }, { deposits_: 0, withdrawals_: 0 });

console.log(deposits_, withdrawals_);

// 4.
// title string
// this is a nice title -> This Is a Nice Title

const convertTitleCase = function (title) {

  const capitalize = str => str[0].toUpperCase() + str.slice(1);
  const exceptions = ['a', 'an', 'the', 'and', 'but', 'or', 'on', 'in', 'with'];
  
  const titleCase = title
    .toLowerCase()
    .split(' ')
    .map(word => exceptions.includes(word) ? word : capitalize(word))
    .join(' ');
  
  return capitalize(titleCase);
}

console.log(convertTitleCase('this is a Long title but not too long'));
console.log(convertTitleCase('this is a nice title'))
console.log(convertTitleCase('and here is another title with an example'))

/*
CODING CHALLENGE #4


Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).


1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object 
   as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. 
   (The result is in grams of food, and the weight needs to be in kg)
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: 
   Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky 
   (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs
   who eat too little ('ownersEatTooLittle').
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" 
   and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order
   (keep in mind that the portions are inside the array's objects)

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.
*/

// 1.
const recommendedFood = function (dogs) {
  dogs.forEach(dog => {
    dog.recommendedFood = Math.round(dog.weight ** 0.75 * 28);
  });
  return dogs;
}

const foodIntake = function (dogs) {
  dogs.forEach(dog => {
    dog.foodIntake = (dog.curFood > dog.recommendedFood) ? 'too much' : 'too little';
  });
}

const findTooMuch = function (dogs, foodInTake) {
  let owners= [];
  dogs.forEach(dog => {
    if (dog.foodIntake === foodInTake) owners.push(dog.owners);
  });
  return owners.flat();
}


//////////////////////////////////////////////////////
// test 

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];
recommendedFood(dogs)

foodIntake(dogs);
console.log(dogs);

const sarah_dogs = dogs.filter(dog => dog.owners.includes('Sarah'));
console.log(sarah_dogs);

sarah_dogs.forEach(dog => {
  console.log(dog.foodIntake);
});

const ownersEatTooMuch = findTooMuch(dogs, 'too much');
const ownersEatTooLittle= findTooMuch(dogs, 'too little');
console.log(ownersEatTooMuch);
console.log(ownersEatTooLittle);

console.log(`${ownersEatTooMuch.join(' and ')}'s dog eat too much`)
console.log(`${ownersEatTooLittle.join(' and ')}'s dog eat too little`)

console.log(dogs.some(dog => dog.curFood == dog.recommendedFood))

const checkOkay = dog =>
  dog.curFood > (dog.recommendedFood * 0.9) &&
  dog.curFood < (dog.recommendedFood * 1.1);

console.log(dogs.some(checkOkay));

console.log(dogs.filter(checkOkay));

dogs.sort()
console.log(dogs);

const dogsSorted = dogs.slice().sort((a, b) => a.recommendedFood - b.recommendedFood);
console.log(dogsSorted);




