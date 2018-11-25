const reqFunc = require('./help_modules/requestFunctions');

const contentObj = require('./help_modules/createHtml');

const listeners = require('./help_modules/createHtmlHelper');

const helpFunc = require('./help_modules/functions');

/* Elements of Html which are immutable */
document.querySelector('html').width = document.body.clientWidth;
document.querySelector('html').height = document.body.clientHeight;
contentObj.createQueryInput();
const carousel = document.createElement('div');
carousel.classList.add('carousel');

const galery = document.createElement('div');
galery.classList.add('galery');

const radioContainer = document.createElement('div');
radioContainer.classList.add('radioContainer');

contentObj.createRadio(radioContainer, 4);
carousel.appendChild(galery);

const images = document.createElement('div');
images.classList.add('images');

const errorBox = document.createElement('div');
errorBox.classList.add('error');


/* when user make query end press enter */
const enterPressed = (e) => {
  const input = document.querySelector('.input');
  input.focus();
  if (e.keyCode !== 13 || !input.value) return;
  input.classList.remove('inputBegin');

  const radioArr = Array.from(document.querySelectorAll('[type=radio]'));
  let dataVal = 1;
  radioArr.map((x) => {
    const currentRadio = +x.id.replace('radio', '');
    document.querySelector(`.pseudo${currentRadio}`).setAttribute('data-title', dataVal);
    dataVal += 1;
    return x;
  });

  if (!document.querySelector('.carousel')) {
    document.body.appendChild(carousel);
  }
  if (document.querySelector('.radioContainer')) {
    carousel.removeChild(radioContainer);
  }
  if (document.querySelector('.error')) {
    document.body.removeChild(document.querySelector('.error'));
  }
  if (document.querySelector('.images')) {
    reqFunc.clearContent('.images');
  }

  const sw = document.documentElement.clientWidth;
  helpFunc.changeElemWidth(sw);

  const searchAdress = reqFunc.getSearchAdress(input);
  fetch(searchAdress)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then((data) => {
      if (data.items.length !== 0) {
        const responseInfo = reqFunc.getInfo(data);
        const adress = reqFunc.getStatisticsUrl(data);
        const allInfo = reqFunc.addStatisticInfo(responseInfo, adress);
        return allInfo;
      }
      throw new Error('There are no results');
    })
    .then(data => data)
    .then((data) => {
      galery.appendChild(images);
      carousel.appendChild(radioContainer);
      document.getElementById('radio1').checked = 'checked';
      const allInfo = data;
      reqFunc.addContent(allInfo);
      helpFunc.changeElemWidth(sw);
      input.value = '';

      document.querySelector('.radioContainer').addEventListener('click', (ev) => {
        helpFunc.changeElemWidth(document.documentElement.clientWidth);
        listeners.radioClick(ev, searchAdress, allInfo[0]);
      });
      let startPos = 0;
      document.querySelector('.galery').addEventListener('mousedown', (ev) => {
        helpFunc.changeElemWidth(document.documentElement.clientWidth);
        startPos = listeners.mouseDown(ev);
      });
      document.querySelector('.galery').addEventListener('mouseup', (ev) => {
        setTimeout(listeners.mouseUp(ev, searchAdress, allInfo[0], startPos), 300);
      });

      let initialPoint = 0;
      document.querySelector('.galery').addEventListener('touchstart', (ev) => {
        helpFunc.changeElemWidth(document.documentElement.clientWidth);
        initialPoint = listeners.touchstart(ev);
      });

      document.querySelector('.galery').addEventListener('touchend', (ev) => {
        listeners.touchend(ev, searchAdress, allInfo[0], initialPoint);
      });

      document.querySelector('.images').addEventListener('touchstart', (ev) => {
        listeners.touchLink(ev);
      }, false);

      window.addEventListener('resize', listeners.myEfficientFn);
    })
    .catch(() => {
      errorBox.textContent = 'There are no results for this query. Try once again...';
      document.body.appendChild(errorBox);
      input.value = '';
    });
};

document.addEventListener('keypress', enterPressed);
