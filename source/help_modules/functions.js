/* numbers of elements on one page */
const defineElPerPage = () => {
  const screenWidth = document.documentElement.clientWidth;
  let numberOfPageElements;
  if (screenWidth > 800) {
    numberOfPageElements = 4;
  } else if (screenWidth < 800 && screenWidth > 400) {
    numberOfPageElements = 2;
  } else if (screenWidth < 400) {
    numberOfPageElements = 1;
  }
  return numberOfPageElements;
};

/* help function which change the params of element with content */
const changeHelper = (width, elWidth, mleft, mright, fontSize, radioMargin) => {
  const elementArr = document.querySelectorAll('.slide');
  const radioArr = document.querySelectorAll('label');
  for (let i = 0; i < elementArr.length; i += 1) {
    elementArr[i].style.width = `${width * elWidth * 0.9}px`;
    elementArr[i].style.marginLeft = `${width * mleft * 0.9}px`;
    elementArr[i].style.marginRight = `${width * mright * 0.9}px`;
  }
  for (let i = 0; i < radioArr.length; i += 1) {
    radioArr[i].style.fontSize = `${fontSize}rem`;
    radioArr[i].style.marginRight = `${radioMargin}vw`;
  }
};

/* define size params of element */
const changeElemWidth = (parentWidth) => {
  if (parentWidth > 800) {
    changeHelper(parentWidth, 0.23, 0.01, 0.01, 0.7, 2);
  } else if (parentWidth < 800 && parentWidth > 400) {
    changeHelper(parentWidth, 0.46, 0.02, 0.02, 0.5, 3);
  } else if (parentWidth < 400) {
    changeHelper(parentWidth, 0.9, 0.05, 0.05, 0.2, 4);
  }
};

/* the size of one page which depends of number of elements on the page */
const definePageWidth = (elCountPerPage) => {
  const elWidth = +getComputedStyle(document.querySelector('.slide')).width.slice(0, -2);
  const elMarginRight = +getComputedStyle(document.querySelector('.slide')).marginRight.slice(0, -2);
  const elMarginLeft = +getComputedStyle(document.querySelector('.slide')).marginLeft.slice(0, -2);
  const pageWidth = (elWidth + elMarginRight + elMarginLeft) * elCountPerPage;
  return pageWidth;
};

/* correct the value of data-attribute  -> the value of radio buttons */
const swipeButValue = (margin, pageWidth) => {
  if (Math.round(margin) <= 10) {
    const temp = Math.abs(Math.round(margin / pageWidth)) % 4;
    const val = Math.abs(Math.round(margin / pageWidth)) + 1;
    const el = document.querySelector(`[for=radio${temp + 1}]`);
    el.setAttribute('data-title', val);

    const currentRadio = document.getElementById(`radio${temp + 1}`);
    currentRadio.checked = 'checked';

    let prev = el.previousElementSibling;
    let next = el.nextElementSibling;
    let prevVal = val - 1;
    let nextVal = val + 1;
    while (next !== null) {
      if (next.localName === 'label') {
        next.setAttribute('data-title', nextVal);
        nextVal += 1;
      }
      next = next.nextElementSibling;
    }

    while (prev !== null) {
      if (prev.localName === 'label') {
        prev.setAttribute('data-title', prevVal);
        prevVal -= 1;
      }
      prev = prev.previousElementSibling;
    }
  }
};

/* correct position of elements on the page after resize event */
const correctMarginLeft = (prevStateElNumber) => {
  const elWidth = +getComputedStyle(document.querySelector('.slide')).width.slice(0, -2);
  const elMarginLeft = +getComputedStyle(document.querySelector('.slide')).marginLeft.slice(0, -2);
  const elMarginRight = +getComputedStyle(document.querySelector('.slide')).marginRight.slice(0, -2);
  const allElementWidth = elWidth + elMarginLeft + elMarginRight;
  const marginLeft = allElementWidth * prevStateElNumber;
  const images = document.querySelector('.images');
  images.style.marginLeft = `${-marginLeft}px`;
};

/* clean the selection of elements after swipe */
const cleanSelections = () => {
  const sel = window.getSelection ? window.getSelection() : document.selection;
  if (sel) {
    if (sel.removeAllRanges) {
      sel.removeAllRanges();
    } else if (sel.empty) {
      sel.empty();
    }
  }
};

module.exports = {
  changeElemWidth,
  correctMarginLeft,
  defineElPerPage,
  definePageWidth,
  swipeButValue,
  cleanSelections,
};
