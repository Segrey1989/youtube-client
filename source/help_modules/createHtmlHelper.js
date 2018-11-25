const req = require('./requestFunctions');

const helpFunc = require('./functions');

/* return array of elements in container with localName */
const getLabelElements = (elName, containerSelector) => {
  const array = [];
  const container = Array.from(document.querySelector(containerSelector).children);
  container.map((x) => {
    if (x.localName === elName) {
      array.push(x);
    }
    return x;
  });
  return array;
};

/* button value when user click on button */
const changeButtonsValue = (rNum) => {
  const array = getLabelElements('label', '.radioContainer');
  switch (rNum) {
    case 1:
      if (+array[0].getAttribute('data-title') > 3) {
        array.map((x) => {
          x.setAttribute('data-title', +x.getAttribute('data-title') - 3);
          return x;
        });
      }
      break;
    case 4:
      array.map((x) => {
        x.setAttribute('data-title', +x.getAttribute('data-title') + 3);
        return x;
      });
      break;
    default:
  }
};

/* slow the resize event */
function debounce(func, wait, immediate) {
  let timeout;
  return function f1(...rest) {
    const context = this;
    const args = rest;
    const later = function f2() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

/* logic of page behaviour after resize event */
const myEfficientFn = debounce(() => {
  if (!document.querySelector('.carousel') || document.querySelector('.error')) return;
  const pageWidth = helpFunc.definePageWidth(helpFunc.defineElPerPage());
  const marginLeft = +getComputedStyle(document.querySelector('.images')).marginLeft.slice(0, -2);
  const showenElemsNumber = Math.round(marginLeft / pageWidth) * -1 * helpFunc.defineElPerPage();
  helpFunc.changeElemWidth(document.documentElement.clientWidth);
  helpFunc.correctMarginLeft(showenElemsNumber);
  helpFunc.swipeButValue(marginLeft, pageWidth);
}, 200);

const timeToUpdateContent = (elPerPage, search, token) => {
  let currentRadio = Array.from(document.querySelectorAll('[type=radio]')).filter(x => x.checked === true)[0];
  currentRadio = currentRadio.id.replace('radio', '');
  const dataContent = document.querySelector(`.pseudo${currentRadio}`).getAttribute('data-title');

  switch (elPerPage) {
    case 4:
      if (dataContent % 2 === 0 || dataContent % 5 === 0) {
        req.appendMoreContent(search, token);
      }
      break;
    case 2:
      if (dataContent % 6 === 0) {
        req.appendMoreContent(search, token);
      }
      break;
    case 1:
      if (dataContent % 10 === 0) {
        req.appendMoreContent(search, token);
      }
      break;
    default:
  }
};

/* if swipe was done - install new marginLeft and depends of  new marginLeft
download new content */
const makeSwipe = (startPosition, endPosition, search, token) => {
  if (Math.abs(startPosition - endPosition) > 20) {
    const elPerPage = helpFunc.defineElPerPage();
    const divsContainer = document.querySelector('.images');
    const mLeft = +getComputedStyle(divsContainer).marginLeft.slice(0, -2);
    const pageWidth = helpFunc.definePageWidth(elPerPage);
    let newMargin;
    if (startPosition > endPosition) {
      newMargin = mLeft + pageWidth;
    } else {
      newMargin = mLeft - pageWidth;
    }

    timeToUpdateContent(elPerPage, search, token);
    helpFunc.swipeButValue(newMargin, pageWidth);

    if (newMargin > 0) newMargin = 0;
    divsContainer.style.marginLeft = `${newMargin}px`;
  }
};

/* for page swipe */
const mouseUp = (e, search, token, startPosition) => {
  const endPosition = e.pageX;
  makeSwipe(startPosition, endPosition, search, token);
};

/* begin of desktop swipe */
const mouseDown = e => e.pageX;

/* radioClick define elements on page when radioButton switch used */
const radioClick = (e, search, token) => {
  if (e.target.type !== 'radio') return;
  const elPerPage = helpFunc.defineElPerPage();
  const el = document.querySelector('.images');
  const radioNumber = +e.target.id.charAt(e.target.id.length - 1);
  const dataContent = document.querySelector(`.pseudo${radioNumber}`).getAttribute('data-title');
  const pageWidth = helpFunc.definePageWidth(elPerPage);
  const newMarginLeft = -pageWidth * (dataContent - 1);
  const radio1 = document.querySelector('#radio1');
  const radio4 = document.querySelector('#radio4');
  if (radioNumber === 1 && dataContent > 3) {
    radio1.checked = '';
    radio4.checked = 'checked';
  } else if (radioNumber === 4) {
    radio4.checked = '';
    radio1.checked = 'checked';
  }

  changeButtonsValue(radioNumber);
  timeToUpdateContent(elPerPage, search, token);

  el.style.marginLeft = `${newMarginLeft}px`;
};

const touchstart = (event) => {
  event.stopPropagation();
  const initialPoint = event.changedTouches[0];
  return initialPoint.pageX;
};

const touchend = (event, search, token, startPosition) => {
  event.stopPropagation();
  const endPosition = event.changedTouches[0].pageX;
  if (!document.querySelector('.error')) {
    makeSwipe(startPosition, endPosition, search, token);
  }
};

const touchLink = (event) => {
  event.preventDefault();
  if (event.target.localName === 'a') {
    const videoLink = document.querySelector('.videoName a').href;
    const otherWindow = window.open(videoLink, '_blank');
    otherWindow.opener = null;
    otherWindow.location = videoLink;
  }
};

module.exports = {
  radioClick,
  mouseDown,
  mouseUp,
  myEfficientFn,
  touchstart,
  touchend,
  touchLink,
};
