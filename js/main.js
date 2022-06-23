// todo: Take gifs/screenshots of original for comparison
// todo: Make the page somewhat presentable, use some decent CSS for styling the forms
// todo: make the HTML semantically correct
// todo:(good luck!) refactor the code into something you can actually read X years later

var hitCalcDiv = document.getElementById('outputsHere');
var woundCalcDiv = document.getElementById('out2');
var totalHitPct = 0;
var totalWoundPct = 0;
var totalCritPct = 0;
var completeMissPct = 0;
var completeFailurePct = 0;
var failedWoundPct = 0;
var averageHits = 0;
var averageWounds = 0;
var averageFailures = 0;
var averageCrits = 0;

function clearHitCalcResults() {
  hitCalcDiv.innerHTML = '<BR>';
  totalHitPct = 0;
  averageHits = 0;
}
function clearWoundCalcResults() {
  woundCalcDiv.innerHTML = '<BR>';
  totalWoundPct = 0;
  averageWounds = 0;
  averageCrits = 0;
  totalCritPct = 0;
}
function updateHitCalcValues() {
  let x = document.forms['inputValues']['numOfDice'].value;
  let y = document.forms['inputValues']['wepReq'].value;
  let z = document.forms['inputValues']['bonusAcc'].value;
  let a = document.forms['inputValues']['enemyEvasion'].value;
  numOfDice = parseInt(x) || 1;
  console.log(numOfDice + ' numOfDice');
  wepReq = parseInt(y) || 0;
  console.log(wepReq + ' wepReq');
  bonusAcc = parseInt(z) || 0;
  console.log(bonusAcc + ' bonusAcc');
  enemyEvasion = parseInt(a) || 0;
  console.log(enemyEvasion + ' enemyEvasion');
  Accuracy = wepReq - 1 - bonusAcc + enemyEvasion;
  console.log(Accuracy + ' accuracy');
  //I have no idea why, but this number sometimes gets multiplied by 10.
  missChance = Accuracy / 10;
  if (missChance < 0.1) {
    missChance = 0.1;
  }
  if (missChance > 0.9) {
    missChance = 0.9;
  }
  console.log(missChance + ' missChance');
  hitChance = 1 - missChance;
  console.log(hitChance + ' hitChance');
}
function updateWoundCalcValues() {
  let x = document.forms['woundValues']['numOfHits'].value;
  let y = document.forms['woundValues']['wepStr'].value;
  let z = document.forms['woundValues']['bonusStr'].value;
  let a = document.forms['woundValues']['enemyToughness'].value;
  let b = document.forms['woundValues']['luck'].value;
  numOfHits = parseInt(x) || 1;
  console.log(woundValues + ' woundValues');
  wepStr = parseInt(y) || 0;
  console.log(wepStr + ' wepStr');
  bonusStr = parseInt(z) || 0;
  console.log(bonusStr + ' bonusStr');
  enemyToughness = parseInt(a) || 0;
  console.log(enemyToughness + ' enemyToughness');
  luck = parseInt(b) || 0;
  woundFailChance = (enemyToughness - wepStr - bonusStr) / 10;
  console.log(woundFailChance + ' woundFailChance');
  completeFailurePct = 0;
  if (woundFailChance < 0.1) {
    woundFailChance = 0.1;
  }
  if (woundFailChance > 0.9) {
    woundFailChance = 0.9;
  }
  console.log(woundFailChance + ' woundFailChance after catch.');
  woundChance = 1 - woundFailChance;
  criticalWoundChance = 1 - (9 - luck) / 10;
  if (luck < 0) {
    criticalWoundChance = 0;
  }
  chanceToCriticalOnWound = 1 - (woundChance - criticalWoundChance);
  console.log(woundChance + ' woundChance');
}
function woundCalc() {
  for (let i = 0; i <= numOfHits; i++) {
    //let answer = 0;
    if (i === 0) {
      let answer = Math.pow(woundFailChance, numOfHits);
      let outputString =
        'There is a ' +
        (answer * 100).toPrecision(4) +
        '% chance of ' +
        i +
        ' wounds and ' +
        (numOfHits - i) +
        ' failures with ' +
        numOfHits +
        ' hits.';
      totalWoundPct += answer;
      completeFailurePct = answer * 100;
      averageHits += answer * i;
      console.log(outputString);
      woundCalcDiv.innerHTML += outputString + '<BR>';
      continue;
    }
    let woundAnswer = successFromTrials(numOfHits, i, woundChance);
    let outputString =
      '\n' +
      'There is a ' +
      (woundAnswer * 100).toPrecision(4) +
      '% chance of ' +
      i +
      ' wounds and ' +
      (numOfHits - i) +
      ' failures with ' +
      numOfHits +
      ' hits.';
    totalWoundPct += woundAnswer;
    averageWounds += woundAnswer * i;
    averageFailures += woundAnswer * (numOfHits - i);
    console.log(outputString);
    woundCalcDiv.innerHTML += outputString;
    let critAnswer = successFromTrials(numOfHits, i, criticalWoundChance);
    let critString =
      '\n' +
      'There is a ' +
      (critAnswer * 100).toPrecision(4) +
      '% chance of ' +
      i +
      ' critical wounds with ' +
      numOfHits +
      ' hits.';
    totalCritPct += critAnswer;
    averageCrits += critAnswer * i;
    woundCalcDiv.innerHTML += critString + '<BR>';
  }
  let totalPercentString =
    'Total percent: ' + (totalWoundPct * 100).toPrecision(4) + '%. <BR>';
  let woundOnceString =
    'There is a ' +
    (100 - completeFailurePct).toPrecision(4) +
    '% chance of wounding atleast once. ';
  let critOnceString =
    'There is a ' +
    (totalCritPct * 100).toPrecision(4) +
    '% chance of critically wounding atleast once. <BR>';
  let averageWoundString =
    'The average number of wounds is: ' + averageWounds.toPrecision(4) + '. ';
  let averageCritString =
    'The average number if crits is: ' + averageCrits.toPrecision(4) + '. ';
  let summaryString =
    totalPercentString +
    woundOnceString +
    critOnceString +
    averageWoundString +
    averageCritString;

  console.log(summaryString);
  woundCalcDiv.innerHTML += summaryString;
}
function factorial(n) {
  let answer = 1;
  if (n == 0 || n == 1) {
    return answer;
  } else {
    for (var i = n; i >= 1; i--) {
      answer = answer * i;
    }
    return answer;
  }
}
function combination(n, r) {
  //n!/r!(n-r)!
  answer = factorial(n) / (factorial(r) * factorial(n - r));
  return answer;
}
function successFromTrials(n, r, successChance) {
  //Probability of r success from n number of trials:
  let nCr = combination(n, r);
  let step1 = Math.pow(successChance, r);
  let step2 = 1 - successChance;
  let step3 = n - r;
  let step4 = Math.pow(step2, step3);
  let finalStep = nCr * step1 * step4;
  //let answer = nCr * Math.pow(hitChance,r) * Math.pow(1 - hitChance,n - r);
  return finalStep;
}
function hitCalc() {
  for (let i = 0; i <= numOfDice; i++) {
    //let answer = 0;
    if (i === 0) {
      let answer = Math.pow(missChance, numOfDice);
      let outputString =
        'There is a ' +
        (answer * 100).toPrecision(4) +
        '% chance of ' +
        i +
        ' hits with ' +
        numOfDice +
        ' dice.';
      totalHitPct += answer;
      completeMissPct = answer * 100;
      averageHits += answer * i;
      console.log(outputString);
      hitCalcDiv.innerHTML += outputString + '<BR>';
      continue;
    }
    let answer = successFromTrials(numOfDice, i, hitChance);
    let outputString =
      '\n' +
      'There is a ' +
      (answer * 100).toPrecision(4) +
      '% chance of ' +
      i +
      ' hits with ' +
      numOfDice +
      ' dice.';
    totalHitPct = totalHitPct + answer;
    averageHits += answer * i;
    console.log(outputString);
    hitCalcDiv.innerHTML += outputString + '<BR>';
  }
  let summaryString =
    'Total percent: ' +
    (totalHitPct * 100).toPrecision(4) +
    '%. <BR> There is a ' +
    (100 - completeMissPct).toPrecision(4) +
    '% chance of hitting atleast once. <BR> The average number of hits per attack is: ' +
    averageHits.toPrecision(4) +
    '.';
  console.log(summaryString);
  hitCalcDiv.innerHTML += summaryString;
  totalHitPct = 0;
}
